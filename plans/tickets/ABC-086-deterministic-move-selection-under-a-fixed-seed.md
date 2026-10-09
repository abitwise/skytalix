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
>
> **Re-scored 2026-10-09 by BA/PM** (task `wave-2026-09-25`, subtask `rescore-abc086`, Workflow 07)
> against the merged engine at `f952983` (`ABC-076`…`ABC-081`, `ABC-121` PVS/LMR under `ADR-0026`,
> `ABC-122`). **9/10, one ⚠️ — NOT Ready.** ⚠️(3) is discharged. ⚠️(10) is still open, and it is
> now a narrower question for Architect/Design (§ Definition of Ready). The measurements are in
> `.grugops/context/rescore-abc086/`, not on this page.

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

**What the merged engine already does (2026-10-09, `f952983`).**

- **The time source is injected.** `EngineOptions.now` (`src/engine.ts:148-149`) defaults to
  `Date.now` (`:452`). `ABC-078`'s suite already drives it with virtual time (`tickingClock`,
  `src/engine.test.ts:121-128`).
- **Wall-clock time is the only non-determinism left in the engine.** The other candidates are all
  deterministic today:
  - Zobrist keys come from a fixed splitmix64 seed (`src/zobrist.ts:56`).
  - The transposition table is cleared at every call (`src/engine.ts:469`).
  - Killers and keys are allocated fresh for each call (`:464-465`).
  - `orderMoves` is a stable sort (`src/search.ts:179-188`).
  - A tie is broken by a strict `>`, so the first move in order wins (`src/engine.ts:285-288`,
    `:397-401`).
  - There is no `Math.random`, `performance.now` or `crypto` on the engine path.
- **Measured:** under virtual time the merged engine is already **300/300 identical**, both in one
  process and in two separate processes. **The engine holds no seed, and no choice in it is
  random.**
- **Equal-best root moves are common.** 8 of `A1`'s 30 positions have two or more at depth 3; in
  `startpos`, `b1c3` and `g1f3` both score 50.
- **Under PVS a tie is invisible.** Every root move after the first is searched on a null window
  (`src/engine.ts:320-331`). A move that only ties the best fails low, which looks the same as a
  worse move.

## Scope

