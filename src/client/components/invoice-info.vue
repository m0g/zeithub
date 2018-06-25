<template>
  <table class="info">
    <tr>
      <td>Invoice number</td>
      <td>{{invoice.number}}</td>
    </tr>
    <tr>
      <td>Date</td>
      <td>{{invoice.date | formatDate('DD/MM/YYYY')}}</td>
    </tr>
    <tr>
      <td>Due date</td>
      <td>{{invoice.dueDate | formatDate('DD/MM/YYYY')}}</td>
    </tr>
    <tr>
      <td>Tax number</td>
      <td>{{me.taxNumber}}</td>
    </tr>
  </table>
</template>
<script lang="ts">
import {
  Component,
  Prop,
  Vue,
} from "vue-property-decorator";

@Component
export default class InvoiceInfo extends Vue {
  @Prop({ type: Object, default: {} }) invoice: Object;
  @Prop({ type: Object, default: {} }) me: Object;
}
</script>
