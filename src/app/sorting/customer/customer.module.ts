import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DataTablesModule } from 'angular-datatables';
import { PageHeaderModule } from '../../shared';
import { ReactiveFormsModule, FormsModule, Validators } from '@angular/forms';
import { ConfirmationPopoverModule } from 'angular-confirmation-popover';

import { CustomerComponent } from './customer.component';
import { CustomerService } from './customer.service';
import { PatternsService } from '../../shared/services/patterns.service';
import { CustomerRoutingModule } from './customer-routing.module';
import { AutocompleteModule } from 'ng2-input-autocomplete';
import { TranslateModule } from '@ngx-translate/core';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';


@NgModule({
    imports: [ReactiveFormsModule, AngularMultiSelectModule, FormsModule, CommonModule, TranslateModule,
        CustomerRoutingModule, DataTablesModule, PageHeaderModule, AutocompleteModule,
        ConfirmationPopoverModule.forRoot({
            confirmButtonType: 'danger' // set defaults here
          })],
    declarations: [CustomerComponent],
    providers: [CustomerService]
})
export class CustomerModule { }
