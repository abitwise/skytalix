---
id: ABC-209
title: "The transposition table is kept across the moves of one game and cleared at a new game, with its size unchanged"
status: backlog
column: Backlog
size: S
priority: P3
epic: EPIC-008
feature: —
adr: "ADR-0025 decision 4 amendment; route the text to the owner when it lands (…7feb0553)"
---

# ABC-209: keep the transposition table across moves

> **Cut 2026-10-23 by BA/PM** (task `bapm-cut-engine-strength`, records only, at `main` `55a8f4ef`). Proposal 6 of
> `…f1771bb3`; owner word `…7feb0553`.
>
> **ADR touch point: an `ADR-0025` decision 4 amendment.** Decision 4 says "Lifetime: one search", and the table is
> cleared at every `chooseMove` and `search()` (`src/transposition.ts:17-20`). Architect/Design writes the amendment In
> Design. The owner's acceptance is the go-ahead. **The Orchestrator reports the amendment text to the owner when it
> lands.**

## Problem

- **User:** the owner at level 5.
- **Pain:** each move's search starts with an empty table, so work from the previous move is thrown away.
- **Value:** low, by the analysis (`UNKNOWN - verify`). It is cheap, and it ships only if D shows a GAIN.

## Scope

1. **The table's lifetime becomes one game.**
   - It is kept between moves.
   - It is cleared at a new game: the CLI starting a game, UCI `ucinewgame`, and a `position` that does not continue
     the previous game. The amendment defines that last case.
   - Entries from earlier moves are aged or replaced by the design's policy.
2. **A test-only clear door**, so deterministic-mode tests and the identity sweep that assume a fresh table get one.
3. The `ADR-0025` amendment.

## Out of scope

- A larger table (the size stays 2^18 × 16 B = 4 MiB), pondering, and any eval or search change.

## Acceptance criteria

- **`A1` (a fresh game is today's engine).** **Given** a new game, **then** the first `chooseMove` is node-for-node
  equal to base. So is every call made through the clear door.
- **`A2` (cleared when it must be).** **Given** game A played for ≥ 10 moves, **then** the first search of game B is
  node-equal to a fresh process's search. This is checked for the CLI's new-game path, for `ucinewgame`, and for a
  non-continuing `position`.
- **`A3` (kept when it should be).** **Given** two consecutive moves of one game, **then** the second search's first
  probe finds **≥ 1** entry stored by the first search. This is instrumented in a test only.
- **`A4` (`NFR-009`, `G7`).** The table's `byteLength` is unchanged at 4 MiB, and the total is ≤ 16 MiB. The growth
  clause stays ≤ 1 MiB between a 1 s and a 3 s search. **Added:** `heapUsed` after `gc()` moves ≤ 1 MiB between move 1
  and move 40 of one game.
- **`A5` (existing gates).** `G1`, `G4` (with the clear door), `G5`, `G6`, `G8`, `G9`. Deterministic mode (`ADR-0027`):
  the same sequence of calls gives the same moves.
- **`A6` (the reading).** **Given** `ABC-204` is Done, **then** D meets ship rule **S1**. The table persists only
  within a game, which is how cutechess plays (one process across games, with `ucinewgame`).
- **`A7` (the ADR).** The amendment exists and records that it was reported to the owner.

## NFR triggers

- **`NFR-009`:** the size is unchanged. The growth clause is re-read, plus the 40-move reading in `A4`. **A growth
  over 1 MiB is a STOP, not a re-level. A re-level is the owner's (≤ 128 MiB ceiling).**
- `NFR-004`, `NFR-005` and `NFR-008` are re-read.
- **Security:** no limb, no hop.

## Test notes

1. Find every test that assumes a fresh table and route it through the clear door. Do not loosen the test.
2. `ADR-0032`'s blunder path scores root moves with the shipped engine. The design states whether the blunder path
   shares the table.
3. UAT is owed (production lines). The QE verdict signs it.

## Dependencies

- **`ABC-208` merged.** They share `src/engine.ts`, and its merge is the D base.
- `ABC-204` Done.
- **Ready trigger:** `ABC-208` reaches Done, or BA/PM closes it under S1.

## Size and priority

- **`S`:** a lifetime change, a door, and clear points in two entry paths.
- **`P3`:** low expected gain.

## Definition of Ready

BA/PM, 2026-10-23, at `main` `55a8f4ef`. **Result: 9 of 10. `Backlog`** until the Ready trigger above.

| # | item | verdict |
|---|---|---|
| 1 | problem clear | ✅ the table is cleared per search, cited |
| 2 | scope and out-of-scope clear | ✅ the lifetime, the door, the clear points; size and pondering fenced |
| 3 | INVEST-shaped | ✅ valuable alone; `S`; testable |
| 4 | acceptance testable and measurable | ✅ node-equal fresh game; ≥ 1 carried entry; 4 MiB; ≤ 1 MiB growth over 40 moves; S1 |
| 5 | dependencies known | ✅ `ABC-208`, `ABC-204` |
| 6 | security/NFR triggers with a measurable target | ✅ `NFR-009` figures; STOP on growth |
| 7 | test notes present | ✅ three |
| 8 | size assigned | ✅ `S` |
| 9 | priority assigned | ✅ `P3` |
| 10 | no major unresolved blocker | ⏳ held by sequence: `ABC-208` |
