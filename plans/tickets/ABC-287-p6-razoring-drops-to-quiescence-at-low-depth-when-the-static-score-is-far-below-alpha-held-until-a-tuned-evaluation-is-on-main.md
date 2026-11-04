---
id: ABC-287
title: "P6: razoring. At low remaining depth, a node whose static score is far below alpha is resolved by quiescence instead of a full-width search, behind a test-only off-door pair. Held: rejected on today's evaluation; re-measured only after E2's second pull merges"
status: backlog
column: Backlog
size: S
priority: P3
epic: EPIC-011
feature: —
adr: "owed (the Architect's): a re-measure on main after E2's second pull merges, under the rows it failed (zugzwang, drift, audit, mate), then a new ADR (ADR-0026 d10) if it passes: the margins by depth, the exclusions, the door names, the firing figure at 100 ms and the intent. A new ADR is the owner's to accept (reading (b))"
---

# ABC-287: razoring (P6)

> **Cut 2026-11-04 by BA/PM: DoR 9/10, Backlog, HELD** (task `bapm-epic011-areas`, records only, at `main` `b274711c`;
> nothing run, built or timed). Source: the owner's ruling 3 (`orch-2026-10-30a` `…4c4cb03d`). `EPIC-011` Phase 2,
> stub row P6.
> - **Hold: rejected on today's evaluation** (`ADR-0061` § Alternatives). Measured alone on `main`: 0.79–0.83× at
>   depth 8 and +0.305 ply at 47 000 nodes, but it loses `zugzwang.004`, drifts up to 345 cp and shows 1.4–2.0 % audit
>   flips with one missed mate. Placed "last, not before E1 / E2" (`ADR-0056` D2's dated line of 2026-11-02).
> - **Re-open trigger:** E2's second pull merges (E1 has merged; E2's first pull closed NOT MET and did not ship).
>   Then the Architect re-measures razoring on that `main`, on the rows it failed. If it fails them again it is closed
>   as dropped.
> - **The board move is the Orchestrator's.**

## Problem

- **User:** every game.
- **Pain:** at low remaining depth a node far below alpha is still searched full width. Razoring trusts the static
  score to say such a node fails low, and checks that with quiescence.
- **Why it waits:** the trust is in the evaluation. On today's untuned evaluation it errs by up to 345 cp and misses a
  mate. A tuned table may err less; whether it does is `UNKNOWN - verify` until the re-measure.
- **Value:** `ADR-0056` D2 row P6 estimates **+5–15 Elo** (an estimate, [B] 8.0). Not a reading.

## Scope

The ADR governs each line.

1. At null-window nodes of low remaining depth, out of check, when the static score plus a margin by depth is at or
   below alpha, the node's value is taken from quiescence (with a re-check the ADR names, or none).
2. The depths, the margins and the exclusions are the ADR's.
3. One switch and a test-only off-door pair (`ADR-0026` d10). Older doors turn it off.

## Out of scope

- Reverse futility (P2, dropped), futility's margins (`ADR-0061`), any evaluation change.

## Acceptance criteria

The re-measure and the ADR fix exact numbers before Ready. None is loosened after Ready.

- **Z0 (identity):** switch off, node counts equal `main`'s exactly; every pre-ticket door reproduces its counts
  (`G4`).
- **Z1 (the rule):** units on each margin and each exclusion.
- **Z2 (the rows it failed):** `zugzwang.004` and the other six zugzwang rows 7 / 7 at their recorded depths, none
  re-pinned; the mate floor at 0 violations; a drift bar and a cut audit (flip share) with numbers the ADR sets.
- **Z3 (safety):** `G1` ≥ 54 / 58 with no NEWLY-missed line.
- **Z4 (pay, owed):** a fixed-depth node ratio on kiwipete and position-6 in both recursions, the number the ADR's.
- **Z5 (the read; `EPIC-011` § The per-change rule, by reference).** Intent named by the ADR before Ready (the epic
  and `ADR-0056` state none). C2′ ≥ 50.0 (GAIN) or ≥ 43.0 (NEUTRAL) of 100, S′ at E 1 810, the Levels deep lane.
- **Z6:** `G6` "≥ base" (a search ticket).

### Falsifiers

| # | fires when | disposition |
|---|---|---|
| F1 | the re-measure fails Z2 | closed as dropped (premise not met); nothing built |
| F2 | Z0 red | a defect in the wiring |
| F3 | Z2 or Z3 red on the build | a defect check first; if real, NOT MET |
| F4 | Z5 NOT MET | not merged |

## NFR triggers

- **`NFR-005`** (`G6`): "≥ base" binds; every run ≥ 6.
- **`NFR-008`** (≤ 10 s): units in the default lane; probe rows in `SEARCH_DEEP`.
- **`NFR-009`:** no new table.

## Test notes

1. QE freezes the re-measure's set before it runs.
2. UAT is owed (production lines); the QE verdict signs it.

## Size and priority

- **Size: S.** **Priority: P3**, the smallest Phase 2 estimate.

## Dependencies

- **E2's second pull merged** (no ticket id yet; it follows `ABC-271`). Hard.
- **The re-measure and the ADR** (the Architect's). DoR row 10.
- **One at a time on `src/search.ts` / `src/engine.ts`** with the other search tickets.

## Definition of Ready

| # | check | state |
|---|---|---|
| 1 | problem clear | ✅ no razoring; why it was rejected is measured; the value is an estimate |
| 2 | scope and out-of-scope | ✅ scope 1–3 |
| 3 | INVEST | ✅ S; one rule |
| 4 | testable, measurable acceptance | ✅ Z0 exact; Z2 7 / 7 and 0; Z3 ≥ 54; Z5 ≥ 50.0 or ≥ 43.0. Drift, audit and pay numbers owed with the ADR (row 10) |
| 5 | dependencies known | ✅ the second pull; the re-measure; the shared files |
| 6 | NFR triggers with targets | ✅ `NFR-005`, `NFR-008` ≤ 10 s, `NFR-009` none |
| 7 | test notes | ✅ 1–2 |
| 8 | size | ✅ S |
| 9 | priority | ✅ P3 |
| 10 | no major unresolved blocker | ❌ **held: rejected on today's evaluation**; re-measured after the second pull; the ADR is owed |

**DoR 9/10. Backlog, held.**
