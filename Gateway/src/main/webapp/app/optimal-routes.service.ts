import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpResponse, HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class OptimalRoutesService {
    public resourceUrl = 'https://europe-west1-cloud-project-1558612167204.cloudfunctions.net/optimal-routes';

    constructor(private http: HttpClient) {}

    get(data: any): Observable<HttpResponse<any>> {
        const head = new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
        return this.http.post<any>(this.resourceUrl, data, { headers: head, observe: 'response' });
    }
}
