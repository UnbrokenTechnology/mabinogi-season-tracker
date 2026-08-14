<script setup lang="ts">
import { computed } from 'vue'
import { useNow } from './lib/useNow'
import { formatClock, SERVER_TZ } from './lib/time'
import { useProfileStore } from './stores/profile'

const now = useNow()
const profile = useProfileStore()
const serverClock = computed(() => formatClock(now.value, SERVER_TZ))
const localClock = computed(() => formatClock(now.value, Intl.DateTimeFormat().resolvedOptions().timeZone))

const tabs = [
  { to: '/', icon: 'dashboard', label: 'Dashboard' },
  { to: '/planner', icon: 'alt_route', label: 'Strategy' },
  { to: '/progress', icon: 'trending_up', label: 'Progress' },
  { to: '/ledger', icon: 'key', label: 'Ledger' },
  { to: '/settings', icon: 'settings', label: 'Settings' }
]
</script>

<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated class="bg-dark text-white" style="border-bottom: 2px solid #c9a227">
      <q-toolbar>
        <q-icon name="agriculture" size="28px" color="secondary" class="q-mr-sm" />
        <q-toolbar-title shrink class="text-secondary text-weight-bold">
          Season Tracker
          <span v-if="profile.playerName" class="text-caption text-grey-5 q-ml-sm">· {{ profile.playerName }}</span>
        </q-toolbar-title>

        <q-tabs inline-label shrink stretch active-color="secondary" class="gt-xs">
          <q-route-tab v-for="t in tabs" :key="t.to" :to="t.to" :icon="t.icon" :label="t.label" exact />
        </q-tabs>

        <q-space />

        <div class="column items-end text-caption" style="line-height: 1.2">
          <div><q-icon name="dns" size="14px" class="q-mr-xs" color="secondary" />Server {{ serverClock }}</div>
          <div class="text-grey-5"><q-icon name="home" size="14px" class="q-mr-xs" />Local {{ localClock }}</div>
        </div>
      </q-toolbar>
    </q-header>

    <q-footer class="lt-sm bg-dark" style="border-top: 1px solid #333">
      <q-tabs dense active-color="secondary" class="text-grey-5">
        <q-route-tab v-for="t in tabs" :key="t.to" :to="t.to" :icon="t.icon" exact />
      </q-tabs>
    </q-footer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<style>
.bg-dark-page { background: #151c17; }
</style>
