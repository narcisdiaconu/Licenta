import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IUserdetails } from 'app/shared/model/users/userdetails.model';

@Component({
    selector: 'jhi-userdetails-detail',
    templateUrl: './userdetails-detail.component.html'
})
export class UserdetailsDetailComponent implements OnInit {
    userdetails: IUserdetails;

    constructor(protected activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ userdetails }) => {
            this.userdetails = userdetails;
        });
    }

    previousState() {
        window.history.back();
    }
}
