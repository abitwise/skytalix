---
id: 20261022T193009Z-software-engineer-observation-3ccb839a
kind: observation
by: software-engineer
at: 2026-10-22T19:30:09Z
verified_by: 
confidence: high (every command run as spelled at the tip; counts read from the runner and last-run.json)
refs:
  - ABC-200
  - EPIC-006
  - G6
  - ABC-037
  - ADR-0011
  - ADR-0015
  - ADR-0016
  - ADR-0036
  - ADR-0042
  - bd745ac9
  - 1efd2cee
  - 20261022T191404Z-architect-design-decision-f612277c
  - 20261022T191359Z-architect-design-observation-0d7cbff3
  - plans/tickets/ABC-200-on-a-terminal-npm-run-chess-asks-for-colour-and-difficulty-when-the-flags-are-absent.md
supersedes: 
seal: sha256:5baf6f07192d611f62eaf2ccc78af76eab2f1bfd320a74a7cb3796e48250f3d7
---

# ABC-200 gates at `1efd2cee`: lint/typecheck/build 0; npm test 61 files / 2 017 tests, success true; skips 0, No findings.; CLI_DEEP 11, UCI_DEEP 5, PERFT_DEEP 32 (+ INPUT_DEEP 34)

Software Engineer, task `ticket-to-pr-ABC-200`, 2026-10-22, worktree `../wt-ABC-200` with its own `npm ci --ignore-scripts`. Counts only; no timing claim and no `NFR-008` reading.

| gate | command | result |
|---|---|---|
| lint | `npm run lint` | exit 0, 122 files, no fixes |
| typecheck | `npm run typecheck` | exit 0 |
| build | `npm run build` | exit 0; `dist/` holds neither new module (`ADR-0044`) |
| unit | `npm test` | exit 0; 61 files / 2 017 tests passed, 0 failed. Base by arithmetic: 60 / 1 995 (+1 file, +22 rows; `line-input.test.ts` stays 30) |
| result file | `.test-results/last-run.json` | `success: true`, 2 017 / 2 017, pending 0, todo 0 |
| skip count | `NODE_OPTIONS=--max-old-space-size=128 npx vitest run --reporter=json … \| jq '.numPendingTests + .numTodoTests'` | 0 |
| skip integrity | `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0` | `No findings.`, exit 0 |
| CLI_DEEP | heap 400, `src/cli.real-engine.test.ts` | 11 / 11 |
| UCI_DEEP | heap 400, `src/uci.real-engine.test.ts` | 5 / 5 |
| PERFT_DEEP | heap 400, `src/perft.test.ts` | 32 / 32 |
| INPUT_DEEP (not in the brief; run because the reader moved) | `INPUT_DEEP=1 NODE_OPTIONS="--expose-gc --max-old-space-size=400"`, `src/line-input.test.ts` | 34 / 34 |

The deep lanes ran on the committed tip. The last code edit before the commit (inlining the `absent` type) was type-only; `npm test`, skips and integrity were re-run after it.
