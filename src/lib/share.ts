// Price-sheet share links. Prices are encoded positionally against the canonical
// id order in cauldron.ts (7 materials then 20 recipes), so the payload is a short
// underscore-joined string instead of JSON: "<version>_<feePct>_<27 values>",
// empty slot = price not entered. A length or version mismatch (e.g. a link from
// an older build after recipes change) decodes to null rather than half-applying.

import { FARM_MATERIALS, RECIPES } from '../data/cauldron'
import type { PriceMap } from './market'

const IDS = [...FARM_MATERIALS.map(m => m.id), ...RECIPES.map(r => r.id)]
const VERSION = '1'

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
  if (parts.length !== IDS.length + 2 || parts[0] !== VERSION) return null
  const feePct = Number(parts[1])
  if (Number.isNaN(feePct) || feePct < 0 || feePct > 100) return null
  const prices: Record<string, number | null> = {}
  IDS.forEach((id, i) => {
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
