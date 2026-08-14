// The season's arc, from the field guide. Phases drive the dashboard banner
// and give the Almanac its shape — edit ranges/focus text here only.

import { zonedToUtc } from '../lib/time'

export interface SeasonPhase {
  num: number
  title: string
  outcome: string
  focus: string
  icon: string
  start: Date
  end: Date
}

export const PHASES: SeasonPhase[] = [
  {
    num: 1,
    title: 'The Engine',
    outcome: 'Life Lv 30 · all six Basics at 5 · key income flowing',
    focus: 'All 20 commissions both weeks (unrecoverable!), spread Basic points evenly, farm expansion goals first, Bounty only on rubber/cobwebs/quartz.',
    icon: 'settings_suggest',
    start: zonedToUtc(2026, 8, 13, 7, 0),
    end: zonedToUtc(2026, 8, 27, 7, 0)
  },
  {
    num: 2,
    title: 'Specialize',
    outcome: 'One field to Lv 5 · sub-spec unlocked · Maistir application in',
    focus: 'Scout field crowding before committing, spend the 10 cheap evaluations on ONE field, start rare-material gathering, grind eval commissions early.',
    icon: 'alt_route',
    start: zonedToUtc(2026, 8, 27, 7, 0),
    end: zonedToUtc(2026, 9, 10, 7, 0)
  },
  {
    num: 3,
    title: 'Income',
    outcome: '~30 min/day · rank held every cycle · four revenue streams',
    focus: 'Run the loop, batch-craft your product line, tier-3+ barter weekly, re-grind commissions every cycle — incumbency beats casuals.',
    icon: 'paid',
    start: zonedToUtc(2026, 9, 10, 7, 0),
    end: zonedToUtc(2026, 11, 5, 7, 0)
  },
  {
    num: 4,
    title: 'Expand',
    outcome: 'Second income line · treasure-chest lottery · collections',
    focus: 'Ether Powder or second spec, open chests with surplus keys only, field-hop to soft fields, Season Collections with true surplus.',
    icon: 'trending_up',
    start: zonedToUtc(2026, 11, 5, 7, 0),
    end: zonedToUtc(2027, 1, 15, 7, 0)
  },
  {
    num: 5,
    title: 'Liquidate',
    outcome: 'Everything sold before the Feb 4 reset',
    focus: 'Sell all seasonal stock, even below peak — leftover rares become exchange fodder. Spend remaining keys on chests.',
    icon: 'sell',
    start: zonedToUtc(2027, 1, 15, 7, 0),
    end: zonedToUtc(2027, 2, 4, 7, 0)
  }
]

export function currentPhase(now: Date): SeasonPhase {
  return PHASES.find(p => now < p.end) ?? PHASES[PHASES.length - 1]
}

export function phaseProgress(phase: SeasonPhase, now: Date): number {
  const total = phase.end.getTime() - phase.start.getTime()
  return Math.min(1, Math.max(0, (now.getTime() - phase.start.getTime()) / total))
}
