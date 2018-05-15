import Vue from 'vue';
import moment from 'moment';

import App from './components/app.vue';
import router from './router';

Vue.filter(
  'formatDate',
  (date, format = 'MMMM Do YYYY, h:mm:ss a') => moment(date).format(format)
);

Vue.filter('currency', amount => `${parseFloat(amount).toFixed(2)}€`);

new Vue({
  router,
  el: '#app',
  template: '<App/>',
  components: { App }
});

