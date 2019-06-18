import { IBusStop } from 'app/shared/model/buses/bus-stop.model';
import { IRoute } from '../routes/route.model';

export interface IBus {
    id?: number;
    route?: number;
    price?: number;
    totalPlaces?: number;
    departureTime?: string;
    arrivalTime?: string;
    days?: string;
    busStops?: IBusStop[];
    routeModel: IRoute;
}

export class Bus implements IBus {
    public routeModel: IRoute;

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
