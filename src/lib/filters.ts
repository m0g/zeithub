import * as Vue from 'vue/dist/vue.common.js';
import { DateTime } from 'luxon';

// For some reason, when parsing the date from Puppeteer,
// the date ends up a JS date object rather than a string
// Hence the type check in the function
Vue.filter('formatDate', (date, format = 'MMMM cccc yyyy, HH:mm:ss') => {
  if (typeof date === 'object') {
    return DateTime.fromJSDate(date).toFormat(format);
  }
  return DateTime.fromISO(date).toFormat(format);
});

Vue.filter('currency', (amount, invoice) => {
  if (invoice.currencyLeading) {
    return `${invoice.currencySign}${parseFloat(amount).toFixed(2)}`;
  }

  return `${parseFloat(amount).toFixed(2)}${invoice.currencySign}`;
});

Vue.filter('percentage', amount => `${parseFloat(amount).toFixed(2)}%`);

Vue.filter(
  'totalHours',
  minutes =>
    `${Math.floor(minutes / 60)}:${(minutes % 60).toString().padStart(2, '0')}`
);

Vue.filter('iban', value => {
  const pattern = '#### #### #### #### #### ##';
  let i = 0;

  return pattern.replace(/#/g, () => value[i++]);
});

Vue.filter('invoiceNum', number => number.toString().padStart(3, '0'));
