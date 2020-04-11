import { DateObj } from '../../shared/entities/DateObj';
import {MainAccount} from '../MainAccount/MainAccount';
import {MainBank} from '../MainBank/MainBank';

export interface Cheque {
  ID: number;
  Status?: number;
  Amount?: number;
  Description: string;
  Code?: string;
  SendForCollectionDate?:  DateObj;
  CollectedDate?: DateObj;
  RefusalDate?: DateObj;
  RefusalReason?: string;
  ChequeType?: number;
  CustomerID?: number;
  VendorID?: number;
  BankID?: number;
  AccountID?: number;
  Bank: any;
  Account: any;
  Customer: any;
  Vendor: any;
}
