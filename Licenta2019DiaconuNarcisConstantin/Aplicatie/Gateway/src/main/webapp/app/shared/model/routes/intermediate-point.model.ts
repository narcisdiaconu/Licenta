import { IStation } from '../stations/station.model';

export interface IIntermediatePoint {
    id?: number;
    index?: number;
    station?: number;
    routeId?: number;
    stationModel?: IStation;
}

export class IntermediatePoint implements IIntermediatePoint {
    constructor(public id?: number, public index?: number, public station?: number, public routeId?: number) {}
}
