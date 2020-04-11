import { Customer } from '../customer/customer';
import { DeliveryStatus } from './delivery-status';
import { IDType } from './idtype';

export interface Transaction {
  ID: number;
  Shipments_Id?: number;
  Shipments_Code?: string;
  Organizations_Name?: string;
  Vendors_Name?: string;
  Couriers_Name?: string;
  Customers_Name?: string;
  DeliveryStatuses_Id?: number;
  IDTypes_Id?: number;
  TransactionDt?: Date;
  IDNum?: string;
  Notes?: string;
  IsDelivered?: boolean;
  Courier?: Customer;
  Customers?: Customer[];
  DeliveryStatus?: DeliveryStatus;
  IDType?: IDType;
}

export interface TransactionSC {
  TransactionDt?: string;
  Couriers_Id?: number;
  Customers_IDs?: number[];
  Courier?: Customer;
  Customers?: Customer[];
  IsDelivered?: boolean;
}

export interface TransactionSC {
  TransactionDt?: string;
  Couriers_Id?: number;
  CustomerIDs?: number[];
  Courier?: Customer;
  Customers?: Customer[];
  IsDelivered?: boolean;
}
