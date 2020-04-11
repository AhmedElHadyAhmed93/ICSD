import { BranchAccount } from '../BranchAccount/BranchAccount';
import { DateObj } from '../../shared/entities/DateObj';

export interface JournalEntry {
     ID?: number;
     ResourceType?: number;
     Description?: string;
     IsDeleted?: boolean;
     IsAutoGenerated?: boolean;
     Code?: string;
     ReverseDate: DateObj;
     PostingDt: DateObj;
     JournalEntryLines?: JournalEntryLines [];
}
export interface JournalEntrySimple {
     ID: number;
     Name: string;
     Code: string;
}
// export interface JournalEntryLines {
//      ZoneID?: number;
//      Price?: number;
//      ID?: number;
//      Weight: number;
//      WPrice: number;
//      SelectedZone?: JournalEntryLines [];
// }
export interface JournalEntryLines {
     ID: number;
     Code?: string;
     AccountID?: number;
     Amount?: number;
     AmountType?: number;
     Description?: number;
     JournalEntryID?: number;
     Account: any;
     BranchAccountList: any[];
     SelectedBranchAccount: any[];
     SelectedMainAccount: any [];
}


