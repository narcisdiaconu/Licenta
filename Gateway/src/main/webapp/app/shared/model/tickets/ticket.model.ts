import { Moment } from 'moment';
import { IStation } from '../stations/station.model';
import { IBus } from '../buses/bus.model';

export interface ITicket {
    id?: number;
    user?: number;
    bus?: number;
    date?: Moment;
    places?: number;
    price?: number;
    paid?: boolean;
    startStation?: number;
    endStation?: number;
    startLocation?: IStation;
    endLocation?: IStation;
    busModel?: IBus;
}

export class Ticket implements ITicket {
    startLocation?: IStation;
    endLocation?: IStation;
    busModel?: IBus;

    constructor(
        public id?: number,
        public user?: number,
        public bus?: number,
        public date?: Moment,
        public places?: number,
        public price?: number,
        public paid?: boolean,
        public startStation?: number,
        public endStation?: number
    ) {
        this.paid = this.paid || false;
    }
}
