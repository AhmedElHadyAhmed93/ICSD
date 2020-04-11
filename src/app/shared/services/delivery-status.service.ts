import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DeliveryStatus } from '../../sorting/transaction/delivery-status';
import { environment } from '../../../environments/environment.prod';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DeliveryStatusService {

  constructor(private _http: HttpClient) { }

  getAll(status?: Boolean): Observable<DeliveryStatus[]> {
    ;
    if (status) {
      return <Observable<DeliveryStatus[]>>this._http.get(environment.apiURL + 'DeliveryStatus/GetAll?status=' + status);
    }
    return <Observable<DeliveryStatus[]>>this._http.get(environment.apiURL + 'DeliveryStatus/GetAll');
  }
}
