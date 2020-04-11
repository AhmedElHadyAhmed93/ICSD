import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DataTablesModule } from 'angular-datatables';
import { PageHeaderModule } from '../shared';
import { ReactiveFormsModule, FormsModule, Validators } from '@angular/forms';
import { ConfirmationPopoverModule } from 'angular-confirmation-popover';
import { TicketRoutingModule } from './ticket-routing.module';
import { TicketComponent } from './ticket.component';
import { TranslateModule } from '@ngx-translate/core';

import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';

@NgModule({
  imports: [
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    TranslateModule,
    TicketRoutingModule,
    DataTablesModule,
    PageHeaderModule,
    AngularMultiSelectModule,
    ConfirmationPopoverModule.forRoot({
      confirmButtonType: 'danger' // set defaults here
    })
  ],
  declarations: [TicketComponent],
  providers: []
})
export class TicketModule {}
