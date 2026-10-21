---
id: 20261021T090142Z-software-engineer-observation-605950a6
kind: observation
by: software-engineer
at: 2026-10-21T09:01:42Z
verified_by: 
confidence: high (each command run once on the tip, exit codes read)
refs:
  - ABC-179
  - grugops/ABC-179
  - dd131b71
  - ccccc6bb
  - plans/tickets/ABC-179-three-test-comments-say-what-their-source-does-not.md
  - ABC-173
  - QE-159-b
supersedes: 
seal: sha256:5ff3d86d1867d1647a3ef45c6edc737e424ae74c6e5df352e3eb3a8ec9b414c1
---

# ABC-179 gates on tip `dd131b71` (worktree `wt-ABC-179`, run one at a time, no timing taken)

| gate | command | result |
|---|---|---|
| lint | `npm run lint` | exit 0, "Checked 116 files … No fixes applied." |
| typecheck | `npm run typecheck` | exit 0 |
| build | `npm run build` | exit 0 |
| unit | `npm test` | exit 0, 59 files, 1987/1987 passed |
| result file | `.test-results/last-run.json` | `success` true, `runState` exited, `exitCode` 0, 1987 total, 0 failed, 0 pending, 0 todo |
| skip count | `NODE_OPTIONS=--max-old-space-size=128 npx vitest run --reporter=json \| jq '.numPendingTests + .numTodoTests'` | 0 |
| skip integrity | `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0` | "No findings.", exit 0 |
| CLI_DEEP | `CLI_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 npx vitest run src/cli.real-engine.test.ts` | exit 0, 11/11 |
| PERFT_DEEP | `PERFT_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 npx vitest run src/perft.test.ts` | exit 0, 32/32 |

Lint, typecheck and build were also run on the uncommitted tree that became `dd131b71` (the same bytes). Heap prefixes: 128 for the
whole-suite runs, 400 for the one-file lanes.
