import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { IBus } from 'app/shared/model/buses/bus.model';
import { BusService } from './bus.service';
import { RouteService } from 'app/entities/routes/route';
import { StationService } from 'app/entities/stations/station';
import { IRoute } from 'app/shared/model/routes/route.model';
import { IStation } from 'app/shared/model/stations/station.model';
import { BusStopService } from '../bus-stop';
import { IBusStop } from 'app/shared/model/buses/bus-stop.model';
import { IntermediatePointService } from 'app/entities/routes/intermediate-point';
import { IIntermediatePoint } from 'app/shared/model/routes/intermediate-point.model';

@Component({
    selector: 'jhi-bus-update',
    templateUrl: './bus-update.component.html'
})
export class BusUpdateComponent implements OnInit {
    bus: IBus;
    isSaving: boolean;
    routes: IRoute[];
    initialRoute: number;
    busStops: IBusStop[];
    responses: any[];
    totalLength: number;

    constructor(
        protected busService: BusService,
        protected activatedRoute: ActivatedRoute,
        private routeService: RouteService,
        private stationService: StationService,
        private busStopService: BusStopService,
        private ipService: IntermediatePointService
    ) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ bus }) => {
            this.bus = bus;
            if (this.bus.id !== undefined) {
                this.initialRoute = this.bus.route;
                this.routeService.find(this.bus.route).subscribe((res: HttpResponse<IRoute>) => {
                    this.bus.routeModel = res.body;
                    this.loadStations(this.bus.routeModel);
                    this.loadStops(this.bus);
                });
            }
        });
        this.loadRoutes();
    }

    previousState() {
        window.history.back();
    }

    save() {
        this.isSaving = true;
        if (this.bus.id !== undefined) {
            this.subscribeToSaveResponse(this.busService.update(this.bus));
        } else {
            this.subscribeToSaveResponse(this.busService.create(this.bus));
        }
    }

    trackRouteById(index: number, item: IStation) {
        return item.id;
    }

    updateStops(event) {
        const id = parseInt(event.target.value.split(':')[1], 10);
        const route = this.routes.find(r => r.id === id);
        this.bus.routeModel = route;
        if (id === this.initialRoute) {
            this.busStops = this.bus.busStops;
        } else {
            this.busStops = [];
            route.intermediatePoints.forEach(ip => {
                this.busStops.push({ station: ip.station, stationModel: ip.stationModel, busId: this.bus.id } as IBusStop);
            });
        }
    }

    protected subscribeToSaveResponse(result: Observable<HttpResponse<IBus>>) {
        result.subscribe((res: HttpResponse<IBus>) => this.saveSteps(res.body), (res: HttpErrorResponse) => this.onSaveError());
    }

    protected saveSteps(bus: IBus) {
        this.responses = [];
        this.totalLength = this.busStops.length;

        if (bus.route !== this.initialRoute) {
            this.totalLength += this.bus.busStops.length;
            this.bus.busStops.forEach(stop =>
                this.busStopService.delete(stop.id).subscribe((res: HttpResponse<IBusStop>) => {
                    this.responses.push(0);
                    this.checkForFinal();
                })
            );
        }

        this.busStops.forEach(stop => {
            stop.busId = bus.id;
            if (stop.id === undefined) {
                this.busStopService.create(stop).subscribe((res: HttpResponse<IBusStop>) => {
                    this.responses.push(0);
                    this.checkForFinal();
                });
            } else {
                this.busStopService.update(stop).subscribe((res: HttpResponse<IBusStop>) => {
                    this.responses.push(0);
                    this.checkForFinal();
                });
            }
        });
    }

    protected checkForFinal() {
        if (this.responses.length === this.totalLength) {
            this.onSaveSuccess();
        }
    }

    protected onSaveSuccess() {
        this.isSaving = false;
        this.previousState();
    }

    protected onSaveError() {
        this.isSaving = false;
    }

    private loadStations(route: IRoute) {
        this.stationService.find(route.startStation).subscribe((res: HttpResponse<IStation>) => (route.startLocation = res.body));
        this.stationService.find(route.endStation).subscribe((res: HttpResponse<IStation>) => (route.endLocation = res.body));
    }

    private loadStops(bus: IBus) {
        this.busStopService.getByBus(bus.id).subscribe((res: HttpResponse<IBusStop[]>) => {
            this.bus.busStops = res.body;
            this.busStops = res.body;
            this.busStops.forEach(stop => this.loadStation(stop));
        });
    }

    private loadStation(item) {
        this.stationService.find(item.station).subscribe((res: HttpResponse<IStation>) => (item.stationModel = res.body));
    }

    private loadRoutes() {
        this.routeService.query().subscribe((res: HttpResponse<IRoute[]>) => {
            this.routes = res.body;
            this.routes.forEach(route => {
                this.loadIntemediate(route);
                this.loadStations(route);
            });
        });
    }

    private loadIntemediate(route: IRoute) {
        this.ipService.getByRoute(route.id).subscribe((res: HttpResponse<IIntermediatePoint[]>) => {
            route.intermediatePoints = res.body;
            route.intermediatePoints.forEach(ip => this.loadStation(ip));
        });
    }
}
