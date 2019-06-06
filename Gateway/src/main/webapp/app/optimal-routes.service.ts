import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpResponse, HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class OptimalRoutesService {
    public resourceUrl = 'http://localhost:5000';

    constructor(private http: HttpClient) {}

    get(data: any): Observable<HttpResponse<any>> {
        return this.http.post<any>(this.resourceUrl, data, { observe: 'response' });
    }
}
