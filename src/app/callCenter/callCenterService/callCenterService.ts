export class CallCenterService {
  public StatusDate: Date;
  public ShipmentID: number;
  public Status: number;
  public NewPrice: number;
  public CallCenterType: number ;
  public Code: string;
}
export class CallCenterSearch {
  public CustomerID?: number;
  public CustomerPhone?: number;
  public DateTo?: Date;
  public DateFrom?: Date;
  public Mobile?: string;
  public IsDelivered?: boolean;
}

export class CallCenter {
  public Status?: number ;
  public CallCenterType?: number ;
  public StatusDate?: Date;
  public Notes?: string ;
  public ShipmentID?: number;
  public NewPrice?: number;
  public Code?: string;
  public TransactionID?: number;
  public Customer_Mobile?: string;
  public IsDelivered?: boolean;
  public Customers_Name?: string ;
  public Customers_Mobile: string ;

}
export class CallCenterGrid {
  public ID: number ;
  public Customers_Name: string ;
  public Shipments_Code: string;
  public Customers_Mobile: string ;
  public Shipments_Value: string;
  public IsDelivered: boolean;
  public Shipments_Id: string;
}

