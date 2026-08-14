// Maistir path + seasonal currency guide for Lughnasadh S1.
// Cross-referenced Aug 14 2026 from: official NA "New Life" patch notes (Aug 13),
// Mabinogi World Wiki (several pages still Under Construction), the printed field
// guide, and KR-server community guides. Lines follow a "Lead — detail" shape:
// the page renders the part before the first " — " bold, the rest muted.

export interface PathStep {
  title: string
  detail: string
  note?: string
  noteTone?: 'green' | 'gold' | 'red'
}

export const PATH_STEPS: PathStep[] = [
  {
    title: 'Register with the Life Association',
    detail:
      'Blaanid\'s Third Memoir (G28) gates everything. Accept "An Invitation from the Life Association," ' +
      'then report to Tara\'s Jousting Arena: Krom = evaluations, Folla = crafting commissions, Tyrone = ' +
      'gathering commissions. One character per account, all season.',
    note: 'Farm locks to this character AND channel until February — check your channel before registering.',
    noteTone: 'red'
  },
  {
    title: 'Season Life Level 30 — commissions only',
    detail:
      'The 20 weekly commissions are the ONLY Season Life EXP. Week 1 ≈ Lv 21, week 2 = the Lv 30 cap. ' +
      'Missed weeks can never be made up; coins arrive on the side.',
    note: 'Capped? Talk to Krom — extra content opens for capped players.',
    noteTone: 'green'
  },
  {
    title: 'All six Basic Expertises to Level 5',
    detail:
      'Spend Basic Life Points evenly across Animal, Plant, Mineral, Health, Fiber, Engineering. ' +
      'All six at 5 is the hard gate to Specializations.'
  },
  {
    title: 'One crafting field to Spec Level 5',
    detail:
      'Food, Medicine, Textiles, Metalworking, or Craftworks. Points come only from Krom\'s key-costing ' +
      'evaluations on a lifetime ladder shared across ALL trees (1→2→3→5→10 keys) — one field to Lv 5 ' +
      'fits inside the cheap 1-key tier.',
    note: 'Scout first: count commission grinders in Tara. Thin field = soft percentile.',
    noteTone: 'gold'
  },
  {
    title: 'Post your Advancement score',
    detail:
      'Primary score = your field skill\'s best Dan test: Potion Making (Medicine), Tailoring (Textiles), ' +
      'Blacksmithing OR Hillwen (Metalworking, higher counts), Magic Craft (Craftworks). Food instead uses ' +
      'the Restaurant Mini-game in Tara. Dan 3 counts in full, Dan 1–2 take penalties. Entry: skill R1 + ' +
      '100 training points; fees 10K/20K/30K.',
    note: 'Rank Harvest Song to R1 — it buffs Dan tests and daily crafting alike.',
    noteTone: 'gold'
  },
  {
    title: 'Apply via Krom, grind evaluation commissions',
    detail:
      'Commissions during the 2-week window are the secondary score. Results resolve alternate Thursdays ' +
      '7 AM (first: Aug 27); your rank is a percentile against your field.',
    note: 'Scoring closes at MIDNIGHT before evaluation Thursday — finish a day early, every cycle.',
    noteTone: 'red'
  }
]

export interface RankTier {
  rank: string
  cut: string
  perks: string
}

export const RANK_TIERS: RankTier[] = [
  {
    rank: 'Maistir',
    cut: 'Top 10%',
    perks: 'Title + idle stance · Krom\'s Special Shop · Maistir recipes (Food: Seasonal Dishes + Physique Stew)'
  },
  {
    rank: 'Virtuoso',
    cut: '10–25%',
    perks: 'Title · Folla\'s Special Shop · Alban Eiler/party/weather always on · Entrusted Crafting (Blacksmithing/Tailoring)'
  },
  { rank: 'Expert', cut: '25–45%', perks: 'Title · teleport to rare gathering nodes' },
  { rank: 'Adept', cut: '45–70%', perks: 'Tyrone\'s Special Shop' },
  { rank: 'Amateur', cut: 'Everyone', perks: 'Teleport to standard gathering nodes' }
]

export interface MaintainRule {
  icon: string
  title: string
  text: string
  tone: 'green' | 'gold' | 'red'
}

