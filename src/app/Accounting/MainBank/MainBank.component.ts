import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { PatternsService } from '../../shared/services/patterns.service';
import { routerTransition } from '../../router.animations';
import { NgForm } from '@angular/forms';
import { Subject } from 'rxjs';

import { CountryService } from '../../sorting/country/country.service';
import { CityService } from '../../sorting/city/city.service';

import { DataTableDirective } from 'angular-datatables';
import { Http, Response } from '@angular/http';
import { MainBankService } from './MainBank.service';
import { MainBank } from './MainBank';
import { DataTableLanguageService } from '../../shared/services/datatable-language.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'MainBank-page',
  templateUrl: './MainBank.component.html',
  // styleUrls: ['./MaxinBank.component.scss'],
  animations: [routerTransition()],
  providers: [CountryService, CityService]
})
export class MainBankComponent implements OnInit, AfterViewInit {
  @ViewChild('detailsForm') public detailsForm: NgForm;
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;

  dtTrigger: Subject<any> = new Subject();
  list: MainBank[] = [];
  dtOptions: DataTables.Settings = {};
  operation = 'view';
  item: any = {};
  SelectedCoutryID: number;
  Cities: any[];
  Countries: any[];
  selectedCities = [];
  selectedCountries = [];
  settings = {
    singleSelection: true,
    text: 'Select Item',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    enableSearchFilter: true,
    badgeShowLimit: 3,
    labelKey: 'Name',
    primaryKey: 'ID'
  };
  SelectedCityID: number;
  constructor(private serviceApi: MainBankService,
    private DataTableLanguage: DataTableLanguageService,
    private countryService: CountryService,
    private cityService: CityService,

     public patterns: PatternsService, private http: Http) {
      this.dtOptions = {
        pagingType: 'full_numbers',
        language : this.DataTableLanguage.language,
        stateSave: true
      };
    }
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
      debugger;
       const countryID = _item.Cities.Countries.ID;

       this.selectedCountries = [this.Countries.filter(
         item => item.ID === countryID
      )[0]];

       this.GetCities(countryID, _item.CityID);
      this.selectedCities = [];
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
    item.CityID = this.selectedCities[0].ID;
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

    this.serviceApi.getItems().subscribe(list => {
      this.refreshDataSource(list);
    });
    this.countryService.getItemsSimple().subscribe(list => {
      this.Countries = list;
    });
  }
  OnCountryDeSelect() {
    this.Cities = [];
    this.SelectedCityID = null;
  }
  CountrySelected(event) {
    this.Cities = [];
    this.SelectedCoutryID = event.ID;
    this.GetCities(event.ID);
  }
  GetCities(ID, cityID= 0) {
    this.cityService.getItems(ID).subscribe(list => {
      this.Cities = list;
      if (cityID !== 0) { this.selectedCities.push(
        this.Cities.filter(
          item => item.ID === cityID
        )[0]
      ); }

    });
  }
  CitySelected(event) {
    this.SelectedCityID = event.ID;
  }
  OnCityDeSelect() {
  }

}
