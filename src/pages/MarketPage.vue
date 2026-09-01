<script setup lang="ts">
import { computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuasar, copyToClipboard } from 'quasar'
import { FARM_MATERIALS, CAULDRONS, RECIPES, PLOT_LABELS, type CauldronRecipe, type PlotKind, type FarmMaterial } from '../data/cauldron'
import { craftCost, craftProfit, byProfitDesc, materialBestUse, netSale, type MaterialValue } from '../lib/market'
import { encodePrices, decodePrices, sharedPriceCount } from '../lib/share'
import { useMarketStore } from '../stores/market'
import HelpTip from '../components/HelpTip.vue'

const market = useMarketStore()
const $q = useQuasar()
const route = useRoute()
const router = useRouter()

function sharePrices() {
  const code = encodePrices(market.prices, market.feePct)
  const url = `${location.origin}${location.pathname}#/market?p=${code}`
  copyToClipboard(url)
    .then(() => $q.notify({ message: 'Share link copied — anyone opening it is offered your prices.', color: 'positive', icon: 'link' }))
    .catch(() => $q.dialog({ title: 'Share these prices', message: `Copy this link:\n\n${url}`, ok: { label: 'Done', color: 'primary' } }))
}

// watch (not onMounted) so a share link pasted into an already-open tab imports too.
// The query must be stripped BEFORE the dialog opens: Quasar dialogs dismiss on
// route change, so a replace issued after $q.dialog() closes it instantly.
watch(() => route.query.p, async code => {
  if (typeof code !== 'string') return
  const shared = decodePrices(code)
  await router.replace({ query: {} })
  if (!shared) {
    $q.notify({ message: "That share link couldn't be read — ask for a fresh one.", color: 'negative', icon: 'link_off' })
    return
  }
  const n = sharedPriceCount(shared)
  $q.dialog({
    title: 'Shared price sheet',
    message: `This link carries ${n} price${n === 1 ? '' : 's'} (AH fee ${shared.feePct}%). Apply them? They overwrite your entries for those items; prices only you have entered are kept.`,
    cancel: true,
    ok: { label: 'Apply prices', color: 'primary' },
    noRouteDismiss: true   // the link's ?p= query is stripped while the dialog is open
  }).onOk(() => {
    market.applyShared(shared.prices, shared.feePct)
    $q.notify({ message: `${n} shared price${n === 1 ? '' : 's'} applied.`, color: 'positive', icon: 'check' })
  })
}, { immediate: true })

interface Row {
  recipe: CauldronRecipe
  cost: number | null
  profit: number | null
  perMin: number | null
}

const rows = computed<Row[]>(() => RECIPES.map(recipe => {
  const cost = craftCost(recipe, market.prices)
  const profit = craftProfit(recipe, market.prices, market.feePct)
  return { recipe, cost, profit, perMin: profit == null ? null : profit / recipe.minutes }
}))

// Rows keep the in-game unlock order so sell-price inputs never jump while typing;
// the best row is highlighted instead of sorted to the top.
const byCauldron = computed(() => CAULDRONS.map(cauldron => {
  const list = rows.value.filter(r => r.recipe.cauldron === cauldron.id)
  const best = [...list].sort((a, b) => byProfitDesc(a.profit, b.profit))[0]
  return { cauldron, rows: list, best: best?.profit != null ? best : null }
}))

const bestOverall = computed(() => {
  const ranked = [...rows.value].sort((a, b) => byProfitDesc(a.profit, b.profit))
  return ranked[0]?.profit != null ? ranked[0] : null
})

const pricedCount = computed(() =>
  [...FARM_MATERIALS.map(m => m.id), ...RECIPES.map(r => r.id)]
    .filter(id => market.prices[id] != null).length
)
const totalPrices = FARM_MATERIALS.length + RECIPES.length

const materialLabel = (id: string) => FARM_MATERIALS.find(m => m.id === id)?.label ?? id
const ingredientText = (r: CauldronRecipe) => r.inputs.map(i => `${materialLabel(i.materialId)} ×${i.qty}`).join(' · ')

// ---- farm planner: best use per material + gold per plot-hour ----

const bestUse = computed(() => {
  const map: Record<string, MaterialValue | null> = {}
  for (const m of FARM_MATERIALS) map[m.id] = materialBestUse(m, market.prices, market.feePct)
  return map
})

const fieldCrops = FARM_MATERIALS.filter(m => m.plot === 'field')
const fixedCrops = FARM_MATERIALS.filter(m => m.plot !== 'field')
const PLOT_KINDS = Object.keys(PLOT_LABELS) as PlotKind[]

