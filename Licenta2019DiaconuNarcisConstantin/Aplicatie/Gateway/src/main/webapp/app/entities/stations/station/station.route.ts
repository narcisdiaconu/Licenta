import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { JhiPaginationUtil, JhiResolvePagingParams } from 'ng-jhipster';
import { UserRouteAccessService } from 'app/core';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { Station } from 'app/shared/model/stations/station.model';
import { StationService } from './station.service';
import { StationComponent } from './station.component';
import { StationDetailComponent } from './station-detail.component';
import { StationUpdateComponent } from './station-update.component';
import { IStation } from 'app/shared/model/stations/station.model';

@Injectable({ providedIn: 'root' })
export class StationResolve implements Resolve<IStation> {
    constructor(private service: StationService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IStation> {
        const id = route.params['id'] ? route.params['id'] : null;
        if (id) {
            return this.service.find(id).pipe(
                filter((response: HttpResponse<Station>) => response.ok),
                map((station: HttpResponse<Station>) => station.body)
            );
        }
        return of(new Station());
    }
}

export const stationRoute: Routes = [
    {
        path: '',
        component: StationComponent,
        resolve: {
            pagingParams: JhiResolvePagingParams
        },
        data: {
            authorities: ['ROLE_ADMIN'],
            defaultSort: 'id,asc',
            pageTitle: 'Stations'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: ':id/view',
        component: StationDetailComponent,
        resolve: {
            station: StationResolve
        },
        data: {
            authorities: ['ROLE_ADMIN'],
            pageTitle: 'Stations'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'new',
        component: StationUpdateComponent,
        resolve: {
            station: StationResolve
        },
        data: {
            authorities: ['ROLE_ADMIN'],
            pageTitle: 'Stations'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: ':id/edit',
        component: StationUpdateComponent,
        resolve: {
            station: StationResolve
        },
        data: {
            authorities: ['ROLE_ADMIN'],
            pageTitle: 'Stations'
        },
        canActivate: [UserRouteAccessService]
    }
];
