export interface IIntermediatePoint {
    id?: number;
    index?: number;
    station?: number;
    routeId?: number;
}

export class IntermediatePoint implements IIntermediatePoint {
    constructor(public id?: number, public index?: number, public station?: number, public routeId?: number) {}
}
