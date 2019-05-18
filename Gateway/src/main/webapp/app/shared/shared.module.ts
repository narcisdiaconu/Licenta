import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { NgbDateAdapter } from '@ng-bootstrap/ng-bootstrap';

import { NgbDateMomentAdapter } from './util/datepicker-adapter';
import { GatewaySharedLibsModule, GatewaySharedCommonModule, JhiLoginModalComponent, HasAnyAuthorityDirective } from './';
import { JhiMaterialModule } from 'app/app.angularmat.module';
import { MapComponent } from './map/map.component';

@NgModule({
    imports: [GatewaySharedLibsModule, GatewaySharedCommonModule, JhiMaterialModule],
    declarations: [JhiLoginModalComponent, HasAnyAuthorityDirective],
    providers: [{ provide: NgbDateAdapter, useClass: NgbDateMomentAdapter }],
    entryComponents: [JhiLoginModalComponent, MapComponent],
    exports: [GatewaySharedCommonModule, JhiLoginModalComponent, HasAnyAuthorityDirective, JhiMaterialModule],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class GatewaySharedModule {
    static forRoot() {
        return {
            ngModule: GatewaySharedModule
        };
    }
}
