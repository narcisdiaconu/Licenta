import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NgbModalRef, NgbDateStruct, NgbDatepickerConfig, NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { LoginModalService, AccountService, Account } from 'app/core';
import { ICity } from 'app/shared/model/stations/city.model';
import { CityService } from 'app/entities/stations/city';
import { filter, map, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { DataService } from 'app/data.service';
import { Observable } from 'rxjs';

@Component({
    selector: 'jhi-home',
    templateUrl: './home.component.html',
    styleUrls: ['home.css']
})
export class HomeComponent implements OnInit {
    account: Account;
    modalRef: NgbModalRef;
    cities: ICity[];
    startCity: number;
    endCity: number;
    dateModel: NgbDateStruct;
    departureHour: NgbTimeStruct;
    arrivalHour: NgbTimeStruct;
    dateOptions: Date;
    view = 'Route';

    private data: any;

    search = (text: Observable<string>) =>
        text.pipe(
            debounceTime(200),
            distinctUntilChanged(),
            map(term => (term.length < 1 ? [] : this.cities.filter(c => c.name.toLowerCase().indexOf(term.toLowerCase()) > -1)))
        );

    formatter = (city: ICity) => city.name;

    constructor(
        private accountService: AccountService,
        private loginModalService: LoginModalService,
        private eventManager: JhiEventManager,
        private citiesService: CityService,
        private jhiAlertService: JhiAlertService,
        private router: Router,
        private dpConfig: NgbDatepickerConfig,
        private dataService: DataService
    ) {
        const today = new Date();
        this.dpConfig.minDate = { year: today.getFullYear(), month: today.getMonth() + 1, day: today.getDate() };
        this.dpConfig.maxDate = { year: today.getFullYear(), month: today.getMonth() + 4, day: today.getDate() };
        this.arrivalHour = { hour: today.getHours(), minute: today.getMinutes(), second: 0 };
        this.departureHour = { hour: today.getHours(), minute: today.getMinutes(), second: 0 };
    }

    ngOnInit() {
        this.accountService.identity().then((account: Account) => {
            this.account = account;
            this.getCities();
        });
        this.registerAuthenticationSuccess();
        this.dataService.getData().subscribe(data => (this.data = data));
    }

    private getCities() {
        this.citiesService
            .query()
            .pipe(
                filter((mayBeOk: HttpResponse<ICity[]>) => mayBeOk.ok),
                map((response: HttpResponse<ICity[]>) => response.body)
            )
            .subscribe((res: ICity[]) => (this.cities = res), (res: HttpErrorResponse) => this.onError(res.message));
    }

    protected onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }

    registerAuthenticationSuccess() {
        this.eventManager.subscribe('authenticationSuccess', message => {
            this.accountService.identity().then(account => {
                this.account = account;
                this.getCities();
            });
        });
    }

    isAuthenticated() {
        return this.accountService.isAuthenticated();
    }

    login() {
        this.modalRef = this.loginModalService.open();
    }

    toBuses() {
        this.data.route = {
            from: this.startCity,
            to: this.endCity,
            date: this.dateModel,
            hour: this.convertWithDoubleDigits(this.departureHour)
        };
        this.dataService.updateData(this.data);
        this.router.navigate(['/buses-page']);
    }

    convertWithDoubleDigits(time: NgbTimeStruct) {
        let result = '';
        if (time.hour < 10) {
            result += '0' + time.hour;
        } else {
            result += time.hour;
        }
        result += ':';
        if (time.minute < 10) {
            result += '0' + time.minute;
        } else {
            result += time.minute;
        }
        return result;
    }

    convertTimeToString(time: NgbTimeStruct) {
        return time.hour + ':' + time.minute;
    }

    changeView(view) {
        const selectedElement = document.getElementById(this.view);
        selectedElement.className = 'list-group-item';

        this.view = view;

        const newElement = document.getElementById(this.view);
        newElement.className = 'list-group-item active';
    }

    getView() {
        return this.view;
    }
}
