import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { PatternsService } from '../../shared/services/patterns.service';
import { routerTransition } from '../../router.animations';
import { NgForm } from '@angular/forms';
import { Subject } from 'rxjs';

import { BranchBankService } from '../BranchBank/BranchBank.service';
import { BranchAccountService } from '../BranchAccount/BranchAccount.service';
import { CustomerService } from '../../sorting/customer/customer.service';
import { VendorService } from '../../sorting/vendor/vendor.service';

import { DataTableDirective } from 'angular-datatables';
import { Http, Response } from '@angular/http';
import { ChequeService } from './Cheque.service';
import { Cheque } from './Cheque';
import { DataTableLanguageService } from '../../shared/services/datatable-language.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'Cheque-page',
  templateUrl: './Cheque.component.html',
  // styleUrls: ['./MaxinBank.component.scss'],
  animations: [routerTransition()],
  providers: [BranchBankService, BranchAccountService, CustomerService, VendorService]
})
export class ChequeComponent implements OnInit, AfterViewInit {
  @ViewChild('detailsForm') public detailsForm: NgForm;
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;

  dtTrigger: Subject<any> = new Subject();
  list: Cheque[] = [];
  dtOptions: DataTables.Settings = {};
  operation = 'view';
  item: Cheque ;
  SelectedMainAccountID: number;
  SelectedBranchAccountID: number;

  MainAccounts: any[];
  BranchAccounts: any[];
  ChequeType: any;
  MainBanks: any[];
  BranchBanks: any[];
  Customers: any[];
  Vendors: any[];
  // Status: any[];
  Status = [{ID: 1, Name: 'test1'}, {ID: 2, Name: 'test2'}, {ID: 3, Name: 'test3'}, {ID: 4, Name: 'test4'}];

  selectedStatus: any[];

  selectedMainAccounts = [];


  selectedVendors = [];
  CustomerSelected = [];

  selectedBranchAccounts = [];

  selectedMainBanks = [];
  selectedBranchBanks = [];

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

  SelectedMainBankID: number;
  SelectedBranchBankID: number;

  constructor(private serviceApi: ChequeService,
    private DataTableLanguage: DataTableLanguageService,
    private branchBankService: BranchBankService,
    private branchAccountService: BranchAccountService,
    private customerService: CustomerService,
    private vendorService: VendorService,
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
  open = function(_item?: Cheque) {
    this.detailsForm.reset();
    this.operation = _item == null ? 'add' : 'edit';

    this.ChequeType = _item === undefined ? 1 : (_item.CustomerID !== null ? 2 : 1) ;
        if (this.ChequeType === 1) {
          if ( _item !== undefined) {
            this.GetPartner(_item.VendorID);
          } else {
            this.GetPartner();
          }
        }
        if (this.ChequeType === 2  && _item !== undefined) {
          this.GetPartner(_item.CustomerID);
        }
    switch (this.operation) {
      case 'add':
        this.item = {ChequeType: 1 , ID: 0, CustomerID: null, VendorID: null, RefusalDate: null, RefusalReason: null};
        break;
      case 'edit':
        const MainAccountID = _item.Account.Account1.ID;
        this.selectedMainAccounts = [this.MainAccounts.filter(
            item => item.ID === MainAccountID
        )[0]];
        this.GetBranchAccounts(MainAccountID, _item.AccountID);

        const MainBankID = _item.Bank.Bank1.ID;
        this.selectedMainBanks = [this.MainBanks.filter(
            item => item.ID === MainBankID
        )[0]];
        this.GetBranchBanks(MainBankID, _item.BankID);
          this.selectedStatus = [this.Status.filter(
            item => item.
            ID === _item.ChequeType
            )[0]];
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
    item.AccountID = this.selectedBranchAccounts[0].ID;
    item.BankID = this.selectedBranchBanks[0].ID;
    this.serviceApi.addItem(item).subscribe(result => {
debugger;
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
    this.branchBankService.getItemsSimple().subscribe(list => {
      this.MainBanks = list;
    });
    this.branchAccountService.getAllٍSimpe().subscribe(list => {
      this.MainAccounts = list;
    });
    this.vendorService.getSimpleItems().subscribe(list => {
      this.Vendors = list;
    });
    this.customerService.getItemsSimple(1).subscribe(list => {
      this.Customers = list;
    });
  }
  OnMainAccountDeSelect() {
    this.BranchAccounts = [];
    this.SelectedBranchAccountID = null;
  }
  GetPartner(id) {
    if ( this.ChequeType === 1 ) {
      if (id !== undefined) {
        this.selectedVendors = [this.Vendors.filter(
          item => item.ID === id
          )[0]];
      }
    }
    if ( this.ChequeType === 2) {
      if ( id !== undefined) {
        this.CustomerSelected = [this.Customers.filter(
          item => item.
          ID === id
          )[0]];
      }
    }
  }
  MainAccountSelected(event) {
    this.BranchAccounts = [];
    this.SelectedBranchAccountID = event.ID;
    this.GetBranchAccounts(event.ID);
  }
  GetBranchAccounts(ID, AccountID= 0) {
    this.branchAccountService.getItems(ID).subscribe(list => {
      this.BranchAccounts = list;
      this.selectedBranchAccounts = [];
      if (AccountID !== 0) { this.selectedBranchAccounts.push(
        this.BranchAccounts.filter(
          item => item.ID === AccountID
        )[0]
      ); }

    });
  }
  OnMainBankDeSelect() {
    this.BranchBanks = [];
    this.SelectedBranchBankID = null;
  }
  MainBankSelected(event) {
    this.BranchBanks = [];
    this.SelectedBranchBankID = event.ID;
    this.GetBranchBanks(event.ID);
  }
  GetBranchBanks(ID, BankID= 0) {
    this.branchBankService.GetAllBranchBanks(ID).subscribe(list => {
      this.BranchBanks = list;
      this.selectedBranchBanks = [];
      if (BankID !== 0) { this.selectedBranchBanks.push(
        this.BranchBanks.filter(
          item => item.ID === BankID
        )[0]
      ); }
    });
  }
  OnCustomerDeSelect() {
    this.item.CustomerID = null;
  }
  OnCustomerSelected(event) {
    this.item.CustomerID = event.ID;
  }
  OnVendorDeSelect() {
    this.item.VendorID = null;
  }
  VendorSelected(event) {
    this.item.VendorID = event.ID;
  }
  OnStatusDeSelect() {
    this.item.Status = null;
  }
  StatusSelected(event) {
    this.item.Status = event.ID;
  }
}
