import { Component, OnInit, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { PatternsService } from '../../shared/services/patterns.service';
import { routerTransition } from '../../router.animations';
import { NgForm } from '@angular/forms';
import { Subject } from 'rxjs';

import { DataTableDirective } from 'angular-datatables';
import { Http, Response } from '@angular/http';
import { OperationsInOrganizationService } from './operations-in-organization.service';
import { ActivatedRoute, Router, ChildActivationEnd } from '@angular/router';
import { filter, take } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { DataTableLanguageService } from '../../shared/services/datatable-language.service';
declare let jsPDF;
@Component({
  // tslint:disable-next-line:component-selector
  selector: 'OperationsInOrganization-page',
  templateUrl: './operations-in-organization.component.html',
  // styleUrls: ['./deliveries-and-returns.component.scss'],
  animations: [routerTransition()],
  providers: []
})
export class OperationsInOrganizationComponent implements OnInit {
  @ViewChild('detailsForm') public detailsForm: NgForm;
  item: string;
  list: any;
  dtOptions: DataTables.Settings = {};
  dtElement: DataTableDirective;
  dtTrigger: Subject<any> = new Subject();
  constructor(
    private content: ElementRef,
    private translate: TranslateService,
    private serviceApi: OperationsInOrganizationService,
    public patterns: PatternsService,
    private DataTableLanguage: DataTableLanguageService,
  ) {
    // this.list.push({Code: 1, NameAr: 'Ahmed', NameEn: 'Ahmed'});
  }
  ngAfterViewInit(): void {
    this.dtTrigger.next();
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.state.clear();
    });
  }
  // tslint:disable-next-line:use-life-cycle-interface

  refreshDataSource(list): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.destroy();
      this.list = list;
      this.dtTrigger.next();
    });
  }
  search() {
    this.serviceApi.GetAllShipmentSByOperationName(this.item).subscribe(result => {
      //  ;
      this.list = result;
      // this.item = { name: 'ahmed' };
    });
  }
  print() {
    const doc = new jsPDF();
    const specialElememtHandlers = {
      '#editor': function(element, renderer) {
        return true;
      }
    };
    const prtContent = document.getElementById('user');

    setTimeout(() => {
      doc.fromHTML(
        prtContent,
        15,
        15,
        {
          width: 190,
          elementHandlers: specialElememtHandlers
        },
        function() {
          window.open(doc.output('bloburl'), '_blank');
        }
      );
    }, 0);
  }
  ngOnInit() {
    this.dtOptions = {
      pagingType: 'full_numbers',
      language : this.DataTableLanguage.language,
      stateSave: true
    };
  }
}
