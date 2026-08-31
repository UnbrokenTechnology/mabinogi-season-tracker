// Taillteann Farm Magic Cauldron production data — the 7 farm materials and all
// 20 craftable items across the 4 cauldrons.
//
// Source: Mabinogi World Wiki "Magic Cauldron (Taillteann Farm) List" + each item's
// Data template (raw wikitext, fetched Aug 30 2026). Cross-check: unlock keys per
// cauldron sum to 0+5+8+12+15 = 40, matching the known 40-keys-per-cauldron figure.

export interface FarmMaterial {
  id: string
  label: string
}

export const FARM_MATERIALS: FarmMaterial[] = [
  { id: 'jasmine', label: 'Jasmine' },
  { id: 'blackberry', label: 'Blackberry' },
  { id: 'red-pear', label: 'Red Pear' },
  { id: 'okra', label: 'Okra' },
  { id: 'quartz', label: 'Quartz' },
  { id: 'rubber', label: 'Rubber' },
  { id: 'magic-cobweb', label: 'Magic Cobweb' }
]

export type CauldronId = 'abundance' | 'brilliance' | 'delicacy' | 'tenderness'

export interface CauldronInfo {
  id: CauldronId
  label: string
  icon: string
}

export const CAULDRONS: CauldronInfo[] = [
  { id: 'abundance', label: 'Abundance', icon: 'restaurant' },
  { id: 'brilliance', label: 'Brilliance', icon: 'diamond' },
  { id: 'delicacy', label: 'Delicacy', icon: 'construction' },
  { id: 'tenderness', label: 'Tenderness', icon: 'checkroom' }
]

export interface RecipeInput {
  materialId: string
  qty: number
}

export interface CauldronRecipe {
  id: string
  label: string
  cauldron: CauldronId
  unlockKeys: number      // keys to unlock in the crafting menu; 0 = open from the start
  minutes: number         // base production time; farm energy shortens it (1 energy = −1 min)
  inputs: RecipeInput[]
  barterGood: boolean     // also usable as a Seasonal Special Trade Good (Iria barter)
}

