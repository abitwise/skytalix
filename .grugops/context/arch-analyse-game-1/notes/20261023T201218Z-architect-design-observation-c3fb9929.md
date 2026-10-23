---
id: 20261023T201218Z-architect-design-observation-c3fb9929
kind: observation
by: architect-design
at: 2026-10-23T20:12:18Z
verified_by: 
confidence: high
refs:
  - arch-analyse-game-1
  - plans/uat/EPIC-006-game-1.pgn
  - plans/uat/EPIC-006-game-1.annotated.pgn
  - memory-bank/analysis/2026-10-23-game-1.md
  - f4eec73d
  - c5e14e12
  - EPIC-006
  - ABC-101
  - ABC-087
  - ABC-083
  - ABC-078
  - ADR-0031
  - ADR-0025
  - ADR-0026
  - ADR-0044
  - ADR-0045
  - NFR-004
  - NFR-005
  - NFR-008
  - NFR-009
supersedes: 
seal: sha256:64dc555fb2e1074adf5e9e11fa440547a18c09567b148e7f6d988ef17dc7856e
---

# Architect/Design: game 1 measured. Stockfish 19 d20 classification, two level-5 reruns of skytalix, depth sweeps, eval breakdowns and scratch probes

**What was measured.** The game `plans/uat/EPIC-006-game-1.pgn` was replayed with `src/san.ts` and `src/apply.ts` at `main` `f4eec73d`. The analysis worktree's tip `c5e14e12` adds only records.
- **Reference engine.** `/opt/homebrew/bin/stockfish`, Stockfish 19: depth 20, `Threads 1`, `Hash 128`, `MultiPV 3`, over all 70 positions. A second depth-20 search with `searchmoves <played>` scored the played move. 397 s for all 140 searches.
- **Loss and thresholds.** Loss is best minus played, from the mover's side, capped at ±1000 cp. A played move that is Stockfish's best scores 0. Classes: best ≤ 10 cp, good 11-49, inaccuracy 50-99, mistake 100-299, blunder ≥ 300.

**Classification.**
- **skytalix (White):**
  - 21 best, 3 good, 6 inaccuracies, 4 mistakes, 1 blunder.
  - ACPL 40.8 over all 35 moves, 44.4 over its 32 engine moves, 49.2 over moves 1-29.
  - Total loss 1,428 cp. 8.e5 (144), 10.Ne4 (217) and 13.d4 (360) make 721 cp, 50 %.
- **Apple Chess (Black):**
  - 29 best, 4 good, 2 inaccuracies (9...d6 88 cp, 27...Qe4 63 cp), 0 mistakes.
  - ACPL 7.9.
- **The book.** skytalix's book answered moves 1-3 and was out of book from move 4 (`src/book.ts` probe on every position).

**Reproduction at level 5.** Level 5 is `{ 3000, 0 }` (`src/levels.ts:49`), so every move is plain `chooseMove`.
- **Two wall-clock reruns.** Run 1 reproduced 30/32 engine moves (26.b4 for f4, 29.Bxg7 for Bd2). Run 2 reproduced 32/32.
- **Depth and nodes.** Depth 6-10, 330k-750k nodes per move, about 190k nodes/s.

**Depth sweeps.** These use the shipped `chooseMove` with a frozen virtual clock and `maxDepth`. The plain `search()` ran to depth 10 at two positions.
- **8.e5.** Picked at depth 6 only; Be2 at depths 3-5 and 7-8. Depth 7 takes 3.9 s.
- **10.Ne4.** Picked at depths 1-7; Be2 at depth 8, which takes 5.8 s.
- **13.d4.** Picked at every depth 1-10. At depth 10, d4 scores −86 and Ng4 −167. Stockfish has d4 at −632 and Ng4 at −272.
- **17.Kc1.** Nd3 at depth 1, Kc1 from depth 3.
- **4.Qa4.** Oscillates with d4 and d3; at depth 8 Qa4 is +78.

**Eval breakdown.** A scratch re-implementation was checked equal to `evaluate()` on 71/71 positions.
- **13.d4.** d4 cxd4 Bxd4 raises White's king exposure from 25 to 60 cp, a 35 cp change. The term's maximum is 105 cp (`src/evaluate.ts:189-191`, `:263-277`).
- **Before 8.e5.** Mobility is 88 of the 148 cp total.
- **The king table.** It scores e1 = d2 = 0, c1 = 10 and b1 = 30 (`src/evaluate.ts:128-129`).

**Scratch probes.** These ran on a copy of `src/` in the session scratchpad, never on `src/`.
- **King exposure ×3 while the enemy queen is on.** At the real 3 s budget: 13.d4 became Ng4, 8.e5 became Be2 and 10.Ne4 became Be2. Kc1 was unchanged.
- **Centre-king −60 with queen mobility ¼.** 4.Qa4 became e4.
- **Check extension.** No error position changed.
- **Status.** These are probes, not tuned values. No probe was run against the puzzle suite, the mirror corpus or any NFR reading.

**Strength.** By rule of thumb, ACPL 41-49 suggests about 1400-1900 on a human scale (`UNKNOWN - verify`, one game). Apple Chess's level is unrecorded. Stockfish 19 here offers `UCI_LimitStrength` with `UCI_Elo` 1320-3190. No `cutechess-cli` or `fastchess` is installed.
