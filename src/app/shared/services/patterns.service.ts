import { Injectable } from '@angular/core';

@Injectable()
export class PatternsService {
	public Alphanumeric: string;
	public Number: string;	
	public Year: string;
	public Text:string;
	public TextAr:string;
	public Decimal : string;
	constructor() {
		this.Number = '^([0-9]){1,50}$';
		this.Alphanumeric = '^([0-9]|[a-z]|[A-Z]| |/|\){1,50}$';
		this.Text = '^([0-9]|[a-z]|[A-Z]| |\/|\\){1,50}$';		
		this.TextAr = '^[\u0621-\u064A\u0660-\u0669 ]+$';		
		this.Year = '^[1-2][0-9]{3}$';
		this.Decimal = '^[0-9]{1,7}(?:.[0-9]{1,2})?$';
	}	
}
