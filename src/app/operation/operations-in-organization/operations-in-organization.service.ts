import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../environments/environment';
@Injectable({
  providedIn: 'root' // SortingModule
})
export class OperationsInOrganizationService {

  constructor(private http: HttpClient) {}


  GetAllShipmentSByOperationName(item): Observable<object> {
    return this.http.get(environment.apiURL + 'Operation/GetAllShipmentSByOperationName?operationName=' + item);
   }



}
