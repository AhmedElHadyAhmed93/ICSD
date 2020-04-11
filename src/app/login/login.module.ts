import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { LoginRoutingModule } from './login-routing.module';
import { LoginComponent } from './login.component';
import { CookieService } from '../../../node_modules/angular2-cookie/core';
import { FormsModule } from '../../../node_modules/@angular/forms';

@NgModule({
    imports: [
        CommonModule,
        TranslateModule,
        FormsModule,
        LoginRoutingModule],
        providers:[CookieService],
    declarations: [LoginComponent]
})
export class LoginModule {}
