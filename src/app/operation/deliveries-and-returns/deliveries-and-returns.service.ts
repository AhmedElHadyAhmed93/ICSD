import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../environments/environment';
@Injectable({
  providedIn: 'root' // SortingModule
})
export class DeliveriesAndReturnsService {

  constructor(private http: HttpClient) {}



  DeliveriesAndReturnsReport(item): any {

   return this.http.post(environment.apiURL + 'Operation/DeliveriesAndReturnsReport', item);

  }

}
