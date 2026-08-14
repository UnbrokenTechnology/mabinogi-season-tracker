// Specialization decision data — presented neutrally so each player can pick
// their own path (the printed field guide was written around one Food-Maistir plan).

export interface CraftField {
  id: string
  label: string
  icon: string
  skills: string
  maistirProducts: string[]
  pros: string[]
  cons: string[]
  subSpecNote: string
}

export const CRAFT_FIELDS: CraftField[] = [
  {
    id: 'food',
    label: 'Food',
    icon: 'restaurant',
    skills: 'Cooking',
    maistirProducts: [
      'Seasonal Dishes — weekly rotating effects (incl. Combat EXP +20% weeks, which sell hardest)',
      'Physique-Preserving Mushroom Stew — players rebirth weekly, recurring demand forever'
    ],
    pros: [
      'Two evergreen product lines with repeat buyers',
      'Cooking sub-spec Lv 1 unlocks Fresh Food, the gate for Seasonal Dishes',
      'Alban Eiler (Monday) bonus always applied from Virtuoso rank up',
      'Heads-up: Food\'s evaluation score uses the Restaurant Mini-game in Tara, not a Dan test'
    ],
    cons: [
      'Usually the most popular field — hardest top-10% cut',
      'Seasonal Dishes require holding Maistir rank every cycle (biweekly treadmill)'
    ],
    subSpecNote: 'Sub-spec: Cooking (Fresh Food). Fresh Food is required for Seasonal Dishes.'
  },
  {
    id: 'medicine',
    label: 'Medicine',
    icon: 'science',
    skills: 'Potion Making',
    maistirProducts: [
      "Rarefied Holy Water of Lymilark — 80% durability-loss reduction, big QoL item",
      "Maistir's Potion of Conductivity — +3% bonus damage for magic/alchemy weapons"
    ],
    pros: [
      'Often the softest competition of the five fields',
      'Consumables = repeat buyers',
      'The 20-slot Maistir/Virtuoso floor does a lot of work in a thin field',
      'Spec recipe (no rank needed): Food Preservative — extends Freshness 72h, sells to every cook'
    ],
    cons: [
      'Fewer distinct product lines than Food or Metalworking',
      'Potion Making mastery needed; less useful if you never trained it'
    ],
    subSpecNote: 'Sub-spec: Potion Making (exclusive recipes).'
  },
  {
    id: 'textiles',
    label: 'Textiles',
    icon: 'checkroom',
    skills: 'Tailoring + Weaving',
    maistirProducts: [
      'Glowing Intertwined Thread — changes gender of graded equipment & rare robes (big-ticket)',
      'Robe of Insight — unique +1% movement speed set effect robe',
      "Maistir's Lining — +15% HP boost (up to 3,000) on outfit pieces"
    ],
    pros: [
      'High-value luxury items with little substitute',
      'Entrusted Crafting (Tailoring) from Virtuoso rank up',
      'Spec recipes (no rank): Gathering Gloves (+1 material incl. rares), Commerce Expansion Cover'
    ],
    cons: [
      'Demand is spikier than consumables — fewer, bigger sales',
      'Split across two skills (Tailoring + Weaving) for sub-specs'
    ],
    subSpecNote: 'Sub-specs: Tailoring and Weaving (exclusive recipes).'
  },
  {
    id: 'metalworking',
    label: 'Metalworking',
    icon: 'hardware',
    skills: 'Blacksmithing + Refining + Hillwen Engineering',
    maistirProducts: [
      'Antique Cooking Tools & Enchanted Eweca Gathering Tools — sells to cooks AND gatherers',
      'Tricolor Jeweled Ring — stat ring (protection/defense + damage roll)',
      "Maistir's Ballistic Propellant — +3% bonus damage for ranged weapons"
    ],
    pros: [
      'Customers in every other field (everyone needs tools)',
      'Spec recipes (no rank): Sturdy Tools (2× durability), seasonal Ingots/Plates for tier-3+ barter',
      'Entrusted Crafting (Blacksmithing) from Virtuoso rank up'
    ],
    cons: [
      'Material-heavy; competes with established blacksmith mains',
      'Three skills spread the sub-spec investment'
    ],
    subSpecNote: 'Sub-specs: Blacksmithing, Refining, Hillwen Engineering (exclusive recipes).'
  },
  {
    id: 'craftworks',
    label: 'Craftworks',
    icon: 'construction',
    skills: 'Handicraft + Magic Craft + Carpentry',
    maistirProducts: [
      'Gayageum — the new instrument, Maistir-only craft',
      'Echo Marionette crafting/appearance (Virtuoso+; Maistir gets premium appearance options)',
      "Maistir's Polish — +3% bonus damage for melee weapons"
    ],
    pros: [
      'Magic Craft sub-spec Lv 5 = Ether Powder — feeds ALL Equipment Tuning, NO rank required, 30-day expiry means repeat buyers',
      'Echo Marionette niche is a near-monopoly at rank',
      'Carpentry sub-spec also gathers rare materials'
    ],
    cons: [
      'Split across three skills; the rank products are nichier',
      'Ether Powder line works without rank — you may not need to chase Maistir here at all'
    ],
    subSpecNote: 'Sub-specs: Handicraft, Magic Craft (Equipment Tuning + Ether Powder), Carpentry.'
  }
]

