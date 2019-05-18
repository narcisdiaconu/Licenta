import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IBusStop } from 'app/shared/model/buses/bus-stop.model';

@Component({
    selector: 'jhi-bus-stop-detail',
    templateUrl: './bus-stop-detail.component.html'
})
export class BusStopDetailComponent implements OnInit {
    busStop: IBusStop;

    constructor(protected activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ busStop }) => {
            this.busStop = busStop;
        });
    }

    previousState() {
        window.history.back();
    }
}
