---
id: ABC-207
title: "Mobility is weighted per piece, with the queen lowest per square, and an early queen trip before the minor pieces are out costs a little"
status: ready
column: Ready
size: S
priority: P3
epic: EPIC-008
feature: —
adr: "none if ADR-0031 D2's attack-map form stays; a different form is an ADR-0031 change, routed to the owner"
---

# ABC-207: per-piece mobility weights and a small early-queen term

> **Cut 2026-10-23 by BA/PM** (task `bapm-cut-engine-strength`, records only, at `main` `55a8f4ef`). Proposal 4 of
> `…f1771bb3`; owner word `…7feb0553`.
>
> **ADR touch point: conditional.** Weights and a new small term keep `ADR-0031` decision 2's attack-map form, so no ADR
> is expected. If the design changes the form, it is an `ADR-0031` change. The Orchestrator then reports the text to
> the owner when it lands.

## Problem

- **User:** the owner at level 5.
- **Pain:**
  - 4.Qa4?! (72 cp): nothing in the evaluation penalises an early queen move or rewards development. Mobility pays
    every queen square the same 4 cp as a minor piece's square (`src/evaluate.ts:199`, `:355-356`).
    *Re-read 2026-10-25 at `main` `bb9fd7ef`:* these lines are now `:201` and `:357-358`, because `ABC-214` added
    two header lines. The text is unchanged.
  - Before 8.e5, mobility was 88 cp of a 148 cp static score, close to its 100 cp cap. A mobility-heavy score rewards
    space grabs.
- **Evidence:** a probe with queen mobility at ¼ weight plus a centre-king term turned 4.Qa4 into 4.e4, which is
  Stockfish's move.
- **Value:** fewer early queen trips and space grabs. It ships only if D says so.

## Scope

1. A mobility weight per piece type, with the queen's per-square weight **strictly lowest** of the four non-pawn types.
   The values are the Architect's or Engineer's. The `±100 cp` clamp stays.
2. One small term: while a side's queen has left its home square and **≥ 2** of that side's minor pieces are still on
   their home squares, that side is charged. The size and phase cut-off are the design's. The term is 0 in an endgame.

## Out of scope

- A new mobility form (that would be `ADR-0031`), king safety (`ABC-205`), search changes, and a general development
  table.

## Acceptance criteria

- **`A1` (per-piece weight).** **Given** two positions equal but for one extra reachable square, **then** the extra
  square is worth **strictly less** to a queen than to a knight, bishop or rook, **with the mobility clamp not engaged
  in either position**.
- **`A2` (the early-queen term).**
  - **Given** a position with White's queen on `a4`, both White knights and both bishops home, and Black's queen home,
    **then** it scores **strictly lower** for White than the same position with White's queen on `d1`.
  - **Given** the same pair with all four White minors developed, **then** the term contributes **0** to the
    difference.
  - **Given** an endgame with no minor pieces, **then** the term contributes **0**.
- **`A3` (existing evaluation gates).** `G3`, which includes `ABC-083` `A4`'s ±100 cp mobility bound, and the mirror on
  **≥ 10 new positions** that exercise both terms. `G2` ≤ 1 100 ns, with the base in the same session. Above that bar:
  STOP to Architect/Design (`ADR-0031`).
- **`A4` (search and NFR gates).** `G1`, `G5`, `G6` (depth ≥ 6 and ≥ base), `G8`, `G9`, and `G10` for any red.
- **`A5` (the reading).** **Given** `ABC-204` is Done, **then** D meets ship rule **S1**. **Reported:** X ± Y, and
  `G11`. The 4.Qa4 and 8.e5 choices are of interest.

## NFR triggers

- `G2` ≤ 1 100 ns. `NFR-005`, read by `G6`. `NFR-004` and `NFR-008` are re-read.
- Bounds moved: none planned.
- Security: no limb, no hop.

## Test notes

