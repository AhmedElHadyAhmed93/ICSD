import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { MainAccount } from './MainAccount';

import { environment } from '../../../environments/environment';

import { MainAccountModule } from './MainAccount.module';
import { TranslateService } from '@ngx-translate/core';
@Injectable({
  providedIn: 'root'
})
export class MainAccountService {
  items: any[];
  MainAccounties: MainAccount[];
  MainAccount: MainAccount;

  constructor(private http: HttpClient, private translate: TranslateService) {
    this.getItems().subscribe(res => (this.items = res));
  }

  // ******* Implement your APIs ********
  getItems(): Observable<MainAccount[]> {
    return <Observable<MainAccount[]>>this.http.get(environment.apiURL + 'Account/GetAll');
  }
  getItemsSimple(): Observable<MainAccount[]> {
    return <Observable<MainAccount[]>>this.http.get(environment.apiURL + 'Account/GetAllSimple');
  }
  addItem(item): Observable<object> {
    return this.http.post(environment.apiURL + 'Account/Save', item);
  }
  updateItem(item) {
    //  item.ID = id;
    // item.IsDeleted =false;
    return this.http.post(environment.apiURL + 'Account/Save', item);
    /* this.items = this.items.map(i => {
       //  item.IsDeleted =false;
       this.http.post(environment.apiURL+'MainAccount/Save',item);
         return Object.assign({}, i, item);
       }
       return i;
     })
     return of(this.items.slice()).pipe(delay(1000));*/
  }
  removeItem(row) {
    row.IsDeleted = true;
    return this.http.post(environment.apiURL + 'Account/Save', row);
  }
}
