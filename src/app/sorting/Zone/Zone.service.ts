import { Injectable } from '@angular/core';
import { SortingModule } from '../sorting.module';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Zone } from './Zone';

import { environment } from '../../../environments/environment';

import { ZoneModule } from './Zone.module';
import { TranslateService } from '@ngx-translate/core';
@Injectable({
  providedIn: 'root'
})
export class ZoneService {
  items: any[];
  Zoneies: Zone[];
  Zone: Zone;

  constructor(private http: HttpClient, private translate: TranslateService) {
    this.getItems().subscribe(res => (this.items = res));
  }

  // ******* Implement your APIs ********
  getItems(): Observable<Zone[]> {
    return <Observable<Zone[]>>this.http.get(environment.apiURL + 'Zone/GetAll');
  }
  getItemsSimple(): Observable<Zone[]> {
    return <Observable<Zone[]>>this.http.get(environment.apiURL + 'Zone/GetAllSimple');
  }
  addItem(item): Observable<object> {
    return this.http.post(environment.apiURL + 'Zone/Save', item);
  }
  updateItem(item) {
    //  item.ID = id;
    // item.IsDeleted =false;
    return this.http.post(environment.apiURL + 'Zone/Save', item);
    /* this.items = this.items.map(i => {
       //  item.IsDeleted =false;
       this.http.post(environment.apiURL+'Zone/Save',item);
         return Object.assign({}, i, item);
       }
       return i;
     })
     return of(this.items.slice()).pipe(delay(1000));*/
  }
  removeItem(row) {
    row.IsDeleted = true;
    return this.http.post(environment.apiURL + 'Zone/Save', row);
  }
}
