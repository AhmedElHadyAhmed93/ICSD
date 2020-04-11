import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Currency } from '../entities/currency';

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {

  constructor(private _http: HttpClient) { }

  getAll(): Observable<Currency[]> {
    return <Observable<Currency[]>>this._http.get(environment.apiURL + 'Currency/GetAll');
  }
}
