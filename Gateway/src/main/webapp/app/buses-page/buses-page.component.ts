import { Component, OnInit, OnDestroy } from '@angular/core';
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
import { IDirection } from 'app/shared/map/map.directions';

@Component({
    selector: 'jhi-buses-page',
    templateUrl: './buses-page.component.html',
    styleUrls: ['./buses-page.component.css']
})
export class BusesPageComponent implements OnInit {
    data: any;
    routes: IRoute[];
    stations: IStation[];
    cities: ICity[];
    buses: BusModel[];
    map: mapboxgl.Map;
    startLocation: string;
    endLocation: string;
    timeout: any;
    selectedBus: BusModel;
    showBusStops: boolean;
    showMapView: boolean;
    lastBusId: string;

    constructor(
        private dataService: DataService,
        private router: Router,
        private routeService: RouteService,
        private busService: BusService,
        private stationService: StationService,
        private mapService: MapService,
        private busStopService: BusStopService,
        private cityService: CityService
    ) {}

    ngOnInit() {
        this.map = undefined;
        this.lastBusId = undefined;
        this.showMapView = false;
        this.showBusStops = false;
        this.buses = [];
        this.dataService.getMockedData().subscribe(data => {
            if (data.route === undefined) {
                this.router.navigate(['']);
            }
            this.data = data;
            this.startLocation = this.data.route.from.name;
            this.endLocation = this.data.route.to.name;
            this.loadData();
        });
    }

    private initializeMap() {
        this.map = new mapboxgl.Map({
            container: 'mapbox',
            style: 'mapbox://styles/mapbox/outdoors-v9',
            zoom: 13,
            center: [27.5855732, 47.1678665]
        });

        this.map.on('load', () => {
            this.getDirections(this.selectedBus);
        });
    }

    loadData() {
        this.findStation();
        this.loadCities();
    }

    private findStation() {
        this.stationService.query().subscribe(
            (res: HttpResponse<IStation[]>) => {
                let start, end;
                this.stations = res.body;
                res.body.forEach(station => {
                    if (station.cityId === this.data.route.from.id) {
                        start = station;
                    }
                    if (station.cityId === this.data.route.to.id) {
                        end = station;
                    }
                });

                // Call to get routes on selected station.
                this.getRoutes(start, end);
            },
            (res: HttpErrorResponse) => console.log(res)
        );
    }

    private getRoutes(startStation, endStation) {
        this.routeService.findByStartAndEnd(startStation.id, endStation.id).subscribe((res: HttpResponse<IRoute[]>) => {
            this.routes = res.body;

            // Call to get all buses for selected route.
            this.routes.forEach(route => {
                const data = {
                    startStation,
                    endStation,
                    route
                };
                this.getBuses(data);
            });
        });
    }

    private getBuses(data) {
        this.busService.getByRoute(data.route.id).subscribe((res: HttpResponse<IBus[]>) => {
            // const date = new Date(this.data.route.date);
            const date = new Date(this.data.route.date.year, this.data.route.date.month, this.data.route.date.day);
            let day = date.getDay();
            if (day === 0) {
                day = 7;
            }

            const buses = this.filterByDate(
                res.body.filter(bus => {
                    return bus.route === data.route.id && bus.departureTime >= this.data.route.hour;
                }),
                day
            );
            buses.forEach(bus => {
                this.buses.push(new BusModel(bus, data.route, data.startStation, data.endStation, date, TravelMode.Bus, 10));
                this.buses.sort((bus1, bus2) => {
                    if (bus1.bus.departureTime < bus2.bus.departureTime) {
                        return -1;
                    } else if (bus1.bus.departureTime > bus2.bus.departureTime) {
                        return 1;
                    }
                    return 0;
                });
            });
            this.selectedBus = this.buses[0];
            this.loadIntermediateStops(this.selectedBus);
        });
    }

    private filterByDate(buses: IBus[], day: number) {
        return buses.filter(bus => {
            return bus.days.charAt(day - 1) === '1';
        });
    }

    private loadCities() {
        this.cityService.query().subscribe((res: HttpResponse<ICity[]>) => {
            this.cities = res.body;
        });
    }

