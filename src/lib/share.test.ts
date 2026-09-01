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
    expect(code).toMatch(/^2_4(_[\d.]*)+$/)
  })

  it('rejects codes with an unknown version or wrong slot count', () => {
    const good = encodePrices({ jasmine: 100 }, 4)
    expect(decodePrices('9' + good.slice(1))).toBeNull()
    expect(decodePrices(good + '_9')).toBeNull()
    expect(decodePrices('2_4_100')).toBeNull()
    expect(decodePrices('')).toBeNull()
  })

  it('still decodes v1 links against the pre-reorder material order', () => {
    // v1 slot 0 was jasmine and slot 1 blackberry (today jasmine sits third)
    const vals = Array(SLOTS).fill('')
    vals[0] = '111'
    vals[1] = '222'
    const decoded = decodePrices(['1', '4', ...vals].join('_'))
    expect(decoded).not.toBeNull()
    expect(decoded!.prices.jasmine).toBe(111)
    expect(decoded!.prices.blackberry).toBe(222)
  })

  it('rejects an out-of-range fee and nulls out garbage values', () => {
    const good = encodePrices({ jasmine: 100 }, 4)
    expect(decodePrices(good.replace(/^2_4_/, '2_400_'))).toBeNull()
    const tampered = good.replace('_100', '_abc')
    const decoded = decodePrices(tampered)
    expect(decoded).not.toBeNull()
    expect(decoded!.prices.jasmine).toBeNull()
  })
})
