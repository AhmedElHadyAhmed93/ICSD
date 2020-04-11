import{CountrySimple} from '../country/country'
export interface City {
    ID: number;
    Name: string;
    NameAr: string;
    NameEn: string;
    Code: string;
    Latitude: number;
    Longitude: number;
    Countries_ID: number;
}

export interface CityWithCountry {
    ID: number;
    Name: string;
    Countries:CountrySimple;
}
