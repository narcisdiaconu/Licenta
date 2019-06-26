import { IMapRoute } from './map.route';

export interface IDirection {
    code: string;
    routes: IMapRoute[];
    uuid: string;
    waypoints: any[];
}

export class Direction implements IDirection {
    constructor(public code: string, public routes: IMapRoute[], public uuid: string, public waypoints: any[]) {}
}
