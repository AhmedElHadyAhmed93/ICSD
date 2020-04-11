import { Injectable } from "@angular/core";
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpHeaders, HttpResponse, HttpErrorResponse } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { finalize, map,catchError } from "rxjs/operators";
import { LoaderService } from "./loader.service";
import { Router } from "../../../../node_modules/@angular/router";
import { TranslateService } from "../../../../node_modules/@ngx-translate/core";
@Injectable()
export class LoaderInterceptor implements HttpInterceptor {
    constructor(public loaderService: LoaderService,public router: Router,  private translate: TranslateService) { }
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const browserLang = this.translate.getBrowserLang();
        const dom: any = document.querySelector('body').classList.contains("rtl");;
        console.log(dom);

        const authReq = req.clone({
            headers: new HttpHeaders({
              'Content-Type':  'application/json',
              'Authorization': 'bearer ' + localStorage.getItem('access_token'),
              'Accept-Language':(!dom) ? 'en-US' :  'ar-EG'
            })
          });
        this.loaderService.show();


        return next.handle(authReq).pipe(
            finalize(() => { this.loaderService.hide()})
            ,catchError((error: HttpErrorResponse) => {
                let data = {};
                data = {
                    reason: error && error.error.reason ? error.error.reason : '',
                    status: error.status
                };
                if(error.status ==401){
                    this.router.navigate(['/login']);

                }
          
                return throwError(error);
            }));
        
      /*  return next.handle(authReq).pipe(
        
            finalize(() => this.loaderService.hide())
        );*/
    }
}