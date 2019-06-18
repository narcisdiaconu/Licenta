import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { NgbDateAdapter } from '@ng-bootstrap/ng-bootstrap';

import { NgbDateMomentAdapter } from './util/datepicker-adapter';
import { GatewaySharedLibsModule, GatewaySharedCommonModule, JhiLoginModalComponent, HasAnyAuthorityDirective } from './';
import { JhiMaterialModule } from 'app/app.angularmat.module';
import { BookingConfirmationModalComponent } from 'app/booking-page/booking-confirmation';

@NgModule({
    imports: [GatewaySharedLibsModule, GatewaySharedCommonModule, JhiMaterialModule],
    declarations: [JhiLoginModalComponent, HasAnyAuthorityDirective, BookingConfirmationModalComponent],
    providers: [{ provide: NgbDateAdapter, useClass: NgbDateMomentAdapter }],
    entryComponents: [JhiLoginModalComponent, BookingConfirmationModalComponent],
    exports: [
        GatewaySharedCommonModule,
        JhiLoginModalComponent,
        HasAnyAuthorityDirective,
        JhiMaterialModule,
        BookingConfirmationModalComponent
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
