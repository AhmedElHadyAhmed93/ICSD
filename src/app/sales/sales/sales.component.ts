import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { PatternsService } from '../../shared/services/patterns.service';
import { routerTransition } from '../../router.animations';
import { NgForm } from '@angular/forms';
import { Subject } from 'rxjs';

import { DataTableDirective } from 'angular-datatables';
import { Http, Response } from '@angular/http';
import { DataTableLanguageService } from '../../shared/services/datatable-language.service';
import { SalesService } from './sales.service';
import { Sales } from './sales';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'Sales-page',
  templateUrl: './sales.component.html',
  // styleUrls: ['./Sales.component.scss'],
  animations: [routerTransition()]
})
export class SalesComponent implements OnInit, AfterViewInit {
  @ViewChild('detailsForm') public detailsForm: NgForm;
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;

  dtTrigger: Subject<any> = new Subject();
  list: Sales[] = [];
  dtOptions: DataTables.Settings = {};
  operation = 'view';
  item: any = {};

  Statuses: any[] = [{ID : 1 , Name : 'Status 1' }, {ID : 2, Name : 'Status 2' }, {ID : 3, Name : 'Status 3' }];

  selectedStatuses = [];

  StatusesSettings = {
    singleSelection: true,
    text: 'Select Status',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    enableSearchFilter: true,
    badgeShowLimit: 3,
    labelKey: 'Name',
    primaryKey: 'ID'
  };

  constructor(private serviceApi: SalesService,
    private DataTableLanguage: DataTableLanguageService, public patterns: PatternsService, private http: Http) {
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
      this.selectedStatuses=[];
      this.selectedStatuses.push(this.Statuses.filter(s=>s.ID==_item.Status)[0]);
      this.item = Object.assign({}, _item);
        break;
    }
  };
  save = function() {
    this.item.Status=this.selectedStatuses[0].ID;
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
      this.list.forEach(element => {
        element.StatusName = this.Statuses.filter(s=>s.ID==element.Status)[0].Name;
      });
      this.dtTrigger.next();
    });
  }
  ngOnInit() {
 
    this.serviceApi.getItems().subscribe(list => {
      this.refreshDataSource(list);
    });
  }

 
}
