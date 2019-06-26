import { Coordinate } from 'app/shared/map/map.geojson';
import { TransitDetails } from './directions.transit-details';

export class DirectionStep {
    public distance: any;
    public duration: any;
    public start_location: Coordinate;
    public end_location: Coordinate;
    public transit_details: TransitDetails;
    public travel_mode: string;
}
