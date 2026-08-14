<script setup lang="ts">
import { ref } from 'vue'
import { useProgressStore } from '../stores/progress'
import { useProfileStore } from '../stores/profile'
import { BASICS, CRAFT_FIELDS, GATHER_TREES } from '../data/fields'
import HelpTip from '../components/HelpTip.vue'

const progress = useProgressStore()
const profile = useProfileStore()

const rankOptions = ['Maistir', 'Virtuoso', 'Expert', 'Adept', 'Amateur', 'Unranked']
const newRecord = ref({ date: new Date().toISOString().slice(0, 10), field: '', rank: 'Amateur', notes: '' })

function addRecord() {
  if (!newRecord.value.field) newRecord.value.field = profile.primaryField || 'food'
  progress.addMaistirRecord({ ...newRecord.value })
  newRecord.value = { date: new Date().toISOString().slice(0, 10), field: newRecord.value.field, rank: 'Amateur', notes: '' }
}

const allTrees = [
  ...GATHER_TREES.map(t => ({ id: t.id, label: t.label, icon: t.icon, craft: false })),
  ...CRAFT_FIELDS.map(f => ({ id: f.id, label: f.label, icon: f.icon, craft: true }))
]
</script>

<template>
  <q-page padding>
    <div class="fg-display text-h4 fg-ink q-mb-md">Progress</div>

    <div class="row q-col-gutter-md">
      <!-- Life level + basics -->
      <div class="col-12 col-md-6 col-lg-4">
        <q-card flat class="fg-card q-mb-md">
          <q-card-section>
            <div class="text-subtitle1 text-weight-bold q-mb-sm">
              <q-icon name="star" color="secondary" class="q-mr-xs" />Season Life Level
              <HelpTip topic="lifeLevel" class="q-ml-xs" />
            </div>
            <div class="row items-center q-gutter-md">
              <div class="text-h3 text-secondary text-weight-bold">{{ progress.lifeLevel }}</div>
              <div class="col">
                <q-slider v-model="progress.lifeLevel" :min="1" :max="30" color="secondary" label />
                <div class="text-caption fg-muted">EXP only from commissions (20/wk). Week 1 ≈ Lv 21, week 2 = 30.</div>
              </div>
            </div>
          </q-card-section>
        </q-card>

        <q-card flat class="fg-card">
          <q-card-section>
            <div class="row items-center q-mb-sm">
              <div class="text-subtitle1 text-weight-bold">
                <q-icon name="foundation" color="primary" class="q-mr-xs" />Basic Expertise
                <HelpTip topic="basics" class="q-ml-xs" />
              </div>
              <q-space />
              <q-badge :color="progress.basicsGateMet ? 'positive' : 'grey-8'">
                {{ progress.basicsGateMet ? 'GATE MET — Specializations open' : 'All six must reach 5' }}
              </q-badge>
            </div>
            <div v-for="b in BASICS" :key="b.id" class="row items-center q-mb-xs">
              <q-icon :name="b.icon" size="18px" class="q-mr-sm" color="grey-5" />
              <div style="width: 110px">{{ b.label }}</div>
              <q-rating v-model="progress.basics[b.id]" :max="5" size="20px" color="secondary" icon="circle" icon-selected="circle" />
              <div class="q-ml-sm text-caption fg-muted">{{ progress.basics[b.id] }}/5</div>
            </div>
            <div class="text-caption fg-muted q-mt-sm">
              Spread points evenly — favorites waste nothing but time; all six at 5 is the hard gate.
            </div>
          </q-card-section>
        </q-card>
      </div>

      <!-- Specializations -->
      <div class="col-12 col-md-6 col-lg-4">
        <q-card flat class="fg-card q-mb-md">
          <q-card-section>
            <div class="text-subtitle1 text-weight-bold q-mb-sm">
              <q-icon name="alt_route" color="primary" class="q-mr-xs" />Specializations
              <HelpTip topic="specs" class="q-ml-xs" />
            </div>
            <div v-for="t in allTrees" :key="t.id" class="row items-center q-mb-xs"
                 :class="profile.primaryField === t.id ? 'text-secondary' : ''">
              <q-icon :name="t.icon" size="18px" class="q-mr-sm" :color="profile.primaryField === t.id ? 'secondary' : 'grey-5'" />
              <div style="width: 120px">
                {{ t.label }}
                <q-badge v-if="profile.primaryField === t.id" color="secondary" text-color="black" class="q-ml-xs">1st</q-badge>
              </div>
              <q-rating v-model="progress.specs[t.id]" :max="5" size="20px"
                        :color="t.craft ? 'secondary' : 'primary'" icon="circle" icon-selected="circle" />
              <div class="q-ml-sm text-caption fg-muted">{{ progress.specs[t.id] }}/5</div>
            </div>
            <q-separator class="q-my-sm" />
            <div class="row items-center q-gutter-sm">
              <div class="text-body2">Lifetime evaluations taken:</div>
              <q-btn dense size="sm" outline icon="remove" :disable="progress.evalCount <= 0" @click="progress.evalCount--" />
              <div class="text-h6 text-secondary">{{ progress.evalCount }}</div>
              <q-btn dense size="sm" unelevated color="primary" icon="add" @click="progress.evalCount++" />
              <div class="text-caption fg-muted">next costs {{ progress.nextEvalCost }} key(s)</div>
            </div>
          </q-card-section>
        </q-card>

        <q-card flat class="fg-card">
          <q-card-section>
            <div class="text-subtitle1 text-weight-bold q-mb-sm">
              <q-icon name="flag" color="primary" class="q-mr-xs" />Season Life Goals
              <HelpTip topic="lifeGoals" class="q-ml-xs" />
            </div>
            <div class="row items-center q-gutter-sm q-mb-sm">
              <q-btn dense size="sm" outline icon="remove" :disable="progress.lifeGoals <= 0" @click="progress.lifeGoals--" />
              <div class="text-h4 text-secondary text-weight-bold">{{ progress.lifeGoals }}</div>
              <q-btn dense size="sm" unelevated color="primary" icon="add" @click="progress.lifeGoals++" />
              <div class="text-caption fg-muted">Life Goals completed</div>
            </div>
            <q-list dense>
              <q-item v-for="(u, label) in {
                'Novice weekly quest (2)': progress.goalUnlocks.noviceWeekly,
                'Adept weekly quest (5)': progress.goalUnlocks.adeptWeekly,
                'Expert weekly quest (7)': progress.goalUnlocks.expertWeekly,
                'Treasure Chests (15)': progress.goalUnlocks.treasureChests
              }" :key="label">
                <q-item-section side><q-icon :name="u ? 'check_circle' : 'radio_button_unchecked'" :color="u ? 'positive' : 'grey-7'" size="18px" /></q-item-section>
                <q-item-section :class="u ? '' : 'fg-muted'">{{ label }}</q-item-section>
              </q-item>
            </q-list>
            <div class="row items-center q-gutter-sm q-mt-sm">
              <div class="text-body2">Farm Expansion goals:</div>
              <q-btn dense size="sm" outline icon="remove" :disable="progress.farmExpansionGoals <= 0" @click="progress.farmExpansionGoals--" />
              <div class="text-subtitle1 text-secondary">{{ progress.farmExpansionGoals }}</div>
              <q-btn dense size="sm" unelevated color="primary" icon="add" @click="progress.farmExpansionGoals++" />
            </div>
            <div class="text-caption fg-muted">Expansion first — both Rubber Trees ASAP; rubber is the season's bottleneck.</div>
          </q-card-section>
        </q-card>
      </div>

      <!-- Maistir history -->
      <div class="col-12 col-lg-4">
        <q-card flat class="fg-card">
          <q-card-section>
            <div class="text-subtitle1 text-weight-bold q-mb-sm">
              <q-icon name="military_tech" color="secondary" class="q-mr-xs" />Maistir Evaluations
              <HelpTip topic="maistirHistory" class="q-ml-xs" />
            </div>
            <div class="row q-col-gutter-xs q-mb-sm">
              <div class="col-4"><q-input v-model="newRecord.date" dense outlined type="date" label="Date" /></div>
              <div class="col-4">
                <q-select v-model="newRecord.field" dense outlined label="Field"
                          :options="CRAFT_FIELDS.map(f => f.id)" emit-value map-options
                          :display-value="newRecord.field || '—'" />
              </div>
              <div class="col-4"><q-select v-model="newRecord.rank" dense outlined label="Rank" :options="rankOptions" /></div>
              <div class="col-9"><q-input v-model="newRecord.notes" dense outlined label="Notes (score, field crowding…)" /></div>
              <div class="col-3"><q-btn class="full-width" unelevated color="primary" icon="add" @click="addRecord" /></div>
            </div>
            <q-list separator dense>
              <q-item v-for="r in progress.maistirHistory" :key="r.id">
                <q-item-section>
                  <q-item-label>
                    <q-badge :color="r.rank === 'Maistir' ? 'secondary' : r.rank === 'Virtuoso' ? 'primary' : 'grey-8'"
                             :text-color="r.rank === 'Maistir' ? 'black' : 'white'">{{ r.rank }}</q-badge>
                    <span class="q-ml-sm text-capitalize">{{ r.field }}</span>
                  </q-item-label>
                  <q-item-label caption>{{ r.date }}<span v-if="r.notes"> — {{ r.notes }}</span></q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-btn flat dense round size="xs" icon="close" color="grey-7" @click="progress.removeMaistirRecord(r.id)" />
                </q-item-section>
              </q-item>
              <q-item v-if="progress.maistirHistory.length === 0">
                <q-item-section class="fg-muted text-caption">
                  No evaluations yet. First one resolves Aug 27 — scoring closes at MIDNIGHT Aug 26→27.
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>
