import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Sales } from './sales';

import { environment } from '../../../environments/environment';
import { TranslateService } from '@ngx-translate/core';
@Injectable({
  providedIn: 'root'
})
export class SalesService {
  items: any[];
  Countryies: Sales[];
  Sales: Sales;

  constructor(private http: HttpClient, private translate: TranslateService) {
    this.getItems().subscribe(res => (this.items = res));
  }

  // ******* Implement your APIs ********
  getItems(): Observable<Sales[]> {
    return <Observable<Sales[]>>this.http.get(environment.apiURL + 'Sales/GetAll');
  }
  getItemsSimple(): Observable<Sales[]> {
    return <Observable<Sales[]>>this.http.get(environment.apiURL + 'Sales/GetAllSimple');
  }
  addItem(item): Observable<object> {
    return this.http.post(environment.apiURL + 'Sales/Save', item);
  }
  updateItem(item) {
    //  item.ID = id;
    // item.IsDeleted =false;
    return this.http.post(environment.apiURL + 'Sales/Save', item);
    /* this.items = this.items.map(i => {
       //  item.IsDeleted =false;
       this.http.post(environment.apiURL+'Sales/Save',item);
         return Object.assign({}, i, item);
       }
       return i;
     })
     return of(this.items.slice()).pipe(delay(1000));*/
  }
  removeItem(row) {
    row.IsDeleted = true;
    return this.http.post(environment.apiURL + 'Sales/Save', row);
  }
}
