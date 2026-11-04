---
id: ABC-288
title: "O2c: countermove and continuation history. Quiet moves are also ordered by the move that answered the opponent's last move and by history keyed on the previous move(s), on top of the history table, behind a test-only off-door pair. Held on the Architect's probe and ADR (ABC-283 merged 58e90d07, putting O1h's history table on main)"
status: backlog
column: Backlog
size: M
priority: P3
epic: EPIC-011
feature: —
adr: "owed (the Architect's): a new ADR (ADR-0026 d10) or an ADR-0063 amendment, the Architect's call: the tables (countermove, continuation history: keys, entry width, size), where they sit in the order after the killers and history, the update and clearing rule, the pay gate (ADR-0063's ≤ 0.95× precedent), the firing figure at 100 ms and the intent. A new ADR or an amendment of an accepted one is the owner's to accept (reading (b))"
---

# ABC-288: countermove and continuation history (O2c)

> **UNHELD FOR ITS PROBE 2026-11-04: `ABC-283` MERGED (`58e90d07`), by BA/PM** (task `bapm-ABC-283-done`, records
> only, at `main` `fd6b595f`; nothing run). Source: the Orchestrator's disposition `orch-2026-10-30a` `…2409cec9` 5
> and the Architect's owed lines (`arch-ABC-283-accept` `…cbf0bc7b` § Owed, item 4).
> - **Re-open trigger (a) is met:** `ABC-283` merged, so `ADR-0063`'s history table (with K3, max(0, h)) is on `main`,
>   ACCEPTED as a bundle and in force at the merge. Trigger (b) (the miss branch) is moot.
> - **What still holds it:** the Architect's pre-registered probe (CH3's pay gate) and the ADR, a new one or an
>   `ADR-0063` amendment. The probe may now run. DoR row 10 stays ❌ on the probe and the ADR only. **DoR 9/10,
>   Backlog.** The board move is the Orchestrator's.
> - **The title** drops "held until `ABC-283` merges"; the file slug is kept (sealed notes cite paths).

