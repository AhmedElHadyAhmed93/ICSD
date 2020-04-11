import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { PatternsService } from '../../shared/services/patterns.service';
import { routerTransition } from '../../router.animations';
import { NgForm } from '@angular/forms';
import { Http, Response } from '@angular/http';
import { ActivatedRoute, Router, ChildActivationEnd } from '@angular/router';
import { filter, take } from 'rxjs/operators';
import { CustomerService } from '../customer/customer.service';
import { AddInfoToShipmentService } from './add-info-to-shipment.service';
import { AddInfoToShipment } from '../../operation/add-info-to-shipment/add-info-to-shipment';

import { TranslateService } from '@ngx-translate/core';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'AddI-nfoToShipment-page',
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
    private translate: TranslateService
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
