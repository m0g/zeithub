<template>
  <li>
    <span>{{client.name}}</span>
    <span>{{client.street}}</span>
    <button @click="editMode = !editMode">&#9998;</button>
    <button v-on:click="remove()">&#x2718;</button>
  </li>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import http from '../http';

import * as T from './../../types';

console.log('types', T);

const Props = Vue.extend({
  props: ['client', 'getClients']
});

@Component({})
export default class Client extends Props {
  async remove() {
    const response = await http(`/api/clients/${this.client.id}`, {
      headers: { 'Content-Type': 'application/json' },
      method: 'DELETE'
    });

    const data = await response.json();

    if (data.success) {
      this.getClients();
    }
  }
}
</script>
