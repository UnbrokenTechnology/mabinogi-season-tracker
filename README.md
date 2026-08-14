# Mabinogi Season Tracker 🌾

A tracker for Mabinogi's **NEW LIFE** seasonal content (Lughnasadh Season 1, Aug 13 2026 → Feb 4 2027):
Life Association commissions, Taillteann Farm routine, the key economy, and the Maistir treadmill.

Built with **Vue 3 + Quasar 2 + Vite**, persisted entirely in the browser's localStorage —
no backend, no accounts. Each person who opens the site gets their own independent data.

## Features

- **DST-aware server-time engine** (Pacific): daily 7 AM reset, Thursday weekly reset,
  biweekly Maistir evaluations (anchored Aug 27), the **midnight scoring cutoff**,
  first-Thursday barter rotation, environmental event windows (12:50 PM / 8:50 PM), season end.
- **Dashboard**: daily & weekly checklists (with your own custom tasks), counters
  (commissions 0/20, deliveries 0/6, cheers 0/3, env events 0/2, Bounty toggle),
  deadline rail with urgency colors, 14-day routine heat strip.
- **Strategy Planner**: the specialization decision explained neutrally — key-cost ladder,
  field-by-field pros/cons for all five Maistir fields, scouting advice — so each player
  can pick their own path. Your pick tailors the weekly checklist and milestone plan.
- **Progress**: Season Life Level, six Basic Expertises with the "all 5" gate flag,
  per-tree spec levels, lifetime evaluation counter, Life Goal unlock flags (2/5/7/15),
  Maistir evaluation history.
- **Ledgers**: key transactions with next-N-evaluation cost projection, and a gold/sales
  ledger that shows which product line earns most.
- **Backup**: JSON export/import in Settings.

## Development

```bash
npm install
npm run dev      # local dev server
npm test         # time-engine unit tests
npm run build    # production build to dist/
```

## Deployment

Pushing to `main` builds, tests, and deploys to GitHub Pages via `.github/workflows/deploy.yml`.
The app uses hash routing + relative asset paths, so it works from any subpath.

## Notes

- No game-client integration or automation of any kind — manual tracking only.
- Domain reference: `mabinogi_tracker_spec_1.md` and the printed field guide PDF in this repo.