export interface GatherTree {
  id: string
  label: string
  icon: string
  covers: string
  rareNote: string
}

export const GATHER_TREES: GatherTree[] = [
  { id: 'ranching', label: 'Ranching', icon: 'egg', covers: 'Milking · Egg Gathering · Sheep Shearing', rareNote: 'Rare materials from each via sub-specs; 10% double-gather at Lv 5.' },
  { id: 'farming', label: 'Farming', icon: 'grass', covers: 'Harvesting · Hoeing', rareNote: 'Feeds your own cooking line; 10% double-gather at Lv 5.' },
  { id: 'foraging', label: 'Foraging', icon: 'forest', covers: 'Mushroom Gathering · Herbalism · Shyllien Ecology', rareNote: 'Mushroom/herb rares feed Food & Medicine recipes.' },
  { id: 'earthworks', label: 'Earthworks', icon: 'terrain', covers: 'Mining · Metallurgy · Rare Mineralogy', rareNote: 'Ore/mineral rares feed Metalworking & barter plates.' }
]

export const DECISION_GUIDANCE = [
  {
    title: 'Pick ONE crafting field first — the key ladder punishes spreading',
    icon: 'warning',
    color: 'negative',
    body: 'Specialization points come only from Krom evaluations, and the key cost ladder is shared across ALL trees: evaluations 1–10 cost 1 key each, 11–20 cost 2, 21–50 cost 3, then 5, then 10. One tree to Lv 5 fits in the cheap tier; spreading across trees burns it. This was the #5 costly mistake on the Korean server.'
  },
  {
    title: 'Scout before committing',
    icon: 'visibility',
    color: 'info',
    body: 'Maistir rank is percentile-based per field. Before locking in, count how many people are grinding your field\'s commissions in Tara. If Food is packed and Medicine is empty, pivot — same plan, softer field. Maistir and Virtuoso each have a guaranteed 20-slot floor regardless of field size, so thin fields are very winnable.'
  },
  {
    title: 'You do not have to chase rank at all',
    icon: 'lightbulb',
    color: 'secondary',
    body: 'Plenty of the money-makers need only spec Lv 5, not Maistir rank: Ether Powder (Magic Craft), Food Preservative (Potion Making), Gathering Gloves (Tailoring), Sturdy Tools (Blacksmithing), and all rare-material gathering. A gathering-focused season with rare-material sales and tier-3+ barter is a legitimate plan.'
  },
  {
    title: 'The free reset is your safety net — but plan anyway',
    icon: 'restart_alt',
    color: 'primary',
    body: 'You get exactly one free full specialization reset per season (individual resets cost Pon). If you mis-pick, you can recover once — but the keys spent on evaluations are NOT refunded, so scouting first is still cheaper.'
  },
  {
    title: 'Keys before barter list — every month',
    icon: 'key',
    color: 'warning',
    body: 'Never unlock a Magic Cauldron recipe without first reading your server\'s current Iria barter list. Requirements differ per server and rotate the first Thursday of each month. This was the #1 wasted resource on the Korean server.'
  }
]

export const LADDER = [
  { range: '1–10', cost: 1 },
  { range: '11–20', cost: 2 },
  { range: '21–50', cost: 3 },
  { range: '51–90', cost: 5 },
  { range: '91+', cost: 10 }
]

export function evalKeyCost(evalNumber: number): number {
  if (evalNumber <= 10) return 1
  if (evalNumber <= 20) return 2
  if (evalNumber <= 50) return 3
  if (evalNumber <= 90) return 5
  return 10
}

export const BASICS = [
  { id: 'animal', label: 'Animal', icon: 'pets' },
  { id: 'plant', label: 'Plant', icon: 'grass' },
  { id: 'mineral', label: 'Mineral', icon: 'diamond' },
  { id: 'health', label: 'Health', icon: 'favorite' },
  { id: 'fiber', label: 'Fiber', icon: 'checkroom' },
  { id: 'engineering', label: 'Engineering', icon: 'build' }
]
