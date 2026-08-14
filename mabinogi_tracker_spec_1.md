# Mabinogi NEW LIFE Season Tracker — Project Spec & Game Reference

> **Purpose:** Feed this file to Claude Code as the project brief + domain reference for building
> a personal tracking tool for Mabinogi's Lughnasadh Season 1 (Life Association / Taillteann Farm /
> Maistir system). Everything Claude Code needs to know about the game systems is in this document —
> no external lookups required for v1.

---

## 1. Project Goal

Build a **local web app** ("Mabinogi Season Tracker") that helps me manage the daily/weekly/biweekly
routines, resource budgets, and deadlines of Mabinogi's NEW LIFE seasonal content, so nothing capped
or time-gated is ever missed.

**User:** single user (me), single character, one season at a time (current: Lughnasadh Season 1,
Aug 13 2026 → Feb 4 2027).

**Primary value:** answer at a glance —
1. What do I still need to do **today**?
2. How many **commissions** remain this week?
3. What's my **key** balance and what's the next evaluation going to cost?
4. When is the **next deadline** (evaluation midnight cutoff, barter rotation, season end)?
5. Am I on pace vs. my milestone plan?

**Preferred stack (matches my experience, negotiable):** Vue 3 + Vite + Quasar 2 frontend,
AdonisJS 6 backend, SQLite storage. A simpler single-page app with local persistence is acceptable
for v1 if it ships faster. No auth needed. Runs on localhost.

---

## 2. Critical Time Logic (build this first — everything depends on it)

All resets use **Mabinogi NA server time = Pacific Time (America/Los_Angeles)**, DST-aware.
Display countdowns in both server time and my local time (America/New_York).

| Event | Schedule (server time) | Tracker behavior |
|---|---|---|
| Weekly reset | Thursday 7:00 AM | Reset weekly counters (commissions 0/20, weekly repeat quests) |
| Daily reset | 7:00 AM | Reset daily counters (Bounty, deliveries 0/6, cheers 0/3, tending log) |
| Environmental events | 12:50 PM and 8:50 PM daily, max 2/day | Two daily "event windows" with countdown + done/missed state |
| Maistir evaluation resolves | Every other Thursday 7:00 AM (anchor: Aug 27, 2026) | Biweekly cycle tracker |
| **Maistir scoring cutoff** | **Midnight (12:00 AM) the day of evaluation Thursday** — NOT 7 AM | High-priority warning countdown; escalate visual urgency final 48h |
| Barter rotation | First Thursday of each month, 7:00 AM | "Re-check barter list" recurring task; clears my saved recipe-priority notes for re-verify |
| Season end | Feb 4, 2027 7:00 AM | Season countdown; from Jan 15 show "LIQUIDATE" banner |
| Crop Thief | 12:00 AM Erinn time nightly (flavor) | Optional; low priority |

**Erinn time note:** 1 Erinn day = 36 real minutes; not needed for v1 accuracy, skip unless trivial.

---

## 3. Game Systems Reference (domain model)

### 3.1 Season Life Level & Basic Expertise
- Season Life EXP ONLY from commission quests: **max 20/week** (gathering via NPC Folla, deliveries via NPC Tyrone). Week 1 of full commissions ≈ Level 21; two full weeks ≈ Level 30 (cap 30).
- Leveling grants **Basic Life Points** → spent on 6 **Basic Expertise Effects**: Animal, Plant, Mineral, Health, Fiber, Engineering (each caps Level 5).
- **All six at Level 5** is the hard gate to unlock Specializations.
- Everything resets at season end.

### 3.2 Specializations
Nine trees, all available simultaneously (no exclusive choice):
- **Gathering:** Ranching (Milking/Egg/Shearing), Farming (Harvesting/Hoeing), Foraging (Mushroom/Herbalism/Shyllien), Earthworks (Mining/Metallurgy/Rare Mineralogy)
- **Crafting (Maistir-eligible):** Food, Medicine, Textiles, Metalworking, Craftworks
- Specialization Points come ONLY from **Krom's evaluations**, which cost **Life Association Keys** on a shared escalating ladder:

| Evaluation # (lifetime, shared across ALL trees) | 1–10 | 11–20 | 21–50 | 51–90 | 91+ |
|---|---|---|---|---|---|
| Keys per evaluation | 1 | 2 | 3 | 5 | 10 |

- Spec Level 5 unlocks **Sub-Specializations** (rare material gathering, exclusive recipes, special actions). Cooking sub-spec Level 1+ = Fresh Food (required for Seasonal Dishes).
- One **free full reset** per season (individual resets cost Pon — premium).

