<template>
  <form @submit.prevent="submit">
    <AppCard title="Billing">
      <FormErrors :errors="errors" />
      <div class="grid gap-4 md:grid-cols-2">
        <div class="md:col-span-2">
          <label class="label" for="invoice-name">Title</label>
          <input
            id="invoice-name"
            v-model="form.name"
            type="text"
            class="input w-full"
            placeholder="Invoice ACME 11/2026"
          />
        </div>
        <div>
          <label class="label" for="invoice-number">Invoice number</label>
          <input
            id="invoice-number"
            v-model.number="form.number"
            type="number"
            min="1"
            class="input w-full"
          />
        </div>
        <div>
          <label class="label" for="invoice-client">Client</label>
          <select
            id="invoice-client"
            v-model="form.clientId"
            class="select w-full"
          >
            <option :value="null">Select a client</option>
            <option
              v-for="client in clients"
              :key="client.id"
              :value="client.id"
            >
              {{ client.name }}
            </option>
          </select>
        </div>
        <div>
          <label class="label" for="invoice-address">Your address</label>
          <select
            id="invoice-address"
            v-model="form.userAddressId"
            class="select w-full"
          >
            <option :value="null">Select an address</option>
            <option
              v-for="address in addresses"
              :key="address.id"
              :value="address.id"
            >
              {{ address.name }}: {{ address.street }}, {{ address.city }}
            </option>
          </select>
        </div>
        <div>
          <label class="label" for="invoice-bank">Bank account</label>
          <select
            id="invoice-bank"
            v-model="form.bankAccountId"
            class="select w-full"
          >
            <option :value="null">Select a bank account</option>
            <option
              v-for="account in bankAccounts"
              :key="account.id"
              :value="account.id"
            >
              {{ account.name }} {{ formatIban(account.iban) }}
            </option>
          </select>
        </div>
        <div>
          <label class="label" for="invoice-currency">Currency</label>
          <select
            id="invoice-currency"
            v-model="form.currencyCode"
            class="select w-full"
          >
            <option v-for="c in currencies" :key="c.code" :value="c.code">
              {{ c.name }} ({{ c.sign }})
            </option>
          </select>
        </div>
        <div>
          <label class="label" for="invoice-date">Date</label>
          <input
            id="invoice-date"
            v-model="form.date"
            type="date"
            class="input w-full"
          />
        </div>
        <div>
          <label class="label" for="invoice-due-date">Due date</label>
          <input
            id="invoice-due-date"
            v-model="form.dueDate"
            type="date"
            class="input w-full"
          />
        </div>
      </div>
    </AppCard>

    <AppCard title="Items">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="text-left text-sm text-gray-600">
              <th class="p-2">Project</th>
              <th class="p-2">Description</th>
              <th class="p-2">Unit price</th>
              <th class="p-2">Qty</th>
              <th class="p-2 text-right">Amount</th>
              <th class="p-2" />
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in form.items" :key="index">
              <td class="p-2">
                <select
                  v-model="item.projectId"
                  class="select"
                  aria-label="Project"
                >
                  <option :value="null">No project</option>
                  <option
                    v-for="project in projects"
                    :key="project.id"
                    :value="project.id"
                  >
                    {{ project.name }}
                  </option>
                </select>
              </td>
              <td class="p-2">
                <input
                  v-model="item.title"
                  type="text"
                  class="input w-full min-w-48"
                  placeholder="Description"
                  aria-label="Description"
                />
              </td>
              <td class="p-2">
                <input
                  v-model.number="item.unitPrice"
                  type="number"
                  step="0.01"
                  class="input w-28"
                  aria-label="Unit price"
                />
              </td>
              <td class="p-2">
                <input
                  v-model.number="item.qty"
                  type="number"
                  min="0.1"
                  step="0.1"
                  class="input w-24"
                  aria-label="Quantity"
                />
              </td>
              <td class="p-2 text-right font-mono whitespace-nowrap">
                {{ money(lineAmountCents(itemInput(item))) }}
              </td>
              <td class="p-2">
                <button
                  type="button"
                  class="btn-icon"
                  title="Remove item"
                  @click="form.items.splice(index, 1)"
                >
                  <Icon name="fa6-solid:xmark" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <button type="button" class="btn mt-2" @click="addItem">
        <Icon name="fa6-solid:plus" /> Add item
      </button>

      <dl
        class="mt-4 ml-auto grid max-w-sm grid-cols-[1fr_auto] items-center gap-x-4 gap-y-2"
      >
        <dt class="font-semibold">Net amount</dt>
        <dd class="text-right font-mono">{{ money(totals.netCents) }}</dd>
        <dt>
          <label class="font-semibold" for="invoice-discount">
            Discount ({{ currency?.sign }})
          </label>
        </dt>
        <dd class="text-right">
          <input
            id="invoice-discount"
            v-model.number="form.discount"
            type="number"
            min="0"
            step="0.01"
            class="input w-28 text-right"
          />
        </dd>
        <dt>
          <label class="font-semibold" for="invoice-tax">Tax (VAT %)</label>
        </dt>
        <dd class="text-right">
          <input
            id="invoice-tax"
            v-model.number="form.taxRate"
            type="number"
            min="0"
            max="100"
            step="0.01"
            class="input w-28 text-right"
          />
        </dd>
        <dt class="font-semibold">Tax amount</dt>
        <dd class="text-right font-mono">{{ money(totals.taxCents) }}</dd>
        <dt class="text-lg font-semibold">Total</dt>
        <dd class="text-right font-mono text-lg font-semibold">
          {{ money(totals.totalCents) }}
        </dd>
      </dl>
    </AppCard>

    <AppCard title="Memo">
      <textarea
        v-model="form.memo"
        rows="5"
        class="input w-full"
        placeholder="Printed below the items, e.g. payment terms"
      />
    </AppCard>

    <div class="flex gap-2">
      <button type="submit" class="btn-primary" :disabled="pending">
        {{ submitLabel }}
      </button>
      <button v-if="draftKey" type="button" class="btn" @click="resetForm">
        Clear form
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { DateTime } from 'luxon';

