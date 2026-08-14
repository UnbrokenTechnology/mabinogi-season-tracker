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
const tone = computed(() => urgency(remaining.value))
</script>

<template>
  <div class="fg-chip" :class="`fg-chip--${tone}`">
    <q-icon :name="icon || 'schedule'" size="14px" />
    <span class="fg-chip-label">{{ label }}</span>
    <span class="fg-chip-time">{{ formatDuration(remaining) }}</span>
  </div>
</template>

<style scoped>
.fg-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border-radius: 5px;
  border: 1.5px solid var(--fg-green);
  background: var(--fg-green-tint);
  color: var(--fg-green);
}
.fg-chip-label {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}
.fg-chip-time {
  font-size: 12px;
  font-weight: 700;
  background: var(--fg-card);
  border-radius: 3px;
  padding: 1px 6px;
}
.fg-chip--amber { border-color: var(--fg-gold); background: var(--fg-gold-tint); color: var(--fg-gold-ink); }
.fg-chip--red { border-color: var(--fg-red); background: var(--fg-red-tint); color: var(--fg-red); }
.fg-chip--past { border-color: var(--fg-card-border); background: var(--fg-card); color: var(--fg-muted); }
</style>
