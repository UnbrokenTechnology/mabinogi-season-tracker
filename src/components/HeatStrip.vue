<script setup lang="ts">
import { computed } from 'vue'
import { useNow } from '../lib/useNow'
import { useTasksStore } from '../stores/tasks'
import { gameDayYmd, addDaysYmd, ymdKey } from '../lib/time'

const now = useNow()
const tasks = useTasksStore()

const DAYS = 14

const cells = computed(() => {
  const today = gameDayYmd(now.value)
  const out: Array<{ key: string; rate: number; isToday: boolean }> = []
  for (let i = DAYS - 1; i >= 0; i--) {
    const key = ymdKey(addDaysYmd(today, -i))
    out.push({ key, rate: tasks.dailyCompletionRate(key), isToday: i === 0 })
  }
  return out
})

function cellStyle(rate: number): Record<string, string> {
  if (rate <= 0) return { background: 'var(--fg-page)', border: '1px solid var(--fg-card-border)' }
  const mix = Math.round(25 + rate * 75)
  return {
    background: `color-mix(in srgb, var(--fg-green) ${mix}%, var(--fg-green-tint))`,
    border: '1px solid var(--fg-green)'
  }
}
</script>

<template>
  <div>
    <div class="fg-label q-mb-xs">Daily routine — last {{ DAYS }} days</div>
    <div class="row q-gutter-xs">
      <div v-for="c in cells" :key="c.key" class="heat-cell"
           :style="{ ...cellStyle(c.rate), outline: c.isToday ? '2px solid var(--fg-gold)' : 'none' }">
        <q-tooltip>{{ c.key }} — {{ Math.round(c.rate * 100) }}%</q-tooltip>
      </div>
    </div>
  </div>
</template>

<style scoped>
.heat-cell {
  width: 20px;
  height: 20px;
  border-radius: 4px;
}
</style>
