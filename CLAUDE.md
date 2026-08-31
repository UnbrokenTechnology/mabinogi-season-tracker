# Mabinogi Season Tracker — project guide

Tracker for Mabinogi's Lughnasadh Season 1 (Aug 13 2026 → Feb 4 2027, "NEW LIFE" update).
Two users (Stephanie + husband) use the same site independently — all state is per-browser
localStorage, no backend, no accounts.

- **Live:** https://unbrokentechnology.github.io/mabinogi-season-tracker/
- **Repo:** https://github.com/UnbrokenTechnology/mabinogi-season-tracker (org: UnbrokenTechnology)
- **Deploy:** push to `main` → GitHub Actions (`.github/workflows/deploy.yml`) runs tests, builds, deploys Pages. Nothing manual.
- **Domain reference:** `mabinogi_tracker_spec_1.md` (full spec + game data) and `mabinogi_lughnasadh_field_guide.pdf` (the print guide the visual theme is copied from; extract text via pypdf, render pages via pymupdf — poppler is NOT installed).

## Stack & commands

Vue 3 + Quasar 2 via `@quasar/vite-plugin` (NOT Quasar CLI) + Pinia (+ persistedstate v4) + vue-router (hash mode) + Vitest.

```
npm run dev / build / preview / test
```

`vite.config.ts`: `base: './'` + hash routing = works on any Pages subpath. sassVariables needs an **absolute path** (fileURLToPath).

## Architecture

