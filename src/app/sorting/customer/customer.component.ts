import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { PatternsService } from '../../shared/services/patterns.service';
import { routerTransition } from '../../router.animations';
import { NgForm } from '@angular/forms';
import { Subject } from 'rxjs';

import { DataTableDirective } from 'angular-datatables';
import { CustomerService } from './customer.service';
import { Router } from '@angular/router';
import { CountryService } from '../country/country.service';
import { ZoneService } from '../Zone/Zone.service';

import { CityService } from '../city/city.service';
import { AreaService } from '../area/area.service';
import { Customer } from './customer';
import { TranslateService } from '@ngx-translate/core';
import { DataTableLanguageService } from '../../shared/services/datatable-language.service';
@Component({
  // tslint:disable-next-line:component-selector
  selector: 'customer-page',
  templateUrl: './customer.component.html',
  // styleUrls: ['./customer.component.scss'],
  animations: [routerTransition()],
  providers: [CountryService, CityService]
})
export class CustomerComponent implements OnInit, AfterViewInit {
  @ViewChild('detailsForm') public detailsForm: NgForm;
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;

  dtTrigger: Subject<any> = new Subject();
  list: any[] = [];
  dtOptions: DataTables.Settings = {};
  operation = 'view';
  item: Customer;
  uType: number;
  Zones: any[];
  SelectedCoutryID: number;
  Cities: any[];
  Countries: any[];
  selectedCities = [];
  selectedCountries = [];

  SelectedCityID: number;
  Areas: any[];
  SelectedAreaID: number;
  selectedAreas = [];
  // selectedZones = [];
  SelectedZoneID: number;
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
  constructor(
    private serviceApi: CustomerService,
    private countryService: CountryService,
    // private ZoneService: ZoneService,
    private cityService: CityService,
    private aService: AreaService,
    public patterns: PatternsService,
    private router: Router,
    private translate: TranslateService,
    private DataTableLanguage: DataTableLanguageService,
  ) {
    this.uType = this.router.url === '/customer' ? 1 : 2;
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
      this.selectedAreas = [];
      this.selectedCountries = [];
      this.selectedCities = [];
      // this.selectedZones = [];
      // this.selectedZones.push(
      //   this.Zones.filter(
      //     item => item.ID === _item.ZoneID
      //   )[0]
      // );
    if (this.uType === 1) {
      if (_item.CustomerAddresses.length > 0) {
        if ( _item.CustomerAddresses[0].Countries_Id !== null) {
              this.SelectedCoutryID = _item.CustomerAddresses[0].Countries_Id;
                this.GetCities(_item.CustomerAddresses[0].Countries_Id, _item.CustomerAddresses[0].Cities_ID);
                this.selectedCountries.push(
                  this.Countries.filter(
                    item => item.ID === _item.CustomerAddresses[0].Countries_Id
                  )[0]
                );
            }
            if ( _item.CustomerAddresses[0].Cities_ID !== null) {
              this.SelectedCityID = _item.CustomerAddresses[0].Cities_ID;
              this.SelectedAreaID = _item.CustomerAddresses[0].Areas_ID;
              this.GetArea(_item.CustomerAddresses[0].Cities_ID, _item.CustomerAddresses[0].Areas_ID);
          }
      }
    } else {
        if (_item.CourierAddresses.length > 0) {
          if ( _item.CourierAddresses[0].Countries_Id !== null) {
                this.SelectedCoutryID = _item.CourierAddresses[0].Countries_Id;
                  this.GetCities(_item.CourierAddresses[0].Countries_Id, _item.CourierAddresses[0].Cities_Id);
                  this.selectedCountries.push(
                    this.Countries.filter(
                      item => item.ID === _item.CourierAddresses[0].Countries_Id
                    )[0]
                  );
              }
              if ( _item.CourierAddresses[0].Cities_Id !== null) {
                this.SelectedCityID = _item.CourierAddresses[0].Cities_Id;
                this.SelectedAreaID = _item.CourierAddresses[0].Areas_ID;
                this.GetArea(_item.CourierAddresses[0].Cities_Id, _item.CourierAddresses[0].Areas_ID);
            }
        }
}


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
    if (this.uType === 1) {
      item.CustomerAddresses = [
        {
          Countries_Id: this.SelectedCoutryID,
          Cities_ID: this.SelectedCityID,
          Areas_ID: this.SelectedAreaID
        }
      ];
    } else {
      item.CourierAddresses = [
        {
          Countries_Id: this.SelectedCoutryID,
          Cities_ID: this.SelectedCityID,
          Areas_ID: this.SelectedAreaID
        }
      ];
    }

    this.serviceApi.updateItem(item, this.uType).subscribe(result => {
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
    this.serviceApi.getItems(this.uType).subscribe(list => {
      this.refreshDataSource(list);
    });
    this.countryService.getItemsSimple().subscribe(list => {
      this.Countries = list;
    });
    // this.ZoneService.getItemsSimple().subscribe(list => {
    //   this.Zones = list;
    // });
  }
  CountrySelected(event) {
    this.Cities = [];
    this.SelectedCoutryID = event.ID;
    this.GetCities(event.ID);
  }
  GetCities(ID, cityID= 0) {
    this.cityService.getItems(ID).subscribe(list => {
      this.Cities = list;
      if(cityID!= 0)
      {      this.selectedCities.push(
        this.Cities.filter(
          item => item.ID === cityID
        )[0]
      );}

    });
  }
  CitySelected(event) {
    this.SelectedCityID = event.ID;
    this.GetArea(event.ID);
  }
  GetArea(ID, areaId = 0) {
    this.aService.getItems(ID).subscribe(list => {
      this.Areas = list;
      if (areaId !== 0) { this.selectedAreas.push(
        this.Areas.filter(
          item => item.ID === areaId
        )[0]
      ); }

    });
  }
  AreaSelected(event) {
    this.SelectedAreaID = event.ID;
  }
  OnCountryDeSelect() {
    this.Cities = [];
    this.Areas = [];
    this.SelectedAreaID = null;
    this.SelectedCityID = null;
  }
  OnCityDeSelect() {
    this.Areas = [];
    this.SelectedAreaID = null;
  }
  OnAreaDeSelect() {
  }
}
