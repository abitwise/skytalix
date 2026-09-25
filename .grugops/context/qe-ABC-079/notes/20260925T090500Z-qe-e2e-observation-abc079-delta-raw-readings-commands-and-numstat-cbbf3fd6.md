---
id: 20260925T090500Z-qe-e2e-observation-abc079-delta-raw-readings-commands-and-numstat-cbbf3fd6
kind: observation
by: qe-e2e
at: 2026-09-25T09:05:00Z
verified_by:
confidence: high
refs:
  - ABC-079
  - NFR-008
  - src/search.ts
  - src/search.test.ts
  - src/quiescence.test.ts
  - .grugops/context/qe-ABC-079/notes/20260925T090000Z-qe-e2e-decision-abc079-delta-pass-d1-d4-true-g1-g2-closed-r2a-also-red-4a7bc08c.md
supersedes:
---

# Raw readings for the `ABC-079` delta re-QE — commands, exit codes, durations, numstat

**NOT A STAMP.** Companion to the `decision` note above. All runs against code commit
`9d2306c` on `grugops/ABC-079-quiescence-rehop3`'s tree, checked out at
`.claude/worktrees/qe-ABC-079-delta` (branch `grugops/qe-ABC-079-delta` @ `04eebf8`, base
`grugops/int-ABC-079` @ `c6b528d`).

## Numstat

```
$ git diff --numstat 9a7e549 9d2306c -- src
38  8   src/quiescence.test.ts
60  14  src/search.test.ts
21  8   src/search.ts
```

## Token-stream identity check (D1–D4 comment-only proof, independently re-run)

TypeScript scanner (trivia included in scan, comments/whitespace are trivia tokens skipped by
`getTokenText` iteration over non-EOF tokens) over `git archive 9a7e549 src/search.ts` vs
`git archive 9d2306c src/search.ts`:

```
before count 808 after count 808
identical true
```

## D3 measurement re-check

```
$ node --experimental-strip-types (inline probe, src/ as cwd)
import { parseFen } from "./fen.ts";
import { searchWithoutPruning } from "./search.ts";
searchWithoutPruning(parseFen("8/2p5/3p4/KP5r/1R3p1k/8/4P1P1/8 w - - 0 1"), 1).nodes
=> 46
```
Matches the comment's "46 nodes shipped" claim exactly.

## G1 — mutant re-application (raw)

Each mutant applied verbatim from the original QE FAIL decision's harness
(`.grugops/context/qe-ABC-079/notes/raw-harness-mutants.mjs.txt`, `MUTANTS.R2a_*`, `R2b_*`,
`R2c_*`, K=5), via a direct file edit, run, then `git checkout -- <file>`.

```
R2a — src/search.ts leaf: `const slip = ply >= 3 && Number.isFinite(alpha) && Number.isFinite(beta);`
  SEARCH_DEEP=1 npx vitest run src/quiescence.test.ts -t A5
  Tests  2 failed | 4 passed | 31 skipped (37)
  kiwipete d3: expected 205 to be 50
  position-6 d3: expected 145 to be 30
  git status --porcelain -- src   => (empty) after revert

R2b — src/search.ts leaf, K=5 capture-dense gate added
  SEARCH_DEEP=1 npx vitest run src/quiescence.test.ts -t A5
  Tests  2 failed | 4 passed | 31 skipped (37)
  kiwipete d3: expected 205 to be 50
  position-6 d3: expected 120 to be 30
  git status --porcelain -- src   => (empty) after revert

R2c — src/quiescence.ts, qply===0 black-to-move K=5 gate
  SEARCH_DEEP=1 npx vitest run src/quiescence.test.ts -t A5
  Tests  2 failed | 4 passed | 31 skipped (37)
  kiwipete d3: expected 205 to be 50
  position-6 d3: expected 120 to be 30
  git status --porcelain -- src   => (empty) after revert
```

## G2 — coverage-check mutation (raw)

```
src/search.test.ts broadSlice(): for root === "startpos", drop out[0] via .slice(1)
  SEARCH_DEEP=1 npx vitest run src/search.test.ts -t A4
  Tests  1 failed | 8 passed | 48 skipped (57)
  FAIL: "...six per-root slices are exactly that corpus" — expected 183 to be 184
  git status --porcelain -- src   => (empty) after revert
```

## Deep-lane re-run (raw)

```
$ time SEARCH_DEEP=1 npx vitest run src/search.test.ts src/quiescence.test.ts --reporter=json
real 1m58.153s / EXIT 0
numTotalTests 94, numPassedTests 94, numFailedTests 0, numPendingTests 0, numTodoTests 0

Slowest 6 (ms):
51356.6  A4 broad d2 — kiwipete's slice        (42.8% of 120s)
18795.5  A7 roots (d2 pairs + d3)               (15.7%)
12322.4  A1 kiwipete at depth 2                 (41.1% of 30s)
10181.5  A4 broad d2 — position-6's slice       (8.5%)
 6295.8  A5 kiwipete d3 + pin                   (5.2%)
 3980.2  A4 broad d2 — position-5's slice       (3.3%)
```

`A7` kiwipete slice, run alone via `-t`:
```
$ SEARCH_DEEP=1 npx vitest run src/search.test.ts -t "leaves the broad corpus byte-identical at depth 2 — kiwipete's slice" --reporter=json
EXIT 0, 1 passed / 56 skipped (this file)
duration 45290.04 ms => 37.75% of 120s
```

## Gates (raw)

```
$ npm run lint            -> "Checked 78 files in 93ms. No fixes applied." EXIT 0
$ npm run typecheck       -> EXIT 0
$ npm run build           -> EXIT 0
$ npm test                -> 43 files, 1392 passed, EXIT 0, 4.79s
$ node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0
                          -> "No findings." EXIT 0
$ ENGINE_DEEP=1 npx vitest run src/engine.test.ts --reporter=json
                          -> EXIT 0, numTotalTests 33, numPassedTests 33, numFailedTests 0
                             real 1m59.637s
```

## Machine / environment note

This worktree's machine reads deep-lane timings roughly 8–9% slower than the software
engineer's rehop3 readings (118.2 s vs 109.2 s full-lane wall; 51.4 s vs 48.1 s worst A4 case).
All figures stayed well inside the 50% share threshold the G2 ruling set. No case approached
the boundary.
