import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DataTablesModule } from 'angular-datatables';
import { PageHeaderModule } from '../../shared';
import { ReactiveFormsModule, FormsModule, Validators } from '@angular/forms';
import { ConfirmationPopoverModule } from 'angular-confirmation-popover';

import { DeliveriesAndReturnsComponent } from './deliveries-and-returns.component';
import { DeliveriesAndReturnsService } from './deliveries-and-returns.service';
import { PatternsService } from '../../shared/services/patterns.service';
import { AutocompleteModule } from 'ng2-input-autocomplete';
import { DeliveriesAndReturnsRoutingModule } from './deliveries-and-returns-routing.module';
import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
    imports: [ReactiveFormsModule, FormsModule, CommonModule, NgbDatepickerModule.forRoot(),
        DeliveriesAndReturnsRoutingModule,TranslateModule, DataTablesModule, PageHeaderModule, AutocompleteModule,
        ConfirmationPopoverModule.forRoot({
            confirmButtonType: 'danger' // set defaults here
          })],
    declarations: [DeliveriesAndReturnsComponent],
    providers: [DeliveriesAndReturnsService]
})
export class DeliveriesAndReturnsModule { }
