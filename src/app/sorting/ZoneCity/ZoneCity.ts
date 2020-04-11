import { Zone } from '../Zone/Zone';
import { City } from '../city/city';
export interface ZoneCity {
    ID: number;
    Name: string;
    NameAr: string;
    NameEn: string;
    Code: string;
    Latitude: number;
    Longitude: number;
    Zones: Zone;
    CitiesList: [City];
}
