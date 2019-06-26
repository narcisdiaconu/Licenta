import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { JhiPaginationUtil, JhiResolvePagingParams } from 'ng-jhipster';
import { UserRouteAccessService } from 'app/core';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { BusStop } from 'app/shared/model/buses/bus-stop.model';
import { BusStopService } from './bus-stop.service';
import { BusStopComponent } from './bus-stop.component';
import { BusStopDetailComponent } from './bus-stop-detail.component';
import { BusStopUpdateComponent } from './bus-stop-update.component';
import { BusStopDeletePopupComponent } from './bus-stop-delete-dialog.component';
import { IBusStop } from 'app/shared/model/buses/bus-stop.model';

@Injectable({ providedIn: 'root' })
export class BusStopResolve implements Resolve<IBusStop> {
    constructor(private service: BusStopService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IBusStop> {
        const id = route.params['id'] ? route.params['id'] : null;
        if (id) {
            return this.service.find(id).pipe(
                filter((response: HttpResponse<BusStop>) => response.ok),
                map((busStop: HttpResponse<BusStop>) => busStop.body)
            );
        }
        return of(new BusStop());
    }
}

export const busStopRoute: Routes = [
    {
        path: '',
        component: BusStopComponent,
        resolve: {
            pagingParams: JhiResolvePagingParams
        },
        data: {
            authorities: ['ROLE_ADMIN'],
            defaultSort: 'id,asc',
            pageTitle: 'BusStops'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: ':id/view',
        component: BusStopDetailComponent,
        resolve: {
            busStop: BusStopResolve
        },
        data: {
            authorities: ['ROLE_ADMIN'],
            pageTitle: 'BusStops'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'new',
        component: BusStopUpdateComponent,
        resolve: {
            busStop: BusStopResolve
        },
        data: {
            authorities: ['ROLE_ADMIN'],
            pageTitle: 'BusStops'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: ':id/edit',
        component: BusStopUpdateComponent,
        resolve: {
            busStop: BusStopResolve
        },
        data: {
            authorities: ['ROLE_ADMIN'],
            pageTitle: 'BusStops'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const busStopPopupRoute: Routes = [
    {
        path: ':id/delete',
        component: BusStopDeletePopupComponent,
        resolve: {
            busStop: BusStopResolve
        },
        data: {
            authorities: ['ROLE_ADMIN'],
            pageTitle: 'BusStops'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
