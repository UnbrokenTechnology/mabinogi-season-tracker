import { defineStore } from 'pinia'
import { dayKey, weekKey } from '../lib/time'

// Counters are period-keyed logs: the current period's value is just the entry
// under today's/this week's key, so counters "reset" automatically at rollover
// while every past period stays archived for the Almanac.

export type CounterName = 'commissions' | 'deliveries' | 'cheers' | 'envEvents'

export const COUNTER_CAPS: Record<CounterName, number> = {
  commissions: 20,
  deliveries: 6,
  cheers: 3,
  envEvents: 2
}

function periodKey(name: CounterName, now: Date): string {
  return name === 'commissions' ? weekKey(now) : dayKey(now)
}

interface CountersState {
  log: Record<CounterName, Record<string, number>>
  bountyLog: Record<string, boolean>
}

export const useCountersStore = defineStore('counters', {
  state: (): CountersState => ({
    log: { commissions: {}, deliveries: {}, cheers: {}, envEvents: {} },
    bountyLog: {}
  }),
  getters: {
    valueNow: (s) => (name: CounterName, now: Date) => s.log[name][periodKey(name, now)] ?? 0,
    valueAt: (s) => (name: CounterName, key: string) => s.log[name][key] ?? 0,
    bountyUsedNow: (s) => (now: Date) => s.bountyLog[dayKey(now)] ?? false
  },
  actions: {
    bump(name: CounterName, delta: number, now: Date) {
      const key = periodKey(name, now)
      const cur = this.log[name][key] ?? 0
      this.log[name][key] = Math.min(COUNTER_CAPS[name], Math.max(0, cur + delta))
    },
    toggleBounty(now: Date) {
      const key = dayKey(now)
      this.bountyLog[key] = !this.bountyLog[key]
    }
  },
  persist: {
    afterHydrate: ({ store }) => {
      // Migrate the v1 shape ({ commissions: {key,value}, ..., envEventsDone, bountyUsed })
      // into the period-keyed logs, then drop the legacy fields.
      const s = store.$state as Record<string, unknown>
      const legacy: Array<[string, CounterName]> = [
        ['commissions', 'commissions'], ['deliveries', 'deliveries'],
        ['cheers', 'cheers'], ['envEventsDone', 'envEvents']
      ]
      for (const [oldField, name] of legacy) {
        const v = s[oldField] as { key?: string; value?: number } | undefined
        if (v && typeof v === 'object' && 'key' in v) {
          if (v.key) store.log[name][v.key] = v.value ?? 0
          delete s[oldField]
        }
      }
      const b = s.bountyUsed as { key?: string; value?: boolean } | undefined
      if (b && typeof b === 'object' && 'key' in b) {
        if (b.key) store.bountyLog[b.key] = !!b.value
        delete s.bountyUsed
      }
    }
  }
})
