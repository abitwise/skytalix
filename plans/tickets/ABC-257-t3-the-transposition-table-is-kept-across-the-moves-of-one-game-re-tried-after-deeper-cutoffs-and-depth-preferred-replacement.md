---
id: ABC-257
title: "T3: the transposition table is kept across the moves of one game, re-tried after deeper-entry cutoffs (ABC-238) and depth-preferred replacement (ABC-237), its size unchanged"
status: backlog
column: Backlog
size: S
priority: P3
epic: EPIC-011
adr: "ADR-0025 decision 4 amendment of 2026-10-26: ACCEPTED by the owner (…2ae5fc12 item 1), NOT in force on main (ABC-209 closed unmerged); the Architect re-reads it on the post-T1/T2 base"
---

# ABC-257: keep the TT across moves, re-tried (T3)

> **Cut 2026-11-01 by BA/PM** (task `bapm-epic011-dedupe`, records only, at `main` `2e9a2457`; nothing run). Source:
> `ADR-0056` D2 row T3 ("TT kept across moves, re-tried **after T1** (its NEUTRAL was read under exact-depth cutoffs,
> where a kept entry almost never cuts)"; +10–30 after T1, estimate) and D4 ("Tried and dropped, worth a re-try because
> a precondition changed"). The owner re-opened `EPIC-010`'s fenced re-tries by choosing a new epic (Q-3K-5,
> `…022fb66f`). `EPIC-011` Phase 1, after `ABC-238` and `ABC-237`.
>
> **This is the re-try of `ABC-209`, under a new id.** `ABC-209` stays dropped (D NEUTRAL +8.7 ± 18.3, 800 games,
> `bapm-s1-ABC-209`); its code `grugops/ABC-209` `bb6cf451` is the reference, and its acceptance rows `A1`–`A5`, `A7`
> are carried here by reference rather than restated. **What changed since:** with exact-depth cutoffs only
> (`entryDepth(slot) !== depth`), an entry stored at depth d by the previous move is probed at depth d − 2 and never
> cuts; after `ABC-238` it may.

## Problem

- **User:** the owner at level 5 and in `uci-clock-mode` at 40/15.
- **Pain:** the table is cleared at every `chooseMove`, so each move re-searches what the previous move just proved.
  At 40/15 (≈ 22 s a move) that is the most work thrown away of any control.
- **Value:** hash moves and, after T1, cutoffs from the previous move's search.

## Scope

1. `ABC-209`'s Scope, re-implemented on the post-1b, post-T1/T2 base (the old branch is a reference, not a rebase):
   kept across the moves of one game; cleared on a new game (`ucinewgame`, a non-continuing `position`, the CLI's new
   game); the clear door (`ADR-0026` d10) reproduces today.
2. Whatever the depth-preferred rule of `ABC-237` needs for entries from an older search (an age or generation field,
   if its ADR names one).

## Out of scope

- Table size (`ABC-258`). Buckets. A UCI `Hash` option. Any eval or search change.

## Acceptance criteria

- **A1–A5, A7:** as `ABC-209`'s page (fresh game node-equal to base; cleared when it must be; ≥ 1 kept entry probed on
  the next move; `NFR-009` size and growth, including `heapUsed` ≤ 1 MiB over a 40-move game; `G1`, `G4` with the clear
  door, `G5`, `G6`, `G8`, `G9`; the ADR records that it was reported to the owner), re-read at refinement against the
  base this ticket is written on.
- **A6 (the reading, replacing `ABC-209`'s S1).** *(2026-11-01, the owner's rule, `bapm-100-400-rule`; replaces the smoke pair and the SPRT this row named.)* One 100-game read at 100 ms a move before the merge (`EPIC-011` § The per-change rule): the candidate head rebased on `main` against its merge-base, self-play, openings 1–50 with both colours, one game at a time, through `ABC-255`. 100 of 100 games complete, the candidate makes 0 faults and loses 0 games on time, and the score meets the `ADR-0056` fold's pass line (`arch-adr0056-100ms-fold`, pending; `UNKNOWN - verify` until merged). Reported: W/L/D, score, `cutechess-cli`'s Elo ± error. A miss of the pass line closes the ticket; it is not re-tuned without the owner's word.
- **A8 (it pays where it should).** On a 10-move sequence of one game at a fixed depth (QE fixes both before the first
  build; a 40/15 move is not a lane row), the summed nodes of moves 2–10 are ≤ 0.90 × the clear door's.

## NFR triggers

- **`NFR-009`:** A4 (unchanged 4 MiB; growth over a game ≤ 1 MiB). **`NFR-005`:** `G6`. **Security:** none.

## Test notes

1. The clear paths are lane rows on the virtual clock; A8 is a fixed-depth row under `ENGINE_DEEP=1`.
2. UAT is owed (production lines). The QE verdict signs it.

## Size and priority

- **Size: S** (`ADR-0056`: "S (code exists)"). **Priority: P3.**

## Dependencies

- `ABC-238` and `ABC-237` merged or closed (same file, `src/transposition.ts`; the precondition this re-try rests on).
- **Architect:** re-read the accepted `ADR-0025` d4 amendment on the new base and give it its in-force line at merge.
- **Owner:** none new (the amendment is his, accepted 2026-10-26). Q-3K-2 only shapes A6. *(2026-11-01: answered, no SPRT; A6 is the 100-game read.)*

## Definition of Ready

| # | check | state |
|---|---|---|
| 1 | problem clear | ✅ `ADR-0056` T3; `ABC-209`'s record |
| 2 | scope and out-of-scope | ✅ |
| 3 | INVEST | ✅ S |
| 4 | testable, measurable acceptance | ✅ carried rows plus A8's 0.90 × |
| 5 | dependencies known | ✅ |
| 6 | NFR triggers with targets | ✅ `NFR-009` growth ≤ 1 MiB |
| 7 | test notes | ✅ |
| 8 | size | ✅ S |
| 9 | priority | ✅ P3 |
| 10 | no major unresolved blocker | ❌ `ABC-238`, `ABC-237`; `EPIC-011` not started |

**DoR 8/10** (row 4's carried rows are re-read at refinement). **Backlog.**
