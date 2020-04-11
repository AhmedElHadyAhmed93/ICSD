import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TransactionRoutingModule } from './transaction-routing.module';
import { TransactionComponent } from './transaction.component';
import { TransactionListComponent } from './transaction-list/transaction-list.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';
import { PageHeaderModule } from '../../shared';
import { ConfirmationPopoverModule } from 'angular-confirmation-popover';
import { NgbTypeaheadModule, NgbDatepickerModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';
import { AutocompleteModule } from 'ng2-input-autocomplete';
import { VarDirective } from '../../shared/directives/variable.directive';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [TransactionComponent, TransactionListComponent, VarDirective],
  imports: [
    ReactiveFormsModule,
    FormsModule,
    TranslateModule,

    CommonModule,
    TransactionRoutingModule,
    DataTablesModule,
    PageHeaderModule,
    AngularMultiSelectModule,
    AutocompleteModule,
    ConfirmationPopoverModule.forRoot({
      confirmButtonType: 'danger' // set defaults here
    }),
    NgbTypeaheadModule.forRoot(),
    NgbDatepickerModule.forRoot(),
    NgbModalModule
  ]
})
export class TransactionModule {}
