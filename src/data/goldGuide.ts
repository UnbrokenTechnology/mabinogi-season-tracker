// Gold-making guide for Lughnasadh S1, distilled from KR-server experience
// (arca.live week-1 guide by a top-100 barter trader, NamuWiki NEW LIFE, official
// KR notices) + NA patch notes. Prices differ per server & drift — verify on your
// own server's Auction House before committing keys or crafting time.

export interface GoldStream {
  rank: number
  title: string
  icon: string
  requires: string
  why: string
  krNote?: string
}

export const REVENUE_STREAMS: GoldStream[] = [
  {
    rank: 1,
    title: 'Tier-3+ barter with farm output',
    icon: 'currency_exchange',
    requires: 'Taillteann Farm + unlocked cauldron recipes matching your server\'s Iria list · Commerce rank Silver 5+',
    why: 'The high-value barter goods added this season take farm crops, Magic Cauldron crafts, and specialization items (Plates, etc.) as materials, and trade for far more valuable goods sold for Ducats AND gold. Each good has a weekly exchange cap (resets Thu 7 AM) that throttles supply — steady, repeatable, and mostly immune to AH price competition.',
    krNote: 'KR consensus #1 earner all season: ~3M/wk in Ducats from a casual two-slot routine, up to ~10M/wk gold+Ducats running everything. The catch that burned people: unlocking recipes before reading the month\'s barter list — demands rotate the first Thursday (randomly — a good can repeat) and differ per server.'
  },
  {
    rank: 2,
    title: 'Seasonal Dishes (Food Maistir only)',
    icon: 'restaurant',
    requires: 'Maistir rank in Food + Cooking sub-spec Lv 1 (Fresh Food)',
    why: 'A literal monopoly: only Food Maistirs can cook them, and buyers can filter the AH by freshness remaining. The effect GROUP rotates weekly and each dish rolls one of its 3 effects — Group 1 weeks (Combat EXP +20%) sell hardest, so cook heavy those weeks.',
    krNote: 'KR: prices spike on rotation day (Thursday), sag by the weekend. List early. Later-season KR debated whether the buffs beat plain top-end dishes — treat this as a spike line, not the backbone.'
  },
  {
    rank: 3,
    title: 'Physique-Preserving Mushroom Stew',
    icon: 'soup_kitchen',
    requires: 'Maistir rank in Food',
    why: 'Keeps physique through rebirth (except height). Players rebirth every week, forever — the definition of recurring demand.',
    krNote: 'KR: steadier than Seasonal Dishes; a base income line rather than a spike.'
  },
  {
    rank: 4,
    title: 'Rare gathering material surplus',
    icon: 'diamond',
    requires: 'Any gathering sub-spec (Lv = success rate). No Maistir rank needed.',
    why: 'The 19 new rare materials feed every seasonal recipe, and most crafters would rather buy than schedule their day around gathering windows. Sell what your own crafting doesn\'t consume.',
    krNote: 'KR: prices highest in the first weeks while few players have sub-specs — early season is the window.'
  },
  {
    rank: 5,
    title: 'Ether Powder (Equipment Tuning fuel)',
    icon: 'auto_fix_high',
    requires: 'Craftworks Lv 5 → Magic Craft sub-spec. NO rank needed.',
    why: 'Every Equipment Tuning attempt consumes it, and its 30-day expiry means nobody stockpiles — buyers come back monthly. A strong rank-free second line for mid-season.',
    krNote: 'KR: demand scales with endgame tuning meta; steady rather than spiky.'
  },
  {
    rank: 6,
    title: 'Spec-recipe consumables & tools',
    icon: 'handyman',
    requires: 'The matching sub-spec unlocked (its tree at Lv 5, no rank): Potion Making, Tailoring, Weaving, Blacksmithing, Hillwen Eng.',
    why: 'Food Preservative (+72h freshness — every cook wants it), Gathering Gloves (+1 material incl. rares), Sturdy Tools (2× durability), Commerce Expansion Cover, Commerce Floating Stone. Several expire in 30 days = repeat buyers.',
    krNote: 'KR: Food Preservative tracks the cooking economy — if dishes sell, preservative sells.'
  },
  {
    rank: 7,
    title: 'Treasure-chest lottery',
    icon: 'lock_open',
    requires: '15 Season Life Goals done; 1 key per chest',
    why: 'Chests found while harvesting pay 300K–50M gold. Positive expected value ONLY with surplus keys — never at the cost of an evaluation you needed.',
    krNote: 'KR: treat as a bonus on keys you\'d otherwise cap, not a strategy.'
  },
  {
    rank: 8,
    title: 'Casual lane: herbalism & basic gathering',
    icon: 'grass',
    requires: 'Nothing seasonal — works even without specs',
    why: 'If you\'re not chasing the seasonal economy, KR newbie guides still point at herb gathering (base/mana/sunlight/golden herbs) and processed conventional goods as the low-effort life income.',
    krNote: 'From KR community money-making guides for life-skill newbies.'
  }
]

export interface Principle {
  icon: string
  title: string
  text: string
  tone: 'green' | 'gold' | 'red'
}

export const PRINCIPLES: Principle[] = [
  {
    icon: 'factory', tone: 'gold',
    title: 'Sell processed, never raw',
    text: '100 common crops ≈ 300K and sagging as supply grows. The same crops through a cauldron, a delivery (+70/Finest), or a barter chain are worth multiples. Raw crop sales were KR mistake #7.'
  },
  {
    icon: 'schedule', tone: 'gold',
    title: 'Expiry is your friend',
    text: '30-day items (Ether Powder, Food Preservative, Floating Stone, blessed Bugle) and freshness-limited dishes can\'t be stockpiled by buyers — demand renews itself. Prefer product lines with a clock.'
  },
  {
    icon: 'military_tech', tone: 'green',
    title: 'Incumbency wins the treadmill',
    text: 'Rank re-competes every 2 weeks, and casuals fall off. Re-grinding evaluation commissions each cycle is cheaper than re-winning rank after losing it — and Dan scores persist if you field-hop to a softer field.'
  },
  {
    icon: 'sell', tone: 'red',
    title: 'Liquidate by late January',
    text: 'Everything seasonal resets Feb 4 — leftover rares become exchange fodder. Hoarding into February was KR mistake #6. From mid-January, sell everything, even below peak.'
  }
]
