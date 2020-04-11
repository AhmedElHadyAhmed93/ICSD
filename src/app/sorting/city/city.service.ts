import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { City } from './city';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CityService {
  items: Observable<City[]>;
  cites: City[];
  city: City;
  constructor(private http: HttpClient) {

  }
  getItems(selectedCity): Observable<City[]> {
    return (<Observable<City[]>>this.http.get(environment.apiURL + 'City/GetAllByCountryId?countryId=' + selectedCity));
    // this.items;
  }
  getAll(): Observable<City[]> {
    return (<Observable<City[]>>this.http.get(environment.apiURL + 'City/GetAll'));
    // this.items;
  }
  getAllٍSimpe(): Observable<City[]> {
    return (<Observable<City[]>>this.http.get(environment.apiURL + 'City/GetAllSimple'));
    // this.items;
  }
  GetAllByZoneId(selectedCity): Observable<City[]> {
    return (<Observable<City[]>>this.http.get(environment.apiURL + 'City/GetAllByZoneId?ID=' + selectedCity));
    // this.items;
  }
  addItem(item): Observable<Object> {
    return this.http.post(environment.apiURL + 'City/save', item);
  }
  updateItem(item) {
   // item.ID = id;
    //item.IsDeleted = false;
    return this.http.post(environment.apiURL + 'City/save', item);
  }
  removeItem(row) {
    row.IsDeleted = true;
    return this.http.post(environment.apiURL + 'City/save', row);
  }
}


