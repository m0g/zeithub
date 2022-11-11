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

  async function removeInvoice({ id }) {
    if (window.confirm('Do you really want to delete this invoice?')) {
      const response = await http(`/api/invoices/${id}`, {
        headers: { 'Content-Type': 'application/json' },
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        fetchInvoices();
      }
    }
  }

  return { invoices, fetchInvoices, removeInvoice };
});
