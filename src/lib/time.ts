// Time engine for Mabinogi NA server resets.
// Server time = America/Los_Angeles (DST-aware via Intl, no external deps).

export const SERVER_TZ = 'America/Los_Angeles'

export interface ZonedParts {
  year: number
  month: number // 1-12
  day: number
  hour: number
  minute: number
  second: number
  weekday: number // 0 = Sunday ... 6 = Saturday
}

const fmtCache = new Map<string, Intl.DateTimeFormat>()
function getFmt(tz: string): Intl.DateTimeFormat {
  let f = fmtCache.get(tz)
  if (!f) {
    f = new Intl.DateTimeFormat('en-US', {
      timeZone: tz,
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', second: '2-digit',
      hourCycle: 'h23', weekday: 'short'
    })
    fmtCache.set(tz, f)
  }
  return f
}

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export function getZonedParts(date: Date, tz: string = SERVER_TZ): ZonedParts {
  const map: Record<string, string> = {}
  for (const p of getFmt(tz).formatToParts(date)) map[p.type] = p.value
  return {
    year: +map.year, month: +map.month, day: +map.day,
    hour: +map.hour, minute: +map.minute, second: +map.second,
    weekday: WEEKDAYS.indexOf(map.weekday)
  }
}

/** Instant corresponding to wall-clock y-m-d h:min in tz. */
export function zonedToUtc(y: number, m: number, d: number, h = 0, min = 0, tz: string = SERVER_TZ): Date {
  let ts = Date.UTC(y, m - 1, d, h, min)
  for (let i = 0; i < 3; i++) {
    const p = getZonedParts(new Date(ts), tz)
    const asUtc = Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute, p.second)
    const want = Date.UTC(y, m - 1, d, h, min, 0)
    const diff = want - asUtc
    if (diff === 0) break
    ts += diff
  }
  return new Date(ts)
}

export type Ymd = [number, number, number]

export function addDaysYmd([y, m, d]: Ymd, days: number): Ymd {
  const t = new Date(Date.UTC(y, m - 1, d) + days * 86400000)
  return [t.getUTCFullYear(), t.getUTCMonth() + 1, t.getUTCDate()]
}

function ymdWeekday([y, m, d]: Ymd): number {
  return new Date(Date.UTC(y, m - 1, d)).getUTCDay()
}

function pad(n: number): string { return String(n).padStart(2, '0') }
export function ymdKey([y, m, d]: Ymd): string { return `${y}-${pad(m)}-${pad(d)}` }

// ---------------------------------------------------------------- constants

export const SEASON_START = zonedToUtc(2026, 8, 13, 7, 0)
export const SEASON_END = zonedToUtc(2027, 2, 4, 7, 0)
export const EVAL_ANCHOR: Ymd = [2026, 8, 27] // first Maistir evaluation Thursday
const RESET_HOUR = 7
const ENV_EVENT_TIMES: Array<[number, number]> = [[12, 50], [20, 50]]

// ---------------------------------------------------------------- daily

/** Calendar date (server tz) of the current "game day" (7 AM boundary). */
export function gameDayYmd(now: Date): Ymd {
  const p = getZonedParts(now)
  const ymd: Ymd = [p.year, p.month, p.day]
  return p.hour < RESET_HOUR ? addDaysYmd(ymd, -1) : ymd
}

export function dayKey(now: Date): string { return ymdKey(gameDayYmd(now)) }

export function nextDailyReset(now: Date): Date {
  return zonedToUtc(...addDaysYmd(gameDayYmd(now), 1), RESET_HOUR, 0)
}

// ---------------------------------------------------------------- weekly (Thu 7 AM)

/** Key = date of the Thursday that started the current game week. */
export function weekKey(now: Date): string {
  const day = gameDayYmd(now)
  const back = (ymdWeekday(day) - 4 + 7) % 7
  return ymdKey(addDaysYmd(day, -back))
}

export function nextWeeklyReset(now: Date): Date {
  const day = gameDayYmd(now)
  const back = (ymdWeekday(day) - 4 + 7) % 7
  return zonedToUtc(...addDaysYmd(day, 7 - back), RESET_HOUR, 0)
}

// ---------------------------------------------------------------- environmental events

export interface EnvWindow { at: Date; label: string }

/** Today's (game-day) event windows plus the first of the next day. */
export function envEventWindows(now: Date): EnvWindow[] {
  const day = gameDayYmd(now)
  const out: EnvWindow[] = []
  for (const d of [day, addDaysYmd(day, 1)]) {
    for (const [h, m] of ENV_EVENT_TIMES) {
      out.push({ at: zonedToUtc(...d, h, m), label: `${((h + 11) % 12) + 1}:${pad(m)} ${h >= 12 ? 'PM' : 'AM'}` })
    }
  }
  return out
}

