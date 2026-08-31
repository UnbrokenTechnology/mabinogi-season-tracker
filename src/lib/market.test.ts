import { describe, it, expect } from 'vitest'
import { FARM_MATERIALS, CAULDRONS, RECIPES } from '../data/cauldron'
import { craftCost, craftProfit, netSale, byProfitDesc, materialBestUse, type PriceMap } from './market'

const material = (id: string) => FARM_MATERIALS.find(m => m.id === id)!

const juice = RECIPES.find(r => r.id === 'blackberry-juice')!

describe('cauldron data integrity', () => {
  it('has 4 cauldrons with 5 recipes each', () => {
    expect(CAULDRONS).toHaveLength(4)
    for (const c of CAULDRONS) {
      expect(RECIPES.filter(r => r.cauldron === c.id)).toHaveLength(5)
    }
  })

  it('unlock keys per cauldron sum to 40 (matches 40-keys-per-cauldron, 160 total)', () => {
    for (const c of CAULDRONS) {
      const sum = RECIPES.filter(r => r.cauldron === c.id).reduce((s, r) => s + r.unlockKeys, 0)
      expect(sum).toBe(40)
    }
  })

  it('every recipe input references a known farm material', () => {
    const ids = new Set(FARM_MATERIALS.map(m => m.id))
    for (const r of RECIPES) {
      expect(r.inputs.length).toBeGreaterThan(0)
      for (const input of r.inputs) {
        expect(ids.has(input.materialId), `${r.id} → ${input.materialId}`).toBe(true)
        expect(input.qty).toBeGreaterThan(0)
      }
    }
  })

  it('material and recipe ids never collide (they share one price map)', () => {
    const all = [...FARM_MATERIALS.map(m => m.id), ...RECIPES.map(r => r.id)]
    expect(new Set(all).size).toBe(all.length)
  })
})

describe('craftCost', () => {
  it('sums input prices times quantities', () => {
    const prices: PriceMap = { jasmine: 1000, blackberry: 500 }
    expect(craftCost(juice, prices)).toBe(1500)
  })

  it('respects qty > 1 inputs', () => {
    const perfume = RECIPES.find(r => r.id === 'jasmine-perfume')!  // okra 1, blackberry 1, jasmine 2
    const prices: PriceMap = { okra: 100, blackberry: 200, jasmine: 300 }
    expect(craftCost(perfume, prices)).toBe(100 + 200 + 600)
  })

  it('returns null when any input price is missing', () => {
    expect(craftCost(juice, { jasmine: 1000 })).toBeNull()
    expect(craftCost(juice, {})).toBeNull()
  })

  it('treats an entered 0 as a real price, not missing', () => {
    expect(craftCost(juice, { jasmine: 0, blackberry: 0 })).toBe(0)
  })
})

describe('craftProfit', () => {
  const prices: PriceMap = { jasmine: 1000, blackberry: 500, 'blackberry-juice': 10000 }

  it('nets the 4% AH fee off the sale before subtracting costs', () => {
    // 10000 * 0.96 = 9600, minus 1500 cost
    expect(craftProfit(juice, prices, 4)).toBe(8100)
  })

  it('rounds the net sale down to whole gold', () => {
    expect(netSale(999, 4)).toBe(959) // 959.04 → 959
    expect(netSale(101, 4)).toBe(96)  // 96.96 → 96
  })

  it('returns null when the sell price or any input price is missing', () => {
    expect(craftProfit(juice, { jasmine: 1000, blackberry: 500 }, 4)).toBeNull()
    expect(craftProfit(juice, { 'blackberry-juice': 10000, jasmine: 1000 }, 4)).toBeNull()
  })

  it('can go negative when materials cost more than the net sale', () => {
    expect(craftProfit(juice, { jasmine: 6000, blackberry: 5000, 'blackberry-juice': 10000 }, 4)).toBe(-1400)
  })
})

describe('materialBestUse', () => {
  it('picks the recipe when crafting realizes more per unit than selling raw', () => {
    // blackberry-juice: jasmine 1 + blackberry 1. Per blackberry: 10000×0.96 − 1000 = 8600 vs raw 480.
    const prices: PriceMap = { blackberry: 500, jasmine: 1000, 'blackberry-juice': 10000 }
    const v = materialBestUse(material('blackberry'), prices, 4)!
    expect(v.use).toBe('blackberry-juice')
    expect(v.value).toBe(8600)
    expect(v.perPlotHour).toBeCloseTo(8600 * 60 / 12) // 12-minute grow time
  })

  it('falls back to selling raw when every craft is worth less', () => {
    const prices: PriceMap = { blackberry: 500, jasmine: 1000, 'blackberry-juice': 1000 }
    const v = materialBestUse(material('blackberry'), prices, 4)!
    expect(v.use).toBe('raw')
    expect(v.value).toBe(480) // 500 × 0.96
  })

  it('divides a recipe\'s residual value across the units it consumes', () => {
    // jasmine-perfume: okra 1 + blackberry 1 + jasmine 2. Per jasmine: (9600 − 200) / 2.
    const prices: PriceMap = { okra: 100, blackberry: 100, 'jasmine-perfume': 10000 }
    const v = materialBestUse(material('jasmine'), prices, 4)!
    expect(v.use).toBe('jasmine-perfume')
    expect(v.value).toBe(4700)
  })

  it('works without the material\'s own raw price and returns null with no data at all', () => {
    const prices: PriceMap = { okra: 100, blackberry: 100, 'jasmine-perfume': 10000 }
    expect(materialBestUse(material('jasmine'), prices, 4)).not.toBeNull()
    expect(materialBestUse(material('jasmine'), {}, 4)).toBeNull()
  })

  it('skips recipes whose other ingredients are unpriced', () => {
    // Juice needs jasmine's price to value blackberry through it; without it only raw works.
    const prices: PriceMap = { blackberry: 500, 'blackberry-juice': 10000 }
    const v = materialBestUse(material('blackberry'), prices, 4)!
    expect(v.use).toBe('raw')
  })
})

describe('byProfitDesc', () => {
  it('sorts highest first with nulls (missing prices) at the end', () => {
    const sorted = [null, 500, -200, null, 9000].sort(byProfitDesc)
    expect(sorted).toEqual([9000, 500, -200, null, null])
  })
})
