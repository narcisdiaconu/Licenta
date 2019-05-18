import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { IBus } from 'app/shared/model/buses/bus.model';
import { BusService } from './bus.service';

@Component({
    selector: 'jhi-bus-update',
    templateUrl: './bus-update.component.html'
})
export class BusUpdateComponent implements OnInit {
    bus: IBus;
    isSaving: boolean;

    constructor(protected busService: BusService, protected activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ bus }) => {
            this.bus = bus;
        });
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

    protected subscribeToSaveResponse(result: Observable<HttpResponse<IBus>>) {
        result.subscribe((res: HttpResponse<IBus>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
    }

    protected onSaveSuccess() {
        this.isSaving = false;
        this.previousState();
    }

    protected onSaveError() {
        this.isSaving = false;
    }
}
