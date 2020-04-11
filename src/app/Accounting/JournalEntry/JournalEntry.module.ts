import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DataTablesModule } from 'angular-datatables';
import { PageHeaderModule } from '../../shared';
import { ReactiveFormsModule, FormsModule, Validators } from '@angular/forms';
import { ConfirmationPopoverModule } from 'angular-confirmation-popover';
import { JournalEntryRoutingModule } from './JournalEntry-routing.module';
import { JournalEntryComponent } from './JournalEntry.component';
import { JournalEntryService } from './JournalEntry.service';
import { PatternsService } from '../../shared/services/patterns.service';
import { AutocompleteModule } from 'ng2-input-autocomplete';
import { TranslateModule } from '@ngx-translate/core';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';
import { BranchAccountService } from '../BranchAccount/BranchAccount.service';

import { NgbTypeaheadModule, NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  imports: [
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    JournalEntryRoutingModule,
    AngularMultiSelectModule,
    DataTablesModule,
    PageHeaderModule,
    AutocompleteModule,
    TranslateModule,
    ConfirmationPopoverModule.forRoot({
      confirmButtonType: 'danger' // set defaults here
    }),
    NgbTypeaheadModule.forRoot(),
    NgbDatepickerModule.forRoot()
  ],
  declarations: [JournalEntryComponent],
  providers: [JournalEntryService,BranchAccountService]
})
export class JournalEntryModule {}
