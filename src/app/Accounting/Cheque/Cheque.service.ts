import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Cheque } from './Cheque';

import { environment } from '../../../environments/environment';

import { ChequeModule } from './Cheque.module';
import { TranslateService } from '@ngx-translate/core';
@Injectable({
  providedIn: 'root'
})
export class ChequeService {
  items: any[];
  Chequeies: Cheque[];
  Cheque: Cheque;

  constructor(private http: HttpClient, private translate: TranslateService) {
    this.getItems().subscribe(res => (this.items = res));
  }

  // ******* Implement your APIs ********
  getItems(): Observable<Cheque[]> {
    return <Observable<Cheque[]>>this.http.get(environment.apiURL + 'Cheque/GetAll');
  }

  addItem(item): Observable<object> {
    return this.http.post(environment.apiURL + 'Cheque/Save', item);
  }
  updateItem(item) {
    //  item.ID = id;
    // item.IsDeleted =false;
    debugger;
    return this.http.post(environment.apiURL + 'Cheque/Save', item);
    /* this.items = this.items.map(i => {
       //  item.IsDeleted =false;
       this.http.post(environment.apiURL+'Cheque/Save',item);
         return Object.assign({}, i, item);
       }
       return i;
     })
     return of(this.items.slice()).pipe(delay(1000));*/
  }
  removeItem(row) {
    row.IsDeleted = true;
    return this.http.post(environment.apiURL + 'Cheque/Save', row);
  }
}
