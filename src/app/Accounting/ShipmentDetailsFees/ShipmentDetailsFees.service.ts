import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ShipmentDetailsFees } from './ShipmentDetailsFees';

import { environment } from '../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class  ShipmentDetailsFeesService {
  items: any[];


  constructor(private http: HttpClient) {
    // this.getItems().subscribe(res => this.items = res);
  }

  // ******* Implement your APIs ********

   getItems(): Observable<ShipmentDetailsFees[]> {
     return <Observable<ShipmentDetailsFees[]>>this.http.get(environment.apiURL + 'ShipmentDetailsFees/GetAll');
   }
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
   Search(item): Observable<ShipmentDetailsFees[]> {
     return <Observable<ShipmentDetailsFees[]>>this.http.post(environment.apiURL + 'ShipmentDetailsFees/Search', item);
   }

   ComfirmShipment(item) {
      return this.http.post(environment.apiURL + 'ShipmentDetailsFees/ComfirmShipment', item);
    }
    ConvertShipmentFeesItemsToComfirm(item) {
      return this.http.post(environment.apiURL + 'ShipmentDetailsFees/ConvertShipmentFeesItemsToComfirm', item);
    }
  // removeItem(row) {
  //   row.IsDeleted = true;
  //   return this.http.post(environment.apiURL + 'ShipmentBOD/Save', row);
  // }
}
