// Price-sheet share links. Prices are encoded positionally against the canonical
// id order in cauldron.ts (7 materials then 20 recipes), so the payload is a short
// underscore-joined string instead of JSON: "<version>_<feePct>_<27 values>",
// empty slot = price not entered. A length or version mismatch (e.g. a link from
// an older build after recipes change) decodes to null rather than half-applying.

import { FARM_MATERIALS, RECIPES } from '../data/cauldron'
import type { PriceMap } from './market'

const IDS = [...FARM_MATERIALS.map(m => m.id), ...RECIPES.map(r => r.id)]
const VERSION = '2'

// v1 links were minted before FARM_MATERIALS was reordered to match the farm layout;
// they still decode against this frozen copy of the original material order.
const V1_MATERIAL_IDS = ['jasmine', 'blackberry', 'red-pear', 'okra', 'quartz', 'rubber', 'magic-cobweb']
const V1_IDS = [...V1_MATERIAL_IDS, ...RECIPES.map(r => r.id)]
const IDS_BY_VERSION: Record<string, string[]> = { '1': V1_IDS, [VERSION]: IDS }

export function encodePrices(prices: PriceMap, feePct: number): string {
  const vals = IDS.map(id => {
    const p = prices[id]
    return p == null ? '' : String(p)
  })
  return [VERSION, String(feePct), ...vals].join('_')
}

export interface SharedPrices {
  prices: Record<string, number | null>
  feePct: number
}

export function decodePrices(code: string): SharedPrices | null {
  const parts = code.split('_')
  const ids = IDS_BY_VERSION[parts[0]]
  if (!ids || parts.length !== ids.length + 2) return null
  const feePct = Number(parts[1])
  if (Number.isNaN(feePct) || feePct < 0 || feePct > 100) return null
  const prices: Record<string, number | null> = {}
  ids.forEach((id, i) => {
    const raw = parts[i + 2]
    if (raw === '') {
      prices[id] = null
      return
    }
    const n = Number(raw)
    prices[id] = Number.isNaN(n) || n < 0 ? null : n
  })
  return { prices, feePct }
}

export function sharedPriceCount(shared: SharedPrices): number {
  return Object.values(shared.prices).filter(v => v != null).length
}
