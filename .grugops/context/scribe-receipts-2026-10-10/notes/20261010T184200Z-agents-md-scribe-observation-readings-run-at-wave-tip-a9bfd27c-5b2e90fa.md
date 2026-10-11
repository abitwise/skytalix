---
id: 20261010T184200Z-agents-md-scribe-observation-readings-run-at-wave-tip-a9bfd27c-5b2e90fa
kind: observation
by: agents-md-scribe
at: 2026-10-10T18:42:00Z
verified_by:
confidence: high
refs:
  - ABC-131
  - AGENTS.md
  - memory-bank/90-agents-md-command-log.md
supersedes:
---

# Readings RUN by me on `grugops/scribe-receipts-2026-10-10` (wave tip `a9bfd27c`)

Own worktree, `node_modules` symlinked. load1 ~6 (other agents running).

- `npm test`: exit 0, **52 files, 1663 tests**, 6.49 s. `AGENTS.md` said 1608. The brief expected 1663.
- `PUZZLE_DEEP=1 npx vitest run src/puzzle-suite.test.ts`: exit 0, **18 passed**, 34.37 s. Default
  lane: 12 passed, 0.45 s. `src/puzzle-suite.baseline.json` reads 54/58, budget 25, step 1.
- `npx vitest run src/cli.test.ts`: 67 passed (the `AGENTS.md` guards). `npm run lint`: exit 0, 100 files.
- Not run: the levels deep lane. Read from QE's `raw-qe-levels-tip.txt` (`96f3168d`): 28 passed, 213.26 s,
  `A4` 242 moves, `A3` 35/58 vs 54/58.
- `wc -c AGENTS.md`: 23,216.
