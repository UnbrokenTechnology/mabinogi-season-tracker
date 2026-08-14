<script setup lang="ts">
import { computed, watch } from 'vue'
import { Dark } from 'quasar'
import { useNow } from './lib/useNow'
import { formatClock, SERVER_TZ } from './lib/time'
import { useProfileStore } from './stores/profile'

const now = useNow()
const profile = useProfileStore()
const serverClock = computed(() => formatClock(now.value, SERVER_TZ))
const localClock = computed(() => formatClock(now.value, Intl.DateTimeFormat().resolvedOptions().timeZone))

Dark.set(profile.nightMode)
watch(() => profile.nightMode, v => Dark.set(v))

const tabs = [
  { to: '/', icon: 'dashboard', label: 'Dashboard' },
  { to: '/planner', icon: 'alt_route', label: 'Strategy' },
  { to: '/progress', icon: 'trending_up', label: 'Progress' },
  { to: '/gold', icon: 'paid', label: 'Gold' },
  { to: '/ledger', icon: 'key', label: 'Ledger' },
  { to: '/settings', icon: 'settings', label: 'Settings' }
]
</script>

<template>
  <q-layout view="hHh lpR fFf">
    <q-header class="fg-masthead">
      <q-toolbar class="q-py-sm">
        <div class="column q-mr-lg" style="line-height: 1.15">
          <div class="fg-eyebrow" style="color: var(--fg-gold)">Mabinogi · New Life</div>
          <div class="fg-display text-h5" style="color: var(--fg-cream)">
            Lughnasadh <span style="color: var(--fg-gold)">Season I</span>
          </div>
          <div v-if="profile.playerName" class="text-caption" style="color: var(--fg-cream); opacity: 0.7">
            {{ profile.playerName }}'s field guide
          </div>
        </div>

        <q-tabs inline-label shrink stretch indicator-color="secondary" class="fg-tabs gt-xs" no-caps>
          <q-route-tab v-for="t in tabs" :key="t.to" :to="t.to" :icon="t.icon" :label="t.label" exact />
        </q-tabs>

        <q-space />

        <q-btn flat dense round :icon="profile.nightMode ? 'dark_mode' : 'light_mode'"
               :style="{ color: 'var(--fg-gold)' }"
               @click="profile.nightMode = !profile.nightMode">
          <q-tooltip>{{ profile.nightMode ? 'Night on the farm' : 'Parchment (print look)' }}</q-tooltip>
        </q-btn>

        <div class="column items-end text-caption q-ml-md" style="line-height: 1.3; color: var(--fg-cream)">
          <div><q-icon name="dns" size="13px" class="q-mr-xs" style="color: var(--fg-gold)" />Server {{ serverClock }}</div>
          <div style="opacity: 0.7"><q-icon name="home" size="13px" class="q-mr-xs" />Local {{ localClock }}</div>
        </div>
      </q-toolbar>
    </q-header>

    <q-footer class="lt-sm fg-masthead">
      <q-tabs dense indicator-color="secondary" class="fg-tabs">
        <q-route-tab v-for="t in tabs" :key="t.to" :to="t.to" :icon="t.icon" exact />
      </q-tabs>
    </q-footer>

    <q-page-container class="fg-page">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<style>
.fg-masthead {
  background: linear-gradient(135deg, var(--fg-green-deep) 0%, var(--fg-green-deep-2) 100%);
  border-bottom: 3px solid var(--fg-gold);
}
</style>
