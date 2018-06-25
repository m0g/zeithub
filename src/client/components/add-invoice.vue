<template>
  <form method="POST" @submit="createInvoice">
    <fieldset>
      <legend>Client</legend>
      <select name="client" id="" v-model="client">
        <option value="">Select a client</option>
        <option 
          v-for="client in clients" 
          :key="client.id" 
          :value="client.id">{{client.name}}</option>
      </select>
    </fieldset>
    <fieldset>
      <legend>Invoice Activities</legend>
      <table>
        <tr>
          <th>Description</th>
          <th>Qty</th>
          <th>Unit price</th>
          <th>Amount</th>
          <th>Actions</th>
        </tr>
        <tr v-for="(activity, index) in activities" :key="index">
          <td><input type="text" placeholder="Description" v-model="activity.name"/></td>
          <td><input type="number" placeholder="Duration" v-model="activity.durationMinutes" /></td>
          <td><input type="number" placeholder="Unit price" v-model="activity.rate" /></td>
          <td>0</td>
          <td><button @click="activities.splice(index, 1)">&#x2718;</button></td>
        </tr>
        <tr>
          <td><button @click="appendActivity">Add another activity</button></td>
        </tr>
      </table>
    </fieldset>
    <fieldset>
      <legend>Memo</legend>
      <textarea name="memo" id="" cols="40" rows="10"></textarea>
    </fieldset>
    <fieldset>
      <legend>Billing</legend>
      <p>
        <label for="date">Date</label>
        <input type="date" name="date" id="date">
      </p>
      <p>
        <label for="due-date">Due date</label>
        <input type="date" name="due-date" id="due-date">
      </p>
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

@Component
export default class AddInvoice extends Vue {
  client:Object = {};
  clients:Array<Object> = [];
  activities:Array<Object> = [];
  invoice:Object = {};

  @Watch('client')
  onClientSelected(client) {
    console.log('client selected', client)
  }

  created() {
    console.log('on created')
    this.getClients();
  }

  getClients() {
    http('/api/clients', {
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

  appendActivity(e) {
    e.preventDefault()

    this.activities.push({
      name: '',
      durationMinutes: 0,
      rate: 0
    })
  }

  createInvoice(e) {
    e.preventDefault();
  }
}
</script>
