// Optimal self-grown production plan for the Taillteann Farm: given AH prices and
// how many plots of each kind the farm has, find the field-crop split, craft rates,
// and raw sales that maximize gold per active hour. Continuous-rate model — a plot
// of material m yields 60/growMinutes units/hr, each cauldron has 60 busy-minutes
// per hour, surplus materials sell raw (or are discarded if unpriced).
//
// Solved as a small LP per candidate field allocation: the three field crops share
// plots (enumerated on a grid), everything else is linear in the craft rates x_r,
// so a primal simplex over material-balance + cauldron-capacity rows finds the rest.

import { FARM_MATERIALS, RECIPES, type CauldronId, type CauldronRecipe, type PlotKind } from '../data/cauldron'
import { netSale, type PriceMap } from './market'

export interface RatioPlanInput {
  prices: PriceMap
  feePct: number
  plots: Record<PlotKind, number>
}

export interface RatioPlan {
  fieldAlloc: { materialId: string; fields: number }[]   // only entries > 0; fields may be fractional (time-sharing)
  crafts: { recipeId: string; perHour: number }[]        // only rates > 1e-9
  rawSales: { materialId: string; perHour: number }[]    // surplus sold raw — only priced materials with surplus
  goldPerHour: number            // total plan revenue per active hour
  rawOnlyGoldPerHour: number     // baseline: no crafting, all fields on the single best raw crop
  cauldronMinutes: Record<CauldronId, number>            // busy minutes per hour, 0..60
}

const EPS = 1e-9
const CAULDRON_IDS: CauldronId[] = ['abundance', 'brilliance', 'delicacy', 'tenderness']

interface LpRow {
  coeffs: number[]
  rhs: number    // always ≥ 0, so the slack basis is feasible
}

/**
 * Primal simplex for: maximize gains·x, rows.coeffs·x ≤ rows.rhs, x ≥ 0.
 * Dantzig entering rule, switching to Bland's rule after 200 iterations to
 * break any cycling; hard cap 1000 iterations.
 */
function solveSimplex(gains: number[], rows: LpRow[]): { x: number[]; objective: number } {
  const n = gains.length
  const m = rows.length
  if (n === 0 || m === 0) return { x: new Array(n).fill(0), objective: 0 }

  const width = n + m + 1  // x columns, slack columns, RHS
  const t: number[][] = rows.map((row, i) => {
    const r = new Array(width).fill(0)
    for (let j = 0; j < n; j++) r[j] = row.coeffs[j]
    r[n + i] = 1
    r[width - 1] = row.rhs
    return r
  })
  const obj: number[] = new Array(width).fill(0)
  for (let j = 0; j < n; j++) obj[j] = -gains[j]
  const basis = rows.map((_, i) => n + i)

  for (let iter = 0; iter < 1000; iter++) {
    // Entering column: most negative reduced cost (Dantzig), Bland after 200.
    let col = -1
    if (iter < 200) {
      let best = -EPS
      for (let j = 0; j < n + m; j++) if (obj[j] < best) { best = obj[j]; col = j }
    } else {
      for (let j = 0; j < n + m; j++) if (obj[j] < -EPS) { col = j; break }
    }
    if (col === -1) break  // optimal

    // Leaving row: minimum ratio, ties to the smallest basis index (Bland-safe).
    let row = -1
    let bestRatio = Infinity
    for (let i = 0; i < m; i++) {
      if (t[i][col] <= EPS) continue
      const ratio = t[i][width - 1] / t[i][col]
      if (row === -1 || ratio < bestRatio - EPS) {
        row = i
        bestRatio = ratio
      } else if (ratio < bestRatio + EPS && basis[i] < basis[row]) {
        row = i
        bestRatio = Math.min(bestRatio, ratio)
      }
    }
    if (row === -1) break  // unbounded — impossible here (every craft spends cauldron minutes)

    // Pivot.
    const pivot = t[row][col]
    for (let j = 0; j < width; j++) t[row][j] /= pivot
    for (let i = 0; i < m; i++) {
      if (i === row) continue
      const f = t[i][col]
      if (Math.abs(f) < EPS) continue
      for (let j = 0; j < width; j++) t[i][j] -= f * t[row][j]
    }
    const f = obj[col]
    if (Math.abs(f) > 0) {
      for (let j = 0; j < width; j++) obj[j] -= f * t[row][j]
    }
    basis[row] = col
  }

  const x = new Array(n).fill(0)
  for (let i = 0; i < m; i++) {
    if (basis[i] < n) x[basis[i]] = t[i][width - 1]
  }
  return { x, objective: obj[width - 1] }
}

interface Candidate {
  recipe: CauldronRecipe
  gain: number  // net sale minus inputs valued at their raw net (0 if unpriced)
}

