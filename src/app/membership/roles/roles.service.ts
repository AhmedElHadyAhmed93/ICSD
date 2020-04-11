import { Injectable } from '@angular/core';
// import { SortingModule } from '../sorting.module';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import {  Role } from './roles';

import { environment } from '../../../environments/environment';

import { RolesModule } from './roles.module';
import { Permission } from './permission';
@Injectable({
  providedIn: 'root'
})
export class RolesService {
  items: any[];
  rolesies: Role[];
  roles: Role;

  constructor(private http: HttpClient) {
    this.getItems().subscribe(res => (this.items = res));
  }

  // ******* Implement your APIs ********
  getItems(): Observable<Role[]> {
    return <Observable<Role[]>>this.http.get(environment.apiURL + 'Role/GetAll');
  }
  getItemsSimple(): Observable<Role[]> {
    return <Observable<Role[]>>this.http.get(environment.apiURL + 'Role/GetAllSimple');
  }
  addItem(item): Observable<object> {
    return this.http.post(environment.apiURL + 'Role/Save', item);
  }
  updateItem(item) {
    //  item.ID = id;
    // item.IsDeleted =false;
    return this.http.post(environment.apiURL + 'Role/Save', item);
    /* this.items = this.items.map(i => {
       //  item.IsDeleted =false;
       this.http.post(environment.apiURL+'roles/Save',item);
         return Object.assign({}, i, item);
       }
       return i;
     })
     return of(this.items.slice()).pipe(delay(1000));*/
  }
  removeItem(row) {
    row.IsDeleted = true;
    return this.http.post(environment.apiURL + 'Role/Save', row);
  }
  getAllPermission(): Observable<Permission[]> {
    return <Observable<Permission[]>>this.http.get(environment.apiURL + 'Permission/GetAll');
  }
  
}
