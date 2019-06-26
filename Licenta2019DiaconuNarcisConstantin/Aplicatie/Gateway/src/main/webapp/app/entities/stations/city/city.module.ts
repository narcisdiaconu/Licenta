import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { GatewaySharedModule } from 'app/shared';
import { CityComponent, CityDetailComponent, CityUpdateComponent, CityDeleteDialogComponent, cityRoute } from './';

const ENTITY_STATES = [...cityRoute];

@NgModule({
    imports: [GatewaySharedModule, RouterModule.forChild(ENTITY_STATES)],
    declarations: [CityComponent, CityDetailComponent, CityUpdateComponent, CityDeleteDialogComponent],
    entryComponents: [CityComponent, CityUpdateComponent, CityDeleteDialogComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class StationsCityModule {}
