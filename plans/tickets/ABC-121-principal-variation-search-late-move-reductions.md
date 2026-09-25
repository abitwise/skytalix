---
id: ABC-121
title: Principal-variation search with late-move reductions (C1)
status: backlog
column: Backlog
size: M
priority: P1
epic: EPIC-004
feature: —
---

# ABC-121 — the depth-7 WARN margin: PVS null-window re-search plus LMR

> **Cut 2026-09-25 by BA/PM** (task `refine-abc080-081-cut-c1`, Workflow 07), from candidate
> `C1` in Architect/Design's ruling `…2ba4fca3` (task `wave-2026-09-24`, subtask
> `ruling-abc080-081`, R5). Ranked second by depth-per-point (0.33–0.50) after `ABC-080`
> (0.67) and ahead of `ABC-081` (0.33) on that axis alone, but sequenced after both:
> LMR's re-search ordering leans on `ABC-081`'s hash move, and `ABC-081`'s in-tree repetition is
> a correctness requirement (`ADR-0002`), not an optimisation, so it is owed first regardless of
> its depth ranking. `C2` (null move), `C3` (pseudo-legal search) and `C4` (fused leaf) are
> named by the same ruling as candidates and are **not** cut here.

## Problem

*User*: the player at the depth-7 `NFR-005` WARN level, and the QE lane specifically — QE
measured the engine about one ply shallower under `vitest` than under plain `node`
(`ABC-078 (qe)` trace row), so the margin `ABC-080` + `ABC-081` leave at depth 6 (1.51x on
`position-6`, the thinner of the two) may not survive that shallower reading.

*Pain*: R5's probe (Apple M3, loaded) reads depth 6 on both positions after `ABC-080` +
`ABC-081`, with `position-6`'s margin at only 1.51x. That is thin enough that a slower or more
loaded machine could miss the ratified depth-6 floor. R5 names this ticket as the insurance:
"C1 insures" that risk.

*Value*: margin over the depth-6 floor, and depth-7 at the `NFR-005` WARN level (PROVISIONAL,
pending non-M3 measurement) — R5's probe reads depth 7 on both positions with 1.7x–2.1x margin,
clear of the depth-6 floor.

## Scope

- **Principal variation search (PVS).** A null-window `(alpha, alpha + 1)` re-search for every
  non-first child of a node; a result that fails high above `alpha` triggers a full-window
  re-search.
- **Late-move reductions (LMR).** Reduce the search depth by one ply for a quiet
  (non-capturing, non-promoting), non-checking move at move index **≥ 3** and remaining depth
  **≥ 3** — R5's probe parameters, confirmed unchanged by `ADR-0026` decision 6.
  A reduced search that fails high re-searches at full depth.
- Both full-width recursions — `src/search.ts` and `src/engine.ts` — carry the same PVS/LMR
  shape, following `ABC-080`'s ruling (`…f7e66060`, R1 point 3) that changing one recursion
  without the other risks `ABC-078`'s identity/comparison sweep diverging between them.
- **Test oracle, per `ADR-0026` (proposed) and the `ruling-abc121-lmr-oracle` R1–R3 rulings
  it records.** Two switches (`pvs`, `reductions`) in both recursions, both on by default. Four
  test-only doors — `searchWithoutReductions` / `searchWithoutPvsOrReductions` in `src/search.ts`,
  `chooseMoveWithoutReductions` / `chooseMoveWithoutPvsOrReductions` in `src/engine.ts` — and one
  exported pure reduction predicate in `src/search.ts`, called by both recursions. Every door that
  predates `ABC-121` keeps PVS and LMR **off**; every existing work row (a node count, ratio, hit
  rate) re-points its shipped side at the pre-`ABC-121` door of the same recursion — a mechanical
  rename, not a re-level (`ABC-077` `A2`; `ABC-079` `A4`/`A5`; `ABC-080` `A1`, `A3`, `A4`, `G1`;
  `ABC-081` `A1`, `A2`, `A3`, `A5`; `search.ordering.test.ts`'s pin). The two identity/drift
  detectors (`ABC-077` `A1`, `ABC-078` `A3`) take the `…WithoutReductions` pair instead, so PVS
  sits under them while LMR does not. `ABC-077` `A6`'s export list grows by three (two doors +
  the predicate); `ABC-078` `A4`'s grows by two (two doors). Full door table, the re-pointed-row
  list and the measurements behind it: `.grugops/context/ruling-abc121-lmr-oracle/notes/`
  (`…c41d9e07` R1) and `ADR-0026`.
