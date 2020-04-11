import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { PatternsService } from '../../shared/services/patterns.service';
import { routerTransition } from '../../router.animations';
import { NgForm } from '@angular/forms';
import { DeliveriesAndReturnsService } from './deliveries-and-returns.service';
import { deliveriesAndReturns } from './deliveries-and-returns';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { DataTableLanguageService } from '../../shared/services/datatable-language.service';

declare let jsPDF;
@Component({
  // tslint:disable-next-line:component-selector
  selector: 'deliveries-and-returns-page',
  templateUrl: './deliveries-and-returns.component.html',
  // styleUrls: ['./deliveries-and-returns.component.scss'],
  animations: [routerTransition()],
  providers: []
})
export class DeliveriesAndReturnsComponent implements OnInit {
  @ViewChild('detailsForm') public detailsForm: NgForm;
  item: deliveriesAndReturns;
  list: any;
  sinImputarValue = 'B';
  dtOptions: DataTables.Settings = {};
  dtElement: DataTableDirective;
  dtTrigger: Subject<any> = new Subject();
  constructor(private serviceApi: DeliveriesAndReturnsService, 
    private DataTableLanguage: DataTableLanguageService,
    private translate: TranslateService,public patterns: PatternsService) {
    this.item = {
      Address: null,
      Code: null,
      CustmerName: null,
      DateFrom: null,
      DateTo: null,
      IsDeliverd: null,
      Mobile: null,
      ShipmentDt: null
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
  save() {
    // tslint:disable-next-line:no-
    ;
    if (this.sinImputarValue === 'D') {
      this.item.IsDeliverd = true;
    } else if (this.sinImputarValue === 'R') {
      this.item.IsDeliverd = false;
    } else {
      this.item.IsDeliverd = null;
    }
    this.serviceApi.DeliveriesAndReturnsReport(this.item).subscribe(result => {
      this.list = result;
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