export function computeRatioPlan(input: RatioPlanInput): RatioPlan | null {
  const { prices, feePct, plots } = input

  // Raw net value per unit for every material (0 when unpriced — surplus is discarded).
  const rawNet: Record<string, number> = {}
  const hasRawPrice: Record<string, boolean> = {}
  let anythingPriced = false
  for (const m of FARM_MATERIALS) {
    const p = prices[m.id]
    hasRawPrice[m.id] = p != null
    rawNet[m.id] = p == null ? 0 : netSale(p, feePct)
    if (p != null) anythingPriced = true
  }

  // Candidate recipes: sell price entered, and a positive gain over selling the
  // inputs raw — a gain ≤ 0 recipe is never crafted in an optimum of this LP.
  const candidates: Candidate[] = []
  for (const r of RECIPES) {
    const sell = prices[r.id]
    if (sell == null) continue
    anythingPriced = true
    let gain = netSale(sell, feePct)
    for (const inp of r.inputs) gain -= inp.qty * rawNet[inp.materialId]
    if (gain > EPS) candidates.push({ recipe: r, gain })
  }

  if (!anythingPriced) return null

  const fieldCrops = FARM_MATERIALS.filter(m => m.plot === 'field')
  const fixedMats = FARM_MATERIALS.filter(m => m.plot !== 'field')
  const fieldCount = plots.field ?? 0

  // Fixed-plot supply never varies across allocations.
  const fixedSupply: Record<string, number> = {}
  for (const m of fixedMats) fixedSupply[m.id] = (plots[m.plot] ?? 0) * 60 / m.growMinutes

  const supplyFor = (alloc: number[]): Record<string, number> => {
    const s: Record<string, number> = { ...fixedSupply }
    fieldCrops.forEach((m, i) => { s[m.id] = alloc[i] * 60 / m.growMinutes })
    return s
  }

  // LP over craft rates for one allocation's supplies.
  const usedMaterials = new Set<string>()
  for (const c of candidates) for (const inp of c.recipe.inputs) usedMaterials.add(inp.materialId)
  const solveAllocation = (supply: Record<string, number>) => {
    const rows: LpRow[] = []
    for (const id of usedMaterials) {
      rows.push({
        coeffs: candidates.map(c => c.recipe.inputs.find(i => i.materialId === id)?.qty ?? 0),
        rhs: supply[id]
      })
    }
    for (const cid of CAULDRON_IDS) {
      if (!candidates.some(c => c.recipe.cauldron === cid)) continue
      rows.push({
        coeffs: candidates.map(c => c.recipe.cauldron === cid ? c.recipe.minutes : 0),
        rhs: 60
      })
    }
    return solveSimplex(candidates.map(c => c.gain), rows)
  }

  // Enumerate field allocations on a 0.5-field grid (coarser above 6 fields to cap combos).
  const allocations: number[][] = []
  if (fieldCount <= 0) {
    allocations.push(fieldCrops.map(() => 0))
  } else {
    const steps = fieldCount > 6 ? 12 : Math.max(1, Math.round(fieldCount / 0.5))
    const g = fieldCount / steps
    for (let i = 0; i <= steps; i++) {
      for (let k = 0; i + k <= steps; k++) {
        allocations.push([i * g, k * g, (steps - i - k) * g])
      }
    }
  }

  let best: { alloc: number[]; supply: Record<string, number>; x: number[]; total: number } | null = null
  for (const alloc of allocations) {
    const supply = supplyFor(alloc)
    // Baseline = everything sold raw; the LP objective adds each craft's gain over that.
    let baseline = 0
    for (const m of FARM_MATERIALS) baseline += supply[m.id] * rawNet[m.id]
    const lp = solveAllocation(supply)
    const total = baseline + lp.objective
    if (!best || total > best.total + EPS) best = { alloc, supply, x: lp.x, total }
  }
  const winner = best!  // allocations is never empty

  // Comparison baseline: no crafting, all fields on the single best raw field crop.
  let rawOnlyGoldPerHour = 0
  for (const m of fixedMats) rawOnlyGoldPerHour += fixedSupply[m.id] * rawNet[m.id]
  let bestFieldRate = 0
  for (const m of fieldCrops) bestFieldRate = Math.max(bestFieldRate, rawNet[m.id] * 60 / m.growMinutes)
  rawOnlyGoldPerHour += fieldCount * bestFieldRate

  // Assemble the plan from the winning allocation.
  const crafts: { recipeId: string; perHour: number }[] = []
  const cauldronMinutes: Record<CauldronId, number> = { abundance: 0, brilliance: 0, delicacy: 0, tenderness: 0 }
  const usage: Record<string, number> = {}
  winner.x.forEach((rate, i) => {
    if (rate <= EPS) return
    const r = candidates[i].recipe
    crafts.push({ recipeId: r.id, perHour: rate })
    cauldronMinutes[r.cauldron] += rate * r.minutes
    for (const inp of r.inputs) usage[inp.materialId] = (usage[inp.materialId] ?? 0) + rate * inp.qty
  })

  const rawSales: { materialId: string; perHour: number }[] = []
  for (const m of FARM_MATERIALS) {
    if (!hasRawPrice[m.id]) continue
    const surplus = winner.supply[m.id] - (usage[m.id] ?? 0)
    if (surplus > EPS) rawSales.push({ materialId: m.id, perHour: surplus })
  }

  const fieldAlloc = fieldCrops
    .map((m, i) => ({ materialId: m.id, fields: winner.alloc[i] }))
    .filter(e => e.fields > 0)

  return {
    fieldAlloc,
    crafts,
    rawSales,
    goldPerHour: winner.total,
    rawOnlyGoldPerHour,
    cauldronMinutes
  }
}
