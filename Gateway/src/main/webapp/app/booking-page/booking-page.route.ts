import { BookingPageComponent } from './booking-page.component';
import { Route } from '@angular/router';

export const bookingPageRoute: Route = {
    path: 'booking-page',
    component: BookingPageComponent,
    data: {
        authorities: ['ROLE_USER'],
        pageTitle: 'Booking'
    }
};
