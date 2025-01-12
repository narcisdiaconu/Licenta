import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
import { IIntermediatePoint } from 'app/shared/model/routes/intermediate-point.model';

type EntityResponseType = HttpResponse<IIntermediatePoint>;
type EntityArrayResponseType = HttpResponse<IIntermediatePoint[]>;

@Injectable({ providedIn: 'root' })
export class IntermediatePointService {
    public resourceUrl = SERVER_API_URL + 'routes/api/intermediate-points';

    constructor(protected http: HttpClient) {}

    create(intermediatePoint: IIntermediatePoint): Observable<EntityResponseType> {
        return this.http.post<IIntermediatePoint>(this.resourceUrl, intermediatePoint, { observe: 'response' });
    }

    update(intermediatePoint: IIntermediatePoint): Observable<EntityResponseType> {
        return this.http.put<IIntermediatePoint>(this.resourceUrl, intermediatePoint, { observe: 'response' });
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<IIntermediatePoint>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    query(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http.get<IIntermediatePoint[]>(this.resourceUrl, { params: options, observe: 'response' });
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    getByRoute(routeId: number): Observable<EntityArrayResponseType> {
        return this.http.get<IIntermediatePoint[]>(`${this.resourceUrl}/route/${routeId}`, { observe: 'response' });
    }
}
