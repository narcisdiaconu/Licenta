import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { JhiPaginationUtil, JhiResolvePagingParams } from 'ng-jhipster';
import { UserRouteAccessService } from 'app/core';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { Userdetails } from 'app/shared/model/users/userdetails.model';
import { UserdetailsService } from './userdetails.service';
import { UserdetailsComponent } from './userdetails.component';
import { UserdetailsDetailComponent } from './userdetails-detail.component';
import { UserdetailsUpdateComponent } from './userdetails-update.component';
import { UserdetailsDeletePopupComponent } from './userdetails-delete-dialog.component';
import { IUserdetails } from 'app/shared/model/users/userdetails.model';

@Injectable({ providedIn: 'root' })
export class UserdetailsResolve implements Resolve<IUserdetails> {
    constructor(private service: UserdetailsService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IUserdetails> {
        const id = route.params['id'] ? route.params['id'] : null;
        if (id) {
            return this.service.find(id).pipe(
                filter((response: HttpResponse<Userdetails>) => response.ok),
                map((userdetails: HttpResponse<Userdetails>) => userdetails.body)
            );
        }
        return of(new Userdetails());
    }
}

export const userdetailsRoute: Routes = [
    {
        path: '',
        component: UserdetailsComponent,
        resolve: {
            pagingParams: JhiResolvePagingParams
        },
        data: {
            authorities: ['ROLE_ADMIN'],
            defaultSort: 'id,asc',
            pageTitle: 'Userdetails'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: ':id/view',
        component: UserdetailsDetailComponent,
        resolve: {
            userdetails: UserdetailsResolve
        },
        data: {
            authorities: ['ROLE_ADMIN'],
            pageTitle: 'Userdetails'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'new',
        component: UserdetailsUpdateComponent,
        resolve: {
            userdetails: UserdetailsResolve
        },
        data: {
            authorities: ['ROLE_ADMIN'],
            pageTitle: 'Userdetails'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: ':id/edit',
        component: UserdetailsUpdateComponent,
        resolve: {
            userdetails: UserdetailsResolve
        },
        data: {
            authorities: ['ROLE_ADMIN'],
            pageTitle: 'Userdetails'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const userdetailsPopupRoute: Routes = [
    {
        path: ':id/delete',
        component: UserdetailsDeletePopupComponent,
        resolve: {
            userdetails: UserdetailsResolve
        },
        data: {
            authorities: ['ROLE_ADMIN'],
            pageTitle: 'Userdetails'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
