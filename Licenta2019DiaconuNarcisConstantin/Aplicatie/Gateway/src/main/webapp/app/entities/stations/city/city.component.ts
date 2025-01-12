import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse, HttpHeaders, HttpResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiEventManager, JhiParseLinks, JhiAlertService } from 'ng-jhipster';

import { ICity } from 'app/shared/model/stations/city.model';
import { AccountService } from 'app/core';

import { ITEMS_PER_PAGE } from 'app/shared';
import { CityService } from './city.service';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CityDeleteDialogComponent } from './city-delete-dialog.component';

@Component({
    selector: 'jhi-city',
    templateUrl: './city.component.html'
})
export class CityComponent implements OnInit, OnDestroy {
    currentAccount: any;
    cities: ICity[];
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
    protected ngbModalRef: NgbModalRef;

    constructor(
        protected cityService: CityService,
        protected parseLinks: JhiParseLinks,
        protected jhiAlertService: JhiAlertService,
        protected accountService: AccountService,
        protected activatedRoute: ActivatedRoute,
        protected router: Router,
        protected eventManager: JhiEventManager,
        protected modalService: NgbModal
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
        this.cityService
            .query({
                page: this.page - 1,
                size: this.itemsPerPage,
                sort: this.sort()
            })
            .subscribe(
                (res: HttpResponse<ICity[]>) => this.paginateCities(res.body, res.headers),
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
        this.router.navigate(['/city'], {
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
            '/city',
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
        this.registerChangeInCities();
    }

    ngOnDestroy() {
        if (this.eventSubscriber !== undefined) {
            this.eventManager.destroy(this.eventSubscriber);
        }
    }

    trackId(index: number, item: ICity) {
        return item.id;
    }

    registerChangeInCities() {
        this.eventSubscriber = this.eventManager.subscribe('cityListModification', response => this.loadAll());
    }

    sort() {
        const result = [this.predicate + ',' + (this.reverse ? 'asc' : 'desc')];
        if (this.predicate !== 'id') {
            result.push('id');
        }
        return result;
    }

    protected paginateCities(data: ICity[], headers: HttpHeaders) {
        this.links = this.parseLinks.parse(headers.get('link'));
        this.totalItems = parseInt(headers.get('X-Total-Count'), 10);
        this.cities = data;
    }

    protected onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }

    openDeletePopup(id: number) {
        setTimeout(() => {
            this.ngbModalRef = this.modalService.open(CityDeleteDialogComponent as Component, { size: 'lg', backdrop: 'static' });
            this.ngbModalRef.componentInstance.id = id;
            this.ngbModalRef.result.then(
                result => {
                    this.router.navigate(['/city']);
                    this.ngbModalRef = null;
                },
                reason => {
                    this.router.navigate(['/city']);
                    this.ngbModalRef = null;
                }
            );
        }, 0);
    }
}
