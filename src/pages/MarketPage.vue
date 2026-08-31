<script setup lang="ts">
import { computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuasar, copyToClipboard } from 'quasar'
import { FARM_MATERIALS, CAULDRONS, RECIPES, type CauldronRecipe } from '../data/cauldron'
import { craftCost, craftProfit, byProfitDesc } from '../lib/market'
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
              <q-btn flat dense size="sm" color="negative" icon="backspace" label="Clear all"
                     :disable="pricedCount === 0" @click="market.clearPrices()" />
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
