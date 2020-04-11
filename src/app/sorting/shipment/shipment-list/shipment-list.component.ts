import { Component, ViewChild, OnInit, AfterViewInit, Input, Output, EventEmitter, ElementRef } from '@angular/core';
import { PatternsService } from '../../../shared/services/patterns.service';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { Shipment } from '../Shipment';
import { ShipmentService } from '../shipment.service';
import { environment } from '../../../../environments/environment';
import { FileUploader } from 'ng2-file-upload';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { DataTableLanguageService } from '../../../shared/services/datatable-language.service';
const URL = environment.apiURL + 'Shipment/Upload';
@Component({
  selector: 'app-shipment-list',
  templateUrl: './shipment-list.component.html',
  styleUrls: ['./shipment-list.component.scss']
})
export class ShipmentListComponent implements OnInit, AfterViewInit {
  public uploader: FileUploader = new FileUploader({ url: URL, method: 'POST' });
  public hasBaseDropZoneOver = false;
  public hasAnotherDropZoneOver = false;
  @ViewChild(DataTableDirective)
  public dtElement: DataTableDirective;
  dtTrigger: Subject<any> = new Subject();

  @Input() list: Shipment[];
  @Output() notify: EventEmitter<Shipment> = new EventEmitter<Shipment>();

  dtOptions: DataTables.Settings = {};

  constructor(
    private el: ElementRef,
    private _Service: ShipmentService,
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private translate: TranslateService,
    private DataTableLanguage: DataTableLanguageService,
  ) {
    this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
      this._Service.getAll().subscribe(list => {
        this.list = list;
        this.refreshDataSource(this.list);
      });
    };
  }

  public fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }

  public fileOverAnother(e: any): void {
    this.hasAnotherDropZoneOver = e;
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next();
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.state.clear();
    });
  }

  open(itm?: Shipment) {
    this.notify.emit(itm);
  }

  delete = function(id: number) {
    this._Service.remove(id).subscribe(result => {
      const filterResult = this.list.filter(function(element, index, array) {
        return element.ID === id;
      });
      const index: number = this.list.indexOf(filterResult[0]);
      this.list.splice(index, 1);
      // this.refreshDataSource(this.list);
    });
  };
  ngOnInit() {
    this.dtOptions = {
      pagingType: 'full_numbers',
      language : this.DataTableLanguage.language,
      stateSave: true
    };
    this.refreshDataSource(this.list);
    this.uploader.onBeforeUploadItem = item => {
      item.withCredentials = false;
    };
    // this.uploader.onaf;
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
