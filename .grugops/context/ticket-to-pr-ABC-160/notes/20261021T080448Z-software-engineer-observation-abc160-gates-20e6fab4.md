---
id: 20261021T080448Z-software-engineer-observation-abc160-gates-20e6fab4
kind: observation
by: software-engineer
at: 2026-10-21T08:04:48Z
verified_by:
confidence: high
sealed: false
task: wave-2026-09-25
subtask: ticket-to-pr-ABC-160
refs: [ABC-160, NFR-008]
supersedes:
---

# SE `ABC-160`: gates on tip `1d2fd467` (RUN 2026-10-21)

Hand-authored and unsealed. Every vitest run carried `NODE_OPTIONS=--max-old-space-size=400` and ran alone. No timing taken.

| gate | command | result |
|---|---|---|
| lint | `npm run -s lint` | exit 0 |
| typecheck | `npm run -s typecheck` | exit 0 |
| build | `npm run -s build` | exit 0 |
| unit | `NODE_OPTIONS=--max-old-space-size=400 npm test` | exit 0, 59 files / 1987 tests passed; `last-run.json` `success: true`, pending 0, todo 0 |
| skip count | `NODE_OPTIONS=--max-old-space-size=400 npx vitest run --reporter=json \| jq '.numPendingTests + .numTodoTests'` | 0 |
| skip integrity | `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0` | `No findings.`, exit 0 |
| CLI_DEEP | `CLI_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 npx vitest run src/cli.real-engine.test.ts` | exit 0, 11 passed |
| PERFT_DEEP | `PERFT_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 npx vitest run src/perft.test.ts` | exit 0, 32 passed |

**Production lines (UAT waiver measurement).** Both forms are empty:
- `git diff --name-only 1d2fd467~1 1d2fd467 | grep -v '\.test\.ts$' | grep '^src/'`;
- `git diff --name-only 51503331 1d2fd467 | grep -v '\.test\.ts$' | grep '^src/'`.

`git diff --numstat 51503331 -- src/` is also empty. **0 production lines, so the UAT waiver applies.** The QE hop is still owed.
