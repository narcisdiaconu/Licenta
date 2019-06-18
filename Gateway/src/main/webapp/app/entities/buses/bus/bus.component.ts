import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse, HttpHeaders, HttpResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiEventManager, JhiParseLinks, JhiAlertService } from 'ng-jhipster';

import { IBus } from 'app/shared/model/buses/bus.model';
import { AccountService } from 'app/core';

import { ITEMS_PER_PAGE } from 'app/shared';
import { BusService } from './bus.service';
import { RouteService } from 'app/entities/routes/route';
import { IRoute } from 'app/shared/model/routes/route.model';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BusDeleteDialogComponent } from './bus-delete-dialog.component';

@Component({
    selector: 'jhi-bus',
    templateUrl: './bus.component.html'
})
export class BusComponent implements OnInit, OnDestroy {
    currentAccount: any;
    buses: IBus[];
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
        protected busService: BusService,
        protected parseLinks: JhiParseLinks,
        protected jhiAlertService: JhiAlertService,
        protected accountService: AccountService,
        protected activatedRoute: ActivatedRoute,
        protected router: Router,
        protected eventManager: JhiEventManager,
        private routeService: RouteService,
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
        this.busService
            .query({
                page: this.page - 1,
                size: this.itemsPerPage,
                sort: this.sort()
            })
            .subscribe(
                (res: HttpResponse<IBus[]>) => this.paginateBuses(res.body, res.headers),
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
        this.router.navigate(['/bus'], {
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
            '/bus',
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
        this.registerChangeInBuses();
    }

    ngOnDestroy() {
        if (this.eventSubscriber) {
            this.eventManager.destroy(this.eventSubscriber);
        }
    }

    trackId(index: number, item: IBus) {
        return item.id;
    }

    registerChangeInBuses() {
        this.eventSubscriber = this.eventManager.subscribe('busListModification', response => this.loadAll());
    }

    sort() {
        const result = [this.predicate + ',' + (this.reverse ? 'asc' : 'desc')];
        if (this.predicate !== 'id') {
            result.push('id');
        }
        return result;
    }

    openDeletePopup(id: number) {
        setTimeout(() => {
            this.ngbModalRef = this.modalService.open(BusDeleteDialogComponent as Component, { size: 'lg', backdrop: 'static' });
            this.ngbModalRef.componentInstance.id = id;
            this.ngbModalRef.result.then(
                result => {
                    this.router.navigate(['/bus']);
                    this.ngbModalRef = null;
                },
                reason => {
                    this.router.navigate(['/bus']);
                    this.ngbModalRef = null;
                }
            );
        }, 0);
    }

    protected paginateBuses(data: IBus[], headers: HttpHeaders) {
        this.links = this.parseLinks.parse(headers.get('link'));
        this.totalItems = parseInt(headers.get('X-Total-Count'), 10);
        this.buses = data;
        this.buses.forEach(bus => this.loadRoute(bus));
    }

    private loadRoute(bus: IBus) {
        this.routeService.find(bus.route).subscribe((res: HttpResponse<IRoute>) => (bus.routeModel = res.body));
    }

    protected onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }
}
