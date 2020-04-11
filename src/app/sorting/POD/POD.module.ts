import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DataTablesModule } from 'angular-datatables';
import { PageHeaderModule } from '../../shared';
import { ReactiveFormsModule, FormsModule, Validators } from '@angular/forms';
import { ConfirmationPopoverModule } from 'angular-confirmation-popover';
import { PODRoutingModule } from './POD-routing.module';
import { PODComponent } from './POD.component';
import { AutocompleteModule } from 'ng2-input-autocomplete';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    PODRoutingModule,
    TranslateModule,
    DataTablesModule,
    PageHeaderModule,
    AutocompleteModule,
    AngularMultiSelectModule,
    ConfirmationPopoverModule.forRoot({
      confirmButtonType: 'danger' // set defaults here
    })
  ],
  declarations: [PODComponent],
  providers: []
})
export class PODModule {}
