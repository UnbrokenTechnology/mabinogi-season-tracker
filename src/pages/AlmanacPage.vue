<script setup lang="ts">
import { computed } from 'vue'
import { useNow } from '../lib/useNow'
import {
  SEASON_START, SEASON_END, weekKey, ymdKey, addDaysYmd, zonedToUtc, type Ymd
} from '../lib/time'
import { useCountersStore, COUNTER_CAPS } from '../stores/counters'
import { useTasksStore } from '../stores/tasks'
import { useLedgerStore } from '../stores/ledger'
import { useProgressStore } from '../stores/progress'
import { currentPhase } from '../data/season'
import HelpTip from '../components/HelpTip.vue'

const now = useNow()
const counters = useCountersStore()
const tasks = useTasksStore()
const ledger = useLedgerStore()
const progress = useProgressStore()

function parseKey(key: string): Ymd {
  const [y, m, d] = key.split('-').map(Number)
  return [y, m, d]
}

interface WeekRow {
  index: number
  key: string
  start: Date
  end: Date
  isCurrent: boolean
  commissions: number
  weeklyDone: number
  weeklyTotal: number
  days: Array<{ key: string; rate: number; future: boolean }>
  keysNet: number
  goldNet: number
  evals: Array<{ rank: string; field: string }>
  phaseTitle: string
}

const weeks = computed<WeekRow[]>(() => {
  const rows: WeekRow[] = []
  const currentKey = weekKey(now.value)
  let ymd = parseKey(weekKey(SEASON_START))
  for (let i = 0; i < 30; i++) {
    const key = ymdKey(ymd)
    const start = zonedToUtc(...ymd, 7, 0)
    if (start > now.value || start >= SEASON_END) break
    const endYmd = addDaysYmd(ymd, 7)
    const end = zonedToUtc(...endYmd, 7, 0)

    const weekly = tasks.visibleTasks('weekly')
    const inRange = (at: string) => {
      const t = new Date(at).getTime()
      return t >= start.getTime() && t < end.getTime()
    }
    rows.push({
      index: i + 1,
      key,
      start,
      end,
      isCurrent: key === currentKey,
      commissions: counters.valueAt('commissions', key),
      weeklyDone: weekly.filter(t => tasks.completions[t.id]?.[key]).length,
      weeklyTotal: weekly.length,
      days: Array.from({ length: 7 }, (_, d) => {
        const dayK = ymdKey(addDaysYmd(ymd, d))
        return {
          key: dayK,
          rate: tasks.dailyCompletionRate(dayK),
          future: zonedToUtc(...addDaysYmd(ymd, d), 7, 0) > now.value
        }
      }),
      keysNet: ledger.keyTxns.filter(t => inRange(t.at)).reduce((s, t) => s + t.delta, 0),
      goldNet: ledger.goldTxns.filter(t => inRange(t.at)).reduce((s, t) => s + t.delta, 0),
      evals: progress.maistirHistory
        .filter(r => {
          const t = new Date(r.date + 'T12:00:00').getTime()
          return t >= start.getTime() && t < end.getTime()
        })
        .map(r => ({ rank: r.rank, field: r.field })),
      phaseTitle: currentPhase(start).title
    })
    ymd = endYmd
  }
  return rows.reverse() // newest first
})

const totals = computed(() => ({
  commissions: Object.values(counters.log.commissions).reduce((s, v) => s + v, 0),
  weeksElapsed: weeks.value.length,
  weeksTotal: 25,
  keysBalance: ledger.keyBalance,
  goldNet: ledger.goldBalance
}))

function fmtRange(w: WeekRow): string {
  const f = (d: Date) => new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', timeZone: 'America/Los_Angeles' }).format(d)
  return `${f(w.start)} – ${f(new Date(w.end.getTime() - 1))}`
}

function dayColor(d: { rate: number; future: boolean }): string {
  if (d.future) return 'transparent'
  if (d.rate <= 0) return 'var(--fg-page)'
  const mix = Math.round(25 + d.rate * 75)
  return `color-mix(in srgb, var(--fg-green) ${mix}%, var(--fg-green-tint))`
}
</script>

