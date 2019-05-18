import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { City } from './shared/model/stations/city.model';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

@Injectable({ providedIn: 'root' })
export class DataService {
    private data: BehaviorSubject<any> = new BehaviorSubject<any>({});
    private date: NgbDateStruct;

    constructor() {}

    getData() {
        return this.data.asObservable();
    }

    getMockedData() {
        this.date = { year: 2019, month: 4, day: 18 };
        return new BehaviorSubject<any>({
            route: {
                date: this.date,
                from: new City(951, 'Iasi'),
                to: new City(955, 'Piatra Neamt'),
                hour: '04:21'
            }
        }).asObservable();
    }

    updateData(data) {
        this.data.next(data);
    }

    resetData() {
        this.data = new BehaviorSubject<any>({});
    }
}
