import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { PatternsService } from '../../shared/services/patterns.service';
import { routerTransition } from '../../router.animations';
import { NgForm } from '@angular/forms';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { ZoneCityService } from './ZoneCity.service';
import { ZoneService } from '../Zone/Zone.service';
import { ZoneCity } from './ZoneCity';
import { CityService } from '../city/city.service';
import { TranslateService } from '@ngx-translate/core';
import { DataTableLanguageService } from '../../shared/services/datatable-language.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'ZoneCity-page',
  templateUrl: './ZoneCity.component.html',
  styleUrls: ['./ZoneCity.component.css'],
  animations: [routerTransition()]
})

export class ZoneCityComponent implements OnInit, AfterViewInit {
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
  item: ZoneCity;
  Zones: any[];
  Cities: any[];

  ZoneCites: any[];

  selectedZones = [];
  selectedZoneCites = [];


  settingsZones = {
    singleSelection: true,
    text: 'Select Zone',
    enableSearchFilter: true,
    badgeShowLimit: 3,
    labelKey: 'Name',
    primaryKey: 'ID'
  };
  settingsZoneCites = {
    singleSelection: false,
    text: 'Select City',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    enableSearchFilter: true,
    badgeShowLimit: 3,
    labelKey: 'Name',
    primaryKey: 'ID'
  };


  constructor(
    private serviceApi: ZoneCityService,
    private cityserviceApi: CityService,
    private zoneService: ZoneService,
    public patterns: PatternsService,
    private translate: TranslateService,
    private DataTableLanguage: DataTableLanguageService,
  ) {}

  onZoneSelect(data) {
   // this.selectedZones.push(data);
    // this.getItemsByID(data.ID);
  }
  getItemsByID(id) {
    this.cityserviceApi.GetAllByZoneId(id).subscribe(list => {
      this.selectedZoneCites = list;
    });
  }
  OnZoneDeSelect(data) {
    this.selectedZones = [];
  }

  // onZoneCitesSelect(data) {
  //   // this.selectedZoneCites.push(data);
  // }
  // OnZoneCitesDeSelect(data) {
  //   const index: number = this.ZoneCites.indexOf(data);
  //   this.ZoneCites.splice(index, 1);
  // }
  // onSelectAllZoneCites(data) {
  //   data.array.forEach(element => {
  //     this.ZoneCites.push(element);
  //   });
  // }
  // onDeSelectAllZoneCites(data) {
  //   this.selectedZoneCites = [];
  // }

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
        this.selectedZones = [];
        this.selectedZoneCites = [];
        this.selectedZones.push(_item);
        this.getItemsByID(_item.ID);
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
    ;
    item.Zones = this.selectedZones[0];
    item.CitiesList = this.selectedZoneCites;
    this.serviceApi.updateItem(item).subscribe(result => {
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
    this.zoneService.getItems().subscribe(list => {
      this.Zones = list;
    });
    this.getCities();
  }
  getCities() {
    this.cityserviceApi.getAllٍSimpe().subscribe(list => {
      this.Cities = list;
    });
  }
}
