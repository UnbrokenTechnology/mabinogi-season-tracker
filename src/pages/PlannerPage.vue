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
</script>

<template>
  <q-page padding class="bg-dark-page">
    <div class="text-h5 text-secondary text-weight-bold q-mb-xs">Strategy Planner</div>
    <div class="text-body2 text-grey-5 q-mb-md" style="max-width: 900px">
      Specializations are the one decision in this season that's expensive to change. All nine trees are
      open to everyone — the constraint is <b>Life Association Keys</b>, and the evaluation cost ladder is shared
      across every tree. Read the guidance, then pick <b>your</b> path — the tracker tailors your weekly
      checklist and milestones to it. (You and whoever else uses this tool each get your own saved choices.)
    </div>

    <!-- Guidance -->
    <div class="row q-col-gutter-md q-mb-lg">
      <div v-for="g in DECISION_GUIDANCE" :key="g.title" class="col-12 col-md-6 col-lg-4">
        <q-card flat bordered class="bg-dark full-height">
          <q-card-section class="q-pb-xs">
            <q-icon :name="g.icon" :color="g.color" size="20px" class="q-mr-sm" />
            <span class="text-subtitle2 text-weight-bold">{{ g.title }}</span>
          </q-card-section>
          <q-card-section class="q-pt-none text-body2 text-grey-4">{{ g.body }}</q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Key ladder -->
    <q-card flat bordered class="bg-dark q-mb-lg" style="max-width: 640px">
      <q-card-section class="q-py-sm">
        <div class="text-subtitle2 text-weight-bold text-secondary q-mb-xs">
          <q-icon name="key" class="q-mr-xs" />Evaluation key-cost ladder (lifetime, shared across ALL trees)
        </div>
        <q-markup-table flat dense class="bg-transparent">
          <thead>
            <tr><th class="text-left">Evaluation #</th><th v-for="l in LADDER" :key="l.range">{{ l.range }}</th></tr>
          </thead>
          <tbody>
            <tr><td class="text-left">Keys each</td><td v-for="l in LADDER" :key="l.range" class="text-center text-secondary text-weight-bold">{{ l.cost }}</td></tr>
          </tbody>
        </q-markup-table>
        <div class="text-caption text-grey-6 q-mt-xs">
          One tree to Lv 5 ≈ the cheap tier. Three trees ≈ the costly tier. The ladder is the game telling you to focus.
          You've taken <b class="text-secondary">{{ progress.evalCount }}</b> evaluations — the next costs
          <b class="text-secondary">{{ progress.nextEvalCost }}</b> key(s).
        </div>
      </q-card-section>
    </q-card>

    <!-- Primary field choice -->
    <div class="text-h6 text-weight-bold q-mb-sm">1 · Pick your primary crafting field (Maistir-eligible)</div>
    <div class="row q-col-gutter-md q-mb-lg">
      <div v-for="f in CRAFT_FIELDS" :key="f.id" class="col-12 col-md-6 col-lg-4">
        <q-card flat bordered class="bg-dark full-height cursor-pointer field-card"
                :class="profile.primaryField === f.id ? 'field-selected' : ''"
                @click="pickField(f.id)">
          <q-card-section class="q-pb-xs row items-center">
            <q-icon :name="f.icon" size="24px" :color="profile.primaryField === f.id ? 'secondary' : 'primary'" class="q-mr-sm" />
            <div class="text-subtitle1 text-weight-bold">{{ f.label }}</div>
            <q-space />
            <q-badge v-if="profile.primaryField === f.id" color="secondary" text-color="black">YOUR PICK</q-badge>
          </q-card-section>
          <q-card-section class="q-py-xs text-caption text-grey-6">{{ f.skills }}</q-card-section>
          <q-card-section class="q-py-xs">
            <div class="text-caption text-secondary text-weight-bold">Maistir products</div>
            <ul class="q-my-xs q-pl-md text-body2">
              <li v-for="p in f.maistirProducts" :key="p">{{ p }}</li>
            </ul>
            <div class="text-caption text-positive text-weight-bold">Pros</div>
            <ul class="q-my-xs q-pl-md text-body2">
              <li v-for="p in f.pros" :key="p">{{ p }}</li>
            </ul>
            <div class="text-caption text-negative text-weight-bold">Cons</div>
            <ul class="q-my-xs q-pl-md text-body2">
              <li v-for="p in f.cons" :key="p">{{ p }}</li>
            </ul>
            <div class="text-caption text-grey-6">{{ f.subSpecNote }}</div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Secondary + gathering -->
    <div class="row q-col-gutter-md q-mb-lg">
      <div class="col-12 col-md-6">
        <div class="text-h6 text-weight-bold q-mb-sm">2 · Second income line (mid-season)</div>
        <q-card flat bordered class="bg-dark">
          <q-card-section>
            <q-option-group v-model="profile.secondaryLine" :options="secondaryOptions" color="secondary" />
          </q-card-section>
        </q-card>
      </div>
      <div class="col-12 col-md-6">
        <div class="text-h6 text-weight-bold q-mb-sm">3 · Gathering focus (optional, multi-select)</div>
        <q-card flat bordered class="bg-dark">
          <q-list>
            <q-item v-for="t in GATHER_TREES" :key="t.id" tag="label" clickable>
              <q-item-section side top>
                <q-checkbox v-model="profile.gatheringFocus" :val="t.id" color="secondary" keep-color />
              </q-item-section>
              <q-item-section>
                <q-item-label><q-icon :name="t.icon" class="q-mr-xs" color="primary" />{{ t.label }}</q-item-label>
                <q-item-label caption>{{ t.covers }}</q-item-label>
                <q-item-label caption class="text-grey-6">{{ t.rareNote }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card>
      </div>
    </div>

    <!-- Profile bits -->
    <div class="row q-col-gutter-md q-mb-lg">
      <div class="col-12 col-md-6">
        <q-card flat bordered class="bg-dark">
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
        <div class="text-h6 text-weight-bold q-mb-sm">Milestone plan</div>
        <q-timeline color="primary" class="q-pl-sm">
          <q-timeline-entry v-for="m in milestones" :key="m.date"
                            :color="m.past ? 'grey-7' : 'secondary'"
                            :icon="m.past ? 'check' : 'flag'">
            <template #subtitle>{{ m.date }}</template>
            <div class="text-body2" :class="m.past ? 'text-grey-6' : ''">{{ m.text }}</div>
          </q-timeline-entry>
        </q-timeline>
      </div>
    </div>
  </q-page>
</template>

<style scoped>
.field-card { transition: border-color 0.2s; }
.field-selected { border-color: #c9a227; border-width: 2px; }
</style>
