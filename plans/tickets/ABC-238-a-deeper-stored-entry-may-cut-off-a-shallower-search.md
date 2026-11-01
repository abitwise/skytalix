---
id: ABC-238
title: "A deeper stored entry may cut off a shallower search, revising ABC-081 A1, behind an off-door"
status: backlog
column: Backlog
size: M
priority: P2
epic: EPIC-011
---

# ABC-238: deeper-entry TT cutoffs

> **RE-HOMED 2026-11-01 to `EPIC-011` by BA/PM** (task `bapm-epic011-dedupe`, records only, at `main` `2e9a2457`). The
> owner asked for a new epic for the 3 000 path, started after the open epics close, and for no work done twice
> (`orch-2026-10-30a` `…022fb66f`). `ADR-0056` D4 maps this ticket to its gap list, so it leaves `EPIC-010` rather
> than holding that epic's close. **Id unchanged; nothing below this block is edited.** `ADR-0056` row T1, "the
> cheapest real gap in the search". `EPIC-011` Phase 1, **first. Priority P3 → P2.** **The wait "`ABC-237` merged or
> closed first" is removed:** `ADR-0056` D6 orders T1 → T2, and `ABC-237` now follows this ticket on the shared file.
> The ADR revising `ABC-081` `A1` is still owed. Its reading is `EPIC-011` § The per-change rule. Line cites are
> re-read at refinement (`ABC-253` changes the TT keys first).

> **Cut 2026-10-29 by BA/PM** (task `bapm-epic010-improvements`, records only, at `main` `f45aea95`). § B item 9 (SA
> `…306a4012` row 9c). **This revises a rule:** `ABC-081` `A1`, "the table changes the work, never the value". Using a
> deeper entry changes values. **Waits in Backlog on** the rule's revision (an ADR), the owner's Q4, and `ABC-237`.
> Milestone 2.

> **AMENDED 2026-10-29 by BA/PM** (task `bapm-owner-words-b`, records only): the owner set Q4 = (e), extended
> (`orch-2026-10-29g` `…278e149b`). This ticket's reading is now the smoke pair before merge (`EPIC-010` § The
> merge rule), with a batched validation later. Q4 no longer holds it. **Next real wait:** the ADR revising `ABC-081` `A1`, then `ABC-237` merged. Milestone 2. DoR 8/10 → 9/10.

## Problem

- **User:** the owner at level 5.
- **Pain:** `tableCutoff` uses an entry only at exactly the stored depth (`src/transposition.ts:149-162`,
  `entryDepth(slot) !== depth`), so a depth-8 result cannot answer a depth-5 question.
- **Value:** more cutoffs from work already done.

## Scope

1. `tableCutoff` accepts a stored depth ≥ the requested depth, with the bound rules unchanged.
2. An `ADR-0026` d10 off-door pair, and the `ABC-081` `A1` revision recorded in the ADR.

## Out of scope

- Replacement (`ABC-237`). Retention (`ABC-209`). Size.

## Acceptance criteria

- **A1 (the door).** Node-equal, cross-build, on the `ABC-078` `A3` corpus (`G4`).
- **A2 (the rule).** **Given** a stored exact entry at depth 8, **when** a depth-5 probe hits it, **then** it cuts off
  with the stored score; the door does not.
- **A3 (drift).** **Given** `ABC-121`'s 190 at depth 5, **then** ≥ 95 % of non-mate scores are within 25 cp of the
  door's, and 0 mate scores change sign.
- **A4 (it pays).** At fixed depth 8 on `kiwipete` and `position-6`, nodes ≤ **0.95 ×** the door's on both; `G6`
  "≥ base" by its rule (floor 6).
- **A5 (gates).** `G1`, `G5`, `G7`, `G8`, `G9`, `G10`.
- **A6 (the reading).** *(2026-11-01, the owner's rule, `bapm-100-400-rule`; replaces the smoke pair of `EPIC-010` § The merge rule.)* One 100-game read at 100 ms a move before the merge (`EPIC-011` § The per-change rule): the candidate head rebased on `main` against its merge-base, self-play, openings 1–50 with both colours, one game at a time, through `ABC-255`. 100 of 100 games complete, the candidate makes 0 faults and loses 0 games on time at the 50 ms margin, and the score meets `ADR-0056` C2′ (merged `94f1504c`): ≥ 50.0 of 100 for a GAIN, ≥ 43.0 for a NEUTRAL, the intent declared at design. A miss is NOT MET and is not re-played. Reported: W/L/D, score, `cutechess-cli`'s Elo ± error, `G11`. *(2026-11-01, `bapm-owner-answers`, the owner's answer 3.)* **And the Stockfish smoke beside it:** 10 games, the candidate at 0.5 s a move against Stockfish 19 `UCI_LimitStrength`, one game at a time, through `ABC-255` (`EPIC-011` § The per-change rule): 10 of 10 complete, 0 faults, 0 losses on time, and the no-collapse bar the `ADR-0056` owner-answers fold names for 0.5 s (`UNKNOWN - verify` until it merges).

## NFR triggers

- **`NFR-005`:** A4. **Security:** none.

## Test notes

1. UAT is owed. The QE verdict signs it.

## Size and priority

- **Size: M.** One predicate, but it revises an oracle rule (`ABC-081` `A1`) that many tests rest on. **Priority: P3.**

## Dependencies

- **Architect/Design:** an ADR that revises `ABC-081` `A1` and amends `ADR-0025`. Reported to the owner.
- **Owner:** Q4 answered 2026-10-29: (e), extended (`orch-2026-10-29g` `…278e149b`). `ABC-237` merged or closed first.

## Definition of Ready

| # | check | state |
|---|---|---|
| 1 | problem clear | ✅ SA 9c |
| 2 | scope and out-of-scope | ✅ |
| 3 | INVEST | ✅ M |
| 4 | testable, measurable acceptance | ✅ every row measurable; A6 is the 100-game read at 100 ms (`EPIC-011` § The per-change rule; its pass line is `ADR-0056` C2′) *(2026-11-01)* *2026-11-01 (`bapm-owner-answers`): plus the 10-game Stockfish smoke at 0.5 s; its no-collapse bar is the owner-answers fold's, scored as the C2′ line was while pending (the ticket leaves Backlog only after that fold merges).* |
| 5 | dependencies known | ✅ |
| 6 | NFR triggers with targets | ✅ nodes ≤ 0.95 ×; drift 95 % / 25 cp |
| 7 | test notes | ✅ 1 |
| 8 | size | ✅ M |
| 9 | priority | ✅ P3 |
| 10 | no major unresolved blocker | ❌ ADR; `ABC-237` |

**DoR 9/10 (re-scored 2026-10-29). Backlog.**
