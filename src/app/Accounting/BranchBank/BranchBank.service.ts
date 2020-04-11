import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { BranchBank } from './BranchBank';

import { environment } from '../../../environments/environment';

import { BranchBankModule } from './BranchBank.module';
import { TranslateService } from '@ngx-translate/core';
@Injectable({
  providedIn: 'root'
})
export class BranchBankService {
  items: any[];
  BranchBankies: BranchBank[];
  BranchBank: BranchBank;

  constructor(private http: HttpClient, private translate: TranslateService) {
    this.getItems().subscribe(res => (this.items = res));
  }

  // ******* Implement your APIs ********
  getItems(): Observable<BranchBank[]> {
    return <Observable<BranchBank[]>>this.http.get(environment.apiURL + 'Bank/GetAllParentBanks');
  }
  GetAllBranchBanks(ID): Observable<BranchBank[]> {
    return <Observable<BranchBank[]>>this.http.get(environment.apiURL + 'Bank/GetAllBranchBanks?ID=' + ID);
  }
  getItemsSimple(): Observable<BranchBank[]> {
    return <Observable<BranchBank[]>>this.http.get(environment.apiURL + 'Bank/GetAllSimple');
  }
  addItem(item): Observable<object> {
    return this.http.post(environment.apiURL + 'Bank/Save', item);
  }
  updateItem(item) {
    //  item.ID = id;
    // item.IsDeleted =false;
    return this.http.post(environment.apiURL + 'Bank/Save', item);
    /* this.items = this.items.map(i => {
       //  item.IsDeleted =false;
       this.http.post(environment.apiURL+'BranchBank/Save',item);
         return Object.assign({}, i, item);
       }
       return i;
     })
     return of(this.items.slice()).pipe(delay(1000));*/
  }
  removeItem(row) {
    row.IsDeleted = true;
    return this.http.post(environment.apiURL + 'Bank/Save', row);
  }
}
