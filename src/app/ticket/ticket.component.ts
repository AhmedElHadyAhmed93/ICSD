import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { PatternsService } from '../shared/services/patterns.service';
import { routerTransition } from '../router.animations';
import { NgForm } from '@angular/forms';
import { Subject } from 'rxjs';

import { DataTableDirective } from 'angular-datatables';
import { Http, Response } from '@angular/http';
import { DataTableLanguageService } from '../shared/services/datatable-language.service';
import { TicketService } from './ticket.service';
import { Ticket } from './ticket';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'Ticket-page',
  templateUrl: './ticket.component.html',
  // styleUrls: ['./Ticket.component.scss'],
  animations: [routerTransition()]
})
export class TicketComponent implements OnInit, AfterViewInit {
  @ViewChild('detailsForm') public detailsForm: NgForm;
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;

  dtTrigger: Subject<any> = new Subject();
  list: Ticket[] = [];
  dtOptions: DataTables.Settings = {};
  operation = 'view';
  item: any = {};

  Statuses: any[]=[{ID :1,Name :'Status 1' },{ID :2,Name :'Status 2' },{ID :3,Name :'Status 3' }];
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


  Modules: any[]=[{ID :1,Name :'Modules 1' },{ID :2,Name :'Modules 2' },{ID :3,Name :'Modules 3' }];
  selectedModuleTo = [];
  selectedModuleFrom = [];
  ModulesToSettings = {
    singleSelection: true,
    text: 'Select Modules To',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    enableSearchFilter: true,
    badgeShowLimit: 3,
    labelKey: 'Name',
    primaryKey: 'ID'
  };
  ModulesFromSettings = {
    singleSelection: true,
    text: 'Select Modules From',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    enableSearchFilter: true,
    badgeShowLimit: 3,
    labelKey: 'Name',
    primaryKey: 'ID'
  };

  constructor(private serviceApi: TicketService,
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

      this.selectedModuleFrom=[];
      this.selectedModuleFrom.push(this.Modules.filter(s=>s.ID==_item.ModuleFrom)[0])
      this.selectedModuleTo=[];
      this.selectedModuleTo.push(this.Modules.filter(s=>s.ID==_item.ModuleTo)[0])

     
        this.item = Object.assign({}, _item);


        break;
    }
  };
  save = function() {
    
    this.item.Status=this.selectedStatuses[0].ID;
    this.item.ModuleTo=this.selectedModuleTo[0].ID;
    this.item.ModuleFrom=this.selectedModuleFrom[0].ID;
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
        element.ModuleFromName = this.Modules.filter(s=>s.ID==element.ModuleFrom)[0].Name;
        element.ModuleToName = this.Modules.filter(s=>s.ID==element.ModuleTo)[0].Name;
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
