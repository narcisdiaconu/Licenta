import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiAlertService } from 'ng-jhipster';
import { IIntermediatePoint } from 'app/shared/model/routes/intermediate-point.model';
import { IntermediatePointService } from './intermediate-point.service';
import { IRoute } from 'app/shared/model/routes/route.model';
import { RouteService } from 'app/entities/routes/route';

@Component({
    selector: 'jhi-intermediate-point-update',
    templateUrl: './intermediate-point-update.component.html'
})
export class IntermediatePointUpdateComponent implements OnInit {
    intermediatePoint: IIntermediatePoint;
    isSaving: boolean;

    routes: IRoute[];

    constructor(
        protected jhiAlertService: JhiAlertService,
        protected intermediatePointService: IntermediatePointService,
        protected routeService: RouteService,
        protected activatedRoute: ActivatedRoute
    ) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ intermediatePoint }) => {
            this.intermediatePoint = intermediatePoint;
        });
        this.routeService
            .query()
            .pipe(
                filter((mayBeOk: HttpResponse<IRoute[]>) => mayBeOk.ok),
                map((response: HttpResponse<IRoute[]>) => response.body)
            )
            .subscribe((res: IRoute[]) => (this.routes = res), (res: HttpErrorResponse) => this.onError(res.message));
    }

    previousState() {
        window.history.back();
    }

    save() {
        this.isSaving = true;
        if (this.intermediatePoint.id !== undefined) {
            this.subscribeToSaveResponse(this.intermediatePointService.update(this.intermediatePoint));
        } else {
            this.subscribeToSaveResponse(this.intermediatePointService.create(this.intermediatePoint));
        }
    }

    protected subscribeToSaveResponse(result: Observable<HttpResponse<IIntermediatePoint>>) {
        result.subscribe((res: HttpResponse<IIntermediatePoint>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
    }

    protected onSaveSuccess() {
        this.isSaving = false;
        this.previousState();
    }

    protected onSaveError() {
        this.isSaving = false;
    }

    protected onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }

    trackRouteById(index: number, item: IRoute) {
        return item.id;
    }
}
