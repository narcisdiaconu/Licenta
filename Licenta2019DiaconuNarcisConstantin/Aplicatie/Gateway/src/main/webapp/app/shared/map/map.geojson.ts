export interface IGeometry {
    type: string;
    coordinates: number[];
}

export interface IGeoJson {
    type: string;
    geometry: IGeometry;
    properties?: any;
    $key?: string;
}

export class GeoJson implements IGeoJson {
    type = 'Feature';
    geometry: IGeometry;

    constructor(coordinates, public properties?) {
        this.geometry = {
            type: 'LineString',
            coordinates
        };
    }
}

export class FeatureCollection {
    type = 'FeatureCollection';
    constructor(public feature: Array<GeoJson>) {}
}

export enum Profiles {
    DrivingTrafic = 'mapbox/driving-traffic',
    Driving = 'mapbox/driving',
    Walking = 'mapbox/walking',
    Cycling = 'mapbox/cycling'
}

export class Coordinate {
    constructor(public latitude: number, public longitude: number) {}
}
