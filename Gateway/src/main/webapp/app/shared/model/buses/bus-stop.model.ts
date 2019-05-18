export interface IBusStop {
    id?: number;
    station?: number;
    arrivalTime?: string;
    departureTime?: string;
    price?: number;
    busId?: number;
}

export class BusStop implements IBusStop {
    constructor(
        public id?: number,
        public station?: number,
        public arrivalTime?: string,
        public departureTime?: string,
        public price?: number,
        public busId?: number
    ) {}
}
