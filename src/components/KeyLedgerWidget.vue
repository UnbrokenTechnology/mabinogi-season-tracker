<script setup lang="ts">
import { ref } from 'vue'
import { useLedgerStore, type KeyCategory } from '../stores/ledger'
import { useProgressStore } from '../stores/progress'

const ledger = useLedgerStore()
const progress = useProgressStore()

const quickAmount = ref<number | null>(null)

function quickAdd(sign: 1 | -1, category: KeyCategory) {
  const amt = Math.abs(quickAmount.value ?? 1)
  ledger.addKeyTxn(sign * amt, category)
  quickAmount.value = null
}
</script>

<template>
  <q-card flat class="fg-card overflow-hidden">
    <div class="fg-bar">
      <q-icon name="key" size="16px" :style="{ color: 'var(--fg-gold)' }" />
      <span class="fg-bar-title">Life Association Keys</span>
      <q-space />
      <span class="fg-display text-h5 text-weight-bold" :style="{ color: 'var(--fg-gold)' }">{{ ledger.keyBalance }}</span>
    </div>

    <q-card-section class="q-py-sm fg-tint-gold">
      <div class="row text-center">
        <div class="col-4">
          <div class="fg-label">Next eval</div>
          <div class="text-subtitle1 text-weight-bold"
               :class="ledger.keyBalance >= progress.nextEvalCost ? 'fg-green-text' : 'fg-red-text'">
            {{ progress.nextEvalCost }} <q-icon name="key" size="13px" />
          </div>
        </div>
        <div class="col-4">
          <div class="fg-label">Next 5</div>
          <div class="text-subtitle1 text-weight-bold fg-gold-text">{{ progress.costOfNextN(5) }} <q-icon name="key" size="13px" /></div>
        </div>
        <div class="col-4">
          <div class="fg-label">Evals taken</div>
          <div class="text-subtitle1 text-weight-bold fg-ink">{{ progress.evalCount }}</div>
        </div>
      </div>
    </q-card-section>
    <q-separator />
    <q-card-section class="q-py-sm">
      <div class="row q-gutter-xs items-center">
        <q-input v-model.number="quickAmount" type="number" dense outlined placeholder="1" style="width: 68px" />
        <q-btn dense size="sm" unelevated color="positive" icon="add" label="earn" no-caps @click="quickAdd(1, 'delivery')" />
        <q-btn dense size="sm" unelevated color="negative" icon="remove" label="spend" no-caps @click="quickAdd(-1, 'other')" />
        <q-space />
        <q-btn dense size="sm" flat class="fg-gold-text" label="full ledger →" no-caps to="/ledger" />
      </div>
    </q-card-section>
  </q-card>
</template>
