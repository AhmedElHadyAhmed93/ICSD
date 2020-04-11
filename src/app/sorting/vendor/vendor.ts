export interface Vendor {
     ID?: number;
     NameAr?: string;
     NameEn?: string;
     Name?: string;
     IsDeleted?: boolean;
     Code?: string;
     VendorZones?: SelectedZone [];
}
export interface VendorSimple {
     ID: number;
     Name: string;
     Code: string;
}
export interface VendorZones {
     ZoneID?: number;
     Price?: number;
     ID?: number;
     Weight: number;
     WPrice: number;
     SelectedZone?: SelectedZone [];
}
export interface SelectedZone {
     ID: number;
     Name: string;
}


