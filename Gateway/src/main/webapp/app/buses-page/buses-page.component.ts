import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { DataService } from 'app/data.service';
import { Router } from '@angular/router';
import { RouteService } from 'app/entities/routes/route';
import { BusService } from 'app/entities/buses/bus';
import { StationService } from 'app/entities/stations/station';
import { IStation } from 'app/shared/model/stations/station.model';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { IRoute } from 'app/shared/model/routes/route.model';
import { IBus } from 'app/shared/model/buses/bus.model';

import * as mapboxgl from 'mapbox-gl';
import { MapService } from 'app/shared';
import { BusModel } from 'app/models/bus';

import { TravelMode } from '../models/travel-mode-enum';
import { BusStopService } from 'app/entities/buses/bus-stop';
import { IBusStop } from 'app/shared/model/buses/bus-stop.model';
import { ICity } from 'app/shared/model/stations/city.model';
import { CityService } from 'app/entities/stations/city';
import { Coordinate, Profiles, GeoJson } from 'app/shared/map/map.geojson';
import { TicketService } from 'app/entities/tickets/ticket';
import { Location } from '@angular/common';
import { OptimalRoutesService } from 'app/optimal-routes.service';
import { IntermediatePointService } from 'app/entities/routes/intermediate-point';
import { IIntermediatePoint } from 'app/shared/model/routes/intermediate-point.model';

// @ts-ignore
import {} from 'googlemaps';

@Component({
    selector: 'jhi-buses-page',
    templateUrl: './buses-page.component.html',
    styleUrls: ['./buses-page.component.css']
})
export class BusesPageComponent implements OnInit {
    @ViewChild('googlemap') googlemapElement: any;
    data: any;
    showBusStops: boolean;
    lastBusId: string;
    showMapView: boolean;
    cannotGoToBooking = false;
    private allData: any = {};
    private requestSent = false;
    waitingForOptimal = false;
    loading: boolean;
    optimalRoutes: any[] = [];
    selectedRoute: any;
    map: google.maps.Map;
    displayedRoute: string;
    private displayedLegs: any[] = [];
    error: boolean;
    focusedLeg: any;
    waitingForBusesDirections: boolean;
    htmlInstructions: string;

    constructor(
        private dataService: DataService,
        private router: Router,
        private routeService: RouteService,
        private busService: BusService,
        private stationService: StationService,
        private mapService: MapService,
        private busStopService: BusStopService,
        private cityService: CityService,
        private ticketService: TicketService,
        private location: Location,
        private optimalRoutesService: OptimalRoutesService,
        private intermediatePointsService: IntermediatePointService
    ) {}

    ngOnInit() {
        this.loading = true;
        this.map = undefined;
        this.lastBusId = undefined;
        this.showMapView = false;
        this.showBusStops = false;
        this.error = false;
        this.dataService.getData().subscribe(data => {
            if (data.route === undefined) {
                this.router.navigate(['']);
            }
            this.data = data;
            this.loadAllData();
        });
    }

    private loadAllData(): void {
        this.loadAllCities();
        this.loadAllStations();
        this.loadAllRoutes();
        this.loadAllBuses();
    }

    private checkIfAllIsReady(): boolean {
        let ready = true;
        if (this.allData.cities === undefined) {
            return false;
        }
        if (this.allData.stations === undefined) {
            return false;
        }
        if (this.allData.routes === undefined) {
            return false;
        } else {
            this.allData.routes.forEach((route: IRoute) => {
                if (route.intermediatePoints === undefined) {
                    ready = false;
                }
            });
        }
        if (!ready) {
            return false;
        }
        if (this.allData.buses === undefined) {
            return false;
        } else {
            this.allData.buses.forEach((bus: IBus) => {
                if (bus.busStops === undefined) {
                    ready = false;
                }
            });
        }
        return ready;
    }

