import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Currency } from '../entities/currency';
import { LoginsService } from '../../login/login.service';

@Injectable({
  providedIn: 'root'
})
export class LoggedInUserService {

  public LoggedInUser :any;
  constructor(private LoginsService : LoginsService){
    this.LoginsService.getLoggedInData().subscribe(response=>{
        this.LoggedInUser = response;

     });
  }

  getUser():Observable<any>{
      return this.LoggedInUser;
  }
}
