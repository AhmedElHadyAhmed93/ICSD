import { Component, OnInit, Input, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { Transaction } from '../transaction';
import { DataTableDirective } from 'angular-datatables';
import { Subject, Subscription } from 'rxjs';
import { DeliveryStatusService } from '../../../shared/services/delivery-status.service';
import { DeliveryStatus } from '../delivery-status';
import { Shipment } from '../../shipment/Shipment';
import { IDTypeService } from '../../../shared/services/idtype.service';
import { IDType } from '../idtype';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { CustomerService } from '../../customer/customer.service';
import { Customer } from '../../customer/customer';
import { TransactionService } from '../transaction.service';
import { TranslateService } from '@ngx-translate/core';
import { DataTableLanguageService } from '../../../shared/services/datatable-language.service';

@Component({
  selector: 'app-transaction-list',
  templateUrl: './transaction-list.component.html',
  styleUrls: ['./transaction-list.component.scss']
})
export class TransactionListComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(DataTableDirective)
  public dtElement: DataTableDirective;
  dtTrigger: Subject<any> = new Subject();

  @Input() list: Shipment[];
  @Input() isDelivered: boolean;

  statusesSub: Subscription;
  deliverypersons: DeliveryStatus[];
  returnResons: DeliveryStatus[];
  dtOptions2: DataTables.Settings = {};
  idTypesSub: Subscription;
  IDTypes: IDType[];

  /* closeResult: string; */
  type: number;
  customer: Customer;
  transactions: Transaction[];

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

  dtOptions: DataTables.Settings = {};
  constructor(
    private _Service: TransactionService,
    private _deliversStatausService: DeliveryStatusService,
    private _idTypesService: IDTypeService,
    private modalService: NgbModal,
    private _customerService: CustomerService,
    private translate: TranslateService,
    private DataTableLanguage: DataTableLanguageService,
  ) {}

  openModal(content, type, Id?) {
    this.type = type;
    if (type === 1) {
      this._customerService.getCustomerDetails(Id).subscribe(res => {
        this.customer = res;
      });
    } else if (type === 2) {
      this._Service.getHistory(Id).subscribe(res => {
        this.transactions = res;
      });
    }
    this.modalService
      .open(content, { ariaLabelledBy: 'modal-basic-title' })
      .result.then
      /* result => {
        this.closeResult = `Closed with: ${result}`;
      },
      reason => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      } */
      ();
  }

  /* private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  } */

  ngAfterViewInit(): void {
    this.dtTrigger.next();
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.state.clear();
    });
  }
  ngOnInit() {
    this.statusesSub = this._deliversStatausService.getAll().subscribe(result => {
      this.deliverypersons = result.filter(f => f.IsDelivery);
      this.returnResons = result.filter(f => !f.IsDelivery);
    });

    this.idTypesSub = this._idTypesService.getAll().subscribe(result => {
      this.IDTypes = result;
    });
    this.dtOptions = {
      pagingType: 'full_numbers',
      language : this.DataTableLanguage.language,
      stateSave: true
    };
    this.dtOptions2 = {
      pagingType: 'full_numbers',
      language : this.DataTableLanguage.language,
      stateSave: true,
      responsive: true
    };
    this.refreshDataSource(this.list);
  }
  formatDate(date) {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    return day + '/' + month + '/' + year;
  }
  ngOnDestroy(): void {
    this.statusesSub.unsubscribe();
    this.idTypesSub.unsubscribe();
  }

  refreshDataSource(list): void {
    if (list !== undefined) {
      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.destroy();
        this.list = list;
        this.dtTrigger.next();
      });
    }
  }
}
