import { DateTime } from 'luxon';

export const formatDate = (date, format = 'MMMM cccc yyyy, HH:mm:ss') => {
  if (typeof date === 'object') {
    return DateTime.fromJSDate(date).toFormat(format);
  }
  return DateTime.fromISO(date).toFormat(format);
};

export const currency = (
  amount,
  invoice = { currencySign: '€', currencyLeading: false }
) => {
  if (invoice.currencyLeading) {
    return `${invoice.currencySign}${parseFloat(amount).toFixed(2)}`;
  }

  return `${parseFloat(amount).toFixed(2)}${invoice.currencySign}`;
};

export const percentage = amount => `${parseFloat(amount).toFixed(2)}%`;

export const totalHours = minutes =>
  `${Math.floor(minutes / 60)}:${(minutes % 60).toString().padStart(2, '0')}`;

export const iban = value => {
  const pattern = '#### #### #### #### #### ##';
  let i = 0;

  return pattern.replace(/#/g, () => value[i++]);
};

export const invoiceNum = number => number.toString().padStart(3, '0');
