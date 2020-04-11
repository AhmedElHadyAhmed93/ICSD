export interface Customer {
  ID: number;
  NameAr?: string;
  NameEn?: string;
  Name?: string;
  IsDeleted?: boolean;
  Code?: string;
  SSN?: string;
  ZoneID?: number;

  Mail?: string;
  Mobile?: string;
  CustomerAddresses?: CustomerAddresses[];
}

export interface CustomerAddresses {
  ID: number;
  Customer_Id: number;
  Countries_Id: number;
  Cities_ID: number;
  Areas_ID: number;
  AddressAr: string;
  AddressEn: string;
  Address: string;
}
