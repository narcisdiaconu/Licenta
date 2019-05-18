export interface IStation {
    id?: number;
    name?: string;
    address?: string;
    latitude?: number;
    longitude?: number;
    cityId?: number;
}

export class Station implements IStation {
    constructor(
        public id?: number,
        public name?: string,
        public address?: string,
        public latitude?: number,
        public longitude?: number,
        public cityId?: number
    ) {}
}
