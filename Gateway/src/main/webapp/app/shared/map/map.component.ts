import { Component, OnInit } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import { MapService } from './map.service';

@Component({
    selector: 'jhi-mapbox',
    templateUrl: './map.component.html',
    styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {
    map: mapboxgl.Map;
    style: 'mapbox://styles/mapbox/outdoors-v9';

    constructor(private mapboxService: MapService) {}

    ngOnInit() {
        setTimeout(this.initializeMap, 2000);
    }

    private initializeMap() {
        this.map = new mapboxgl.Map({
            container: 'mapbox',
            style: this.style,
            zoom: 13,
            center: [27.5855732, 47.1678665]
        });
    }
}
