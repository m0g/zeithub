<template>
  <table class="activities">
    <tr>
      <th>Project</th>
      <th>Task</th>
      <th>Time (in minutes)</th>
      <th width="12%">Amount</th>
    </tr>
    <tr v-for="activity in activities" :key="activity.id">
      <td>{{activity.projectName}}</td>
      <td>{{activity.name}}</td>
      <td>{{activity.durationMinutes | formatHours}}</td>
      <td class="amount">
        {{activity.durationMinutes / 60 * invoice.amount | currencyPDF}}
        <img src="/euro.svg" width="6px" />
      </td>
    </tr>
    <tr>
      <th></th>
      <td>Total time</td>
      <td colspan="2">{{totalMinutes | totalHours}}</td>
    </tr>
    <tr>
      <th></th>
      <td>Sub total</td>
      <td colspan="2">
        {{totalMinutes / 60 * invoice.amount | currencyPDF}}
        <img src="/euro.svg" width="6px" />
      </td>
    </tr>
  </table>
</template>

<script lang="ts">
import {
  Component,
  Emit,
  Inject,
  Model,
  Prop,
  Provide,
  Vue,
  Watch
} from "vue-property-decorator";

interface Activity {
  durationMinutes: string;
};

@Component
export default class ActivitiesTable extends Vue {
  totalMinutes: number = 0;

  @Prop({ type: Array, default: [] }) activities: Array<Activity>;
  @Prop({ type: Object, default: {} }) invoice: Object;

  @Watch('activities')
  onActivitiesChanged(activities: Array<Activity>) {
    this.totalMinutes = activities
      .reduce((acc: number, next: Activity) => acc + parseInt(next.durationMinutes), 0);
  }
}
</script>
