<template>
  <AppCard title="Invoices" :padded="false">
    <template #actions>
      <NuxtLink to="/invoices/new" class="btn-primary">
        <Icon name="fa6-solid:plus" /> New invoice
      </NuxtLink>
    </template>
    <div class="overflow-x-auto">
      <table v-if="store.invoices.length" class="w-full table-auto">
        <thead>
          <tr class="bg-gray-100">
            <th class="border px-2 py-2">Number</th>
            <th class="border px-4 py-2 text-left">Name</th>
            <th class="border px-4 py-2 text-left">Date</th>
            <th class="border px-4 py-2 text-right">Total</th>
            <th class="border px-2 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          <InvoiceRow
            v-for="invoice in store.invoices"
            :key="invoice.id"
            :invoice="invoice"
            @remove="remove"
          />
        </tbody>
      </table>
      <p v-else class="p-4 text-gray-600">
        No invoices yet.
        <NuxtLink to="/invoices/new" class="link"
          >Create your first one</NuxtLink
        >.
      </p>
    </div>
  </AppCard>
</template>

<script setup lang="ts">
const store = useInvoicesStore();
await store.fetchInvoices();

async function remove(invoice: InvoiceListEntry) {
  if (!window.confirm(`Delete the invoice "${invoice.name}"?`)) return;
  await store.removeInvoice(invoice.id);
}
</script>
