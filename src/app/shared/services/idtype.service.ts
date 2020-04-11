import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IDType } from '../../sorting/transaction/idtype';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class IDTypeService {

  constructor(private _http: HttpClient) { }

  getAll(): Observable<IDType[]> {
    return <Observable<IDType[]>>this._http.get(environment.apiURL + 'IDType/GetAll');
  }
}
