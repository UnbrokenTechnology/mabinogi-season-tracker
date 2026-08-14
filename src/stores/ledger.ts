import { defineStore } from 'pinia'

export type KeyCategory = 'delivery' | 'goal' | 'evaluation' | 'recipe-unlock' | 'chest' | 'other'

export interface KeyTxn {
  id: string
  at: string            // ISO datetime
  delta: number         // + earn / - spend
  category: KeyCategory
  note: string
}

export interface GoldTxn {
  id: string
  at: string
  delta: number
  item: string
  qty: number
  note: string
}

interface LedgerState {
  keyTxns: KeyTxn[]
  goldTxns: GoldTxn[]
}

export const useLedgerStore = defineStore('ledger', {
  state: (): LedgerState => ({ keyTxns: [], goldTxns: [] }),
  getters: {
    keyBalance: (s) => s.keyTxns.reduce((sum, t) => sum + t.delta, 0),
    goldBalance: (s) => s.goldTxns.reduce((sum, t) => sum + t.delta, 0),
    goldByItem: (s) => {
      const map: Record<string, number> = {}
      for (const t of s.goldTxns) {
        if (t.delta > 0) map[t.item || '(unlabeled)'] = (map[t.item || '(unlabeled)'] || 0) + t.delta
      }
      return Object.entries(map).sort((a, b) => b[1] - a[1])
    }
  },
  actions: {
    addKeyTxn(delta: number, category: KeyCategory, note = '') {
      this.keyTxns.unshift({ id: crypto.randomUUID(), at: new Date().toISOString(), delta, category, note })
    },
    removeKeyTxn(id: string) {
      this.keyTxns = this.keyTxns.filter(t => t.id !== id)
    },
    addGoldTxn(delta: number, item: string, qty: number, note = '') {
      this.goldTxns.unshift({ id: crypto.randomUUID(), at: new Date().toISOString(), delta, item, qty, note })
    },
    removeGoldTxn(id: string) {
      this.goldTxns = this.goldTxns.filter(t => t.id !== id)
    }
  },
  persist: true
})
