import { Injectable } from '@angular/core';
import { Transaction } from './transaction';
import { environment } from '../../../environments/environment.prod';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  constructor(private _http: HttpClient) {}

  getAll(): Observable<Transaction[]> {
    return <Observable<Transaction[]>>this._http.get(environment.apiURL + 'Transaction/GetAll');
  }

  search(transaction: Transaction): Observable<Transaction[]> {
    return <Observable<Transaction[]>>this._http.post(environment.apiURL + 'Transaction/GetFiltered?', transaction);
  }

  getHistory(shipId: number): Observable<Transaction[]> {
    return <Observable<Transaction[]>>this._http.get(environment.apiURL + 'Transaction/GetTransactionHistory?ShipmentId=' + shipId);
  }

  save(item): Observable<Transaction[]> {
    // tslint:disable-next-line:no-
    ;
    return <Observable<Transaction[]>>this._http.post(environment.apiURL + 'Transaction/save', item);
  }
}
