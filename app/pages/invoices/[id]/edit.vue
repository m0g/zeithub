<template>
  <div>
    <h2 class="mb-4 text-2xl font-semibold">Edit {{ doc.invoice.name }}</h2>
    <InvoiceForm :initial="doc" submit-label="Save invoice" :save="update" />
  </div>
</template>

<script setup lang="ts">
const route = useRoute();
const store = useInvoicesStore();
const id = Number(route.params.id);

const doc = await store.fetchInvoice(id).catch(error => {
  throw createError({ statusCode: error?.statusCode ?? 404, fatal: true });
});

async function update(input: InvoiceInput) {
  await store.updateInvoice(id, input);
  await navigateTo(`/invoices/${id}`);
}
</script>
