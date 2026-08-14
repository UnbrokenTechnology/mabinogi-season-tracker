<script setup lang="ts">
import { PATH_STEPS, RANK_TIERS, MAINTAIN_RULES, CURRENCIES, SPEND_PRIORITY } from '../data/maistirGuide'

const tone = {
  green: 'var(--fg-green)',
  gold: 'var(--fg-gold-ink)',
  red: 'var(--fg-red)'
} as const

const sourceLabel = {
  na: 'NA patch notes',
  kr: 'KR-server verified',
  trend: 'KR trend — verify'
} as const

// "Lead — detail" lines: bold the lead, mute the detail
function splitLine(line: string) {
  const i = line.indexOf(' — ')
  return i === -1 ? { lead: line, rest: '' } : { lead: line.slice(0, i), rest: line.slice(i + 3) }
}

const GLANCE = ['Register (G28)', 'Life Lv 30', '6 Basics Lv 5', 'Spec Lv 5', 'Dan + commissions', 'Rank!']
</script>

<template>
  <q-page padding>
    <div class="fg-eyebrow q-mb-xs">The biweekly treadmill · rank is rented, never owned</div>
    <div class="fg-display text-h4 fg-ink q-mb-xs">The Maistir <span class="fg-gold-text">Path</span></div>
    <div class="text-body2 fg-muted q-mb-md" style="max-width: 900px">
      From day one to a held title, plus the currencies that pay for the trip.
    </div>

    <div class="row items-center q-gutter-xs q-mb-lg">
      <template v-for="(g, i) in GLANCE" :key="g">
        <q-icon v-if="i > 0" name="east" size="14px" class="fg-gold-text" />
        <span class="fg-gold-badge">{{ g }}</span>
      </template>
    </div>

    <div class="row q-col-gutter-lg">
      <!-- The path -->
      <div class="col-12 col-lg-7">
        <div class="fg-section">
          <span class="fg-section-num">1</span>
          <span class="fg-section-title">The Path</span>
          <span class="fg-section-side">zero → first rank</span>
        </div>
        <q-card flat class="fg-card">
          <q-list separator>
            <q-item v-for="(s, i) in PATH_STEPS" :key="s.title" class="q-py-md">
              <q-item-section avatar top>
                <div class="path-num fg-display">{{ i + 1 }}</div>
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-subtitle2 text-weight-bold fg-ink">{{ s.title }}</q-item-label>
                <q-item-label class="text-body2 fg-ink q-mt-xs" style="line-height: 1.5">{{ s.detail }}</q-item-label>
                <q-item-label v-if="s.note" caption class="q-mt-xs text-weight-bold"
                              :style="{ color: tone[s.noteTone ?? 'gold'] }">
                  <q-icon name="tips_and_updates" size="13px" class="q-mr-xs" />{{ s.note }}
                </q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card>
      </div>

      <!-- Ranks + maintenance -->
      <div class="col-12 col-lg-5">
        <div class="fg-section">
          <span class="fg-section-num">2</span>
          <span class="fg-section-title">Hold the Rank</span>
          <span class="fg-section-side">every 2 weeks</span>
        </div>

        <q-card flat class="fg-card q-mb-md overflow-hidden">
          <div class="fg-bar">
            <q-icon name="military_tech" size="16px" class="fg-bar-gold" />
            <span class="fg-bar-title">Rank tiers — <span class="fg-bar-gold">percentile per field</span></span>
          </div>
          <q-markup-table flat dense class="rank-table" separator="horizontal">
            <thead>
              <tr>
                <th class="text-left">Rank</th>
                <th class="text-left">Cut</th>
                <th class="text-left">What it grants</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="t in RANK_TIERS" :key="t.rank">
                <td class="text-weight-bold fg-ink" style="white-space: nowrap">{{ t.rank }}</td>
                <td class="fg-ink" style="white-space: nowrap">{{ t.cut }}</td>
                <td class="fg-ink" style="max-width: 260px; white-space: normal; line-height: 1.4">{{ t.perks }}</td>
              </tr>
            </tbody>
          </q-markup-table>
          <q-card-section class="q-py-sm fg-tint-gold">
            <div class="text-caption fg-ink">
              <q-icon name="verified" size="13px" class="fg-gold-text q-mr-xs" />Maistir and Virtuoso each keep a
              <b>20-slot floor</b> regardless of field size. KR's verdict: "it's not 20%, it's 20 people" —
              outside Food on big servers, most fields ran at the floor. Thin fields are very winnable.
            </div>
          </q-card-section>
        </q-card>

        <q-card v-for="r in MAINTAIN_RULES" :key="r.title" flat class="fg-card q-mb-md"
                :style="{ borderLeft: `3px solid ${tone[r.tone]}` }">
          <q-card-section class="q-py-sm">
            <div class="fg-label q-mb-xs" :style="{ color: tone[r.tone] }">
              <q-icon :name="r.icon" size="15px" class="q-mr-xs" />{{ r.title }}
            </div>
            <div class="text-body2 fg-ink" style="line-height: 1.5">{{ r.text }}</div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Currencies -->
    <div class="fg-section q-mt-lg">
      <span class="fg-section-num">3</span>
      <span class="fg-section-title">Currencies &amp; Points</span>
      <span class="fg-section-side">earn · caps · spend</span>
    </div>

    <!-- Spend priority tier lists -->
    <div class="row q-col-gutter-md q-mb-md">
      <div v-for="p in SPEND_PRIORITY" :key="p.currency" class="col-12 col-md-6">
        <q-card flat class="fg-card overflow-hidden full-height">
          <div class="fg-bar">
            <q-icon :name="p.icon" size="16px" class="fg-bar-gold" />
            <span class="fg-bar-title">{{ p.currency.split(' — ')[0] }} — <span class="fg-bar-gold">spend in this order</span></span>
          </div>
          <q-list separator>
            <q-item v-for="(r, i) in p.rows" :key="r.label" class="q-py-sm">
              <q-item-section avatar style="min-width: 40px">
                <div v-if="r.kind === 'tier'" class="prio-num fg-display">{{ i + 1 }}</div>
                <q-icon v-else-if="r.kind === 'never'" name="block" size="22px" class="fg-red-text" />
                <q-icon v-else name="lightbulb" size="20px" class="fg-gold-text" />
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-body2 text-weight-bold"
                              :class="r.kind === 'never' ? 'fg-red-text' : 'fg-ink'">{{ r.label }}</q-item-label>
                <q-item-label class="text-caption fg-muted" style="line-height: 1.4">{{ r.detail }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card>
      </div>
    </div>

    <div class="row q-col-gutter-md">
      <div v-for="c in CURRENCIES" :key="c.id" class="col-12 col-md-6">
        <q-card flat class="fg-card overflow-hidden full-height column">
          <div class="fg-bar">
            <q-icon :name="c.icon" size="16px" class="fg-bar-gold" />
            <span class="fg-bar-title">{{ c.name }}</span>
            <span v-if="c.source" class="q-ml-auto text-caption" style="opacity: 0.75; letter-spacing: 0.06em">
              {{ sourceLabel[c.source] }}
            </span>
          </div>
          <q-card-section class="q-pb-none">
            <div class="text-body2 fg-muted" style="line-height: 1.5">{{ c.tagline }}</div>
          </q-card-section>
          <q-card-section class="row q-col-gutter-md q-pb-sm">
            <div class="col-12 col-sm-6">
              <div class="fg-label q-mb-xs fg-green-text"><q-icon name="add_circle" size="13px" class="q-mr-xs" />Earn</div>
              <div v-for="e in c.earn" :key="e" class="cur-line text-body2">
                <span class="text-weight-bold fg-ink">{{ splitLine(e).lead }}</span>
                <span v-if="splitLine(e).rest" class="fg-muted"> — {{ splitLine(e).rest }}</span>
              </div>
            </div>
            <div class="col-12 col-sm-6">
              <div class="fg-label q-mb-xs fg-red-text"><q-icon name="remove_circle" size="13px" class="q-mr-xs" />Spend</div>
              <div v-for="s in c.spend" :key="s" class="cur-line text-body2">
                <span class="text-weight-bold fg-ink">{{ splitLine(s).lead }}</span>
                <span v-if="splitLine(s).rest" class="fg-muted"> — {{ splitLine(s).rest }}</span>
              </div>
            </div>
          </q-card-section>
          <q-card-section v-if="c.caps.length" class="q-py-sm fg-tint-gold">
            <div class="fg-label q-mb-xs" style="color: var(--fg-gold-ink)">
              <q-icon name="speed" size="13px" class="q-mr-xs" />Caps &amp; limits
            </div>
            <div v-for="cap in c.caps" :key="cap" class="cur-line text-body2">
              <span class="text-weight-bold fg-ink">{{ splitLine(cap).lead }}</span>
              <span v-if="splitLine(cap).rest" class="fg-muted"> — {{ splitLine(cap).rest }}</span>
            </div>
          </q-card-section>
          <q-space />
          <q-card-section v-if="c.warning" class="q-py-sm">
            <div class="fg-callout-red">
              <div class="fg-callout-title">Don't get burned</div>
              <div class="text-body2 fg-ink" style="line-height: 1.5">{{ c.warning }}</div>
            </div>
          </q-card-section>
          <q-card-section v-if="c.seasonEnd" class="q-pt-none q-pb-sm">
            <div class="text-caption fg-muted">
              <q-icon name="event_busy" size="13px" class="q-mr-xs" />Season end: {{ c.seasonEnd }}
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <div class="text-caption fg-muted q-mt-lg" style="max-width: 900px">
      Sources: NA "New Life" patch notes (Aug 13, 2026), Mabinogi World Wiki, and Korean-server guides
      (arca.live, NamuWiki, official KR notices). Anything tagged "KR trend" is community experience from the
      Korean server that may differ on NA — treat as a hypothesis, not a rule.
    </div>
  </q-page>
</template>

<style scoped>
.path-num {
  background: var(--fg-green-deep);
  color: var(--fg-gold);
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: 700;
}
.prio-num {
  background: var(--fg-gold);
  color: #1c3125;
  width: 26px;
  height: 26px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 700;
}
.cur-line {
  padding: 3px 0;
  line-height: 1.45;
}
.cur-line + .cur-line {
  border-top: 1px dashed var(--fg-card-border);
}
.rank-table {
  background: var(--fg-card);
}
.rank-table th {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--fg-muted);
}
</style>
