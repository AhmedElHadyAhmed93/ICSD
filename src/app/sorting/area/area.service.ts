import { Injectable } from '@angular/core';
import { SortingModule } from '../sorting.module';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Area } from './area';
import { environment } from '../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class AreaService {
  items: Observable<Area[]>;
  cites: Area[];
  area: Area;
  constructor(private http: HttpClient) {

  }
  getItems(selectedArea): Observable<Area[]> {
    return (<Observable<Area[]>>this.http.get(environment.apiURL + 'Area/GetAllByCityId?AreaId=' + selectedArea));
    // this.items;
  }
  addItem(item): Observable<Object> {
    return this.http.post(environment.apiURL + 'Area/save', item);
  }
  updateItem(item) {

    return this.http.post(environment.apiURL + 'Area/save', item);
  }
  removeItem(row) {
    row.IsDeleted = true;
    return this.http.post(environment.apiURL + 'Area/save', row);
  }
}


