import { defineStore } from 'pinia'
import { TASK_TEMPLATES, type Cadence, type TaskTemplate } from '../data/tasks'
import { dayKey, weekKey, biweekKey, barterMonthKey } from '../lib/time'
import { useProfileStore } from './profile'
import { useProgressStore } from './progress'

export interface CustomTask {
  id: string
  cadence: Cadence
  title: string
  detail?: string
  sort: number
}

interface TasksState {
  // templateId -> periodKey -> done
  completions: Record<string, Record<string, boolean>>
  customTasks: CustomTask[]
  hidden: Record<string, boolean>
}

export function periodKeyFor(cadence: Cadence, now: Date): string {
  switch (cadence) {
    case 'daily': return dayKey(now)
    case 'weekly': return weekKey(now)
    case 'biweekly': return biweekKey(now)
    case 'monthly': return barterMonthKey(now)
  }
}

export const useTasksStore = defineStore('tasks', {
  state: (): TasksState => ({
    completions: {},
    customTasks: [],
    hidden: {}
  }),
  getters: {
    /** Templates + custom tasks visible for the current profile/progress. */
    visibleTasks(): (cadence: Cadence) => Array<TaskTemplate | CustomTask> {
      const profile = useProfileStore()
      const progress = useProgressStore()
      return (cadence: Cadence) => {
        const seeded = TASK_TEMPLATES.filter(t => {
          if (t.cadence !== cadence || this.hidden[t.id]) return false
          const c = t.cond
          if (!c) return true
          if (c.primaryField && !c.primaryField.includes(profile.primaryField)) return false
          if (c.minLifeGoals !== undefined && progress.lifeGoals < c.minLifeGoals) return false
          if (c.basicsGate && !progress.basicsGateMet) return false
          if (c.secondaryLine && !c.secondaryLine.includes(profile.secondaryLine)) return false
          return true
        })
        const custom = this.customTasks.filter(t => t.cadence === cadence && !this.hidden[t.id])
        return [...seeded, ...custom].sort((a, b) => a.sort - b.sort)
      }
    }
  },
  actions: {
    isDone(taskId: string, cadence: Cadence, now: Date): boolean {
      return !!this.completions[taskId]?.[periodKeyFor(cadence, now)]
    },
    toggle(taskId: string, cadence: Cadence, now: Date) {
      const key = periodKeyFor(cadence, now)
      if (!this.completions[taskId]) this.completions[taskId] = {}
      this.completions[taskId][key] = !this.completions[taskId][key]
    },
    addCustom(cadence: Cadence, title: string, detail?: string) {
      this.customTasks.push({ id: `c-${crypto.randomUUID()}`, cadence, title, detail, sort: 100 + this.customTasks.length })
    },
    removeCustom(id: string) {
      this.customTasks = this.customTasks.filter(t => t.id !== id)
      delete this.completions[id]
    },
    setHidden(id: string, hidden: boolean) {
      this.hidden[id] = hidden
    },
    /** % of visible daily tasks completed on a given day key (for the heat strip). */
    dailyCompletionRate(dayK: string): number {
      const tasks = this.visibleTasks('daily')
      if (tasks.length === 0) return 0
      const done = tasks.filter(t => this.completions[t.id]?.[dayK]).length
      return done / tasks.length
    }
  },
  persist: true
})
