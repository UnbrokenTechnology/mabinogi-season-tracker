// Seeded routine templates. Conditional tasks show/hide based on profile + progress.

export type Cadence = 'daily' | 'weekly' | 'biweekly' | 'monthly'

export interface TaskCondition {
  primaryField?: string[]      // show only if profile.primaryField is one of these
  minLifeGoals?: number        // show only if progress.lifeGoals >= n
  basicsGate?: boolean         // show only if all six basics are Lv 5
  secondaryLine?: string[]     // show only for this secondary plan
}

export interface TaskTemplate {
  id: string
  cadence: Cadence
  title: string
  detail?: string
  sort: number
  cond?: TaskCondition
  help?: string      // key into HELP (src/data/help.ts) for a per-task explainer
}

export const TASK_TEMPLATES: TaskTemplate[] = [
  // ---- daily (reset 7 AM server) ----
  { id: 'd-bounty', cadence: 'daily', sort: 1, title: 'Bounty-plant priority crops', detail: 'Rubber → Magic Cobwebs → Quartz. Longest timers gain the most from the 80% growth cut. Don\'t spend Bounty on short-timer crops during the expansion push.' },
  { id: 'd-tend', cadence: 'daily', sort: 2, title: 'Tend crops on prompt', detail: '+5 per action (+9 with Bounty). Tending Score at harvest: 40+ Fine, 70+ Finest.' },
  { id: 'd-event', cadence: 'daily', sort: 3, title: 'Hit an environmental event', detail: '12:50 PM & 8:50 PM server, max 2/day. Mono-crop the delivery target first — success boosts ALL planted crops.' },
  { id: 'd-deliveries', cadence: 'daily', sort: 4, title: '6 processed-goods deliveries', detail: 'Primary daily key income. Deliver Finest when possible: +30 Fine / +70 Finest coins each.' },
  { id: 'd-cheer', cadence: 'daily', sort: 5, title: 'Cheer ×3 on other farms', detail: 'Gives their farm energy; you can receive 5/day.' },
  { id: 'd-queue', cadence: 'daily', sort: 6, title: 'Queue rubber / long crops before logout', detail: 'Never log out with idle long-timer plots.' },

  // ---- weekly (Thu 7 AM server) ----
  { id: 'w-commissions', cadence: 'weekly', sort: 1, title: 'All 20 commissions (Folla + Tyrone)', detail: 'Season Life EXP comes ONLY from these. Capped 20/week; missed weeks are unrecoverable. Week 1 → ~Lv 21, Week 2 → Lv 30.' },
  { id: 'w-krom', cadence: 'weekly', sort: 2, title: 'Talk to Krom after hitting the cap', detail: 'Extra content for capped players.' },
  { id: 'w-repeat-novice', cadence: 'weekly', sort: 3, title: '[Repeat] Novice Farmer weekly goals', cond: { minLifeGoals: 2 }, detail: 'Unlocked at 2 Life Goals. In the Repeat tab of the Quest menu.' },
  { id: 'w-repeat-adept', cadence: 'weekly', sort: 4, title: '[Repeat] Adept Farmer weekly goals', cond: { minLifeGoals: 5 }, detail: 'Unlocked at 5 Life Goals.' },
  { id: 'w-repeat-expert', cadence: 'weekly', sort: 5, title: '[Repeat] Expert Farmer weekly goals', cond: { minLifeGoals: 7 }, detail: 'Unlocked at 7 Life Goals.' },
  { id: 'w-seasonal-dish', cadence: 'weekly', sort: 6, title: "Cook this week's Seasonal Dishes", cond: { primaryField: ['food'] }, detail: 'Check Life Guide → Seasonal Info for the 10 ingredients + active effect group. Combat EXP +20% weeks sell hardest. Requires Maistir rank + Cooking sub-spec Lv 1 (Fresh Food).' },
  { id: 'w-stew', cadence: 'weekly', sort: 7, title: 'Restock Physique-Preserving Stew', cond: { primaryField: ['food'] }, detail: 'Players rebirth weekly — recurring demand.' },
  { id: 'w-craft-line', cadence: 'weekly', sort: 6, title: 'Batch-craft your Maistir/spec product line', cond: { primaryField: ['medicine', 'textiles', 'metalworking', 'craftworks'] }, detail: 'Craft and list your field\'s rank/spec products while bonuses apply (Maistir: Monday/party/weather bonuses always on).' },
  { id: 'w-barter', cadence: 'weekly', sort: 8, title: 'Run tier-3+ barter', detail: 'Cauldron goods + Plates (Azurite/Hematite/White Lead). This is the main gold engine.', help: 'barterTiers' },
  { id: 'w-rares', cadence: 'weekly', sort: 9, title: 'Gather rare materials on schedule', cond: { basicsGate: true }, detail: 'Life Guide → Rare Gathering Times auto-paths you. Sub-spec level = success rate.' },

  // ---- biweekly (evaluation cycle, anchored Aug 27) ----
  { id: 'b-evalgrind', cadence: 'biweekly', sort: 1, title: 'Grind evaluation commissions EARLY', detail: 'Scoring closes at MIDNIGHT before eval Thursday — not 7 AM. Finish a day early; eval-morning cramming was KR mistake #4.' },
  { id: 'b-apply', cadence: 'biweekly', sort: 2, title: 'Confirm Maistir application with Krom', cond: { basicsGate: true }, detail: 'Requires Lv 5 in a crafting spec. Early windows are the thinnest fields of the season.' },

  // ---- monthly (first Thursday) ----
  { id: 'm-barterlist', cadence: 'monthly', sort: 1, title: 'Re-read the Iria barter list BEFORE unlocking recipes', detail: 'Rotates 1st Thursday, differs per server. Keys before barter list was KR mistake #1. Re-verify every saved recipe priority.' }
]

export const MILESTONES = [
  { date: '2026-08-20', text: 'Farm running · ~Life Lv 21 · expansion goals underway · rubber trees queued' },
  { date: '2026-08-27', text: 'Life Lv 30 · all six Basics at 5 · {field} spec started · evaluation application in' },
  { date: '2026-09-10', text: '{field} Lv 5 · sub-spec unlocked · first Maistir/Virtuoso result' },
  { date: '2026-10-01', text: 'Product sales steady · tier-3+ barter flowing · rare material income' },
  { date: '2026-11-01', text: 'Rank held 3+ cycles · second income line (Ether Powder or 2nd spec) · chest lottery' },
  { date: '2027-01-15', text: 'LIQUIDATE — sell all seasonal stock before the Feb 4 reset. Rares become exchange fodder.' }
]
