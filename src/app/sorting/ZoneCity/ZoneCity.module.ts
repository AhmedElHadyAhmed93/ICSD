import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DataTablesModule } from 'angular-datatables';
import { PageHeaderModule } from '../../shared';
import { ReactiveFormsModule, FormsModule, Validators } from '@angular/forms';
import { ConfirmationPopoverModule } from 'angular-confirmation-popover';
import { ZoneCityRoutingModule } from './ZoneCity-routing.module';
import { ZoneCityComponent } from './ZoneCity.component';
import { ZoneCityService } from './ZoneCity.service';
import { PatternsService } from '../../shared/services/patterns.service';
import { AutocompleteModule } from 'ng2-input-autocomplete';
import { CountryService } from '../country/country.service';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';
import { TranslateModule } from '@ngx-translate/core';
@NgModule({
  imports: [
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    ZoneCityRoutingModule,
    DataTablesModule,
    PageHeaderModule,
    TranslateModule,
    AngularMultiSelectModule,
    AutocompleteModule,
    ConfirmationPopoverModule.forRoot({
      confirmButtonType: 'danger' // set defaults here
    })
  ],
  declarations: [ZoneCityComponent],
  providers: [ZoneCityService, CountryService]
})
export class ZoneCityModule {}
