import Vue from 'vue';
import VueRouter from 'vue-router';

import Home from './home.vue';
import SignIn from './sign-in.vue';
import SignOut from './sign-out.vue';
import SignUp from './sign-up.vue';
import Expenses from './expenses.vue';
import Me from './me.vue';
import Invoices from './invoices.vue';
import Invoice from './invoice.vue';
import AddInvoice from './add-invoice.vue';
import EditInvoice from './edit-invoice.vue';
import Clients from './clients.vue';

import { requireAuth, requireUnauth } from './../auth';

Vue.use(VueRouter);

const router = new VueRouter({
  mode: 'history',
  routes: [
    { path: '/', name: 'Home', component: Home },
    {
      path: '/signin',
      name: 'SignIn',
      beforeEnter: requireUnauth,
      component: SignIn
    },
    {
      path: '/signout',
      name: 'SignOut',
      beforeEnter: requireAuth,
      component: SignOut
    },
    {
      path: '/signup',
      name: 'SignUp',
      beforeEnter: requireUnauth,
      component: SignUp
    },
    {
      path: '/expenses',
      name: 'Expenses',
      beforeEnter: requireAuth,
      component: Expenses
    },
    {
      path: '/me',
      name: 'Me',
      beforeEnter: requireAuth,
      component: Me
    },
    {
      path: '/invoices',
      name: 'Invoices',
      beforeEnter: requireAuth,
      component: Invoices
    },
    {
      path: '/invoices/new',
      name: 'AddInvoice',
      beforeEnter: requireAuth,
      component: AddInvoice
    },
    {
      path: '/invoices/:id/edit',
      name: 'EditInvoice',
      beforeEnter: requireAuth,
      component: EditInvoice
    },
    {
      path: '/invoices/:id',
      name: 'Invoice',
      beforeEnter: requireAuth,
      component: Invoice
    },
    {
      path: '/clients',
      name: 'Clients',
      component: Clients
    }
  ]
});

export default router;