- **Build order (two commits, per `ADR-0026` decision and ruling `…7a4c19e3` R3):** commit 1 —
  the switches, the four doors, the work-row re-pointing, PVS in both recursions, plus the new
  PVS identity link (`searchWithoutReductions` ≡ `searchWithoutPvsOrReductions`, 0/190 at depth
  4); gate green with every pre-existing row unchanged. Commit 2 — the reduction predicate and
  LMR, plus `A1`–`A5` below. Not split into two tickets: PVS alone buys 0 plies (does not reach
  depth 7), so a PVS-only ticket is not INVEST-*valuable* on its own.

## Out of scope

- **`C2` — null-move pruning (R = 2).** Named as a candidate in R5, not cut here.
- **`C3` — pseudo-legal full-width search** (`ADR-0003` clause 3 (c1)). Named as a candidate,
  not cut here; not re-measured on the search (`UNKNOWN - verify` per R5).
- **`C4` — fused leaf.** Named as a candidate, not cut here; margin-only (0 plies), not a
  priority driver.
- **Zugzwang handling.** Belongs to `C2` (null-move), not this ticket — PVS/LMR carry no null
  move.
- **Re-leveling `NFR-005`'s depth-6 floor or the depth-7 WARN level.** The owner's word keeps
  the floor (`.grugops/context/wave-2026-09-24/notes/20260925T104000Z-...-36b66fbd.md`); this
  ticket is margin work under an unchanged floor.

## Acceptance (Given/When/Then)

- **`A1` (game quality does not regress — a bounded-drift criterion, not identity; superseded
  bound, measured this hop, per `ADR-0026` decision 9 / ruling `…5e92b7a0` R2).** **Given** a
  corpus of **190** positions (`ABC-078`'s six roots + every position one legal move away +
  `ABC-079`/`ABC-081`'s six endgames — ≥ 100 as required; `ABC-084`'s tactical suite if it lands
  first, as a strength check, not a blocker), **when** each is searched to a fixed depth **≥ 4**
  with the shipped `search()`/`chooseMove` (PVS+LMR on) against `searchWithoutReductions` /
  `chooseMoveWithoutReductions` (PVS on, LMR off — the pre-`ABC-121` value, not the pre-`ABC-121`
  build), **then**: **zero** positions flip mate-status (hard floor, presence or sign); of the
  non-mate positions, **≥ 95%** score within **25 centipawns**; the single largest drift is
  **≤ 75 centipawns**. Measured this hop at depth 4 / depth 5: 98.40% / 99.47% within 25 cp, max
  drift 50 / 45 cp, 0 mate flips at both depths (`.grugops/context/ruling-abc121-lmr-oracle/notes/`
  `…5e92b7a0`, `…8d25f0c6`). *(Replaces the ticket's original generic 50 cp / 95% figure, which
  measured 100% — too loose to catch a regression before it is gross, and had no ceiling while
  the depth-4 max sat exactly at 50.)* The five mate rows already in `search.test.ts` `A3` and
  `transposition.test.ts`'s depth-10 rook ending stay on the shipped path with PVS+LMR on and
  hold their pinned literals unchanged — they cover the mate floor's thin depth-4/5 corpus
  coverage (3 of 190 positions).
- **`A2` (depth gained in budget, plus a clock-free companion — ruling `…5e92b7a0` R2).**
  **Given** a fixed 3 s budget on `kiwipete` and `position-6`, with `ABC-080` and `ABC-081` both
  built, **then** the completed depth is **≥** the pre-`C1` build's (`chooseMoveWithoutPvsOrReductions`)
  on the same machine in the same process, measured on plain `node` (`NFR-005`'s runner), with
  the load average recorded alongside the reading. **Add** a clock-free companion: cumulative
  deepening nodes to depth 7 for `chooseMove` vs `chooseMoveWithoutPvsOrReductions`, divided by
  the engine's measured 3 s node capacity — the probe read 532 363 / 467 461 nodes (kiwipete /
  position-6) against an 892 682 / 853 278-node capacity (QE `ABC-081`), a 1.68x / 1.83x margin;
  this reading does not depend on machine load (`.grugops/context/ruling-abc121-lmr-oracle/notes/`
  `…8d25f0c6`). Report both figures at build time either way.
- **`A3` (LMR never reduces a move that must be searched at full depth, and the rule is one
  predicate both recursions call — ADR-0026 decision 6).** **Given** the exported pure reduction
  predicate, **then** a table-driven test shows no reduction for: a capturing move, a promoting
  move, a checking move, a move made while in check, a move at index **< 3**, remaining depth
  **< 3**, or the root — and exactly one ply of reduction for the one allowed case. **Given** a
  source assertion, **then** both `src/search.ts` and `src/engine.ts` route every reduction
  through that one predicate. *(An over-eager reduction is invisible in aggregate node counts
  and shows up only as missed tactics; routing both recursions through one predicate closes the
  gap a copy-pasted rule would leave.)*
