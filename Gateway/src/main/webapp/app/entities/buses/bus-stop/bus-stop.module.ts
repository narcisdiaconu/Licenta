import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { GatewaySharedModule } from 'app/shared';
import {
    BusStopComponent,
    BusStopDetailComponent,
    BusStopUpdateComponent,
    BusStopDeletePopupComponent,
    BusStopDeleteDialogComponent,
    busStopRoute,
    busStopPopupRoute
} from './';

const ENTITY_STATES = [...busStopRoute, ...busStopPopupRoute];

@NgModule({
    imports: [GatewaySharedModule, RouterModule.forChild(ENTITY_STATES)],
    declarations: [
        BusStopComponent,
        BusStopDetailComponent,
        BusStopUpdateComponent,
        BusStopDeleteDialogComponent,
        BusStopDeletePopupComponent
    ],
    entryComponents: [BusStopComponent, BusStopUpdateComponent, BusStopDeleteDialogComponent, BusStopDeletePopupComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class BusesBusStopModule {}
