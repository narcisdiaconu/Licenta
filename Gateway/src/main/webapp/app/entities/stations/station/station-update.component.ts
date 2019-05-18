import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiAlertService } from 'ng-jhipster';
import { IStation } from 'app/shared/model/stations/station.model';
import { StationService } from './station.service';
import { ICity } from 'app/shared/model/stations/city.model';
import { CityService } from 'app/entities/stations/city';

@Component({
    selector: 'jhi-station-update',
    templateUrl: './station-update.component.html'
})
export class StationUpdateComponent implements OnInit {
    station: IStation;
    isSaving: boolean;

    cities: ICity[];

    constructor(
        protected jhiAlertService: JhiAlertService,
        protected stationService: StationService,
        protected cityService: CityService,
        protected activatedRoute: ActivatedRoute
    ) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ station }) => {
            this.station = station;
        });
        this.cityService
            .query()
            .pipe(
                filter((mayBeOk: HttpResponse<ICity[]>) => mayBeOk.ok),
                map((response: HttpResponse<ICity[]>) => response.body)
            )
            .subscribe((res: ICity[]) => (this.cities = res), (res: HttpErrorResponse) => this.onError(res.message));
    }

    previousState() {
        window.history.back();
    }

    save() {
        this.isSaving = true;
        if (this.station.id !== undefined) {
            this.subscribeToSaveResponse(this.stationService.update(this.station));
        } else {
            this.subscribeToSaveResponse(this.stationService.create(this.station));
        }
    }

    protected subscribeToSaveResponse(result: Observable<HttpResponse<IStation>>) {
        result.subscribe((res: HttpResponse<IStation>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
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

    trackCityById(index: number, item: ICity) {
        return item.id;
    }
}
