import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { PatternsService } from '../../shared/services/patterns.service';
import { routerTransition } from '../../router.animations';
import { NgForm } from '@angular/forms';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { Http, Response } from '@angular/http';
import { JournalEntryService } from './JournalEntry.service';
import { BranchAccountService } from '../BranchAccount/BranchAccount.service';
import { JournalEntry , JournalEntryLines} from './JournalEntry';
import { TranslateService } from '@ngx-translate/core';
import { DataTableLanguageService } from '../../shared/services/datatable-language.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'JournalEntry-page',
  templateUrl: './JournalEntry.component.html',
  styleUrls: ['./JournalEntry.component.css'],
  animations: [routerTransition()]
})

export class JournalEntryComponent implements OnInit, AfterViewInit {
  @ViewChild('detailsForm') public detailsForm: NgForm;
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtTrigger: Subject<any> = new Subject();
  list: any[] = [];
  dtOptions: DataTables.Settings = {};
  operation = 'view';
  item: JournalEntry;

  DebitAmount: number;
  CreditAmount: number;
  IsNotValid: boolean;


  orginzations: any[];
  selectedorginzation: any;
  config2: any = { placeholder: 'Select organization', sourceField: ['NameEn'] };
  selectedItems = [];
  selectedJournalEntryZones = [];

  BranchAccounts: any[];
  MainAccounts: any[];
  SelectedMainAccountID: number;
  SelectedBranchAccountID: number;
  selectedMainAccounts = [];
  selectedBranchAccounts = [];

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

  _JournalEntryLines: JournalEntryLines[];

  Zones = [];
  Zonesettings = {
   //  singleSelection: true,
    text: 'إختر منطقة',
    limitSelection: 1,
    // selectAllText: 'تحديد الكل',
    // unSelectAllText: 'إلغاء تحديد الكل',
    enableSearchFilter: true,
    labelKey: 'Name',
    searchPlaceholderText: 'بحث',
    noDataLabel: 'لا يوجد بيانات بهذالاسم',
    primaryKey: 'ID',
     enableFilterSelectAll: false,
     filterSelectAllText: 'اختر الكل',
     filterUnSelectAllText: 'حذف الكل',
     // badgeShowLimit: 3,
     showCheckbox: true
  };
  editField: string;
  constructor(
    private serviceApi: JournalEntryService,
    public patterns: PatternsService,
    private http: Http,
    private translate: TranslateService,
    private branchAccountService: BranchAccountService,

    private DataTableLanguage: DataTableLanguageService
  ) {}

