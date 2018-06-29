import * as T from './types';

export class Activity implements T.Activity {
  name: string = '';
  durationMinutes: number = 0;
  projectName: string = '';
  projectSlug: string = '';
};

export class Invoice implements T.Invoice {
  id: number = 0;
  name: string = '';
  tax: number = 0;
  discount: number = 0;
  rate: number = 0;
  bankAccountId: number = 0;
};

export class BankAccount implements T.BankAccount {
  name: string = '';
  owner: string = '';
  iban: string = '';
  bic: string = '';
}