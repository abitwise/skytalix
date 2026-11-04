# se-ABC-283 artifacts. Branch `grugops/ABC-283` from `main` `09694a4e`, worktree `.claude/worktrees/se-ABC-283`. Commits: claim `10880030`, code `0d573303`, tests `d15752cc` and `2b192331`, then the records commit. Nothing was pushed or merged.

- **Production:**
  - `src/search.ts`: the history table, `recordHistoryCutoff`, `clearHistory`, `historyByteLength`, `historyScore`, `losingForOrdering`, the order tiers, the `history` / `seeOrdering` switches, and the doors `searchWithoutHistory`, `searchWithoutSeeOrdering`, `searchWithoutBundle`.
  - `src/engine.ts`: the windowed `runIteration`, `aspirate`, the three switches, and the doors `chooseMoveWithoutHistory`, `chooseMoveWithoutSeeOrdering`, `chooseMoveWithoutAspiration`, `chooseMoveWithoutBundle`. The header was updated: aspiration is no longer "none requested".
  - `src/see.ts`: header only (its callers).
- **New tests:** `src/search.bundle.test.ts`.
  - Default lane, 15 rows: history update, gravity, futile, order, lifetime and source; SEE order, hash-first, no-SEE-when-off and source; aspiration iterations 1-4, two fail-high rows and source.
  - `SEARCH_DEEP=1`, 6 rows: P0 ×2, the bundle's d8 counts ×2, and the mate floor in both recursions (red; see the acceptance note).
- **Edited tests:** `src/engine.capacity.test.ts`, `src/engine.test.ts`, `src/evaluate.taper.test.ts`, `src/quiescence.test.ts`, `src/search.futility.test.ts`, `src/search.null-move.test.ts`, `src/search.test.ts`, `src/see.test.ts` (see the migration note).
- **Snapshots:** none changed (`src/__snapshots__` untouched).
- **Commands:** each under `flock <scratch>/host-test.lock`:
  - `npm test` ×17 (5 base, 5 head, 5 + 6 interleaved pairs);
  - every deep lane in AGENTS.md except LADDER_DEEP (games): `SEARCH_DEEP`, `ENGINE_DEEP`, `PUZZLE_DEEP`, `ZOBRIST_DEEP`, `TUNE_DEEP`, `CLI_DEEP`, `UCI_DEEP`, plus `SEARCH_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 npx vitest run src/search.bundle.test.ts`;
  - `npm run lint`, `npm run typecheck`, `npm run build`, and the skip count (0);
  - the drivers in `raw/scripts/` against a detached `main` worktree in scratch (removed afterwards).
- **Not run:** `LADDER_DEEP` and any game, by the brief. QE owns the 100-game read.
- **Remaining work:** see the failed-attempt note; the Orchestrator rules before QE's PREREG and the read.
