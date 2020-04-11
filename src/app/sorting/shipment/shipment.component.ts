import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { PatternsService } from '../../shared/services/patterns.service';
import { ShipmentService } from './shipment.service';
import { Subscription } from 'rxjs';
import { Shipment } from './Shipment';
import { NgForm } from '@angular/forms';
import { OrganizationService } from '../organization/organization.service';
import { Organization } from '../organization/organization';
import { routerTransition } from '../../router.animations';
import { VendorService } from '../vendor/vendor.service';
import { Vendor } from '../vendor/vendor';
import { Customer } from '../customer/customer';
import { CustomerService } from '../customer/customer.service';
import { Currency } from '../../shared/entities/currency';
import { CurrencyService } from '../../shared/services/currency.service';
import { PaymentMethode } from '../../shared/entities/payment-methode';
import { PaymentMethodeService } from '../../shared/services/payment-methode.service';
import { TranslateService } from '@ngx-translate/core';
import { DataTableLanguageService } from '../../shared/services/datatable-language.service';

@Component({
  selector: 'app-shipment',
  templateUrl: './shipment.component.html',
  styleUrls: ['./shipment.component.scss'],
  animations: [routerTransition()]
})
export class ShipmentComponent implements OnInit, OnDestroy {

  constructor(
    public patterns: PatternsService,
    private _Service: ShipmentService,
    private _OrgService: OrganizationService,
    private _VendorService: VendorService,
    private _CustomerService: CustomerService,
    private _CurrencyService: CurrencyService,
    private _PayService: PaymentMethodeService,
    private translate: TranslateService,
    private DataTableLanguage: DataTableLanguageService,
  ) {}
  @ViewChild('detailsForm')
  public detailsForm: NgForm;
  operation = 'view';
  item: Shipment;
  list: Shipment[];
  shipLstSub: Subscription;
  Custsettings = {};
  Orgsettings = {};
  Vendorsettings = {};
  Currencysettings = {};
  paysettings = {};

  orgLst: Organization[] = [];
  orgLstSub: Subscription;

  vendorLst: Vendor[] = [];
  vendorLstSub: Subscription;

  customerLst: Customer[] = [];
  customerLstSub: Subscription;

  currencyLst: Currency[] = [];
  currencyLstSub: Subscription;

  payLst: PaymentMethode[] = [];
  payLstSub: Subscription;
  Customers = [];
  PaymentMethodes = [];
  Currencies = [];
  Vendors = [];
  Organizations = [];

  ngOnInit(): void {
    this.shipLstSub = this._Service.getAll().subscribe(list => {
      ;
      this.list = list;
    });
    this.orgLstSub = this._OrgService.getItemsSimple().subscribe(result => (this.orgLst = result));
    this.vendorLstSub = this._VendorService.getItems().subscribe(result => (this.vendorLst = result));
    this.currencyLstSub = this._CurrencyService.getAll().subscribe(result => (this.currencyLst = result));
    this.payLstSub = this._PayService.getAll().subscribe(result => (this.payLst = result));

    this.item = { ID: 0, Code: '', ShipmentDt: null, ShipmentValue: 0 };

    this.Custsettings = {
      singleSelection: true,
      text: 'Select Cutomers',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      badgeShowLimit: 3,
      labelKey: 'Name',
      primaryKey: 'ID',
      showCheckbox: true
    };

    this.Orgsettings = {
      singleSelection: true,
      text: 'Select Organization',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      badgeShowLimit: 3,
      labelKey: 'Name',
      primaryKey: 'ID',
      showCheckbox: true
    };

    this.Vendorsettings = {
      singleSelection: true,
      text: 'Select Vendor',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      badgeShowLimit: 3,
      labelKey: 'Name',
      primaryKey: 'ID',
      showCheckbox: true
    };
    this.paysettings = {
      singleSelection: true,
      text: 'Select Payment Method',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      badgeShowLimit: 3,
      labelKey: 'Name',
      primaryKey: 'ID',
      showCheckbox: true
    };
    this.Currencysettings = {
      singleSelection: true,
      text: 'Select Currency',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      badgeShowLimit: 3,
      labelKey: 'Name',
      primaryKey: 'ID',
      showCheckbox: true
    };
  }

  ngOnDestroy(): void {
    this.shipLstSub.unsubscribe();
    this.orgLstSub.unsubscribe();
    this.vendorLstSub.unsubscribe();
    this.currencyLstSub.unsubscribe();
    this.payLstSub.unsubscribe();
  }

  open = function(_item?: any) {
    this.customerLstSub = this._CustomerService.getItemsSimple(1).subscribe(result => (this.customerLst = result));

    this.detailsForm.reset();
    this.operation = _item == null ? 'add' : 'edit';
    switch (this.operation) {
      case 'add':
        this.item = { ID: 0, Code: '', ShipmentDt: null, ShipmentValue: 0 };
        break;
      case 'edit':
         this.Customers = [] ;
         this.PaymentMethodes = [];
         this.Currencies = [] ;
         this.Vendors = [];
         this.Organizations = [];
        this.Customers = _item.Customer == null ? [] : [_item.Customer];
        this.PaymentMethodes = _item.PaymentMethode == null ? [] : [_item.PaymentMethode];
        this.Currencies = _item.Currency == null ? [] : [_item.Currency];
        this.Vendors = _item.Vendor == null ? [] : [_item.Vendor];
        this.Organizations = _item.Organization == null ? [] : [_item.Organization];
        this.item = Object.assign({}, _item);
        break;
    }
  };

  back = function() {
    if (this.operation !== 'view') {
      this.operation = 'view';
    }
  };

  save = function() {
    this.item.Customer = this.Customers[0];
    this.item.PaymentMethode = this.PaymentMethodes[0];
    this.item.Currency = this.Currencies[0];
    this.item.Vendor = this.Vendors[0];
    this.item.Organization = this.Organizations[0];

    this._Service.save(this.item).subscribe(result => {
      debugger
      if (result != null && result !== undefined) {
        
        const filterResult = this.list.filter(function(element, index, array) {
          return element.ID === result.ID;
        });
        if (filterResult.length === 0) {
          this.list.push(result);
        } else {
          const index: number = this.list.indexOf(filterResult[0]);
          this.list[index] = Object.assign({}, result);
        }
        this.back();
      }
    });
  };

  selectedItem(customer) {
    this._CustomerService.getDefaultAddressByCustomer(customer.ID).subscribe(result => (this.item.Address = result.Address));
  }
}
