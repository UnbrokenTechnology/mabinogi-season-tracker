import { describe, it, expect } from 'vitest'
import { FARM_MATERIALS, RECIPES, type PlotKind } from '../data/cauldron'
import { netSale } from './market'
import { computeRatioPlan, type RatioPlan } from './ratioPlan'

const material = (id: string) => FARM_MATERIALS.find(m => m.id === id)!

const noPlots: Record<PlotKind, number> = {
  field: 0, 'red-pear-tree': 0, 'rubber-tree': 0, 'quartz-vein': 0, 'cobweb-stump': 0
}

/** Recompute supplies from the plan and assert crafts + raw sales never exceed them. */
function expectMaterialBalance(plan: RatioPlan, plots: Record<PlotKind, number>) {
  const supply: Record<string, number> = {}
  for (const m of FARM_MATERIALS) {
    supply[m.id] = m.plot === 'field' ? 0 : plots[m.plot] * 60 / m.growMinutes
  }
  for (const a of plan.fieldAlloc) {
    supply[a.materialId] += a.fields * 60 / material(a.materialId).growMinutes
  }
  const used: Record<string, number> = {}
  for (const c of plan.crafts) {
    const recipe = RECIPES.find(r => r.id === c.recipeId)!
    for (const input of recipe.inputs) {
      used[input.materialId] = (used[input.materialId] ?? 0) + c.perHour * input.qty
    }
  }
  for (const s of plan.rawSales) {
    used[s.materialId] = (used[s.materialId] ?? 0) + s.perHour
  }
  for (const m of FARM_MATERIALS) {
    expect(used[m.id] ?? 0, `${m.id} over-consumed`).toBeLessThanOrEqual(supply[m.id] + 1e-6)
  }
}

