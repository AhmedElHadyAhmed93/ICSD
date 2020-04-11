import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { PatternsService } from '../../shared/services/patterns.service';
import { routerTransition } from '../../router.animations';
import { NgForm } from '@angular/forms';
import { Subject } from 'rxjs';

import { DataTableDirective } from 'angular-datatables';
import { Http, Response } from '@angular/http';
import { VendorService } from './vendor.service';
import { OrganizationService } from '../organization/organization.service';
import { ZoneService } from '../Zone/Zone.service';

import { Vendor , VendorZones} from './vendor';
import { TranslateService } from '@ngx-translate/core';
import { DataTableLanguageService } from '../../shared/services/datatable-language.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'vendor-page',
  templateUrl: './vendor.component.html',
  styleUrls: ['./vendor.component.css'],
  animations: [routerTransition()]
})
export class VendorComponent implements OnInit, AfterViewInit {
  @ViewChild('detailsForm') public detailsForm: NgForm;
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtTrigger: Subject<any> = new Subject();
  list: any[] = [];
  dtOptions: DataTables.Settings = {};
  operation = 'view';
  item: Vendor;
  orginzations: any[];
  selectedorginzation: any;
  config2: any = { placeholder: 'Select organization', sourceField: ['NameEn'] };
  selectedItems = [];
  selectedVendorZones = [];

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

  _ZoneList: VendorZones[];
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
    private serviceApi: VendorService,
    private OrgService: OrganizationService,
    private zoneService: ZoneService,
    public patterns: PatternsService,
    private http: Http,
    private translate: TranslateService,
    private DataTableLanguage: DataTableLanguageService
  ) {}

  ngAfterViewInit(): void {
    this.dtTrigger.next();
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.state.clear();
    });
  }
  open = function(_item?: any) {
  //  this.detailsForm.reset();
    this.operation = _item == null ? 'add' : 'edit';
    switch (this.operation) {
      case 'add':
        this.item = {};
        break;
      case 'edit':
      this._ZoneList = [];
      if (this.selectedVendorZones.length > 0) {
        this.selectedVendorZones.forEach(element => {
          this.Zones.push(element);
          const index: number = this.selectedVendorZones.indexOf(element);
          this.selectedVendorZones.splice(index, 1);
        });
      }
      _item.VendorZones.forEach(element => {
        let item = this.Zones.filter(function(e) {return e.ID === element.ZoneID; });
          if (item.length === 0 ) {
               item = this.selectedVendorZones.filter(function(e) {return e.ID === element.ZoneID; });
          } else {
            this.selectedVendorZones.push(item[0]);
            const filterResult = this.Zones.filter(function(e) {
              return e.ID === item[0].ID;
            });
            const index: number = this.Zones.indexOf(filterResult[0]);
            this.Zones.splice(index, 1);
          }
        this._ZoneList.push({
          // ID: element.ID,
          Price: element.Price,
          ZoneID: element.ZoneID,
          SelectedZone: item,
          WPrice: element.WPrice,
          Weight: element.Weight

        });
      });
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
    if ( this.selectedorginzation !== undefined) {
      item.Organizations_Id = this.selectedorginzation.ID;
    }
    item.VendorZones = [];
     this._ZoneList.forEach(element => {
       item.VendorZones.push({ Price: element.Price, ZoneID: element.SelectedZone[0].ID, WPrice: element.WPrice,
        Weight: element.Weight});
    });
    // item.VendorZones = this._ZoneList;
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
    this.OrgService.getItemsSimple().subscribe(list => {
      this.orginzations = list;
    });
    this.zoneService.getItemsSimple().subscribe(list => {
      this.Zones = list;
    });
    this.serviceApi.getItemsbyOrganization(null).subscribe(list => {
      this.refreshDataSource(list);
    });
  }

  OrganizationSelected(event) {
    this.selectedorginzation = event;
    this.serviceApi.getItemsbyOrganization(event.ID).subscribe(list => {
      this.refreshDataSource(list);
    });
  }

  OnOrganizationDeSelect(event) {
    this.selectedorginzation = null;
    this.serviceApi.getItemsbyOrganization(null).subscribe(list => {
      this.refreshDataSource(list);
    });
  }
  onInputChangedEvent(event) {}
  ClearData() {
    this._ZoneList = [];
  }
  changeValue(id: number, property: string, event: any) {
    if (property === 'ZoneList') {
       if ( this.selectedVendorZones === undefined) {
         this.selectedVendorZones = [];
       }
       this.selectedVendorZones.push(event);
       const filterResult = this.Zones.filter(function(element) {
         return element.ID === event.ID;
       });
       const index: number = this.Zones.indexOf(filterResult[0]);
       this.Zones.splice(index, 1);
    }
  }
  remove(id: any) {
    // this.awaitingZoneList.push(this._ZoneList[id]);
    this._ZoneList.splice(id, 1);
  }
  updateList(id: number, property: string, event: any) {
     if (property === 'ZoneList') {
       if ( this.selectedVendorZones !== undefined) {
         this.Zones.push(event);
         const filterResult = this.selectedVendorZones.filter(function(element) {
           return element.ID === event.ID;
         });
         const index: number = this.selectedVendorZones.indexOf(filterResult[0]);
         this.selectedVendorZones.splice(index, 1);
       }
     }
  }
  add() {
    if (this._ZoneList === undefined) {
      this._ZoneList = [];
    }
    this._ZoneList.push({
      ID: 0,
      ZoneID: 0,
      Price: 0,
      Weight: 0,
      WPrice: 0,
      SelectedZone: []
    });
  }
}
