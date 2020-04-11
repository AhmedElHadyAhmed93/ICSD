import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DataTablesModule } from 'angular-datatables';
import { PageHeaderModule } from '../../shared';
import { ReactiveFormsModule, FormsModule, Validators } from '@angular/forms';
import { ConfirmationPopoverModule } from 'angular-confirmation-popover';
import { SalesRoutingModule } from './sales-routing.module';
import { SalesComponent } from './sales.component';
import { TranslateModule } from '@ngx-translate/core';

import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';

@NgModule({
  imports: [
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    TranslateModule,
    SalesRoutingModule,
    DataTablesModule,
    PageHeaderModule,
    AngularMultiSelectModule,
    ConfirmationPopoverModule.forRoot({
      confirmButtonType: 'danger' // set defaults here
    })
  ],
  declarations: [SalesComponent],
  providers: []
})
export class SalesModule {}
