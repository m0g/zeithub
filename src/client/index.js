import Vue from 'vue'
//import VueRouter from 'vue-router';

import App from './components/app.vue';
import router from './router';

new Vue({
  router,
  el: '#app',
  template: '<App/>',
  components: { App }
})

