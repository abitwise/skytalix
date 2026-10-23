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
