import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DataTablesModule } from 'angular-datatables';
import { PageHeaderModule } from '../../shared';
import { ReactiveFormsModule, FormsModule, Validators } from '@angular/forms';
import { ConfirmationPopoverModule } from 'angular-confirmation-popover';
import { ZoneRoutingModule } from './Zone-routing.module';
import { ZoneComponent } from './Zone.component';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    TranslateModule,
    ZoneRoutingModule,
    DataTablesModule,
    PageHeaderModule,
    ConfirmationPopoverModule.forRoot({
      confirmButtonType: 'danger' // set defaults here
    })
  ],
  declarations: [ZoneComponent],
  providers: []
})
export class ZoneModule {}
