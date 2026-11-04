---
id: ABC-286
title: "P4: late-move (move-count) pruning skips the late quiet moves at low remaining depth, by a move-count table, behind a test-only off-door pair. Held until a quiet-move order exists on main (history, ABC-283) and a joint probe with history as its input meets every bar"
status: backlog
column: Backlog
size: S
priority: P3
epic: EPIC-011
feature: —
adr: "owed (the Architect's): a new ADR (ADR-0026 d10) after a pre-registered joint probe over the history table (ADR-0063 decision 11): the count table by depth, the exclusions, the door names, the drift, audit and pay bars, the firing figure at 100 ms and the intent. A new ADR is the owner's to accept (reading (b))"
---

# ABC-286: late-move pruning (P4)

> **UNHELD FOR ITS PROBE 2026-11-04: `ABC-283` MERGED (`58e90d07`), by BA/PM** (task `bapm-ABC-283-done`, records
> only, at `main` `fd6b595f`; nothing run). Source: the Orchestrator's disposition `orch-2026-10-30a` `…2409cec9` 5
> and the Architect's owed lines (`arch-ABC-283-accept` `…cbf0bc7b` § Owed, item 4).
> - **The first half of the re-open trigger is met:** a quiet-move order is on `main`, `ADR-0063`'s history table with
>   K3 (max(0, h)), ACCEPTED as a bundle and in force at the merge.
> - **What still holds it:** the Architect's pre-registered joint probe with history as its input (`ADR-0063`
>   decision 11) meeting every bar, and the ADR. The probe may now run. DoR row 10 stays ❌ on the probe and the ADR
>   only. **DoR 9/10, Backlog.** The board move is the Orchestrator's.

> **Cut 2026-11-04 by BA/PM: DoR 9/10, Backlog, HELD** (task `bapm-epic011-areas`, records only, at `main` `b274711c`;
> nothing run, built or timed). Source: the owner's ruling 3 (`orch-2026-10-30a` `…4c4cb03d`). `EPIC-011` Phase 2,
> stub row P4.
> - **Hold:** without a quiet-move order it prunes generation-order moves. Measured alone on `main` (`ADR-0061`
>   § Alternatives): 0.64–0.97× at depth 8 and +0.34 to +0.50 ply at 47 000 nodes, but only 87.7–89.3 % within 25 cp,
>   11.5–11.9 % audit flips with piece-sized errors, and the depth-1 form costs nodes on position-6.
> - **Re-open trigger:** `ABC-283` merges (the history table, `ADR-0063`, on `main`), then the Architect's
>   pre-registered joint probe with history as its input (`ADR-0063` decision 11) meets every bar. If `ABC-283`
>   misses, this stays held: O1h stays parked, and no other quiet-move order is on record.
> - **The board move is the Orchestrator's.**

## Problem

- **User:** every game; the deeper the search, the more it pays.
- **Pain:** at low remaining depth every quiet move is searched, however late, unless futility (`ADR-0061`) drops it on
  the static margin. The late quiet moves of a low node rarely raise alpha.
- **Value:** `ADR-0056` D2 row P4 estimates **+20–40 Elo** (an estimate, [B] 7.5, about +30). Not a reading.

## Scope

The ADR governs each line.

1. At null-window nodes of low remaining depth, a quiet move past a move-count threshold by depth is skipped. The
   depths, the counts and the exclusions are the ADR's (futility's exclusions in `ADR-0061` are the nearest
   precedent).
2. The quiet moves are ordered by history (`ABC-283`) when the rule acts, so the skipped moves are the low-history
   ones.
3. One switch and a test-only off-door pair (`ADR-0026` d10). Older doors turn it off.

## Out of scope

- A history term in LMR (`ABC-284`), countermove ordering (`ABC-288`), any change to futility's margins.

## Acceptance criteria

The ADR fixes exact counts and bars before Ready. None is loosened after Ready.

- **L0 (identity):** switch off, node counts equal `main`'s exactly; every pre-ticket door reproduces its counts (`G4`).
- **L1 (the rule):** units on the count table and on each exclusion, one row each.
- **L2 (drift and audit, owed):** a drift bar (share within 25 cp, a cap) and a cut audit (flip share, no piece-sized
  error), each a number the ADR sets on the joint probe. These are the rows P4 failed alone.
- **L3 (safety, `ADR-0064` d7's list):** mate floor 0 violations; zugzwang 7 / 7 at recorded depths, none re-pinned;
  `G1` ≥ 54 / 58 with no NEWLY-missed line.
- **L4 (pay, owed):** a fixed-depth node ratio on kiwipete and position-6 in both recursions and a reach gain at 47 000
  nodes, numbers the ADR's.
- **L5 (the read; `EPIC-011` § The per-change rule, by reference).** Intent named by the ADR before Ready (the epic
  and `ADR-0056` state none). C2′ ≥ 50.0 (GAIN) or ≥ 43.0 (NEUTRAL) of 100, S′ at E 1 810, the Levels deep lane.
- **L6:** `G6` "≥ base" (a search ticket).

### Falsifiers

| # | fires when | disposition |
|---|---|---|
| F1 | the joint probe misses L2, L3 or L4 | stays held; no form is tuned after the read |
| F2 | L0 red | a defect in the wiring |
| F3 | L3 red on the build | a defect check first; if real, NOT MET |
| F4 | L5 NOT MET | not merged |

## NFR triggers

- **`NFR-005`** (`G6`): "≥ base" binds; every run ≥ 6.
- **`NFR-008`** (≤ 10 s): units in the default lane; the probe rows in `SEARCH_DEEP`.
- **`NFR-009`:** no new table beyond the count table (bytes).

## Test notes

1. QE freezes the joint probe's set and the door counts before the build.
2. UAT is owed (production lines); the QE verdict signs it.

## Size and priority

- **Size: S** (`ADR-0056` D2). **Priority: P3**, held on `ABC-283`.

## Dependencies

- **`ABC-283` merged** (hard): the history table. Its single read decides it. *2026-11-04 (`bapm-ABC-283-done`):
  **met**, merged `58e90d07` (C2′ 66.0 / 100).*
- **The joint probe and the ADR** (the Architect's). DoR row 10.
- **One at a time on `src/search.ts` / `src/engine.ts`** with `ABC-284`, `ABC-285`, `ABC-287`, `ABC-296`, `ABC-297`.

## Definition of Ready

| # | check | state |
|---|---|---|
| 1 | problem clear | ✅ no move-count pruning; why it failed alone is measured; the value is an estimate |
| 2 | scope and out-of-scope | ✅ scope 1–3 |
| 3 | INVEST | ✅ S; one rule |
| 4 | testable, measurable acceptance | ✅ L0 exact; L3 0 / 7 of 7 / ≥ 54; L5 ≥ 50.0 or ≥ 43.0. L2 and L4 numbers owed with the ADR (row 10) |
| 5 | dependencies known | ✅ `ABC-283`; the probe; the shared files |
| 6 | NFR triggers with targets | ✅ `NFR-005`, `NFR-008` ≤ 10 s, `NFR-009` |
| 7 | test notes | ✅ 1–2 |
| 8 | size | ✅ S |
| 9 | priority | ✅ P3 |
| 10 | no major unresolved blocker | ❌ ~~**held on `ABC-283` and the joint probe**~~ **held on the joint probe**; the ADR is owed *(2026-11-04, `bapm-ABC-283-done`: `ABC-283` merged `58e90d07`)* |

**DoR 9/10. Backlog, held.**
