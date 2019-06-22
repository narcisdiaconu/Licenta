import { Component, OnInit, OnDestroy } from '@angular/core';
import { AccountService } from 'app/core';
import { UserdetailsService } from 'app/entities/users/userdetails';
import { TicketService } from 'app/entities/tickets/ticket';
import { IUserdetails } from 'app/shared/model/users/userdetails.model';
import { HttpResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { ITicket } from 'app/shared/model/tickets/ticket.model';
import { StationService } from 'app/entities/stations/station';
import { IStation } from 'app/shared/model/stations/station.model';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TicketRemoveModalComponent } from './tickets-remove.modal';
import { JhiEventManager } from 'ng-jhipster';
import { Subscription } from 'rxjs';

@Component({
    selector: 'jhi-my-tickets',
    templateUrl: './tickets.component.html',
    styleUrls: ['./tickets.component.css']
})
export class MyTicketsComponent implements OnInit, OnDestroy {
    private userDetails: IUserdetails;
    tickets: ITicket[];
    private ngbModalRef: NgbModalRef;
    eventSubscriber: Subscription;

    constructor(
        private accountService: AccountService,
        private userDetailsService: UserdetailsService,
        private ticketsService: TicketService,
        private router: Router,
        private stationService: StationService,
        private modalService: NgbModal,
        protected eventManager: JhiEventManager
    ) {}

    ngOnInit() {
        this.loadAll();
        this.registerChangeInTickets();
    }

    registerChangeInTickets() {
        this.eventSubscriber = this.eventManager.subscribe('myTicketsListModification', response => this.loadAll());
    }

    ngOnDestroy() {
        if (this.eventSubscriber) {
            this.eventManager.destroy(this.eventSubscriber);
        }
    }

    canBeDeleted(ticket: ITicket): boolean {
        const ticketDate = ticket.date.toDate();
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (ticketDate < today) {
            return true;
        }
        return false;
    }

    canBeCanceled(ticket: ITicket): boolean {
        const ticketDate = ticket.date.toDate();
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 2);
        tomorrow.setHours(0, 0, 0, 0);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (ticketDate > tomorrow) {
            return true;
        }
        return false;
    }

    openDeletePopup(id: number, type: string) {
        setTimeout(() => {
            this.ngbModalRef = this.modalService.open(TicketRemoveModalComponent as Component, { size: 'lg', backdrop: 'static' });
            this.ngbModalRef.componentInstance.id = id;
            this.ngbModalRef.componentInstance.message = type;
            this.ngbModalRef.result.then(
                result => {
                    this.router.navigate(['/my-tickets']);
                    this.ngbModalRef = null;
                },
                reason => {
                    this.router.navigate(['/my-tickets']);
                    this.ngbModalRef = null;
                }
            );
        }, 0);
    }

    private loadAll() {
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
