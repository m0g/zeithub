<template>
  <form method="POST" @submit="createInvoice">
    <fieldset>
      <legend>Project & Client</legend>
      <select name="project" id="" v-model="project" @change="getClients">
        <option value="">Select a project</option>
        <option 
          v-for="project in projects" 
          :key="project.slug" 
          :value="project.slug">{{project.name}}</option>
      </select>
      <select name="client" id="" v-model="client" :disabled="clients.length === 0">
        <option value="">Select a client</option>
        <option 
          v-for="client in clients" 
          :key="client.id" 
          :value="client.id">{{client.name}}</option>
      </select>
    </fieldset>
    <fieldset>
      <legend>Billing</legend>
      <p>
        <label for="rate">Rate</label>
        <input type="rate" name="rate" id="rate" v-model="rate">&euro;
      </p>
      <p>
        <label for="date">Date</label>
        <input type="date" name="date" id="date">
      </p>
      <p>
        <label for="due-date">Due date</label>
        <input type="date" name="due-date" id="due-date">
      </p>
    </fieldset>
    <fieldset>
      <legend>Invoice Activities</legend>
      <table>
        <tr>
          <th>Description</th>
          <th>Duration in min</th>
          <th>Hourly rate</th>
          <th>Amount</th>
          <th>Actions</th>
        </tr>
        <tr v-for="(activity, index) in activities" :key="index">
          <td>
            <input type="text" placeholder="Description" v-model="activity.name" />
          </td>
          <td>
            <input type="number" placeholder="Duration" v-model="activity.durationMinutes" @keyup="computeTotal" />
          </td>
          <td>
            {{rate}}&euro;
          </td>
          <td>{{activity.durationMinutes / 60 * rate | currency}}</td>
          <td><button @click="activities.splice(index, 1)">&#x2718;</button></td>
        </tr>
        <tr>
          <td><button @click="appendActivity">Add another activity</button></td>
        </tr>
        <tr>
          <th colspan="3">Sub total</th>
          <td>{{subTotal | currency}}</td>
        </tr>
        <tr>
          <th colspan="3">Discount</th>
          <td><input type="number" name="discount" v-model="discount" @keyup="computeTotal" />&euro;</td>
        </tr>
        <tr>
          <th colspan="3">Tax</th>
          <td><input type="number" name="tax" v-model="vat" @keyup="computeTotal" />%</td>
        </tr>
        <tr>
          <th colspan="3">Total</th>
          <td>{{total | currency}}</td>
        </tr>
      </table>
    </fieldset>
    <fieldset>
      <legend>Memo</legend>
      <textarea name="memo" id="" cols="40" rows="10"></textarea>
    </fieldset>
    <input type="submit" value="Create invoice" />
  </form>
</template>

<script lang="ts">
import http from './../http';

import {
  Component,
  Prop,
  Watch,
  Vue,
} from "vue-property-decorator";

interface Activity {
  name: string;
  durationMinutes: number;
};

@Component
export default class AddInvoice extends Vue {
  project:string = '';
  projects:Array<Object> = [];
  client:Object = {};
  clients:Array<Object> = [];
  activities:Array<Activity> = [];
  invoice:Object = {};
  discount:number = 0;
  vat:number = 0;
  subTotal:number = 0;
  total:number = 0;
  rate:number = 0;

  created() {
    this.getProjects();
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
        method: "GET",
        headers: { "Content-Type": "application/json" }
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
    e.preventDefault()

    this.activities.push({
      name: '',
      durationMinutes: 0,
    })
  }

  computeTotal() {
    this.subTotal = this.activities.reduce((acc:number, activity:Activity) => {
      return acc + activity.durationMinutes / 60 * this.rate
    }, 0);

    this.total = this.subTotal;

    if (this.discount > 0) {
      this.total = this.total - this.discount;
    }

    if (this.vat > 0) {
      this.total = this.total * (1 + this.vat / 100);
    }
  }

  createInvoice(e) {
    e.preventDefault();
  }
}
</script>