- `src/lib/time.ts` — DST-aware Pacific server-time engine. Everything hangs on this; it has 17 Vitest tests (`time.test.ts`). Key exports: `dayKey`/`weekKey`/`biweekKey`/`barterMonthKey` (period keys), `nextDailyReset`/`nextWeeklyReset`/`nextEvalResolve`/`nextScoringCutoff` (midnight before eval Thursday — NOT 7 AM)/`nextBarterRotation` (first Thu monthly), `SEASON_START`/`SEASON_END`, eval anchor Aug 27 2026.
- `src/lib/useNow.ts` — single shared 1s ticking clock composable.
- **Stores** (`src/stores/`, all `persist: true`): `profile` (strategy picks incl. `primaryField`, `nightMode`), `progress` (levels, specs, evalCount → key-cost ladder, lifeGoals unlock flags, maistirHistory), `counters` (period-keyed logs — counters "reset" by reading the current period key; history feeds the Almanac; has an `afterHydrate` migration from the old single-bucket shape), `tasks` (template completions keyed templateId→periodKey, custom tasks, `visibleTasks` filters by profile/progress conditions), `ledger` (key + gold transactions, timestamps drive Almanac weekly nets), `market` (one flat AH price map keyed by cauldron.ts ids — materials AND recipe outputs share it — plus `feePct`, default 4% per user).
- **Game data / copy** (`src/data/`) — ALL user-facing game text lives here, never inline in components: `tasks.ts` (seed task templates + conditions + optional `help` key, milestones), `fields.ts` (specialization decision guide, key ladder), `help.ts` (every ?-popover, keyed by topic), `goldGuide.ts` (KR-trend revenue streams + principles), `season.ts` (5 season phases), `cauldron.ts` (7 farm materials + all 20 Magic Cauldron recipes with inputs/unlock keys/minutes/barter flags — wiki-verified Aug 30 2026 from per-item `Template:Data...` raw wikitext; unlock keys sum to 40/cauldron, matching the known figure).
- **Help system**: `<HelpTip topic="key" [light]>` looks up `HELP[topic]` → popover with optional router links. `light` variant for use inside green bars. Add topics in `help.ts` only.
- **Pages**: Dashboard (chips, phase banner, counter dials, 4 checklists, heat strip, DeadlineRail, KeyLedgerWidget), Planner (strategy/spec chooser — tailors tasks & milestones), Progress, GoldGuide (dims streams the user's build can't run), MaistirGuide (`/maistir` — path-to-rank steps, rank tiers, KR treadmill rules, currency cards + spend-priority tiers + permanent-vs-temporary card; data in `maistirGuide.ts`, lines render "Lead — detail" with bold lead), Market (`/market` — cauldron craft-profit calculator: enter each material price once + per-recipe sell prices, profit = sell×(1−fee)−materials via `src/lib/market.ts` (Vitest-covered); table rows stay in unlock order so inputs don't jump while typing — best row is gold-highlighted, winners surface in the "Best right now" bar), Almanac (per-week archive derived from counters/tasks/ledger — nothing extra tracked), Ledger, Settings (JSON export/import, reset).
- **Open facts to pin when confirmed in-game** (marked unverified in `maistirGuide.ts` copy): whether Maistir evaluation re-entry is automatic after the first Krom application; whether keys/coins wipe at season end (NOT stated in NA notes or the raw KR Dec 11 notice — a summarizer model hallucinated "confirmed reset" once; keep "assume wipe"); Dan-rank permanence across seasons (inference: yes).
- **Verified Aug 14 2026 against full NA patch notes + wiki + raw KR notice** (don't re-litigate): key ladder semantics — KR original reads "10회까지 1개" so evals #1–10 cost 1 key and `evalKeyCost` is CORRECT (NA's "Evaluations Taken 0–10" is loose translation, NOT an off-by-one); cauldron unlocks 40 keys/cauldron, 160 total, re-cost each season (wiki explicit); keys shop-sell 25K, untradable, bankable; min-20 seats official for BOTH Maistir and Virtuoso; forfeited commissions lock out until next week; hidden commissions 1 key→5 EXP (wiki: "not recommended"); 18 Grade-A commissions exist → perfect week 2,900 EXP; env event success grants 1 key; seasonal-dish effect GROUP rotates weekly, dish rolls 1 of the group's 3 effects; barter goods have weekly per-good exchange caps (reset Thu 7 AM) and the monthly rotation pick is random (can repeat). KR economy retrospective: barter held ~3M/wk (casual, Ducats) to ~10M/wk (full) all season; farming direct gold, treasure-chest RNG, and seasonal-dish buff value were the community's "flops."

## Theme (matches the printed field guide)

- Palette + fonts: parchment/forest-green/gold/crimson; Cormorant Garamond display + Lato body (self-hosted via @fontsource, imported in `main.ts`).
- Everything flows through CSS custom properties defined on `body` in `src/css/app.sass`; `body.body--dark` overrides them (night mode = `profile.nightMode` → `Dark.set` in App.vue). Never hardcode colors in components — use `var(--fg-*)` or the `fg-*` utility classes (`fg-card`, `fg-bar` green header bars, `fg-eyebrow`/`fg-label` letterspaced caps, `fg-gold-badge`, `fg-callout-red`, `fg-section` numbered headers, `fg-zebra`, tint classes).
- Quasar brand colors in `src/quasar-variables.sass`.

## Gotchas learned the hard way

- **QCircularProgress renders NO track ring unless `track-color` is set** to a real palette color (source: `props.trackColor !== void 0 && !== 'transparent'`). Theme it via `:deep(.q-circular-progress__track) { color: var(--fg-card-border) !important }`.
- **Browser caches `index.html` on the preview server** — after rebuilds, hard reload (ctrl+shift+r) before concluding a change didn't work.
- **PowerShell 5.1 `Get-Content`/`Set-Content` mangles UTF-8** (em-dashes → mojibake). For bulk text transforms use `[System.IO.File]::ReadAllText/WriteAllText` with `UTF8Encoding($false)`.
- pinia-plugin-persistedstate v4 requires pinia 3; migration hook is `persist.afterHydrate`.
- Changing a store's state shape: add an `afterHydrate` migration (see `counters.ts`) — both users have live data.
- KR sources: arca.live and namu.wiki block WebFetch (403); mabinogi.dev returns empty. Use WebSearch summaries + official KR notices (m.mabinogi.nexon.com). Label unverified KR market claims as trends to verify, not facts.
- **Research access tricks (re-verified Aug 14 2026):** arca.live posts AND its search (`arca.live/b/mabi?target=all&keyword=X`) are readable via `https://r.jina.ai/<url>`; dcinside is NOT anymore (desktop and mobile both return empty through the proxy); namu.wiki never was. Full NA patch notes: Steam news API `api.steampowered.com/ISteamNews/GetNewsForApp/v2/?appid=212200&maxlength=0` (nexon.com news pages are JS shells; match `title ==` exactly — "New Life Update" also matches the livestream item). Mabinogi World Wiki 403s WebFetch but serves raw wikitext to `Invoke-WebRequest` with a browser UA via `index.php?title=X&action=raw` (find pages via `api.php?action=opensearch`). KR official notices: fetch `m.mabinogi.nexon.com/m/news/notice_view.asp?id=N` raw with `Invoke-WebRequest` and decode euc-kr yourself — WebFetch's summarizer model hallucinates "exact quotes" on these (it once invented a key-ladder table AND a season-end reset), so always confirm numbers in the raw HTML.

## Domain rules that shape features

- Server time = America/Los_Angeles. Daily reset 7 AM, weekly Thu 7 AM, eval biweekly (anchor Aug 27), **Maistir scoring cutoff = midnight before eval Thursday**, barter rotation first Thu monthly, env events 12:50 PM / 8:50 PM (max 2/day).
- Key-cost ladder (lifetime, shared across trees): evals 1–10→1, 11–20→2, 21–50→3, 51–90→5, 91+→10.
- Life Goal unlocks: 2/5/7 weekly repeat quests, 15 treasure chests. Basics gate: all six at Lv 5 → specs.
- No game-client integration/automation ever (ToS). No auction-house scraping.