<template>
  <q-page padding>
    <div class="fg-eyebrow q-mb-xs">Season archive · built from your own tracking</div>
    <div class="fg-display text-h4 fg-ink q-mb-xs">
      Almanac <HelpTip topic="almanac" />
    </div>

    <!-- Season summary -->
    <div class="row q-gutter-md q-mb-lg q-mt-md">
      <q-card flat class="fg-card q-pa-md text-center" style="min-width: 130px">
        <div class="fg-label">Weeks elapsed</div>
        <div class="fg-display text-h4 fg-green-text text-weight-bold">{{ totals.weeksElapsed }}<span class="text-caption fg-muted">/{{ totals.weeksTotal }}</span></div>
      </q-card>
      <q-card flat class="fg-card q-pa-md text-center" style="min-width: 130px">
        <div class="fg-label">Commissions all-season</div>
        <div class="fg-display text-h4 fg-gold-text text-weight-bold">{{ totals.commissions }}</div>
      </q-card>
      <q-card flat class="fg-card q-pa-md text-center" style="min-width: 130px">
        <div class="fg-label">Key balance</div>
        <div class="fg-display text-h4 fg-gold-text text-weight-bold">{{ totals.keysBalance }}</div>
      </q-card>
      <q-card flat class="fg-card q-pa-md text-center" style="min-width: 130px">
        <div class="fg-label">Gold net</div>
        <div class="fg-display text-h4 text-weight-bold" :class="totals.goldNet >= 0 ? 'fg-green-text' : 'fg-red-text'">
          {{ totals.goldNet.toLocaleString() }}g
        </div>
      </q-card>
    </div>

    <!-- Week rows -->
    <q-card v-for="w in weeks" :key="w.key" flat class="fg-card q-mb-md overflow-hidden"
            :style="w.isCurrent ? 'box-shadow: 0 0 0 2px var(--fg-gold), var(--fg-shadow)' : ''">
      <div class="fg-bar">
        <span class="fg-bar-title">Week {{ w.index }} · {{ fmtRange(w) }}</span>
        <span v-if="w.isCurrent" class="fg-gold-badge">current</span>
        <q-space />
        <span class="fg-bar-title fg-bar-gold">{{ w.phaseTitle }}</span>
      </div>
      <q-card-section class="row items-center q-col-gutter-md q-py-sm">
        <div class="col-6 col-sm-2 text-center">
          <div class="fg-label">Commissions</div>
          <div class="text-h6 text-weight-bold"
               :class="w.commissions >= COUNTER_CAPS.commissions ? 'fg-green-text' : w.isCurrent ? 'fg-gold-text' : 'fg-red-text'">
            {{ w.commissions }}/{{ COUNTER_CAPS.commissions }}
          </div>
        </div>
        <div class="col-6 col-sm-2 text-center">
          <div class="fg-label">Weekly tasks</div>
          <div class="text-h6 text-weight-bold" :class="w.weeklyDone >= w.weeklyTotal ? 'fg-green-text' : 'fg-ink'">
            {{ w.weeklyDone }}/{{ w.weeklyTotal }}
          </div>
        </div>
        <div class="col-12 col-sm-3 text-center">
          <div class="fg-label q-mb-xs">Daily routine</div>
          <div class="row justify-center q-gutter-xs">
            <div v-for="d in w.days" :key="d.key" class="alm-cell"
                 :style="{ background: dayColor(d), border: d.future ? '1px dashed var(--fg-card-border)' : '1px solid var(--fg-card-border)' }">
              <q-tooltip v-if="!d.future">{{ d.key }} — {{ Math.round(d.rate * 100) }}%</q-tooltip>
            </div>
          </div>
        </div>
        <div class="col-6 col-sm-2 text-center">
          <div class="fg-label">Keys net</div>
          <div class="text-h6 text-weight-bold" :class="w.keysNet >= 0 ? 'fg-green-text' : 'fg-red-text'">
            {{ w.keysNet > 0 ? '+' : '' }}{{ w.keysNet }}
          </div>
        </div>
        <div class="col-6 col-sm-2 text-center">
          <div class="fg-label">Gold net</div>
          <div class="text-subtitle1 text-weight-bold" :class="w.goldNet >= 0 ? 'fg-green-text' : 'fg-red-text'">
            {{ w.goldNet > 0 ? '+' : '' }}{{ w.goldNet.toLocaleString() }}g
          </div>
        </div>
        <div class="col-12 col-sm-1">
          <div v-if="w.evals.length" class="column q-gutter-xs items-center">
            <span v-for="(e, i) in w.evals" :key="i" class="fg-gold-badge">{{ e.rank }}</span>
          </div>
        </div>
      </q-card-section>
    </q-card>

    <div v-if="weeks.length <= 1" class="text-body2 fg-muted q-mt-md">
      The Almanac fills in as weeks pass — check back after your first Thursday reset.
    </div>
  </q-page>
</template>

<style scoped>
.alm-cell {
  width: 16px;
  height: 16px;
  border-radius: 3px;
}
</style>
