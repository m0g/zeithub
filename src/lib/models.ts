import { IsNotEmpty } from 'class-validator';

export class Activity {
  name: string = '';
  durationMinutes: number = 0;
  durationDays: number = 0;
  projectName: string = '';
  projectSlug: string = '';
}

export class Invoice {
  id: number = 0;

  @IsNotEmpty()
  name: string = '';

  tax: number = 0;
  discount: number = 0;
  number: number = 0;

  @IsNotEmpty()
  date: string = '';

  @IsNotEmpty()
  dueDate: string = '';
  memo: string = '';

  @IsNotEmpty()
  currencyCode: string = '';
  currencySign: string = '';
  currencyLeading: boolean = false;

  @IsNotEmpty()
  bankAccountId: number = 0;

  @IsNotEmpty()
  userAddressId: number = 0;
  clientId: number = 0;
}

export class BankAccount {
  name: string = '';
  owner: string = '';
  iban: string = '';
  bic: string = '';
}

export class Me {
  firstName: string = '';
  lastName: string = '';
}

export class Item {
  title: string = '';
  unitPrice: number = 0;
  qty: number = 1;
  projectId: number = 0;
}

export class Client {
  id: number = 0;
  name: string = '';
  taxNumber: string = '';
  vatNumber: string = '';
  street: string = '';
  postcode: string = '';
  country: string = '';
}

export class Project {
  id: number = 0;
  name: string = '';
}
