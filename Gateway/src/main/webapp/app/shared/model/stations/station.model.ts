import { ICity } from './city.model';

export interface IStation {
    id?: number;
    name?: string;
    address?: string;
    latitude?: number;
    longitude?: number;
    cityId?: number;
    city: ICity;
}

export class Station implements IStation {
    city: ICity;

    constructor(
        public id?: number,
        public name?: string,
        public address?: string,
        public latitude?: number,
        public longitude?: number,
        public cityId?: number
    ) {}
}
