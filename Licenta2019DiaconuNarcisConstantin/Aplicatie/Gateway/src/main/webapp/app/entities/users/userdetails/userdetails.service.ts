import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
import { IUserdetails } from 'app/shared/model/users/userdetails.model';

type EntityResponseType = HttpResponse<IUserdetails>;
type EntityArrayResponseType = HttpResponse<IUserdetails[]>;

@Injectable({ providedIn: 'root' })
export class UserdetailsService {
    public resourceUrl = SERVER_API_URL + 'users/api/userdetails';

    constructor(protected http: HttpClient) {}

    create(userdetails: IUserdetails): Observable<EntityResponseType> {
        return this.http.post<IUserdetails>(this.resourceUrl, userdetails, { observe: 'response' });
    }

    update(userdetails: IUserdetails): Observable<EntityResponseType> {
        return this.http.put<IUserdetails>(this.resourceUrl, userdetails, { observe: 'response' });
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<IUserdetails>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    query(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http.get<IUserdetails[]>(this.resourceUrl, { params: options, observe: 'response' });
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    getByAccountId(accountId: number): Observable<EntityResponseType> {
        return this.http.get<IUserdetails>(`${this.resourceUrl}/account/${accountId}`, { observe: 'response' });
    }
}
