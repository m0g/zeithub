import Vue from 'vue';

import App from './components/app.vue';
import router from './router';

import './../lib/filters';

new Vue({
  router,
  el: '#app',
  template: '<App/>',
  components: { App }
});
