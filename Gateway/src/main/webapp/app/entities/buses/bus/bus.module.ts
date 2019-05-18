import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { GatewaySharedModule } from 'app/shared';
import {
    BusComponent,
    BusDetailComponent,
    BusUpdateComponent,
    BusDeletePopupComponent,
    BusDeleteDialogComponent,
    busRoute,
    busPopupRoute
} from './';

const ENTITY_STATES = [...busRoute, ...busPopupRoute];

@NgModule({
    imports: [GatewaySharedModule, RouterModule.forChild(ENTITY_STATES)],
    declarations: [BusComponent, BusDetailComponent, BusUpdateComponent, BusDeleteDialogComponent, BusDeletePopupComponent],
    entryComponents: [BusComponent, BusUpdateComponent, BusDeleteDialogComponent, BusDeletePopupComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class BusesBusModule {}
