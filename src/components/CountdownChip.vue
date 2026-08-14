<script setup lang="ts">
import { computed } from 'vue'
import { useNow } from '../lib/useNow'
import { formatDuration, urgency } from '../lib/time'

const props = defineProps<{
  target: Date
  label: string
  icon?: string
}>()

const now = useNow()
const remaining = computed(() => props.target.getTime() - now.value.getTime())
const color = computed(() => {
  switch (urgency(remaining.value)) {
    case 'red': return 'negative'
    case 'amber': return 'warning'
    case 'past': return 'grey-7'
    default: return 'primary'
  }
})
</script>

<template>
  <q-chip :color="color" text-color="white" :icon="icon || 'schedule'" square>
    <span class="text-weight-medium q-mr-xs">{{ label }}</span>
    <q-badge color="black" text-color="white" outline>{{ formatDuration(remaining) }}</q-badge>
  </q-chip>
</template>