describe('computeRatioPlan', () => {
  it('returns null when nothing is priced', () => {
    const plots = { ...noPlots, field: 6, 'quartz-vein': 2 }
    expect(computeRatioPlan({ prices: {}, feePct: 4, plots })).toBeNull()
    expect(computeRatioPlan({ prices: { jasmine: null, 'dawn-bow': undefined }, feePct: 4, plots })).toBeNull()
  })

  it('raw-only prices: no crafts, all fields on blackberry, matches the hand-computed rate', () => {
    const plots: Record<PlotKind, number> = {
      field: 6, 'red-pear-tree': 2, 'rubber-tree': 2, 'quartz-vein': 2, 'cobweb-stump': 2
    }
    const prices = {
      jasmine: 1000, blackberry: 1000, 'red-pear': 1000, okra: 1000,
      quartz: 1000, rubber: 1000, 'magic-cobweb': 1000
    }
    const plan = computeRatioPlan({ prices, feePct: 4, plots })!

    expect(plan.crafts).toEqual([])
    // Blackberry is the fastest field crop (12 min) and prices are equal → all 6 fields on it.
    expect(plan.fieldAlloc).toEqual([{ materialId: 'blackberry', fields: 6 }])

    // netSale(1000, 4) = 960 per unit; fixed plots pump out 60/growMinutes each.
    const net = netSale(1000, 4)
    expect(net).toBe(960)
    const fixedIncome = net * (2 * 60 / 21.5 + 2 * 60 / 18 + 2 * 60 / 24 + 2 * 60 / 16.5)
    const expected = fixedIncome + 6 * net * 60 / 12
    expect(plan.goldPerHour).toBeCloseTo(expected, 6)
    expect(plan.rawOnlyGoldPerHour).toBeCloseTo(expected, 6)
    expect(plan.goldPerHour).toBeCloseTo(plan.rawOnlyGoldPerHour, 9)

    for (const minutes of Object.values(plan.cauldronMinutes)) expect(minutes).toBe(0)
    expectMaterialBalance(plan, plots)
  })

  it('craft-dominant: balances jasmine vs blackberry fields to feed blackberry juice', () => {
    const plots = { ...noPlots, field: 6 }
    // Juice nets 96000/craft vs 96/unit raw — crafting dominates; okra is worthless here.
    const prices = { jasmine: 100, blackberry: 100, 'blackberry-juice': 100000 }
    const plan = computeRatioPlan({ prices, feePct: 4, plots })!

    expect(plan.crafts).toHaveLength(1)
    const juice = plan.crafts[0]
    expect(juice.recipeId).toBe('blackberry-juice')

    const aJ = plan.fieldAlloc.find(a => a.materialId === 'jasmine')!
    const aB = plan.fieldAlloc.find(a => a.materialId === 'blackberry')!
    // Jasmine grows 31.5 min vs blackberry's 12, so the min-maximizing split gives jasmine more fields.
    expect(aJ.fields).toBeGreaterThan(aB.fields)

    const jasmineSupply = aJ.fields * 60 / 31.5
    const blackberrySupply = aB.fields * 60 / 12
    // Juice rate is capped by the slower supply chain (1 of each per craft).
    expect(juice.perHour).toBeCloseTo(Math.min(jasmineSupply, blackberrySupply), 6)
    // A balanced split beats naive ones: even 3/3 fields caps juice at 5.71/hr.
    expect(juice.perHour).toBeGreaterThan(7)

    expect(plan.cauldronMinutes.abundance).toBeCloseTo(juice.perHour * 1, 9)
    expect(plan.cauldronMinutes.abundance).toBeLessThanOrEqual(60 + 1e-9)
    expectMaterialBalance(plan, plots)
  })

  it('cauldron capacity caps a hugely profitable 5-minute craft at 12/hr', () => {
    // Dawn Bow (delicacy, 5 min): quartz 1 + okra 1 + red-pear 2. Plots sized so every
    // material comfortably exceeds the 12/hr the 60-minute cauldron hour allows.
    const plots = { ...noPlots, field: 6, 'quartz-vein': 4, 'red-pear-tree': 10 }
    const prices = { 'dawn-bow': 1000000 }
    const plan = computeRatioPlan({ prices, feePct: 4, plots })!

    const bow = plan.crafts.find(c => c.recipeId === 'dawn-bow')!
    expect(bow.perHour).toBeCloseTo(12, 6)
    expect(plan.cauldronMinutes.delicacy).toBeCloseTo(60, 6)
    expect(plan.goldPerHour).toBeCloseTo(12 * netSale(1000000, 4), 3)
    // Nothing sells raw (no material prices), and no crafting means no raw baseline either.
    expect(plan.rawSales).toEqual([])
    expect(plan.rawOnlyGoldPerHour).toBe(0)
    expectMaterialBalance(plan, plots)
  })

  it('never consumes or sells more of a material than the plan grows (mixed scenario)', () => {
    const plots: Record<PlotKind, number> = {
      field: 6, 'red-pear-tree': 2, 'rubber-tree': 2, 'quartz-vein': 2, 'cobweb-stump': 2
    }
    const prices = {
      jasmine: 800, blackberry: 300, 'red-pear': 600, okra: 400,
      quartz: 900, rubber: 500, 'magic-cobweb': 700,
      'blackberry-juice': 5000, 'red-moon-earrings': 8000, 'power-glue': 4000,
      'purple-fabric': 6000, 'starry-salad': 20000, 'evening-dress': 15000
    }
    const plan = computeRatioPlan({ prices, feePct: 4, plots })!

    expectMaterialBalance(plan, plots)
    expect(plan.fieldAlloc.reduce((s, a) => s + a.fields, 0)).toBeCloseTo(6, 9)
    for (const minutes of Object.values(plan.cauldronMinutes)) {
      expect(minutes).toBeLessThanOrEqual(60 + 1e-6)
    }
    // Crafting is available and profitable, so the plan must beat the raw-only baseline.
    expect(plan.goldPerHour).toBeGreaterThanOrEqual(plan.rawOnlyGoldPerHour - 1e-6)
  })
})
