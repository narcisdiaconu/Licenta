import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { GatewaySharedModule } from 'app/shared';
import { RouterModule } from '@angular/router';
import { BusesPageComponent } from './buses-page.component';
import { bussesPageRoute } from './buses-page.route';

@NgModule({
    imports: [RouterModule.forChild([bussesPageRoute]), GatewaySharedModule],
    declarations: [BusesPageComponent],
    entryComponents: [],
    providers: [],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class BusesPageModule {}
