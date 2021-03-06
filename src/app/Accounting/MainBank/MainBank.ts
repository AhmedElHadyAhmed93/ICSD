import {CityWithCountry} from '../../sorting/city/city';
export interface MainBank {
  ID: number;
  NameAr: string;
  NameEn: string;
  Name: string;
  Code: string;
  CityID: string;
  ContactPersonName: string;
  ContactTelNumber: string;
  ContactMobNumber: string;
  ContactEmail: string;
  IsActive: string;
  Cities: CityWithCountry;
}
