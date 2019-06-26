import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
import { IBus } from 'app/shared/model/buses/bus.model';

type EntityResponseType = HttpResponse<IBus>;
type EntityArrayResponseType = HttpResponse<IBus[]>;

@Injectable({ providedIn: 'root' })
export class BusService {
    public resourceUrl = SERVER_API_URL + 'buses/api/buses';

    constructor(protected http: HttpClient) {}

    create(bus: IBus): Observable<EntityResponseType> {
        return this.http.post<IBus>(this.resourceUrl, bus, { observe: 'response' });
    }

    update(bus: IBus): Observable<EntityResponseType> {
        return this.http.put<IBus>(this.resourceUrl, bus, { observe: 'response' });
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<IBus>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    query(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http.get<IBus[]>(this.resourceUrl, { params: options, observe: 'response' });
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    getByRoute(id: number, req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http.get<IBus[]>(`${this.resourceUrl}/route/${id}`, { params: options, observe: 'response' });
    }
}