export const MAINTAIN_RULES: MaintainRule[] = [
  {
    icon: 'schedule',
    tone: 'red',
    title: 'Rank is rented — 2 weeks at a time',
    text:
      'Every cycle re-ranks the field from scratch, and scoring ends at midnight before eval Thursday. ' +
      'KR\'s final nights were leaderboard sprint wars — expect the cut to inflate in the last 24–48h.'
  },
  {
    icon: 'military_tech',
    tone: 'green',
    title: 'Your Dan score is a persistent floor',
    text:
      'Your best Dan score carries into every future cycle; only the commission half re-earns. KR consensus: ' +
      'Virtuoso holds on the floor + a modest commission batch; Maistir in a hot field is a near-daily grind.'
  },
  {
    icon: 'groups',
    tone: 'gold',
    title: 'Field choice beats effort',
    text:
      'KR verdict: "it\'s not 20%, it\'s 20 people" — most fields ran at the 20-slot floor, and cut scores ' +
      'swung from under 18K to over 150K by server and cycle. Scout every cycle; hop when yours heats up.'
  },
  {
    icon: 'payments',
    tone: 'red',
    title: 'A gold sink — the prize is the perks',
    text:
      'KR reports multi-million-gold cycles, and Maistir goods carry weekly production caps: chase the ' +
      'recipes, shops, and title, not craft profit. Buy 14-day essence items EARLY in your cycle — their ' +
      'timer ignores the next evaluation.'
  }
]

export interface Currency {
  id: string
  name: string
  icon: string
  tagline: string
  source?: 'na' | 'kr' | 'trend'
  earn: string[]
  spend: string[]
  caps: string[]
  warning?: string
  seasonEnd?: string
}

export const CURRENCIES: Currency[] = [
  {
    id: 'keys',
    name: 'Life Association Keys',
    icon: 'key',
    source: 'na',
    tagline: 'The scarcest resource — every important unlock runs through keys, and every source is time-gated.',
    earn: [
      'Association Deliveries — keys in the Final Payment; daily slots reset 7 AM (routine assumes ~6/day)',
      'Environmental events — 1 key per success, max 2/day (12:50 & 8:50 PM)',
      'Farm Expansion goals #5 / #8 / #11 — pay 1 / 3 / 5 keys',
      'KR peak route — ~7/day (49/wk) via max deliveries + Red Pear Jam; casual play earns far less'
    ],
    spend: [
      'Krom\'s evaluations — 1 key each for evals 1–10, then 2 → 3 → 5 → 10 (lifetime ladder)',
      'Cauldron recipe unlocks — 40 keys per cauldron, 160 for everything',
      'Treasure Chests — 1 key each; pays 300K / 1M / 5M / 50M gold',
      'Hidden Commissions — 1 key for 5 EXP. A trap; skip them.'
    ],
    caps: [
      'No stockpile cap — but income is throttled by daily delivery slots + 2 events/day',
      'Untradable — bank-storable on the same character only'
    ],
    warning:
      'Read the Iria barter list BEFORE unlocking any recipe (rotates first Thursday; most KR unlocks proved ' +
      'dead ends). Every evaluation permanently climbs the lifetime ladder — no half-prepared runs. ' +
      'Never shop-sell keys for the 25K gold tag.',
    seasonEnd: 'carry-over unconfirmed — assume keys wipe and spend down before Feb 4.'
  },
  {
    id: 'coins',
    name: 'Life Association Coins',
    icon: 'toll',
    source: 'na',
    tagline: 'The volume currency — three NPC shops turn it into crafting materials, including rares once your spec matches.',
    earn: [
      'Commissions — every one of the 20/week pays coins alongside EXP',
      'Deliveries — Advance Payment instantly, +30 per Fine / +70 per Finest crop',
      'Season Life Goals — 300 up to 5,000 per goal across the 44-goal track'
    ],
    spend: [
      'Krom\'s shop — leathers 10–1,000 · barter-plate ores/gems 400 (Azurite, Hematite, White Lead…)',
      'Folla\'s shop — firewood/ingots/fabric 300–800 · rares 2,000–3,000 (Glowing Wool, Brium Milk, Mysterious Feather)',
      'Tyrone\'s shop — ores 200 · herbs 400–700 · Hillwen Essence / Shyllien Core 1,000'
    ],
    caps: [
      'Weekly buy limits — 10 or 20 per item',
      'Rare stock — appears only with the matching Specialization',
      'Wednesday — 5% NPC shop discount (Alban Heruin)'
    ],
    warning:
      'Biggest coin lever: mono-crop before an environmental event, then deliver Finest (+70 each). ' +
      'KR treats the shop as a bottleneck-breaker — buy the rare gating your next evaluation run, not what looks shiny.',
    seasonEnd: 'expiry unconfirmed on NA and KR — spend down before Feb 4.'
  },
  {
    id: 'lifeExp',
    name: 'Season Life EXP & Basic Life Points',
    icon: 'trending_up',
    source: 'na',
    tagline: 'The leveling track — one source, hard-capped, feeding the six Basic Expertises.',
    earn: [
      'Commissions ONLY — grade A 150 / B 100 / C 50 EXP',
      'Perfect week — 2,900 EXP (18×A + 2×B); two full weeks reach the cap'
    ],
    spend: [
      'Basic Life Points — level the six Basic trees, each caps at Lv 5',
      'All six at 5 — the Specialization gate; spread points evenly'
    ],
    caps: ['20 commissions/week — hard cap, resets Thursday 7 AM', 'Season Life Level — caps at 30'],
    warning: 'Skipped weeks are unrecoverable — the cap means you cannot catch up later.',
    seasonEnd: 'level, EXP, and all Basic points reset when the next season begins.'
  },
  {
    id: 'specPoints',
    name: 'Specialization Life Points',
    icon: 'workspace_premium',
    source: 'na',
    tagline: 'Builds the nine Specialization trees — bought with keys via Krom, so these ARE your key budget\'s output.',
    earn: [
      'Krom\'s evaluations — key cost on the shared lifetime ladder (1/2/3/5/10)',
      'No point limit — the ladder is the only brake'
    ],
    spend: [
      'Nine trees — 4 gathering + 5 crafting, each to Lv 5',
      'Level 5 — unlocks Sub-Specs: rare gathering, exclusive recipes, special actions'
    ],
    caps: [
      'One FREE full reset per season — individual tree resets cost Pon',
      'Eval count is lifetime, shared across ALL trees — focus one field first'
    ],
    seasonEnd: 'all Specialization points and expertise effects reset next season.'
  },
  {
    id: 'farm',
    name: 'Farm Energy & Bounty',
    icon: 'bolt',
    source: 'na',
    tagline: 'The farm\'s two accelerators — energy shaves minutes, Bounty makes long crops viable.',
    earn: [
      'Energy — regenerates 1 per 3 real minutes; cheers restore extra',
      'Bounty — full refill at the 7 AM daily reset'
    ],
    spend: [
      'Energy — 1 point = −1 minute on crop, cauldron, or delivery timers',
      'Bounty — auto-spends on planting: −80% growth time, tending +9 (vs +5)'
    ],
    caps: ['Cheers — give 3 / receive 5 per day', 'Bounty — once daily; priority Rubber → Magic Cobwebs → Quartz'],
    warning: 'Don\'t burn Bounty on short-timer crops — longest-timer, one-per-harvest crops gain the most from the 80% cut.'
  }
]

