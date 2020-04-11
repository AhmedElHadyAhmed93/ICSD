import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Ticket } from './Ticket';

import { environment } from '../../environments/environment';
import { TranslateService } from '@ngx-translate/core';
@Injectable({
  providedIn: 'root'
})
export class TicketService {
  items: any[];
  Countryies: Ticket[];
  Ticket: Ticket;

  constructor(private http: HttpClient, private translate: TranslateService) {
    this.getItems().subscribe(res => (this.items = res));
  }

  // ******* Implement your APIs ********
  getItems(): Observable<Ticket[]> {
    return <Observable<Ticket[]>>this.http.get(environment.apiURL + 'Ticket/GetAll');
  }

  ChangeLang(lang): Observable<boolean> {
    return <Observable<boolean>>this.http.get(environment.apiURL + 'Setting/ChangeLang?lang=' + lang);
  }

  getItemsSimple(): Observable<Ticket[]> {
    return <Observable<Ticket[]>>this.http.get(environment.apiURL + 'Ticket/GetAllSimple');
  }
  addItem(item): Observable<object> {
    return this.http.post(environment.apiURL + 'Ticket/Save', item);
  }
  updateItem(item) {
    //  item.ID = id;
    // item.IsDeleted =false;
    return this.http.post(environment.apiURL + 'Ticket/Save', item);
    /* this.items = this.items.map(i => {
       //  item.IsDeleted =false;
       this.http.post(environment.apiURL+'Ticket/Save',item);
         return Object.assign({}, i, item);
       }
       return i;
     })
     return of(this.items.slice()).pipe(delay(1000));*/
  }
  removeItem(row) {
    row.IsDeleted = true;
    return this.http.post(environment.apiURL + 'Ticket/Save', row);
  }
}
