<template>
  <div>
    <h2 class="mb-4 text-2xl font-semibold">New invoice</h2>
    <InvoiceForm
      :default-number="store.nextNumber"
      draft-key="zeithub:new-invoice-draft"
      submit-label="Create invoice"
      :save="create"
    />
  </div>
</template>

<script setup lang="ts">
const store = useInvoicesStore();
await store.fetchInvoices();

async function create(input: InvoiceInput) {
  const created = await store.createInvoice(input);
  await navigateTo(`/invoices/${created.invoice.id}`);
}
</script>
