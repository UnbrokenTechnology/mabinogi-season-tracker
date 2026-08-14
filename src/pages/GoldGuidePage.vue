<script setup lang="ts">
import { computed } from 'vue'
import { REVENUE_STREAMS, PRINCIPLES } from '../data/goldGuide'
import { useProfileStore } from '../stores/profile'

const profile = useProfileStore()

// surface which streams the player's current build can actually run
const foodOnly = ['Seasonal Dishes', 'Physique-Preserving']
const relevant = computed(() => (title: string) =>
  !foodOnly.some(f => title.includes(f)) || profile.primaryField === 'food')

const toneColor = { green: 'var(--fg-green)', gold: 'var(--fg-gold-ink)', red: 'var(--fg-red)' } as const
</script>

<template>
  <q-page padding>
    <div class="fg-eyebrow q-mb-xs">Korean-server verified · prices differ per server</div>
    <div class="fg-display text-h4 fg-ink q-mb-xs">Gold <span class="fg-gold-text">Guide</span></div>
    <div class="text-body2 fg-muted q-mb-lg" style="max-width: 900px">
      Revenue streams ranked by KR-server results for the NEW LIFE season, adapted to your Strategy picks.
      Treat every price claim as a hypothesis — check your own server's Auction House and Iria barter list
      before committing keys or crafting time.
    </div>

    <div class="row q-col-gutter-md">
      <!-- Streams -->
      <div class="col-12 col-lg-8">
        <div class="fg-section">
          <span class="fg-section-num">$</span>
          <span class="fg-section-title">Revenue Streams</span>
          <span class="fg-section-side">priority order</span>
        </div>
        <q-list class="q-gutter-y-md">
          <q-card v-for="s in REVENUE_STREAMS" :key="s.rank" flat class="fg-card overflow-hidden"
                  :style="!relevant(s.title) ? 'opacity: 0.55' : ''">
            <q-card-section horizontal>
              <q-card-section class="column items-center justify-center q-px-md fg-tint-gold" style="min-width: 64px">
                <div class="fg-display text-h5 text-weight-bold fg-gold-text">{{ s.rank }}</div>
                <q-icon :name="s.icon" size="20px" class="fg-green-text" />
              </q-card-section>
              <q-card-section class="col q-py-sm">
                <div class="text-subtitle1 text-weight-bold fg-ink">
                  {{ s.title }}
                  <span v-if="!relevant(s.title)" class="fg-label fg-red-text q-ml-sm">needs Food Maistir — not your current pick</span>
                </div>
                <div class="fg-label q-mt-xs">Requires</div>
                <div class="text-body2 fg-ink">{{ s.requires }}</div>
                <div class="text-body2 fg-muted q-mt-xs">{{ s.why }}</div>
                <div v-if="s.krNote" class="text-caption q-mt-xs" :style="{ color: 'var(--fg-gold-ink)' }">
                  <q-icon name="public" size="13px" class="q-mr-xs" />KR: {{ s.krNote.replace(/^KR:?\s*/, '') }}
                </div>
              </q-card-section>
            </q-card-section>
          </q-card>
        </q-list>
      </div>

      <!-- Principles + mistakes -->
      <div class="col-12 col-lg-4">
        <div class="fg-section">
          <span class="fg-section-num">!</span>
          <span class="fg-section-title">Principles</span>
        </div>
        <q-card v-for="p in PRINCIPLES" :key="p.title" flat class="fg-card q-mb-md"
                :style="{ borderLeft: `3px solid ${toneColor[p.tone]}` }">
          <q-card-section class="q-py-sm">
            <div class="fg-label q-mb-xs" :style="{ color: toneColor[p.tone] }">
              <q-icon :name="p.icon" size="15px" class="q-mr-xs" />{{ p.title }}
            </div>
            <div class="text-body2 fg-ink">{{ p.text }}</div>
          </q-card-section>
        </q-card>

        <div class="fg-callout-red q-mt-md">
          <div class="fg-callout-title">Your build changes this list</div>
          <div class="text-body2 fg-ink">
            Streams 2–3 need Food Maistir; stream 5 needs Craftworks Magic Craft; stream 6 needs the matching
            sub-spec. Pick your path on the Strategy page and the irrelevant ones dim here.
          </div>
          <router-link to="/planner" class="help-link">→ Strategy Planner</router-link>
        </div>
      </div>
    </div>
  </q-page>
</template>
