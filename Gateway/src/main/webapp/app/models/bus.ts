import { IBus } from 'app/shared/model/buses/bus.model';
import { IRoute } from 'app/shared/model/routes/route.model';
import { IStation } from 'app/shared/model/stations/station.model';
import { TravelMode } from './travel-mode-enum';
import { IDirection } from 'app/shared/map/map.directions';

export class BusModel {
    public directions: IDirection;

    constructor(
        public bus: IBus,
        public route: IRoute,
        public start: IStation,
        public end: IStation,
        public date: Date,
        public type: TravelMode,
        public remainingSeats: number
    ) {}
}
