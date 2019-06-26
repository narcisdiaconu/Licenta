import { BusesPageComponent } from './buses-page.component';
import { Route } from '@angular/router';

export const bussesPageRoute: Route = {
    path: 'buses-page',
    component: BusesPageComponent,
    data: {
        authorities: [],
        pageTitle: 'Buses'
    }
};
