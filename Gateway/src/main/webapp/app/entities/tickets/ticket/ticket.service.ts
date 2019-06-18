import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { DATE_FORMAT } from 'app/shared/constants/input.constants';
import { map } from 'rxjs/operators';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
import { ITicket } from 'app/shared/model/tickets/ticket.model';
import { IOcupiedSeats, OcupiedSeats } from 'app/shared/model/tickets/ocupied-seats.model';
import { BusModel } from 'app/models/bus';

type EntityResponseType = HttpResponse<ITicket>;
type EntityArrayResponseType = HttpResponse<ITicket[]>;

@Injectable({ providedIn: 'root' })
export class TicketService {
    public resourceUrl = SERVER_API_URL + 'tickets/api/tickets';

    constructor(protected http: HttpClient) {}

    create(ticket: ITicket): Observable<EntityResponseType> {
        const copy = this.convertDateFromClient(ticket);
        return this.http
            .post<ITicket>(this.resourceUrl, copy, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    update(ticket: ITicket): Observable<EntityResponseType> {
        const copy = this.convertDateFromClient(ticket);
        return this.http
            .put<ITicket>(this.resourceUrl, copy, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http
            .get<ITicket>(`${this.resourceUrl}/${id}`, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    query(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http
            .get<ITicket[]>(this.resourceUrl, { params: options, observe: 'response' })
            .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    ocupiedSeats(req, stops): Observable<HttpResponse<number>> {
        const convertedData = this.convertBusToOcupiedSeat(req, stops);
        let convert: ITicket = { date: convertedData.date };
        convert = this.convertDateFromClient(convert);
        convertedData.date = convert.date;

        return this.http.post<number>(`${this.resourceUrl}/ocupied-seats`, convertedData, { observe: 'response' });
    }

    getForUser(user: number): Observable<EntityArrayResponseType> {
        return this.http
            .get<ITicket[]>(`${this.resourceUrl}/user/${user}`, { observe: 'response' })
            .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
    }

    private convertBusToOcupiedSeat(bus, stops): IOcupiedSeats {
        const busDate = new Date(bus.departure_time.value * 1000);
        const data: IOcupiedSeats = new OcupiedSeats(bus.bus_id, stops, moment(busDate), bus.start_location.id, bus.end_location.id);
        return data;
    }

    protected convertDateFromClient(ticket: ITicket): ITicket {
        const copy: ITicket = Object.assign({}, ticket, {
            date: ticket.date != null && ticket.date.isValid() ? ticket.date.format(DATE_FORMAT) : null
        });
        return copy;
    }

    protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
        if (res.body) {
            res.body.date = res.body.date != null ? moment(res.body.date) : null;
        }
        return res;
    }

    protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
        if (res.body) {
            res.body.forEach((ticket: ITicket) => {
                ticket.date = ticket.date != null ? moment(ticket.date) : null;
            });
        }
        return res;
    }
}
