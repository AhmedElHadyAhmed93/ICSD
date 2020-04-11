import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { PatternsService } from '../../shared/services/patterns.service';
import { routerTransition } from '../../router.animations';
import { NgForm } from '@angular/forms';
import { Http, Response } from '@angular/http';
import { ActivatedRoute, Router, ChildActivationEnd } from '@angular/router';
import { filter, take } from 'rxjs/operators';
import { AddInfoToShipmentService } from './add-info-to-shipment.service';
import { AddInfoToShipment } from './add-info-to-shipment';
import { CustomerService } from '../../sorting/customer/customer.service';
import { TranslateService } from '@ngx-translate/core';
import { DataTableLanguageService } from '../../shared/services/datatable-language.service';

@Component({
  selector: 'AddInfoToShipment-page',
  templateUrl: './add-info-to-shipment.component.html',
  // styleUrls: ['./AddInfoToShipment.component.scss'],
  animations: [routerTransition()],
  providers: [CustomerService]
})
export class AddInfoToShipmentComponent implements OnInit {
  @ViewChild('detailsForm') public detailsForm: NgForm;

  item: AddInfoToShipment;
  constructor(
    private serviceApi: AddInfoToShipmentService,
    private customerAPI: CustomerService,
    public patterns: PatternsService,
    private http: Http,
    private router: Router,
    private translate: TranslateService,
    private DataTableLanguage: DataTableLanguageService,
  ) {
    this.item = {
      Name: null,
      NameAr: null,
      NameEn: null,
      Code: null,
      Notes: null,
      Address: null,
      Mobile: null
    };
  }
  ngOnInit() {}

  getCustomerInfo(code) {
    this.customerAPI.GetBycode(code).subscribe(result => {
      // tslint:disable-next-line:no-

      this.item = result;
    });
  }
  save() {
    this.serviceApi.AddStatement(this.item).subscribe(result => {
      // tslint:disable-next-line:no-
      ;
      // this.item = result;
    });
  }
}
