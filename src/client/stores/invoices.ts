import { defineStore } from 'pinia';
import { ref } from 'vue';
import http from '../http';

export const useInvoicesStore = defineStore('invoices', () => {
  const invoices = ref([]);

  async function fetchInvoices() {
    const response = await http('/api/invoices', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    const data = await response.json();

    if (data.success) {
      invoices.value = data.invoices;
    }
  }

  return { invoices, fetchInvoices };
});
