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

function cellColor(rate: number): string {
  if (rate >= 0.999) return '#4e8a43'
  if (rate >= 0.66) return '#6f8a3c'
  if (rate >= 0.33) return '#8a7a30'
  if (rate > 0) return '#8a5a2a'
  return '#2a2f2b'
}
</script>

<template>
  <div>
    <div class="text-caption text-grey-6 q-mb-xs">Daily routine — last {{ DAYS }} days</div>
    <div class="row q-gutter-xs">
      <div v-for="c in cells" :key="c.key" class="heat-cell"
           :style="{ background: cellColor(c.rate), outline: c.isToday ? '1px solid #c9a227' : 'none' }">
        <q-tooltip>{{ c.key }} — {{ Math.round(c.rate * 100) }}%</q-tooltip>
      </div>
    </div>
  </div>
</template>

<style scoped>
.heat-cell {
  width: 18px;
  height: 18px;
  border-radius: 3px;
}
</style>
