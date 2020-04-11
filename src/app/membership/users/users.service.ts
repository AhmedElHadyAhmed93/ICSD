import { Injectable } from '@angular/core';
// import { SortingModule } from '../sorting.module';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import {  User } from './users';

import { environment } from '../../../environments/environment';

import { UsersModule } from './users.module';
@Injectable({
  providedIn: 'root'
})
export class UsersService {
  items: any[];
  Usersies: User[];
  Users: User;

  constructor(private http: HttpClient) {
    this.getItems().subscribe(res => (this.items = res));
  }

  // ******* Implement your APIs ********
  getItems(): Observable<User[]> {
    return <Observable<User[]>>this.http.get(environment.apiURL + 'User/GetAll');
  }
  getItemsSimple(): Observable<User[]> {
    return <Observable<User[]>>this.http.get(environment.apiURL + 'User/GetAllSimple');
  }
  addItem(item): Observable<object> {
    return this.http.post(environment.apiURL + 'User/Save', item);
  }
  updateItem(item) {
    //  item.ID = id;
    // item.IsDeleted =false;
    return this.http.post(environment.apiURL + 'User/Save', item);
    /* this.items = this.items.map(i => {
       //  item.IsDeleted =false;
       this.http.post(environment.apiURL+'Users/Save',item);
         return Object.assign({}, i, item);
       }
       return i;
     })
     return of(this.items.slice()).pipe(delay(1000));*/
  }
  removeItem(row) {
    row.IsDeleted = true;
    return this.http.post(environment.apiURL + 'User/Save', row);
  }
  Block(data){
    return this.http.post(environment.apiURL + 'User/Block', data);
  }
  /*getAllPermission(): Observable<Permission[]> {
    return <Observable<Permission[]>>this.http.get(environment.apiURL + 'Permission/GetAll');
  }
  */
}
