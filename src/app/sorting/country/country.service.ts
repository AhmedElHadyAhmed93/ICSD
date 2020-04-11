import { Injectable } from '@angular/core';
import { SortingModule } from '../sorting.module';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Country } from './country';

import { environment } from '../../../environments/environment';

import { CountryModule } from './country.module';
import { TranslateService } from '@ngx-translate/core';
@Injectable({
  providedIn: 'root'
})
export class CountryService {
  items: any[];
  Countryies: Country[];
  Country: Country;

  constructor(private http: HttpClient, private translate: TranslateService) {
    this.getItems().subscribe(res => (this.items = res));
  }

  // ******* Implement your APIs ********
  getItems(): Observable<Country[]> {
    return <Observable<Country[]>>this.http.get(environment.apiURL + 'Country/GetAll');
  }
  getItemsSimple(): Observable<Country[]> {
    return <Observable<Country[]>>this.http.get(environment.apiURL + 'Country/GetAllSimple');
  }
  addItem(item): Observable<object> {
    return this.http.post(environment.apiURL + 'Country/Save', item);
  }
  updateItem(item) {
    //  item.ID = id;
    // item.IsDeleted =false;
    return this.http.post(environment.apiURL + 'Country/Save', item);
    /* this.items = this.items.map(i => {
       //  item.IsDeleted =false;
       this.http.post(environment.apiURL+'Country/Save',item);
         return Object.assign({}, i, item);
       }
       return i;
     })
     return of(this.items.slice()).pipe(delay(1000));*/
  }
  removeItem(row) {
    row.IsDeleted = true;
    return this.http.post(environment.apiURL + 'Country/Save', row);
  }
}
