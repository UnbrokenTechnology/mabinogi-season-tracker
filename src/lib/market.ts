// Pure profit math for the Cauldron Market page. Prices live in the market store;
// a single PriceMap keys materials AND recipe outputs by id (ids never collide).
// null/undefined = price not entered yet — any missing price makes the result null
// rather than silently treating it as 0.

import type { CauldronRecipe } from '../data/cauldron'

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
