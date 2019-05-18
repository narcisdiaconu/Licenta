import { IIntermediatePoint } from 'app/shared/model/routes/intermediate-point.model';

export interface IRoute {
    id?: number;
    title?: string;
    startStation?: number;
    endStation?: number;
    intermediatePoints?: IIntermediatePoint[];
}

export class Route implements IRoute {
    constructor(
        public id?: number,
        public title?: string,
        public startStation?: number,
        public endStation?: number,
        public intermediatePoints?: IIntermediatePoint[]
    ) {}
}
