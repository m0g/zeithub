export const useInvoicesStore = defineStore('invoices', () => {
  const invoices = ref<InvoiceListEntry[]>([]);

  const nextNumber = computed(
    () => Math.max(0, ...invoices.value.map(invoice => invoice.number)) + 1
  );

  async function fetchInvoices() {
    invoices.value = await $fetch<InvoiceListEntry[]>('/api/invoices');
    return invoices.value;
  }

  function fetchInvoice(id: number) {
    return $fetch(`/api/invoices/${id}`);
  }

  async function createInvoice(input: InvoiceInput) {
    const created = await $fetch('/api/invoices', {
      method: 'POST',
      body: input,
    });
    await fetchInvoices();
    return created;
  }

  async function updateInvoice(id: number, input: InvoiceInput) {
    const updated = await $fetch(`/api/invoices/${id}`, {
      method: 'PUT',
      body: input,
    });
    await fetchInvoices();
    return updated;
  }

  async function removeInvoice(id: number) {
    await $fetch(`/api/invoices/${id}`, { method: 'DELETE' });
    await fetchInvoices();
  }

  return {
    invoices,
    nextNumber,
    fetchInvoices,
    fetchInvoice,
    createInvoice,
    updateInvoice,
    removeInvoice,
  };
});
