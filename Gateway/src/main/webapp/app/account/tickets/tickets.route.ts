import { Route } from '@angular/router';
import { MyTicketsComponent } from './tickets.component';
import { UserRouteAccessService } from 'app/core';

export const myTicketsRoute: Route = {
    path: 'my-tickets',
    component: MyTicketsComponent,
    data: {
        authorities: ['ROLE_USER'],
        pageTitle: 'Your tickets'
    },
    canActivate: [UserRouteAccessService]
};