- An **injected seed** driving every random choice in the engine (tie breaking among equal-scoring
  moves; `ABC-087`'s blunder draw).
- An **injected time source**, so a test can supply a deterministic clock. **Already merged by
  `ABC-078`** (`src/engine.ts:148-149`, `:452`), so this ticket does not add it again.
- A **deterministic mode** — fixed seed plus a deterministic budget — under which move selection is
  exactly reproducible. **The construction of the deterministic budget is open under ⚠️(10).** It
  could be the existing `Clock` driven by virtual time, or a separate node budget. It also has to
  be reachable from `ABC-084`/`ABC-085`'s harnesses, outside any test file.
- Tie breaking made **explicit and seeded**, rather than falling out of move-generation order.
  **Open under ⚠️(10).** As merged, ties are settled explicitly and deterministically (strict
  `>`, first in `orderMoves` order) but not by a seed.

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
  **30 × 10 = 300/300.** *(Re-scored 2026-10-09.)* The full 300 runs belong in the
  **`ENGINE_DEEP=1` lane**, and the default lane carries a 30 × 2 slice (see `N8-LANE`). The full
  300 runs at a budget where at least half the positions complete root depth ≥ 4, so that LMR
  acts. **The merged tree already passes this at zero production lines** (with virtual time and
  no seed), so `A1` is a regression guard and not proof of delivery. `A3` is the proof.
- **`A2` (the honest claim under a real clock).** **Given** the same position, difficulty and seed
  under the **shipped wall-clock** budget, **when** the engine searches 10 times, **then** every
  returned move is legal and **the completed depth is reported for each run**. **This criterion
  does NOT assert an identical move**, and that is deliberate: asserting it would be a test that
  passes on an idle machine and fails on a loaded one — precisely the class of test
  `plans/nfr-catalog.md` forbids.
- **`A3` (different seeds actually differ).** **Given** a position with **≥ 2** equal-scoring best
  moves, **when** searched under **≥ 5** different seeds in deterministic mode, **then** at least
  two distinct moves are chosen across those seeds. *(A "seeded" engine that ignores its seed passes
  `A1` perfectly.)* *(Re-scored 2026-10-09.)* **"Equal-scoring" means exact per-move scores**,
  each read from that child's own search, never from the root's PVS bounds (a tie fails low there).
  8 of `A1`'s 30 positions qualify at depth 3. **This criterion binds only if ⚠️(10) rules that
  the seed reaches tie breaking. If it does not, `A3` moves to the seed's first random consumer
  (`ABC-087`'s blunder draw)** and this page is re-cut.
- **`A4` (no ambient randomness).** **Then** grep of the delivered `src/` diff finds **no
  `Math.random`, no `Date.now`, no `performance.now`** outside the injected time source's single
  implementation. *(One stray `Math.random` in a tie break makes every other criterion in this
  ticket false, and it is invisible to a behavioural test that happens to pass.)* *(Re-scored
  2026-10-09.)* The single implementation is `src/engine.ts:452`. Two older hits sit outside the
  engine path and outside this diff, and they do not violate this criterion: `src/cli-options.ts:103`
  (`--colour random`) and `src/perft-bench.ts:70-72` (`hrtime`).
- **`A5` (the shipped default is still wall-clock).** **Then** the default engine construction uses
  a **real clock** and `ABC-078`'s `A1`/`A4` remain green. **Determinism must not be bought by
  changing the shipped budget.** *(Re-scored 2026-10-09.)* The shipped construction is
  `src/cli.ts:175`, `createEngine({ budgetMs: DEFAULT_BUDGET_MS })` with no `now`. `ABC-078` `A4`
  pins `src/engine.ts`'s export list and `chooseMove.length === 2` (`src/engine.test.ts:465-484`).
  Any new export or parameter therefore amends that pin openly; it must never be loosened to make
  room.
- **`A6` (the seed is threaded, not global).** **Then** two engine instances with different seeds,
  used in the same process, do not affect each other's output — asserted, because `ABC-085`'s ladder
  runs exactly that configuration. *(Re-scored 2026-10-09.)* The transposition table is
  module-level (`src/transposition.ts:70-72`). It is still safe today, because each call clears it
  (`src/engine.ts:469`) and the seam runs `chooseMove` synchronously (`:515`). The seed's state must
  live in the instance, and this ticket adds no module-level state.

## Dependencies

*(Re-scored 2026-10-09.)*

- **`ABC-078` — `Done`.** Discharged. The time source sits in its loop (`src/engine.ts:452`).
- **`ABC-076`, `ABC-077`, `ABC-079`…`ABC-081`, `ABC-121`, `ABC-122` — `Done`.** `ABC-121` brings
  PVS/LMR under the accepted `ADR-0026`. That is what makes a root tie invisible, and what makes LMR
  depend on move order. Both facts enter ⚠️(10).
- **Architect/Design ruling — OPEN, this ticket's only blocker** (§ Definition of Ready, ⚠️(10)).
- **`ABC-082` (parallel lane, evaluation).** It does not block this ticket. But a change to the
  evaluation can break a tie that an `A3` fixture relies on, so the merge order is the
  Orchestrator's to decide.
- **Blocks `ABC-085`** (`A5` there consumes `A1` here) and **`ABC-087`** (`A7` there consumes the
  seed). **Strengthens `ABC-084`** (`A4` there runs in separate processes). The merged engine is
  already identical across processes under virtual time.

## Security / NFR triggers

- **`NFR-004` — `A5` guards it.** The 3 s / 5 s promise is `ABC-078`'s and must survive this ticket
  unchanged.
- **`NFR-005` — depends on the ruling.** A seed that reaches no search choice adds no per-node
  cost, and then `NFR-005` is not triggered. A seeded root tie break that has to identify the
  equal-best set under PVS needs wider root windows, which costs nodes. In that case `NFR-005` is
  triggered at its catalog bar, unchanged. **`A2` reports depth so a regression would be visible.**
- **`N8-LANE` — ≤ 650 ms net CPU, standing bar** (160 ms floor per new test file; adding rows to
  `src/engine.test.ts` avoids that floor). *(Re-scored 2026-10-09: the earlier claim that a node
  budget makes the runs "fast by construction" was false.)* 300 searches cost whatever their nodes
  cost. Probe CPU for 30 × 10, read in process and not with the lane instrument:
  - ≈ 835 ms at the cheapest budget (depth 1–2, where LMR never acts);
  - ≈ 5.9 s at a budget where 15/30 positions reach depth ≥ 4;
  - ≈ 32 s at 29/30 reaching depth ≥ 4.

  **So the full `A1` belongs in the `ENGINE_DEEP=1` lane.** The default lane carries a 30 × 2
  slice, measured at 246–256 ms gross. `A2`'s wall-clock runs are **opt-in**. The Engineer reports
  the net figure with the standing instrument.
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
5. *(Re-scored 2026-10-09.)* **`A3`'s fixture must be certified by exact per-move scores.** Read
   each move's score from that child's own search, as the probe in
   `.grugops/context/rescore-abc086/probe/` does. Never use the root's score list: under PVS every
   move after the first has only a bound. The fixture also needs a guard that the tie still holds,
   so that a change to the evaluation (`ABC-082`) reds the fixture rather than silently emptying
   `A3`.

## Size and priority rationale

**Size `S` (2).** A small PRNG, two injection points, and an explicit tie break. **The thinking is
in the mode split, and it is done on this page.** Not `M`: no new module of substance, no algorithm.

**Not `XL`. No `SPLIT_REQUIRED`.**

*(Re-scored 2026-10-09.)* `S` is now an upper bound. If ⚠️(10) rules the seed out of tie
breaking, `A3`/`A6` move to `ABC-087` and this ticket falls to `XS` (1): deterministic mode reachable
outside a test file, plus `A1`, `A2`, `A4` and `A5`. If the ruling instead makes a seeded root tie
break a switch with doors under `ADR-0026` decision 10, the size is re-estimated at that point,
not guessed now.

**Priority `P0`.** It implements the epic's fifth acceptance criterion, and two other tickets'
criteria are unimplementable without it.

## Definition of Ready

**Re-scored by BA/PM, 2026-10-09** (task `wave-2026-09-25`, subtask `rescore-abc086`, Workflow 07),
against the merged engine at `f952983`. Supersedes the 2026-08-16 score below, which is kept as
history. **Result: 9 of 10 clean, 1 ⚠️ — NOT met; stays in `Backlog`.**

| # | item | verdict |
|---|---|---|
| 1 | problem clear | **✅** unchanged. The merged engine's wall clock is still the one source of non-determinism (`src/engine.ts:452`), and `ABC-087`'s randomness is still unbuilt |
| 2 | scope and out-of-scope clear | **✅** fences unchanged. The time-source bullet is marked as already merged, and the two open bullets are named as open under ⚠️(10) rather than left vague |
| 3 | INVEST-shaped | **✅ (was ⚠️) — discharged by fact.** `ABC-078` and everything it depended on are `Done`. Nothing this ticket needs is still in flight |
| 4 | acceptance testable and measurable | **✅** six criteria, each re-checked against the code as built. `A1` gains a lane and a depth floor, and it is named as a guard that the merged tree already meets. `A3`'s "equal-scoring" is defined as exact per-move scores (8/30 positions qualify) and is conditional on ⚠️(10). `A4`, `A5` and `A6` cite the lines they bind |
| 5 | dependencies known | **✅** every engine ticket is `Done`. The ruling is named as the only blocker. `ABC-082`'s merge-order overlap is named. `ABC-087` is added as a consumer |
| 6 | security/NFR triggers with a measurable target | **✅** `NFR-004` is guarded by `A5`. `NFR-005` is now conditional on the ruling, at its catalog bar either way. `N8-LANE` is corrected by measurement: the full 300 runs go to the deep lane, and a 30 × 2 default slice measures ≈ 250 ms |
| 7 | test notes present | **✅** five (adds `A3`'s fixture certification) |
| 8 | size assigned | **✅** `S` (2), as an upper bound. It falls to `XS` if the seed leaves this ticket |
| 9 | priority assigned | **✅** `P0`, unchanged. `ABC-085`, `ABC-087` and `ABC-084` `A4` all wait on it |
| 10 | no major unresolved blocker | **⚠️ still open, narrowed.** Owner: **Architect/Design.** The question is below |

**⚠️(10) — the question for Architect/Design.**

> **Q1 (the seed).** The merged engine has no random choice, and under PVS a tie at the root fails
> low and cannot be told apart from a worse move (`src/engine.ts:320-331`). Given that, does
> `ABC-086`'s seed reach move selection?
>
> **(a)** Yes, as a seeded root tie break. Then how is the equal-best set identified without
> changing the shipped score? Is that tie break a value- or work-changing change under `ADR-0026`
> decision 10 (its own switch, doors, and off in every older door)? It plausibly is: the root entry
> stored at `:404` becomes the next iteration's hash move, and LMR's value depends on move order.
> That is `UNKNOWN - verify`, not measured.
>
> **(b)** No. Tie breaking stays as merged (strict `>`, first in `orderMoves` order), and the seed
> moves to its first random consumer, `ABC-087`'s blunder draw.
>
> **Q2 (the deterministic budget).** Should the deterministic budget be the existing `Clock` driven
> by virtual time, or a separate node budget?
>
> - The `Clock` contract says "real-time" (`:109`).
> - The `Clock` is read every `NODES_PER_CLOCK_CHECK` nodes (`:202-208`).
> - A virtual-clock budget is capped at `HARD_CEILING_MS` readings (`:459`).
>
> Whichever it is, it must live somewhere `ABC-084`/`ABC-085`'s harnesses can reach outside a test
> file, without breaking `ABC-078` `A4`'s export pin or `ADR-0024` decision 7.

**BA/PM's product position, which is not the ruling:** **(b)**. The epic asks for reproducibility,
and the merged engine already has it. Variety among tied moves was never asked for, so (b) is the
cheaper slice. If the ruling is (b), BA/PM re-cuts the page: `A3`/`A6` move to `ABC-087` and the size
falls to `XS`.

<details>
<summary>Original score, 2026-08-16, at cut time (task <code>epic-to-tickets-EPIC-004</code>) — superseded above</summary>

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

</details>