    getTotalTime(bus: IBus) {
        const arrival = bus.arrivalTime.split(':');
        const departure = bus.departureTime.split(':');

        let resultHour = parseInt(arrival[0], 10) - parseInt(departure[0], 10);
        let resultMinute = parseInt(arrival[1], 10) - parseInt(departure[1], 10);

        if (resultMinute < 0) {
            resultHour -= 1;
            resultMinute = 60 + resultMinute;
        }
        return resultHour + ':' + resultMinute;
    }

    changeSelected(bus: BusModel) {
        const oldElement = document.getElementById(this.selectedBus.bus.id.toString());
        oldElement.removeAttribute('class');
        oldElement.className = 'list-group-item';
        this.lastBusId = this.selectedBus.bus.id.toString();

        this.selectedBus = bus;
        const element = document.getElementById(bus.bus.id.toString());
        element.className = 'list-group-item selected';

        this.loadIntermediateStops(bus);
        this.drawDirectionOnMap(bus);
    }

    private getDirections(bus: BusModel) {
        const coordinates: Coordinate[] = [];
        coordinates.push(new Coordinate(bus.start.latitude, bus.start.longitude));
        if (bus.bus.busStops !== undefined) {
            bus.bus.busStops.forEach(stop => {
                const station = this.getStationById(stop.station);
                coordinates.push(new Coordinate(station.latitude, station.longitude));
            });
        }
        coordinates.push(new Coordinate(bus.end.latitude, bus.end.longitude));

        this.mapService.retrieveDirections(Profiles.Driving, coordinates).subscribe((res: HttpResponse<any>) => {
            bus.directions = res.body;
            this.updateBusInList(bus);
            this.drawDirectionOnMap(bus);
        });
    }

    private updateBusInList(bus: BusModel) {
        const index = this.buses.findIndex((b: BusModel) => {
            if (b.bus.id === bus.bus.id) {
                return true;
            }
            return false;
        });
        if (index === -1) {
            return;
        }
        this.buses[index] = bus;
        if (this.selectedBus.bus.id === bus.bus.id) {
            this.selectedBus = bus;
        }
    }

    private loadIntermediateStops(bus: BusModel): void {
        if (bus.bus.busStops !== undefined) {
            return;
        }

        this.busStopService.getByBus(bus.bus.id).subscribe((res: HttpResponse<IBusStop[]>) => {
            bus.bus.busStops = res.body;
            this.updateBusInList(bus);
            this.getDirections(bus);
        });
    }

    getStationById(id: number): IStation {
        return this.stations.find((station: IStation) => {
            if (station.id === id) {
                return true;
            }
            return false;
        });
    }

    getCityByStation(id: number): ICity {
        const cityId = this.getStationById(id).cityId;

        return this.cities.find((city: ICity) => {
            if (city.id === cityId) {
                return true;
            }
            return false;
        });
    }

    enableMap() {
        this.showMapView = !this.showMapView;

        if (this.map === undefined) {
            this.initializeMap();
        } else {
            if (this.selectedBus.directions === undefined) {
                this.getDirections(this.selectedBus);
            } else {
                this.drawDirectionOnMap();
            }
        }
    }

    private drawDirectionOnMap(bus: BusModel) {
        if (!this.showMapView) {
            return;
        }
        if (this.lastBusId !== undefined) {
            this.map.setLayoutProperty(this.lastBusId, 'visibility', 'none');
        }

        if (bus.directions === undefined) {
            return;
        }
        if (this.map.getLayer(this.selectedBus.bus.id.toString())) {
            this.map.setLayoutProperty(this.selectedBus.bus.id.toString(), 'visibility', 'visible');
            return;
        }
        const geojson = new GeoJson(bus.directions.routes[0].geometry.coordinates, {});
        this.map.addLayer({
            id: bus.bus.id.toString(),
            type: 'line',
            source: {
                type: 'geojson',
                data: {
                    type: 'Feature',
                    properties: {},
                    geometry: {
                        type: 'LineString',
                        coordinates: geojson.geometry.coordinates
                    }
                }
            },
            layout: {
                'line-join': 'round',
                'line-cap': 'round'
            },
            paint: {
                'line-color': '#8218f4',
                'line-width': 8
            }
        });

        this.map.flyTo({
            center: geojson.geometry.coordinates[0],
            zoom: 8
        });
    }
}
