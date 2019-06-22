import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
import { IBusStop } from 'app/shared/model/buses/bus-stop.model';

type EntityResponseType = HttpResponse<IBusStop>;
type EntityArrayResponseType = HttpResponse<IBusStop[]>;

@Injectable({ providedIn: 'root' })
export class BusStopService {
    public resourceUrl = SERVER_API_URL + 'buses/api/bus-stops';

    constructor(protected http: HttpClient) {}

    create(busStop: IBusStop): Observable<EntityResponseType> {
        return this.http.post<IBusStop>(this.resourceUrl, busStop, { observe: 'response' });
    }

    update(busStop: IBusStop): Observable<EntityResponseType> {
        return this.http.put<IBusStop>(this.resourceUrl, busStop, { observe: 'response' });
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<IBusStop>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    query(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http.get<IBusStop[]>(this.resourceUrl, { params: options, observe: 'response' });
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    getByBus(id: number): Observable<EntityArrayResponseType> {
        return this.http.get<IBusStop[]>(`${this.resourceUrl}/bus/${id}`, { observe: 'response' });
    }
}
