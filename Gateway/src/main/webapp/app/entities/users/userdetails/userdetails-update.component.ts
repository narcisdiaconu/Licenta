import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { IUserdetails } from 'app/shared/model/users/userdetails.model';
import { UserdetailsService } from './userdetails.service';

@Component({
    selector: 'jhi-userdetails-update',
    templateUrl: './userdetails-update.component.html'
})
export class UserdetailsUpdateComponent implements OnInit {
    userdetails: IUserdetails;
    isSaving: boolean;

    constructor(protected userdetailsService: UserdetailsService, protected activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ userdetails }) => {
            this.userdetails = userdetails;
        });
    }

    previousState() {
        window.history.back();
    }

    save() {
        this.isSaving = true;
        if (this.userdetails.id !== undefined) {
            this.subscribeToSaveResponse(this.userdetailsService.update(this.userdetails));
        } else {
            this.subscribeToSaveResponse(this.userdetailsService.create(this.userdetails));
        }
    }

    protected subscribeToSaveResponse(result: Observable<HttpResponse<IUserdetails>>) {
        result.subscribe((res: HttpResponse<IUserdetails>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
    }

    protected onSaveSuccess() {
        this.isSaving = false;
        this.previousState();
    }

    protected onSaveError() {
        this.isSaving = false;
    }
}