interface ItemForm {
  title: string;
  qty: number | '';
  unitPrice: number | '';
  projectId: number | null;
}

interface FormState {
  name: string;
  number: number | '';
  date: string;
  dueDate: string;
  memo: string;
  discount: number | '';
  taxRate: number | '';
  currencyCode: string;
  clientId: number | null;
  bankAccountId: number | null;
  userAddressId: number | null;
  items: ItemForm[];
}

const props = defineProps<{
  initial?: InvoiceDocumentData;
  defaultNumber?: number;
  // When set, the form is saved to localStorage under this key while typing.
  draftKey?: string;
  submitLabel: string;
  save: (input: InvoiceInput) => Promise<unknown>;
}>();

const clientsStore = useClientsStore();
const projectsStore = useProjectsStore();
const addressesStore = useAddressesStore();
const bankAccountsStore = useBankAccountsStore();
const currenciesStore = useCurrenciesStore();

await Promise.all([
  clientsStore.fetchClients(),
  projectsStore.fetchProjects(),
  addressesStore.fetchAddresses(),
  bankAccountsStore.fetchBankAccounts(),
  currenciesStore.fetchCurrencies(),
]);

const clients = computed(() => clientsStore.clients);
const projects = computed(() => projectsStore.projects);
const addresses = computed(() => addressesStore.addresses);
const bankAccounts = computed(() => bankAccountsStore.bankAccounts);
const currencies = computed(() => currenciesStore.currencies);

const emptyItem = (): ItemForm => ({
  title: '',
  qty: 1,
  unitPrice: '',
  projectId: null,
});

function blankForm(): FormState {
  const today = DateTime.local();
  return {
    name: '',
    number: props.defaultNumber ?? 1,
    date: today.toISODate()!,
    dueDate: today.plus({ days: 30 }).toISODate()!,
    memo: '',
    discount: 0,
    taxRate: 0,
    currencyCode: 'EUR',
    clientId: null,
    // Preselect when there's only one choice.
    bankAccountId:
      bankAccounts.value.length === 1 ? bankAccounts.value[0]!.id : null,
    userAddressId: addresses.value.length === 1 ? addresses.value[0]!.id : null,
    items: [emptyItem()],
  };
}

function fromDocument(doc: InvoiceDocumentData): FormState {
  const { invoice } = doc;
  return {
    name: invoice.name,
    number: invoice.number,
    date: invoice.date,
    dueDate: invoice.dueDate,
    memo: invoice.memo ?? '',
    discount: fromCents(invoice.discountCents),
    taxRate: invoice.taxRate,
    currencyCode: invoice.currencyCode,
    clientId: invoice.clientId,
    bankAccountId: invoice.bankAccountId,
    userAddressId: invoice.userAddressId,
    items: doc.items.map(item => ({
      title: item.title,
      qty: item.qty,
      unitPrice: fromCents(item.unitPriceCents),
      projectId: item.projectId,
    })),
  };
}

function loadDraft(): FormState | null {
  if (!props.draftKey) return null;
  try {
    const draft = JSON.parse(localStorage.getItem(props.draftKey) ?? 'null');
    return draft && Array.isArray(draft.items) ? draft : null;
  } catch {
    return null;
  }
}

const form = ref<FormState>(
  props.initial ? fromDocument(props.initial) : (loadDraft() ?? blankForm())
);
const errors = ref<string[]>([]);
const pending = ref(false);

if (props.draftKey) {
  watch(
    form,
    value => localStorage.setItem(props.draftKey!, JSON.stringify(value)),
    { deep: true }
  );
}

const currency = computed(() =>
  currencies.value.find(c => c.code === form.value.currencyCode)
);

function itemInput(item: ItemForm): InvoiceItemInput {
  return {
    title: item.title,
    qty: item.qty === '' ? 0 : item.qty,
    unitPriceCents: toCents(item.unitPrice),
    projectId: item.projectId,
  };
}

function toInput(state: FormState): InvoiceInput {
  return {
    name: state.name,
    number: state.number === '' ? 0 : state.number,
    date: state.date,
    dueDate: state.dueDate,
    memo: state.memo,
    discountCents: toCents(state.discount),
    taxRate: state.taxRate === '' ? 0 : state.taxRate,
    currencyCode: state.currencyCode,
    clientId: state.clientId,
    bankAccountId: state.bankAccountId,
    userAddressId: state.userAddressId,
    items: state.items.map(itemInput),
  };
}

const totals = computed(() => {
  const input = toInput(form.value);
  return computeInvoiceTotals(
    input.items.map(item => ({
      qty: item.qty,
      unitPriceCents: item.unitPriceCents,
    })),
    input.discountCents,
    input.taxRate
  );
});

function money(cents: number) {
  return formatMoney(cents, currency.value);
}

function addItem() {
  form.value.items.push(emptyItem());
}

function resetForm() {
  if (props.draftKey) localStorage.removeItem(props.draftKey);
  form.value = blankForm();
  errors.value = [];
}

async function submit() {
  const input = toInput(form.value);
  errors.value = validationMessages(invoiceSchema, input);
  if (errors.value.length) return;

  pending.value = true;
  try {
    await props.save(input);
    if (props.draftKey) localStorage.removeItem(props.draftKey);
  } catch (error) {
    errors.value = errorMessages(error);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } finally {
    pending.value = false;
  }
}
</script>
