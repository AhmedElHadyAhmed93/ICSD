import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class LoginsService {
 
  constructor(private http: HttpClient, private translate: TranslateService) {
   
  }

  getLoggedInData (): Observable<any>  {
    return <Observable<any>>this.http.get(environment.apiURL+'Logins/GetLoggedinData');
  }
logout():Observable<any> {
    return <Observable<any>>this.http.get(environment.apiURL+'Logins/Logout');
}
login(username,password):Observable<any> {
  var obj = {
    UserName: username ,
    Password: password
}
  return <Observable<any>>this.http.post(environment.apiURL+'Logins/signin',obj);
}
save(obj) {
    localStorage.setItem('currentLogin', JSON.stringify(obj));
}
get () {
    return JSON.parse(localStorage.getItem('currentLogin'));
        
}
}
