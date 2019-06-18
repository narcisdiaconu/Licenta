import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { GatewaySharedModule } from 'app/shared';
import { BusComponent, BusDetailComponent, BusUpdateComponent, BusDeleteDialogComponent, busRoute } from './';

const ENTITY_STATES = [...busRoute];

@NgModule({
    imports: [GatewaySharedModule, RouterModule.forChild(ENTITY_STATES)],
    declarations: [BusComponent, BusDetailComponent, BusUpdateComponent, BusDeleteDialogComponent],
    entryComponents: [BusComponent, BusUpdateComponent, BusDeleteDialogComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class BusesBusModule {}
