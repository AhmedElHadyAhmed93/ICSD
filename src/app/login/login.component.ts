import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { routerTransition } from '../router.animations';
import { LoginsService } from './login.service';
import { CookieService } from "angular2-cookie/core";
@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    animations: [routerTransition()]
})
export class LoginComponent implements OnInit {
    LoggedInUser: any = {};
    user : any ={}
  

   
   unExpectedError:boolean = false;
   invalidLogin :boolean= false;
    constructor(
        private translate: TranslateService,
        public router: Router,
       public  LoginsService : LoginsService ,
       public _cookieService: CookieService
        ) {
            this.translate.addLangs(['en', 'fr', 'ur', 'es', 'it', 'fa', 'de', 'zh-CHS']);
            this.translate.setDefaultLang('en');
            const browserLang = this.translate.getBrowserLang();
            this.translate.use(browserLang.match(/en|fr|ur|es|it|fa|de|zh-CHS/) ? browserLang : 'en');
         
            
           
        }

    ngOnInit() {}

    onLoggedin() {
      //  localStorage.setItem('isLoggedin', 'true');
    }
    
    viewInvalidLogin(){
        
        this.unExpectedError = false;
        this.invalidLogin = true;
    }
   signIn() {
debugger;
    this.LoginsService.login(this.user.name,this.user.password).subscribe(response=> {
          
        if (response == null) {
                this.viewInvalidLogin();
            }
            else {
          
                localStorage.clear();
                sessionStorage.clear();
                localStorage.setItem('access_token', response.access_token);
                //Cookie.Add('access_token', response.data.access_token);
                this._cookieService.put('access_token', response.access_token)
                localStorage.setItem('isLoggedin', 'true');
                this.router.navigate(['/']);
            }

        });
    }; 

  



}
