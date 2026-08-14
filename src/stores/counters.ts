import { defineStore } from 'pinia'
import { dayKey, weekKey } from '../lib/time'

// Period-keyed counters: values auto-"reset" because reads compare the stored
// period key against the current one — no timers needed.

interface Bucket { key: string; value: number }
interface FlagBucket { key: string; value: boolean }

interface CountersState {
  commissions: Bucket      // weekly, cap 20
  deliveries: Bucket       // daily, cap 6
  cheers: Bucket           // daily, cap 3
  envEventsDone: Bucket    // daily, cap 2
  bountyUsed: FlagBucket   // daily toggle
}

function readBucket(b: Bucket, currentKey: string): number {
  return b.key === currentKey ? b.value : 0
}

export const useCountersStore = defineStore('counters', {
  state: (): CountersState => ({
    commissions: { key: '', value: 0 },
    deliveries: { key: '', value: 0 },
    cheers: { key: '', value: 0 },
    envEventsDone: { key: '', value: 0 },
    bountyUsed: { key: '', value: false }
  }),
  getters: {
    commissionsNow: (s) => (now: Date) => readBucket(s.commissions, weekKey(now)),
    deliveriesNow: (s) => (now: Date) => readBucket(s.deliveries, dayKey(now)),
    cheersNow: (s) => (now: Date) => readBucket(s.cheers, dayKey(now)),
    envEventsNow: (s) => (now: Date) => readBucket(s.envEventsDone, dayKey(now)),
    bountyUsedNow: (s) => (now: Date) => s.bountyUsed.key === dayKey(now) ? s.bountyUsed.value : false
  },
  actions: {
    bump(name: 'commissions' | 'deliveries' | 'cheers' | 'envEventsDone', delta: number, now: Date, cap: number) {
      const key = name === 'commissions' ? weekKey(now) : dayKey(now)
      const b = this[name]
      const cur = readBucket(b, key)
      b.key = key
      b.value = Math.min(cap, Math.max(0, cur + delta))
    },
    toggleBounty(now: Date) {
      const key = dayKey(now)
      const cur = this.bountyUsed.key === key ? this.bountyUsed.value : false
      this.bountyUsed = { key, value: !cur }
    }
  },
  persist: true
})
