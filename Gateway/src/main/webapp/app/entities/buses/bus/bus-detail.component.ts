import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IBus } from 'app/shared/model/buses/bus.model';

@Component({
    selector: 'jhi-bus-detail',
    templateUrl: './bus-detail.component.html'
})
export class BusDetailComponent implements OnInit {
    bus: IBus;

    constructor(protected activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ bus }) => {
            this.bus = bus;
        });
    }

    previousState() {
        window.history.back();
    }
}
