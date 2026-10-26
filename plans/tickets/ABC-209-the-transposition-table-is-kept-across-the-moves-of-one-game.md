---
id: ABC-209
title: "The transposition table is kept across the moves of one game and cleared at a new game, with its size unchanged"
status: ready
column: Ready
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
>
> *Re-read 2026-10-26 at `main` `53b67d53` (BA/PM, `bapm-ready-ABC-209`):* the cite `src/transposition.ts:17-20` holds;
> the file is unchanged since the cut. Null move (`ABC-208`) moved the two clear sites: `src/engine.ts:550` (was
> `:492`) and `src/search.ts:605` (was `:498`). The text at both is unchanged. **The amendment is needed as written.**
> Decision 4 says "It does not persist across moves", and § Alternatives rejects persistence "now, not forever", so no
> accepted ADR holds a per-game lifetime. This is flagged for Architect/Design's design hop (§ Definition of Ready,
> re-score) and not decided here.

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
   - *2026-10-26 (BA/PM, `bapm-ready-ABC-209`):* the two entry paths are the CLI's game start (`src/cli.ts:200`,
     `newGame`) and the UCI session (`src/uci-session.ts:370`, `ucinewgame`; `:374`, `position`). Whether `search()`
     keeps its per-call clear is the amendment's call.
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
  - *2026-10-26 (BA/PM, `bapm-ready-ABC-209`):* QE fixes the 40-move game and its budget before the first reading.
    The bar does not move, and growth over 1 MiB is a STOP (§ NFR triggers).
- **`A5` (existing gates).** `G1`, `G4` (with the clear door), `G5`, `G6`, `G8`, `G9`. Deterministic mode (`ADR-0027`):
  the same sequence of calls gives the same moves.
  - *2026-10-26 (BA/PM, `bapm-ready-ABC-209`):* `G1`: the diff touches `src/transposition.ts` and `src/engine.ts`, so
    `ADR-0034` decision 2 gives it no drift class, and every missed row is class B.
  - *2026-10-26 (BA/PM, `bapm-ready-ABC-209`):* `G6` is read by `EPIC-008`'s rule (`…8e51ba1e`): 5 interleaved runs
    per board per build, "≥ base" graded by the median, any run below depth 6 FAILs. `QE-205-c` is still open, so
    "≥ base" is graded. Each `G6` run is one fresh process, so by `A1` head's search is node-equal to base's. `G6`
    therefore reads timing noise, not this change. A miss is reported against `A1`. It is not read as a design
    defect.
- **`A6` (the reading).** **Given** `ABC-204` is Done, **then** D meets ship rule **S1**. The table persists only
  within a game, which is how cutechess plays (one process across games, with `ucinewgame`).
  - *2026-10-26 (BA/PM, `bapm-ready-ABC-209`):* there is one reading, and it is final (`…4c3f7639`). The D budget is
    `ABC-204`'s frozen 1 500 ms. If D is not a GAIN after the one extension, the ticket is not merged. A re-tune
    reading needs the owner's word.
- **`A7` (the ADR).** The amendment exists and records that it was reported to the owner.

## NFR triggers

- **`NFR-009`:** the size is unchanged. The growth clause is re-read, plus the 40-move reading in `A4`. **A growth
  over 1 MiB is a STOP, not a re-level. A re-level is the owner's (≤ 128 MiB ceiling).**
- `NFR-004`, `NFR-005` and `NFR-008` are re-read.
- **Security:** no limb, no hop.
- *2026-10-26 (BA/PM, `bapm-ready-ABC-209`):* carried forward unchanged. Growth over 1 MiB over 40 moves is a STOP.

## Test notes

1. Find every test that assumes a fresh table and route it through the clear door. Do not loosen the test.
2. `ADR-0032`'s blunder path scores root moves with the shipped engine. The design states whether the blunder path
   shares the table.
