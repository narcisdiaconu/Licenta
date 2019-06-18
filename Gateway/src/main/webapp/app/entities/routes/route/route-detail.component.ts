import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IRoute } from 'app/shared/model/routes/route.model';
import { StationService } from 'app/entities/stations/station';
import { IntermediatePointService } from '../intermediate-point';
import { HttpResponse } from '@angular/common/http';
import { IIntermediatePoint } from 'app/shared/model/routes/intermediate-point.model';
import { IStation } from 'app/shared/model/stations/station.model';

@Component({
    selector: 'jhi-route-detail',
    templateUrl: './route-detail.component.html'
})
export class RouteDetailComponent implements OnInit {
    route: IRoute;

    constructor(
        protected activatedRoute: ActivatedRoute,
        private stationsService: StationService,
        private intermediatePointService: IntermediatePointService
    ) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ route }) => {
            this.route = route;
            if (this.route) {
                this.loadStations(route);
                this.loadIntermediatePoints(this.route);
            }
        });
    }

    private loadStations(route: IRoute) {
        this.stationsService.find(route.startStation).subscribe((res: HttpResponse<IStation>) => (route.startLocation = res.body));
        this.stationsService.find(route.endStation).subscribe((res: HttpResponse<IStation>) => (route.endLocation = res.body));
    }

    private loadIntermediatePoints(route: IRoute) {
        this.intermediatePointService.getByRoute(route.id).subscribe((res: HttpResponse<IIntermediatePoint[]>) => {
            route.intermediatePoints = res.body;
            route.intermediatePoints.forEach(ip => this.loadStation(ip));
        });
    }

    private loadStation(ip: IIntermediatePoint) {
        this.stationsService.find(ip.station).subscribe((res: HttpResponse<IStation>) => (ip.stationModel = res.body));
    }

    previousState() {
        window.history.back();
    }
}
