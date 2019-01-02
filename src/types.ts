export interface Activity {
  name: string;
  durationMinutes: number;
  durationDays: number;
  projectName: string;
  projectSlug: string;
}

export interface Invoice {
  id: number;
  name: string;
  tax: number;
  discount: number;
  rate: number;
  bankAccountId: number;
  number: number;
  userAddressId: number;
}

export interface BankAccount {
  name: string;
  owner: string;
  iban: string;
  bic: string;
}

export interface Me {
  firstName: string;
  lastName: string;
}

export interface Client {
  id: number;
  name: string;
  street: string;
}
