import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DataTablesModule } from 'angular-datatables';
import { PageHeaderModule } from '../../shared';
import { ReactiveFormsModule, FormsModule, Validators } from '@angular/forms';
import { ConfirmationPopoverModule } from 'angular-confirmation-popover';

import { AddInfoToShipmentComponent } from './add-info-to-shipment.component';

import { PatternsService } from '../../shared/services/patterns.service';
import { AddInfoToShipmentRoutingModule } from './add-info-to-shipment-routing.module';
import { AutocompleteModule } from 'ng2-input-autocomplete';
import { AddInfoToShipmentService } from './add-info-to-shipment.service';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
    imports: [ReactiveFormsModule, FormsModule, CommonModule,
        AddInfoToShipmentRoutingModule, DataTablesModule, PageHeaderModule,TranslateModule, AutocompleteModule,
        ConfirmationPopoverModule.forRoot({
            confirmButtonType: 'danger' // set defaults here
          })],
    declarations: [AddInfoToShipmentComponent],
    providers: [AddInfoToShipmentService]
})
export class AddInfoToShipmentModule { }
