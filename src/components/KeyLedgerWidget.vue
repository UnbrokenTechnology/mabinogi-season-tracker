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
  <q-card flat bordered class="bg-dark">
    <q-card-section class="q-pb-xs">
      <div class="row items-center">
        <q-icon name="key" color="secondary" size="22px" class="q-mr-sm" />
        <div class="text-subtitle1 text-weight-bold">Life Association Keys</div>
        <q-space />
        <div class="text-h5 text-secondary text-weight-bold">{{ ledger.keyBalance }}</div>
      </div>
    </q-card-section>
    <q-card-section class="q-py-xs">
      <div class="row q-col-gutter-sm text-center">
        <div class="col-4">
          <div class="text-caption text-grey-6">Next eval costs</div>
          <div class="text-subtitle1 text-weight-bold" :class="ledger.keyBalance >= progress.nextEvalCost ? 'text-positive' : 'text-negative'">
            {{ progress.nextEvalCost }} <q-icon name="key" size="14px" />
          </div>
        </div>
        <div class="col-4">
          <div class="text-caption text-grey-6">Next 5 evals</div>
          <div class="text-subtitle1">{{ progress.costOfNextN(5) }} <q-icon name="key" size="14px" /></div>
        </div>
        <div class="col-4">
          <div class="text-caption text-grey-6">Evals taken</div>
          <div class="text-subtitle1">{{ progress.evalCount }}</div>
        </div>
      </div>
    </q-card-section>
    <q-separator />
    <q-card-section class="q-py-sm">
      <div class="row q-gutter-xs items-center">
        <q-input v-model.number="quickAmount" type="number" dense outlined placeholder="1" style="width: 70px" />
        <q-btn dense size="sm" unelevated color="positive" icon="add" label="earn" @click="quickAdd(1, 'delivery')" />
        <q-btn dense size="sm" unelevated color="negative" icon="remove" label="spend" @click="quickAdd(-1, 'other')" />
        <q-btn dense size="sm" flat color="secondary" label="full ledger" to="/ledger" />
      </div>
    </q-card-section>
  </q-card>
</template>
