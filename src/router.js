import Vue from 'vue'
import VueRouter from 'vue-router';

import Home from './components/home.vue';
import Projects from './components/projects.vue';
import CreateUser from './components/create-user.vue';

Vue.use(VueRouter);

export default new VueRouter({
  mode: 'history',
  routes: [
    { path: '/', name: 'Home', component: Home },
    { path: '/projects', name: 'Projects', component: Projects },
    { path: '/users/new', name: 'CreateUser', component: CreateUser },
  ]
})


