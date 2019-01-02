<template>
  <form method="POST" @submit="createInvoice">
    <form-errors :errors="errors"></form-errors>
    <fieldset>
      <legend>Project & Client</legend>
      <select name="project" id="" v-model="project" @change="getClients">
        <option value="">Select a project</option>
        <option
          v-for="project in projects"
          :key="project.slug"
          :value="project.slug"
          >{{ project.name }}</option
        >
      </select>
      <select
        name="client"
        id=""
        v-model="client"
        :disabled="clients.length === 0"
      >
        <option value="">Select a client</option>
        <option v-for="client in clients" :key="client.id" :value="client.id">{{
          client.name
        }}</option>
      </select>
    </fieldset>
    <fieldset>
      <legend>Billing</legend>
      <p><input type="text" placeholder="Title" v-model="name" /></p>
      <p>
        <input
          type="number"
          placeholder="Invoice number"
          :min="lastInvoiceNumber + 1"
          v-model="invoiceNumber"
        />
      </p>

      <select-address
        v-bind:value="userAddressId"
        v-on:userAddressId="userAddressId = $event"
      ></select-address>
      <select-bank-account
        v-bind:value="iban"
        v-on:iban="iban = $event"
      ></select-bank-account>
      <p>
        <label for="rate">Rate</label>
        <input type="number" name="rate" id="rate" v-model="rate" />&euro;
      </p>
      <p>
        <label for="rate">Rate type</label>
        <select v-model="dailyRate">
          <option value="0">Hourly</option>
          <option value="1">Daily</option>
        </select>
      </p>
      <p>
        <label for="date">Date</label>
        <input type="date" name="date" id="date" v-model="date" />
      </p>
      <p>
        <label for="due-date">Due date</label>
        <input type="date" name="due-date" id="due-date" v-model="dueDate" />
      </p>
    </fieldset>
    <fieldset>
      <legend>Invoice Activities</legend>
      <table>
        <tr>
          <th>Project</th>
          <th>Description</th>
          <th>Duration in min</th>
          <th>Hourly rate</th>
          <th>Amount</th>
          <th>Actions</th>
        </tr>
        <tr v-for="(activity, index) in activities" :key="index">
          <td>{{ project }}</td>
          <td>
            <input
              type="text"
              placeholder="Description"
              v-model="activity.name"
            />
          </td>
          <td>
            <input
              type="number"
              placeholder="Duration"
              v-model="activity.durationMinutes"
              @keyup="computeTotal"
            />
          </td>
          <td>{{ rate }}&euro;</td>
          <td>{{ ((activity.durationMinutes / 60) * rate) | currency }}</td>
          <td>
            <button @click="activities.splice(index, 1)">&#x2718;</button>
          </td>
        </tr>
        <tr>
          <td><button @click="appendActivity">Add another activity</button></td>
        </tr>
        <tr>
          <th colspan="3">Sub total</th>
          <td>{{ subTotal | currency }}</td>
        </tr>
        <tr>
          <th colspan="3">Discount</th>
          <td>
            <input
              type="number"
              name="discount"
              v-model="discount"
              @keyup="computeTotal"
            />
            &euro;
          </td>
        </tr>
        <tr>
          <th colspan="3">Tax</th>
          <td>
            <input
              type="number"
              name="tax"
              v-model="vat"
              @keyup="computeTotal"
            />%
          </td>
        </tr>
        <tr>
          <th colspan="3">Total</th>
          <td>{{ total | currency }}</td>
        </tr>
      </table>
    </fieldset>
    <fieldset>
      <legend>Memo</legend>
      <textarea name="memo" id="" cols="40" rows="10" v-model="memo"></textarea>
    </fieldset>
    <fieldset>
      <legend>Actions</legend>
      <input type="submit" value="Create invoice" />
    </fieldset>
  </form>
</template>

<script lang="ts">
import http from './../http';
import FormErrors from './form-errors.vue';

import { Component, Prop, Watch, Vue } from 'vue-property-decorator';

