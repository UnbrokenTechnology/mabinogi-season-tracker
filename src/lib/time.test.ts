import { describe, it, expect } from 'vitest'
import {
  zonedToUtc, dayKey, weekKey, nextDailyReset, nextWeeklyReset,
  nextEvalResolve, nextScoringCutoff, scoringCutoffFor, nextBarterRotation,
  nextEnvEvent, evalCycleIndex, barterMonthKey, formatDuration, urgency
} from './time'

// PDT = UTC-7 (until Nov 1 2026, 2 AM), PST = UTC-8 afterwards.

describe('zonedToUtc', () => {
  it('handles PDT (Aug 2026)', () => {
    expect(zonedToUtc(2026, 8, 20, 7, 0).toISOString()).toBe('2026-08-20T14:00:00.000Z')
  })
  it('handles PST (Dec 2026)', () => {
    expect(zonedToUtc(2026, 12, 3, 7, 0).toISOString()).toBe('2026-12-03T15:00:00.000Z')
  })
  it('handles midnight cutoffs', () => {
    expect(zonedToUtc(2026, 8, 27, 0, 0).toISOString()).toBe('2026-08-27T07:00:00.000Z')
  })
})

describe('daily reset / day key', () => {
  it('before 7 AM server counts as previous game day', () => {
    // 2026-08-20 06:59 PDT = 13:59 UTC
    expect(dayKey(new Date('2026-08-20T13:59:00Z'))).toBe('2026-08-19')
    expect(dayKey(new Date('2026-08-20T14:00:00Z'))).toBe('2026-08-20')
  })
  it('next daily reset is tomorrow 7 AM server', () => {
    expect(nextDailyReset(new Date('2026-08-20T14:00:00Z')).toISOString()).toBe('2026-08-21T14:00:00.000Z')
    expect(nextDailyReset(new Date('2026-08-20T13:59:00Z')).toISOString()).toBe('2026-08-20T14:00:00.000Z')
  })
  it('spans the DST fall-back (Nov 1 2026)', () => {
    // Oct 31 2026 10:00 PDT (17:00Z) -> next reset Nov 1 7 AM PST = 15:00Z
    expect(nextDailyReset(new Date('2026-10-31T17:00:00Z')).toISOString()).toBe('2026-11-01T15:00:00.000Z')
  })
})

describe('weekly reset (Thu 7 AM)', () => {
  it('week key is the Thursday that started the week', () => {
    expect(weekKey(new Date('2026-08-20T14:00:00Z'))).toBe('2026-08-20') // Thu after reset
    expect(weekKey(new Date('2026-08-20T13:00:00Z'))).toBe('2026-08-13') // Thu before reset
    expect(weekKey(new Date('2026-08-25T20:00:00Z'))).toBe('2026-08-20') // Tuesday
  })
  it('next weekly reset', () => {
    expect(nextWeeklyReset(new Date('2026-08-25T20:00:00Z')).toISOString()).toBe('2026-08-27T14:00:00.000Z')
    expect(nextWeeklyReset(new Date('2026-08-20T13:00:00Z')).toISOString()).toBe('2026-08-20T14:00:00.000Z')
  })
})

describe('biweekly evaluation', () => {
  it('sequence: Aug 27, Sep 10, Sep 24...', () => {
    expect(nextEvalResolve(new Date('2026-08-14T00:00:00Z')).toISOString()).toBe('2026-08-27T14:00:00.000Z')
    expect(nextEvalResolve(new Date('2026-08-27T14:00:01Z')).toISOString()).toBe('2026-09-10T14:00:00.000Z')
    expect(nextEvalResolve(new Date('2026-09-11T00:00:00Z')).toISOString()).toBe('2026-09-24T14:00:00.000Z')
  })
  it('crosses DST: Nov 5 2026 eval resolves at 15:00Z (PST)', () => {
    expect(nextEvalResolve(new Date('2026-10-23T00:00:00Z')).toISOString()).toBe('2026-11-05T15:00:00.000Z')
  })
  it('scoring cutoff is midnight server time of eval Thursday', () => {
    const resolve = nextEvalResolve(new Date('2026-08-14T00:00:00Z'))
    expect(scoringCutoffFor(resolve).toISOString()).toBe('2026-08-27T07:00:00.000Z')
    // after cutoff but before resolve, next cutoff is the following cycle's
    expect(nextScoringCutoff(new Date('2026-08-27T08:00:00Z')).toISOString()).toBe('2026-09-10T07:00:00.000Z')
  })
  it('cycle index advances at resolve time', () => {
    expect(evalCycleIndex(new Date('2026-08-20T00:00:00Z'))).toBe(0)
    expect(evalCycleIndex(new Date('2026-08-27T14:00:01Z'))).toBe(1)
  })
})

describe('barter rotation (first Thursday monthly)', () => {
  it('sequence: Sep 3, Oct 1, Nov 5, Dec 3, Jan 7, Feb 4', () => {
    expect(nextBarterRotation(new Date('2026-08-14T00:00:00Z')).toISOString()).toBe('2026-09-03T14:00:00.000Z')
    expect(nextBarterRotation(new Date('2026-09-03T14:00:01Z')).toISOString()).toBe('2026-10-01T14:00:00.000Z')
    expect(nextBarterRotation(new Date('2026-10-02T00:00:00Z')).toISOString()).toBe('2026-11-05T15:00:00.000Z')
    expect(nextBarterRotation(new Date('2026-12-25T00:00:00Z')).toISOString()).toBe('2027-01-07T15:00:00.000Z')
  })
  it('month key is the governing first-Thursday', () => {
    expect(barterMonthKey(new Date('2026-09-10T00:00:00Z'))).toBe('2026-09-03')
    expect(barterMonthKey(new Date('2026-10-02T00:00:00Z'))).toBe('2026-10-01')
  })
})

describe('environmental events', () => {
  it('finds next window (12:50 / 8:50 PM server)', () => {
    // 2026-08-20 10:00 PDT = 17:00Z -> next is 12:50 PDT = 19:50Z
    expect(nextEnvEvent(new Date('2026-08-20T17:00:00Z')).at.toISOString()).toBe('2026-08-20T19:50:00.000Z')
    // 2026-08-20 21:00 PDT -> next is tomorrow 12:50
    expect(nextEnvEvent(new Date('2026-08-21T04:00:00Z')).at.toISOString()).toBe('2026-08-21T19:50:00.000Z')
  })
})

describe('formatting', () => {
  it('formatDuration', () => {
    expect(formatDuration(2 * 86400000 + 3 * 3600000)).toBe('2d 3h')
    expect(formatDuration(5 * 3600000 + 30 * 60000)).toBe('5h 30m')
    expect(formatDuration(90000)).toBe('1m 30s')
  })
  it('urgency thresholds', () => {
    expect(urgency(-1)).toBe('past')
    expect(urgency(3600000)).toBe('red')
    expect(urgency(48 * 3600000)).toBe('amber')
    expect(urgency(100 * 3600000)).toBe('neutral')
  })
})
