<template>
  <AppCard title="Bank accounts">
    <ul class="divide-y">
      <li
        v-for="account in store.bankAccounts"
        :key="account.id"
        class="flex items-center gap-2 py-2"
      >
        <p class="flex-1">
          <b>{{ account.name }}</b> {{ account.owner }}
          <span class="font-mono">{{ formatIban(account.iban) }}</span>
          {{ account.bic }}
        </p>
        <button
          type="button"
          class="btn-icon"
          title="Delete"
          @click="remove(account)"
        >
          <Icon name="fa6-solid:trash-can" />
        </button>
      </li>
    </ul>
    <p v-if="!store.bankAccounts.length" class="text-gray-600">
      Add the account your clients should pay into.
    </p>

    <form class="mt-4 space-y-2 border-t pt-4" @submit.prevent="create">
      <h3 class="font-semibold">Add a bank account</h3>
      <FormErrors :errors="errors" />
      <div class="grid gap-2 sm:grid-cols-2">
        <input
          v-model="form.name"
          type="text"
          class="input"
          placeholder="Bank name"
        />
        <input
          v-model="form.owner"
          type="text"
          class="input"
          placeholder="Account owner"
        />
        <input
          ref="ibanEl"
          type="text"
          class="input font-mono"
          placeholder="IBAN"
        />
        <input
          ref="bicEl"
          type="text"
          class="input font-mono"
          placeholder="BIC"
        />
      </div>
      <button type="submit" class="btn-primary">Add</button>
    </form>
  </AppCard>
</template>

<script setup lang="ts">
import { useIMask } from 'vue-imask';

const store = useBankAccountsStore();
await store.fetchBankAccounts();

const form = reactive({ name: '', owner: '' });
const errors = ref<string[]>([]);

// Country code, check digits, then up to 30 letters/digits in groups of 4.
const iban = useIMask({
  mask: 'aa00 **** **** **** **** **** **** **',
  prepareChar: (char: string) => char.toUpperCase(),
});
const bic = useIMask({
  mask: /^[A-Za-z0-9]{0,11}$/,
  prepareChar: (char: string) => char.toUpperCase(),
});
const ibanEl = iban.el;
const bicEl = bic.el;

async function create() {
  const input = {
    ...form,
    iban: iban.masked.value,
    bic: bic.masked.value,
  };
  errors.value = validationMessages(bankAccountSchema, input);
  if (errors.value.length) return;

  try {
    await store.createBankAccount(input);
    form.name = '';
    form.owner = '';
    iban.masked.value = '';
    bic.masked.value = '';
  } catch (error) {
    errors.value = errorMessages(error);
  }
}

async function remove(account: BankAccount) {
  if (!window.confirm(`Delete the bank account "${account.name}"?`)) return;
  try {
    await store.removeBankAccount(account.id);
  } catch (error) {
    window.alert(errorMessages(error).join('\n'));
  }
}
</script>
