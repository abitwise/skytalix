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
  (non-capturing), non-checking move at move index **≥ 3** and remaining depth **≥ 3** — R5's
  probe parameters. A reduced search that fails high re-searches at full depth.
- Both full-width recursions — `src/search.ts` and `src/engine.ts` — carry the same PVS/LMR
  shape, following `ABC-080`'s ruling (`…f7e66060`, R1 point 3) that changing one recursion
  without the other risks `ABC-078`'s identity/comparison sweep diverging between them.

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

- **`A1` (game quality does not regress — a bounded-drift criterion, not identity).** **Given**
  a corpus of **≥ 100** positions (reuse `ABC-078`'s 209-position benchmark corpus, or
  `ABC-084`'s tactical suite if it has landed by build time), **when** each is searched to a
  fixed nominal depth with PVS+LMR on and with PVS+LMR off, **then** the reported score differs
  by **≤ 50 centipawns** (half a minor piece — a conservative, not-measured-on-this-codebase
  bound; flag it for re-leveling from the ticket's own baseline, `ABC-080`'s `A3` precedent) in
  **≥ 95%** of positions, and **zero** positions flip mate-status — a forced mate reported
  without PVS+LMR is still reported as a mate, on either side, with PVS+LMR on. *(This ticket
  changes the value, by design — R5 states it plainly. `ABC-080`/`ABC-081`'s identity bar is the
  wrong tool here; a bounded drift plus a hard no-mate-flip floor is the right one.)*
- **`A2` (depth gained in budget).** **Given** a fixed 3 s budget on `kiwipete` and
  `position-6`, with `ABC-080` and `ABC-081` both built, **then** the completed depth is **≥**
  the pre-`C1` build's on the same machine in the same process. Report both, and report the
  margin over the depth-6 floor — R5's probe reads depth 7 on both, 1.7x–2.1x margin (a
  prototype reading, not a verdict).
- **`A3` (LMR never reduces a move that must be searched at full depth).** **Given** an
  instrumented run, **then** a reduction is **never** applied to a capturing move, a checking
  move, a move made while in check, or a move at index **< 3** or remaining depth **< 3** —
  asserted by instrumentation, not by score alone. *(An over-eager reduction is invisible in
  aggregate node counts and shows up only as missed tactics.)*
- **`A4` (a fail-high re-search actually happens and is correct).** **Given** a constructed
  position where the reduced move is in fact the best move, **then** the reduced search fails
  high, the full-depth re-search runs, and the returned score and move match the unreduced
  search on that position. *(The re-search path is the one line every LMR bug skips; it must be
  exercised, not just present in the code.)*
- **`A5` (node count falls — the mechanism check, not the target).** **Given** `kiwipete` and
  `position-6` at a fixed depth past the point PVS/LMR starts reducing, **then** node count is
  **lower** than the unreduced search's at the same depth. Report the actual figure. *(This is
  the "it does something" check; `A2` is the target that matters.)*
- **`A6` (bounded memory, unchanged).** **Given** a 3 s search, **then** search-held memory
  stays within whatever fixed bound `NFR-009` (or its successor) states once placed. This
  ticket adds no new heap-growing structure — PVS/LMR are control-flow changes over the
  existing table and key array.

## Dependencies

- **`ABC-080` and `ABC-081` — both must land first.** LMR's re-search ordering leans on
  `ABC-080`'s hash move for its own effectiveness (R5), and `A2`'s depth measurement is taken
  with both built. R5 ranks `ABC-081` below this ticket by depth-per-point alone (0.33 vs.
  0.33–0.50) but sequences it first anyway because in-tree repetition is `ADR-0002`'s
  correctness requirement, not an optimisation.
- **`ABC-084` (tactical puzzle suite) — NOT a blocker.** `A1` names it as one option for the
  corpus; `ABC-078`'s already-built benchmark corpus is the fallback if `ABC-084` has not landed
  by this ticket's build time.

## Security / NFR triggers

- **`NFR-005` — the depth-7 WARN level (PROVISIONAL).** This ticket is the margin ticket R5
  names for that level; `A2` reports the measured depth and margin. The depth-6 floor is
  `ABC-080` + `ABC-081`'s, not re-claimed here.
- **`N8-LANE` — ≤ 650 ms CPU.** Same shape as `ABC-080`/`ABC-081`: depth-4+ sweeps and every 3 s
  run go behind an opt-in env flag; a shallow subset stays in the default lane.
- **Security — not triggered.** No input surface.

## Test notes

1. **`A3` before `A1` or `A2`.** A reduction applied where it should not be is a silent
   tactical-strength bug that aggregate node counts and score-drift percentages can both miss.
2. **`A4`'s position must be constructed, not found** — the same discipline `ABC-081`'s `A5`
   used for its repetition case.
3. **The unreduced mode is test-only**, like `ABC-077`'s, `ABC-080`'s and `ABC-081`'s switches.
4. **`A1`'s 50-centipawn / 95% figures are generic, not measured on this codebase** — the same
   honest flag `ABC-080`'s original `A3` carried. Re-set both from this ticket's own measured
   baseline at its build-time gate, and report the actual figures either way.

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

Assessed by BA/PM, **2026-09-25** (task `refine-abc080-081-cut-c1`, Workflow 07), at cut time.

| # | item | verdict |
|---|---|---|
| 1 | problem clear | **✅** the QE-lane depth risk and the thin `position-6` margin (1.51x) are named, from R5's own probe |
| 2 | scope and out-of-scope clear | **✅** two mechanisms scoped, four fences (`C2`–`C4` named as candidates only, zugzwang and re-leveling explicitly out) |
| 3 | INVEST-shaped | **⚠️** **not independent — sits behind two open tickets**, `ABC-080` and `ABC-081`, both still in `Backlog` as of this cut (`ABC-080` itself re-scores 10/10 at this same cut). Small and testable on its own terms once they land |
| 4 | acceptance testable and measurable | **✅** six: a bounded score-drift plus hard no-mate-flip floor (not identity, by design), depth gained with margin reported, an instrumented reduction-safety check, a constructed re-search case, a node-count mechanism check, a memory-bound carry-forward |
| 5 | dependencies known | **✅** `ABC-080` and `ABC-081` named as hard prerequisites with the reason (R5); `ABC-084` named as a non-blocking option |
| 6 | security/NFR triggers with a measurable target | **✅** `NFR-005` depth-7 WARN (PROVISIONAL) and `N8-LANE`, both following the established shape |
| 7 | test notes present | **✅** four |
| 8 | size assigned | **✅** `M` (3) |
| 9 | priority assigned | **✅** `P1` |
| 10 | no major unresolved blocker | **⚠️** **`A1`'s 50 cp / 95% bound is a generic, not-measured-on-this-codebase figure**, the same shape as `ABC-080`'s original `A3` — flagged for re-leveling at this ticket's own build-time gate, not a reason to hold the cut |

**8 of 10 clean, 2 ⚠️ — NOT MET; stays in `Backlog` behind `ABC-080` and `ABC-081`.** Both open
items resolve at those tickets' own pace (dependency) and at this ticket's own build-time gate
(the generic bound) — neither is BA/PM's to force closed today. **Size `M`, priority `P1`.**
