import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { PatternsService } from '../../shared/services/patterns.service';
import { routerTransition } from '../../router.animations';
import { NgForm } from '@angular/forms';
import { Subject } from 'rxjs';

import { DataTableDirective } from 'angular-datatables';
import { Http } from '@angular/http';
import { ShipmentDetailsFeesService } from './ShipmentDetailsFees.service';
import { VendorService } from '../../sorting/vendor/vendor.service';
import { CustomerService } from '../../sorting/customer/customer.service';
import { ShipmentDetailsFees , Search } from './ShipmentDetailsFees';
import { DataTableLanguageService } from '../../shared/services/datatable-language.service';
import { Router } from '@angular/router';
import { ExcelService } from '../../shared/services/excel.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'ShipmentDetailsFees-page',
  templateUrl: './ShipmentDetailsFees.component.html',
  styleUrls: ['./ShipmentDetailsFees.component.css'],
  animations: [routerTransition()],
  providers: [CustomerService, ShipmentDetailsFeesService, VendorService]
})
export class ShipmentDetailsFeesComponent implements OnInit, AfterViewInit {
  @ViewChild('detailsForm') public detailsForm: NgForm;
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtTrigger: Subject<any> = new Subject();
  dtOptions: DataTables.Settings = {};
  operation = 'view';
  item: ShipmentDetailsFees ;
  List: ShipmentDetailsFees[];
  Cutstomers: any[];
  Vendors: any[];
  searchData: Search = {};
  selectedItems = [];
  selectedVendors = [];
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
  vendorSettings = {
    singleSelection: true,
    text: 'Select Cutomers',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    enableSearchFilter: true,
    badgeShowLimit: 3,
    labelKey: 'Name',
    primaryKey: 'ID'
  };
  constructor(
    private serviceApi: ShipmentDetailsFeesService ,
    private custmService: CustomerService,
    private vendorService: VendorService,
    public patterns: PatternsService,
    private http: Http,
    private router: Router,
    private DataTableLanguage: DataTableLanguageService,
    private excelService : ExcelService
  ) {
  }
  ngOnInit() {
    this.dtOptions = {
      pagingType: 'full_numbers',
      language : this.DataTableLanguage.language,
      stateSave: true
    };
    this.serviceApi.getItems().subscribe(list => {
      this.List = list;
    });
    this.custmService.getItemsSimple(1).subscribe(list => {
      this.Cutstomers = list;
    });
    this.vendorService.getSimpleItems().subscribe(list => {
      this.Vendors = list;
    });
    this.item = {
      Customer:null,
      CustomerID:null,
      ID:null,
      IsComfirmed:null,
      IsComplete:null,
      Shipment :{Code:null,ID:0,Customer:{Name:null,ID:0},Vendor:{Name:null,ID:0}},
    ShipmentID:null,Transaction:null,TransactionID:null,shipOriginalPrice:null,shipPriceFees:null}
  }
  ngAfterViewInit(): void {
    this.dtTrigger.next();
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.state.clear();
    });
  }
  exportAsXLSX(): void {

    const CreateList = [];
    this.List.forEach(eachObj => {
      CreateList.push({
        CustomerName : eachObj.Shipment.Customer.Name,
        VendorName: eachObj.Shipment.Vendor.Name,
        ShipmentCode : eachObj.Shipment.Code,
        ShipmentValue : eachObj.Shipment.ShipmentValue,
        shipPriceFees : eachObj.shipPriceFees ,
        shipOriginalPrice : eachObj.shipOriginalPrice
      });
    });
    this.excelService.exportAsExcelFile(CreateList, 'sample');
  }
  open = function(_item?: ShipmentDetailsFees) {
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
  Search() {
    debugger
     this.serviceApi.Search(this.searchData).subscribe(list => {
      this.List = list;
    });
  }
  delete = function(_item: any) {
    _item.IsDeleted = true;
    this.applySave(_item);
  };

  private applySave = function(item) {
    this.serviceApi.ComfirmShipment(item).subscribe(result => {
       const filterResult = this.List.filter(function(element, index, array) {
         return element.ID === result.ID;
       });
       if (filterResult.length === 0) {
         this.List.push(result);
       } else {
         const index: number = this.List.indexOf(filterResult[0]);
         this.List[index] = Object.assign({}, result);
       }
       this.refreshDataSource(this.List);
      this.back();
    });
  };

  back = function() {
    if (this.operation !== 'view') {
      this.item = {
        Customer:null,
        CustomerID:null,
        ID:null,
        IsComfirmed:null,
        IsComplete:null,
        Shipment :{Code:null,ID:0,Customer:{Name:null,ID:0},Vendor:{Name:null,ID:0}},
      ShipmentID:null,Transaction:null,TransactionID:null,shipOriginalPrice:null,shipPriceFees:null}
      this.operation = 'view';
    }
  };
  ComfirmItems = function() {
    const filterResult = this.List.filter(function(element, index, array) {
      return element.IsComfirmed === true;
    });
    let ids = filterResult.map(function(a) {return a.ID;});
    this.serviceApi.ConvertShipmentFeesItemsToComfirm(ids).subscribe(result => {
   });
  }
  refreshDataSource(list): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.destroy();
      this.dtTrigger.next();
    });
  }
  formatDate(date) {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return day + '/' + month + '/' + year;
  }
  onItemSelect(item: any) {
    this.searchData.CustomerID = item.ID;
  }
  OnItemDeSelect(item: any) {
    this.searchData.CustomerID =null;

  }
  onVendorSelect(item: any) {
    this.searchData.VendorID = item.ID;

  }
  OnVendorDeSelect(item: any) {
    this.searchData.VendorID =null;
  }
  // tslint:disable-next-line:member-ordering
  checkComfirem = function()  {
    if (this.List !== undefined) {
      const filterResult = this.List.filter(function(element, index, array) {
        return element.IsComfirmed === true;
      });
      if ( filterResult.length > 0) {
        return false;
      }
    }
    return true; };
}