    private loadOptimalRoutes(): void {
        if (this.checkIfAllIsReady() && !this.requestSent) {
            this.requestSent = true;
            this.waitingForOptimal = true;
            this.loading = false;
            this.allData.startLocation = this.data.route.from;
            this.allData.endLocation = this.data.route.to;
            const date = new Date(this.data.route.date);
            date.setHours(this.data.route.hour.split(':')[0]);
            date.setMinutes(this.data.route.hour.split(':')[1]);
            this.allData.departureTime = date.getTime() / 1000;
            this.optimalRoutesService.get(this.allData).subscribe(
                (res: HttpResponse<any>) => {
                    this.optimalRoutes = res.body;
                    this.selectedRoute = res.body[0];
                    this.loadOccupiedSeats(this.selectedRoute);
                    this.waitingForOptimal = false;
                },
                (err: any) => {
                    this.waitingForOptimal = false;
                }
            );
        }
    }

    private loadAllCities() {
        this.cityService.query().subscribe(
            (res: HttpResponse<ICity[]>) => {
                this.allData.cities = res.body;
                this.loadOptimalRoutes();
            },
            err => (this.error = true)
        );
    }

    private loadAllStations() {
        this.stationService.query().subscribe(
            (res: HttpResponse<IStation[]>) => {
                this.allData.stations = res.body;
                this.loadOptimalRoutes();
            },
            err => (this.error = true)
        );
    }

    private loadAllRoutes() {
        this.routeService.query().subscribe(
            (res: HttpResponse<IRoute[]>) => {
                this.allData.routes = res.body;
                for (let i = 0; i < this.allData.routes.length; i++) {
                    this.allData.routes[i].intermediatePoints = undefined;
                }
                this.loadAllIntermediatePoints();
            },
            err => (this.error = true)
        );
    }

    private loadAllIntermediatePoints() {
        this.intermediatePointsService.query().subscribe(
            (res: HttpResponse<IIntermediatePoint[]>) => {
                res.body.forEach((ip: IIntermediatePoint) => {
                    for (let index = 0; index < this.allData.routes.length; index++) {
                        if (this.allData.routes[index].id === ip.routeId) {
                            if (this.allData.routes[index].intermediatePoints === undefined) {
                                this.allData.routes[index].intermediatePoints = [];
                            }
                            this.allData.routes[index].intermediatePoints.push(ip);
                            break;
                        }
                    }
                });
                this.allData.routes.forEach(route => {
                    if (route.intermediatePoints === undefined) {
                        route.intermediatePoints = [];
                    }
                });
                this.loadOptimalRoutes();
            },
            err => (this.error = true)
        );
    }

    private loadAllBuses() {
        this.busService.query().subscribe(
            (res: HttpResponse<IBus[]>) => {
                this.allData.buses = res.body;
                for (let i = 0; i < this.allData.buses.length; i++) {
                    this.allData.buses[i].busStops = undefined;
                }
                this.loadAllBusStops();
            },
            err => (this.error = true)
        );
    }

    private loadAllBusStops() {
        this.busStopService.query().subscribe(
            (res: HttpResponse<IBusStop[]>) => {
                res.body.forEach((bs: IBusStop) => {
                    for (let index = 0; index < this.allData.buses.length; index++) {
                        if (this.allData.buses[index].id === bs.busId) {
                            if (this.allData.buses[index].busStops === undefined) {
                                this.allData.buses[index].busStops = [];
                            }
                            this.allData.buses[index].busStops.push(bs);
                            break;
                        }
                    }
                });
                this.allData.buses.forEach((bus: IBus) => {
                    if (bus.busStops === undefined) {
                        bus.busStops = [];
                    }
                });
                this.loadOptimalRoutes();
            },
            err => (this.error = true)
        );
    }

    getDate(seconds: number): Date {
        const date = new Date();
        date.setTime(seconds * 1000);
        return date;
    }

    changeSelected(route) {
        const oldElement = document.getElementById(this.selectedRoute.summary.id);
        oldElement.removeAttribute('class');
        oldElement.className = 'list-group-item';
        this.lastBusId = this.selectedRoute.summary.id;

        if (route.occupied_seats === undefined) {
            route.occupied_seats = 0;
        }
        this.selectedRoute = route;
        const element = document.getElementById(route.summary.id);
        element.className = 'list-group-item selected';

        this.cannotGoToBooking = false;
        this.htmlInstructions = undefined;
        this.loadOccupiedSeats(route);
        this.displayRouteOnMap(route);
    }

