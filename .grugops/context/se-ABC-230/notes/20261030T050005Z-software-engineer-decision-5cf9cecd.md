---
id: 20261030T050005Z-software-engineer-decision-5cf9cecd
kind: decision
by: software-engineer
at: 2026-10-30T05:00:05Z
verified_by: 
confidence: high: built to ADR-0054 as accepted; every choice named here is pinned by a row in the four test files
refs:
  - se-ABC-230
  - ABC-230
  - EPIC-010
  - ADR-0054
  - ADR-0002
  - ADR-0044
  - ADR-0011
  - ABC-081
  - arch-ABC-230-reading/20261029T213529Z-architect-design-decision-90a3aa31
  - bapm-ABC-230-fold/20261030T032640Z-ba-pm-decision-644cf2af
  - grugops/ABC-230
  - 2fbcb380
  - c0698ddd
  - src/engine.ts
  - src/levels.ts
  - src/level-seam.ts
  - src/cli.ts
  - src/uci-session.ts
supersedes: 
seal: sha256:f3e8dd264a3434d2d812d4a3cfb34e155c27ce2bcb969142d639a8b5dcae8d1e
---

# Software Engineer decisions, se-ABC-230: how ADR-0054 was built

Built to `ADR-0054` (ACCEPTED 2026-10-30) and `arch-ABC-230-reading/…90a3aa31` § 1, at `grugops/ABC-230` `2fbcb380` from `main` `c0698ddd`. Q3 (c), the ep-key normalisation, is NOT built here: it is a separate later ticket, and this build runs on today's key.

## The choices the ADR left to the SE
- **The helper:** `trimPriorKeys(keys, halfmoveClock)` in `src/engine.ts`, exported. It takes a key list shaped like `history.ts`'s `keyHistory` (oldest first, root last) and returns the last `min(clock, 100)` keys before the root. `PRIOR_KEYS_WINDOW = 100` is module-private. Both surfaces call it (`level-seam.ts`, `uci-session.ts`).
- **The scan:** `repeatsBeforeRoot` in `src/engine.ts`, called after `repeatsInPath` in `negamax`: `if (repeatsInPath(…) || repeatsBeforeRoot(…)) return 0`. `src/search.ts` is untouched, so `search()` takes no prior keys, and `repeatsInPath`'s call spy in `src/engine.capacity.test.ts` is unaffected. The walk starts at `min(ply − 4, (ply & 1) − 2)` (the first index below 0 of the path walk). It is bounded by `ply − clock` and by `−min(list length, 100)`, and it returns true at the second match. The order is unchanged: repetition, then capacity, then the table.
- **The doors:** a fourth `Heuristics` switch, `priorKeys: boolean`, true on `chooseMove` only. `deepen` reads `options.priorKeys` only when it is on. A fourth `deepen` parameter was tried first. Biome then broke the call across lines, and `src/search.null-move.test.ts` QE-208-c (which reads `deepen(position, options, {` per door) went red, so it was reworked rather than re-pinned.
- **The engine does not copy:** `Budget.prior` borrows the caller's array (`NO_PRIOR_KEYS`, a shared empty list, when absent). `ABC-081` `A6`'s one-array rows stay at 1.
- **Levels:** `createLevel`'s returned function takes an optional second argument, `priorKeys`. When it is absent, no `chooseMove` call carries the field. The existing `QE-087-a` pin, "every call is `{ budgetMs, now }`", therefore stays green unchanged. When it is present, the engine path hands the caller's list itself. A blunder builds one list, `[...priorKeys, zobristKey(position)]`, and hands it to every child (so `levels.ts` imports `zobrist.ts`).
- **CLI injection:** `createLevelSeam(level, options, keyHistory?)`, an optional third argument. `cli.ts` passes `history.ts`'s `keyHistory`. `level-seam.ts` imports `trimPriorKeys` from `engine.ts` and holds no runtime `history.ts` import (its game type is `Parameters<EngineSeam>[0]`). The `ADR-0011` licence set is unchanged.
- **UCI:** `parsePosition` returns `{ position, priorKeys }`. It pushes `zobristKey(position)` after each replayed move (the plain recompute, not the delta chain) and trims once. The session holds `priorKeys` beside `position`. `ucinewgame` and a refused `position` set it to `[]`, and a bare FEN or a bare startpos trims to `[]`. Every `chooseMove` and `createLevel` call from `go` hands it on.

## Re-pins (none in A6's protected set)
- `src/engine.test.ts` `A4`: the export list gains `trimPriorKeys`.
- `src/engine.test.ts` `ABC-086 A5 (i′)` and `src/cli.test.ts` `ABC-043 A1`: the `cli.ts` construction text gains `, keyHistory` after the unchanged options object.
- `src/levels.test.ts` `A8`: the import list gains `./zobrist.ts`.
- **Unchanged and green:** `ABC-081` `A6` (no history import; one key array per search), the `ADR-0011` licence equality, `QE-208-c`, and every bare-FEN node pin.

## Fixture choice (A2)
The four `A1` fixtures are KQ/KR v K endgames, so UCI reaches them with `position fen <F> moves …` rather than `position startpos moves …`. `startpos moves` is covered by the knight-shuffle row (probe H3: same move and score, fewer nodes) and by the two `A5` rows.

## Not observable
The `priorKeys = []` on a refused `position` cannot be observed from outside: the refusal also nulls `position`, `go` answers `bestmove 0000` without searching, and the next `position` overwrites the list. The row asserts what is observable, namely that no search runs.
