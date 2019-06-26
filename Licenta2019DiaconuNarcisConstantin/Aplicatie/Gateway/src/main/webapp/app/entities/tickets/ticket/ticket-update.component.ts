import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import * as moment from 'moment';
import { ITicket } from 'app/shared/model/tickets/ticket.model';
import { TicketService } from './ticket.service';

@Component({
    selector: 'jhi-ticket-update',
    templateUrl: './ticket-update.component.html'
})
export class TicketUpdateComponent implements OnInit {
    ticket: ITicket;
    isSaving: boolean;
    dateDp: any;

    constructor(protected ticketService: TicketService, protected activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ ticket }) => {
            this.ticket = ticket;
        });
    }

    previousState() {
        window.history.back();
    }

    save() {
        this.isSaving = true;
        if (this.ticket.id !== undefined) {
            this.subscribeToSaveResponse(this.ticketService.update(this.ticket));
        } else {
            this.subscribeToSaveResponse(this.ticketService.create(this.ticket));
        }
    }

    protected subscribeToSaveResponse(result: Observable<HttpResponse<ITicket>>) {
        result.subscribe((res: HttpResponse<ITicket>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
    }

    protected onSaveSuccess() {
        this.isSaving = false;
        this.previousState();
    }

    protected onSaveError() {
        this.isSaving = false;
    }
}
