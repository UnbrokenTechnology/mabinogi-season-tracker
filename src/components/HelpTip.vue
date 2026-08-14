<script setup lang="ts">
import { computed } from 'vue'
import { HELP } from '../data/help'

const props = defineProps<{
  topic: string
  light?: boolean   // for use inside deep-green bars
}>()

const entry = computed(() => HELP[props.topic])
</script>

<template>
  <q-icon
    v-if="entry"
    name="help_outline"
    size="15px"
    class="help-tip cursor-pointer"
    :class="light ? 'help-tip--light' : 'help-tip--dark'"
    tabindex="0"
    @click.stop.prevent
  >
    <q-menu anchor="bottom middle" self="top middle" max-width="340px" class="help-menu">
      <div class="q-pa-md" @click.stop>
        <div class="fg-eyebrow q-mb-xs">{{ entry.title }}</div>
        <div class="text-body2 fg-ink" style="white-space: pre-line; line-height: 1.5">{{ entry.text }}</div>
        <div v-if="entry.links?.length" class="q-mt-sm column q-gutter-xs">
          <router-link v-for="l in entry.links" :key="l.to" :to="l.to" class="help-link">
            → {{ l.label }}
          </router-link>
        </div>
      </div>
    </q-menu>
    <q-tooltip anchor="top middle" self="bottom middle" :delay="400">What's this?</q-tooltip>
  </q-icon>
</template>

<style scoped>
.help-tip { opacity: 0.65; transition: opacity 0.15s; }
.help-tip:hover, .help-tip:focus { opacity: 1; }
.help-tip--light { color: var(--fg-cream); }
.help-tip--dark { color: var(--fg-muted); }
</style>

<style>
/* q-menu renders in a portal — style globally */
.help-menu {
  background: var(--fg-card) !important;
  color: var(--fg-ink);
  border: 1.5px solid var(--fg-gold);
  border-radius: 8px;
  box-shadow: var(--fg-shadow);
}
.help-menu .help-link {
  color: var(--fg-gold-ink);
  font-weight: 700;
  font-size: 13px;
  text-decoration: none;
}
.help-menu .help-link:hover { text-decoration: underline; }
</style>
