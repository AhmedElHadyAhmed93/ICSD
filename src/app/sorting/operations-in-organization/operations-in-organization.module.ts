import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DataTablesModule } from 'angular-datatables';
import { PageHeaderModule } from '../../shared';
import { ReactiveFormsModule, FormsModule, Validators } from '@angular/forms';
import { ConfirmationPopoverModule } from 'angular-confirmation-popover';

import { OperationsInOrganizationRoutingModule } from './operations-in-organization-routing.module';


import { OperationsInOrganizationService } from './operations-in-organization.service';
import { OperationsInOrganizationComponent } from './operations-in-organization.component';
import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { AutocompleteModule } from 'ng2-input-autocomplete';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
    imports: [ReactiveFormsModule, FormsModule, CommonModule, NgbDatepickerModule.forRoot(),
        OperationsInOrganizationRoutingModule, DataTablesModule, PageHeaderModule, AutocompleteModule,TranslateModule,
        ConfirmationPopoverModule.forRoot({
            confirmButtonType: 'danger' // set defaults here
          })],
    declarations: [OperationsInOrganizationComponent],
    providers: [OperationsInOrganizationService]
})
export class OperationsInOrganizationModule { }
