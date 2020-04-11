import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Currency } from '../entities/currency';
import { TranslateService } from '../../../../node_modules/@ngx-translate/core';
import { DataTableDirective } from 'angular-datatables';
@Injectable({
  providedIn: 'root'
})
export class DataTableLanguageService {
 
  paginate: DataTables.LanguagePaginateSettings;
  language: DataTables.LanguageSettings;
  constructor() {
    this.language = {};   
  }


  
}
