import Vue from 'vue'
import moment from 'moment';

import App from './components/app.vue';
import router from './router';

Vue.filter('moment', date => moment(date).format('MMMM Do YYYY, h:mm:ss a'));

new Vue({
  router,
  el: '#app',
  template: '<App/>',
  components: { App }
})

