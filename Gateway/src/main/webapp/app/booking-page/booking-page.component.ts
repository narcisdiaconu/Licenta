import { Component, OnInit } from '@angular/core';
import { DataService } from 'app/data.service';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { IUserdetails, Userdetails } from 'app/shared/model/users/userdetails.model';
import { UserdetailsService } from 'app/entities/users/userdetails';
import { AccountService } from 'app/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { IBus } from 'app/shared/model/buses/bus.model';
import { BusModel } from 'app/models/bus';

@Component({
    selector: 'jhi-booking',
    templateUrl: './booking-page.component.html',
    styleUrls: ['./booking-page.component.css']
})
export class BookingPageComponent implements OnInit {
    data: any;
    userDetails: IUserdetails;
    account: Account;
    buses: BusModel[];
    ticketsNumber = 0;
    totalPrice = 0;

    constructor(
        private dataService: DataService,
        private router: Router,
        private location: Location,
        private userDetailsService: UserdetailsService,
        private accountService: AccountService
    ) {}

    ngOnInit(): void {
        this.dataService.getMockedData().subscribe(data => {
            if (data.buses === undefined) {
                this.location.back();
            }
            this.data = data;
            this.buses = data.buses;
            this.loadPlacesLeft();
        });

        this.accountService.identity().then(account => {
            this.account = account;
            this.userDetails = new Userdetails();
            this.userDetailsService.getByAccountId(account.id).subscribe(
                (details: HttpResponse<IUserdetails>) => {
                    this.userDetails = details.body;
                },
                (error: HttpErrorResponse) => {
                    this.userDetails.firstName = account.firstName;
                    this.userDetails.lastName = account.lastName;
                    this.userDetails.email = account.email;
                }
            );
        });
    }

    private loadPlacesLeft(): void {
        this.buses.forEach(bus => {
            bus.remainingSeats = 10;
        });
    }

    getFinalPrice(bus: IBus): number {
        return bus.price;
    }

    convertDateToString(date): string {
        return new Date(date).toDateString();
    }

    book(): void {}

    increaseTicketsNumber(): void {
        if (this.ticketsNumber < this.buses[0].remainingSeats) {
            this.ticketsNumber += 1;
            this.updateTotalPrice();
        }
    }

    decreaseTicketsNumber(): void {
        if (this.ticketsNumber > 0) {
            this.ticketsNumber -= 1;
            this.updateTotalPrice();
        }
    }

    private updateTotalPrice(): void {
        this.totalPrice = this.ticketsNumber * this.getTotalPricePerTicket();
    }

    private getTotalPricePerTicket(): number {
        let price = 0;
        this.buses.forEach(bus => {
            price += this.getFinalPrice(bus.bus);
        });
        return price;
    }
}
