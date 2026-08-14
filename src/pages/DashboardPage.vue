<script setup lang="ts">
import { computed } from 'vue'
import { useNow } from '../lib/useNow'
import {
  nextEnvEvent, todaysEnvWindows, nextDailyReset, nextWeeklyReset, SEASON_END
} from '../lib/time'
import { useCountersStore } from '../stores/counters'
import { useProfileStore } from '../stores/profile'
import CountdownChip from '../components/CountdownChip.vue'
import DeadlineRail from '../components/DeadlineRail.vue'
import ChecklistCard from '../components/ChecklistCard.vue'
import CounterControl from '../components/CounterControl.vue'
import HeatStrip from '../components/HeatStrip.vue'
import KeyLedgerWidget from '../components/KeyLedgerWidget.vue'

const now = useNow()
const counters = useCountersStore()
const profile = useProfileStore()

const envNext = computed(() => nextEnvEvent(now.value))
const envToday = computed(() => todaysEnvWindows(now.value))
const daysToSeasonEnd = computed(() => Math.max(0, Math.ceil((SEASON_END.getTime() - now.value.getTime()) / 86400000)))
</script>

<template>
  <q-page padding>
    <div v-if="!profile.onboarded" class="fg-callout-red q-mb-md">
      <div class="fg-callout-title"><q-icon name="alt_route" class="q-mr-xs" />Before spending a single key</div>
      <div class="text-body2 fg-ink">
        Head to the <b>Strategy</b> page first — it walks through the specialization choice (the one
        decision that's expensive to get wrong) and tailors your weekly checklist to it.
        <q-btn dense flat no-caps class="fg-red-text text-weight-bold q-ml-sm" label="Open Strategy →" to="/planner" />
      </div>
    </div>

    <!-- Countdown chips -->
    <div class="row q-gutter-sm q-mb-md items-center">
      <CountdownChip :target="envNext.at" :label="`Env event ${envNext.label}`" icon="eco" />
      <CountdownChip :target="nextDailyReset(now)" label="Daily reset" icon="wb_twilight" />
      <CountdownChip :target="nextWeeklyReset(now)" label="Weekly reset" icon="event_repeat" />
      <span class="fg-gold-badge">{{ daysToSeasonEnd }} days left · Lughnasadh S1</span>
    </div>

    <div class="row q-col-gutter-md">
      <!-- LEFT: today + week -->
      <div class="col-12 col-md-8">
        <!-- Counters -->
        <div class="row q-col-gutter-sm q-mb-md">
          <div class="col-6 col-sm-3">
            <CounterControl label="Commissions / wk" icon="assignment" big
              :value="counters.commissionsNow(now)" :cap="20"
              @bump="d => counters.bump('commissions', d, now, 20)" />
          </div>
          <div class="col-6 col-sm-3">
            <CounterControl label="Deliveries" icon="local_shipping"
              :value="counters.deliveriesNow(now)" :cap="6"
              @bump="d => counters.bump('deliveries', d, now, 6)" />
          </div>
          <div class="col-6 col-sm-3">
            <CounterControl label="Cheers given" icon="celebration"
              :value="counters.cheersNow(now)" :cap="3"
              @bump="d => counters.bump('cheers', d, now, 3)" />
          </div>
          <div class="col-6 col-sm-3">
            <CounterControl label="Env events" icon="eco"
              :value="counters.envEventsNow(now)" :cap="2"
              @bump="d => counters.bump('envEventsDone', d, now, 2)" />
          </div>
        </div>

        <div class="row items-center q-mb-md q-gutter-md">
          <q-toggle
            :model-value="counters.bountyUsedNow(now)"
            color="primary"
            label="Bounty spent today (refills 7 AM server)"
            @update:model-value="counters.toggleBounty(now)"
          />
          <div class="text-caption fg-muted">
            Today's windows:
            <span v-for="w in envToday" :key="w.label" class="q-ml-sm text-weight-bold"
                  :class="w.at.getTime() < now.getTime() ? '' : 'fg-green-text'">
              {{ w.label }}<q-icon v-if="w.at.getTime() < now.getTime()" name="history" size="13px" class="q-ml-xs" />
            </span>
          </div>
        </div>

        <div class="row q-col-gutter-md">
          <div class="col-12 col-lg-6">
            <ChecklistCard cadence="daily" title="Today · Daily Loop" icon="today" />
          </div>
          <div class="col-12 col-lg-6">
            <ChecklistCard cadence="weekly" title="This Week · Thursdays" icon="date_range" />
            <div class="q-mt-md">
              <ChecklistCard cadence="biweekly" title="This Eval Cycle" icon="military_tech" />
            </div>
            <div class="q-mt-md">
              <ChecklistCard cadence="monthly" title="This Barter Month" icon="currency_exchange" />
            </div>
          </div>
        </div>

        <q-card flat class="fg-card q-mt-md">
          <q-card-section class="q-py-sm">
            <HeatStrip />
          </q-card-section>
        </q-card>
      </div>

      <!-- RIGHT: deadlines + keys -->
      <div class="col-12 col-md-4">
        <DeadlineRail class="q-mb-md" />
        <KeyLedgerWidget />
      </div>
    </div>
  </q-page>
</template>
