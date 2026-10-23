---
subtask: arch-analyse-game-1
role: architect-design
ticket: plans/uat/EPIC-006-game-1.pgn
ref: .grugops/context/arch-analyse-game-1/
width: 2 (records + local analysis runs; disjoint files from bapm-cut-pgn-export)
---

# Analyse owner game 1 (skytalix level 5 vs Apple Chess) and map skytalix's errors to the engine

## Do
- Run Stockfish 19 (`/opt/homebrew/bin/stockfish`, fixed depth or nodes you name, e.g. depth 20) over every position of `plans/uat/EPIC-006-game-1.pgn`. Classify each move for BOTH sides (best / inaccuracy / mistake / blunder by eval loss; state thresholds), and list the key turning points with the better move.
- **Strength estimate:** a hedged rough rating for skytalix at level 5 (and Apple Chess's play in this game) from average centipawn loss or similar. Say plainly that one game is not a rating and give a wide range.
- **Root causes:** for each skytalix mistake/blunder, reproduce it on skytalix itself (`npm run uci` or the engine modules at level 5's settings) — what did it see, at what depth, what did it miss — and attribute it to an engine part: search depth/time budget, quiescence, move ordering, evaluation terms (king safety, early queen, development, mobility…), book, TT. Cite `src/` lines.
- **Improvement candidates:** a ranked list (expected gain, cost, risk to NFR-008/lane budgets and to ADRs). These are proposals for the owner; cut nothing.
- Write the report as `memory-bank/analysis/2026-10-23-game-1.md` (or the folder the memory bank uses for analyses), owner-readable first, details after. Optionally an annotated PGN (`plans/uat/EPIC-006-game-1.annotated.pgn`) with eval comments.

## Fences
- Work on `grugops/arch-analyse-game-1` (worktree `../wt-arch-analyse-game-1` from `main`). No `src/` or test edits, no `package*.json`, no board/trace, no ADR changes. Engine runs are local and read-only; keep them light (no full test lanes). Temp files only in `/private/tmp/claude-501/-Users-olgeroeselg-Projects-hacks-grugops-examples-cli-chess-example/7311fff4-c502-4aa9-80bc-0bf8723c1183/scratchpad/game1/`. Seal notes with an explicit context root in your worktree. Never push, force, amend or rebase; never merge into `main`.

## Publish
- Seal notes via the plugin writer (task `arch-analyse-game-1`), `at` from `date -u`, with a `kind: decision`. Write `## Result` plus a 10-cell trace row into this brief in main's queue, then move it and its `claim.md` to `done/`.

## Result

**DONE. Report and annotated PGN published, records only** (Architect/Design, 2026-10-23). Branch `grugops/arch-analyse-game-1` @ `6ab3bc7b`: two commits on `main` `f4eec73d`. `c5e14e12` holds the report and the PGN, `6ab3bc7b` the notes.

- **Report:** `memory-bank/analysis/2026-10-23-game-1.md`, owner-readable first. A new folder: the memory bank had no analysis folder.
- **Annotated PGN:** `plans/uat/EPIC-006-game-1.annotated.pgn`. `[%eval]` comments, `?!`/`?`/`??`, and Stockfish's line at each error. Its main line is token-equal to the source game (71/71).
- **Method.** Stockfish 19 at depth 20 (1 thread, 128 MB) over all 70 positions, with a `searchmoves` re-search for the played move: 397 s. Loss is capped at ±1000 cp.
- **Thresholds:** best ≤ 10 cp (or Stockfish's own move), good 11-49, inaccuracy 50-99, mistake 100-299, blunder ≥ 300.
- **skytalix (White):**
  - 21 best, 3 good, 6 inaccuracies, 4 mistakes (8.e5, 10.Ne4, 17.Kc1, 29.Bd2), 1 blunder (13.d4).
  - ACPL 40.8 over all moves, 44.4 over engine moves, 49.2 over moves 1-29.
  - 8.e5, 10.Ne4 and 13.d4 make up 721 of the 1,428 cp lost.
- **Apple Chess (Black):** 29 best, 4 good, 2 inaccuracies (9...d6, 27...Qe4), 0 mistakes. ACPL 7.9.
- **Level-5 reruns** (`chooseMove`, 3000 ms, wall clock): 30/32 and 32/32 game moves reproduced. Depth 6-10, about 190k nodes/s.
- **Root causes:**
  - **13.d4??** is an evaluation scale error: chosen at every depth 1-10. King exposure moves 35 cp where Stockfish moves about 360 (`src/evaluate.ts:187-191`, `:263-277`). Stockfish's refutation lands about 20 plies out.
  - **8.e5? and 10.Ne4?** are depth-limited. Be2 appears at depth 7 (3.9 s) and depth 8 (5.8 s) against the 3 s budget (`src/engine.ts:224-229`, `:497-521`). Mobility weight and the king table add to it (`src/evaluate.ts:121-130`, `:199-200`).
  - **17.Kc1?** follows the king table, which rewards c1 and b1 (`src/evaluate.ts:128-129`).
  - **4.Qa4?!** comes from mobility weighting, with no development term.
  - **29.Bd2** is a horizon miss in a lost position.
- **Scratch probes** (a copy of `src/` in the scratchpad, never `src/`): king exposure ×3 while queens are on flips 13.d4 to Ng4, 8.e5 to Be2 and 10.Ne4 to Be2, at the real 3 s budget.
- **Strength.** Hedged: about 1400-1900, centre about 1650, error at least ±300, one game. Apple Chess's level is unrecorded.
- **Ranked proposals** (nothing cut):
  1. King safety while queens are on.
  2. A rating harness against Stockfish with `UCI_LimitStrength`.
  3. A value-identical speed-up.
  4. Mobility re-weighting.
  5. Null-move pruning.
  6. The transposition table kept across moves.
  7. Check extension or checks in quiescence.
  8. A deeper book.
- **INFO:**
  - Orchestrator or BA/PM: cut any proposal the owner wants. Proposal 2 enables tuning beyond one game.
  - UAT Planner: record Apple Chess's level in the play-test log.
  - Scribe: `memory-bank/00-index.md` does not list `memory-bank/analysis/`.
- **Notes** (in `.grugops/context/arch-analyse-game-1/notes/` on the branch, sealed by grugops 2.1.0 `admitAndAppend` with the worktree's context root, read back as 2 notes, index rendered):
  - `20261023T201218Z-architect-design-observation-c3fb9929`;
  - `20261023T201218Z-architect-design-decision-f1771bb3`.
- **Not touched:** `src/`, tests, `package*.json`, the board, the traceability file, ADRs and NFR rows. No column moved. Nothing was pushed or merged.

### Trace row (10 cells, header order)

| EPIC-006 game 1 (arch analysis) | Architect/Design: owner game 1 (skytalix L5 vs Apple Chess, 0-1) analysed with Stockfish 19 d20; skytalix ACPL 41 (49 to move 29), 1 blunder / 4 mistakes / 6 inaccuracies, Apple Chess ACPL 8; root cause king-safety scale in `evaluate` (13.d4?? at every depth 1-10), then depth (8.e5?, 10.Ne4?); hedged ~1400-1900; eight ranked proposals, nothing cut | EPIC-006 | ABC-101, ABC-087, ABC-083, ABC-078 | NFR-004, NFR-005, NFR-008, NFR-009 (proposal risks only; no NFR touched) | `grugops/arch-analyse-game-1` @ `6ab3bc7b` (records only)<br>`memory-bank/analysis/2026-10-23-game-1.md`, `plans/uat/EPIC-006-game-1.annotated.pgn`<br>`.grugops/context/arch-analyse-game-1/notes/` (…c3fb9929, …f1771bb3) | records only; read-only local runs on f4eec73d (Stockfish d20 x140, two level-5 wall-clock reruns, fixed-depth sweeps, scratch-copy probes); no test lane run | — | — | DONE; merge is the Orchestrator's |