> **Cut 2026-11-04 by BA/PM: DoR 9/10, Backlog, HELD** (task `bapm-epic011-areas`, records only, at `main` `b274711c`;
> nothing run, built or timed). Source: the owner's ruling 3 (`orch-2026-10-30a` `…4c4cb03d`). `EPIC-011` Phase 3,
> stub row O2c.
> - **Hold:** O2c builds on O1h's history table (`ABC-233`, `ADR-0063`). O1h is re-opened inside `ABC-283` (the
>   O1h + O3s + S1 bundle), which merges or misses on ONE read.
> - **Re-open trigger:** (a) `ABC-283` merges, putting the history table on `main`; or (b) if it misses, the Architect
>   names O2c itself as the premise that re-opens O1h (`ADR-0063` § Status, re-open 2: "an ordering change that leaves
>   more quiet cutoffs to history, such as O2c"), and this ticket then carries its own history table.
> - **The board move is the Orchestrator's.**

## Problem

- **User:** every game.
- **Pain:** after the hash move and the two killers, quiet moves are ordered without regard to the move just played.
  A move that refuted the opponent's last move elsewhere in the tree is not tried early.
- **Counter-evidence on record:** on `main` 82 % of cutoffs fall on the first move, and the killers hold 90 % of
  quiet cutoffs (`ADR-0063` § Context). History alone read 0.78–1.00× at depth 8 and missed its pay gate. O2c's
  pay on top of that may be small too; the probe says.
- **Value:** `ADR-0056` D2 row O2c estimates **+10–30 Elo** (an estimate, [J], lowest confidence). Not a reading.

## Scope

The ADR governs each line.

1. A countermove table and continuation-history tables, by the keys and entry widths the ADR names, raised on a quiet
   cutoff by the rule it names.
2. Their place in the quiet-move order relative to the killers and the history table (`ABC-283`).
3. Cleared on the rule the ADR names (`ADR-0063`'s table is cleared every search).
4. One switch and a test-only off-door pair (`ADR-0026` d10). Older doors turn it off.

## Out of scope

- A history term in LMR (`ABC-284`) or pruning by history (`ABC-286`).
- SEE ordering (in `ABC-283`), staged generation (`ABC-298`).

## Acceptance criteria

The ADR fixes exact counts and bars before Ready. None is loosened after Ready.

- **CH0 (identity):** switch off, node counts equal `main`'s exactly; every pre-ticket door reproduces its counts
  (`G4`).
- **CH1 (the tables):** units on the update, the read and the clear, one row each; the tables' byte size pinned.
- **CH2 (safety, `ADR-0064` d7's list):** mate floor 0 violations; zugzwang 7 / 7 at recorded depths, none re-pinned;
  `G1` ≥ 54 / 58 with no NEWLY-missed line. Ordering changes no score at a fixed depth in a full-width search, but
  pruning and reductions read the index, so drift is read (`ADR-0063` decision 11's caveat).
- **CH3 (pay, owed):** a pre-registered pay gate, `ADR-0063`'s shape (a fixed-depth node ratio on four readings) with
  the ADR's number.
- **CH4 (the read; `EPIC-011` § The per-change rule, by reference).** Intent named by the ADR before Ready. C2′ ≥ 50.0
  (GAIN) or ≥ 43.0 (NEUTRAL) of 100, S′ at E 1 810, the Levels deep lane.
- **CH5:** `G6` "≥ base" (a search ticket).

### Falsifiers

| # | fires when | disposition |
|---|---|---|
| F1 | CH3 missed on the probe | stays held, as `ADR-0063` was; no form is tuned after the read |
| F2 | CH0 red | a defect |
| F3 | CH2 red | a defect check first; if real, NOT MET |
| F4 | CH4 NOT MET | not merged |

## NFR triggers

- **`NFR-009`** (`G7`): the tables count against **≤ 16 MiB** in all (the 4 MiB table, the 576 KiB pawn memo after
  `ABC-271`, `ADR-0063`'s 32 KiB history), allocated once, with **≤ 1 MiB** growth between a 1 s and a 4 s search. The
  ADR states the bytes. A form over 16 MiB in all is the owner's word (`Q-3K-6`'s shape), not this ticket's.
- **`NFR-005`** (`G6`): "≥ base" binds.
- **`NFR-008`** (≤ 10 s): units only in the default lane.
  - *2026-11-04 (`bapm-lines-1104`; `…f30bd604` 1): **a default-lane budget of ≤ +0.10 s for bundle 1 as a whole**
    (this ticket and `ABC-286` together, not each; named `…3b15b361` 3), read as the head-minus-base median wall.
    Aim, not a gate: the rows the bundle adds or changes sum to ≤ 90 ms in-thread, none added to `src/cli.test.ts`.
    Rows of ≥ 50 ms go deep. No new default-lane file.*

## Test notes

1. QE freezes the probe's readings and door counts before the build.
2. UAT is owed (production lines); the QE verdict signs it.

## Size and priority

- **Size: M** (`ADR-0056` D2). **Priority: P3**, held.

## Dependencies

- **`ABC-283` merged** (re-open (a)), or the Architect's re-open (b). DoR row 10. *2026-11-04 (`bapm-ABC-283-done`):
  **(a) met**, merged `58e90d07`; (b) moot.*
- **One at a time on `orderMoves` (`src/search.ts`) and `src/engine.ts`** with `ABC-283`, `ABC-286` and `ABC-298`.

## Definition of Ready

| # | check | state |
|---|---|---|
| 1 | problem clear | ✅ quiet order ignores the last move; the small-pay risk is stated; the value is an estimate |
| 2 | scope and out-of-scope | ✅ scope 1–4 |
| 3 | INVEST | ✅ M; one ordering change |
| 4 | testable, measurable acceptance | ✅ CH0 exact; CH2 0 / 7 of 7 / ≥ 54; CH4 ≥ 50.0 or ≥ 43.0. CH3's number owed with the ADR (row 10) |
| 5 | dependencies known | ✅ `ABC-283`; the shared files |
| 6 | NFR triggers with targets | ✅ `NFR-009` ≤ 16 MiB / ≤ 1 MiB; `NFR-005`; `NFR-008` ≤ 10 s |
| 7 | test notes | ✅ 1–2 |
| 8 | size | ✅ M |
| 9 | priority | ✅ P3 |
| 10 | no major unresolved blocker | ❌ ~~**held on `ABC-283`'s read**~~ **held on the Architect's probe**; the ADR is owed *(2026-11-04, `bapm-ABC-283-done`: `ABC-283` merged `58e90d07`)* |

**DoR 9/10. Backlog, held.**
