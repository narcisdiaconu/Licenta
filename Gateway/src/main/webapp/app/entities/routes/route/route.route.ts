import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { JhiPaginationUtil, JhiResolvePagingParams } from 'ng-jhipster';
import { UserRouteAccessService } from 'app/core';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { Route } from 'app/shared/model/routes/route.model';
import { RouteService } from './route.service';
import { RouteComponent } from './route.component';
import { RouteDetailComponent } from './route-detail.component';
import { RouteUpdateComponent } from './route-update.component';
import { RouteDeletePopupComponent } from './route-delete-dialog.component';
import { IRoute } from 'app/shared/model/routes/route.model';

@Injectable({ providedIn: 'root' })
export class RouteResolve implements Resolve<IRoute> {
    constructor(private service: RouteService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IRoute> {
        const id = route.params['id'] ? route.params['id'] : null;
        if (id) {
            return this.service.find(id).pipe(
                filter((response: HttpResponse<Route>) => response.ok),
                map((res: HttpResponse<Route>) => res.body)
            );
        }
        return of(new Route());
    }
}

export const routeRoute: Routes = [
    {
        path: '',
        component: RouteComponent,
        resolve: {
            pagingParams: JhiResolvePagingParams
        },
        data: {
            authorities: ['ROLE_ADMIN'],
            defaultSort: 'id,asc',
            pageTitle: 'Routes'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: ':id/view',
        component: RouteDetailComponent,
        resolve: {
            route: RouteResolve
        },
        data: {
            authorities: ['ROLE_ADMIN'],
            pageTitle: 'Routes'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'new',
        component: RouteUpdateComponent,
        resolve: {
            route: RouteResolve
        },
        data: {
            authorities: ['ROLE_ADMIN'],
            pageTitle: 'Routes'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: ':id/edit',
        component: RouteUpdateComponent,
        resolve: {
            route: RouteResolve
        },
        data: {
            authorities: ['ROLE_ADMIN'],
            pageTitle: 'Routes'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const routePopupRoute: Routes = [
    {
        path: ':id/delete',
        component: RouteDeletePopupComponent,
        resolve: {
            route: RouteResolve
        },
        data: {
            authorities: ['ROLE_ADMIN'],
            pageTitle: 'Routes'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
