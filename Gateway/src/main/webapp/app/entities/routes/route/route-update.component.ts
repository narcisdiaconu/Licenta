import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { IRoute } from 'app/shared/model/routes/route.model';
import { RouteService } from './route.service';

@Component({
    selector: 'jhi-route-update',
    templateUrl: './route-update.component.html'
})
export class RouteUpdateComponent implements OnInit {
    route: IRoute;
    isSaving: boolean;

    constructor(protected routeService: RouteService, protected activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ route }) => {
            this.route = route;
        });
    }

    previousState() {
        window.history.back();
    }

    save() {
        this.isSaving = true;
        if (this.route.id !== undefined) {
            this.subscribeToSaveResponse(this.routeService.update(this.route));
        } else {
            this.subscribeToSaveResponse(this.routeService.create(this.route));
        }
    }

    protected subscribeToSaveResponse(result: Observable<HttpResponse<IRoute>>) {
        result.subscribe((res: HttpResponse<IRoute>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
    }

    protected onSaveSuccess() {
        this.isSaving = false;
        this.previousState();
    }

    protected onSaveError() {
        this.isSaving = false;
    }
}