    loadOccupiedSeats(route: any) {
        route.route.forEach(leg => {
            if (leg.type === 'INTERNAL') {
                this.routeService.find(leg.route_id).subscribe(
                    (r: HttpResponse<IRoute>) => {
                        this.busStopService.getByBus(leg.bus_id).subscribe(
                            (stops: HttpResponse<IBusStop[]>) => {
                                const points = [];
                                points.push(r.body.startStation);
                                stops.body.forEach(s => points.push(s.station));
                                points.push(r.body.endStation);
                                this.ticketService.ocupiedSeats(leg, points).subscribe((value: HttpResponse<number>) => {
                                    leg.empty_seats = leg.total_places - value.body;
                                });
                            },
                            err => (leg.empty_seats = 0)
                        );
                    },
                    err => (leg.empty_seats = 0)
                );
            }
        });
    }

    isFirstWalking(route: any): boolean {
        return route.steps[0].travel_mode === 'WALKING';
    }

    isLastWalking(route: any): boolean {
        return route.steps[route.steps.length - 1].travel_mode === 'WALKING';
    }

    availableBusesOnRoute(): boolean {
        return this.selectedRoute.route.filter(route => route.type === 'INTERNAL').length > 0;
    }

    convertToHummanReadable(time: string): string {
        const hour = parseInt(time.split(':')[0], 10);
        const minute = parseInt(time.split(':')[1], 10);
        let result = '';
        if (hour > 0) {
            result += hour.toString() + ' hour';
            if (hour > 1) {
                result += 's';
            }
            result += ' ';
        }
        if (minute > 0) {
            result += minute.toString() + ' minute';
            if (minute > 1) {
                result += 's';
            }
        }
        if (result === '') {
            result = '0';
        }
        return result;
    }

    computePrice(route): number {
        let total_price = 0;
        route.route.forEach(r => {
            if (r.price !== undefined) {
                total_price += r.price;
            }
        });
        return total_price;
    }

    checkIfAllAreInternal(route): boolean {
        let result = true;
        route.route.forEach(r => {
            if (r.type !== 'INTERNAL') {
                result = false;
                return result;
            }
        });
        return result;
    }

    enableMap(): void {
        this.showMapView = !this.showMapView;

        if (this.map === undefined) {
            this.initializeMap();
        } else {
            this.displayRouteOnMap(this.selectedRoute);
        }
    }

    private initializeMap() {
        this.map = new google.maps.Map(this.googlemapElement.nativeElement, {
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            zoom: 13,
            center: new google.maps.LatLng(47.1678665, 27.5855732)
        });
        this.displayRouteOnMap(this.selectedRoute);
    }

    private displayRouteOnMap(route) {
        if (this.showMapView !== true) {
            return;
        }
        this.loadInternalBusesDirections(route);
        if (this.waitingForBusesDirections) {
            return;
        }

        this.hideOldRoute(this.displayedRoute);

        if (this.showOldRoute(route.summary.id)) {
            this.displayedRoute = route.summary.id;
            return;
        }

        const newLeg = { id: route.summary.id, legs: [], bounds: {} };

        let index = 0;
        let startPosition = undefined;
        let last;
        let result;
        const bounds = new google.maps.LatLngBounds();
        route.route.forEach(r => {
            if (r.type === 'INTERNAL') {
                result = this.displayBusOnMap(r);
                result.id = index;
                index += 1;
                if (startPosition === undefined) {
                    startPosition = result;
                }
                newLeg.legs.push(result);
                last = result;
            } else if (r.type === 'EXTERNAL') {
                r.steps.forEach(step => {
                    if (step.travel_mode === 'WALKING') {
                        result = this.displayWalkOnMap(step);
                    } else if (step.travel_mode === 'TRANSIT') {
                        result = this.displayTransitOnMap(step);
                    }
                    result.id = index;
                    index += 1;
                    if (startPosition === undefined) {
                        startPosition = result;
                    }
                    newLeg.legs.push(result);
                    last = result;
                });
            }
        });
        bounds.extend(startPosition.startMarker.getPosition());
        bounds.extend(last.endMarker.getPosition());
        newLeg.bounds = bounds;
        startPosition.startMarker.setMap(this.map);
        last.endMarker.setMap(this.map);
        this.displayedRoute = route.summary.id;
        this.displayedLegs.push(newLeg);
        this.fitOnMap(bounds);
    }