interface PlannerRow { m: FarmMaterial; v: MaterialValue | null }
const fieldRank = computed<PlannerRow[]>(() =>
  fieldCrops.map(m => ({ m, v: bestUse.value[m.id] }))
    .sort((a, b) => byProfitDesc(a.v?.perPlotHour ?? null, b.v?.perPlotHour ?? null))
)
const fixedRows = computed<PlannerRow[]>(() => fixedCrops.map(m => ({ m, v: bestUse.value[m.id] })))

const farmPerHour = computed(() => {
  let total = 0
  let missing = false
  let any = false
  const top = fieldRank.value[0]
  if (top?.v) { total += market.plots.field * top.v.perPlotHour; any = true } else missing = true
  for (const row of fixedRows.value) {
    if (row.v) { total += (market.plots[row.m.plot] ?? 0) * row.v.perPlotHour; any = true }
    else if ((market.plots[row.m.plot] ?? 0) > 0) missing = true
  }
  return { total, missing, any }
})

const useText = (v: MaterialValue) =>
  v.use === 'raw' ? 'sell raw' : `craft ${RECIPES.find(r => r.id === v.use)?.label ?? v.use}`

// Caption showing BOTH unit values, so editing a crop's own price visibly moves its
// row even while a craft (which ignores the crop's own price) is winning.
function valueText(m: FarmMaterial, v: MaterialValue): string {
  const parts = [`${useText(v)} ${fmtGold(v.value)}g/unit`]
  const raw = market.prices[m.id]
  if (v.use !== 'raw' && raw != null) parts.push(`raw ${fmtGold(netSale(raw, market.feePct))}g`)
  return parts.join(' · ')
}

// ---- projection period (1 / 8 / 24 h) ----
const hoursOptions = [
  { label: '1 h', value: 1 },
  { label: '8 h', value: 8 },
  { label: '24 h', value: 24 }
]
const perLabel = computed(() => market.plannerHours === 1 ? 'hr' : `${market.plannerHours} h`)
const overHours = (perHour: number) => perHour * market.plannerHours

/** Sell-raw-only income rate for one plot of a crop, regardless of what the best use is. */
function rawPerPlotHour(m: FarmMaterial): number | null {
  const p = market.prices[m.id]
  return p == null ? null : netSale(p, market.feePct) * 60 / m.growMinutes
}

const rawRows = computed(() => FARM_MATERIALS.map(m => {
  const p = market.prices[m.id]
  return {
    m,
    perHour: rawPerPlotHour(m),
    unitNet: p == null ? null : netSale(p, market.feePct),
    plotCount: market.plots[m.plot] ?? 0
  }
}))

function fmtGold(n: number): string { return Math.round(n).toLocaleString() }
function profitClass(p: number | null): string {
  if (p == null) return 'fg-muted'
  return p >= 0 ? 'fg-green-text' : 'fg-red-text'
}
function fmtProfit(p: number | null): string {
  if (p == null) return '—'
  return (p > 0 ? '+' : '') + fmtGold(p) + 'g'
}
const updatedText = computed(() => market.updatedAt
  ? new Date(market.updatedAt).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })
  : null)
</script>

