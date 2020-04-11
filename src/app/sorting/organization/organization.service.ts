import { Injectable } from '@angular/core';
import { SortingModule } from '../sorting.module';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Organization } from './organization';

import { environment } from '../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class OrganizationService {
  items: any[];
  organizationies: Organization[];
  organization: Organization;
  constructor(private http: HttpClient) {
    // this.getItems().subscribe(res => this.items = res);
  }

  getItems(): Observable<Organization[]> {
    return <Observable<Organization[]>>this.http.get(environment.apiURL + 'Organization/GetAll');
  }
  getItemsSimple(): Observable<Organization[]> {
    return <Observable<Organization[]>>this.http.get(environment.apiURL + 'Organization/GetAllSimple');
  }
  addItem(item): Observable<object> {
    return this.http.post(environment.apiURL + 'Organization/Save', item);
  }
  updateItem(item) {
   return this.http.post(environment.apiURL + 'Organization/Save', item);
  }
  removeItem(row) {
    row.IsDeleted = true;
    return this.http.post(environment.apiURL + 'Organization/Save', row);
  }
}