### 3.3 Keys (the central scarce resource — build a ledger)
**Sources:** daily processed-goods deliveries (3+3 = 6/day), Association Deliveries, Season Life Goals.
**Sinks:** Krom evaluations (ladder above), Magic Cauldron recipe unlocks, Treasure Chests (1 each).
**Rule I follow:** never unlock a cauldron recipe without first verifying it against the server's
current Iria barter list (rotates monthly, differs per server).

### 3.4 Taillteann Farm
- Crops: Blackberries, Okra, Jasmine, Red Pear, Rubber, Magic Cobwebs, Quartz. Seeds from NPC Blatt or Handicraft.
- **Bounty:** refills daily 7 AM; cuts growth time 80%; boosts tending (+9 vs +5/action). My priority: **Rubber → Magic Cobwebs → Quartz** (longest timer / 1-per-harvest).
- **Energy:** 1 regenerates per 3 real minutes; 1 energy = −1 min on crop/cauldron/delivery timers. Cheering: give 3/day, receive 5/day.
- **Tending Score → quality:** 0–39 Common, 40–69 Fine, 70–100 Finest. Weather-compatible crops tend better.
- **Environmental events** (12:50 PM / 8:50 PM, 2/day): success = big score boost to ALL planted crops. **Mono-crop trick:** plant only the delivery-target crop before an event to mass-produce Fine/Finest.
- Delivery quality bonus: **+30 coins Fine, +70 Finest**.
- **4 Magic Cauldrons** craft items (Brilliance / Abundance / Delicacy / Tenderness sets) used for barter, deliveries, goals, collections. Recipes unlock with keys. Crop quality does NOT affect cauldron output.
- **Season Life Goals:** Farm Expansion track (plots, Red Pear Trees, **Rubber Trees ×2 — priority**) and Life Goals (coins, farm move speed to +44%; #30 gives a Movement Totem). 2/5/7 goals unlock Novice/Adept/Expert weekly repeat quests. **15 goals unlock Treasure Chests** (found while harvesting, 1 key to open, 300K–50M gold).

### 3.5 Maistir System
- Eligibility: Level 5 in one crafting spec; apply via Krom.
- Score = best Dan (Advancement) test score + Association Evaluation Commissions during the 2-week window.
- Ranks by percentile per field: Maistir top 10%, Virtuoso 10–25%, Expert 25–45%, Adept 45–70%, Amateur = all. **Minimum 20 slots each for Maistir and Virtuoso regardless of field size.**
- Rank persists until next evaluation (biweekly treadmill).
- Key Maistir products (my Food plan): weekly **Seasonal Dishes** (10 rotating seasonal ingredients, effect groups incl. Combat EXP +20%), **Physique-Preserving Mushroom Stew** (rebirth market). Side interest: **Ether Powder** via Magic Craft Lv 5 (no rank needed; feeds Equipment Tuning; 30-day expiry).
- Dan test facts: entry = skill Rank 1 + 100 training points; fees 10K/20K/30K gold for Dan 1/2/3; Dan 0→1 needs one A, 1→2 two S, 2→3 two SS.

### 3.6 Commerce / Barter
- Barter tiers 1–2 use conventional materials; **tiers 3–5 require farm/cauldron/specialization goods** — this is the main gold engine.
- Requirements **differ per server** and **rotate the first Thursday monthly**.
- 30-day expiry items to track: Food Preservative, Commerce Expansion Cover, Commerce Floating Stone, Cairbre's Bugle (blessed), Ether Powder.

### 3.7 My Strategy Milestones (pre-load as plan data)
| Target date | Milestone |
|---|---|
| Aug 20 | Farm running, ~Lv 21, expansion goals underway, rubber trees queued |
| Aug 27 | Lv 30, six Basics Lv 5, Food spec started, evaluation application submitted |
| Sep 10 | Food Lv 5, Cooking sub-spec, first Maistir/Virtuoso result |
| Oct 1 | Seasonal Dish + stew sales steady, tier-3+ barter flowing |
| Nov+ | Rank held 3+ cycles, Ether Powder line or 2nd spec, chest lottery |
| Late Jan | Liquidation of all seasonal stock before Feb 4 reset |

---

## 4. Feature Requirements

### 4.1 Dashboard (home view) — MVP
- **Today panel:** daily checklist auto-generated from templates (see 4.2) with checkbox state; countdown chips to next environmental event window; daily counters: deliveries 0/6, cheers given 0/3, Bounty used toggle.
- **Week panel:** commissions counter 0/20 (big, prominent), weekly repeat quests (unlocked at 2/5/7 life goals — conditional display), days until Thursday reset.
- **Deadline rail:** next Maistir scoring cutoff (midnight!), next evaluation result, next barter rotation, season end. Sort by proximity; color escalate <48h.
- **Key ledger widget:** current balance, next-evaluation cost (computed from lifetime evaluation count vs. the ladder), quick +/- entry.

### 4.2 Recurring task engine — MVP
- Task templates with recurrence: daily (reset 7 AM PT), weekly (Thu 7 AM PT), biweekly (anchored Aug 27), monthly (first Thu).
- Seed data = my routine: [daily] Bounty-plant priority crops · tend on prompt · 1–2 environmental events · 6 processed deliveries · cheer ×3 · queue rubber on logout; [weekly] 20 commissions · repeat quests · cook Seasonal Dishes · stock stew · run tier-3+ barter; [biweekly] evaluation commission grind reminder starting 4 days before cutoff; [monthly] re-verify barter list before any recipe unlock.
- Missed-day history (simple calendar heat strip is enough).

### 4.3 Progress trackers — MVP
- Season Life Level (1–30) with EXP-source note (auto-suggest from commissions logged).
- Basic Expertise 6× (0–5 each) with "gate met" indicator when all = 5.
- Specializations: per-tree level (0–5) + sub-spec levels; lifetime evaluation counter driving the key-cost calculator.
- Life Goals count (0–30+) with unlock flags at 2/5/7/15 (weekly quests, treasure chests).
- Maistir: current rank per field, evaluation history (date, field, rank, notes).

### 4.4 Key & gold ledger — MVP
- Transaction log: date, amount (+/−), source/sink (enum: delivery, goal, evaluation, recipe unlock, chest), note.
- Running balance; projected cost of "next N evaluations."
- Gold tracker (optional simple ledger) for sales: item, qty, price, buyer note — enough to see which product line earns most.

### 4.5 Nice-to-have (v2, only after MVP)
- Farm plot timer board: enter crop + start time → harvest ETA (needs my in-game timing observations; store per-crop durations as editable settings since values aren't in patch notes).
- 30-day expiry tracker for crafted consumables (craft date → expiry countdown).
- Barter month notes: paste this month's server list; link cauldron recipes to it; "safe to unlock" checklist.
- Seasonal Dish week log: this week's 10 ingredients + active effect group + what I listed and at what price.
- Export/import JSON backup.

### 4.6 Explicit non-goals
- No game-client integration, memory reading, or automation of any kind (ToS).
- No multi-user, no cloud, no mobile app (responsive web is fine).
- No auction-house price scraping.

---

## 5. Data Model Sketch (adjust freely)

```
Season(id, name, start_at, end_at, eval_anchor_date)
TaskTemplate(id, title, detail, cadence[daily|weekly|biweekly|monthly], sort, active)
TaskInstance(id, template_id, due_date, completed_at)
CounterDef(id, name, cap, cadence)            -- commissions/20wk, deliveries/6d, cheers/3d
CounterEntry(id, counter_id, period_key, value)
ProgressItem(id, kind[life_level|basic|spec|subspec|life_goals], key, value, max)
KeyTxn(id, at, delta, category, note)
EvaluationRecord(id, date, field, rank, notes)
GoldTxn(id, at, delta, item, qty, note)
ExpiryItem(id, name, crafted_at, expires_at)   -- v2
Setting(key, value)                            -- server_tz, local_tz, crop_durations json
```

Derived values (compute, don't store): key balance, next-eval key cost from ladder
`[1..10→1, 11..20→2, 21..50→3, 51..90→5, 91+→10]`, next reset datetimes, countdowns,
"all basics = 5" gate flag, unlock flags at 2/5/7/15 life goals.

---

## 6. UI Notes
- Information-dense, single-screen dashboard; dark green/gold/parchment palette (green = routine,
  gold = economy, red = deadlines) to match my printed field guide.
- Deadline urgency: neutral → amber <72h → red <24h; the **midnight scoring cutoff** always outranks
  other deadlines in placement.
- Everything editable inline; no modals for common actions; keyboard-friendly.

## 7. Build Order Suggestion
1. Time engine (PT resets, biweekly anchor, countdowns) with unit tests — the whole app hangs on this.
2. Dashboard + recurring tasks with seed data.
3. Counters (commissions, deliveries, cheers) with auto-reset.
4. Key ledger + evaluation-cost calculator.
5. Progress trackers + unlock flags.
6. v2 items as separate milestones.

*Reference sources: NA patch notes Aug 13 2026 ("New Life" update), KR server meta (arca.live
week-1 guide by a top-100 barter trader, NamuWiki NEW LIFE), Mabinogi World Wiki (Dan tests).*
