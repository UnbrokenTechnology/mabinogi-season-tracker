import { defineStore } from 'pinia'
import type { PlotKind } from '../data/cauldron'

// One flat price map for materials AND recipe outputs, keyed by cauldron.ts ids.
// Enter a material price once and every recipe using it updates.
interface MarketState {
  prices: Record<string, number | null>
  feePct: number          // AH cut taken from a completed sale (NA: 4%)
  updatedAt: string | null
  plots: Record<PlotKind, number>   // this player's farm layout; Farm Expansion goals add more
  clearedBackup: Record<string, number | null> | null   // safety copy from the last Clear all
  plannerHours: number
}

export const useMarketStore = defineStore('market', {
  state: (): MarketState => ({
    prices: {},
    feePct: 4,
    updatedAt: null,
    plots: { field: 6, 'red-pear-tree': 2, 'rubber-tree': 2, 'quartz-vein': 1, 'cobweb-stump': 1 },
    clearedBackup: null,
    plannerHours: 1        // period the Farm Planner projects over (1 / 8 / 24 h)
  }),
  actions: {
    setPrice(id: string, value: number | string | null) {
      const n = typeof value === 'string' ? (value.trim() === '' ? null : Number(value)) : value
      this.prices[id] = n == null || Number.isNaN(n) || n < 0 ? null : n
      this.updatedAt = new Date().toISOString()
    },
    setPlot(kind: PlotKind, value: number | string | null) {
      const n = Math.floor(Number(value))
      this.plots[kind] = Number.isNaN(n) ? 0 : Math.min(99, Math.max(0, n))
    },
    clearPrices() {
      this.clearedBackup = { ...this.prices }
      this.prices = {}
      this.updatedAt = null
    },
    restoreCleared() {
      if (!this.clearedBackup) return
      this.prices = { ...this.clearedBackup }
      this.clearedBackup = null
      this.updatedAt = new Date().toISOString()
    },
    // Apply prices from a share link: entries the link carries overwrite, ids the
    // sender left blank keep whatever the receiver already had.
    applyShared(shared: Record<string, number | null>, feePct?: number) {
      for (const [id, v] of Object.entries(shared)) {
        if (v != null) this.prices[id] = v
      }
      if (feePct != null) this.feePct = feePct
      this.updatedAt = new Date().toISOString()
    }
  },
  persist: true
})
