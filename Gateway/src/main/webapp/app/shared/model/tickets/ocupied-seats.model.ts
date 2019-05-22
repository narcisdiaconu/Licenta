import { Moment } from 'moment';

export interface IOcupiedSeats {
    bus: number;
    stops: number[];
    date: Moment;
    startStation: number;
    endStation: number;
}

export class OcupiedSeats implements IOcupiedSeats {
    constructor(public bus: number, public stops: number[], public date: Moment, public startStation: number, public endStation: number) {}
}
