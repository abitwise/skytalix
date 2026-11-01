---
id: ABC-233
title: "A history heuristic orders quiet moves after the killers, cleared per search, behind an off-door"
status: backlog
column: Backlog
size: M
priority: P3
epic: EPIC-011
---

# ABC-233: history heuristic for quiet moves

> **RE-HOMED 2026-11-01 to `EPIC-011` by BA/PM** (task `bapm-epic011-dedupe`, records only, at `main` `2e9a2457`). The
> owner asked for a new epic for the 3 000 path, started after the open epics close, and for no work done twice
> (`orch-2026-10-30a` `…022fb66f`). `ADR-0056` D4 maps this ticket to its gap list, so it leaves `EPIC-010` rather
> than holding that epic's close. **Id unchanged; nothing below this block is edited.** `ADR-0056` row O1h. `EPIC-011`
> Phase 3, first. Countermove and continuation history (O2c) build on it and are a separate stub, out of this ticket's
> scope. Its reading is `EPIC-011` § The per-change rule (today `EPIC-010` § The merge rule, by reference; plus
> `ABC-255`'s SPRT if the owner says yes to Q-3K-2). Line cites in `src/` are re-read at refinement: milestone 1b
> (`ABC-251`) rewrites `orderMoves` first.

> **Cut 2026-10-29 by BA/PM** (task `bapm-epic010-improvements`, records only, at `main` `f45aea95`). § B item 6,
> verified (SA `…306a4012` rows 6a, 6b, and the LMR constraint under 6c). Never tried. **Waits in Backlog on** an ADR
> and the owner's Q4. Milestone 2.

> **AMENDED 2026-10-29 by BA/PM** (task `bapm-owner-words-b`, records only): the owner set Q4 = (e), extended
> (`orch-2026-10-29g` `…278e149b`). This ticket's reading is now the smoke pair before merge (`EPIC-010` § The
> merge rule), with a batched validation later. Q4 no longer holds it. **Next real wait:** the ADR. Milestone 2. DoR 8/10 → 9/10.

## Problem

- **User:** the owner at level 5.
- **Pain:** after the hash move, captures and two killers, quiet moves come in generation order
  (`src/search.ts:172-197`). Late-move reduction reduces by the move's index (`src/search.ts:276`), so a good quiet
  move late in generation order is searched shallower.
- **Value:** good quiet moves come earlier, so fewer are reduced and more cutoffs come sooner.

## Scope

1. A from-to (or piece-to) history table, raised on a quiet move's beta cutoff by a depth-scaled amount, read by
   `orderKey` after the killers.
2. **Cleared at the start of every search** (`ABC-080` `A6`: nothing learned in one search is offered in the next).
3. An `ADR-0026` d10 off-door pair: an order change changes values under LMR (SA 6c).

## Out of scope

- Counter-move and continuation history. History-based pruning. SEE (`ABC-234`).

## Acceptance criteria

- **A1 (the door).** Node-equal, cross-build, on the `ABC-078` `A3` corpus (`G4`).
- **A2 (it orders).** **Given** a test search on 6 fixed positions, **then** after the search the table is non-zero
  for ≥ 1 quiet move, and on a second search of the same position the table starts at zero.
- **A3 (it pays in nodes).** **Given** `kiwipete` and `position-6` at fixed depth 7, **then** nodes ≤ **0.95 ×** the
  door's on both (an ordering change that does not cut nodes is not worth its reading).
- **A4 (drift).** **Given** `ABC-121`'s 190 at depth 5, **then** ≥ 95 % of non-mate scores are within 25 cp of the
  door's (`ADR-0026` d9's figure; the ADR may set its own, reported to the owner).
- **A5 (gates).** `G1`, `G5`, `G6` "≥ base" (floor 6), `G7` (the table's bytes reported), `G8`, `G9`, `G10`.
- **A6 (the reading).** *(2026-11-01, the owner's rule, `bapm-100-400-rule`; replaces the smoke pair of `EPIC-010` § The merge rule.)* One 100-game read at 100 ms a move before the merge (`EPIC-011` § The per-change rule): the candidate head rebased on `main` against its merge-base, self-play, openings 1–50 with both colours, one game at a time, through `ABC-255`. 100 of 100 games complete, the candidate makes 0 faults and loses 0 games on time at the 50 ms margin, and the score meets `ADR-0056` C2′ (merged `94f1504c`): ≥ 50.0 of 100 for a GAIN, ≥ 43.0 for a NEUTRAL, the intent declared at design. A miss is NOT MET and is not re-played. Reported: W/L/D, score, `cutechess-cli`'s Elo ± error, `G11`. *(2026-11-01, `bapm-owner-answers`, the owner's answer 3.)* **And the Stockfish smoke beside it:** 10 games, the candidate at 0.5 s a move against Stockfish 19 `UCI_LimitStrength`, one game at a time, through `ABC-255` (`EPIC-011` § The per-change rule): 10 of 10 complete, 0 faults, 0 losses on time, and the no-collapse bar the `ADR-0056` owner-answers fold names for 0.5 s (`UNKNOWN - verify` until it merges).

## NFR triggers

- **`NFR-009`:** a 64 × 64 table of 32-bit counters is 16 KiB; `G7` reads it. **`NFR-005`:** A3, `G6`.
- **Security:** none.

## Test notes

1. UAT is owed. The QE verdict signs it.

## Size and priority

- **Size: M.** A table, a hook at the cutoff, an order key, a door pair, an ADR. **Priority: P3.**

## Dependencies

- **Architect/Design:** an ADR naming the table, its update, its clearing, and the door (`ADR-0026` d10). Reported to
  the owner. **Owner:** Q4 answered 2026-10-29: (e), extended (`orch-2026-10-29g` `…278e149b`). Shares `orderMoves` with `ABC-234`: one at a time.

## Definition of Ready

| # | check | state |
|---|---|---|
| 1 | problem clear | ✅ SA 6b, 6c |
| 2 | scope and out-of-scope | ✅ |
| 3 | INVEST | ✅ M; own reading |
| 4 | testable, measurable acceptance | ✅ every row measurable; A6 is the 100-game read at 100 ms (`EPIC-011` § The per-change rule; its pass line is `ADR-0056` C2′) *(2026-11-01)* *2026-11-01 (`bapm-owner-answers`): plus the 10-game Stockfish smoke at 0.5 s; its no-collapse bar is the owner-answers fold's, scored as the C2′ line was while pending (the ticket leaves Backlog only after that fold merges).* |
| 5 | dependencies known | ✅ |
| 6 | NFR triggers with targets | ✅ 16 KiB; nodes ≤ 0.95 × |
| 7 | test notes | ✅ 1 |
| 8 | size | ✅ M |
| 9 | priority | ✅ P3 |
| 10 | no major unresolved blocker | ❌ ADR |

**DoR 9/10 (re-scored 2026-10-29). Backlog.**
