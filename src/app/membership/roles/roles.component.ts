import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { PatternsService } from '../../shared/services/patterns.service';
import { routerTransition } from '../../router.animations';
import { NgForm } from '@angular/forms';
import { Subject } from 'rxjs';

import { DataTableDirective } from 'angular-datatables';
import { Http, Response } from '@angular/http';
import { RolesService } from './roles.service';
import { Role } from './roles';
import { DataTableLanguageService } from '../../shared/services/datatable-language.service';
import { Permission } from './permission';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'roles-page',
  templateUrl: './roles.component.html',
  // styleUrls: ['./roles.component.scss'],
  animations: [routerTransition()]
})
export class RolesComponent implements OnInit, AfterViewInit {
  @ViewChild('detailsForm') public detailsForm: NgForm;
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;

  dtTrigger: Subject<any> = new Subject();
  list: Role[] = [];
  Permissions: Permission[] = [];
  dtOptions: DataTables.Settings = {};
  operation = 'view';
  item: any = {};
  constructor(private serviceApi: RolesService, public patterns: PatternsService, private http: Http
     , private DataTableLanguage: DataTableLanguageService ,
     ) {

    this.serviceApi.getAllPermission().subscribe(list => {
      this.Permissions = list;
    });
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


    this.applySave(this.item);
  };
  delete = function(_item: any) {
    _item.IsDeleted = true;
    this.applySave(_item);
  };
  private applySave = function(item) {
    let obj1 = {
      Permissions: this.item.RolePermissions,
      Role: this.item
    }
    this.serviceApi.updateItem(obj1).subscribe(result => {
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
    this.serviceApi.getItems().subscribe(list => {
      this.refreshDataSource(list);
    });
  }

  PermissionCompareFn (obj1, obj2) {
    debugger;
    return obj1.Id == obj2.Id;
};
  




}
