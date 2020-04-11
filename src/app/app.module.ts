import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthGuard } from './shared';
import { PatternsService } from './shared/services/patterns.service';
import { HttpModule } from '@angular/http';
import { DataTableLanguageService } from './shared/services/datatable-language.service';
import { LoginsService } from './login/login.service';
import { LoaderInterceptor } from './shared/loader/loader.interceptor';
import { ExcelService } from './shared/services/excel.service';
import { LoaderService } from './shared/loader/loader.service';
import { LoggedInUserService } from './shared/services/LoggedInUser.service';

// AoT requires an exported function for factories
export const createTranslateLoader = (http: HttpClient) => {
  /* for development
    return new TranslateHttpLoader(
        http,
        '/start-angular/SB-Admin-BS4-Angular-6/master/dist/assets/i18n/',
        '.json'
    ); */
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
};

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    HttpModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient]
      },
      useDefaultLang: true
    }),
    AppRoutingModule
  ],
  declarations: [AppComponent],
  providers: [AuthGuard,PatternsService,DataTableLanguageService,LoginsService,LoggedInUserService,LoaderService,
    { provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptor, multi: true },ExcelService],
  bootstrap: [AppComponent]
})
export class AppModule {}
