<script setup lang="ts">
import { computed } from 'vue'
import { useNow } from '../lib/useNow'
import {
  nextScoringCutoff, nextEvalResolve, nextBarterRotation, nextWeeklyReset,
  nextDailyReset, SEASON_END, formatDuration, formatInZone, urgency, SERVER_TZ
} from '../lib/time'

const now = useNow()
const localTz = Intl.DateTimeFormat().resolvedOptions().timeZone

interface Deadline {
  label: string
  sub: string
  at: Date
  icon: string
  pinned?: boolean
}

const deadlines = computed<Deadline[]>(() => {
  const n = now.value
  const cutoff = nextScoringCutoff(n)
  const list: Deadline[] = [
    { label: 'Maistir SCORING CUTOFF', sub: 'Midnight server time — NOT 7 AM. Finish commissions a day early.', at: cutoff, icon: 'gavel', pinned: true },
    { label: 'Evaluation resolves', sub: 'Ranks assigned, benefits roll over', at: nextEvalResolve(n), icon: 'military_tech' },
    { label: 'Weekly reset', sub: 'Commissions 20/20 due before this', at: nextWeeklyReset(n), icon: 'event_repeat' },
    { label: 'Daily reset', sub: 'Bounty refill · counters reset', at: nextDailyReset(n), icon: 'wb_twilight' },
    { label: 'Barter rotation', sub: 'Re-read the Iria list before unlocking recipes', at: nextBarterRotation(n), icon: 'currency_exchange' },
    { label: 'SEASON END', sub: 'Everything resets — liquidate by late January', at: SEASON_END, icon: 'flag' }
  ]
  // scoring cutoff always pinned on top; rest sorted by proximity
  const pinned = list.filter(d => d.pinned)
  const rest = list.filter(d => !d.pinned).sort((a, b) => a.at.getTime() - b.at.getTime())
  return [...pinned, ...rest]
})

function rowClass(at: Date): string {
  switch (urgency(at.getTime() - now.value.getTime())) {
    case 'red': return 'deadline-red'
    case 'amber': return 'deadline-amber'
    default: return ''
  }
}
function remaining(at: Date): string {
  return formatDuration(at.getTime() - now.value.getTime())
}

const liquidate = computed(() => now.value >= new Date('2027-01-15T08:00:00Z'))
</script>

<template>
  <q-card flat bordered class="bg-dark">
    <q-card-section class="q-pb-none">
      <div class="text-subtitle1 text-negative text-weight-bold">
        <q-icon name="alarm" class="q-mr-xs" />Deadlines
      </div>
    </q-card-section>
    <q-banner v-if="liquidate" class="bg-negative text-white q-ma-sm" dense rounded>
      <q-icon name="sell" class="q-mr-sm" />LIQUIDATE — season ends Feb 4. Sell all seasonal stock now; rares become exchange fodder.
    </q-banner>
    <q-list separator>
      <q-item v-for="d in deadlines" :key="d.label" :class="rowClass(d.at)">
        <q-item-section avatar>
          <q-icon :name="d.icon" :color="d.pinned ? 'negative' : 'secondary'" />
        </q-item-section>
        <q-item-section>
          <q-item-label :class="d.pinned ? 'text-weight-bold' : ''">{{ d.label }}</q-item-label>
          <q-item-label caption>{{ d.sub }}</q-item-label>
          <q-item-label caption class="text-grey-6">
            {{ formatInZone(d.at, SERVER_TZ) }} server · {{ formatInZone(d.at, localTz) }} local
          </q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-badge :color="rowClass(d.at) === 'deadline-red' ? 'negative' : rowClass(d.at) === 'deadline-amber' ? 'warning' : 'primary'">
            {{ remaining(d.at) }}
          </q-badge>
        </q-item-section>
      </q-item>
    </q-list>
  </q-card>
</template>

<style scoped>
.deadline-red { background: rgba(198, 40, 40, 0.18); }
.deadline-amber { background: rgba(224, 167, 47, 0.12); }
</style>
