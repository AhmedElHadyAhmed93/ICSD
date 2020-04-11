import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { CallCenter, CallCenterSearch, CallCenterGrid } from './callCenterService';

import { environment } from '../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class  CallCenterService {
  items: any[];


  constructor(private http: HttpClient) {
    // this.getItems().subscribe(res => this.items = res);
  }

  // ******* Implement your APIs ********

  // getItems(data): Observable<ShipmentBOD[]> {
  //   return <Observable<ShipmentBOD[]>>this.http.post(environment.apiURL + 'POD/GetAllPOD', data);
  // }
  // save(data): Observable<ShipmentBOD[]> {
  //   return <Observable<ShipmentBOD[]>>this.http.post(environment.apiURL + 'POD/Save', data);
  // }
  // getDeliverAgency(): Observable<ShipmentBOD[]> {
  //   return <Observable<ShipmentBOD[]>>this.http.get(environment.apiURL + 'DeliverAcencies/GetAll');
  // }
  // getItemsSimple(): Observable<ShipmentBOD[]> {
  //   return <Observable<ShipmentBOD[]>>this.http.get(environment.apiURL + 'ShipmentBOD/GetAllSimple');
  // }
  // addItem(item): Observable<object> {
  //   return this.http.post(environment.apiURL + 'ShipmentBOD/Save', item);
  // }
  Search(item): Observable<CallCenterGrid[]> {
    return <Observable<CallCenterGrid[]>>this.http.post(environment.apiURL + 'CallCenter/Search', item);
  }

  updateItem(item) {
     return this.http.post(environment.apiURL + 'CallCenter/Save', item);
   }
  // removeItem(row) {
  //   row.IsDeleted = true;
  //   return this.http.post(environment.apiURL + 'ShipmentBOD/Save', row);
  // }
}
