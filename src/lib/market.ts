// Pure profit math for the Cauldron Market page. Prices live in the market store;
// a single PriceMap keys materials AND recipe outputs by id (ids never collide).
// null/undefined = price not entered yet — any missing price makes the result null
// rather than silently treating it as 0.

import { RECIPES, type CauldronRecipe, type FarmMaterial } from '../data/cauldron'

export type PriceMap = Record<string, number | null | undefined>

/** Total AH cost to buy one craft's ingredients. null if any input price is missing. */
export function craftCost(recipe: CauldronRecipe, prices: PriceMap): number | null {
  let total = 0
  for (const input of recipe.inputs) {
    const p = prices[input.materialId]
    if (p == null) return null
    total += p * input.qty
  }
  return total
}

/** What one sale actually pays out after the AH fee, rounded down. */
export function netSale(sellPrice: number, feePct: number): number {
  return Math.floor(sellPrice * (1 - feePct / 100))
}

/** Net gold per craft: sale after AH fee minus ingredient cost. null until all prices are in. */
export function craftProfit(recipe: CauldronRecipe, prices: PriceMap, feePct: number): number | null {
  const cost = craftCost(recipe, prices)
  const sell = prices[recipe.id]
  if (cost == null || sell == null) return null
  return netSale(sell, feePct) - cost
}

/** Sort comparator: highest profit first, rows with missing prices last. */
export function byProfitDesc(a: number | null, b: number | null): number {
  if (a == null && b == null) return 0
  if (a == null) return 1
  if (b == null) return -1
  return b - a
}

export interface MaterialValue {
  materialId: string
  value: number        // gold one unit realizes via its best use
  use: 'raw' | string  // 'raw' = sell on the AH; otherwise the winning recipe id
  perPlotHour: number  // value × 60 ÷ growMinutes — what one plot of it earns per active hour
}

/**
 * Best use of one unit of a material: sell it raw (nets the AH fee) or put it into
 * the recipe that realizes the most per unit consumed. A craft's per-unit value is
 * the net sale minus the OTHER ingredients at their AH prices, divided by how many
 * units of this material the recipe eats. Uses every price that IS entered; returns
 * null only when neither the raw price nor any using recipe is computable.
 */
export function materialBestUse(material: FarmMaterial, prices: PriceMap, feePct: number): MaterialValue | null {
  const raw = prices[material.id]
  let best: { value: number; use: 'raw' | string } | null =
    raw == null ? null : { value: netSale(raw, feePct), use: 'raw' }

  for (const recipe of RECIPES) {
    const qty = recipe.inputs.find(i => i.materialId === material.id)?.qty
    if (!qty) continue
    const sell = prices[recipe.id]
    if (sell == null) continue
    let othersCost = 0
    let computable = true
    for (const input of recipe.inputs) {
      if (input.materialId === material.id) continue
      const p = prices[input.materialId]
      if (p == null) { computable = false; break }
      othersCost += p * input.qty
    }
    if (!computable) continue
    const value = (netSale(sell, feePct) - othersCost) / qty
    if (!best || value > best.value) best = { value, use: recipe.id }
  }

  if (!best) return null
  return {
    materialId: material.id,
    value: best.value,
    use: best.use,
    perPlotHour: best.value * 60 / material.growMinutes
  }
}
