import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { PatternsService } from '../../shared/services/patterns.service';
import { TransactionService } from './transaction.service';
import { Subscription } from 'rxjs';
import { TransactionSC, Transaction } from './transaction';
import { NgForm } from '@angular/forms';
import { Customer } from '../customer/customer';
import { CustomerService } from '../customer/customer.service';
import { routerTransition } from '../../router.animations';
import { ShipmentService } from '../shipment/shipment.service';
import { Shipment } from '../shipment/Shipment';
import { TranslateService } from '@ngx-translate/core';
import { DataTableLanguageService } from '../../shared/services/datatable-language.service';

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.css'],
  animations: [routerTransition()]
})
export class TransactionComponent implements OnInit, OnDestroy {
  @ViewChild('detailsForm')
  public detailsForm: NgForm;
  operation = 'view';
  transSC: TransactionSC;
  list: Shipment[];
  transLstSub: Subscription;

  CourierLst: Customer[] = [];
  selectedCouriers: Customer[] = [];
  CourierLstSub: Subscription;
  CourierSettings = {};

  CustomerLst: Customer[] = [];
  selectedCustomers: Customer[] = [];
  CustomerLstSub: Subscription;
  CustomerSettings = {};

  constructor(
    public patterns: PatternsService,
    private _Service: TransactionService,
    private _CustomerService: CustomerService,
    private _ShipmentService: ShipmentService,
    private translate: TranslateService,
    private DataTableLanguage: DataTableLanguageService,
  ) {}
  getAllTodayShipment() {
    this.transLstSub = this._ShipmentService.getAllByDate().subscribe(result => {
      this.list = result;
      this.list.forEach(x => {
        x.Transaction = {
          ID: 0,
          DeliveryStatus: null,
          IDNum: null,
          IDType: null,
          Notes: null,
          TransactionDt: x.Transaction ? x.Transaction.TransactionDt : null
        };
      });
    });
  }
  ngOnInit(): void {
    this.getAllTodayShipment();

    this.transSC = { TransactionDt: this.formatDate(new Date()), IsDelivered: true };

    this.CourierLstSub = this._CustomerService.getItemsSimple(0).subscribe(result => (this.CourierLst = result));
    this.CustomerLstSub = this._CustomerService.getItemsSimple(1).subscribe(result => (this.CustomerLst = result));

    this.CourierSettings = {
      singleSelection: true,
      text: 'Select Courier',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      badgeShowLimit: 3,
      labelKey: 'Name',
      primaryKey: 'ID',
      showCheckbox: false
    };
    this.CustomerSettings = {
      singleSelection: false,
      text: 'Select Customer',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      badgeShowLimit: 3,
      labelKey: 'Name',
      primaryKey: 'ID'
    };
  }

  ngOnDestroy(): void {
    this.transLstSub.unsubscribe();
    this.CourierLstSub.unsubscribe();
    this.CustomerLstSub.unsubscribe();
  }

  formatDate(date) {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    return day + '/' + month + '/' + year;
  }

  search() {
    this.transSC.Couriers_Id = this.selectedCouriers[0].ID;
    this.transSC.Customers_IDs = this.selectedCustomers.map(function(item) {
      return item.ID;
    });
    // this._ShipmentService.getFiltered(this.transSC).subscribe(result => {
    //   this.list = result;
    // });
  }

  set IsDeliver(val: boolean) {
    this.transSC.IsDelivered = val;
    this.list.forEach(p => {
      p.Transaction = {
        ID: 0,
        DeliveryStatus: null,
        IDNum: null,
        IDType: null,
        Notes: null,
        TransactionDt: p.Transaction ? p.Transaction.TransactionDt : null
      };
    });
  }
  get IsDeliver() {
    return this.transSC.IsDelivered;
  }
  save() {
    const transactionlst: Transaction[] = [];
    this.list.forEach(p => {
      transactionlst.push({
        ID: p.Transaction.ID,
        IsDelivered: this.transSC.IsDelivered,
        Shipments_Id: p.ID,
        DeliveryStatuses_Id: p.Transaction.DeliveryStatus ? p.Transaction.DeliveryStatus[0].ID : null,
        IDTypes_Id: p.Transaction.IDType ? p.Transaction.IDType[0].ID : null,
        IDNum: p.Transaction.IDNum,
        Notes: p.Transaction.Notes
      });
    });
    this._Service.save(transactionlst).subscribe(result => {
      this.getAllTodayShipment();
    });
  }

  onItemSelect(item: any) {
    console.log(item);
    console.log(this.transSC.Courier);
  }
  OnItemDeSelect(item: any) {
    console.log(item);
    console.log(this.transSC.Courier);
  }
  onSelectAll(items: any) {
    console.log(items);
  }
  onDeSelectAll(items: any) {
    console.log(items);
  }
}
