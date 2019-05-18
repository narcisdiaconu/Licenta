import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { ICity } from 'app/shared/model/stations/city.model';
import { CityService } from './city.service';

@Component({
    selector: 'jhi-city-update',
    templateUrl: './city-update.component.html'
})
export class CityUpdateComponent implements OnInit {
    city: ICity;
    isSaving: boolean;

    constructor(protected cityService: CityService, protected activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ city }) => {
            this.city = city;
        });
    }

    previousState() {
        window.history.back();
    }

    save() {
        this.isSaving = true;
        if (this.city.id !== undefined) {
            this.subscribeToSaveResponse(this.cityService.update(this.city));
        } else {
            this.subscribeToSaveResponse(this.cityService.create(this.city));
        }
    }

    protected subscribeToSaveResponse(result: Observable<HttpResponse<ICity>>) {
        result.subscribe((res: HttpResponse<ICity>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
    }

    protected onSaveSuccess() {
        this.isSaving = false;
        this.previousState();
    }

    protected onSaveError() {
        this.isSaving = false;
    }
}
