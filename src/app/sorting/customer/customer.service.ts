import { Injectable } from '@angular/core';
import { SortingModule } from '../sorting.module';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Customer, CustomerAddresses } from './customer';

import { environment } from '../../../environments/environment';
import { AddInfoToShipment } from '../../operation/add-info-to-shipment/add-info-to-shipment';

@Injectable({
  providedIn: 'root' // SortingModule
})
export class CustomerService {
  items: any[];
  supporties: Customer[];
  support: Customer;
  constructor(private http: HttpClient) {}
  getItems(uType: number): Observable<Customer[]> {
    return uType === 1
      ? <Observable<Customer[]>>this.http.get(environment.apiURL + 'Customer/GetAll')
      : <Observable<Customer[]>>this.http.get(environment.apiURL + 'Courier/GetAll');
  }
  getItemsSimple(uType: number): Observable<Customer[]> {
    return uType === 1
      ? <Observable<Customer[]>>this.http.get(environment.apiURL + 'Customer/GetAllSimple')
      : <Observable<Customer[]>>this.http.get(environment.apiURL + 'Courier/GetAllSimple');
  }
  getCustomerDetails(customerId: number): Observable<Customer> {
    return <Observable<Customer>>this.http.get(environment.apiURL + 'Customer/GetById/' + customerId);
  }
  GetBycode(code: string): Observable<AddInfoToShipment> {

    return <Observable<AddInfoToShipment>>this.http.get(environment.apiURL + 'Customer/GetBycode?code=' + code);
  }
  getAddressesByCustomer(customerId: number): Observable<CustomerAddresses[]> {
    return <Observable<CustomerAddresses[]>>this.http.get(environment.apiURL + 'Customer/GetAddressesByCustomer?customerId=' + customerId);
  }
  getDefaultAddressByCustomer(customerId: number): Observable<CustomerAddresses> {
    return <Observable<CustomerAddresses>>
    this.http.get(environment.apiURL + 'Customer/GetDefaultAddressByCustomer?customerId=' + customerId);
  }
  addItem(item, uType: number): Observable<object> {
    return uType === 1
      ? this.http.post(environment.apiURL + 'Customer/Save', item)
      : this.http.post(environment.apiURL + 'Courier/Save', item);
  }
  updateItem(item, uType: number) {
    return uType === 1
      ? this.http.post(environment.apiURL + 'Customer/Save', item)
      : this.http.post(environment.apiURL + 'Courier/Save', item);
  }
  removeItem(row, uType: number) {
    row.IsDeleted = true;
    return uType === 1
      ? this.http.post(environment.apiURL + 'Customer/Save', row)
      : this.http.post(environment.apiURL + 'Courier/Save', row);
  }
}
