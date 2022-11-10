// import Vue from 'vue';
import { createRouter, createWebHashHistory } from 'vue-router';

import Home from './home.vue';
import Projects from './projects.vue';
import Project from './project.vue';
import CreateProject from './create-project.vue';
import SignIn from './sign-in.vue';
import SignOut from './sign-out.vue';
import SignUp from './sign-up.vue';
import Me from './me.vue';
import Invoices from './invoices.vue';
import Invoice from './invoice.vue';
import AddInvoice from './add-invoice.vue';
import EditInvoice from './edit-invoice.vue';
import Clients from './clients.vue';

import { requireAuth, requireUnauth } from './../auth';

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', name: 'Home', component: Home },
    {
      path: '/projects',
      name: 'Projects',
      beforeEnter: requireAuth,
      component: Projects,
    },
    {
      path: '/projects/new',
      name: 'CreateProject',
      beforeEnter: requireAuth,
      component: CreateProject,
    },
    {
      path: '/projects/:slug',
      name: 'Project',
      beforeEnter: requireAuth,
      component: Project,
    },

    {
      path: '/signin',
      name: 'SignIn',
      beforeEnter: requireUnauth,
      component: SignIn,
    },
    {
      path: '/signout',
      name: 'SignOut',
      beforeEnter: requireAuth,
      component: SignOut,
    },
    {
      path: '/signup',
      name: 'SignUp',
      beforeEnter: requireUnauth,
      component: SignUp,
    },
    {
      path: '/me',
      name: 'Me',
      beforeEnter: requireAuth,
      component: Me,
    },
    {
      path: '/invoices',
      name: 'Invoices',
      beforeEnter: requireAuth,
      component: Invoices,
    },
    {
      path: '/invoices/new',
      name: 'AddInvoice',
      beforeEnter: requireAuth,
      component: AddInvoice,
    },
    {
      path: '/invoices/:id/edit',
      name: 'EditInvoice',
      beforeEnter: requireAuth,
      component: EditInvoice,
    },
    {
      path: '/invoices/:id',
      name: 'Invoice',
      beforeEnter: requireAuth,
      component: Invoice,
    },
    {
      path: '/clients',
      name: 'Clients',
      component: Clients,
    },
  ],
});

export default router;