3. UAT is owed (production lines). The QE verdict signs it.
4. **Frozen-clock pre-check (a process step, no bound).** *Added 2026-10-26 by BA/PM (`bapm-ready-ABC-209`). It is the
   same step as `ABC-208` test note 4 (`…84a05b3a`).* Before the real-clock `G6` reading, QE reports, for base and
   head, the nodes each build needs to complete depths 7 and 8 on `kiwipete` and `position-6` (`chooseMove`,
   `now: () => 0`, `maxDepth: k`). That is 8 counts. Each count is a first search in a fresh process, so by `A1`
   head's counts equal base's. Any difference is an `A1` red, and QE stops to Architect/Design before the run. The
   pre-check grades nothing.
5. **The reading runs ALONE** (width 1, AC power, a quiet host). `QE-207-g` is open: an ALONE claim can outlive
   `queue.stale_ttl_minutes` (30). That is a kit or config matter for the Orchestrator, and it does not block this
   ticket.

## Dependencies

- **`ABC-208` merged.** They share `src/engine.ts`, and its merge is the D base.
- `ABC-204` Done.
- **Ready trigger:** `ABC-208` reaches Done, or BA/PM closes it under S1.
- *2026-10-26 (BA/PM, `bapm-ready-ABC-209`):* **the Ready trigger is met.** `ABC-208` merged as `b5c67ab7` (QE PASS,
  S1 MET), and `ABC-204` is Done.
  - **D base:** "its merge is the D base" now means this ticket's own merge-base on `main` (`EPIC-008` § D). That
    merge-base carries `ABC-208`. No commit since `b5c67ab7` touches `src/`, `data/` or `tools/`.
  - `ABC-210` waits on this ticket.

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

**Re-scored 2026-10-26 by BA/PM** (task `bapm-ready-ABC-209`, at `main` `53b67d53`). **Result: 10 of 10. `Ready`.** In
Design comes first. Only these rows changed:

| # | item | verdict |
|---|---|---|
| 3 | INVEST-shaped | ✅ now independent: `ABC-208` is merged (`b5c67ab7`) |
| 4 | acceptance testable and measurable | ✅ the criteria are unchanged. Dated reading lines add `G1` class B (`ADR-0034` d2), the `EPIC-008` `G6` rule, `A6` one reading, and QE fixing the `A4` game |
| 5 | dependencies known | ✅ `ABC-208` and `ABC-204` are Done. The D base is its own merge-base on `main`, which carries `ABC-208` |
| 7 | test notes present | ✅ five (the frozen-clock pre-check, and ALONE with `QE-207-g`) |
| 10 | no major unresolved blocker | ✅ the sequence hold is gone. The amendment is In Design's work. `QE-205-c` (owner) and `QE-207-g` (kit) are open, and neither blocks |

- **The `ADR-0025` decision 4 amendment is needed as written.** The change does not fit inside an accepted ADR:
  - decision 4 says "cleared at every `chooseMove` and every `search()` entry" and "It does not persist across moves";
  - § Alternatives rejects persistence "now, not forever", with a re-open condition: "a measurement of depth gained
    across a real game". That is falsifier `T1`.
  - `ADR-0026` covers the shape of the test-only door. It does not cover a table lifetime.
  - Changing or reversing an accepted ADR is the owner's call (`…5aaf7cec` item 3). Under `…7feb0553` item 2 the
    go-ahead for the work is given, and the text is reported to him when it lands.
  - **Flagged for Architect/Design's design hop, not decided here:** whether the form is an amendment or a
    superseding ADR, and its status at the reading and at merge. `ABC-208`'s precedent is reading (b) (`…d25ab770`).
    Applying it is the Orchestrator's routing.
- **In Design carries** (the amendment's calls; not blockers):
  - the "non-continuing `position`" rule;
  - the aging or replacement policy. `src/transposition.ts:22-26` assumes one move's lifetime;
  - the clear door's shape. `clearTable` is already exported;
  - whether `search()` keeps its per-call clear;
  - answers to § Alternatives' three objections (`chooseMove` stops being a function of its arguments, the identity
    sweep, `ADR-0002` clause 3);
  - `T1`;
  - the texts that lean on the per-search lifetime: `ADR-0026` decision 7's 2026-09-26 sentence and `ADR-0006`'s two
    2026-09-26 errata. Each says the two roots never share a table because the table is cleared;
  - `ADR-0032`'s blunder path (test note 2);
  - the source comments at `src/engine.ts:57-62`, `src/search.ts:24-26` and `src/search.ts:594-597`.
