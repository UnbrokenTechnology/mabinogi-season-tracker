<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Cadence } from '../data/tasks'
import { useTasksStore } from '../stores/tasks'
import { useNow } from '../lib/useNow'

const props = defineProps<{
  cadence: Cadence
  title: string
  icon: string
  color?: string
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
  <q-card flat bordered class="bg-dark">
    <q-card-section class="row items-center q-py-sm">
      <q-icon :name="icon" :color="color || 'primary'" size="22px" class="q-mr-sm" />
      <div class="text-subtitle1 text-weight-bold">{{ title }}</div>
      <q-space />
      <q-badge :color="doneCount === list.length && list.length > 0 ? 'positive' : 'grey-8'">
        {{ doneCount }}/{{ list.length }}
      </q-badge>
      <q-btn flat dense round size="sm" icon="add" class="q-ml-xs" @click="adding = !adding">
        <q-tooltip>Add your own task</q-tooltip>
      </q-btn>
    </q-card-section>

    <q-slide-transition>
      <q-card-section v-if="adding" class="q-pt-none">
        <q-input v-model="newTitle" dense outlined autofocus placeholder="New task…"
                 @keyup.enter="addTask" @keyup.esc="adding = false">
          <template #append><q-btn flat dense icon="check" @click="addTask" /></template>
        </q-input>
      </q-card-section>
    </q-slide-transition>

    <q-list dense>
      <q-item v-for="t in list" :key="t.id" tag="label" clickable>
        <q-item-section side top>
          <q-checkbox
            :model-value="tasks.isDone(t.id, cadence, now)"
            color="secondary" keep-color
            @update:model-value="tasks.toggle(t.id, cadence, now)"
          />
        </q-item-section>
        <q-item-section>
          <q-item-label :class="tasks.isDone(t.id, cadence, now) ? 'text-strike text-grey-6' : ''">
            {{ t.title }}
          </q-item-label>
          <q-item-label v-if="t.detail" caption class="text-grey-6">{{ t.detail }}</q-item-label>
        </q-item-section>
        <q-item-section v-if="t.id.startsWith('c-')" side>
          <q-btn flat dense round size="xs" icon="close" color="grey-7" @click.prevent="tasks.removeCustom(t.id)" />
        </q-item-section>
      </q-item>
      <q-item v-if="list.length === 0">
        <q-item-section class="text-grey-6 text-caption">Nothing here yet — some tasks unlock as your profile/progress changes.</q-item-section>
      </q-item>
    </q-list>
  </q-card>
</template>
