---
id: ABC-086
title: Deterministic move selection under a fixed seed
status: backlog
column: Backlog
size: S
priority: P0
epic: EPIC-004
feature: —
---

# ABC-086 — the epic's fifth criterion, and the thing that makes every other test possible

> **Cut 2026-08-16 by BA/PM** (task `epic-to-tickets-EPIC-004`, Workflow 03). Cut early and `P0`
> despite looking like a nicety, because **`ABC-084` `A4` and `ABC-085` `A5` both depend on it** and
> a non-reproducible engine cannot be regression-tested at all.

## Problem

*User*: everyone — the player who wants to replay a game, and every test in this epic.

*Pain*: **two things in this epic are non-deterministic by construction.** (a) The per-move budget is
a **wall clock** (`ABC-078`, `RISK-002`'s non-negotiable constraint) — the same position searched
twice reaches different depths depending on machine load, so **the same position can produce
different moves**. (b) `ABC-087`'s blunder rate is randomness on purpose.

*Value*: the epic's fifth acceptance criterion — *"Given the same position and the same difficulty
twice, when the engine searches, then the chosen move is reproducible under a fixed seed."*

## The tension this ticket has to resolve, stated plainly

**A wall-clock budget and reproducibility are in direct conflict, and the constraint that creates the
conflict is non-negotiable.** `RISK-002`'s ruling stands: the budget stays time-based. So
reproducibility cannot be bought by fixing the depth — **that would violate a survived spike
constraint**, and this ticket must not be read as a licence to do it.

**The resolution: reproducibility is a property of a stated mode, not of the shipped default.** The
engine takes an injected **time source** and an injected **seed**. Under a *deterministic mode* —
fixed seed and a **deterministic budget** (a node budget or an injected clock, not a real one) — the
engine is exactly reproducible. Under the shipped wall-clock default, the **seed** still makes tie
breaking and the blunder draw reproducible, but the reached depth is not guaranteed. **`A1` and `A2`
separate these two claims so neither is over-sold.**

**This shape is BA/PM's reading of the criterion, and the search architecture behind it is
Architect/Design's.** If Architect/Design rules a different construction, the criteria below are
what must still hold.

## Scope

- An **injected seed** driving every random choice in the engine (tie breaking among equal-scoring
  moves; `ABC-087`'s blunder draw).
- An **injected time source**, so a test can supply a deterministic clock.
- A **deterministic mode** — fixed seed plus a deterministic budget — under which move selection is
  exactly reproducible.
- Tie breaking made **explicit and seeded**, rather than falling out of move-generation order.

## Out of scope

- **Fixing the search depth**, or making the shipped default budget anything other than wall-clock
  time. **`RISK-002`, non-negotiable.**
- **The blunder mechanism itself** — `ABC-087`. This ticket makes its randomness *seeded*; that
  ticket decides what it does.
- **Choosing the PRNG.** Any small seeded generator; not a decision worth a ticket. **No new
  dependency** — `AGENTS.md` safety rule.

## Acceptance (Given/When/Then)

- **`A1` (exact reproducibility in deterministic mode).** **Given** the same position, the same
  difficulty, the same seed and a **deterministic budget**, **when** the engine searches **10**
  times, **then** the chosen move is **identical all 10 times**, over **≥ 30** positions.
  **30 × 10 = 300/300.**
- **`A2` (the honest claim under a real clock).** **Given** the same position, difficulty and seed
  under the **shipped wall-clock** budget, **when** the engine searches 10 times, **then** every
  returned move is legal and **the completed depth is reported for each run**. **This criterion
  does NOT assert an identical move**, and that is deliberate: asserting it would be a test that
  passes on an idle machine and fails on a loaded one — precisely the class of test
  `plans/nfr-catalog.md` forbids.
- **`A3` (different seeds actually differ).** **Given** a position with **≥ 2** equal-scoring best
  moves, **when** searched under **≥ 5** different seeds in deterministic mode, **then** at least
  two distinct moves are chosen across those seeds. *(A "seeded" engine that ignores its seed passes
  `A1` perfectly.)*
- **`A4` (no ambient randomness).** **Then** grep of the delivered `src/` diff finds **no
  `Math.random`, no `Date.now`, no `performance.now`** outside the injected time source's single
  implementation. *(One stray `Math.random` in a tie break makes every other criterion in this
  ticket false, and it is invisible to a behavioural test that happens to pass.)*
- **`A5` (the shipped default is still wall-clock).** **Then** the default engine construction uses
  a **real clock** and `ABC-078`'s `A1`/`A4` remain green. **Determinism must not be bought by
  changing the shipped budget.**
- **`A6` (the seed is threaded, not global).** **Then** two engine instances with different seeds,
  used in the same process, do not affect each other's output — asserted, because `ABC-085`'s ladder
  runs exactly that configuration.

## Dependencies

- **`ABC-078` must land first — OPEN.** The time source is injected into its loop.
- **`ABC-077`, `ABC-076` — OPEN** (transitively).
- **Blocks `ABC-085`** (`A5` there consumes `A1` here) and **strengthens `ABC-084`** (`A4` there).
- **Architect/Design** owns the search architecture if it rules a different construction.

## Security / NFR triggers

- **`NFR-004` — `A5` guards it.** The 3 s / 5 s promise is `ABC-078`'s and must survive this ticket
  unchanged.
- **`NFR-005` — not triggered.** An injected clock and a seeded tie break add no per-node cost.
  **`A2` reports depth so a regression would be visible.**
- **`N8-LANE` — ≤ 650 ms CPU.** `A1`'s 300 searches use a **deterministic node budget**, so they are
  fast and machine-independent by construction. `A2`'s wall-clock runs are **opt-in**.
- **Security — not triggered.** No input surface, and `A4` forbids ambient entropy, which is the
  only thing here that could resemble one.

## Test notes

1. **`A4` is a grep, and it is the strongest criterion on this page.** Behavioural determinism tests
   pass by luck; a source-level prohibition does not.
2. **`A3` before `A1`.** An engine that ignores its seed passes `A1` trivially.
3. **`A2` must be written so it can never be "strengthened" into asserting an identical move.** Leave
   the reason in the test file, not only here — that is exactly the well-meaning change that makes
   this suite flaky on a loaded machine.
4. **Do not add a PRNG dependency.** A dozen lines of xorshift is enough and `AGENTS.md` says not to
   add dependencies without reason.

## Size and priority rationale

**Size `S` (2).** A small PRNG, two injection points, and an explicit tie break. **The thinking is
in the mode split, and it is done on this page.** Not `M`: no new module of substance, no algorithm.

**Not `XL`. No `SPLIT_REQUIRED`.**

**Priority `P0`.** It implements the epic's fifth acceptance criterion, and two other tickets'
criteria are unimplementable without it.

## Definition of Ready

Assessed by BA/PM, **2026-08-16**. **Result: 8 of 10 clean, 2 ⚠️ — NOT met; stays in `Backlog`.**

| # | item | verdict |
|---|---|---|
| 1 | problem clear | **✅** both sources of non-determinism named, one of them a ratified constraint |
| 2 | scope and out-of-scope clear | **✅** three fences, the first restating a non-negotiable constraint as a prohibition |
| 3 | INVEST-shaped | **⚠️** **not independent** — `ABC-078` must land first |
| 4 | acceptance testable and measurable | **✅** six: **300/300** in deterministic mode, an explicitly non-asserting wall-clock criterion with its reason, a seeds-actually-differ check, a source-level entropy prohibition, the shipped default guarded, and per-instance seed isolation |
| 5 | dependencies known | **✅** three open tickets, two consumers named, one design owner named |
| 6 | security/NFR triggers with a measurable target | **✅** `NFR-004` guarded by `A5`; lane cost designed out via a node budget rather than argued away |
| 7 | test notes present | **✅** four |
| 8 | size assigned | **✅** `S` (2) |
| 9 | priority assigned | **✅** `P0` |
| 10 | no major unresolved blocker | **⚠️** **the deterministic-mode construction is BA/PM's reading of the epic's criterion, and the search architecture is Architect/Design's.** The criteria are written to survive a different construction, but **the construction itself is not ratified** |
