import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DataTablesModule } from 'angular-datatables';
import { PageHeaderModule } from '../../shared';
import { ReactiveFormsModule, FormsModule, Validators } from '@angular/forms';
import { ConfirmationPopoverModule } from 'angular-confirmation-popover';
import { BranchAccountRoutingModule } from './BranchAccount-routing.module';
import { BranchAccountComponent } from './BranchAccount.component';
import { BranchAccountService } from './BranchAccount.service';
import { PatternsService } from '../../shared/services/patterns.service';
import { AutocompleteModule } from 'ng2-input-autocomplete';
import { MainAccountService } from '../MainAccount/MainAccount.service';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';
import { TranslateModule } from '@ngx-translate/core';
@NgModule({
  imports: [
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    BranchAccountRoutingModule,
    DataTablesModule,
    PageHeaderModule,
    TranslateModule,
    AngularMultiSelectModule,
    AutocompleteModule,
    ConfirmationPopoverModule.forRoot({
      confirmButtonType: 'danger' // set defaults here
    })
  ],
  declarations: [BranchAccountComponent],
  providers: [BranchAccountService, MainAccountService]
})
export class BranchAccountModule {}
