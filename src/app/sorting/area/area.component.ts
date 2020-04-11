import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { PatternsService } from '../../shared/services/patterns.service';
import { routerTransition } from '../../router.animations';
import { NgForm } from '@angular/forms';
import { Subject } from 'rxjs';

import { DataTableDirective } from 'angular-datatables';
import { Http, Response } from '@angular/http';
import { AreaService } from './area.service';
import { CountryService } from '../country/country.service';
import { CityService } from '../city/city.service';
import { Area } from './area';
import { TranslateService } from '@ngx-translate/core';
import { DataTableLanguageService } from '../../shared/services/datatable-language.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'area-page',
  templateUrl: './area.component.html',
  styleUrls: ['./area.component.css'],
  animations: [routerTransition()],
  providers: [CountryService, CityService, AreaService]
})
export class AreaComponent implements OnInit, AfterViewInit {
  @ViewChild('detailsForm') public detailsForm: NgForm;
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtTrigger: Subject<any> = new Subject();
  list: any[] = [];
  dtOptions: DataTables.Settings = {};
  operation = 'view';
  item: Area;
  Countries: any[];
  SelectedCoutryID: number;
  configCountry: any = { placeholder: 'Select Country', sourceField: ['NameEn'] };

  settings = {
    singleSelection: true,
    text: 'Select Country',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    enableSearchFilter: true,
    badgeShowLimit: 3,
    labelKey: 'Name',
    primaryKey: 'ID'
  };
  selectedItems = [];

  settingsCity = {
    singleSelection: true,
    text: 'Select City',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    enableSearchFilter: true,
    badgeShowLimit: 3,
    labelKey: 'Name',
    primaryKey: 'ID'
  };
  selectedItemsCity = [];

  Cities: any[];
  SelectedCityID: number;
  configCity: any = { placeholder: 'Select City', sourceField: ['NameEn'] };

  constructor(
    private serviceApi: AreaService,
    private cityService: CityService,
    private countryService: CountryService,
    public patterns: PatternsService,
    private http: Http,
    private translate: TranslateService,
    private DataTableLanguage: DataTableLanguageService,
  ) {}

  ngAfterViewInit(): void {
    this.dtTrigger.next();
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.state.clear();
    });
  }
  open = function(_item?: any) {
    this.detailsForm.reset();
    this.operation = _item == null ? 'add' : 'edit';
    switch (this.operation) {
      case 'add':
        this.item = {};
        break;
      case 'edit':
        this.item = Object.assign({}, _item);
        break;
    }
  };
  save = function() {
    this.applySave(this.item);
  };
  delete = function(_item: any) {
    _item.IsDeleted = true;
    this.applySave(_item);
  };
  private applySave = function(item) {
    item.Cities_ID = this.SelectedCityID;
    this.serviceApi.updateItem(item).subscribe(result => {
      const filterResult = this.list.filter(function(element, index, array) {
        return element.ID === result.ID;
      });
      if (filterResult.length === 0) {
        this.list.push(result);
      } else {
        const index: number = this.list.indexOf(filterResult[0]);
        if (result.IsDeleted === undefined || !result.IsDeleted) {
          this.list[index] = Object.assign({}, result);
        } else {
          this.list.splice(index, 1);
        }
      }
      this.refreshDataSource(this.list);
      this.back();
    });
  };
  back = function() {
    if (this.operation !== 'view') {
      this.item = {};
      this.operation = 'view';
    }
  };
  refreshDataSource(list): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.destroy();
      this.list = list;
      this.dtTrigger.next();
    });
  }
  ngOnInit() {
    this.dtOptions = {
      pagingType: 'full_numbers',
      language : this.DataTableLanguage.language,
      stateSave: true
    };
    this.countryService.getItemsSimple().subscribe(list => {
      this.Countries = list;
    });
  }


  onItemSelect(data) {
    this.Cities = [];
    this.SelectedCoutryID = data.ID;
    this.getCity(data);
  }
  OnItemDeSelect(data) {
    this.Cities = [];
    this.SelectedCoutryID = data.ID;
    this.getCity(data);
  }
  onSelectAll(data) {
    this.Cities = [];
    this.SelectedCoutryID = data.ID;
   this.getCity(data);
  }
  getCity(data) {
    this.cityService.getItems(data.ID).subscribe(list => {
      this.Cities = list;
    });
  }
  onDeSelectAll(data) {
    this.Cities = [];
    this.SelectedCoutryID = data.ID;
    this.getCity(data);
  }

  onItemSelectCity(data) {
    this.SelectedCityID = data.ID;
    this.serviceApi.getItems(data.ID).subscribe(list => {
      this.refreshDataSource(list);
    });
  }
  OnItemDeSelectCity(data) {
    this.SelectedCityID = data.ID;
    this.serviceApi.getItems(data.ID).subscribe(list => {
      this.refreshDataSource(list);
    });
  }
  onSelectAllCity(data) {
    this.SelectedCityID = data.ID;
    this.serviceApi.getItems(data.ID).subscribe(list => {
      this.refreshDataSource(list);
    });
  }
  onDeSelectAllCity(data) {
    this.SelectedCityID = data.ID;
    this.serviceApi.getItems(data.ID).subscribe(list => {
      this.refreshDataSource(list);
    });
  }
}
