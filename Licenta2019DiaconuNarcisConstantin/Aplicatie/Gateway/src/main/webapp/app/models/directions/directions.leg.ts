import { Coordinate } from 'app/shared/map/map.geojson';
import { DirectionStep } from './directions.step';

export class DirectionsLeg {
    public arrival_time: any;
    public departure_time: any;
    public distance: any;
    public duration: any;
    public end_location: Coordinate;
    public start_location: Coordinate;
    public steps: DirectionStep[];
}
