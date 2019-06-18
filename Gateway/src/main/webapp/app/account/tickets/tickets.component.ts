import { Component, OnInit } from '@angular/core';
import { AccountService } from 'app/core';
import { UserdetailsService } from 'app/entities/users/userdetails';
import { TicketService } from 'app/entities/tickets/ticket';
import { IUserdetails } from 'app/shared/model/users/userdetails.model';
import { HttpResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { ITicket } from 'app/shared/model/tickets/ticket.model';
import { StationService } from 'app/entities/stations/station';
import { IStation } from 'app/shared/model/stations/station.model';

@Component({
    selector: 'jhi-my-tickets',
    templateUrl: './tickets.component.html',
    styleUrls: ['./tickets.component.css']
})
export class MyTicketsComponent implements OnInit {
    private userDetails: IUserdetails;
    tickets: ITicket[];

    constructor(
        private accountService: AccountService,
        private userDetailsService: UserdetailsService,
        private ticketsService: TicketService,
        private router: Router,
        private stationService: StationService
    ) {}

    ngOnInit() {
        this.accountService.identity().then(user => {
            this.userDetailsService.getByAccountId(user.id).subscribe(
                (res: HttpResponse<IUserdetails>) => {
                    this.userDetails = res.body;
                    this.ticketsService.getForUser(this.userDetails.id).subscribe((r: HttpResponse<ITicket[]>) => {
                        this.tickets = r.body;
                        this.loadInformation(this.tickets);
                    });
                },
                (err: any) => {
                    this.router.navigate(['/settings']);
                }
            );
        });
    }

    private loadInformation(tickets) {
        tickets.forEach((ticket: ITicket) => {
            this.stationService.find(ticket.startStation).subscribe((res: HttpResponse<IStation>) => {
                ticket.startLocation = res.body;
            });
            this.stationService.find(ticket.endStation).subscribe((res: HttpResponse<IStation>) => {
                ticket.endLocation = res.body;
            });
        });
    }
}
