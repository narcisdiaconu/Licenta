import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { JhiPaginationUtil, JhiResolvePagingParams } from 'ng-jhipster';
import { UserRouteAccessService } from 'app/core';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { IntermediatePoint } from 'app/shared/model/routes/intermediate-point.model';
import { IntermediatePointService } from './intermediate-point.service';
import { IntermediatePointComponent } from './intermediate-point.component';
import { IntermediatePointDetailComponent } from './intermediate-point-detail.component';
import { IntermediatePointUpdateComponent } from './intermediate-point-update.component';
import { IntermediatePointDeletePopupComponent } from './intermediate-point-delete-dialog.component';
import { IIntermediatePoint } from 'app/shared/model/routes/intermediate-point.model';

@Injectable({ providedIn: 'root' })
export class IntermediatePointResolve implements Resolve<IIntermediatePoint> {
    constructor(private service: IntermediatePointService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IIntermediatePoint> {
        const id = route.params['id'] ? route.params['id'] : null;
        if (id) {
            return this.service.find(id).pipe(
                filter((response: HttpResponse<IntermediatePoint>) => response.ok),
                map((intermediatePoint: HttpResponse<IntermediatePoint>) => intermediatePoint.body)
            );
        }
        return of(new IntermediatePoint());
    }
}

export const intermediatePointRoute: Routes = [
    {
        path: '',
        component: IntermediatePointComponent,
        resolve: {
            pagingParams: JhiResolvePagingParams
        },
        data: {
            authorities: ['ROLE_ADMIN'],
            defaultSort: 'id,asc',
            pageTitle: 'IntermediatePoints'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: ':id/view',
        component: IntermediatePointDetailComponent,
        resolve: {
            intermediatePoint: IntermediatePointResolve
        },
        data: {
            authorities: ['ROLE_ADMIN'],
            pageTitle: 'IntermediatePoints'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'new',
        component: IntermediatePointUpdateComponent,
        resolve: {
            intermediatePoint: IntermediatePointResolve
        },
        data: {
            authorities: ['ROLE_ADMIN'],
            pageTitle: 'IntermediatePoints'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: ':id/edit',
        component: IntermediatePointUpdateComponent,
        resolve: {
            intermediatePoint: IntermediatePointResolve
        },
        data: {
            authorities: ['ROLE_ADMIN'],
            pageTitle: 'IntermediatePoints'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const intermediatePointPopupRoute: Routes = [
    {
        path: ':id/delete',
        component: IntermediatePointDeletePopupComponent,
        resolve: {
            intermediatePoint: IntermediatePointResolve
        },
        data: {
            authorities: ['ROLE_ADMIN'],
            pageTitle: 'IntermediatePoints'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
