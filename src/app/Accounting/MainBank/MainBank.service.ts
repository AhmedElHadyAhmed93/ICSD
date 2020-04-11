import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { MainBank } from './MainBank';

import { environment } from '../../../environments/environment';

import { MainBankModule } from './MainBank.module';
import { TranslateService } from '@ngx-translate/core';
@Injectable({
  providedIn: 'root'
})
export class MainBankService {
  items: any[];
  MainBankies: MainBank[];
  MainBank: MainBank;

  constructor(private http: HttpClient, private translate: TranslateService) {
    this.getItems().subscribe(res => (this.items = res));
  }

  // ******* Implement your APIs ********
  getItems(): Observable<MainBank[]> {
    return <Observable<MainBank[]>>this.http.get(environment.apiURL + 'Bank/GetAllParentBanks');
  }
  getItemsSimple(): Observable<MainBank[]> {
    return <Observable<MainBank[]>>this.http.get(environment.apiURL + 'Bank/GetAllParentBanks');
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
       this.http.post(environment.apiURL+'MainBank/Save',item);
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