- **`A4` (a fail-high re-search actually happens and is correct).** **Given** a constructed
  position where the reduced move is in fact the best move, **then** the reduced search fails
  high, the full-depth re-search runs, and the returned score and move match the unreduced
  search on that position. *(The re-search path is the one line every LMR bug skips; it must be
  exercised, not just present in the code.)*
- **`A5` (node count falls, on named positions only — do not widen to "every position"; ruling
  `…5e92b7a0` R2).** **Given** `kiwipete` and `position-6` at depth 4, **then** node count for
  `search()` is **lower** than `searchWithoutPvsOrReductions`'s at the same depth — measured
  80.2% (kiwipete) and 70.8% (position-6). Report the actual figures. *(Position-4 is the named
  counter-case: it reads 9 581 nodes under PVS+LMR against 9 054 without — PVS alone can grow a
  tree, so this bar names its two positions rather than claiming a universal reduction.)* This
  is the "it does something" check; `A2` is the target that matters.
- **`A6` (bounded memory, unchanged).** **Given** a 3 s search, **then** search-held memory
  stays within whatever fixed bound `NFR-009` (or its successor) states once placed. This
  ticket adds no new heap-growing structure — PVS/LMR are control-flow changes over the
  existing table and key array.

## Dependencies

- **`ABC-080` and `ABC-081` — DONE.** Both merged to `main`. LMR's re-search ordering leans on
  `ABC-080`'s hash move for its own effectiveness (R5); `A2`'s depth measurement is taken with
  both built.
- **`ABC-122` (gate hardening) — must land first.** Not yet `Done` (`In Development`, Engineer
  hop `ticket-to-pr-ABC-122` running at this re-score). The oracle work adds roughly twenty
  re-pointed test rows and a slower deep lane (`A1`'s 190-position corpus); `ABC-122`'s
  bounded-time test wrapper and capacity-guard tests are gate infrastructure this ticket's build
  runs under, named first by the wave sequencing (`plans/board.md`), not re-derived here.
- **`ADR-0026` — status `proposed`, owner acceptance pending.** This ticket's test-oracle scope
  (the four doors, the predicate, the re-pointed rows, `A1`'s bounded-drift bar) is built
  against that ADR. **If the owner declines it**, the alternative on the record is to re-level
  two already-merged bars instead — `ABC-080` `A3` (would read 47.49% vs its 40.5% bar in the
  default lane, 6.59%/4.19% vs its 4% depth-4 bar) and `ABC-081` `A3` (77.31%/77.01% vs its 70%
  bar) — and `ABC-078` `A3` would stop holding as a cross-recursion identity once LMR is on.
  This is not this ticket's call to smooth over; it is named here so `Ready for Dev` does not
  start building against an ADR that could still be rejected.
- **`ABC-084` (tactical puzzle suite) — NOT a blocker.** `A1` names it as an added strength check
  if it lands first; `ABC-078`'s already-built 190-position corpus is the oracle either way.

## Security / NFR triggers

- **`NFR-005` — the depth-7 WARN level (PROVISIONAL).** This ticket is the margin ticket R5
  names for that level; `A2` reports the measured depth and margin. The depth-6 floor is
  `ABC-080` + `ABC-081`'s, not re-claimed here.
- **`N8-LANE` — ≤ 650 ms CPU.** Same shape as `ABC-080`/`ABC-081`: depth-4+ sweeps and every 3 s
  run go behind an opt-in env flag; a shallow subset stays in the default lane. **The new rows'
  default-lane cost is `UNKNOWN - verify`** — the ruling's probe only timed its deep-shaped
  passes, under load (`.grugops/context/ruling-abc121-lmr-oracle/notes/` `…0f93c6b1`); the build
  measures it and reports the actual figure.
- **Security — not triggered.** No input surface.

## Test notes

1. **`A3` before `A1` or `A2`.** A reduction applied where it should not be is a silent
   tactical-strength bug that aggregate node counts and score-drift percentages can both miss.
2. **`A4`'s position must be constructed, not found** — the same discipline `ABC-081`'s `A5`
   used for its repetition case.
3. **The unreduced mode is test-only**, like `ABC-077`'s, `ABC-080`'s and `ABC-081`'s switches.
4. **`A1`'s bound is now measured, not generic** (superseded by `ADR-0026` / ruling `…5e92b7a0`
   R2) — the build re-measures it at its own gate and reports the figure whether or not it
   matches this hop's reading; a failing bar here is reported, never re-levelled silently.
5. **The Engineer lists every re-pointed row, one line each, in the build notes; QE checks that
   list against the tree** (ruling `…c41d9e07` R1). If a re-pointed row fails, the door is not
   the pre-`ABC-121` search, and that is a defect — not a reason to re-level the row.

## Size and priority rationale

**Size `M` (3).** R5's own table reads `S–M (2–3)`. The PVS/LMR control flow itself is small (a
handful of lines per recursion, times two recursions) — but this ticket also owes a
game-quality corpus measurement (`A1`) and an instrumented reduction-safety check (`A3`), the
same measurement-discipline cost that made `ABC-080` and `ABC-081` `M` rather than smaller.
**Not `L`:** no new data structure, no new module — control flow over structures `ABC-080` and
`ABC-081` already build.

