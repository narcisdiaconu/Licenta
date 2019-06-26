import { Component, OnInit } from '@angular/core';
import { AccountService } from 'app/core';
import { IUserdetails } from 'app/shared/model/users/userdetails.model';
import { UserdetailsService } from 'app/entities/users/userdetails';

@Component({
    selector: 'jhi-details',
    templateUrl: './details.component.html'
})
export class DetailsComponent implements OnInit {
    detailsAccount: any;
    userDetails: IUserdetails;

    constructor(private accountService: AccountService, private userDetailsService: UserdetailsService) {}

    ngOnInit() {
        this.accountService.identity().then(account => {
            this.detailsAccount = this.copyAccount(account);
        });
    }

    copyAccount(account) {
        return {
            activated: account.activated,
            email: account.email,
            firstName: account.firstName,
            langKey: account.langKey,
            lastName: account.lastName,
            login: account.login,
            imageUrl: account.imageUrl,
            id: account.id
        };
    }

    save() {}
}
