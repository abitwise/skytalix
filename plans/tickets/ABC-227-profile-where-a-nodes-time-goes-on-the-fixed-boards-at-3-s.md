---
id: ABC-227
title: "Profile: where a node's time goes on the fixed boards at 3 s, and which cuts are worth a value-identical ticket"
status: ready
column: Ready
size: S
priority: P2
epic: EPIC-010
---

# ABC-227: profile where a node's time goes

> **Cut 2026-10-29 by BA/PM** (task `bapm-epic010-improvements`, records only, at `main` `f45aea95`). § B item 7
> stands in part (SA `…837e6fa8`): captures-only legality is done (`ABC-206`); full pseudo-legal generation, the board
> walk in the evaluator and the per-move allocations in `orderMoves` remain (SA 7b–7f). § B says "success is playing
> results, not nps alone"; this ticket only finds where the time goes. No code change.

## Problem

- **User:** the owner at level 5 (3 s a move).
- **Pain:** three candidate costs are named, none is measured. A speed-up chosen by guess spends a build on the wrong
  place. `EPIC-008` also shows that depth alone did not win games (SA 7g).
- **Value:** a ranked profile that tells `ABC-235` which value-identical cuts can pay, before any code moves.

## Scope

1. `node --cpu-prof` (and a heap-sampling profile) of `chooseMove` at 3 000 ms on `kiwipete`, `position-6` and the
   start position, on `main`, 5 runs each, one fresh process per run, on this host.
2. A report of self time by function (top 15), nodes per second, allocation rate, and the share of time in move
   generation, legality, evaluation, ordering and the TT.
3. One observation note, with the profiles and the script under the task's `raw/`.

## Out of scope

- Any `src/` change. Any game. Comparing with the previous host.

## Acceptance criteria

- **A1 (the profile).** **Given** the three boards, **then** each has 5 profiles at 3 000 ms; the note reports per
  board the median nodes per second and the top 15 functions by self time, as a share of total.
- **A2 (stability).** **Then** across the 5 runs of each board, each of the top-5 functions keeps its rank within ± 2;
  if not, the note says so and reports 5 more runs.
- **A3 (the buckets).** **Then** the note gives the share of self time in five buckets: move generation
  (`src/moves.ts`, `src/legal.ts`), make/unmake (`src/apply.ts`), evaluation (`src/evaluate.ts`), ordering
  (`orderMoves`/`orderKey`), TT (`src/transposition.ts`). The five plus "other" sum to 100 % ± 1.
- **A4 (allocation).** **Then** it reports bytes allocated per node, and the share allocated in `orderMoves`.
- **A5 (the hand-off).** **Then** it names each candidate cut whose bucket holds **≥ 5 %** of self time on at least
  two boards, as `ABC-235`'s input, and states for each whether it can be value-identical (same moves, same order,
  same scores) in the profiler's reading. Architect/Design confirms that at `ABC-235`'s design hop.

## NFR triggers

- None moved. The runs take about 1 minute of CPU each board; not run during an ALONE reading, load1 recorded.
- **Security:** no host paths in the note (`ADR-0049` d4).

## Test notes

1. The script is committed under `raw/`. Each run's `.cpuprofile` is kept, compressed.
2. No UAT (no production line changes).

## Size and priority

- **Size: S.** Tooling exists in Node; 15 runs and one note.
- **Priority: P2.** It decides `ABC-235`'s content at no game cost.

## Dependencies

- None. Routed by the Orchestrator to QE/E2E or Architect/Design.

## Definition of Ready

| # | check | state |
|---|---|---|
| 1 | problem clear | ✅ SA 7b–7f; § B item 7's own success clause |
| 2 | scope and out-of-scope | ✅ 3 boards, 5 runs, no code |
| 3 | INVEST | ✅ independent; S; testable |
| 4 | testable, measurable acceptance | ✅ A1–A5, shares, ranks, thresholds |
| 5 | dependencies known | ✅ none |
| 6 | NFR triggers with targets | ✅ none apply; stated |
| 7 | test notes | ✅ 2 |
| 8 | size | ✅ S |
| 9 | priority | ✅ P2 |
| 10 | no major unresolved blocker | ✅ none |

**DoR 10/10. Ready.**
