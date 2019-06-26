import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiAlertService } from 'ng-jhipster';
import { IBusStop } from 'app/shared/model/buses/bus-stop.model';
import { BusStopService } from './bus-stop.service';
import { IBus } from 'app/shared/model/buses/bus.model';
import { BusService } from 'app/entities/buses/bus';

@Component({
    selector: 'jhi-bus-stop-update',
    templateUrl: './bus-stop-update.component.html'
})
export class BusStopUpdateComponent implements OnInit {
    busStop: IBusStop;
    isSaving: boolean;

    buses: IBus[];

    constructor(
        protected jhiAlertService: JhiAlertService,
        protected busStopService: BusStopService,
        protected busService: BusService,
        protected activatedRoute: ActivatedRoute
    ) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ busStop }) => {
            this.busStop = busStop;
        });
        this.busService
            .query()
            .pipe(
                filter((mayBeOk: HttpResponse<IBus[]>) => mayBeOk.ok),
                map((response: HttpResponse<IBus[]>) => response.body)
            )
            .subscribe((res: IBus[]) => (this.buses = res), (res: HttpErrorResponse) => this.onError(res.message));
    }

    previousState() {
        window.history.back();
    }

    save() {
        this.isSaving = true;
        if (this.busStop.id !== undefined) {
            this.subscribeToSaveResponse(this.busStopService.update(this.busStop));
        } else {
            this.subscribeToSaveResponse(this.busStopService.create(this.busStop));
        }
    }

    protected subscribeToSaveResponse(result: Observable<HttpResponse<IBusStop>>) {
        result.subscribe((res: HttpResponse<IBusStop>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
    }

    protected onSaveSuccess() {
        this.isSaving = false;
        this.previousState();
    }

    protected onSaveError() {
        this.isSaving = false;
    }

    protected onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }

    trackBusById(index: number, item: IBus) {
        return item.id;
    }
}
