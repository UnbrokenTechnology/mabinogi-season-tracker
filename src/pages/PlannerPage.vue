<script setup lang="ts">
import { computed } from 'vue'
import { useQuasar } from 'quasar'
import { useProfileStore } from '../stores/profile'
import { useProgressStore } from '../stores/progress'
import { CRAFT_FIELDS, GATHER_TREES, DECISION_GUIDANCE, LADDER } from '../data/fields'
import { MILESTONES } from '../data/tasks'
import { useNow } from '../lib/useNow'

const $q = useQuasar()
const profile = useProfileStore()
const progress = useProgressStore()
const now = useNow()

const secondaryOptions = [
  { value: 'none', label: 'Decide later' },
  { value: 'ether', label: 'Ether Powder line — Craftworks/Magic Craft to Lv 5 (no rank needed, feeds Equipment Tuning)' },
  { value: 'farming', label: 'Farming spec — feed your own crafting with gathered mats' },
  { value: 'second-spec', label: 'Second crafting spec — field-hop to whichever is soft each cycle' }
]

const chosenField = computed(() => CRAFT_FIELDS.find(f => f.id === profile.primaryField))

function pickField(id: string) {
  profile.primaryField = profile.primaryField === id ? '' : id
  if (profile.primaryField) {
    profile.onboarded = true
    $q.notify({
      message: `${CRAFT_FIELDS.find(f => f.id === id)?.label} set as your primary field — weekly checklist updated.`,
      color: 'primary', icon: 'check'
    })
  }
}

const milestones = computed(() => {
  const label = chosenField.value?.label ?? 'your chosen field'
  return MILESTONES.map(m => ({
    ...m,
    text: m.text.replace('{field}', label),
    past: new Date(m.date + 'T14:00:00Z').getTime() < now.value.getTime()
  }))
})

// column tints matching the printed ladder (cheap = green, mid = cream, dear = red)
const ladderTint = ['fg-tint-green', 'fg-tint-green', 'fg-tint-gold', 'fg-tint-red', 'fg-tint-red']
</script>

