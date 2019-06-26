import { Component, OnInit } from '@angular/core';

import { AccountService, IUser } from 'app/core';
import { UserdetailsService } from 'app/entities/users/userdetails';
import { IUserdetails, Userdetails } from 'app/shared/model/users/userdetails.model';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

@Component({
    selector: 'jhi-settings',
    templateUrl: './settings.component.html'
})
export class SettingsComponent implements OnInit {
    error: string;
    success: string;
    settingsAccount: any;
    languages: any[];
    userdetails: IUserdetails;

    constructor(private accountService: AccountService, private userdetailsService: UserdetailsService) {}

    ngOnInit() {
        this.userdetails = new Userdetails();
        this.accountService.identity().then(account => {
            this.settingsAccount = this.copyAccount(account);
            this.userdetailsService.getByAccountId(account.id).subscribe(
                (userdetails: HttpResponse<IUserdetails>) => {
                    this.userdetails = userdetails.body;
                },
                (error: HttpErrorResponse) => {
                    this.userdetails.firstName = account.firstName;
                    this.userdetails.lastName = account.lastName;
                    this.userdetails.email = account.email;
                }
            );
        });
    }

    save() {
        this.accountService.save(this.settingsAccount).subscribe(
            () => {
                this.accountService.identity(true).then(account => {
                    this.settingsAccount = this.copyAccount(account);
                });
                if (this.userdetails.id === undefined) {
                    this.userdetails.accountId = this.settingsAccount.id;
                    console.log(this.userdetails);
                    this.userdetailsService.create(this.userdetails).subscribe(
                        response => {
                            this.error = null;
                            this.success = 'OK';
                            this.userdetails = response.body;
                        },
                        error => {
                            this.success = null;
                            this.error = 'ERROR';
                        }
                    );
                } else {
                    this.userdetailsService.update(this.userdetails).subscribe(
                        response => {
                            this.error = null;
                            this.success = 'OK';
                            this.userdetails = response.body;
                        },
                        error => {
                            this.success = null;
                            this.error = 'ERROR';
                        }
                    );
                }
            },
            () => {
                this.success = null;
                this.error = 'ERROR';
            }
        );
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
}
