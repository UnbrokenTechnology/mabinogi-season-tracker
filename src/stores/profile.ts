import { defineStore } from 'pinia'

export interface ProfileState {
  playerName: string
  primaryField: string          // '' | food | medicine | textiles | metalworking | craftworks | none (gathering-only plan)
  secondaryLine: string         // none | ether | farming | second-spec
  gatheringFocus: string[]      // ranching | farming | foraging | earthworks
  onboarded: boolean
  freeResetUsed: boolean
  notes: string
}

export const useProfileStore = defineStore('profile', {
  state: (): ProfileState => ({
    playerName: '',
    primaryField: '',
    secondaryLine: 'none',
    gatheringFocus: [],
    onboarded: false,
    freeResetUsed: false,
    notes: ''
  }),
  persist: true
})
