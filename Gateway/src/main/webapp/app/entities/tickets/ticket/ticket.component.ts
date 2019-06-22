import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse, HttpHeaders, HttpResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, BehaviorSubject } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiEventManager, JhiParseLinks, JhiAlertService } from 'ng-jhipster';

import { ITicket } from 'app/shared/model/tickets/ticket.model';
import { AccountService } from 'app/core';

import { TicketService } from './ticket.service';
import { IRoute } from 'app/shared/model/routes/route.model';
import { IBus } from 'app/shared/model/buses/bus.model';
import { RouteService } from 'app/entities/routes/route';
import { BusService } from 'app/entities/buses/bus';
import { StationService } from 'app/entities/stations/station';
import { NgbDateStruct, NgbDatepickerConfig } from '@ng-bootstrap/ng-bootstrap';
import { UserdetailsService } from 'app/entities/users/userdetails';
import { IUserdetails } from 'app/shared/model/users/userdetails.model';
import { IStation } from 'app/shared/model/stations/station.model';

@Component({
    selector: 'jhi-ticket',
    templateUrl: './ticket.component.html'
})
export class TicketComponent implements OnInit {
    currentAccount: any;
    tickets: ITicket[];
    error: any;
    predicate: any;
    reverse: any;
    route: number;
    routes: IRoute[];
    bus: number;
    buses: IBus[];
    date: any;

    constructor(
        protected ticketService: TicketService,
        protected parseLinks: JhiParseLinks,
        protected jhiAlertService: JhiAlertService,
        protected accountService: AccountService,
        protected activatedRoute: ActivatedRoute,
        protected router: Router,
        protected eventManager: JhiEventManager,
        private routeService: RouteService,
        private busService: BusService,
        private stationService: StationService,
        private dpConfig: NgbDatepickerConfig,
        private userService: UserdetailsService
    ) {}

    ngOnInit() {
        this.dpConfig.minDate = { year: 1970, month: 1, day: 1 };
        this.dpConfig.maxDate = { year: 2100, month: 12, day: 31 };
        this.accountService.identity().then(account => {
            this.currentAccount = account;
        });
        this.loadRoutes();
    }

    trackId(index: number, item) {
        return item.id;
    }

    sort() {
        const result = [this.predicate + ',' + (this.reverse ? 'asc' : 'desc')];
        if (this.predicate !== 'id') {
            result.push('id');
        }
        return result;
    }

    updateBuses() {
        this.buses = undefined;
        this.bus = undefined;
        this.tickets = undefined;
        this.busService.getByRoute(this.route).subscribe((res: HttpResponse<IBus[]>) => {
            this.buses = res.body;
            this.buses.sort((bus1: IBus, bus2: IBus) => {
                return bus1.departureTime.localeCompare(bus2.departureTime);
            });
        });
    }

    checkDate() {
        this.tickets = undefined;
        if (this.date !== undefined) {
            this.loadTickets();
        }
    }

    loadTickets() {
        this.tickets = undefined;
        const date = new Date(this.date);
        this.ticketService.getByBusAndDate(this.bus, date).subscribe((res: HttpResponse<ITicket[]>) => {
            this.tickets = res.body;
            this.tickets.forEach(ticket => this.loadTicketData(ticket));
        });
    }

    private loadTicketData(ticket: ITicket) {
        this.userService.find(ticket.user).subscribe((res: HttpResponse<IUserdetails>) => (ticket.userModel = res.body));
        this.stationService.find(ticket.startStation).subscribe((res: HttpResponse<IStation>) => (ticket.startLocation = res.body));
        this.stationService.find(ticket.endStation).subscribe((res: HttpResponse<IStation>) => (ticket.endLocation = res.body));
    }

    private loadRoutes() {
        this.routeService.query().subscribe((res: HttpResponse<IRoute[]>) => (this.routes = res.body));
    }

    protected onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }
}
