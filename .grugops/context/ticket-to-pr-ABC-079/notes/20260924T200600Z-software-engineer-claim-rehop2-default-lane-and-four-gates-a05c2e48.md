---
id: 20260924T200600Z-software-engineer-claim-rehop2-default-lane-and-four-gates-a05c2e48
kind: claim
by: software-engineer
at: 2026-09-24T20:06:00Z
verified_by:
confidence: UNKNOWN - verify
refs:
  - ABC-079
  - src/search.ts
  - src/search.test.ts
  - src/search.qe.test.ts
  - .grugops/test-skips.md
supersedes:
---

# The four mandatory gates, the default lane and test integrity at `33b9a02`: all exit 0

This is a `claim` with no stamp; the §14 gate is the Orchestrator's to run. Each command ran
once, through the node runner under `/usr/bin/time -p`, from the worktree. `node_modules` is
symlinked from the main checkout.

```
npm run lint        (biome check .)   Checked 75 files in 107ms. No fixes applied.   exit 0  real 0.32  load 6.89
npm run typecheck   (tsc --noEmit)                                                   exit 0  real 1.05  load 6.89
npm run build       (tsc --noEmit)                                                   exit 0  real 1.04  load 6.89 -> 10.58
npx vitest run --dir src
                    Test Files  41 passed (41)
                         Tests  1244 passed (1244)                                   exit 0  real 5.79  user 21.16  sys 2.23  load 10.58 -> 18.14
npx vitest run --dir src --reporter=json
                    numTotalTests 1244, numPassedTests 1244, numFailedTests 0,
                    numPendingTests 0, numTodoTests 0 -> skip count 0                exit 0  load 18.14 -> 22.53
node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0
                    No findings.                                                     exit 0
```

Re-hop 1 recorded 41 files / 1 243 at `700730b`. The +1 is the new `QE-G1` case. The
default-lane `A1`/`A2`/`A7` cases in `src/search.test.ts` are unchanged in number (28) and in
what they search; only the `searchPair` call sites now name their leaf. No test was skipped,
deleted from the default lane, or moved between lanes.
