import {CityWithCountry} from '../../sorting/city/city';
export interface BranchBank {
  ID: number;
  NameAr: string;
  NameEn: string;
  Name: string;
  Code: string;
  CityID: string;
  ContactPersonName: string;
  ContactTelNumber: string;
  ContactMobNumber: string;
  ParentID: number;
  ContactEmail: string;
  IsActive: string;
  Cities: CityWithCountry;
}
