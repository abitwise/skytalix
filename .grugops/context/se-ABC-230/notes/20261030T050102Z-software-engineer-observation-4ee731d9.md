---
id: 20261030T050102Z-software-engineer-observation-4ee731d9
kind: observation
by: software-engineer
at: 2026-10-30T05:01:02Z
verified_by: 
confidence: high: commit and counts as run
refs:
  - se-ABC-230
  - ABC-230
  - EPIC-010
  - ADR-0054
  - grugops/ABC-230
  - 2fbcb380
  - c0698ddd
  - src/engine.ts
  - src/levels.ts
  - src/level-seam.ts
  - src/cli.ts
  - src/uci-session.ts
  - src/engine.test.ts
  - src/levels.test.ts
  - src/cli.test.ts
  - src/uci-session.test.ts
supersedes: 
seal: sha256:4dd43d256156ec9b77750570b8a09c76270b6b76602ff5b3c8fc7c116ff73d84
---

# Software Engineer observation, se-ABC-230: branch, commits, files, tests (the artifact record)

Recorded as an `observation`: an `artifact-ref` was refused by admission because it needs a §14-gate run's `sha`, `gate_run` and `content_hash`, and no gate has run on this branch.

- **Branch:** `grugops/ABC-230`, from `main` `c0698ddd`. Not pushed, not merged.
- **Code commit:** `2fbcb380`, `feat(ABC-230): the game's earlier positions reach the search, from the CLI and from UCI (ADR-0054)`. Notes, the raw harness and the ticket's result line follow in a `docs(se-ABC-230)` commit.

## Production files (`src/`, as `ADR-0054` § Consequences names them)
- `src/engine.ts`: `EngineOptions.priorKeys`, `trimPriorKeys` (export), `repeatsBeforeRoot`, `Budget.prior`, and a `Heuristics.priorKeys` switch that is off on the 3 doors.
- `src/levels.ts`: `createLevel`'s choose takes `priorKeys?`. A blunder hands its children `[...priorKeys, rootKey]`. Imports `zobrist.ts`.
- `src/level-seam.ts`: `createLevelSeam(level, options, keyHistory?)`, which trims and hands the list on. No `history.ts` import.
- `src/cli.ts`: imports `keyHistory` from `history.ts` (already licensed) and injects it.
- `src/uci-session.ts`: `parsePosition` returns `{ position, priorKeys }`. The session holds `priorKeys`, empties it on `ucinewgame` and on a refusal, and hands it to `chooseMove` and `createLevel`. Imports `zobrist.ts`.
- **Not touched:** `src/search.ts`, `src/history.ts`, `src/turn-loop.ts`, `src/zobrist.ts`, `src/transposition.ts`, `src/quiescence.ts`, `src/book*.ts`. No `tools/` or `data/` edit.

## Tests added (the existing files)
- `src/engine.test.ts`: `trimPriorKeys` ×4 (`A5`'s 600 → 100); `A1` ×4 fixtures, both colours (third occurrence at exactly 0; base's move and score; base's child score ≠ 0); `A8` ×2 (probe H2, node-equal to base); `A9` H4 and `A9` on the `A1` fixtures at clock 0; `A5` older-than-clock and the 100-key cap; no-copy/no-mutation; `A4`, an empty list node-equal over the endgames and the thirty; the doors ignore prior keys.
- `src/levels.test.ts`: the engine path hands the caller's list by reference; `A1` blunder children each get one list = prior + root key; absent, no call carries the field. The mock now also records `priorKeys`.
- `src/cli.test.ts`: `A1` through `createLevelSeam(DEFAULT_LEVEL, …, keyHistory)` on the 4 fixtures (plays the repetition, `chooseMove` scores it 0; without the injection, base's move at a score ≠ 0); `keyHistory` is read once on the loop's game; `A3`, a game from a FEN is base.
- `src/uci-session.test.ts`: `A2` `position fen F moves …` + `go depth 4` gives cp 0 and the repetition (a bare FEN of the same root gives neither); `A2` bestmove byte-equal to the CLI seam's on the same game and clock (×4); `A2` `startpos moves …` hands the trimmed replay keys (H3: same move and score, other nodes); `A3` bare FEN, bare startpos and `ucinewgame` hand `[]`; refused `position`: no search; `A5` 600 plies → the last 100; `A5` the window starts at the pawn move and is not cut by the castling-rights change.
- **Re-pins:** the 4 rows named in this task's decision note (engine exports, the cli construction text ×2, the levels import list).

## Counts
`npm test`: 63 files, 2 178 passed (base `c0698ddd`: 2 148), 0 failed.

## Commands run
`npm ci --ignore-scripts`; `npm run lint`, `npm run typecheck`, `npm test`, `npm run build`, `npm run format -- <file>`; single-file and deep lanes through `./node_modules/.bin/vitest run` (no bare `npx`); the out-of-tree harness via `node`.
