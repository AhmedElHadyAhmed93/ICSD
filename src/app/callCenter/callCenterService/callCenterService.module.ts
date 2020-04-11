import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DataTablesModule } from 'angular-datatables';
import { PageHeaderModule } from '../../shared';
import { ReactiveFormsModule, FormsModule, Validators } from '@angular/forms';
import { ConfirmationPopoverModule } from 'angular-confirmation-popover';
import { CallCenterRoutingModule } from './callCenterService-routing.module';
import { CallCenterComponent } from './callCenterService.component';
import { AutocompleteModule } from 'ng2-input-autocomplete';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';
import { TranslateModule } from '@ngx-translate/core';
import { NgbTypeaheadModule, NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  imports: [
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    CallCenterRoutingModule,
    TranslateModule,
    DataTablesModule,
    PageHeaderModule,
    AutocompleteModule,
    AngularMultiSelectModule,
    ConfirmationPopoverModule.forRoot({
      confirmButtonType: 'danger' // set defaults here
    }),
    NgbTypeaheadModule.forRoot(),
    NgbDatepickerModule.forRoot()
  ],
  declarations: [CallCenterComponent],
  providers: []
})
export class CallCenterModule {}
