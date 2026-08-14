<script setup lang="ts">
import { ref, computed } from 'vue'
import { useLedgerStore, type KeyCategory } from '../stores/ledger'
import { useProgressStore } from '../stores/progress'
import HelpTip from '../components/HelpTip.vue'

const ledger = useLedgerStore()
const progress = useProgressStore()

const keyCategories: Array<{ value: KeyCategory; label: string }> = [
  { value: 'delivery', label: 'Association delivery (earn)' },
  { value: 'goal', label: 'Season Life Goal (earn)' },
  { value: 'evaluation', label: 'Krom evaluation (spend)' },
  { value: 'recipe-unlock', label: 'Cauldron recipe unlock (spend)' },
  { value: 'chest', label: 'Treasure chest (spend)' },
  { value: 'other', label: 'Other' }
]

const newKey = ref({ delta: 1, category: 'delivery' as KeyCategory, note: '' })
const newGold = ref({ delta: 0, item: '', qty: 1, note: '' })

function addKey() {
  if (newKey.value.delta === 0) return
  ledger.addKeyTxn(newKey.value.delta, newKey.value.category, newKey.value.note)
  newKey.value = { delta: 1, category: newKey.value.category, note: '' }
}
function addGold() {
  if (newGold.value.delta === 0) return
  ledger.addGoldTxn(newGold.value.delta, newGold.value.item, newGold.value.qty, newGold.value.note)
  newGold.value = { delta: 0, item: '', qty: 1, note: '' }
}

const projections = computed(() => [1, 3, 5, 10].map(n => ({ n, cost: progress.costOfNextN(n) })))

function fmtGold(n: number): string { return n.toLocaleString() }
function fmtDate(iso: string): string { return new Date(iso).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }) }
</script>

<template>
  <q-page padding>
    <div class="fg-display text-h4 fg-ink q-mb-md">Ledgers</div>

    <div class="row q-col-gutter-md">
      <!-- Keys -->
      <div class="col-12 col-lg-6">
        <q-card flat class="fg-card">
          <q-card-section class="row items-center q-pb-xs">
            <q-icon name="key" color="secondary" size="24px" class="q-mr-sm" />
            <div class="text-subtitle1 text-weight-bold">Key Ledger</div>
            <HelpTip topic="keyLedger" class="q-ml-sm" />
            <q-space />
            <div class="fg-display text-h4 fg-ink">{{ ledger.keyBalance }}</div>
          </q-card-section>

          <q-card-section class="q-py-xs">
            <div class="row q-gutter-sm text-caption fg-muted">
              <div v-for="p in projections" :key="p.n">
                next {{ p.n }} eval{{ p.n > 1 ? 's' : '' }}: <b class="text-secondary">{{ p.cost }}</b> keys
              </div>
            </div>
            <div class="text-caption fg-muted q-mt-xs">
              Rule: never unlock a cauldron recipe before checking this month's Iria barter list.
            </div>
          </q-card-section>

          <q-card-section class="q-py-sm">
            <div class="row q-col-gutter-xs">
              <div class="col-3"><q-input v-model.number="newKey.delta" dense outlined type="number" label="± keys" /></div>
              <div class="col-5"><q-select v-model="newKey.category" dense outlined label="Category" :options="keyCategories" emit-value map-options /></div>
              <div class="col-3"><q-input v-model="newKey.note" dense outlined label="Note" @keyup.enter="addKey" /></div>
              <div class="col-1"><q-btn class="full-width" unelevated color="primary" icon="add" @click="addKey" /></div>
            </div>
          </q-card-section>

          <q-list separator dense style="max-height: 420px; overflow: auto">
            <q-item v-for="t in ledger.keyTxns" :key="t.id">
              <q-item-section side>
                <q-badge :color="t.delta > 0 ? 'positive' : 'negative'">{{ t.delta > 0 ? '+' : '' }}{{ t.delta }}</q-badge>
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-capitalize">{{ t.category.replace('-', ' ') }}</q-item-label>
                <q-item-label caption>{{ fmtDate(t.at) }}<span v-if="t.note"> — {{ t.note }}</span></q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-btn flat dense round size="xs" icon="close" color="grey-7" @click="ledger.removeKeyTxn(t.id)" />
              </q-item-section>
            </q-item>
            <q-item v-if="ledger.keyTxns.length === 0">
              <q-item-section class="fg-muted text-caption">No transactions yet. Keys come from daily deliveries, Association Deliveries, and Life Goals.</q-item-section>
            </q-item>
          </q-list>
        </q-card>
      </div>

      <!-- Gold -->
      <div class="col-12 col-lg-6">
        <q-card flat class="fg-card">
          <q-card-section class="row items-center q-pb-xs">
            <q-icon name="paid" color="secondary" size="24px" class="q-mr-sm" />
            <div class="text-subtitle1 text-weight-bold">Gold / Sales Ledger</div>
            <HelpTip topic="goldLedger" class="q-ml-sm" />
            <q-space />
            <div class="text-h5 text-weight-bold" :class="ledger.goldBalance >= 0 ? 'text-secondary' : 'text-negative'">
              {{ fmtGold(ledger.goldBalance) }}g
            </div>
          </q-card-section>

          <q-card-section v-if="ledger.goldByItem.length" class="q-py-xs">
            <div class="text-caption fg-muted q-mb-xs">Top earners:</div>
            <div class="row q-gutter-xs">
              <q-chip v-for="[item, amt] in ledger.goldByItem.slice(0, 5)" :key="item" dense square color="grey-9" text-color="secondary">
                {{ item }}: {{ fmtGold(amt) }}g
              </q-chip>
            </div>
          </q-card-section>

          <q-card-section class="q-py-sm">
            <div class="row q-col-gutter-xs">
              <div class="col-3"><q-input v-model.number="newGold.delta" dense outlined type="number" label="± gold" /></div>
              <div class="col-4"><q-input v-model="newGold.item" dense outlined label="Item" /></div>
              <div class="col-2"><q-input v-model.number="newGold.qty" dense outlined type="number" label="Qty" /></div>
              <div class="col-2"><q-input v-model="newGold.note" dense outlined label="Note" @keyup.enter="addGold" /></div>
              <div class="col-1"><q-btn class="full-width" unelevated color="primary" icon="add" @click="addGold" /></div>
            </div>
          </q-card-section>

          <q-list separator dense style="max-height: 420px; overflow: auto">
            <q-item v-for="t in ledger.goldTxns" :key="t.id">
              <q-item-section side>
                <q-badge :color="t.delta > 0 ? 'positive' : 'negative'">{{ t.delta > 0 ? '+' : '' }}{{ fmtGold(t.delta) }}</q-badge>
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ t.item || '(unlabeled)' }} <span v-if="t.qty > 1" class="fg-muted">×{{ t.qty }}</span></q-item-label>
                <q-item-label caption>{{ fmtDate(t.at) }}<span v-if="t.note"> — {{ t.note }}</span></q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-btn flat dense round size="xs" icon="close" color="grey-7" @click="ledger.removeGoldTxn(t.id)" />
              </q-item-section>
            </q-item>
            <q-item v-if="ledger.goldTxns.length === 0">
              <q-item-section class="fg-muted text-caption">Track sales here to see which product line earns most. Revenue priority: tier-3+ barter → Seasonal Dishes → Physique Stew → rare materials.</q-item-section>
            </q-item>
          </q-list>
        </q-card>
      </div>
    </div>
  </q-page>
</template>
