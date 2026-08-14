<script setup lang="ts">
const props = defineProps<{
  label: string
  value: number
  cap: number
  icon: string
  big?: boolean
}>()

const emit = defineEmits<{ (e: 'bump', delta: number): void }>()
</script>

<template>
  <q-card flat bordered class="bg-dark counter-card">
    <q-card-section class="q-py-sm text-center">
      <div class="text-caption text-grey-5"><q-icon :name="icon" class="q-mr-xs" />{{ label }}</div>
      <div :class="big ? 'text-h3' : 'text-h5'"
           :style="{ color: value >= cap ? '#4e8a43' : '#c9a227', fontWeight: 700 }">
        {{ value }}<span class="text-grey-6" :class="big ? 'text-h5' : 'text-subtitle2'">/{{ cap }}</span>
      </div>
      <q-linear-progress :value="cap ? value / cap : 0" size="6px" rounded
                         :color="value >= cap ? 'positive' : 'secondary'" class="q-my-xs" />
      <div class="row justify-center q-gutter-xs">
        <q-btn dense size="sm" outline color="grey-6" icon="remove" :disable="value <= 0" @click="emit('bump', -1)" />
        <q-btn dense size="sm" unelevated color="primary" icon="add" :disable="value >= cap" @click="emit('bump', 1)" />
      </div>
    </q-card-section>
  </q-card>
</template>

<style scoped>
.counter-card { min-width: 120px; }
</style>
