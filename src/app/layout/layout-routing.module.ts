import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from './layout.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'prefix' },
      { path: 'dashboard', loadChildren: './dashboard/dashboard.module#DashboardModule' },
      { path: 'CallCenter', loadChildren: '../callCenter/callCenterService/callCenterService.module#CallCenterModule' },
      { path: 'Accounting', loadChildren: '../Accounting/ShipmentDetailsFees/ShipmentDetailsFees.module#ShipmentDetailsFeesModule' },
      { path: 'MainAccount', loadChildren: '../Accounting/MainAccount/MainAccount.module#MainAccountModule' },
      { path: 'BranchAccount', loadChildren: '../Accounting/BranchAccount/BranchAccount.module#BranchAccountModule' },
      { path: 'MainBank', loadChildren: '../Accounting/MainBank/MainBank.module#MainBankModule' },
      { path: 'JournalEntry', loadChildren: '../Accounting/JournalEntry/JournalEntry.module#JournalEntryModule' },
      { path: 'BranchBank', loadChildren: '../Accounting/BranchBank/BranchBank.module#BranchBankModule' },
      { path: 'Cheque', loadChildren: '../Accounting/Cheque/Cheque.module#ChequeModule' },
      { path: 'FollowCallCenter', loadChildren: '../callCenter/callCenterService/callCenterService.module#CallCenterModule' },
      { path: 'charts', loadChildren: './charts/charts.module#ChartsModule' },
      { path: 'tables', loadChildren: './tables/tables.module#TablesModule' },
      { path: 'forms', loadChildren: './form/form.module#FormModule' },
      { path: 'bs-element', loadChildren: './bs-element/bs-element.module#BsElementModule' },
      { path: 'grid', loadChildren: './grid/grid.module#GridModule' },
      { path: 'components', loadChildren: './bs-component/bs-component.module#BsComponentModule' },
      { path: 'blank-page', loadChildren: './blank-page/blank-page.module#BlankPageModule' },
      { path: 'shipment', loadChildren: '../sorting/shipment/shipment.module#ShipmentModule' },
      { path: 'transactions', loadChildren: '../sorting/transaction/transaction.module#TransactionModule' },
      { path: 'country', loadChildren: '../sorting/country/country.module#CountryModule' },
      { path: 'city', loadChildren: '../sorting/city/city.module#CityModule' },
      { path: 'Zone', loadChildren: '../sorting/Zone/Zone.module#ZoneModule' },
      { path: 'ZoneCity', loadChildren: '../sorting/ZoneCity/ZoneCity.module#ZoneCityModule' },
      { path: 'area', loadChildren: '../sorting/area/area.module#AreaModule' },
      { path: 'organization', loadChildren: '../sorting/organization/organization.module#OrganizationModule' },
      { path: 'customer', loadChildren: '../sorting/customer/customer.module#CustomerModule' },
      { path: 'courier', loadChildren: '../sorting/customer/customer.module#CustomerModule' },
      { path: 'vendor', loadChildren: '../sorting/vendor/vendor.module#VendorModule' },
      { path: 'POD', loadChildren: '../sorting/POD/POD.module#PODModule'},
      { path: 'deliveries-and-returns', loadChildren: '../operation/deliveries-and-returns/deliveries-and-returns.module#DeliveriesAndReturnsModule'},
      { path: 'inquiry', loadChildren: '../operation/inquiry/inquiry.module#InquiryModule'},
      { path: 'AddInfoToShipmentService', loadChildren: '../operation/add-info-to-shipment/add-info-to-shipment.module#AddInfoToShipmentModule'},
      { path: 'operations', loadChildren: '../operation/operations-in-organization/operations-in-organization.module#OperationsInOrganizationModule'},
      { path: 'Sales', loadChildren: '../sales/sales/sales.module#SalesModule'},
      { path: 'Ticket', loadChildren: '../ticket/ticket.module#TicketModule'},

      { path: 'roles', loadChildren: '../membership/roles/roles.module#RolesModule'},
      { path: 'users', loadChildren: '../membership/users/users.module#UsersModule'},
     // { path: 'ShipmentDetailsFees', loadChildren: '../membership/users/users.module#UsersModule'},
      { path: 'ShipmentDetailsFees', loadChildren: '../Accounting/ShipmentDetailsFees/ShipmentDetailsFees.module#ShipmentDetailsFeesModule' },
      
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LayoutRoutingModule {}
