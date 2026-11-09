export const useCurrenciesStore = defineStore('currencies', () => {
  const currencies = ref<Currency[]>([]);

  async function fetchCurrencies() {
    // Reference data: load once.
    if (currencies.value.length === 0) {
      currencies.value = await $fetch<Currency[]>('/api/currencies');
    }
    return currencies.value;
  }

  return { currencies, fetchCurrencies };
});
