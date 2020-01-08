import Vue from 'vue';
import { DateTime } from 'luxon';
import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faDownload,
  faTrashAlt,
  faClock,
  faUsers,
  faReceipt,
  faFileInvoice,
  faUserCircle,
  faFolder,
  faSignInAlt,
  faSignOutAlt
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

import './style.css';

import App from './components/app.vue';
import router from './routes';

library.add(
  faDownload,
  faTrashAlt,
  faClock,
  faUsers,
  faReceipt,
  faFileInvoice,
  faUserCircle,
  faFolder,
  faSignInAlt,
  faSignOutAlt
);

Vue.component('font-awesome-icon', FontAwesomeIcon);

// Duplication of filters with filter.ts
Vue.filter('formatDate', (date, format = 'MMMM cccc yyyy, HH:mm:ss') =>
  DateTime.fromISO(date).toFormat(format)
);

Vue.filter(
  'currency',
  (amount, currency = { currencySign: '€', currencyLeading: false }) => {
    if (currency.currencyLeading) {
      return `${currency.currencySign}${parseFloat(amount).toFixed(2)}`;
    }

    return `${parseFloat(amount).toFixed(2)}${currency.currencySign}`;
  }
);

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

Vue.filter('duration', timestamp =>
  DateTime.fromSeconds(timestamp).toFormat('HH:mm:ss')
);

new Vue({
  router,
  el: '#app',
  template: '<App/>',
  components: { App }
});
