---
id: ABC-285
title: "P5: the null-move reduction R grows with remaining depth and the static eval margin, amending ADR-0050's fixed R = 3 (ABC-208), behind a test-only off-door pair; a NEUTRAL (invisible at 100 ms) candidate with a deep-depth bar; deferred"
status: dropped
column: Done
size: S
priority: P3
epic: EPIC-011
feature: —
adr: "owed (the Architect's): an ADR-0050 amendment fixing R's rule (depth and margin terms), the guards kept (three non-pawn pieces, not in check, not at the root, not after a null move), the door names, the firing figure at 100 ms and the deep-depth bar the NEUTRAL intent needs. ADR-0050 is accepted, so the amendment is the owner's to accept (reading (b))"
---

# ABC-285: null move whose R grows with depth and margin (P5)

> **CLOSED WON'T-DO, 2026-11-09, by BA/PM** (task `bapm-close-1109`, records only, at `main` `e069b49a`; nothing run): project closed by the owner 2026-11-09 (`orch-2026-10-30a` `…a9c03e07`). Status `dropped`, column Done: closed, not delivered. The page below stands as the record; the board move is the Orchestrator's.

> **Cut 2026-11-04 by BA/PM: DoR 9/10, Backlog, DEFERRED** (task `bapm-epic011-areas`, records only, at `main`
> `b274711c`; nothing run, built or timed). Source: the owner's ruling 3 (`orch-2026-10-30a` `…4c4cb03d`). `EPIC-011`
> Phase 2, stub row P5.
> - **Hold:** deferred by the Orchestrator's ruling (Phase 2 closed without it, 2026-11-02). At 100 ms its value is
>   about 0 (`arch-next-pull` `…7e3ace66`: 0.88–0.95×, +0.06 ply), so its read can only show "no harm".
> - **Re-open trigger:** the Orchestrator's pull, once the Architect writes the `ADR-0050` amendment with its deep-depth
>   bar. No evidence gate holds it: it measured clean on every safety row.
> - **The board move is the Orchestrator's.**

## Problem

- **User:** games at longer controls, where the search goes deep: the 40/15 claim (`ADR-0056` C1).
- **Pain:** `main`'s null move reduces by a fixed R = 3 at every depth (`ADR-0050`). At depth 12 and more a larger R
  would skip more of a refuted subtree.
- **Counter-evidence on record:** `ADR-0050`'s own probe found R = 3 beat R = 2 and an adaptive R on both boards at
  depth 8, with the same `G1` and similar drift. The pay, if any, is above depth 8.
- **Value:** `ADR-0056` D2 row P5 estimates **+10–30 Elo** (an estimate, [B] 7.3, [J]). On `main` it read 0.88–0.95×
  at depth 8 and +0.06 to +0.09 ply at 47 000 nodes (`ADR-0061` § Context), not a reading of play.

## Scope

The `ADR-0050` amendment governs each line.

1. R becomes a stated function of remaining depth and of how far the static score is above beta. The amendment names
   the rule, its floor and its cap.
2. Every `ADR-0050` guard is kept: not in check, not at the root, not after a null move, and at least three non-pawn
   pieces for the side to move.
3. One switch and a test-only off-door pair (`ADR-0026` d10). Older doors turn it off.

## Out of scope

- A verification search (`ADR-0050`: it recovered at most `zugzwang.001`, three plies late, at a node cost).
- Any change to the guards' piece count, to futility (`ADR-0061`) or to LMR (`ABC-284`).

## Acceptance criteria

The amendment fixes exact counts before Ready. None is loosened after Ready.

- **N0 (identity):** with the switch off, node counts equal `main`'s exactly; every pre-ticket door reproduces its
  counts (`G4`). Whether a band of the rule also reads `main`'s counts depends on the rule (`UNKNOWN - verify`).
- **N1 (the rule):** units on the R table, one row per depth band and margin band the amendment names, plus one row per
  guard.
- **N2 (safety, `ADR-0064` d7's list):** mate floor 0 violations; `ADR-0050` d9's zugzwang rows 7 / 7 at their recorded
  depths, none re-pinned; `G1` ≥ 54 / 58 with no NEWLY-missed line.
- **N3 (the deep-depth bar, owed):** a pre-registered measured bar that sees depth above 8 (a fixed-depth node ratio at
  the amendment's depths, or completed depth at a longer budget, held out). Its number is the Architect's. It never
  stands alone, and a miss is NOT MET (`EPIC-011` § The per-change rule, "C yes").
- **N4 (the read). Intent: NEUTRAL (invisible at 100 ms)**, as `ADR-0056` D2's dated line of 2026-11-02 names it,
  confirmed by the amendment's firing figure before Ready and never re-classed after a score is seen. C2′ ≥ 43.0 of
  100, S′ at E 1 810 and the Levels deep lane. A miss is NOT MET and is not re-played.
- **N5:** `G6` "≥ base" (a search ticket).

### Falsifiers

| # | fires when | disposition |
|---|---|---|
| F1 | N0 red | a defect in the wiring |
| F2 | N2 red | a defect check first; if real, NOT MET |
| F3 | N3 missed | NOT MET; R = 3 stays |
| F4 | N4 NOT MET | not merged |

## NFR triggers

- **`NFR-005`** (`G6`): "≥ base" binds; every run at depth ≥ 6.
- **`NFR-008`** (≤ 10 s): units only in the default lane; the probe rows in `SEARCH_DEEP` (`src/search.null-move.test.ts`
  already has a deep lane, 45 rows).
- **`NFR-009`:** no new table.

## Test notes

1. QE freezes N3's held-out set before the build.
2. The existing null-move deep lane is re-run on the head: `SEARCH_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 npx
   vitest run src/search.null-move.test.ts`; its count is recorded.
3. UAT is owed (production lines); the QE verdict signs it.

## Size and priority

- **Size: S.** **Priority: P3:** about 0 at 100 ms, deferred by ruling.

## Dependencies

- **The `ADR-0050` amendment** (the Architect's; the owner accepts). DoR row 10.
- **One at a time on `src/search.ts` / `src/engine.ts`** with the other search tickets (`ABC-283`, `ABC-284`,
  `ABC-286`, `ABC-287`, `ABC-296`, `ABC-297`).

## Definition of Ready

| # | check | state |
|---|---|---|
| 1 | problem clear | ✅ fixed R = 3; the counter-evidence at d8 is stated; the value is an estimate |
| 2 | scope and out-of-scope | ✅ scope 1–3; verification search and guard changes out |
| 3 | INVEST | ✅ S; one rule |
| 4 | testable, measurable acceptance | ✅ N0 exact; N2 0 / 7 of 7 / ≥ 54; N4 ≥ 43.0 of 100. N3's number is owed with the ADR (row 10) |
| 5 | dependencies known | ✅ the amendment; the shared files |
| 6 | NFR triggers with targets | ✅ `NFR-005`, `NFR-008` ≤ 10 s, `NFR-009` none |
| 7 | test notes | ✅ 1–3 |
| 8 | size | ✅ S |
| 9 | priority | ✅ P3 |
| 10 | no major unresolved blocker | ❌ **the `ADR-0050` amendment is owed**, with N3's deep-depth bar; deferred by the Orchestrator's ruling |

**DoR 9/10. Backlog, deferred.**
