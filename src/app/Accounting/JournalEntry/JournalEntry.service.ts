import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { JournalEntry ,JournalEntrySimple} from './JournalEntry';

import { environment } from '../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class JournalEntryService {
  items: any[];
  JournalEntrys: JournalEntry[];
  JournalEntry: JournalEntry;
  constructor(private http: HttpClient) {
    this.getItems().subscribe(res => this.items = res);
  }
  // ******* Implement your APIs ********
  getItems(): Observable<JournalEntry[]> {
    return <Observable<JournalEntry[]>>this.http.get(environment.apiURL + 'JournalEntry/GetAll');
  }
  getSimpleItems(): Observable<JournalEntrySimple[]> {
    return <Observable<JournalEntrySimple[]>>this.http.get(environment.apiURL + 'JournalEntry/GetAllSimple');
  }
  getItemsbyOrganization(Id): Observable<JournalEntry[]> {
    return <Observable<JournalEntry[]>>this.http.get(environment.apiURL + 'JournalEntry/GetByOrganizationId?OrganizationId=' + Id);
  }

  /* getItemsSimple(): Observable<JournalEntry[]> {
    return <Observable<JournalEntry[]>>this.http.get(environment.apiURL + 'JournalEntry/GetAllSimple');
  } */
  addItem(item): Observable<object> {
    return this.http.post(environment.apiURL + 'JournalEntry/Save', item);
  }
  updateItem(item) {

    // item.IsDeleted =false;
    return this.http.post(environment.apiURL + 'JournalEntry/Save', item);
    // this.items = this.items.map(i => {

    // if(i.ID === id) {
    //   item.ID=id;
    // //  item.IsDeleted =false;
    //   this.http.post(environment.apiURL+'JournalEntry/Save',item);
    //   return Object.assign({}, i, item);
    // }
    // return i;
    // })
    // return of(this.items.slice()).pipe(delay(1000));
  }
  removeItem(row) {
    row.IsDeleted = true;
    return this.http.post(environment.apiURL + 'JournalEntry/Save', row);
    // return this.http.post(environment.apiURL+'JournalEntry/Delete',row.ID );
  }
}