**Not `XL`. No `SPLIT_REQUIRED`.**

**Priority `P1`.** It insures the depth-6 floor's thin margin and reaches for the depth-7 WARN
level, but the floor itself is `ABC-080`'s and `ABC-081`'s `P0` work; this ticket is margin, not
the floor.

## Definition of Ready

**Re-scored by BA/PM, 2026-09-25** (task `wave-2026-09-25`, subtask `rescore-abc121`, Workflow
07 — folding Architect/Design's `ruling-abc121-lmr-oracle` R1–R4 and `ADR-0026`). Supersedes the
2026-09-25 cut-time score below (`refine-abc080-081-cut-c1`), not deleted, kept as history.

| # | item | verdict |
|---|---|---|
| 1 | problem clear | **✅** unchanged — the QE-lane depth risk and the thin `position-6` margin (1.51x) |
| 2 | scope and out-of-scope clear | **✅** two mechanisms plus the ruling's test-oracle shape (doors, predicate, re-pointed rows); fences unchanged |
| 3 | INVEST-shaped | **⚠️** **not yet independent — `ABC-080` and `ABC-081` are DONE, but `ABC-122` (gate hardening) is `In Development`, not `Done`**, and the ruling names it as landing first. Small and testable on its own terms once it lands |
| 4 | acceptance testable and measurable | **✅** six, `A1` and `A2` now carrying measured bounds (0 mate flips hard / ≥ 95% within 25 cp / ≤ 75 cp, plus a clock-free node-margin companion) in place of the generic figures; `A3` and `A5` tightened to the ruling's mechanism (one predicate, named positions only) |
| 5 | dependencies known | **✅** `ABC-080`/`ABC-081` DONE; `ABC-122` named as the new hard blocker with the reason; `ADR-0026`'s pending acceptance named with its concrete fallback cost (two bars re-levelled); `ABC-084` non-blocking |
| 6 | security/NFR triggers with a measurable target | **✅** `NFR-005` depth-7 WARN (PROVISIONAL, now with a clock-free companion reading) and `N8-LANE` (default-lane cost still `UNKNOWN - verify`, named honestly, not a blocker) |
| 7 | test notes present | **✅** five (added: the Engineer's re-pointed-row list, QE-checked) |
| 8 | size assigned | **✅** `M` (3) unchanged — the ruling explicitly declines to make the oracle plumbing a `SPLIT_REQUIRED` reason (`…7a4c19e3` R3) |
| 9 | priority assigned | **✅** `P1` unchanged |
| 10 | no major unresolved blocker | **⚠️** **`ADR-0026` is `proposed`, not accepted.** This ticket's whole test-oracle shape — the doors, the re-pointed rows, `A1`'s bar — is built against it. Not smoothed away: if the owner declines, `ABC-080` `A3` and `ABC-081` `A3` (both merged, `Done`) need re-levelling instead, named above with the exact figures |

**8 of 10 clean, 2 ⚠️ — still NOT MET.** Item 3 closes when `ABC-122` reaches `Done` — a
dependency, not a defect in this ticket. Item 10 closes only on the owner's word on `ADR-0026`;
until then the ticket's scope rests on a proposed design, which `Ready for Dev` should not
start building against. **Stays in `Backlog`.** Neither ⚠️ is BA/PM's to force closed today.
**Size `M`, priority `P1`, unchanged.**

<details>
<summary>Original score, 2026-09-25, at cut time (task <code>refine-abc080-081-cut-c1</code>) — superseded above</summary>

| # | item | verdict |
|---|---|---|
| 1 | problem clear | ✅ |
| 2 | scope and out-of-scope clear | ✅ |
| 3 | INVEST-shaped | ⚠️ sat behind `ABC-080`/`ABC-081`, both `Backlog` at cut time |
| 4 | acceptance testable and measurable | ✅ six criteria, generic `A1` bound |
| 5 | dependencies known | ✅ `ABC-080`/`ABC-081` hard, `ABC-084` non-blocking |
| 6 | security/NFR triggers with a measurable target | ✅ |
| 7 | test notes present | ✅ four |
| 8 | size assigned | ✅ `M` (3) |
| 9 | priority assigned | ✅ `P1` |
| 10 | no major unresolved blocker | ⚠️ `A1`'s 50 cp / 95% bound was generic, not measured on this codebase |

8/10, 2 ⚠️, NOT MET.
</details>
