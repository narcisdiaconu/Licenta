import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse, HttpHeaders, HttpResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiEventManager, JhiParseLinks, JhiAlertService } from 'ng-jhipster';

import { IRoute } from 'app/shared/model/routes/route.model';
import { AccountService } from 'app/core';

import { ITEMS_PER_PAGE } from 'app/shared';
import { RouteService } from './route.service';
import { StationService } from 'app/entities/stations/station';
import { IStation } from 'app/shared/model/stations/station.model';
import { IntermediatePointService } from '../intermediate-point';
import { IIntermediatePoint } from 'app/shared/model/routes/intermediate-point.model';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RouteDeleteDialogComponent } from './route-delete-dialog.component';

@Component({
    selector: 'jhi-route',
    templateUrl: './route.component.html'
})
export class RouteComponent implements OnInit, OnDestroy {
    currentAccount: any;
    routes: IRoute[];
    error: any;
    success: any;
    eventSubscriber: Subscription;
    routeData: any;
    links: any;
    totalItems: any;
    itemsPerPage: any;
    page: any;
    predicate: any;
    previousPage: any;
    reverse: any;
    private ngbModalRef: NgbModalRef;

    constructor(
        protected routeService: RouteService,
        protected parseLinks: JhiParseLinks,
        protected jhiAlertService: JhiAlertService,
        protected accountService: AccountService,
        protected activatedRoute: ActivatedRoute,
        protected router: Router,
        protected eventManager: JhiEventManager,
        private stationsService: StationService,
        private intermediatePointsService: IntermediatePointService,
        private modalService: NgbModal
    ) {
        this.itemsPerPage = ITEMS_PER_PAGE;
        this.routeData = this.activatedRoute.data.subscribe(data => {
            this.page = data.pagingParams.page;
            this.previousPage = data.pagingParams.page;
            this.reverse = data.pagingParams.ascending;
            this.predicate = data.pagingParams.predicate;
        });
    }

    loadAll() {
        this.routeService
            .query({
                page: this.page - 1,
                size: this.itemsPerPage,
                sort: this.sort()
            })
            .subscribe(
                (res: HttpResponse<IRoute[]>) => this.paginateRoutes(res.body, res.headers),
                (res: HttpErrorResponse) => this.onError(res.message)
            );
    }

    loadPage(page: number) {
        if (page !== this.previousPage) {
            this.previousPage = page;
            this.transition();
        }
    }

    transition() {
        this.router.navigate(['/route'], {
            queryParams: {
                page: this.page,
                size: this.itemsPerPage,
                sort: this.predicate + ',' + (this.reverse ? 'asc' : 'desc')
            }
        });
        this.loadAll();
    }

    clear() {
        this.page = 0;
        this.router.navigate([
            '/route',
            {
                page: this.page,
                sort: this.predicate + ',' + (this.reverse ? 'asc' : 'desc')
            }
        ]);
        this.loadAll();
    }

    ngOnInit() {
        this.loadAll();
        this.accountService.identity().then(account => {
            this.currentAccount = account;
        });
        this.registerChangeInRoutes();
    }

    ngOnDestroy() {
        if (this.eventSubscriber) {
            this.eventManager.destroy(this.eventSubscriber);
        }
    }

    trackId(index: number, item: IRoute) {
        return item.id;
    }

    registerChangeInRoutes() {
        this.eventSubscriber = this.eventManager.subscribe('routeListModification', response => this.loadAll());
    }

    sort() {
        const result = [this.predicate + ',' + (this.reverse ? 'asc' : 'desc')];
        if (this.predicate !== 'id') {
            result.push('id');
        }
        return result;
    }

    protected paginateRoutes(data: IRoute[], headers: HttpHeaders) {
        this.links = this.parseLinks.parse(headers.get('link'));
        this.totalItems = parseInt(headers.get('X-Total-Count'), 10);
        this.routes = data;
        this.routes.forEach(route => {
            this.loadStations(route);
            this.loadIntermediatePoints(route);
        });
    }

    private loadStations(route: IRoute) {
        this.stationsService.find(route.startStation).subscribe((res: HttpResponse<IStation>) => (route.startLocation = res.body));
        this.stationsService.find(route.endStation).subscribe((res: HttpResponse<IStation>) => (route.endLocation = res.body));
    }

    private loadIntermediatePoints(route: IRoute) {
        this.intermediatePointsService
            .getByRoute(route.id)
            .subscribe((res: HttpResponse<IIntermediatePoint[]>) => (route.intermediatePoints = res.body));
    }

    protected onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }

    openDeletePopup(id: number) {
        setTimeout(() => {
            this.ngbModalRef = this.modalService.open(RouteDeleteDialogComponent as Component, { size: 'lg', backdrop: 'static' });
            this.ngbModalRef.componentInstance.id = id;
            this.ngbModalRef.result.then(
                result => {
                    this.router.navigate(['/route']);
                    this.ngbModalRef = null;
                },
                reason => {
                    this.router.navigate(['/route']);
                    this.ngbModalRef = null;
                }
            );
        }, 0);
    }
}