<template>
  <q-page padding>
    <div class="fg-eyebrow q-mb-xs">Mabinogi · New Life Field Guide</div>
    <div class="fg-display text-h4 fg-ink q-mb-xs">Strategy <span class="fg-gold-text">Planner</span></div>
    <div class="text-body2 fg-muted q-mb-lg" style="max-width: 900px">
      Specializations are the one decision this season that's expensive to change. All nine trees are open
      to everyone — the constraint is <b class="fg-gold-text">Life Association Keys</b>, and the evaluation
      cost ladder is shared across every tree. Read the guidance, then pick <b>your</b> path — the tracker
      tailors your weekly checklist and milestones to it. Each person using this tool keeps their own choices.
    </div>

    <!-- Guidance -->
    <div class="row q-col-gutter-md q-mb-lg">
      <div v-for="(g, i) in DECISION_GUIDANCE" :key="g.title" class="col-12 col-md-6 col-lg-4">
        <div v-if="i === 0 || g.color === 'warning'" class="fg-callout-red full-height">
          <div class="fg-callout-title"><q-icon :name="g.icon" class="q-mr-xs" />{{ g.title }}</div>
          <div class="text-body2 fg-ink">{{ g.body }}</div>
        </div>
        <q-card v-else flat class="fg-card full-height guidance-card">
          <q-card-section class="q-pb-xs">
            <span class="fg-eyebrow"><q-icon :name="g.icon" size="15px" class="q-mr-xs" />{{ g.title }}</span>
          </q-card-section>
          <q-card-section class="q-pt-none text-body2 fg-ink">{{ g.body }}</q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Key ladder -->
    <q-card flat class="fg-card q-mb-xl overflow-hidden" style="max-width: 680px">
      <div class="fg-bar">
        <q-icon name="key" size="16px" :style="{ color: 'var(--fg-gold)' }" />
        <span class="fg-bar-title fg-bar-gold">Key-Cost Ladder — Shared Across All Fields</span>
      </div>
      <q-markup-table flat dense class="bg-transparent fg-ink">
        <thead>
          <tr>
            <th class="text-left fg-label">Evaluation #</th>
            <th v-for="(l, i) in LADDER" :key="l.range" class="text-center text-weight-bold" :class="ladderTint[i]">{{ l.range }}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="text-left fg-label">Keys each</td>
            <td v-for="(l, i) in LADDER" :key="l.range" class="text-center text-h6 text-weight-bold" :class="ladderTint[i]">{{ l.cost }}</td>
          </tr>
        </tbody>
      </q-markup-table>
      <q-card-section class="q-py-sm text-caption fg-muted">
        One tree to Lv 5 ≈ the cheap tier. Three trees ≈ the costly tier. The ladder is the game telling you to focus.
        You've taken <b class="fg-gold-text">{{ progress.evalCount }}</b> evaluations — the next costs
        <b class="fg-gold-text">{{ progress.nextEvalCost }}</b> key(s).
      </q-card-section>
    </q-card>

    <!-- Primary field choice -->
    <div class="fg-section">
      <span class="fg-section-num">1</span>
      <span class="fg-section-title">Pick Your Field</span>
      <span class="fg-section-side">Maistir-eligible · one to Lv 5 first</span>
    </div>
    <div class="row q-col-gutter-md q-mb-xl">
      <div v-for="f in CRAFT_FIELDS" :key="f.id" class="col-12 col-md-6 col-lg-4">
        <q-card flat class="fg-card full-height cursor-pointer field-card overflow-hidden"
                :class="profile.primaryField === f.id ? 'field-selected' : ''"
                @click="pickField(f.id)">
          <div class="fg-bar">
            <q-icon :name="f.icon" size="16px" :style="{ color: 'var(--fg-gold)' }" />
            <span class="fg-bar-title">{{ f.label }}</span>
            <q-space />
            <span v-if="profile.primaryField === f.id" class="fg-gold-badge">Your pick</span>
          </div>
          <q-card-section class="q-py-xs text-caption fg-muted">{{ f.skills }}</q-card-section>
          <q-card-section class="q-py-xs">
            <div class="fg-label fg-gold-text">Maistir products</div>
            <ul class="q-my-xs q-pl-md text-body2 fg-ink">
              <li v-for="p in f.maistirProducts" :key="p">{{ p }}</li>
            </ul>
            <div class="fg-label fg-green-text">Pros</div>
            <ul class="q-my-xs q-pl-md text-body2 fg-ink">
              <li v-for="p in f.pros" :key="p">{{ p }}</li>
            </ul>
            <div class="fg-label fg-red-text">Cons</div>
            <ul class="q-my-xs q-pl-md text-body2 fg-ink">
              <li v-for="p in f.cons" :key="p">{{ p }}</li>
            </ul>
            <div class="text-caption fg-muted">{{ f.subSpecNote }}</div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Secondary + gathering -->
    <div class="row q-col-gutter-md q-mb-xl">
      <div class="col-12 col-md-6">
        <div class="fg-section">
          <span class="fg-section-num">2</span>
          <span class="fg-section-title">Second Line</span>
          <span class="fg-section-side">mid-season · optional</span>
        </div>
        <q-card flat class="fg-card">
          <q-card-section>
            <q-option-group v-model="profile.secondaryLine" :options="secondaryOptions" color="primary" class="fg-ink" />
          </q-card-section>
        </q-card>
      </div>
      <div class="col-12 col-md-6">
        <div class="fg-section">
          <span class="fg-section-num">3</span>
          <span class="fg-section-title">Gathering</span>
          <span class="fg-section-side">optional · multi-select</span>
        </div>
        <q-card flat class="fg-card">
          <q-list class="fg-zebra">
            <q-item v-for="t in GATHER_TREES" :key="t.id" tag="label" clickable>
              <q-item-section side top>
                <q-checkbox v-model="profile.gatheringFocus" :val="t.id" color="primary" />
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-weight-bold fg-ink"><q-icon :name="t.icon" class="q-mr-xs fg-green-text" />{{ t.label }}</q-item-label>
                <q-item-label caption class="fg-muted">{{ t.covers }}</q-item-label>
                <q-item-label caption class="fg-muted">{{ t.rareNote }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card>
      </div>
    </div>

    <!-- Profile bits + milestones -->
    <div class="row q-col-gutter-md q-mb-lg">
      <div class="col-12 col-md-6">
        <div class="fg-section">
          <span class="fg-section-num">4</span>
          <span class="fg-section-title">Your Notes</span>
        </div>
        <q-card flat class="fg-card">
          <q-card-section>
            <q-input v-model="profile.playerName" outlined dense label="Character name (shown in header)" class="q-mb-sm" />
            <q-toggle v-model="profile.freeResetUsed" color="negative" keep-color
                      label="I've used my one FREE full spec reset this season" />
            <q-input v-model="profile.notes" outlined type="textarea" autogrow label="Strategy notes"
                     class="q-mt-sm" placeholder="e.g. this month's barter list targets, scouting notes on field crowding…" />
          </q-card-section>
        </q-card>
      </div>
      <div class="col-12 col-md-6">
        <div class="fg-section">
          <span class="fg-section-num">5</span>
          <span class="fg-section-title">Milestones</span>
          <span class="fg-section-side">you should have…</span>
        </div>
        <q-timeline color="primary" class="q-pl-sm">
          <q-timeline-entry v-for="m in milestones" :key="m.date"
                            :color="m.past ? 'grey-6' : 'secondary'"
                            :icon="m.past ? 'check' : 'flag'">
            <template #subtitle><span class="fg-label">{{ m.date }}</span></template>
            <div class="text-body2" :class="m.past ? 'fg-muted' : 'fg-ink'">{{ m.text }}</div>
          </q-timeline-entry>
        </q-timeline>
      </div>
    </div>
  </q-page>
</template>

<style scoped>
.guidance-card { border-left: 3px solid var(--fg-green); }
.field-card { transition: box-shadow 0.2s, transform 0.15s; }
.field-card:hover { transform: translateY(-2px); }
.field-selected { box-shadow: 0 0 0 2.5px var(--fg-gold), var(--fg-shadow); }
</style>
