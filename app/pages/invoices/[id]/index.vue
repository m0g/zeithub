<template>
  <AppCard :title="doc.invoice.name" :padded="false">
    <template #actions>
      <a :href="`/api/invoices/${id}/pdf`" class="btn-primary">
        <Icon name="fa6-solid:download" /> Download PDF
      </a>
      <NuxtLink :to="`/invoices/${id}/edit`" class="btn bg-white">
        <Icon name="fa6-solid:pen" /> Edit
      </NuxtLink>
      <button type="button" class="btn-danger bg-white" @click="remove">
        <Icon name="fa6-solid:trash-can" /> Delete
      </button>
    </template>
    <div class="overflow-x-auto bg-gray-100 p-4">
      <div class="mx-auto w-fit shadow-lg">
        <InvoiceDocument :data="doc" />
      </div>
    </div>
  </AppCard>
</template>

<script setup lang="ts">
import { InvoiceDocument } from '#shared/invoice/document';

const route = useRoute();
const store = useInvoicesStore();
const id = Number(route.params.id);

const doc = await store.fetchInvoice(id).catch(error => {
  throw createError({ statusCode: error?.statusCode ?? 404, fatal: true });
});

async function remove() {
  if (!window.confirm(`Delete the invoice "${doc.invoice.name}"?`)) return;
  await store.removeInvoice(id);
  await navigateTo('/invoices');
}
</script>
