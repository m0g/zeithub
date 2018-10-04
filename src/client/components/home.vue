<template>
  <div>
    <h1>Konta</h1>
    <p>v{{version}}</p>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { version } from './../../../package.json';

@Component({})
export default class Home extends Vue {
  version: string = version;
}
</script>
