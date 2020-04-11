import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { PatternsService } from '../../shared/services/patterns.service';
import { routerTransition } from '../../router.animations';
import { NgForm } from '@angular/forms';
import { Subject } from 'rxjs';

import { DataTableDirective } from 'angular-datatables';
import { Http, Response } from '@angular/http';
import { DataTableLanguageService } from '../../shared/services/datatable-language.service';
import { UsersService } from './users.service';
import { User } from './users';
import { RolesService } from '../roles/roles.service';
import { Role } from '../roles/roles';


@Component({
  // tslint:disable-next-line:component-selector
  selector: 'users-page',
  templateUrl: './users.component.html',
  // styleUrls: ['./Users.component.scss'],
  animations: [routerTransition()]
})
export class UsersComponent implements OnInit, AfterViewInit {
  @ViewChild('detailsForm') public detailsForm: NgForm;
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;

  dtTrigger: Subject<any> = new Subject();
  list: User[] = [];
  Roles : Role[] =[];
  dtOptions: DataTables.Settings = {};
  operation = 'view';
  item: any = {};
  BlockStatus = 'block';
  constructor(private serviceApi: UsersService, public patterns: PatternsService, private http: Http
     , private DataTableLanguage: DataTableLanguageService ,private RoleService : RolesService
     ) {

   this.RoleService.getItems().subscribe(list => {
      this.Roles = list;
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
    for(var i=0;i<this.Roles.length;i++){
      this.Roles[i].checked = false;
    }
    this.operation = _item == null ? 'add' : 'edit';
    switch (this.operation) {
      case 'add':
        this.item = {};
        break;
      case 'edit':
      debugger;
     
        this.item = Object.assign({}, _item);
        for(var i=0;i< _item.UserRoles.length;i++){

          const filterResult = this.Roles.filter(function(element, index, array) {
            return element.Id === _item.UserRoles[i].Id ;
          });
          var index= this.Roles.indexOf(filterResult[0]);
          if(index != -1){
          this.Roles[index].checked = true;
          } 
        };
        break;
    }
  };


  roleChanged(index,checked) {
    debugger;

    this.Roles[index].checked = checked;
  }
  save = function() {
    debugger;
     this.item.UserRoles = this.Roles.filter( (Roles) => Roles.checked );

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
    this.serviceApi.getItems().subscribe(list => {
      this.refreshDataSource(list);
    });
  }

  PermissionCompareFn (obj1, obj2) {
    debugger;
    return obj1.Id == obj2.Id;
};
  
Block () {
  this.serviceApi.Block(this.item).subscribe(response => {
    /*if (response.data.IsBlocked === true) {
    this.BlockStatus = 'Unblock';

  }
  else {
      this.BlockStatus = 'Block';
  }*/


  });
}

};