<template>
  <q-page padding>
    <div class="fg-eyebrow q-mb-xs">wiki-verified recipes · prices are yours to enter</div>
    <div class="fg-display text-h4 fg-ink q-mb-xs">Cauldron <span class="fg-gold-text">Market</span></div>
    <div class="text-body2 fg-muted q-mb-md" style="max-width: 900px">
      Enter Auction House prices once — each material price carries into every recipe that uses it.
      Profit = sale after the {{ market.feePct }}% AH fee, minus what the ingredients cost to buy.
      A positive number means buying materials off the AH and crafting is worth it.
    </div>

    <!-- Best right now -->
    <q-card flat class="fg-card q-mb-md">
      <div class="fg-bar">
        <q-icon name="emoji_events" class="fg-bar-gold" size="18px" />
        <span class="fg-bar-title">Best right now</span>
        <HelpTip topic="market" light class="q-ml-xs" />
        <q-space />
        <span class="text-caption" style="opacity: 0.8">{{ pricedCount }} / {{ totalPrices }} prices entered</span>
      </div>
      <q-card-section class="row items-center q-col-gutter-md">
        <div class="col-12 col-md-4">
          <template v-if="bestOverall">
            <div class="fg-label">Most profitable overall</div>
            <div class="fg-display text-h5 fg-ink">{{ bestOverall.recipe.label }}</div>
            <div class="text-subtitle1 text-weight-bold" :class="profitClass(bestOverall.profit)">
              {{ fmtProfit(bestOverall.profit) }} <span class="text-caption fg-muted">per craft</span>
            </div>
          </template>
          <div v-else class="text-body2 fg-muted">
            Fill in material prices and at least one sell price to see rankings.
          </div>
        </div>
        <div class="col-12 col-md-8">
          <div class="row q-gutter-sm">
            <q-chip v-for="c in byCauldron" :key="c.cauldron.id" square
                    :icon="c.cauldron.icon"
                    :class="c.best ? '' : 'fg-muted'"
                    :style="c.best && c.best.profit! >= 0 ? 'background: var(--fg-gold-tint)' : ''">
              <span class="text-weight-bold q-mr-xs">{{ c.cauldron.label }}:</span>
              <template v-if="c.best">{{ c.best.recipe.label }}
                <span class="q-ml-xs" :class="profitClass(c.best.profit)">{{ fmtProfit(c.best.profit) }}</span>
              </template>
              <template v-else>needs prices</template>
            </q-chip>
          </div>
        </div>
      </q-card-section>
    </q-card>

    <div class="row q-col-gutter-md">
      <!-- Material price sheet -->
      <div class="col-12 col-lg-4">
        <q-card flat class="fg-card">
          <div class="fg-bar">
            <q-icon name="grass" class="fg-bar-gold" size="18px" />
            <span class="fg-bar-title">Material Prices</span>
            <HelpTip topic="marketMaterials" light class="q-ml-xs" />
          </div>
          <q-list class="fg-zebra">
            <q-item v-for="m in FARM_MATERIALS" :key="m.id" class="items-center">
              <q-item-section>
                <q-item-label class="text-weight-bold">{{ m.label }}</q-item-label>
              </q-item-section>
              <q-item-section side style="width: 140px">
                <q-input dense outlined type="number" :min="0" suffix="g" placeholder="—"
                         :model-value="market.prices[m.id]"
                         @update:model-value="v => market.setPrice(m.id, v as number | string | null)" />
              </q-item-section>
            </q-item>
          </q-list>
          <q-separator />
          <q-card-section class="q-py-sm">
            <div class="row items-center q-col-gutter-sm">
              <div class="col">
                <div class="fg-label">AH fee <HelpTip topic="marketFee" /></div>
              </div>
              <div class="col-auto" style="width: 110px">
                <q-input dense outlined type="number" :min="0" :max="100" suffix="%"
                         :model-value="market.feePct"
                         @update:model-value="v => market.feePct = Math.min(100, Math.max(0, Number(v) || 0))" />
              </div>
            </div>
            <div class="row items-center q-mt-sm">
              <div class="text-caption fg-muted">
                <template v-if="updatedText">Prices last touched {{ updatedText }}</template>
                <template v-else>No prices entered yet</template>
              </div>
              <q-space />
              <q-btn flat dense size="sm" color="primary" icon="ios_share" label="Share link"
                     :disable="pricedCount === 0" @click="sharePrices">
                <q-tooltip>Copy a link that carries every price on this page</q-tooltip>
              </q-btn>
              <q-btn v-if="market.clearedBackup && pricedCount === 0" flat dense size="sm" color="secondary"
                     icon="restore" label="Restore" @click="market.restoreCleared()">
                <q-tooltip>Bring back the prices from the last clear</q-tooltip>
              </q-btn>
            </div>
          </q-card-section>
        </q-card>

        <!-- Max profit planner -->
        <q-card flat class="fg-card q-mt-md">
          <div class="fg-bar">
            <q-icon name="agriculture" class="fg-bar-gold" size="18px" />
            <span class="fg-bar-title">Max Profit Planner</span>
            <HelpTip topic="farmPlanner" light class="q-ml-xs" />
            <q-space />
            <q-btn-toggle v-model="market.plannerHours" :options="hoursOptions" dense flat size="sm"
                          toggle-color="secondary" text-color="white" />
          </div>

          <q-card-section class="q-py-sm">
            <div class="fg-label q-mb-xs">Your plots</div>
            <div class="row q-col-gutter-xs">
              <div v-for="kind in PLOT_KINDS" :key="kind" class="col-4">
                <q-input dense outlined type="number" :min="0" :max="99"
                         :label="PLOT_LABELS[kind]"
                         :model-value="market.plots[kind]"
                         @update:model-value="v => market.setPlot(kind, v as number | string | null)" />
              </div>
            </div>
          </q-card-section>
          <q-separator />

          <q-card-section class="q-py-sm">
            <div class="fg-label q-mb-xs">Plant on your {{ market.plots.field }} fields</div>
            <div v-if="!fieldRank[0]?.v" class="text-caption fg-muted">
              Needs prices — start with the crop prices in <b>Material Prices</b> above. A crop ranks once
              its own price is in (sell-raw value), and recipe sell prices sharpen it from there.
            </div>
            <div v-for="(row, i) in fieldRank" :key="row.m.id" class="row items-center q-py-xs"
                 :class="i === 0 && row.v ? 'fg-tint-gold rounded-borders q-px-sm' : 'q-px-sm'">
              <div class="col">
                <span class="text-weight-bold fg-ink">{{ row.m.label }}</span>
                <span v-if="i === 0 && row.v" class="fg-gold-badge q-ml-sm" style="font-size: 9px">plant this</span>
                <div class="text-caption fg-muted">
                  {{ row.m.growMinutes }} min grow<template v-if="row.v"> · {{ valueText(row.m, row.v) }}</template>
                </div>
              </div>
              <div class="col-auto text-right text-weight-bold" :class="row.v ? 'fg-green-text' : 'fg-muted'">
                {{ row.v ? fmtGold(overHours(row.v.perPlotHour)) + 'g' : '—' }}
                <div class="text-caption fg-muted" style="font-weight: 400">per plot · {{ perLabel }}</div>
              </div>
            </div>
          </q-card-section>
          <q-separator />

          <q-card-section class="q-py-sm">
            <div class="fg-label q-mb-xs">Fixed plots</div>
            <div v-for="row in fixedRows" :key="row.m.id" class="row items-center q-py-xs q-px-sm">
              <div class="col">
                <span class="text-weight-bold fg-ink">{{ row.m.label }}</span>
                <span class="text-caption fg-muted q-ml-xs">×{{ market.plots[row.m.plot] }}</span>
                <div class="text-caption fg-muted">
                  {{ row.m.growMinutes }} min grow<template v-if="row.v"> · {{ valueText(row.m, row.v) }}</template>
                </div>
              </div>
              <div class="col-auto text-right text-weight-bold" :class="row.v ? 'fg-green-text' : 'fg-muted'">
                {{ row.v ? fmtGold(overHours(row.v.perPlotHour * (market.plots[row.m.plot] ?? 0))) + 'g' : '—' }}
                <div class="text-caption fg-muted" style="font-weight: 400">all {{ market.plots[row.m.plot] }} · {{ perLabel }}</div>
              </div>
            </div>
          </q-card-section>
          <q-separator />

          <q-card-section class="q-py-sm">
            <div v-if="farmPerHour.any" class="text-subtitle2 fg-ink">
              Whole farm ≈ <b class="fg-green-text">{{ fmtGold(overHours(farmPerHour.total)) }}g / active {{ perLabel }}</b>
              <span v-if="farmPerHour.missing" class="text-caption fg-muted"> (some plots unpriced)</span>
            </div>
            <div v-else class="text-caption fg-muted">
              Enter the crop prices in Material Prices above to see what an hour of farming is worth —
              or apply someone's share link to fill the whole sheet at once.
            </div>
            <div class="text-caption fg-muted q-mt-xs">
              Assumes ×1 yield, instant replanting, no Bounty (Bounty cuts grow time 80% — spend it on the
              longest timers). Craft with Commons: quality doesn't affect cauldron output.
            </div>
          </q-card-section>
        </q-card>

        <!-- Raw crops only -->
        <q-card flat class="fg-card q-mt-md">
          <div class="fg-bar">
            <q-icon name="eco" class="fg-bar-gold" size="18px" />
            <span class="fg-bar-title">Raw Crops Calculations</span>
            <HelpTip topic="rawCrops" light class="q-ml-xs" />
          </div>
          <q-card-section class="q-py-sm">
            <div class="row q-px-sm q-pb-xs">
              <div class="col"></div>
              <div class="col-auto text-right fg-label" style="width: 100px">1 hour</div>
              <div class="col-auto text-right fg-label" style="width: 112px">8 hours</div>
            </div>
            <div v-for="row in rawRows" :key="row.m.id" class="row items-start q-py-xs q-px-sm">
              <div class="col">
                <span class="text-weight-bold fg-ink">{{ row.m.label }}</span>
                <span v-if="row.m.plot !== 'field'" class="text-caption fg-muted q-ml-xs">×{{ row.plotCount }}</span>
                <div class="text-caption fg-muted">
                  {{ row.m.growMinutes }} min grow<template v-if="row.unitNet != null"> · nets {{ fmtGold(row.unitNet) }}g/unit</template>
                </div>
              </div>
              <div class="col-auto text-right" style="width: 100px">
                <div class="text-weight-bold" :class="row.perHour != null ? 'fg-green-text' : 'fg-muted'">
                  {{ row.perHour != null ? fmtGold(row.perHour) + 'g' : '—' }}
                </div>
                <div v-if="row.perHour != null && row.plotCount > 1" class="text-caption fg-muted">
                  all {{ row.plotCount }}: {{ fmtGold(row.perHour * row.plotCount) }}g
                </div>
              </div>
              <div class="col-auto text-right" style="width: 112px">
                <div class="text-weight-bold" :class="row.perHour != null ? 'fg-green-text' : 'fg-muted'">
                  {{ row.perHour != null ? fmtGold(row.perHour * 8) + 'g' : '—' }}
                </div>
                <div v-if="row.perHour != null && row.plotCount > 1" class="text-caption fg-muted">
                  all {{ row.plotCount }}: {{ fmtGold(row.perHour * 8 * row.plotCount) }}g
                </div>
              </div>
            </div>
            <div class="text-caption fg-muted q-mt-xs">
              Grow-and-sell-raw only — no crafting. Big number = ONE plot of that crop; the
              "all" line = every plot of its kind on this crop (field crops share the {{ market.plots.field }} fields).
            </div>
          </q-card-section>
        </q-card>
      </div>

      <!-- Cauldron tables -->
      <div class="col-12 col-lg-8">
        <q-card v-for="c in byCauldron" :key="c.cauldron.id" flat class="fg-card q-mb-md overflow-hidden">
          <div class="fg-bar">
            <q-icon :name="c.cauldron.icon" class="fg-bar-gold" size="18px" />
            <span class="fg-bar-title">Cauldron of {{ c.cauldron.label }}</span>
            <q-space />
            <span v-if="c.best" class="text-caption" style="opacity: 0.9">
              best: {{ c.best.recipe.label }} <b>{{ fmtProfit(c.best.profit) }}</b>
            </span>
          </div>
          <div style="overflow-x: auto">
            <q-markup-table flat dense class="market-table" style="background: transparent">
              <thead>
                <tr class="fg-label">
                  <th class="text-left">Recipe</th>
                  <th class="text-right">Sell price</th>
                  <th class="text-right">Materials</th>
                  <th class="text-right">Profit / craft</th>
                  <th class="text-right">Per min</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="row in c.rows" :key="row.recipe.id"
                    :class="c.best && row.recipe.id === c.best.recipe.id && row.profit! >= 0 ? 'fg-tint-gold' : ''">
                  <td>
                    <div class="text-weight-bold fg-ink">
                      {{ row.recipe.label }}
                      <q-badge v-if="row.recipe.barterGood" class="fg-gold-badge q-ml-xs" style="font-size: 9px">barter</q-badge>
                    </div>
                    <div class="text-caption fg-muted">
                      {{ ingredientText(row.recipe) }}
                      <span v-if="row.recipe.unlockKeys"> · unlock {{ row.recipe.unlockKeys }} keys</span>
                      · {{ row.recipe.minutes }} min
                    </div>
                  </td>
                  <td class="text-right" style="width: 130px">
                    <q-input dense outlined type="number" :min="0" suffix="g" placeholder="—"
                             :model-value="market.prices[row.recipe.id]"
                             @update:model-value="v => market.setPrice(row.recipe.id, v as number | string | null)" />
                  </td>
                  <td class="text-right fg-ink" style="width: 90px">
                    {{ row.cost != null ? fmtGold(row.cost) + 'g' : '—' }}
                  </td>
                  <td class="text-right text-weight-bold" :class="profitClass(row.profit)" style="width: 110px">
                    {{ fmtProfit(row.profit) }}
                  </td>
                  <td class="text-right text-caption" :class="profitClass(row.perMin)" style="width: 80px">
                    {{ row.perMin != null ? fmtProfit(Math.round(row.perMin)) : '—' }}
                  </td>
                </tr>
              </tbody>
            </q-markup-table>
          </div>
        </q-card>

        <div class="text-caption fg-muted q-mb-md">
          Assumes 1 item per craft. Production times are base — farm energy shortens them (1 energy = −1 min).
          Recipes tagged <span class="fg-gold-badge" style="font-size: 9px">barter</span> double as Seasonal Special
          Trade Goods: check the Iria barter list before dumping them on the AH.
        </div>
      </div>
    </div>
  </q-page>
</template>

<style scoped>
.market-table thead tr th {
  font-size: 11px;
  letter-spacing: 0.12em;
}
.market-table tbody td {
  border-color: var(--fg-card-border) !important;
}
</style>