    getDisplayedRouteLegs(): any[] {
        const leg = this.displayedLegs.find(l => l.id === this.displayedRoute);
        return leg !== undefined ? leg.legs : [];
    }

    private hideOldRoute(route) {
        this.displayedLegs.forEach(leg => {
            if (leg.id === route) {
                leg.legs.forEach(l => {
                    l.path.setMap(null);
                    l.startMarker.setMap(null);
                    l.endMarker.setMap(null);
                });
                return;
            }
        });
    }

    private showOldRoute(route) {
        let found = false;
        this.displayedLegs.forEach(leg => {
            if (leg.id === route) {
                let last;
                leg.legs.forEach(l => {
                    if (last === undefined) {
                        l.startMarker.setMap(this.map);
                    }
                    l.path.setMap(this.map);
                    last = l;
                });
                this.fitOnMap(leg.bounds);
                last.endMarker.setMap(this.map);
                found = true;
            }
        });
        return found;
    }

    private fitOnMap(bounds: google.maps.LatLngBounds) {
        this.map.fitBounds(bounds);
    }

    private displayBusOnMap(bus) {
        const path = new google.maps.Polyline({
            path: bus.directions,
            strokeColor: '#8218f4',
            map: this.map
        });
        const startMarker = new google.maps.Marker({
            position: {
                lat: bus.start_location.latitude,
                lng: bus.start_location.longitude
            },
            map: null,
            title: 'Start',
            label: 'A'
        });
        const endMarker = new google.maps.Marker({
            position: {
                lat: bus.end_location.latitude,
                lng: bus.end_location.longitude
            },
            map: null,
            title: 'End',
            label: 'B'
        });
        const name = 'Bus: ' + bus.start_location.name + ' - ' + bus.end_location.name;
        const bounds = new google.maps.LatLngBounds();
        bounds.extend(startMarker.getPosition());
        bounds.extend(endMarker.getPosition());
        return { path, startMarker, endMarker, name, bounds };
    }

    private displayWalkOnMap(walk) {
        const coords = google.maps.geometry.encoding.decodePath(walk.polyline.points);
        const path = new google.maps.Polyline({
            path: coords,
            strokeColor: '#8218f4',
            map: this.map
        });
        const startMarker = new google.maps.Marker({
            position: {
                lat: walk.start_location.latitude,
                lng: walk.start_location.longitude
            },
            map: null,
            title: 'Start',
            label: 'A'
        });
        const endMarker = new google.maps.Marker({
            position: {
                lat: walk.end_location.latitude,
                lng: walk.end_location.longitude
            },
            map: null,
            title: 'End',
            label: 'B'
        });
        const name = 'Walk: ' + walk.html_instructions;
        const bounds = new google.maps.LatLngBounds();
        coords.forEach(coord => bounds.extend(coord));
        const instructions = [];
        walk.steps.forEach(step => instructions.push(step.html_instructions));
        return { path, startMarker, endMarker, name, bounds, html_instructions: instructions };
    }

    private displayTransitOnMap(transit) {
        const coords = google.maps.geometry.encoding.decodePath(transit.polyline.points);
        const path = new google.maps.Polyline({
            path: coords,
            strokeColor: '#8218f4',
            map: this.map
        });
        const startMarker = new google.maps.Marker({
            position: {
                lat: transit.start_location.latitude,
                lng: transit.start_location.longitude
            },
            map: null,
            title: 'Start',
            label: 'A'
        });
        const endMarker = new google.maps.Marker({
            position: {
                lat: transit.end_location.latitude,
                lng: transit.end_location.longitude
            },
            map: null,
            title: 'End',
            label: 'B'
        });
        const name = transit.transit_details.line.vehicle.name + ': ' + transit.html_instructions;
        const bounds = new google.maps.LatLngBounds();
        coords.forEach(coord => bounds.extend(coord));
        return { path, startMarker, endMarker, name, bounds };
    }

