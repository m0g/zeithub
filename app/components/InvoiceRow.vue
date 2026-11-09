<template>
  <tr class="odd:bg-white even:bg-gray-50">
    <td class="border px-2 py-2 text-center font-mono">
      {{ formatInvoiceNumber(invoice.number) }}
    </td>
    <td class="border px-4 py-2">
      <NuxtLink :to="`/invoices/${invoice.id}`" class="link">
        {{ invoice.name }}
      </NuxtLink>
      <p v-if="invoice.client" class="text-sm text-gray-600">
        {{ invoice.client.name }}
      </p>
    </td>
    <td class="border px-4 py-2 whitespace-nowrap">
      {{ formatDate(invoice.date) }}
    </td>
    <td class="border px-4 py-2 text-right font-mono whitespace-nowrap">
      {{ formatMoney(invoice.totals.totalCents, invoice.currency) }}
    </td>
    <td class="border px-2 py-2 text-center whitespace-nowrap">
      <a
        :href="`/api/invoices/${invoice.id}/pdf`"
        class="btn-icon"
        title="Download PDF"
      >
        <Icon name="fa6-solid:download" />
      </a>
      <button
        type="button"
        class="btn-icon"
        title="Delete"
        @click="emit('remove', invoice)"
      >
        <Icon name="fa6-solid:trash-can" />
      </button>
    </td>
  </tr>
</template>

<script setup lang="ts">
defineProps<{ invoice: InvoiceListEntry }>();
const emit = defineEmits<{ remove: [invoice: InvoiceListEntry] }>();
</script>
