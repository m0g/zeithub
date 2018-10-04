<template>
  <li>
    <span>
      {{activity.startTime | formatDate('HH:mm')}} - 
      {{activity.endTime | formatDate('HH:mm')}}
    </span>
    <span>{{activity.name}}</span>
    <span>{{activity.durationMinutes}}</span>
    <router-link :to="{ name: 'Project', params: { slug: activity.projectSlug } }">
      {{activity.projectName}}
    </router-link>
  </li>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';

const Props = Vue.extend({
  props: ['activity']
});

@Component({})
export default class Activity extends Props {}
</script>
