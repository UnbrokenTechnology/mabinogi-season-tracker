<script setup lang="ts">
import { useQuasar } from 'quasar'
import { useProfileStore } from '../stores/profile'
import { useProgressStore } from '../stores/progress'
import { useCountersStore } from '../stores/counters'
import { useTasksStore } from '../stores/tasks'
import { useLedgerStore } from '../stores/ledger'
import { useMarketStore } from '../stores/market'
import { SERVER_TZ } from '../lib/time'

const $q = useQuasar()
const stores = {
  profile: useProfileStore(),
  progress: useProgressStore(),
  counters: useCountersStore(),
  tasks: useTasksStore(),
  ledger: useLedgerStore(),
  market: useMarketStore()
}

function exportJson() {
  const data: Record<string, unknown> = { exportedAt: new Date().toISOString(), version: 1 }
  for (const [name, store] of Object.entries(stores)) data[name] = store.$state
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = `mabinogi-tracker-backup-${new Date().toISOString().slice(0, 10)}.json`
  a.click()
  URL.revokeObjectURL(a.href)
}

function importJson(ev: Event) {
  const file = (ev.target as HTMLInputElement).files?.[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = () => {
    try {
      const data = JSON.parse(String(reader.result))
      for (const [name, store] of Object.entries(stores)) {
        if (data[name]) store.$patch(data[name])
      }
      $q.notify({ message: 'Backup imported.', color: 'positive', icon: 'check' })
    } catch {
      $q.notify({ message: 'Could not read that file — is it a tracker backup?', color: 'negative', icon: 'error' })
    }
  }
  reader.readAsText(file)
}

function resetAll() {
  $q.dialog({
    title: 'Reset everything?',
    message: 'This wipes ALL local data for this browser (tasks, progress, ledgers, profile). Export a backup first if unsure.',
    cancel: true,
    ok: { label: 'Wipe it', color: 'negative' }
  }).onOk(() => {
    for (const store of Object.values(stores)) store.$reset()
    $q.notify({ message: 'All data reset.', color: 'warning' })
  })
}
</script>

<template>
  <q-page padding>
    <div class="fg-display text-h4 fg-ink q-mb-md">Settings</div>

    <div class="row q-col-gutter-md">
      <div class="col-12 col-md-6">
        <q-card flat class="fg-card q-mb-md">
          <q-card-section>
            <div class="text-subtitle1 text-weight-bold q-mb-sm">Backup & sync</div>
            <p class="text-body2 fg-muted">
              All data lives in <b>this browser's localStorage</b> — each person using the tool
              (on their own browser/device) has completely independent data. To move or back up
              your data, export a JSON file and import it elsewhere.
            </p>
            <div class="row q-gutter-sm">
              <q-btn unelevated color="primary" icon="download" label="Export backup" @click="exportJson" />
              <q-btn outline color="secondary" icon="upload" label="Import backup">
                <input type="file" accept="application/json" class="absolute-full cursor-pointer" style="opacity: 0" @change="importJson" />
              </q-btn>
            </div>
          </q-card-section>
        </q-card>

        <q-card flat class="fg-card">
          <q-card-section>
            <div class="text-subtitle1 text-weight-bold text-negative q-mb-sm">Danger zone</div>
            <q-btn outline color="negative" icon="delete_forever" label="Reset all data" @click="resetAll" />
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-md-6">
        <q-card flat class="fg-card">
          <q-card-section>
            <div class="text-subtitle1 text-weight-bold q-mb-sm">About</div>
            <p class="text-body2 fg-muted">
              Tracker for Mabinogi's <b>Lughnasadh Season 1</b> (Aug 13 2026 → Feb 4 2027):
              Life Association commissions, Taillteann Farm routine, key economy, and the Maistir treadmill.
            </p>
            <q-list dense>
              <q-item><q-item-section side><q-icon name="dns" size="18px" color="secondary" /></q-item-section>
                <q-item-section>Server time: {{ SERVER_TZ }} (DST-aware)</q-item-section></q-item>
              <q-item><q-item-section side><q-icon name="event_repeat" size="18px" color="secondary" /></q-item-section>
                <q-item-section>Daily reset 7:00 AM · Weekly Thu 7:00 AM · Eval biweekly anchored Aug 27</q-item-section></q-item>
              <q-item><q-item-section side><q-icon name="gavel" size="18px" color="negative" /></q-item-section>
                <q-item-section>Maistir scoring closes MIDNIGHT before eval Thursday</q-item-section></q-item>
              <q-item><q-item-section side><q-icon name="block" size="18px" color="grey-6" /></q-item-section>
                <q-item-section>No game-client integration or automation — manual tracking only (ToS-safe)</q-item-section></q-item>
            </q-list>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>
