---
id: 20261010T153936Z-agents-md-scribe-observation-stale-receipts-remeasured-at-wave-tip-fb546800
kind: observation
by: agents-md-scribe
at: 2026-10-10T15:39:36Z
verified_by:
confidence: high
refs:
  - ABC-087
  - ABC-109
  - AGENTS.md
  - memory-bank/90-agents-md-command-log.md
supersedes:
---

# Readings RUN by me on branch `grugops/scribe-headroom-2026-10-10` (wave tip `5d55cc48`)

Own worktree, `node_modules` symlinked. Machine loaded (other agents; QE on `ABC-129`).

- `npm test`: exit 0, **52 files, 1608 tests**, 7.84 s (7.98 s on the post-edit re-run), load1 ~11.
  `AGENTS.md` said 1603; the brief expected 1608 and the tree agrees.
- `ENGINE_DEEP=1 npx vitest run src/engine.test.ts`: exit 0, **46 passed (33 default)**, 310.93 s,
  load1 12.7 -> 11.6. `AGENTS.md` said 45 (32).
- `ENGINE_DEEP=1 npx vitest run src/levels.test.ts`: exit 0, **28 passed (22 default)**, 224.95 s, load1
  10.2 -> 9.3. `A4` 39.7 % (204 moves) and 39.4 % (246); `A5` 30/30, max 4,541 ms, 135.4 s; `A3`
  **36 vs 58 of 62** (the ticket's reading was 35: wall-clock dependent). `src/levels*.ts`, `engine.ts`,
  `virtual-clock.ts` byte-identical to `1160b063`, the Engineer's reading (202.0 s).
- `npm run lint`: exit 0, 100 files. `node tools/grugops/lane-inventory.js`: 52 collected, 52 tracked,
  No findings.
- `wc -c AGENTS.md`: 23,633. `src/cli.test.ts` (67 tests): green, inside the 1608.

Raw output: scratchpad `scribe-hr/{engine,levels}.out`.
