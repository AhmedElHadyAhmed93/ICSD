import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ZoneCity } from './ZoneCity';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ZoneCityService {
  items: Observable<ZoneCity[]>;
  cites: ZoneCity[];
  ZoneCity: ZoneCity;
  constructor(private http: HttpClient) {

  }
  getItemsByID(selectedZoneCity): Observable<ZoneCity[]> {
    return (<Observable<ZoneCity[]>>this.http.get(environment.apiURL + 'ZoneCity/GetById?ID=' + selectedZoneCity));
  }
  getItems(): Observable<ZoneCity[]> {
    return (<Observable<ZoneCity[]>>this.http.get(environment.apiURL + 'ZoneCity/GetAll'  ));
  }
  addItem(item): Observable<Object> {
    return this.http.post(environment.apiURL + 'ZoneCity/save', item);
  }
  updateItem(item) {
   // item.ID = id;
    // item.IsDeleted = false;
    return this.http.post(environment.apiURL + 'ZoneCity/save', item);
  }
  removeItem(row) {
    row.IsDeleted = true;
    return this.http.post(environment.apiURL + 'ZoneCity/save', row);
  }
}


