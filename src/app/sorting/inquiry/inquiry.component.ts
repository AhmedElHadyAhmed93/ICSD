import { Component, OnInit, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { PatternsService } from '../../shared/services/patterns.service';
import { routerTransition } from '../../router.animations';
import { NgForm } from '@angular/forms';
import { Subject } from 'rxjs';

import { DataTableDirective } from 'angular-datatables';
import { Http, Response } from '@angular/http';
import { InquiryService } from './inquiry.service';
import { ActivatedRoute, Router, ChildActivationEnd } from '@angular/router';
import { filter, take } from 'rxjs/operators';
import { Inquiry } from './Inquiry';
import { TranslateService } from '@ngx-translate/core';
import { DataTableLanguageService } from '../../shared/services/datatable-language.service';

declare let jsPDF;
@Component({
  selector: 'inquiry-page',
  templateUrl: './inquiry.component.html',
  // styleUrls: ['./deliveries-and-returns.component.scss'],
  animations: [routerTransition()],
  providers: []
})
export class InquiryComponent implements OnInit {
  @ViewChild('detailsForm') public detailsForm: NgForm;
  item: Inquiry;
  list: any;
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  constructor(private content: ElementRef,
    private DataTableLanguage: DataTableLanguageService,
    private serviceApi: InquiryService, public patterns: PatternsService, private translate: TranslateService) {
    // this.list.push({Code: 1, NameAr: 'Ahmed', NameEn: 'Ahmed'});
    this.item = {
      Code: null,
      NameEn: null,
      Mobile: null
    };
  }
  // tslint:disable-next-line:use-life-cycle-interface
  ngAfterViewInit(): void {
    this.dtTrigger.next();
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.state.clear();
    });
  }
  refreshDataSource(list): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.destroy();
      this.list = list;
      this.dtTrigger.next();
    });
  }
  search() {
    this.serviceApi.CustomerInquery(this.item).subscribe(result => {
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
