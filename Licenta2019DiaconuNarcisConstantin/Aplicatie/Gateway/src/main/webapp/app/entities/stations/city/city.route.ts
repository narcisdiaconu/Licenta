import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { JhiPaginationUtil, JhiResolvePagingParams } from 'ng-jhipster';
import { UserRouteAccessService } from 'app/core';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { City } from 'app/shared/model/stations/city.model';
import { CityService } from './city.service';
import { CityComponent } from './city.component';
import { CityDetailComponent } from './city-detail.component';
import { CityUpdateComponent } from './city-update.component';
import { ICity } from 'app/shared/model/stations/city.model';

@Injectable({ providedIn: 'root' })
export class CityResolve implements Resolve<ICity> {
    constructor(private service: CityService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ICity> {
        const id = route.params['id'] ? route.params['id'] : null;
        if (id) {
            return this.service.find(id).pipe(
                filter((response: HttpResponse<City>) => response.ok),
                map((city: HttpResponse<City>) => city.body)
            );
        }
        return of(new City());
    }
}

export const cityRoute: Routes = [
    {
        path: '',
        component: CityComponent,
        resolve: {
            pagingParams: JhiResolvePagingParams
        },
        data: {
            authorities: ['ROLE_ADMIN'],
            defaultSort: 'id,asc',
            pageTitle: 'Cities'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: ':id/view',
        component: CityDetailComponent,
        resolve: {
            city: CityResolve
        },
        data: {
            authorities: ['ROLE_ADMIN'],
            pageTitle: 'Cities'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'new',
        component: CityUpdateComponent,
        resolve: {
            city: CityResolve
        },
        data: {
            authorities: ['ROLE_ADMIN'],
            pageTitle: 'Cities'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: ':id/edit',
        component: CityUpdateComponent,
        resolve: {
            city: CityResolve
        },
        data: {
            authorities: ['ROLE_ADMIN'],
            pageTitle: 'Cities'
        },
        canActivate: [UserRouteAccessService]
    }
];
