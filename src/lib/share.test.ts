import { describe, it, expect } from 'vitest'
import { FARM_MATERIALS, RECIPES } from '../data/cauldron'
import { encodePrices, decodePrices, sharedPriceCount } from './share'

const SLOTS = FARM_MATERIALS.length + RECIPES.length

describe('price share codes', () => {
  it('round-trips entered prices, blanks, and a decimal fee', () => {
    const prices = { jasmine: 1000, blackberry: 500, 'blackberry-juice': 10000 }
    const decoded = decodePrices(encodePrices(prices, 4.5))
    expect(decoded).not.toBeNull()
    expect(decoded!.feePct).toBe(4.5)
    expect(decoded!.prices.jasmine).toBe(1000)
    expect(decoded!.prices.blackberry).toBe(500)
    expect(decoded!.prices['blackberry-juice']).toBe(10000)
    expect(decoded!.prices['red-pear']).toBeNull()
    expect(sharedPriceCount(decoded!)).toBe(3)
  })

  it('encodes to a URL-safe underscore string with one slot per item', () => {
    const code = encodePrices({}, 4)
    expect(code.split('_')).toHaveLength(SLOTS + 2)
    expect(code).toMatch(/^1_4(_[\d.]*)+$/)
  })

  it('rejects codes with the wrong version or slot count', () => {
    const good = encodePrices({ jasmine: 100 }, 4)
    expect(decodePrices('2' + good.slice(1))).toBeNull()
    expect(decodePrices(good + '_9')).toBeNull()
    expect(decodePrices('1_4_100')).toBeNull()
    expect(decodePrices('')).toBeNull()
  })

  it('rejects an out-of-range fee and nulls out garbage values', () => {
    const good = encodePrices({ jasmine: 100 }, 4)
    expect(decodePrices(good.replace(/^1_4_/, '1_400_'))).toBeNull()
    const tampered = good.replace('_100_', '_abc_')
    const decoded = decodePrices(tampered)
    expect(decoded).not.toBeNull()
    expect(decoded!.prices.jasmine).toBeNull()
  })
})
