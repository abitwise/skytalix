---
id: 20261021T090520Z-software-engineer-observation-a61bb150
kind: observation
by: software-engineer
at: 2026-10-21T09:05:20Z
verified_by: 
confidence: high
refs:
  - ABC-163
  - AR-095-L1UNIT
  - ADR-0036
  - grugops/ABC-163
  - 87d3897d
  - d8c073e2
  - ccccc6bb
  - plans/tickets/ABC-163-the-clause-b-instrument-fires-nothing-when-a-limb-1-holder-changes-what-it-reads.md
supersedes: 
seal: sha256:3cc832369a551c4aac8d0a80389e503526ad2288e4c71c7be212d6d106c43b56
---

# ABC-163 gates at tip `d8c073e2`: all green; UAT waiver measured empty

Worktree `../wt-ABC-163`, `grugops/ABC-163` from `main` `ccccc6bb`, `node_modules` symlinked (ignored by
`.git/info/exclude:9`). Lanes were run one at a time. No timing was taken.

| gate | command | result |
|---|---|---|
| lint | `npm run lint` | exit 0, 116 files, no fixes |
| typecheck | `npm run typecheck` | exit 0 |
| build | `npm run build` | exit 0 |
| unit | `npm test` (heap 128) | exit 0, 59 files, 1987 passed |
| result file | `.test-results/last-run.json` | `success: true`, 1987/1987, 0 failed, 0 pending, 0 todo |
| skip count | `NODE_OPTIONS=--max-old-space-size=128 npx vitest run --reporter=json \| jq '.numPendingTests + .numTodoTests'` | 0 |
| skip integrity | `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0` | `No findings.`, exit 0 |
| CLI_DEEP | `CLI_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 npx vitest run src/cli.real-engine.test.ts` | exit 0, 11/11 |
| PERFT_DEEP | `PERFT_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 npx vitest run src/perft.test.ts` | exit 0, 32/32 |

- **Lint does not reach the instrument.** `npx biome check .grugops/context/design-F-072-1/probe/clause-b.mjs`
  prints "These paths were provided but ignored" (exit 1), so Biome's config excludes `.grugops/`. Every reading in
  `…readings` ran the file under `node`, so it parses and runs, but it is not linted.
- **UAT waiver (AGENTS.md form, `.snap` not filtered out):** `git diff --name-only ccccc6bb d8c073e2 | grep -v
  '\.test\.ts$' | grep '^src/'` is **empty** (grep exit 1). No `.snap` file changed. The changed files are only
  `.grugops/context/design-F-072-1/probe/clause-b.mjs` and `memory-bank/50-decisions/ADR-0036-….md`. That is 0
  production lines, so the waiver condition holds. QE is still owed.
