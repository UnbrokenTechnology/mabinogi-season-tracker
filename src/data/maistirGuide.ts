// Maistir path + seasonal currency guide for Lughnasadh S1.
// Cross-referenced Aug 14 2026 from: official NA "New Life" patch notes (Aug 13),
// Mabinogi World Wiki (several pages still Under Construction), the printed field
// guide, and KR-server community guides. Each currency card carries a source tag;
// anything KR-only is labeled a trend to verify, not a fact.

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
      'Finish Blaanid\'s Third Memoir (G28) — the hard gate — then accept "An Invitation from the Life ' +
      'Association" and report to the Jousting Arena in Tara. Krom runs evaluations, Folla posts crafting ' +
      'commissions, Tyrone posts gathering commissions. Registration is ONE character per account for the ' +
      'whole season and cannot be changed.',
    note: 'Your farm locks to the character AND channel you register on until February. Check your channel first.',
    noteTone: 'red'
  },
  {
    title: 'Season Life Level 30 — commissions only',
    detail:
      'The 20 weekly commission quests are the only source of Season Life EXP (grades pay A 150 / B 100 / C 50). ' +
      'One full week lands ≈ Level 21, two full weeks hit the Level 30 cap. Missed weeks can never be made up. ' +
      'Every commission also pays Life Association Coins on the side.',
    note: 'After capping, talk to Krom — extra content opens for capped players.',
    noteTone: 'green'
  },
  {
    title: 'All six Basic Expertises to Level 5',
    detail:
      'Level-ups grant Basic Life Points to spend across Animal, Plant, Mineral, Health, Fiber, and Engineering ' +
      '(each caps at 5). Every one of the six must reach Level 5 before Specializations unlock — spread points ' +
      'evenly; favorites waste nothing but time.'
  },
  {
    title: 'One crafting field to Specialization Level 5',
    detail:
      'Maistir eligibility needs Level 5 in one of the five crafting fields: Food, Medicine, Textiles, ' +
      'Metalworking, or Craftworks. Specialization Points come only from Krom\'s evaluations, which cost Life ' +
      'Association Keys on a lifetime ladder shared across ALL trees (1→2→3→5→10 keys). One field to Level 5 ' +
      'fits inside the cheap 1-key tier; spreading burns it.',
    note: 'Scout first: count who\'s grinding your field\'s commissions in Tara. Thin field = soft percentile.',
    noteTone: 'gold'
  },
  {
    title: 'Post your Advancement score',
    detail:
      'Your primary evaluation score is your field skill\'s best Dan (Advancement) test score: Medicine → Potion ' +
      'Making, Textiles → Tailoring, Metalworking → the higher of Blacksmithing or Hillwen Engineering, ' +
      'Craftworks → Magic Craft. Food is the exception — it uses your Restaurant Mini-game high score, played ' +
      'right in Tara. Dan 3 scores count in full; Dan 1–2 scores take a penalty. Dan entry needs skill Rank 1 + ' +
      '100 training points; fees are 10K/20K/30K gold for Dan 1/2/3.',
    note: 'Rank Harvest Song to R1 — it buffs Dan tests and daily crafting alike.',
    noteTone: 'gold'
  },
  {
    title: 'Apply via Krom, then grind evaluation commissions',
    detail:
      'Apply for the Maistir Evaluation through Krom, then stack Association Evaluation Commissions during the ' +
      '2-week window — they are the secondary score that separates you from everyone sitting on the same Dan ' +
      'score. Results resolve every other Thursday at 7:00 AM (first: Aug 27), and your rank is a percentile ' +
      'against everyone else in the field.',
    note: 'Scoring closes at MIDNIGHT before evaluation Thursday — not 7 AM. Finish a day early, every cycle.',
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
    perks:
      'Maistir title + idle stance, Krom\'s Special Shop, recruitment banner, and the field\'s ' +
      'Maistir-exclusive recipes (Food: Seasonal Dishes + Physique Stew).'
  },
  {
    rank: 'Virtuoso',
    cut: '10–25%',
    perks:
      'Virtuoso title, Folla\'s Special Shop, Alban Eiler / party / weather bonuses always applied; Entrusted ' +
      'Crafting (Blacksmithing / Tailoring fields), basic Echo Marionette crafting (Craftworks).'
  },
  { rank: 'Expert', cut: '25–45%', perks: 'Expert title + teleport access to rare gathering materials.' },
  { rank: 'Adept', cut: '45–70%', perks: 'Tyrone\'s Special Shop access.' },
  { rank: 'Amateur', cut: 'Everyone', perks: 'Teleport access to standard gathering materials.' }
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
      'Benefits last only until the next evaluation, and every cycle re-derives the whole field\'s ranking ' +
      'from scratch. The scoring window ends at midnight before evaluation Thursday, and KR\'s first cycles ' +
      'turned the final night into a leaderboard sprint war — expect the cut to inflate in the last 24–48h, ' +
      'and never plan to cram on eval morning.'
  },
  {
    icon: 'military_tech',
    tone: 'green',
    title: 'Your Dan score is a persistent floor',
    text:
      'The Dan half of your score is your lifetime BEST, so it carries into every future cycle — the treadmill ' +
      'is only the commission half. KR consensus: Virtuoso is holdable on the Dan floor plus a modest batch of ' +
      'evaluation commissions each window, while Maistir in a crowded field meant near-daily grinding. ' +
      'Incumbency beats re-winning a lost rank.'
  },
  {
    icon: 'groups',
    tone: 'gold',
    title: 'Field choice beats effort',
    text:
      'KR\'s verdict on the percentiles: "it\'s not 20%, it\'s 20 people." Outside Food on big servers, most ' +
      'fields ran at or near the 20-slot floor, and cut scores swung wildly by server and cycle (one field\'s ' +
      'cut sat under 18K points while elsewhere 150K wasn\'t enough). There is no fixed safe score — scout your ' +
      'field\'s crowd every cycle and hop if it heats up; the Dan floor travels with the skill, not the rank.'
  },
  {
    icon: 'payments',
    tone: 'red',
    title: 'The treadmill is a gold sink — the prize is the perks',
    text:
      'KR players report multi-million-gold cycles: auction-house materials, fees, preservatives, unlimited ' +
      'submissions. Maistir goods also carry weekly production limits, so direct craft profit is thinner than ' +
      'it looks — the real returns are the exclusive recipes, shops, and title. Budget the chase like an ' +
      'expense, and buy any 14-day Maistir-shop essence items EARLY in your cycle: their timer ignores the ' +
      'next evaluation.'
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
    tagline:
      'The season\'s scarcest resource — every important unlock runs through keys, and every source is ' +
      'time-gated. Budget them in the Ledger before spending.',
    earn: [
      'Association Deliveries on the farm — keys arrive in the Final Payment when the delivery completes (daily slots reset 7 AM; the routine assumes ~6/day)',
      'Environmental event success (12:50 PM / 8:50 PM) — 1 key each, up to 2/day',
      'Season Life Goals — Farm Expansion goals #5 / #8 / #11 pay 1 / 3 / 5 keys',
      'KR trend to verify: the optimized route (max deliveries + the Red Pear Jam line, fed by ~35 Magic Cobwebs a day) peaked near 7 keys/day ≈ 49/week; casual play earns far less'
    ],
    spend: [
      'Krom\'s specialization evaluations — lifetime ladder: 1 key each for evals 1–10, then 2 → 3 → 5 → 10',
      'Magic Cauldron recipe unlocks — 40 keys per cauldron, 160 to unlock everything',
      'Treasure Chests found while harvesting — 1 key each, pays 300K / 1M / 5M / 50M gold',
      'Krom\'s Hidden Commissions — 1 key for 5 Season Life EXP. A trap; skip them.',
      'KR spending priority: the 1–2 cauldron recipes your build actually sells first, then everything into evaluations (each run advances spec points AND Maistir score together), treasure chests last'
    ],
    caps: [
      'No stockpile cap (stacks of 100), but income is throttled by daily delivery slots and the 2/day events',
      'Untradable; bank-storable on the same character only'
    ],
    warning:
      'Never unlock a cauldron recipe before reading your server\'s current Iria barter list (rotates first ' +
      'Thursday monthly) — the #1 wasted resource on KR, where most recipes proved dead ends; unlock only the ' +
      '1–2 your build actually sells. Every evaluation permanently climbs the lifetime ladder, so don\'t burn ' +
      'the cheap 1-key tier on half-prepared runs. And never shop-sell keys for the 25K gold price tag.',
    seasonEnd: 'cauldron unlocks re-cost keys each season; carry-over is unconfirmed — assume keys wipe and spend down before Feb 4.'
  },
  {
    id: 'coins',
    name: 'Life Association Coins',
    icon: 'toll',
    source: 'na',
    tagline:
      'The volume currency. Commissions and deliveries pour these in, and the three Association NPCs run coin ' +
      'shops stocked with crafting materials — including rares once your specialization matches.',
    earn: [
      'Association Commissions — every one of the 20 weekly quests pays coins alongside Season Life EXP',
      'Association Deliveries — Advance Payment lands instantly, plus +30 coins per Fine and +70 per Finest crop delivered',
      'Season Life Goals — 300 up to 5,000 coins per goal across the 44-goal track'
    ],
    spend: [
      'Krom\'s shop — leathers (10–1,000) and ores/gems like Azurite, Hematite, White Lead (400 each) for barter plates',
      'Folla\'s shop — firewood, ingots, fabric/silk, braids, plus rares: Glowing Wool, Brium Milk, Mysterious Feather (2,000–3,000)',
      'Tyrone\'s shop — ores, herbs, Moonlight Carrot, Hillwen Ore Essence, Shyllien Condensed Core (200–1,000)'
    ],
    caps: [
      'Shop items carry weekly buy limits (10 or 20 per item, per week)',
      'Rare-material stock only appears once you hold the matching Specialization Expertise',
      'Wednesday (Alban Heruin) gives the 5% NPC shop discount'
    ],
    warning:
      'Mono-crop before an environmental event, then deliver Finest: the +70-coin bonus per crop is the ' +
      'single biggest coin lever in the daily routine. KR treats the coin shop as a bottleneck-breaker — buy ' +
      'whatever rare material is gating your next evaluation run, not whatever looks shiny.',
    seasonEnd: 'expiry unconfirmed on both NA and KR — KR players spend down before season end as a precaution; do the same before Feb 4.'
  },
  {
    id: 'lifeExp',
    name: 'Season Life EXP & Basic Life Points',
    icon: 'trending_up',
    source: 'na',
    tagline:
      'The leveling track. EXP comes from exactly one place, converts to levels (cap 30), and each level grants ' +
      'Basic Life Points for the six Basic Expertises.',
    earn: [
      'Commission quests ONLY — grade A pays 150, B 100, C 50 Season Life EXP',
      'A perfect week (18×A + 2×B) is 2,900 EXP; two full weeks reach the Level 30 cap'
    ],
    spend: [
      'Basic Life Points level the six Basic Expertise trees (Animal, Plant, Mineral, Health, Fiber, Engineering), each capped at Level 5',
      'All six at Level 5 is the gate to Specializations — spread evenly'
    ],
    caps: ['20 commissions per week, hard cap, resets Thursday 7 AM', 'Season Life Level caps at 30'],
    warning: 'Skipped commission weeks are unrecoverable — the EXP cap means you cannot catch up later.',
    seasonEnd: 'level, EXP, and all Basic points reset when the next Life Season begins.'
  },
  {
    id: 'specPoints',
    name: 'Specialization Life Points',
    icon: 'workspace_premium',
    source: 'na',
    tagline:
      'The points that build your nine Specialization trees — bought with keys through Krom\'s evaluations, ' +
      'which makes them the real output of your key budget.',
    earn: [
      'Krom\'s Specialization evaluations — each costs keys on the shared lifetime ladder (1/2/3/5/10)',
      'No limit on how many points you can eventually acquire — the ladder is the only brake'
    ],
    spend: [
      'Level any of the 9 trees (4 gathering, 5 crafting), each to Level 5',
      'Level 5 unlocks that tree\'s Sub-Specializations: rare-material gathering, exclusive recipes, special actions'
    ],
    caps: [
      'One FREE full reset per season; individual tree resets cost Pon (premium)',
      'Evaluation count is lifetime and shared across all trees — focus one field first'
    ],
    seasonEnd: 'all Specialization points and expertise effects reset at the start of the next season.'
  },
  {
    id: 'farm',
    name: 'Farm Energy & Bounty',
    icon: 'bolt',
    source: 'na',
    tagline:
      'The farm\'s two accelerators. Energy shaves minutes off any timer; Bounty is the daily blessing that ' +
      'makes long crops viable.',
    earn: [
      'Energy regenerates 1 per 3 real minutes; cheers received restore extra (give 3/day, receive up to 5/day)',
      'Bounty refills in full at the 7 AM daily reset'
    ],
    spend: [
      'Energy: 1 point = −1 minute on crop growth, cauldron production, or delivery timers',
      'Bounty: auto-spends when planting — cuts growth time 80% and boosts tending to +9 per action (vs +5)'
    ],
    caps: ['Cheers: 3 given / 5 received per day', 'Bounty is once-a-day — priority order Rubber → Magic Cobwebs → Quartz'],
    warning:
      'Don\'t burn Bounty on short-timer crops during the expansion push — longest-timer, one-per-harvest crops gain the most from the 80% cut.'
  }
]
