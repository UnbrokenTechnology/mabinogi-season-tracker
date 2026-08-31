// All in-app help copy lives here, keyed by topic. Components reference a key
// via <HelpTip topic="..."> — edit this file to change any explanation.

export interface HelpLink { label: string; to: string }
export interface HelpTopic { title: string; text: string; links?: HelpLink[] }

export const HELP: Record<string, HelpTopic> = {
  // ---- dashboard checklists ----
  today: {
    title: 'Today — the daily farm loop',
    text: 'Everything worth doing every single day, ~25 minutes total. Resets at 7:00 AM server time. Your completion history shows in the strip at the bottom of the dashboard.'
  },
  week: {
    title: 'This week — due before Thursday',
    text: 'Weekly tasks, due before the Thursday 7:00 AM server reset. The 20 commissions are the single most important item: they are the ONLY source of Season Life EXP and missed weeks can never be made up. Tasks here change with your Strategy picks.',
    links: [{ label: 'Change your picks on Strategy', to: '/planner' }]
  },
  evalCycle: {
    title: 'The evaluation cycle',
    text: 'The Maistir competition runs on a 2-week treadmill: your Dan test score plus evaluation commissions decide your rank against everyone else in your field. Scoring closes at MIDNIGHT before evaluation Thursday — not 7 AM — so finish a day early. Rank lasts until the next evaluation.',
    links: [
      { label: 'Full guide on the Maistir tab', to: '/maistir' },
      { label: 'Log your results on Progress', to: '/progress' }
    ]
  },
  barterMonth: {
    title: 'The barter month',
    text: 'Iria barter demands rotate on the first Thursday of every month and differ per server. Re-read the in-game list before unlocking any cauldron recipe with keys — unlocking a recipe the market no longer wants was the #1 wasted resource on the Korean server.',
    links: [{ label: 'Track key spending in the Ledger', to: '/ledger' }]
  },

  // ---- dashboard counters ----
  commissions: {
    title: 'Commission quests',
    text: 'Life Association commissions from Folla (gathering) and Tyrone (deliveries) in Tara. Hard cap of 20 per week, and they are the ONLY source of Season Life EXP: one full week ≈ Level 21, two full weeks = the Level 30 cap. Resets Thursday 7:00 AM server.'
  },
  deliveries: {
    title: 'Processed-goods deliveries',
    text: 'Six daily deliveries (3 + 3) of processed goods — your main steady source of Life Association Keys. Delivering higher-quality crops pays bonus coins: +30 per Fine, +70 per Finest.'
  },
  cheers: {
    title: 'Cheering',
    text: "Visit another player's Taillteann Farm (right-click their character → Visit) and cheer their crops — it restores a little of their farm energy. You can give 3 cheers a day; a farm can receive 5. Trade cheers with your household!"
  },
  envEvents: {
    title: 'Environmental events',
    text: "Twice a day (12:50 PM and 8:50 PM server) your farm can run a short protect-the-crops event — trigger it with the Periodic Event button while on your farm. Success gives a big Tending Score boost to ALL planted crops; failure loses a little.\n\nThe trick: fill every plot with ONE delivery-target crop before the event to mass-produce Fine/Finest quality of exactly what you need."
  },
  bounty: {
    title: 'Bounty',
    text: "The land's daily blessing. It auto-spends when you plant, cutting growth time by 80% and boosting tending actions (+9 instead of +5). Refills at 7:00 AM server. Spend it on the longest-timer crops — Rubber → Magic Cobwebs → Quartz — never on short timers during the expansion push."
  },
  heatStrip: {
    title: 'Routine history',
    text: 'One square per game day (7 AM to 7 AM server). Fill level = share of daily tasks you checked off that day. A quick honesty check on how consistent the routine has been.'
  },

  // ---- clock & keys ----
  clock: {
    title: 'The Clock',
    text: "Every recurring reset and cutoff, each shown in server time (Pacific) and your local time. The Maistir scoring cutoff stays pinned on top even when far away: scoring closes at MIDNIGHT before evaluation Thursday, and missing it wastes an entire 2-week cycle. Countdowns turn gold under 72h, red under 24h."
  },
  keys: {
    title: 'Keys — the scarcest currency',
    text: "Almost everything important costs Life Association Keys.\n\nEARN: the 6 daily deliveries, Association Deliveries, Season Life Goals.\nSPEND: Krom's specialization evaluations (escalating ladder), Magic Cauldron recipe unlocks, Treasure Chests (1 each).\n\nThe balance comes from transactions you log; 'next eval' cost is computed from your lifetime evaluation count. Log every earn and spend so the affordability math stays honest.",
    links: [
      { label: 'Currency guide on the Maistir tab', to: '/maistir' },
      { label: 'Full key & gold ledger', to: '/ledger' },
      { label: 'Key-cost ladder on Strategy', to: '/planner' }
    ]
  },

  // ---- ledger page ----
  keyLedger: {
    title: 'Why a key ledger?',
    text: "The game shows your key balance, but not whether you can AFFORD your plan. Logging each earn/spend lets the tracker project the cost of your next 1/3/5/10 evaluations against the escalating ladder, so you never unlock a cauldron recipe you couldn't spare the keys for.",
    links: [{ label: 'Key-cost ladder on Strategy', to: '/planner' }]
  },
  goldLedger: {
    title: 'Why a gold ledger?',
    text: "A lightweight sales log: item, amount, note. Its one job is showing WHICH product line actually earns — Seasonal Dishes vs. stew vs. barter vs. rare materials — so mid-season you double down on the right one. Revenue priority from the field guide: tier-3+ barter → Seasonal Dishes → Physique Stew → rare material surplus."
  },
  barterTiers: {
    title: 'What is tier-3+ barter?',
    text: "Iria's four Barter Trading Posts (Karu Forest, Oasis, Calida, Pera) exchange materials for trade goods you then sell at other posts for Ducats and gold. Goods form exchange chains the community numbers as tiers 1–5: early tiers take ordinary materials anyone can gather, while the high-value goods added this season list Taillteann Farm output, Magic Cauldron crafts, and specialization-recipe items (Plates, etc.) as materials — that's the 'tier-3+ barter' in your weekly list, and the season's main gold engine.\n\nRequirements differ per server and rotate the first Thursday of each month. Needs Commerce rank Silver 5+, and weekly trade limits reset Thursdays."
  },

  // ---- progress page ----
  lifeLevel: {
    title: 'Season Life Level',
    text: 'Levels come only from commission quests (20/week cap): week 1 ≈ Level 21, week 2 = the cap of 30. Each level grants Basic Life Points to spend on the six Basic Expertises. Resets when the season ends.'
  },
  basics: {
    title: 'Basic Expertise',
    text: 'Six trees (Animal, Plant, Mineral, Health, Fiber, Engineering), each capped at Level 5. Getting ALL SIX to 5 is the hard gate that unlocks Specializations — so spread points evenly; favorites waste nothing but time.'
  },
  specs: {
    title: 'Specializations',
    text: "Nine trees, all available at once — the constraint is keys, not choices. Levels come from Krom's evaluations, whose key cost climbs on a lifetime ladder shared across ALL trees (1→2→3→5→10 keys). Level 5 unlocks Sub-Specializations: rare-material gathering, exclusive recipes, special actions.",
    links: [{ label: 'Decision guide on Strategy', to: '/planner' }]
  },
  lifeGoals: {
    title: 'Season Life Goals',
    text: 'Farm challenges with escalating unlocks: 2/5/7 goals unlock Novice/Adept/Expert weekly repeat quests (they appear in your weekly checklist automatically), and 15 goals unlock Treasure Chests while harvesting (1 key to open, 300K–50M gold). Farm Expansion goals grant plots and the two Rubber Trees — grab those ASAP.'
  },
  phases: {
    title: 'Season phases',
    text: "The season has an arc, and your priorities change with it: The Engine (level + basics + key income) → Specialize (one field to Lv 5, apply for Maistir) → Income (hold rank, four revenue streams) → Expand (second line, chest lottery) → Liquidate (sell everything before the Feb 4 reset). This banner tracks where you are and what matters right now."
  },
  almanac: {
    title: 'The Almanac',
    text: "Your season archive, built automatically from what you already track: each week's commissions, daily-routine completion, weekly checklist rate, key and gold flow (from ledger timestamps), and evaluation results. Nothing extra to enter — it's the same data, viewed backwards. Use it to spot slipping weeks before they become a lost cycle.",
    links: [{ label: 'Log evals on Progress', to: '/progress' }]
  },
  maistirHistory: {
    title: 'Evaluation history',
    text: 'Log each biweekly result (rank, field, notes on how crowded the field looked). Over a few cycles this shows whether to keep grinding your field or hop to a softer one — Dan scores persist, so field-hopping is cheap.'
  },

  // ---- market page ----
  market: {
    title: 'How the ranking works',
    text: "For each of the 20 cauldron recipes: profit = sell price minus the AH fee, minus the cost of buying its ingredients at your entered prices. The best row per cauldron and the best overall float to the top.\n\nPrices swing hard between servers and weeks — re-check the AH before committing a big crafting session, and remember recipe unlock keys are a sunk cost the per-craft number deliberately ignores.",
    links: [{ label: 'Log the sales in the Ledger', to: '/ledger' }]
  },
  marketMaterials: {
    title: 'Enter each price once',
    text: "One price per farm material, straight from the Auction House. Every recipe using that material updates instantly — Blackberry feeds 7 different recipes, so one edit re-ranks all of them.\n\nIf you grow your own materials the math still holds: crafting consumes a unit you could otherwise have sold, so its AH price is still what the craft costs you.\n\nShare link copies a URL carrying every price on the page — send it to your household and they get offered your sheet. Whoever checked the AH last shares back."
  },
  marketFee: {
    title: 'Auction House fee',
    text: 'The cut the Auction House takes from a completed sale — 4% on NA. It comes off the SELL side only: profit = sell × 0.96 − materials. Adjust here if the rate ever changes.'
  }
}
