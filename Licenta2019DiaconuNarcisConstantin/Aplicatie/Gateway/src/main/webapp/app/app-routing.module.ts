import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { errorRoute, navbarRoute } from './layouts';
import { bussesPageRoute } from './buses-page';

const LAYOUT_ROUTES = [navbarRoute, ...errorRoute];

@NgModule({
    imports: [
        RouterModule.forRoot(
            [
                {
                    path: 'admin',
                    loadChildren: './admin/admin.module#GatewayAdminModule'
                },
                ...LAYOUT_ROUTES
            ],
            { useHash: true, enableTracing: true }
        )
    ],
    exports: [RouterModule]
})
export class GatewayAppRoutingModule {}
