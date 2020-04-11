import { Customer, CustomerAddresses } from '../customer/customer';
import { Organization } from '../organization/organization';
import { Vendor } from '../vendor/vendor';
import { Currency } from '../../shared/entities/currency';
import { PaymentMethode } from '../../shared/entities/payment-methode';
import { DateObj } from '../../shared/entities/DateObj';
import { Transaction } from '../transaction/transaction';

export interface Shipment {
  ID?: number;
  Code?: string;
  Organizations_Id?: number;
  Customers_Id?: number;
  CustomerAddresses_Id?: number;
  Address?: string;
  Vendors_Id?: number;
  Couriers_Id?: number;
  Currencies_Id?: number;
  PaymentMethodes_Id?: number;
  IncludeShipping?: boolean;
  ShipmentValue?: number;
  ShipmentDt?: DateObj;
  Notes?: string;
  Customer?: Customer;
  Organization?: Organization;
  Vendor?: Vendor;
  Courier?: Customer;
  Currency?: Currency;
  PaymentMethode?: PaymentMethode;
  CustomerAddress?: CustomerAddresses;
  Transaction?: Transaction;
  Weight?: number;

}
