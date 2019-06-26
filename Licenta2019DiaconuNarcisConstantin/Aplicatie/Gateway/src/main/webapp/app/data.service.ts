import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DataService {
    private data: BehaviorSubject<any> = new BehaviorSubject<any>({});

    constructor() {}

    getData() {
        return this.data.asObservable();
    }

    getMockedData() {
        const date = new Date(2019, 5, 5);
        return new BehaviorSubject<any>({
            route: {
                date,
                from: {
                    id: 2601,
                    name: 'Transbus Codreanu',
                    address: 'strada Garii',
                    latitude: 47.1668849,
                    longitude: 27.5698032,
                    cityId: 951,
                    city: {
                        id: 951,
                        name: 'Iasi'
                    }
                },
                to: {
                    id: 2606,
                    name: 'Autogara Minut',
                    address: 'strada Bistritei',
                    latitude: 46.9289631,
                    longitude: 26.3591117,
                    cityId: 955,
                    city: {
                        id: 955,
                        name: 'Piatra Neamt'
                    }
                },
                hour: '04:21'
            },
            buses: [
                {
                    bus: {
                        id: 951,
                        route: 952,
                        price: 30,
                        totalPlaces: 30,
                        departureTime: '08:00',
                        arrivalTime: '10:30',
                        days: '1111111',
                        busStops: [
                            {
                                id: 952,
                                station: 2607,
                                arrivalTime: '09:30',
                                departureTime: '09:30',
                                price: 20,
                                busId: 952
                            }
                        ]
                    },
                    route: {
                        id: 952,
                        title: 'Iasi - Piatra Neamt',
                        startStation: 2601,
                        endStation: 2606
                    },
                    start: {
                        id: 2601,
                        name: 'Transbus Codreanu',
                        address: 'strada Garii',
                        latitude: 47.1668849,
                        longitude: 27.5698032,
                        cityId: 951
                    },
                    end: {
                        id: 2606,
                        name: 'Autogara Minut',
                        address: 'strada Bistritei',
                        latitude: 46.9289631,
                        longitude: 26.3591117,
                        cityId: 955
                    },
                    date: '2019-05-18T21:00:00.000Z',
                    type: 'Bus'
                }
            ]
        }).asObservable();
    }

    updateData(data) {
        this.data.next(data);
    }

    resetData() {
        this.data = new BehaviorSubject<any>({});
    }
}
