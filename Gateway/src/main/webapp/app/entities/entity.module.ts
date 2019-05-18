import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: 'userdetails',
                loadChildren: './users/userdetails/userdetails.module#UsersUserdetailsModule'
            },
            {
                path: 'city',
                loadChildren: './stations/city/city.module#StationsCityModule'
            },
            {
                path: 'station',
                loadChildren: './stations/station/station.module#StationsStationModule'
            },
            {
                path: 'route',
                loadChildren: './routes/route/route.module#RoutesRouteModule'
            },
            {
                path: 'intermediate-point',
                loadChildren: './routes/intermediate-point/intermediate-point.module#RoutesIntermediatePointModule'
            },
            {
                path: 'bus',
                loadChildren: './buses/bus/bus.module#BusesBusModule'
            },
            {
                path: 'bus-stop',
                loadChildren: './buses/bus-stop/bus-stop.module#BusesBusStopModule'
            }
            /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
        ])
    ],
    declarations: [],
    entryComponents: [],
    providers: [],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class GatewayEntityModule {}
