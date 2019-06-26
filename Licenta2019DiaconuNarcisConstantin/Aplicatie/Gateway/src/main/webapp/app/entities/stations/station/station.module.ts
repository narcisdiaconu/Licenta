import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { GatewaySharedModule } from 'app/shared';
import { StationComponent, StationDetailComponent, StationUpdateComponent, StationDeleteDialogComponent, stationRoute } from './';

const ENTITY_STATES = [...stationRoute];

@NgModule({
    imports: [GatewaySharedModule, RouterModule.forChild(ENTITY_STATES)],
    declarations: [StationComponent, StationDetailComponent, StationUpdateComponent, StationDeleteDialogComponent],
    entryComponents: [StationComponent, StationUpdateComponent, StationDeleteDialogComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class StationsStationModule {}
