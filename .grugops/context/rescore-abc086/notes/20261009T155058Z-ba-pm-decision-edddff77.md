---
id: 20261009T155058Z-ba-pm-decision-edddff77
kind: decision
by: ba-pm
at: 2026-10-09T15:50:58Z
verified_by: 
confidence: high
refs:
  - ABC-086
  - ABC-078
  - ABC-121
  - ABC-082
  - ABC-084
  - ABC-085
  - ABC-087
  - ADR-0026
  - ADR-0024
  - NFR-004
  - NFR-005
  - N8-LANE
  - plans/tickets/ABC-086-deterministic-move-selection-under-a-fixed-seed.md
  - .grugops/context/rescore-abc086/probe/determinism.ts
supersedes: 
---

# `ABC-086` re-score (DoR): 9/10, one ⚠️ (item 10, Architect/Design) — NOT Ready

Hand-authored, no seal: this install is in the degraded posture `AGENTS.md` describes, so no
`finding` can be admitted. The measurements below therefore travel inside a `decision`, not as
stamped findings.

## Facts read off the merged engine at `f952983`

- **The time source is already injected.** `EngineOptions.now` is at `src/engine.ts:148-149` and
  defaults to `Date.now` at `:452`. The shipped construction, `src/cli.ts:175`, passes no `now`.
- **Wall-clock time is the only non-determinism left in the engine.** Every other candidate is
  deterministic:
  - Zobrist keys come from a fixed splitmix64 seed (`src/zobrist.ts:56`).
  - The transposition table is module-level (`src/transposition.ts:70-72`) but is cleared at
    every call (`src/engine.ts:469`).
  - Killers and keys are allocated fresh for each call (`:464-465`).
  - `orderMoves` is a stable sort (`src/search.ts:179-188`).
  - A tie is broken by a strict `>`, so the first move in order wins (`src/engine.ts:285-288`,
    `:397-401`).
  - There is no `Math.random`, `performance.now` or `crypto` on the engine path. The only hits
    in `src/` are `cli-options.ts:103` and `perft-bench.ts:70-72`, both off the engine path.
- **There is no seed in the engine, and no choice it could drive.** Under PVS every root move
  after the first is searched on a null window (`:320-331`), so a tie fails low and cannot be told
  apart from a worse move.

## Probe (`.grugops/context/rescore-abc086/probe/`, read-only against `src/`)

- **`A1`'s shape already holds on the merged tree, at zero production lines.** `chooseMove` was
  run on 30 positions (the six roots plus four children each) × 10 runs, with `tickingClock(1)`
  and no seed. It returned 300/300 identical results at budgets of 2, 4, 8 and 32 ticks. The output
  of two separate processes is byte-identical at each budget. Files: `run-b{2,4,8}-{a,b}.txt`,
  `run{1,2}.txt`.
- **Cost (CPU, in process, read with `process.cpuUsage`).** This is not the `N8-LANE` instrument
  and has no null control.
  - 30 × 10: 835 ms at budget 2 (depth 1–2), 2.26 s at budget 4, 5.9 s at budget 8 (15/30 reach
    depth ≥ 4), 32–33 s at budget 32 (29/30 reach depth ≥ 4).
  - 30 × 2 at budget 2: 246 / 251 / 256 ms.
  - At budget 4: 547 / 554 / 567 ms.
- **Ties:** 8 of the 30 positions have two or more equal-best root moves at depth 3. This uses
  exact per-move scores from each child's `searchWithoutReductions`. Five are knight-pair ties in
  the `startpos` family. Three are promotion-piece ties; the probe's label drops the piece, so they
  print as duplicates. File: `ties-d3.txt`.

## Decisions made on the page

1. **⚠️(3) is discharged.** `ABC-078` and every engine ticket are `Done`.
2. **The time-source scope bullet is marked as already merged** and is not added again.
3. **`A1`:** the full 300 runs go to the `ENGINE_DEEP=1` lane, at a budget where at least half the
   positions complete root depth ≥ 4. The default lane carries a 30 × 2 slice. `A1` is named as a
   regression guard that the merged tree already meets, and `A3` is the proof of delivery.
4. **`N8-LANE` line corrected.** The page's earlier claim that a node budget makes the runs "fast
   by construction" was false; the measurement above replaces it.
5. **`A3`:** "equal-scoring" is defined as exact per-move scores, never the root's PVS bounds.
   `A3` is conditional on ⚠️(10).
6. **`A4`, `A5` and `A6`** cite the lines they bind. `ABC-078` `A4`'s export pin
   (`src/engine.test.ts:465-484`) is named as one to amend openly, never loosen.
7. **`NFR-005`** is conditional on the ruling, at its catalog bar either way.
8. **Dependencies:** `ABC-087` is added as a consumer. The `ABC-082` merge-order overlap on an
   `A3` tie fixture is named for the Orchestrator.
9. **Size:** `S` is kept as an upper bound, and falls to `XS` if the seed leaves the ticket.
   **Priority:** `P0`, unchanged.

## DoR: 9/10. Item 10 ⚠️ — owner: Architect/Design

The question for Architect/Design has two parts.

**Q1 (the seed).** Does the seed reach move selection?

- **(a) Yes, as a seeded root tie break.** Then:
  - How is the equal-best set identified under PVS without changing the shipped score?
  - Is it a value- or work-changing change under `ADR-0026` decision 10 (a switch and doors, off
    in older doors)? The root entry stored at `src/engine.ts:404` becomes the next iteration's
    hash move, and LMR's value depends on move order. Whether this changes values is
    `UNKNOWN - verify`, not measured.
- **(b) No.** Tie breaking stays as merged, and the seed moves to `ABC-087`'s blunder draw.

**Q2 (the deterministic budget).** Should the deterministic budget be the virtual-time `Clock` or a
separate node budget?

- The `Clock` contract says "real-time" (`:109`).
- The `Clock` is read every 1 024 nodes (`:202-208`).
- A virtual-clock budget is capped at `HARD_CEILING_MS` readings (`:459`).

Whichever it is, it must live somewhere the `ABC-084`/`ABC-085` harnesses can reach without
breaking `ABC-078` `A4` or `ADR-0024` decision 7.

**BA/PM's product position is (b), and it is not the ruling.** If the ruling is (b), BA/PM re-cuts
the page: `A3`/`A6` move to `ABC-087` and the size falls to `XS`.

## What this note does NOT do

- It does not set `Ready`, and it does not touch `plans/board.md`. Both are outside this
  subtask's fence; the board move is the Orchestrator's once ⚠️(10) closes.
- It does not touch `src/`, `AGENTS.md`, `plans/nfr-catalog.md` or any ADR.
- It does not edit `ABC-087`, `ABC-085` or `ABC-084`. Moving `A3`/`A6` waits on the ruling.
