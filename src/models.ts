import * as T from './types';

export class Activity implements T.Activity {
  name: string = '';
  durationMinutes: number = 0;
  durationDays: number = 0;
  projectName: string = '';
  projectSlug: string = '';
}

export class Invoice implements T.Invoice {
  id: number = 0;
  name: string = '';
  tax: number = 0;
  discount: number = 0;
  rate: number = 0;
  number: number = 0;
  date: string = '';
  dueDate: string = '';
  memo: string = '';
  currencyCode: string = '';
  currencySign: string = '';
  currencyLeading: boolean = false;
  bankAccountId: number = 0;
  userAddressId: number = 0;
  clientId: number = 0;
}

export class BankAccount implements T.BankAccount {
  name: string = '';
  owner: string = '';
  iban: string = '';
  bic: string = '';
}

export class Me implements T.Me {
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
