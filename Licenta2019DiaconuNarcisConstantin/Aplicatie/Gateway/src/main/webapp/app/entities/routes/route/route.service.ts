import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
import { IRoute } from 'app/shared/model/routes/route.model';

type EntityResponseType = HttpResponse<IRoute>;
type EntityArrayResponseType = HttpResponse<IRoute[]>;

@Injectable({ providedIn: 'root' })
export class RouteService {
    public resourceUrl = SERVER_API_URL + 'routes/api/routes';

    constructor(protected http: HttpClient) {}

    create(route: IRoute): Observable<EntityResponseType> {
        return this.http.post<IRoute>(this.resourceUrl, route, { observe: 'response' });
    }

    update(route: IRoute): Observable<EntityResponseType> {
        return this.http.put<IRoute>(this.resourceUrl, route, { observe: 'response' });
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<IRoute>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    query(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http.get<IRoute[]>(this.resourceUrl, { params: options, observe: 'response' });
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    findByStartAndEnd(start: number, end: number, req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http.get<IRoute[]>(`${this.resourceUrl}/start/${start}/end/${end}`, { params: options, observe: 'response' });
    }
}
