import { MAPBOX_API_TOKEN } from '../../app.constants';
import { Injectable } from '@angular/core';

import * as mapboxgl from 'mapbox-gl';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Profiles, Coordinate } from './map.geojson';
import { Observable } from 'rxjs';
import { IMapRoute } from './map.route';
import { IDirection } from './map.directions';

type DirectionResponseType = HttpResponse<IDirection>;
type DirectionArrayResponseType = HttpResponse<IDirection[]>;

@Injectable({ providedIn: 'root' })
export class MapService {
    public resourceUrl = 'https://api.mapbox.com';

    constructor(protected http: HttpClient) {
        mapboxgl.accessToken = MAPBOX_API_TOKEN;
    }

    retrieveDirections(profile: Profiles, coordinates: Coordinate[]): Observable<DirectionResponseType> {
        const coords = this.covertCoordinatesToString(coordinates);
        return this.http.get<IDirection>(
            `${this.resourceUrl}/directions/v5/${profile}/${coords}?access_token=${MAPBOX_API_TOKEN}&overview=full&geometries=geojson`,
            { observe: 'response' }
        );
    }

    private covertCoordinatesToString(coordinates: Coordinate[]): String {
        let result = '';
        coordinates.forEach(coord => {
            result += coord.longitude + ',' + coord.latitude + ';';
        });
        return result.substring(0, result.length - 1);
    }
}
