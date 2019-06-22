import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { NgbDateAdapter } from '@ng-bootstrap/ng-bootstrap';

import { NgbDateMomentAdapter } from './util/datepicker-adapter';
import { GatewaySharedLibsModule, GatewaySharedCommonModule, JhiLoginModalComponent, HasAnyAuthorityDirective } from './';
import { JhiMaterialModule } from 'app/app.angularmat.module';
import { BookingConfirmationModalComponent } from 'app/booking-page/booking-confirmation';
import { TicketRemoveModalComponent } from 'app/account/tickets/tickets-remove.modal';

@NgModule({
    imports: [GatewaySharedLibsModule, GatewaySharedCommonModule, JhiMaterialModule],
    declarations: [JhiLoginModalComponent, HasAnyAuthorityDirective, BookingConfirmationModalComponent, TicketRemoveModalComponent],
    providers: [{ provide: NgbDateAdapter, useClass: NgbDateMomentAdapter }],
    entryComponents: [JhiLoginModalComponent, BookingConfirmationModalComponent, TicketRemoveModalComponent],
    exports: [
        GatewaySharedCommonModule,
        JhiLoginModalComponent,
        HasAnyAuthorityDirective,
        JhiMaterialModule,
        BookingConfirmationModalComponent,
        TicketRemoveModalComponent
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class GatewaySharedModule {
    static forRoot() {
        return {
            ngModule: GatewaySharedModule
        };
    }
}
