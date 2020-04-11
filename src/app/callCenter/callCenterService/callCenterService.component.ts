import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { PatternsService } from '../../shared/services/patterns.service';
import { routerTransition } from '../../router.animations';
import { NgForm } from '@angular/forms';
import { Subject } from 'rxjs';

import { DataTableDirective } from 'angular-datatables';
import { Http, Response } from '@angular/http';
import { CallCenterService } from './callCenterService.service';
import { CountryService } from '../../sorting/country/country.service';
import { CityService } from '../../sorting/city/city.service';
import { CustomerService } from '../../sorting/customer/customer.service';
import { CallCenter, CallCenterSearch, CallCenterGrid } from './callCenterService';
import { TranslateService } from '@ngx-translate/core';
import { DataTableLanguageService } from '../../shared/services/datatable-language.service';
import { Item } from 'angular2-multiselect-dropdown';
import { Router } from '@angular/router';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'CallCenter-page',
  templateUrl: './callCenterService.component.html',
  styleUrls: ['./callCenterService.component.css'],
  animations: [routerTransition()],
  providers: [CustomerService, CallCenterService]
})
export class CallCenterComponent implements OnInit, AfterViewInit {
  @ViewChild('detailsForm') public detailsForm: NgForm;
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtTrigger: Subject<any> = new Subject();
  callCenterGrid: CallCenterGrid[] = [];
  dtOptions: DataTables.Settings = {};
  operation = 'view';
  searchData: CallCenterSearch = {IsDelivered: null};
  Cutstomers: any[];
  SelectedCustomerID: number;
  Couriers: any[];
  SelectedCourierID: number;
  selectedItems = [];
  selectedStatus = [];
  uType: any;
  selectedCourier = [];
  sinImputarValue = 'B';
  ShipmentDt: any;
  item: CallCenter;
  constructor(
    private serviceApi: CallCenterService ,
    private CustmService: CustomerService,
    private countryService: CountryService,
    public patterns: PatternsService,
    private http: Http,
    private router: Router,
    private translate: TranslateService,
    private DataTableLanguage: DataTableLanguageService,
  ) {
    this.uType = this.router.url === '/CallCenter' ? 1 : 2;
  }
  settings = {
    singleSelection: true,
    text: 'Select Cutomers',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    enableSearchFilter: true,
    badgeShowLimit: 3,
    labelKey: 'Name',
    primaryKey: 'ID'
  };
  statusListsettings = {
    singleSelection: true,
    text: 'Select Status',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    enableSearchFilter: true,
    badgeShowLimit: 3,
    disabled: true,
    labelKey: 'Name',
    primaryKey: 'ID'
  };
  statusList = [
    {ID: 4 , Name: 'Complete', NameAr: '1'},
    {ID: 1 , Name: 'test1', NameAr: '1'},
    {ID: 2 , Name: 'test1', NameAr: '1'} ,
    {ID: 3 , Name: 'test1', NameAr: '1'}];

  ngOnInit() {
    this.ShipmentDt = this.formatDate( new Date());
    this.dtOptions = {
      pagingType: 'full_numbers',
      language : this.DataTableLanguage.language,
      stateSave: true
    };
    this.CustmService.getItemsSimple(1).subscribe(list => {
      this.Cutstomers = list;
    });
    this.CustmService.getItemsSimple(2).subscribe(list => {
      this.Couriers = list;
    });
    this.item = {
      IsDelivered: null,
      Customers_Name: null,
      Customers_Mobile: null,
      ShipmentID: null ,
      TransactionID: null,
      NewPrice: null,
      Code: null
     };
  }
  ngAfterViewInit(): void {
    this.dtTrigger.next();
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.state.clear();
    });
  }
  open = function(_item?: CallCenterGrid) {
    this.operation = _item == null ? 'add' : 'edit';
    switch (this.operation) {
      case 'add':
         this.item = {
          IsDelivered: null,
          Customers_Name: null,
          Customers_Mobile: null,
          ShipmentID: null ,
          TransactionID: null,
          NewPrice: null,
          Code: null
         };
        break;
      case 'edit':
       this.selectedStatus = this.statusList.filter(function(element, index, array) {
         return element.ID === 4;
       });
        this.item = {
           IsDelivered: _item.IsDelivered ,
           Customers_Name: _item.Customers_Name,
           Customers_Mobile: _item.Customers_Mobile,
           ShipmentID: _item.Shipments_Id ,
           TransactionID: _item.ID,
           NewPrice: _item.Shipments_Value,
           Code: _item.Shipments_Code,
           CallCenterType: this.uType === 1 ? 1 : 2
        };
        break;
    }
  };
  save = function() {
    ;
    this.applySave(this.item);
  };
  delete = function(_item: any) {
    _item.IsDeleted = true;
    this.applySave(_item);
  };
  private applySave = function(item) {
    this.serviceApi.updateItem(item).subscribe(result => {
      // const filterResult = this.list.filter(function(element, index, array) {
      //   return element.ID === result.ID;
      // });
      // if (filterResult.length === 0) {
      //   this.list.push(result);
      // } else {
      //   const index: number = this.list.indexOf(filterResult[0]);
      // }
      // this.refreshDataSource(this.list);
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
      this.callCenterGrid = list;
      this.dtTrigger.next();
    });
  }
  formatDate(date) {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return day + '/' + month + '/' + year;
  }
  Search() {
    ;
    if (this.uType === 2) {
      this.searchData.IsDelivered = true;
    }
     this.serviceApi.Search(this.searchData).subscribe(list => {
      this.callCenterGrid = list;
    });
  }
  onItemSelect(item: any) {
    this.searchData.CustomerID = item.ID;
  }
  OnItemDeSelect(item: any) {
    this.searchData.CustomerID = null;
  }
  onStatusSelect(item: any) {
    this.item.Status = item.ID;
  }
  OnStatusDeSelect(item: any) {
    this.item.Status = null;
  }
  getDate(date) {
    return date.month + '/' + date.day + '/' + date.year ;
  }
}
