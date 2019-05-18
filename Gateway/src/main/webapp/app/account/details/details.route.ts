import { Route } from '@angular/router';

import { UserRouteAccessService } from 'app/core';
import { DetailsComponent } from './details.component';

export const detailsRoute: Route = {
    path: 'details',
    component: DetailsComponent,
    data: {
        authorities: ['ROLE_USER'],
        pageTitle: 'Details'
    },
    canActivate: [UserRouteAccessService]
};
