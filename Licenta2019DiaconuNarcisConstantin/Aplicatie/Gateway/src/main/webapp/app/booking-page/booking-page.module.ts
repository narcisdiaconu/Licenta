import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { GatewaySharedModule } from 'app/shared';
import { BookingPageComponent } from './booking-page.component';
import { bookingPageRoute } from './booking-page.route';

@NgModule({
    imports: [RouterModule.forChild([bookingPageRoute]), GatewaySharedModule],
    declarations: [BookingPageComponent],
    entryComponents: [],
    providers: [],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class BookingPageModule {}