1. Relation rows go in `src/evaluate*.test.ts` (default lane). Report `N8-LANE`.
2. `A1`'s pair must keep the clamp out of play, or the relation reads the clamp and not the weight.
3. UAT is owed (production lines). The QE verdict signs it.
4. **Frozen-clock pre-check (a process step, no bound).** *Added 2026-10-25 by BA/PM (`bapm-close-ABC-205`), from
   Architect/Design `…912bcb0d`.*
   - **When:** before this ticket's real-clock `G6` reading.
   - **What QE reports:** the nodes each build needs to complete depths 7 and 8 on `kiwipete` and `position-6`
     (`chooseMove`, `now: () => 0`, `maxDepth: k`), for base and head. That is 8 counts.
   - **What a high count means.** Base "straddles" a depth when a build value-identical to base reached it in some,
     but not all, of its last recorded 3 s `G6` runs. On `main` today that is `position-6` depth 8 (3 of 5 runs in
     `qe-ABC-205`). If head needs more nodes than base at such a depth, a `G6` miss is predicted. QE then stops to
     Architect/Design before the run, and the bar is not re-levelled.
   - If no value-identical base reading exists, QE reports the counts and makes no prediction (`UNKNOWN - verify`).
   - The pre-check grades nothing and moves no bound. `G6` is still read as written.

## Dependencies

- **`ABC-205` merged.** It is the same file, and its merge is this ticket's D base.
- `ABC-204` Done.
- **Ready trigger:** `ABC-205` reaches Done, or BA/PM closes it under S1.
- *2026-10-25 (BA/PM, `bapm-close-ABC-205`):* **the Ready trigger is met.**
  - `ABC-205` was closed unmerged under S1 (`…154f2ced`; that page's § Close). Its code is not on `main`.
  - `ABC-204` is Done (merged `7f94e4cc`).
  - "`ABC-205` merged" above therefore reads as "closed". This ticket's D base is its own merge-base on `main`
    (`EPIC-008` § D).
  - `ABC-215` also edits `src/evaluate.ts`. Only one of the two is built and read at a time, and the Orchestrator
    picks the order (`ABC-215` § Dependencies: by default, `ABC-215` goes first).

## Size and priority

- **`S`:** weights, one small term, relation rows, one D reading.
- **`P3`:** low to medium gain (analysis § 6 item 4).

## Definition of Ready

BA/PM, 2026-10-23, at `main` `55a8f4ef`. **Result: 9 of 10. `Backlog`** until the Ready trigger above.

| # | item | verdict |
|---|---|---|
| 1 | problem clear | ✅ 4.Qa4 and the 88 cp of mobility, cited |
| 2 | scope and out-of-scope clear | ✅ two terms; the form, king safety and search fenced |
| 3 | INVEST-shaped | ✅ valuable alone; `S`; testable. Independent once `ABC-205` lands |
| 4 | acceptance testable and measurable | ✅ strict relations; the term is 0 where stated; ≤ 1 100 ns; ±100 cp; S1 |
| 5 | dependencies known | ✅ `ABC-205`, `ABC-204` |
| 6 | security/NFR triggers with a measurable target | ✅ `G2`, `G5`, `G6`, `G8` |
| 7 | test notes present | ✅ three |
| 8 | size assigned | ✅ `S` |
| 9 | priority assigned | ✅ `P3` |
| 10 | no major unresolved blocker | ⏳ held by sequence: `ABC-205` edits the same file, and its merge is the D base |

**Re-scored 2026-10-25 by BA/PM** (task `bapm-close-ABC-205`, at `main` `bb9fd7ef`). **Result: 10 of 10. `Ready`.**
Only these rows changed:

| # | item | verdict |
|---|---|---|
| 3 | INVEST-shaped | ✅ now independent: `ABC-205` is closed, and its code is not on `main` |
| 5 | dependencies known | ✅ `ABC-204` Done. `ABC-205` closed. The D base is the ticket's own merge-base. `ABC-215` goes one at a time with this ticket |
| 7 | test notes present | ✅ four (the frozen-clock pre-check added) |
| 10 | no major unresolved blocker | ✅ the sequence hold is gone. The owner's forward question on `G6` "≥ base" (`QE-205-c`) is open. Without an answer, the default keeps `G6` graded as written, so it does not block |

- **Risk, recorded and not a blocker.** Architect/Design expects this ticket's evaluation cost to be higher than
  `ABC-205`'s (`…912bcb0d`; `UNKNOWN - verify` until `G2` is read). With base on its `position-6` depth-8 edge, that
  makes a "≥ base" miss likely. Test note 4 is meant to catch it before the reading is spent.
