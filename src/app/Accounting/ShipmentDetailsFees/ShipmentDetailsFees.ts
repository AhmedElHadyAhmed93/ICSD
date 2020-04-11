import {Shipment} from '../../sorting/shipment/shipment';
import {Transaction} from '../../sorting/transaction/transaction';
import {Customer} from '../../sorting/customer/customer';

export class ShipmentDetailsFees {
  TransactionID?: Number;
  CustomerID?: Number;
  ShipmentID?: Number;
  ID?: Number;
  shipOriginalPrice?: Number;
  shipPriceFees?: Number;
  IsComfirmed?: boolean;
  IsComplete?: boolean;
  Shipment?: Shipment;
  Transaction?: Transaction;
  Customer?: Customer;
}
export class Search {
  public CustomerID?: number;
  public VendorID?: number;
  public DateTo?: Date;
  public DateFrom?: Date;
  public Code?: Date;
}
