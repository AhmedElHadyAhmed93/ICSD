import { Injectable } from '@angular/core';
import { SortingModule } from '../sorting.module';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { CustomerAddresses } from './customer';
import 'rxjs/add/operator/map';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CustomerAddressService {

  constructor(private http: HttpClient) { }

  getByCustomer(customerId: number): Observable<CustomerAddresses[]> {
    return <Observable<CustomerAddresses[]>>this.http.get(environment.apiURL + 'Customer/GetAddressesByCustomer?customerId=' + customerId);
  }
}