import { Activity } from './../../types';
import SelectBankAccount from './select-bank-account.vue';
import SelectAddress from './select-address.vue';

@Component({ components: { FormErrors, SelectBankAccount, SelectAddress } })
export default class AddInvoice extends Vue {
  project: string = '';
  projects: {}[] = [];
  client: string = '';
  clients: Array<Object> = [];
  activities: Array<Activity> = [];
  invoice: Object = {};
  discount: number = 0;
  vat: number = 0;
  subTotal: number = 0;
  total: number = 0;
  rate: number = 0;
  dailyRate: boolean = false;
  errors: Array<string> = [];
  date: string = '';
  dueDate: string = '';
  memo: string = '';
  name: string = '';
  iban: string = '';
  userAddressId: string = '';
  invoiceNumber: number = 0;
  lastInvoiceNumber: number = 0;

  created() {
    this.getProjects();
    this.getLastInvoiceNumber();
  }

  getLastInvoiceNumber() {
    http('/api/invoices', {
      headers: { 'Content-Type': 'application/json' },
      method: 'GET'
    })
      .then(response => response.json())
      .then(response => {
        if (response.success) {
          response.invoices.forEach(invoice => {
            if (invoice.number > this.lastInvoiceNumber) {
              this.lastInvoiceNumber = invoice.number;
            }
          });

          this.invoiceNumber = this.lastInvoiceNumber + 1;
        }
      });
  }

  getProjects() {
    http('/api/projects')
      .then(data => data.json())
      .then(projects => {
        this.projects = projects;
      });
  }

  getClients(e) {
    const slug = e.target.value;

    if (slug) {
      http(`/api/projects/${slug}/clients`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      })
        .then(response => response.json())
        .then(response => {
          if (response.success && response.clients.length > 0) {
            this.clients = response.clients;
          }
        });
    }
  }

  appendActivity(e) {
    e.preventDefault();

    this.activities.push({
      name: '',
      durationMinutes: 0,
      projectName: '',
      projectSlug: this.project
    });
  }

  computeTotal() {
    this.subTotal = this.activities.reduce(
      (acc: number, activity: Activity) => {
        return acc + (activity.durationMinutes / 60) * this.rate;
      },
      0
    );

    this.total = this.subTotal;

    if (this.discount > 0) {
      this.total = this.total - this.discount;
    }

    if (this.vat > 0) {
      this.total = this.total * (1 + this.vat / 100);
    }
  }

  async createInvoice(e) {
    e.preventDefault();
    this.errors = [];

    if (!this.client) {
      this.errors.push('Client is missing');
    }

    if (!this.project) {
      this.errors.push('Project is missing');
    }

    if (!this.name) {
      this.errors.push('Title is missing');
    }

    if (!this.date) {
      this.errors.push('Date is missing');
    }

    if (!this.dueDate) {
      this.errors.push('Due date is missing');
    }

    if (!this.iban) {
      this.errors.push('Bank account is missing');
    }

    if (!this.rate) {
      this.errors.push('Rate is missing');
    }

    if (!this.userAddressId) {
      this.errors.push('Address is missing');
    }

    if (this.activities.length === 0) {
      this.errors.push('You should at least add one activity');
    }

    if (this.errors.length === 0) {
      const body = {
        client: this.client,
        projectSlug: this.project,
        name: this.name,
        number: this.invoiceNumber,
        date: this.date,
        dueDate: this.dueDate,
        rate: this.rate,
        dailyRate: this.dailyRate,
        discount: this.discount,
        vat: this.vat,
        iban: this.iban,
        userAddressId: this.userAddressId,
        memo: this.memo,
        activities: this.activities
      };

      const response = await http('/api/invoices/with-activities', {
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
        body: JSON.stringify(body)
      });

      const data = await response.json();

      if (data.success && data.invoiceId) {
        this.$router.push({
          name: 'Invoice',
          params: { id: data.invoiceId }
        });
      }
    }
  }
}
</script>
