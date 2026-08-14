<script setup lang="ts">
import { computed } from 'vue'
import HelpTip from './HelpTip.vue'

const props = defineProps<{
  label: string
  value: number
  cap: number
  icon: string
  big?: boolean
  help?: string
}>()

const emit = defineEmits<{ (e: 'bump', delta: number): void }>()

const full = computed(() => props.value >= props.cap)
</script>

<template>
  <q-card flat class="fg-card text-center q-pa-sm counter-card">
    <div class="fg-label q-mb-xs">
      <q-icon :name="icon" size="14px" class="q-mr-xs" />{{ label }}
      <HelpTip v-if="help" :topic="help" class="q-ml-xs" />
    </div>
    <q-circular-progress
      :value="cap ? (value / cap) * 100 : 0"
      :size="big ? '96px' : '80px'"
      :thickness="0.14"
      :color="full ? 'positive' : 'secondary'"
      track-color="grey-4"
      class="counter-dial q-mb-xs"
      show-value
    >
      <div class="dial-value" :style="{ fontSize: big ? '30px' : '24px', color: full ? 'var(--fg-green)' : 'var(--fg-gold-ink)' }">
        {{ value }}<span class="dial-cap">/{{ cap }}</span>
      </div>
    </q-circular-progress>
    <div class="row justify-center q-gutter-xs">
      <q-btn dense size="sm" flat round icon="remove" class="fg-muted" :disable="value <= 0" @click="emit('bump', -1)" />
      <q-btn dense size="sm" unelevated round color="primary" icon="add" :disable="value >= cap" @click="emit('bump', 1)" />
    </div>
  </q-card>
</template>

<style scoped>
.counter-card { min-width: 118px; }
.counter-dial :deep(.q-circular-progress__track) { color: var(--fg-card-border) !important; }
.dial-value {
  font-family: 'Cormorant Garamond', Georgia, serif;
  font-weight: 700;
  line-height: 1;
}
.dial-cap {
  font-size: 0.5em;
  color: var(--fg-muted);
  font-family: 'Lato', sans-serif;
  font-weight: 700;
}
</style>
