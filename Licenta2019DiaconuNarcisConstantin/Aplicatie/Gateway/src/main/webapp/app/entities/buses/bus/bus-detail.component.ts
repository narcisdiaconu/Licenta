import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IBus } from 'app/shared/model/buses/bus.model';
import { RouteService } from 'app/entities/routes/route';
import { IRoute } from 'app/shared/model/routes/route.model';
import { HttpResponse } from '@angular/common/http';

@Component({
    selector: 'jhi-bus-detail',
    templateUrl: './bus-detail.component.html'
})
export class BusDetailComponent implements OnInit {
    bus: IBus;

    constructor(protected activatedRoute: ActivatedRoute, private routeService: RouteService) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ bus }) => {
            this.bus = bus;
            if (this.bus) {
                this.routeService.find(this.bus.route).subscribe((res: HttpResponse<IRoute>) => (this.bus.routeModel = res.body));
            }
        });
    }

    previousState() {
        window.history.back();
    }
}