export const RECIPES: CauldronRecipe[] = [
  // ---- Magic Cauldron of Abundance ----
  { id: 'blackberry-juice', label: 'Blackberry Juice', cauldron: 'abundance', unlockKeys: 0, minutes: 1, barterGood: false,
    inputs: [{ materialId: 'jasmine', qty: 1 }, { materialId: 'blackberry', qty: 1 }] },
  { id: 'sweet-cake', label: 'Sweet Cake', cauldron: 'abundance', unlockKeys: 5, minutes: 2, barterGood: false,
    inputs: [{ materialId: 'blackberry', qty: 1 }, { materialId: 'red-pear', qty: 1 }] },
  { id: 'red-pear-jam', label: 'Red Pear Jam', cauldron: 'abundance', unlockKeys: 8, minutes: 3, barterGood: true,
    inputs: [{ materialId: 'okra', qty: 1 }, { materialId: 'red-pear', qty: 1 }] },
  { id: 'starry-salad', label: 'Starry Salad', cauldron: 'abundance', unlockKeys: 12, minutes: 4, barterGood: true,
    inputs: [{ materialId: 'red-pear', qty: 1 }, { materialId: 'blackberry', qty: 1 }, { materialId: 'okra', qty: 2 }] },
  { id: 'jasmine-perfume', label: 'Jasmine Perfume', cauldron: 'abundance', unlockKeys: 15, minutes: 5, barterGood: false,
    inputs: [{ materialId: 'okra', qty: 1 }, { materialId: 'blackberry', qty: 1 }, { materialId: 'jasmine', qty: 2 }] },

  // ---- Magic Cauldron of Brilliance ----
  { id: 'red-moon-earrings', label: 'Red Moon Earrings', cauldron: 'brilliance', unlockKeys: 0, minutes: 1, barterGood: true,
    inputs: [{ materialId: 'quartz', qty: 1 }, { materialId: 'red-pear', qty: 1 }] },
  { id: 'pure-blossom-hairpin', label: 'Pure Blossom Hairpin', cauldron: 'brilliance', unlockKeys: 5, minutes: 2, barterGood: false,
    inputs: [{ materialId: 'quartz', qty: 1 }, { materialId: 'jasmine', qty: 1 }] },
  { id: 'quartz-powder', label: 'Quartz Powder', cauldron: 'brilliance', unlockKeys: 8, minutes: 3, barterGood: false,
    inputs: [{ materialId: 'magic-cobweb', qty: 1 }, { materialId: 'quartz', qty: 1 }] },
  { id: 'midnight-pearl-paint', label: 'Midnight Pearl Paint', cauldron: 'brilliance', unlockKeys: 12, minutes: 4, barterGood: false,
    inputs: [{ materialId: 'blackberry', qty: 1 }, { materialId: 'rubber', qty: 1 }, { materialId: 'quartz', qty: 2 }] },
  { id: 'decorative-crystal-sword', label: 'Decorative Crystal Sword', cauldron: 'brilliance', unlockKeys: 15, minutes: 5, barterGood: false,
    inputs: [{ materialId: 'rubber', qty: 1 }, { materialId: 'okra', qty: 1 }, { materialId: 'quartz', qty: 2 }] },

  // ---- Magic Cauldron of Delicacy ----
  { id: 'power-glue', label: 'Power Glue', cauldron: 'delicacy', unlockKeys: 0, minutes: 1, barterGood: false,
    inputs: [{ materialId: 'rubber', qty: 1 }, { materialId: 'magic-cobweb', qty: 1 }] },
  { id: 'natural-rubber', label: 'Natural Rubber', cauldron: 'delicacy', unlockKeys: 5, minutes: 2, barterGood: false,
    inputs: [{ materialId: 'okra', qty: 1 }, { materialId: 'rubber', qty: 1 }] },
  { id: 'pressed-flower-craft-box', label: 'Pressed Flower Craft Box', cauldron: 'delicacy', unlockKeys: 8, minutes: 3, barterGood: false,
    inputs: [{ materialId: 'jasmine', qty: 1 }, { materialId: 'rubber', qty: 1 }] },
  { id: 'twilight-lute', label: 'Twilight Lute', cauldron: 'delicacy', unlockKeys: 12, minutes: 4, barterGood: true,
    inputs: [{ materialId: 'blackberry', qty: 1 }, { materialId: 'jasmine', qty: 1 }, { materialId: 'red-pear', qty: 2 }] },
  { id: 'dawn-bow', label: 'Dawn Bow', cauldron: 'delicacy', unlockKeys: 15, minutes: 5, barterGood: false,
    inputs: [{ materialId: 'quartz', qty: 1 }, { materialId: 'okra', qty: 1 }, { materialId: 'red-pear', qty: 2 }] },

  // ---- Magic Cauldron of Tenderness ----
  { id: 'purple-fabric', label: 'Purple Fabric', cauldron: 'tenderness', unlockKeys: 0, minutes: 1, barterGood: true,
    inputs: [{ materialId: 'magic-cobweb', qty: 1 }, { materialId: 'blackberry', qty: 1 }] },
  { id: 'floral-dress', label: 'Floral Dress', cauldron: 'tenderness', unlockKeys: 5, minutes: 2, barterGood: false,
    inputs: [{ materialId: 'jasmine', qty: 1 }, { materialId: 'magic-cobweb', qty: 1 }] },
  { id: 'waterproof-fabric', label: 'Waterproof Fabric', cauldron: 'tenderness', unlockKeys: 8, minutes: 3, barterGood: false,
    inputs: [{ materialId: 'magic-cobweb', qty: 1 }, { materialId: 'rubber', qty: 1 }] },
  { id: 'reinforced-fiber', label: 'Reinforced Fiber', cauldron: 'tenderness', unlockKeys: 12, minutes: 4, barterGood: false,
    inputs: [{ materialId: 'okra', qty: 1 }, { materialId: 'rubber', qty: 1 }, { materialId: 'magic-cobweb', qty: 2 }] },
  { id: 'evening-dress', label: 'Evening Dress', cauldron: 'tenderness', unlockKeys: 15, minutes: 5, barterGood: false,
    inputs: [{ materialId: 'jasmine', qty: 1 }, { materialId: 'quartz', qty: 1 }, { materialId: 'magic-cobweb', qty: 2 }] }
]
