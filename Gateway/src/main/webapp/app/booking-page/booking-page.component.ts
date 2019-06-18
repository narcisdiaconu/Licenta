import { Component, OnInit } from '@angular/core';
import { DataService } from 'app/data.service';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { IUserdetails, Userdetails } from 'app/shared/model/users/userdetails.model';
import { UserdetailsService } from 'app/entities/users/userdetails';
import { AccountService } from 'app/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { TicketService } from 'app/entities/tickets/ticket';
import { ITicket, Ticket } from 'app/shared/model/tickets/ticket.model';
import moment = require('moment');
import { RouteService } from 'app/entities/routes/route';
import { BusStopService } from 'app/entities/buses/bus-stop';
import { IRoute } from 'app/shared/model/routes/route.model';
import { IBusStop } from 'app/shared/model/buses/bus-stop.model';
import { ConfirmationModalService } from './confirmation-modal.service';

@Component({
    selector: 'jhi-booking',
    templateUrl: './booking-page.component.html',
    styleUrls: ['./booking-page.component.css']
})
export class BookingPageComponent implements OnInit {
    data: any;
    userDetails: IUserdetails;
    account: Account;
    buses: any[];
    ticketsNumber = 0;
    totalPrice = 0;
    paymentMethods: any[];
    private createdTickets: ITicket[];
    bookingDone = false;
    bookingFailed = false;

    constructor(
        private dataService: DataService,
        private router: Router,
        private location: Location,
        private userDetailsService: UserdetailsService,
        private accountService: AccountService,
        private ticketService: TicketService,
        private routeService: RouteService,
        private busStopService: BusStopService,
        private confirmationModalService: ConfirmationModalService
    ) {}

    ngOnInit(): void {
        this.paymentMethods = [{ value: '1', label: 'Cash' }, { value: '2', label: 'Card' }];
        this.dataService.getData().subscribe(data => {
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
            this.routeService.find(bus.bus_id).subscribe((r: HttpResponse<IRoute>) => {
                this.busStopService.getByBus(bus.bus_id).subscribe((stops: HttpResponse<IBusStop[]>) => {
                    const points = [];
                    points.push(r.body.startStation);
                    stops.body.forEach(s => points.push(s.station));
                    points.push(r.body.endStation);
                    this.ticketService.ocupiedSeats(bus, points).subscribe((value: HttpResponse<number>) => {
                        bus.remaining_seats = bus.total_places - value.body;
                    });
                });
            });
        });
    }

    getFinalPrice(bus): number {
        return bus.price;
    }

    convertDateToString(busDate): string {
        const date = new Date(busDate * 1000);
        return new Date(date).toDateString();
    }

    book(): void {
        this.createdTickets = [];
        this.buses.forEach(bus => {
            const ticket = new Ticket(
                null,
                this.userDetails.id,
                bus.bus_id,
                moment(new Date(bus.departure_time.value * 1000)),
                this.ticketsNumber,
                this.totalPrice,
                false,
                bus.start_location.id,
                bus.end_location.id
            );
            this.ticketService.create(ticket).subscribe(
                (res: HttpResponse<ITicket>) => {
                    this.createdTickets.push(res.body);
                    if (this.createdTickets.length === this.buses.length) {
                        this.validateBooking();
                    }
                },
                (res: HttpErrorResponse) => {
                    console.log(res);
                    this.bookingFailed = true;
                    this.resetTickets();
                }
            );
        });
    }

    private resetTickets() {
        this.createdTickets.forEach(ticket => {
            this.ticketService.delete(ticket.id);
        });
    }

    private validateBooking() {
        this.bookingDone = true;
        this.bookingFailed = false;
        this.confirmationModalService.open();
    }

    increaseTicketsNumber(): void {
        if (this.ticketsNumber < this.buses[0].remaining_seats) {
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
            price += this.getFinalPrice(bus);
        });
        return price;
    }
}
