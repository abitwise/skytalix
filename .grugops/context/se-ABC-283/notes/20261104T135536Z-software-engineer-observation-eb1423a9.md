---
id: 20261104T135536Z-software-engineer-observation-eb1423a9
kind: observation
by: software-engineer
at: 2026-11-04T13:55:36Z
verified_by: 
confidence: high (git log and diff read back); sealed as an observation: an artifact-ref needs a §14-gate run id this install cannot issue
refs:
  - se-ABC-283
  - grugops/ABC-283
  - ABC-283
  - ABC-233
  - ABC-234
  - ABC-236
  - EPIC-011
  - O1h
  - O3s
  - S1
  - ADR-0063
  - ADR-0065
  - ADR-0066
  - ADR-0064
  - ADR-0069
  - ADR-0026
  - ADR-0050
  - ABC-279
  - ABC-122
  - ABC-084
  - P0
  - G1
  - F2
  - NFR-008
  - NFR-009
  - orch-2026-10-30a
  - 4c4cb03d
  - 09694a4e
  - 0d573303
  - d15752cc
  - 2b192331
  - src/search.ts
  - src/engine.ts
  - src/see.ts
  - src/search.bundle.test.ts
  - src/see.test.ts
  - src/engine.capacity.test.ts
  - src/search.futility.test.ts
  - src/evaluate.taper.test.ts
  - src/quiescence.test.ts
  - src/search.null-move.test.ts
  - src/search.test.ts
  - src/engine.test.ts
supersedes: 
seal: sha256:96cebd0947c19bf9f83d51118e052f14b213e38355bce78e390a8e2508d922f0
---

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
