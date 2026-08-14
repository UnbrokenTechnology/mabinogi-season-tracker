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
  const list: Deadline[] = [
    { label: 'Maistir scoring ENDS', sub: 'Midnight server — NOT 7 AM. Finish commissions a day early.', at: nextScoringCutoff(n), icon: 'gavel', pinned: true },
    { label: 'Evaluation resolves', sub: 'Ranks assigned, benefits roll over', at: nextEvalResolve(n), icon: 'military_tech' },
    { label: 'Weekly reset', sub: 'Commissions 20/20 due before this', at: nextWeeklyReset(n), icon: 'event_repeat' },
    { label: 'Daily reset', sub: 'Bounty refill · counters reset', at: nextDailyReset(n), icon: 'wb_twilight' },
    { label: 'Barter goods rotate', sub: 'Re-read the Iria list before unlocking recipes', at: nextBarterRotation(n), icon: 'currency_exchange' },
    { label: 'SEASON END', sub: 'Everything resets — liquidate by late January', at: SEASON_END, icon: 'flag' }
  ]
  const pinned = list.filter(d => d.pinned)
  const rest = list.filter(d => !d.pinned).sort((a, b) => a.at.getTime() - b.at.getTime())
  return [...pinned, ...rest]
})

function urg(at: Date) { return urgency(at.getTime() - now.value.getTime()) }
function remaining(at: Date): string { return formatDuration(at.getTime() - now.value.getTime()) }

const liquidate = computed(() => now.value >= new Date('2027-01-15T08:00:00Z'))
</script>

<template>
  <q-card flat class="fg-card overflow-hidden">
    <div class="fg-bar">
      <q-icon name="alarm" size="16px" :style="{ color: 'var(--fg-gold)' }" />
      <span class="fg-bar-title">The Clock — Memorize These</span>
      <q-space />
      <span class="fg-bar-title fg-bar-gold">Server Time</span>
    </div>

    <div v-if="liquidate" class="fg-callout-red q-ma-sm">
      <div class="fg-callout-title"><q-icon name="sell" class="q-mr-xs" />Liquidate now</div>
      <div class="text-body2">Season ends Feb 4. Sell all seasonal stock; rares become exchange fodder.</div>
    </div>

    <q-list class="fg-zebra">
      <q-item v-for="d in deadlines" :key="d.label" class="q-py-sm"
              :class="{ 'row-red': urg(d.at) === 'red' || d.pinned, 'row-amber': urg(d.at) === 'amber' && !d.pinned }">
        <q-item-section avatar style="min-width: 40px">
          <q-icon :name="d.icon" size="20px"
                  :style="{ color: d.pinned ? 'var(--fg-red)' : 'var(--fg-green)' }" />
        </q-item-section>
        <q-item-section>
          <q-item-label class="text-weight-bold" :class="d.pinned ? 'fg-red-text' : 'fg-ink'">
            {{ d.label }}
          </q-item-label>
          <q-item-label caption class="fg-muted">{{ d.sub }}</q-item-label>
          <q-item-label caption class="fg-muted" style="opacity: 0.85">
            {{ formatInZone(d.at, SERVER_TZ) }} server · {{ formatInZone(d.at, localTz) }} local
          </q-item-label>
        </q-item-section>
        <q-item-section side>
          <span class="fg-countdown"
                :class="urg(d.at) === 'red' || d.pinned ? 'fg-countdown-red' : urg(d.at) === 'amber' ? 'fg-countdown-amber' : ''">
            {{ remaining(d.at) }}
          </span>
        </q-item-section>
      </q-item>
    </q-list>
  </q-card>
</template>

<style scoped>
.row-red { box-shadow: inset 3px 0 0 var(--fg-red); }
.row-amber { box-shadow: inset 3px 0 0 var(--fg-gold); }
.fg-countdown {
  font-weight: 700;
  font-size: 13px;
  letter-spacing: 0.04em;
  color: var(--fg-green);
  background: var(--fg-green-tint);
  border: 1px solid var(--fg-green);
  border-radius: 4px;
  padding: 2px 8px;
}
.fg-countdown-red { color: var(--fg-red); background: var(--fg-red-tint); border-color: var(--fg-red); }
.fg-countdown-amber { color: var(--fg-gold-ink); background: var(--fg-gold-tint); border-color: var(--fg-gold); }
</style>
