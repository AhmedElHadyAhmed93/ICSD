import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { PatternsService } from '../../shared/services/patterns.service';
import { routerTransition } from '../../router.animations';
import { NgForm } from '@angular/forms';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { BranchAccountService } from './BranchAccount.service';
import { MainAccountService } from '../MainAccount/MainAccount.service';
import { BranchAccount } from './BranchAccount';
import { MainAccount } from '../MainAccount/MainAccount';
import { TranslateService } from '@ngx-translate/core';
import { DataTableLanguageService } from '../../shared/services/datatable-language.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'BranchAccount-page',
  templateUrl: './BranchAccount.component.html',
  styleUrls: ['./BranchAccount.component.css'],
  animations: [routerTransition()]
})

export class BranchAccountComponent implements OnInit, AfterViewInit {
  @ViewChild('detailsForm') public detailsForm: NgForm;
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtTrigger: Subject<any> = new Subject();
  list: any[] = [];
  dtOptions: DataTables.Settings = {};

  paginate: DataTables.LanguagePaginateSettings = {
    first : 'الأول',
    last : 'الأخير',
    next : 'السابق',
    previous : 'التالي'
  };

  language: DataTables.LanguageSettings = {
    search : 'ابحث:',
    emptyTable : 'لم يُعثر على أية سجلات',
    infoEmpty : 'يعرض 0 إلى 0 من أصل 0 سجلّ',
    processing: 'جاري التحميل...',
    lengthMenu: 'أظهر مُدخلات _MENU_',
    infoFiltered: '(منتقاة من مجموع _MAX_ مُدخل)',
    info: 'إظهار _START_ إلى _END_ من أصل _TOTAL_ مُدخل',
    paginate : this.paginate

  };
  operation = 'view';
  item: BranchAccount;
  MainAccount: MainAccount;
  Accounts: any[];
  config2: any = { placeholder: 'Select MainAccount', sourceField: ['NameEn'] };
  selectedItems = [];
  settings = {
    singleSelection: true,
    text: 'Select Item',
    // selectAllText: 'Select All',
    // unSelectAllText: 'UnSelect All',
    enableSearchFilter: true,
    badgeShowLimit: 3,
    labelKey: 'Name',
    primaryKey: 'ID'
  };

  SelectedAccount: any;

  constructor(private serviceApi: BranchAccountService, private mainAccountService: MainAccountService, public patterns: PatternsService,
    private translate: TranslateService,
    private DataTableLanguage: DataTableLanguageService,
  ) {}

  onItemSelect(data) {
    debugger;
    this.SelectedAccount = data;
    this.serviceApi.getItems(data.ID).subscribe(list => {
      this.refreshDataSource(list);
    });
  }
  OnItemDeSelect(data) {
    this.SelectedAccount = null;
    this.refreshDataSource([]);
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
        this.item = Object.assign({}, _item);
        break;
    }
  };
  save = function() {
    this.item.MainAccountID = this.SelectedAccount.ID;
    this.applySave(this.item);
  };
  delete = function(_item: any) {
    _item.IsDeleted = true;
    this.applySave(_item);
  };
  private applySave = function(item) {
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
    this.mainAccountService.getItemsSimple().subscribe(list => {
      this.Accounts = list;
    });
    this.item = {Code: null, ID: 0, IsActive: true, Name: null, NameAr: null, NameEn: null};
  }
}
