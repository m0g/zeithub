export const useBankAccountsStore = defineStore('bankAccounts', () => {
  const bankAccounts = ref<BankAccount[]>([]);

  async function fetchBankAccounts() {
    bankAccounts.value = await $fetch<BankAccount[]>('/api/bank-accounts');
    return bankAccounts.value;
  }

  async function createBankAccount(input: BankAccountInput) {
    await $fetch('/api/bank-accounts', { method: 'POST', body: input });
    await fetchBankAccounts();
  }

  async function removeBankAccount(id: number) {
    await $fetch(`/api/bank-accounts/${id}`, { method: 'DELETE' });
    await fetchBankAccounts();
  }

  return {
    bankAccounts,
    fetchBankAccounts,
    createBankAccount,
    removeBankAccount,
  };
});
