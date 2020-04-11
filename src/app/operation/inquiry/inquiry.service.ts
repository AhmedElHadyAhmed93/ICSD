import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../environments/environment';
@Injectable({
  providedIn: 'root' // SortingModule
})
export class InquiryService {

  constructor(private http: HttpClient) {}


  CustomerInquery(item): Observable<object> {
    return this.http.post(environment.apiURL + 'Operation/CustomerInquery', item);
   }

}
