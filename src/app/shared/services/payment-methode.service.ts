import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { PaymentMethode } from '../entities/payment-methode';

@Injectable({
  providedIn: 'root'
})
export class PaymentMethodeService {
  constructor(private _http: HttpClient) {}

  getAll(): Observable<PaymentMethode[]> {
    return <Observable<PaymentMethode[]>>this._http.get(environment.apiURL + 'PaymentMethode/GetAll');
  }
}
