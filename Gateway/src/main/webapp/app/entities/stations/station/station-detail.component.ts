import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IStation } from 'app/shared/model/stations/station.model';

@Component({
    selector: 'jhi-station-detail',
    templateUrl: './station-detail.component.html'
})
export class StationDetailComponent implements OnInit {
    station: IStation;

    constructor(protected activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ station }) => {
            this.station = station;
        });
    }

    previousState() {
        window.history.back();
    }
}
