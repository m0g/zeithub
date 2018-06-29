export interface Activity {
  name: string;
  durationMinutes: number;
};

export interface Invoice {
  name: string;
  tax: number;
  discount: number;
  rate: number;
}