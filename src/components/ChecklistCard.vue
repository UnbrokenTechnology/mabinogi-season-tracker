<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Cadence } from '../data/tasks'
import { useTasksStore } from '../stores/tasks'
import { useNow } from '../lib/useNow'
import HelpTip from './HelpTip.vue'

const props = defineProps<{
  cadence: Cadence
  title: string
  icon: string
  accent?: 'green' | 'gold' | 'red'
  help?: string
}>()

const tasks = useTasksStore()
const now = useNow()
const adding = ref(false)
const newTitle = ref('')

const list = computed(() => tasks.visibleTasks(props.cadence))
const doneCount = computed(() => list.value.filter(t => tasks.isDone(t.id, props.cadence, now.value)).length)

function addTask() {
  const t = newTitle.value.trim()
  if (t) tasks.addCustom(props.cadence, t)
  newTitle.value = ''
  adding.value = false
}
</script>

<template>
  <q-card flat class="fg-card overflow-hidden">
    <div class="fg-bar">
      <q-icon :name="icon" size="16px" :style="{ color: 'var(--fg-gold)' }" />
      <span class="fg-bar-title">{{ title }}</span>
      <HelpTip v-if="help" light :topic="help" />
      <q-space />
      <span class="fg-bar-title" :class="doneCount === list.length && list.length > 0 ? '' : 'fg-bar-gold'"
            :style="doneCount === list.length && list.length > 0 ? 'color: #9fc79a' : ''">
        {{ doneCount }} / {{ list.length }}
      </span>
      <q-btn flat dense round size="sm" icon="add" :style="{ color: 'var(--fg-cream)' }" @click="adding = !adding">
        <q-tooltip>Add your own task</q-tooltip>
      </q-btn>
    </div>

    <q-slide-transition>
      <q-card-section v-if="adding" class="q-py-sm">
        <q-input v-model="newTitle" dense outlined autofocus placeholder="New task…"
                 @keyup.enter="addTask" @keyup.esc="adding = false">
          <template #append><q-btn flat dense icon="check" color="primary" @click="addTask" /></template>
        </q-input>
      </q-card-section>
    </q-slide-transition>

    <q-list class="fg-zebra">
      <q-item v-for="t in list" :key="t.id" tag="label" clickable dense class="q-py-sm">
        <q-item-section side top>
          <q-checkbox
            :model-value="tasks.isDone(t.id, cadence, now)"
            color="primary" size="sm"
            @update:model-value="tasks.toggle(t.id, cadence, now)"
          />
        </q-item-section>
        <q-item-section>
          <q-item-label class="text-weight-bold" :class="tasks.isDone(t.id, cadence, now) ? 'fg-strike' : 'fg-ink'">
            {{ t.title }}
            <HelpTip v-if="'help' in t && t.help" :topic="t.help" class="q-ml-xs" />
          </q-item-label>
          <q-item-label v-if="t.detail" caption class="fg-muted">{{ t.detail }}</q-item-label>
        </q-item-section>
        <q-item-section v-if="t.id.startsWith('c-')" side>
          <q-btn flat dense round size="xs" icon="close" class="fg-muted" @click.prevent="tasks.removeCustom(t.id)" />
        </q-item-section>
      </q-item>
      <q-item v-if="list.length === 0">
        <q-item-section class="fg-muted text-caption">Nothing here yet — some tasks unlock as your profile/progress changes.</q-item-section>
      </q-item>
    </q-list>
  </q-card>
</template>
