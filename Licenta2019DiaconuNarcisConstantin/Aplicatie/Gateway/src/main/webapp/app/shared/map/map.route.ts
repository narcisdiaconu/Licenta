import { ILeg } from './map.leg';
import { IGeometry } from './map.geojson';

export interface IMapRoute {
    distance: number;
    duration: number;
    geometry: IGeometry;
    legs: ILeg[];
}

export class MapRoute implements IMapRoute {
    constructor(public distance: number, public duration: number, public geometry: IGeometry, public legs: ILeg[]) {}
}