export interface PriorityRow {
  kind: 'tier' | 'never' | 'tip'
  label: string
  detail: string
}

export interface SpendPriority {
  currency: string
  icon: string
  rows: PriorityRow[]
}

// Tier list distilled from the KR season: what the currency is FOR, in order.
export const SPEND_PRIORITY: SpendPriority[] = [
  {
    currency: 'Keys',
    icon: 'key',
    rows: [
      { kind: 'tier', label: 'One field to Spec Lv 5', detail: 'evaluations while the cheap 1-key tier lasts — everything else waits' },
      { kind: 'tier', label: 'Cauldron recipes your server demands', detail: '1–2 max, only after reading this month\'s Iria barter list' },
      { kind: 'tier', label: 'Sub-spec & second-line evaluations', detail: 'mid-season, once rank and income are steady' },
      { kind: 'tier', label: 'Treasure chests', detail: 'surplus keys only — never at the cost of an evaluation you needed' },
      { kind: 'never', label: 'Never', detail: 'Hidden Commissions (1 key → 5 EXP) · shop-selling keys for 25K gold' }
    ]
  },
  {
    currency: 'Coins',
    icon: 'toll',
    rows: [
      { kind: 'tier', label: 'Rare materials gating your next evaluation', detail: 'KR treats the shop as a bottleneck-breaker, not a treasury' },
      { kind: 'tier', label: 'Barter-plate ores & gems', detail: 'Azurite / Hematite / White Lead at 400 — feeds tier-3+ barter' },
      { kind: 'tier', label: 'Bulk basics when a commission demands them', detail: 'leathers, fabric, firewood — cheaper than gathering detours' },
      { kind: 'tip', label: 'Buy on Wednesdays', detail: 'Alban Heruin gives 5% off every NPC shop' }
    ]
  }
]

// What survives the Feb 4 reset vs what the season takes back with it.
export interface Stickiness {
  permanent: string[]
  temporary: string[]
}

export const STICKINESS: Stickiness = {
  permanent: [
    'Dan ranks & test scores — the 10/20/30K gold fees buy normal skill advancement; it works next season too',
    'Treasure-chest gold — the 300K–50M payout is plain gold, yours forever',
    'Ordinary shop materials — leathers, ores, fabric, firewood from the coin shops are normal items',
    'Gold from selling products — dishes, stew, barter profits all convert to permanent wealth'
  ],
  temporary: [
    'Specialization levels & points — every key spent on evaluations wipes at season end',
    'Cauldron recipe unlocks — explicitly re-cost keys "each season"',
    'Seasonal rare materials — the items linger but become exchange fodder after the reset; use or sell by late January',
    'Crafted consumables — essence items 14 days, Ether Powder / preservatives 30 days, dishes limited by freshness',
    'Keys & coins themselves — carry-over unconfirmed; treat both as use-it-or-lose-it'
  ]
}
