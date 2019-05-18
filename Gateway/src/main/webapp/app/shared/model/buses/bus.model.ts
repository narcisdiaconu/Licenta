import { IBusStop } from 'app/shared/model/buses/bus-stop.model';

export interface IBus {
    id?: number;
    route?: number;
    price?: number;
    totalPlaces?: number;
    departureTime?: string;
    arrivalTime?: string;
    days?: string;
    busStops?: IBusStop[];
}

export class Bus implements IBus {
    constructor(
        public id?: number,
        public route?: number,
        public price?: number,
        public totalPlaces?: number,
        public departureTime?: string,
        public arrivalTime?: string,
        public days?: string,
        public busStops?: IBusStop[]
    ) {}
}
