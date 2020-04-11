import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DataTablesModule } from 'angular-datatables';
import { PageHeaderModule } from '../../shared';
import { ReactiveFormsModule, FormsModule, Validators } from '@angular/forms';
import { ConfirmationPopoverModule } from 'angular-confirmation-popover';
import { PatternsService } from '../../shared/services/patterns.service';
import { ShipmentComponent } from './shipment.component';
import { ShipmentRoutingModule } from './shipment-routing.module';
import { ShipmentListComponent } from './shipment-list/shipment-list.component';
import { NgbTypeaheadModule, NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';

import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';
import { FileUploadModule } from 'ng2-file-upload';
import { TranslateModule } from '@ngx-translate/core';
@NgModule({
  imports: [
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    TranslateModule,
    ShipmentRoutingModule,
    DataTablesModule,
    PageHeaderModule,
    FileUploadModule ,
    AngularMultiSelectModule,
    ConfirmationPopoverModule.forRoot({
      confirmButtonType: 'danger' // set defaults here
    }),
    NgbTypeaheadModule.forRoot(),
    NgbDatepickerModule.forRoot()
  ],
  declarations: [
    ShipmentComponent,
    ShipmentListComponent
  ],
  providers: []
})
export class ShipmentModule {}
