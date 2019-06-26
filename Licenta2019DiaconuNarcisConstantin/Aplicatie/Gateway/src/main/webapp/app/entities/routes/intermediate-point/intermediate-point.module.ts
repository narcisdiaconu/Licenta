import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { GatewaySharedModule } from 'app/shared';
import {
    IntermediatePointComponent,
    IntermediatePointDetailComponent,
    IntermediatePointUpdateComponent,
    IntermediatePointDeletePopupComponent,
    IntermediatePointDeleteDialogComponent,
    intermediatePointRoute,
    intermediatePointPopupRoute
} from './';

const ENTITY_STATES = [...intermediatePointRoute, ...intermediatePointPopupRoute];

@NgModule({
    imports: [GatewaySharedModule, RouterModule.forChild(ENTITY_STATES)],
    declarations: [
        IntermediatePointComponent,
        IntermediatePointDetailComponent,
        IntermediatePointUpdateComponent,
        IntermediatePointDeleteDialogComponent,
        IntermediatePointDeletePopupComponent
    ],
    entryComponents: [
        IntermediatePointComponent,
        IntermediatePointUpdateComponent,
        IntermediatePointDeleteDialogComponent,
        IntermediatePointDeletePopupComponent
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class RoutesIntermediatePointModule {}
