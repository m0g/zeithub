import { createApp } from 'vue';
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
  faSignOutAlt,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { createPinia } from 'pinia';

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

const pinia = createPinia();
const app = createApp(App);

app.use(router);
app.use(pinia);
app.component('font-awesome-icon', FontAwesomeIcon);
app.mount('#app');