    fitSelectedLeg() {
        if (this.focusedLeg === 'all') {
            this.fitOnMap(this.displayedLegs.find(leg => leg.id === this.selectedRoute.summary.id).bounds);
            this.showOldRoute(this.displayedRoute);
            this.htmlInstructions = undefined;
        } else {
            this.displayedLegs
                .find(leg => leg.id === this.selectedRoute.summary.id)
                .legs.forEach(leg => {
                    if (leg.id === this.focusedLeg) {
                        leg.path.setMap(this.map);
                        leg.startMarker.setMap(this.map);
                        leg.endMarker.setMap(this.map);
                        this.fitOnMap(leg.bounds);
                        this.htmlInstructions = leg.html_instructions;
                    } else {
                        leg.path.setMap(null);
                        leg.startMarker.setMap(null);
                        leg.endMarker.setMap(null);
                    }
                });
        }
    }

    private loadInternalBusesDirections(route) {
        const responses = [];
        let sended = 0;
        route.route.forEach(r => {
            if (r.type === 'INTERNAL') {
                if (r.directions === undefined) {
                    this.waitingForBusesDirections = true;
                    sended++;
                    const coordinates: Coordinate[] = [];
                    if (r.steps.length > 0) {
                        r.steps.forEach(step => {
                            coordinates.push({
                                latitude: step.start_location.latitude,
                                longitude: step.start_location.longitude
                            });
                            coordinates.push({
                                latitude: step.end_location.latitude,
                                longitude: step.end_location.longitude
                            });
                        });
                    } else {
                        coordinates.push({
                            latitude: r.start_location.latitude,
                            longitude: r.start_location.longitude
                        });
                        coordinates.push({
                            latitude: r.end_location.latitude,
                            longitude: r.end_location.longitude
                        });
                    }
                    this.mapService.retrieveDirections(Profiles.Driving, coordinates).subscribe(
                        (res: HttpResponse<any>) => {
                            const coords = [];
                            res.body.routes[0].geometry.coordinates.forEach(c => coords.push(new google.maps.LatLng(c[1], c[0])));
                            r.directions = coords;
                            responses.push(0);
                            if (responses.length === sended) {
                                this.waitingForBusesDirections = false;
                                this.displayRouteOnMap(route);
                            }
                        },
                        err => console.log(err)
                    );
                }
            }
        });
    }

    // Unused functions

    private getDirections(bus: BusModel) {
        const coordinates: Coordinate[] = [];
        coordinates.push(new Coordinate(bus.start.latitude, bus.start.longitude));
        coordinates.push(new Coordinate(bus.end.latitude, bus.end.longitude));

        this.mapService.retrieveDirections(Profiles.Driving, coordinates).subscribe((res: HttpResponse<any>) => {
            bus.directions = res.body;
        });
    }

    // Used functions

    toBooking(): void {
        const buses = this.extractBuses(this.selectedRoute);

        if (!this.checkIfBusIsAvailable(buses)) {
            this.cannotGoToBooking = true;
            return;
        }
        this.cannotGoToBooking = false;
        this.data.buses = buses;
        this.dataService.updateData(this.data);
        this.router.navigate(['/booking-page']);
    }

    private extractBuses(route) {
        const result = [];
        route.route.forEach(r => {
            if (r.type === 'INTERNAL') {
                result.push(r);
            }
        });
        return result;
    }

    toMain(): void {
        this.location.back();
    }

    private checkIfBusIsAvailable(bus): boolean {
        let result = true;

        bus.forEach(b => {
            const today = new Date();
            const date = new Date(b.departure_time.value * 1000);
            if (today.getTime() > date.getTime()) {
                result = false;
            }
        });
        return result;
    }
}
