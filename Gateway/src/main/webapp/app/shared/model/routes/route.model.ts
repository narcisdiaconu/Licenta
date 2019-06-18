import { IIntermediatePoint } from 'app/shared/model/routes/intermediate-point.model';
import { IStation } from '../stations/station.model';

export interface IRoute {
    id?: number;
    title?: string;
    startStation?: number;
    endStation?: number;
    intermediatePoints?: IIntermediatePoint[];
    startLocation?: IStation;
    endLocation?: IStation;
}

export class Route implements IRoute {
    startLocation?: IStation;
    endLocation?: IStation;

    constructor(
        public id?: number,
        public title?: string,
        public startStation?: number,
        public endStation?: number,
        public intermediatePoints?: IIntermediatePoint[]
    ) {}
}