  ngAfterViewInit(): void {
    this.dtTrigger.next();
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.state.clear();
    });
  }
  open = function(_item?: any) {
    this.operation = _item == null ? 'add' : 'edit';
    switch (this.operation) {
      case 'add':
        this.item = {};
        break;
      case 'edit':
       this._JournalEntryLines = [];
       _item.JournalEntryLine.forEach(element => {
            this.branchAccountService.getItems(element.Account.Account1.ID).subscribe(list => {
          this._JournalEntryLines.push({
            ID: element.ID,
            AccountID: element.AccountID,
            Amount: element.Amount,
            Code: element.Code,
            JournalEntryID: _item.ID,
            AmountType: element.AmountType,
            Description: element.Description,
            Account: null,
            BranchAccountList: list,
             SelectedBranchAccount: [list.filter(x => x.ID === element.AccountID)[0]],
            SelectedMainAccount : this.MainAccounts.filter(x => x.ID === element.Account.Account1.ID)
          });
          });
      });
        this.item = Object.assign({}, _item);
        break;
    }
    this.calculateAmount();
  };
  save = function() {
    this.applySave(this.item);
  };
  delete = function(_item: any) {
    _item.IsDeleted = true;
    this.applySave(_item);
  };
  private applySave = function(item) {
    debugger;
    item.JournalEntryLine = this._JournalEntryLines ;
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
      language: this.DataTableLanguage.language,
      stateSave: true
    };
    this.serviceApi.getItems().subscribe(list => {
      this.refreshDataSource(list);
    });
    this.branchAccountService.getAllٍSimpe().subscribe(list => {
      this.MainAccounts = list;
    });
    // this.IsNotValid = true;
  }
  OrganizationSelected(event) {
    this.selectedorginzation = event;
    this.serviceApi.getItemsbyOrganization(event.ID).subscribe(list => {
      this.refreshDataSource(list);
    });
  }
  onInputChangedEvent(event) {}

  ClearData() {
    this._JournalEntryLines = [];
  }

  changeValue(data, property: string, event: any) {
    if (property === 'MainAccounts') {
        const filterResult = this._JournalEntryLines.filter(function(element) {
          return element === event;
        });
        const index: number = this._JournalEntryLines.indexOf(filterResult[0]);
        this.branchAccountService.getItems(data.ID).subscribe(list => {
          this._JournalEntryLines[index].BranchAccountList = list;
          if (this._JournalEntryLines[index].AccountID !== 0) {
            this._JournalEntryLines[index].SelectedBranchAccount.push(
            this._JournalEntryLines[index].BranchAccountList.filter(
              item => item.ID === this._JournalEntryLines[index].Account.Account1.ID
            )[0]
          ); }
        });
    }
    if (property === 'BranchAccount') {
      const filterResult = this._JournalEntryLines.filter(function(element) {
        return element === event;
      });
      const index: number = this._JournalEntryLines.indexOf(filterResult[0]);
      this._JournalEntryLines[index].AccountID = this._JournalEntryLines[index].SelectedBranchAccount[0].ID ;
    }
    if (property === 'BranchAccount') {
      const filterResult = this._JournalEntryLines.filter(function(element) {
        return element === event;
      });
      const index: number = this._JournalEntryLines.indexOf(filterResult[0]);
      this._JournalEntryLines[index].AccountID = this._JournalEntryLines[index].SelectedBranchAccount[0].ID ;
    }
    this.calculateAmount( );
  }

  calculateAmount() {
    if ( this._JournalEntryLines !== undefined ) {
      this.DebitAmount = this._JournalEntryLines.filter(function(element) {
        return element.AmountType === 1;
      }).reduce((acc, cur) => acc + cur.Amount, 0);
      this.CreditAmount = this._JournalEntryLines.filter(function(element) {
        return element.AmountType === 2;
      }).reduce((acc, cur) => acc + cur.Amount, 0);
      if ( this.DebitAmount === 0 || this.CreditAmount === 0 || this.DebitAmount !== this.CreditAmount) {
        this.IsNotValid = true;
      } else {
        this.IsNotValid = false ;
      }
    } else {
      this.IsNotValid = true ;
    }
  }

  remove(id: any) {
    // this.awaitingZoneList.push(this._JournalEntryLines[id]);
    this._JournalEntryLines.splice(id, 1);
    this.calculateAmount( );
  }

  updateList(id: number, property: string, event: any) {
    if (property === 'MainAccounts') {
      const filterResult = this._JournalEntryLines.filter(function(element) {
        return element === event;
      });
      const index: number = this._JournalEntryLines.indexOf(filterResult[0]);
      this._JournalEntryLines[index].BranchAccountList = [];
      this._JournalEntryLines[index].SelectedBranchAccount = [];
      this._JournalEntryLines[index].AccountID = 0;
    }

    if (property === 'BranchAccount') {
      const filterResult = this._JournalEntryLines.filter(function(element) {
        return element === event;
      });
      const index: number = this._JournalEntryLines.indexOf(filterResult[0]);
      this._JournalEntryLines[index].AccountID = 0  ;
    }
    this.calculateAmount( );
  }

  add() {
    if (this._JournalEntryLines === undefined) {
      this._JournalEntryLines = [];
    }
    this._JournalEntryLines.push({
      ID: 0,
      AccountID: 0,
      Amount: 0,
      Code: null,
      JournalEntryID: 0,
      AmountType: 1,
      Account: null,
      BranchAccountList: [],
      SelectedBranchAccount: [],
      SelectedMainAccount: []
    });
  }
  OnMainAccountDeSelect() {
    this.BranchAccounts = [];
    this.SelectedBranchAccountID = null;
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
}
