import { defineStore } from 'pinia'
import { evalKeyCost } from '../data/fields'

export interface MaistirRecord {
  id: string
  date: string   // ISO date
  field: string
  rank: string
  notes: string
}

interface ProgressState {
  lifeLevel: number
  basics: Record<string, number>          // 6 basics, 0-5
  specs: Record<string, number>           // 9 trees, 0-5
  subspecs: Record<string, number>        // free-form key -> 0-5
  evalCount: number                       // lifetime Krom evaluations taken
  lifeGoals: number
  farmExpansionGoals: number
  maistirHistory: MaistirRecord[]
}

export const useProgressStore = defineStore('progress', {
  state: (): ProgressState => ({
    lifeLevel: 1,
    basics: { animal: 0, plant: 0, mineral: 0, health: 0, fiber: 0, engineering: 0 },
    specs: {
      ranching: 0, farming: 0, foraging: 0, earthworks: 0,
      food: 0, medicine: 0, textiles: 0, metalworking: 0, craftworks: 0
    },
    subspecs: {},
    evalCount: 0,
    lifeGoals: 0,
    farmExpansionGoals: 0,
    maistirHistory: []
  }),
  getters: {
    basicsGateMet: (s) => Object.values(s.basics).every(v => v >= 5),
    nextEvalCost: (s) => evalKeyCost(s.evalCount + 1),
    costOfNextN: (s) => (n: number) => {
      let total = 0
      for (let i = 1; i <= n; i++) total += evalKeyCost(s.evalCount + i)
      return total
    },
    goalUnlocks: (s) => ({
      noviceWeekly: s.lifeGoals >= 2,
      adeptWeekly: s.lifeGoals >= 5,
      expertWeekly: s.lifeGoals >= 7,
      treasureChests: s.lifeGoals >= 15
    })
  },
  actions: {
    addMaistirRecord(rec: Omit<MaistirRecord, 'id'>) {
      this.maistirHistory.unshift({ ...rec, id: crypto.randomUUID() })
    },
    removeMaistirRecord(id: string) {
      this.maistirHistory = this.maistirHistory.filter(r => r.id !== id)
    }
  },
  persist: true
})
