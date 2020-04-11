import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { BranchAccount } from './BranchAccount';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BranchAccountService {
  items: Observable<BranchAccount[]>;
  cites: BranchAccount[];
  BranchAccount: BranchAccount;
  constructor(private http: HttpClient) {

  }
  getItems(selectedBranchAccount): Observable<BranchAccount[]> {
    // tslint:disable-next-line:max-line-length
    return (<Observable<BranchAccount[]>>this.http.get(environment.apiURL + 'Account/GetAllByMainAccountId?MainAccountId=' + selectedBranchAccount));
  }
  getAll(): Observable<BranchAccount[]> {
    return (<Observable<BranchAccount[]>>this.http.get(environment.apiURL + 'Account/GetAll'));
  }
  getAllٍSimpe(): Observable<BranchAccount[]> {
    return (<Observable<BranchAccount[]>>this.http.get(environment.apiURL + 'Account/GetAllSimple'));
  }
  GetAllByZoneId(selectedBranchAccount): Observable<BranchAccount[]> {
    return (<Observable<BranchAccount[]>>this.http.get(environment.apiURL + 'Account/GetAllByZoneId?ID=' + selectedBranchAccount));
    // this.items;
  }
  addItem(item): Observable<Object> {
    return this.http.post(environment.apiURL + 'Account/save', item);
  }
  updateItem(item) {
    return this.http.post(environment.apiURL + 'Account/save', item);
  }
  removeItem(row) {
    row.IsDeleted = true;
    return this.http.post(environment.apiURL + 'Account/save', row);
  }
}


