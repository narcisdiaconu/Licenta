import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { IRoute } from 'app/shared/model/routes/route.model';
import { RouteService } from './route.service';
import { StationService } from 'app/entities/stations/station';
import { IStation } from 'app/shared/model/stations/station.model';
import { IntermediatePointService } from '../intermediate-point';
import { IIntermediatePoint, IntermediatePoint } from 'app/shared/model/routes/intermediate-point.model';

@Component({
    selector: 'jhi-route-update',
    templateUrl: './route-update.component.html'
})
export class RouteUpdateComponent implements OnInit {
    route: IRoute;
    isSaving: boolean;
    stations: IStation[];
    intermediatePoints: IIntermediatePoint[];
    responses: any[];
    removedPoints: IIntermediatePoint[];

    constructor(
        protected routeService: RouteService,
        protected activatedRoute: ActivatedRoute,
        private stationService: StationService,
        private ipService: IntermediatePointService
    ) {}

    ngOnInit() {
        this.isSaving = false;
        this.removedPoints = [];
        this.activatedRoute.data.subscribe(({ route }) => {
            this.route = route;
            if (route.id === undefined) {
                this.intermediatePoints = [];
            } else {
                this.ipService.getByRoute(this.route.id).subscribe((res: HttpResponse<IIntermediatePoint[]>) => {
                    this.intermediatePoints = res.body;
                    this.intermediatePoints.forEach(ip => this.loadStation(ip));
                });
            }
        });
        this.stationService.query().subscribe((res: HttpResponse<IStation[]>) => (this.stations = res.body));
    }

    private loadStation(ip: IIntermediatePoint) {
        this.stationService.find(ip.station).subscribe((res: HttpResponse<IStation>) => (ip.stationModel = res.body));
    }

    previousState() {
        window.history.back();
    }

    save() {
        this.isSaving = true;
        if (this.route.id !== undefined) {
            this.subscribeToSaveResponse(this.routeService.update(this.route));
        } else {
            this.subscribeToSaveResponse(this.routeService.create(this.route));
        }
    }

    protected subscribeToSaveResponse(result: Observable<HttpResponse<IRoute>>) {
        result.subscribe(
            (res: HttpResponse<IRoute>) => this.saveIntermediatePoints(res.body),
            (res: HttpErrorResponse) => this.onSaveError()
        );
    }

    private saveIntermediatePoints(route: IRoute) {
        this.responses = [];

        this.intermediatePoints.forEach((ip: IIntermediatePoint) => {
            ip.routeId = route.id;
            if (ip.id !== undefined) {
                this.ipService.update(ip).subscribe((res: HttpResponse<IIntermediatePoint>) => {
                    this.responses.push(res.body);
                    this.checkForLast();
                });
            } else {
                this.ipService.create(ip).subscribe((res: HttpResponse<IIntermediatePoint>) => {
                    this.responses.push(res.body);
                    this.checkForLast();
                });
            }
        });

        this.removedPoints.forEach((ip: IIntermediatePoint) => {
            this.ipService.delete(ip.id).subscribe((res: HttpResponse<IIntermediatePoint>) => {
                this.responses.push(res.body);
                this.checkForLast();
            });
        });
        this.checkForLast();
    }

    private checkForLast() {
        if (this.intermediatePoints.length + this.removedPoints.length === this.responses.length) {
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

    trackStationById(index: number, item: IStation) {
        return item.id;
    }

    addIntermediatePoint() {
        this.intermediatePoints.push({ index: this.intermediatePoints.length + 1 } as IIntermediatePoint);
    }

    removeIntermediatePoint(ip: IIntermediatePoint) {
        const index = this.intermediatePoints.indexOf(ip);
        for (let i = index; i < this.intermediatePoints.length; i++) {
            this.intermediatePoints[i].index -= 1;
        }
        this.intermediatePoints.splice(index, 1);
        if (ip.id !== undefined) {
            this.removedPoints.push(ip);
        }
    }
}
