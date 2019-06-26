import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IStation } from 'app/shared/model/stations/station.model';
import { CityService } from '../city';
import { HttpRequest, HttpResponse } from '@angular/common/http';
import { ICity } from 'app/shared/model/stations/city.model';

@Component({
    selector: 'jhi-station-detail',
    templateUrl: './station-detail.component.html'
})
export class StationDetailComponent implements OnInit {
    station: IStation;

    constructor(protected activatedRoute: ActivatedRoute, private citiesService: CityService) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ station }) => {
            this.station = station;
            this.citiesService.find(this.station.cityId).subscribe((res: HttpResponse<ICity>) => (this.station.city = res.body));
        });
    }

    previousState() {
        window.history.back();
    }
}
