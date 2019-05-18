import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { GatewaySharedModule } from 'app/shared';
import {
    UserdetailsComponent,
    UserdetailsDetailComponent,
    UserdetailsUpdateComponent,
    UserdetailsDeletePopupComponent,
    UserdetailsDeleteDialogComponent,
    userdetailsRoute,
    userdetailsPopupRoute
} from './';

const ENTITY_STATES = [...userdetailsRoute, ...userdetailsPopupRoute];

@NgModule({
    imports: [GatewaySharedModule, RouterModule.forChild(ENTITY_STATES)],
    declarations: [
        UserdetailsComponent,
        UserdetailsDetailComponent,
        UserdetailsUpdateComponent,
        UserdetailsDeleteDialogComponent,
        UserdetailsDeletePopupComponent
    ],
    entryComponents: [UserdetailsComponent, UserdetailsUpdateComponent, UserdetailsDeleteDialogComponent, UserdetailsDeletePopupComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class UsersUserdetailsModule {}
