<template>
  <tr :class="{ 'bg-gray-100': index % 2 !== 0 }">
    <td class="align-center text-center text-bold border py-2">
      {{ invoice.number }}
    </td>
    <td class="border px-4 py-2">
      <router-link :to="{ name: 'Invoice', params: { id: invoice.id } }">
        {{ invoice.name }}
      </router-link>
    </td>
    <td class="align-center border px-4 py-2">
      {{ currency(total, invoice) }}
    </td>
    <td class="align-center border px-2 py-2 text-center">
      <button @click="downloadPDF(invoice)" class="btn">
        <font-awesome-icon icon="download" />
      </button>
      <button @click="remove(invoice)" class="btn ml-2">
        <font-awesome-icon icon="trash-alt" />
      </button>
    </td>
  </tr>
</template>

<script lang="ts" setup>
import { defineProps } from 'vue';
import slugify from 'slugify';
import { currency } from '../../lib/filters';
import http from '../http';
const { invoice, getInvoices, me } = defineProps([
  'invoice',
  'index',
  'getInvoices',
  'me',
]);

let total: number = invoice.subTotal;

if (invoice.discount > 0) {
  total = total - invoice.discount;
}

if (invoice.tax > 0) {
  total = total * (1 + invoice.tax / 100);
}

async function remove({ id }) {
  if (window.confirm('Do you really want to delete this invoice?')) {
    const response = await http(`/api/invoices/${id}`, {
      headers: { 'Content-Type': 'application/json' },
      method: 'DELETE',
    });

    const data = await response.json();

    if (data.success) {
      getInvoices();
    }
  }
}

async function downloadPDF(invoice) {
  const title = slugify(invoice.name);
  const fullName = `${me.firstName}-${me.lastName}`;
  const filename = `${invoice.number
    .toString()
    .padStart(3, '0')}-${title}-${fullName}.pdf`.toLowerCase();

  const response = await http(`/api/invoices/${invoice.id}/pdf`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });

  const blob = await response.blob();
  const file = new Blob([blob], { type: 'application/pdf' });
  const link = document.createElement('a');

  link.href = window.URL.createObjectURL(file);
  link.download = filename;

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
</script>
