import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { GatewaySharedModule } from 'app/shared';
import { RouteComponent, RouteDetailComponent, RouteUpdateComponent, RouteDeleteDialogComponent, routeRoute } from './';

const ENTITY_STATES = [...routeRoute];

@NgModule({
    imports: [GatewaySharedModule, RouterModule.forChild(ENTITY_STATES)],
    declarations: [RouteComponent, RouteDetailComponent, RouteUpdateComponent, RouteDeleteDialogComponent],
    entryComponents: [RouteComponent, RouteUpdateComponent, RouteDeleteDialogComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class RoutesRouteModule {}