export function nextEnvEvent(now: Date): EnvWindow {
  return envEventWindows(now).find(w => w.at.getTime() > now.getTime())!
}

/** The two windows belonging to the current game day (for done/missed UI). */
export function todaysEnvWindows(now: Date): EnvWindow[] {
  const day = gameDayYmd(now)
  return ENV_EVENT_TIMES.map(([h, m]) => ({
    at: zonedToUtc(...day, h, m),
    label: `${((h + 11) % 12) + 1}:${pad(m)} ${h >= 12 ? 'PM' : 'AM'}`
  }))
}

// ---------------------------------------------------------------- biweekly evaluation

/** Next evaluation-resolution instant (alt. Thursdays 7 AM, anchored Aug 27 2026). */
export function nextEvalResolve(now: Date): Date {
  for (let k = 0; k < 60; k++) {
    const t = zonedToUtc(...addDaysYmd(EVAL_ANCHOR, k * 14), RESET_HOUR, 0)
    if (t.getTime() > now.getTime()) return t
  }
  throw new Error('unreachable')
}

/** Scoring cutoff = midnight (00:00 server time) of the given eval Thursday. */
export function scoringCutoffFor(evalResolve: Date): Date {
  const p = getZonedParts(evalResolve)
  return zonedToUtc(p.year, p.month, p.day, 0, 0)
}

export function nextScoringCutoff(now: Date): Date {
  for (let k = 0; k < 60; k++) {
    const t = scoringCutoffFor(zonedToUtc(...addDaysYmd(EVAL_ANCHOR, k * 14), RESET_HOUR, 0))
    if (t.getTime() > now.getTime()) return t
  }
  throw new Error('unreachable')
}

/** 0-based index of the current biweekly cycle (cycle k ends at resolve k). */
export function evalCycleIndex(now: Date): number {
  for (let k = 0; k < 60; k++) {
    const t = zonedToUtc(...addDaysYmd(EVAL_ANCHOR, k * 14), RESET_HOUR, 0)
    if (t.getTime() > now.getTime()) return k
  }
  return 60
}

export function biweekKey(now: Date): string { return `cycle-${evalCycleIndex(now)}` }

// ---------------------------------------------------------------- monthly barter rotation

function firstThursday(y: number, m: number): Ymd {
  for (let d = 1; d <= 7; d++) {
    if (ymdWeekday([y, m, d]) === 4) return [y, m, d]
  }
  throw new Error('unreachable')
}

export function nextBarterRotation(now: Date): Date {
  const p = getZonedParts(now)
  for (let i = 0; i < 3; i++) {
    let y = p.year, m = p.month + i
    while (m > 12) { m -= 12; y += 1 }
    const t = zonedToUtc(...firstThursday(y, m), RESET_HOUR, 0)
    if (t.getTime() > now.getTime()) return t
  }
  throw new Error('unreachable')
}

/** Barter month key: which rotation period we are in (keyed by its first-Thursday date). */
export function barterMonthKey(now: Date): string {
  const p = getZonedParts(now)
  // walk back until we find the most recent first-Thursday 7AM <= now
  for (let i = 0; i < 3; i++) {
    let y = p.year, m = p.month - i
    while (m < 1) { m += 12; y -= 1 }
    const ft = firstThursday(y, m)
    if (zonedToUtc(...ft, RESET_HOUR, 0).getTime() <= now.getTime()) return ymdKey(ft)
  }
  return 'pre-season'
}

// ---------------------------------------------------------------- formatting

export function formatDuration(ms: number): string {
  if (ms <= 0) return 'now'
  const s = Math.floor(ms / 1000)
  const d = Math.floor(s / 86400)
  const h = Math.floor((s % 86400) / 3600)
  const m = Math.floor((s % 3600) / 60)
  const sec = s % 60
  if (d > 0) return `${d}d ${h}h`
  if (h > 0) return `${h}h ${m}m`
  if (m > 0) return `${m}m ${sec}s`
  return `${sec}s`
}

export type Urgency = 'past' | 'red' | 'amber' | 'neutral'

export function urgency(msRemaining: number): Urgency {
  if (msRemaining < 0) return 'past'
  if (msRemaining < 24 * 3600000) return 'red'
  if (msRemaining < 72 * 3600000) return 'amber'
  return 'neutral'
}

export function formatInZone(date: Date, tz: string): string {
  return new Intl.DateTimeFormat('en-US', {
    timeZone: tz, weekday: 'short', month: 'short', day: 'numeric',
    hour: 'numeric', minute: '2-digit'
  }).format(date)
}

export function formatClock(date: Date, tz: string): string {
  return new Intl.DateTimeFormat('en-US', {
    timeZone: tz, hour: 'numeric', minute: '2-digit', second: '2-digit'
  }).format(date)
}
