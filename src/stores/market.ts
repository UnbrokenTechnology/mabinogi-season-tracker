import { defineStore } from 'pinia'

// One flat price map for materials AND recipe outputs, keyed by cauldron.ts ids.
// Enter a material price once and every recipe using it updates.
interface MarketState {
  prices: Record<string, number | null>
  feePct: number          // AH cut taken from a completed sale (NA: 4%)
  updatedAt: string | null
}

export const useMarketStore = defineStore('market', {
  state: (): MarketState => ({ prices: {}, feePct: 4, updatedAt: null }),
  actions: {
    setPrice(id: string, value: number | string | null) {
      const n = typeof value === 'string' ? (value.trim() === '' ? null : Number(value)) : value
      this.prices[id] = n == null || Number.isNaN(n) || n < 0 ? null : n
      this.updatedAt = new Date().toISOString()
    },
    clearPrices() {
      this.prices = {}
      this.updatedAt = null
    }
  },
  persist: true
})
