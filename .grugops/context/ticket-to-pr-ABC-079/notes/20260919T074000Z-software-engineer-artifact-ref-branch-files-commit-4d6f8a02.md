---
id: 20260919T074000Z-software-engineer-artifact-ref-branch-files-commit-4d6f8a02
kind: artifact-ref
by: software-engineer
at: 2026-09-19T07:40:00Z
verified_by:
confidence: high
refs:
  - ABC-079
  - src/quiescence.ts
  - src/quiescence.test.ts
  - src/search.ts
  - src/engine.ts
  - src/search.test.ts
  - src/search.qe.test.ts
  - plans/traceability.md
  - plans/tickets/ABC-079-quiescence-search-on-captures.md
supersedes:
---

# The delivered artifact

## Branch and commit

```
branch   grugops/ABC-079-quiescence
base     grugops/wave-2026-09-19 @ 4f0ef01
commit   ead14eb  feat(search): grug add quiescence on captures, ABC-079 — A5 stop condition TRIPPED, lane RED
```

**NOT merged. `main` NOT touched. `plans/board.md` NOT opened, `AGENTS.md` NOT opened** (both
fenced). Built in an isolated worktree with `node_modules` symlinked read-only to the main checkout.

## Files (`git diff --numstat 4f0ef01 ead14eb`)

```
 32  10  src/engine.ts         shared leaf via quiesce(); countNode() factored out of negamax; Budget.visit
503   0  src/quiescence.test.ts NEW  A1-A6, two lanes, HANGING_CORPUS (24)
 92   0  src/quiescence.ts      NEW  the module
 10   1  src/search.qe.test.ts  QE-G1 +1 case for the new door
 12   1  src/search.test.ts     A6 export list +1 name, +1 Function.length check
 60  15  src/search.ts          leaf via quiesce(); Switches {prune, quiescence}; searchWithoutQuiescence
```

A second commit on the same branch carries this task's notes, the `plans/traceability.md` row,
the ticket page's `## Delivery` section and the queue record's move to `done/`.

## Ruling honoured

`ADR-0020`: `src/zobrist.ts` untouched, no per-ply key array added (`ABC-075` builds, `ABC-081`
consumes). `ADR-0002` clause 3 / `EngineSeam` shape extended, not changed: `chooseMove` and
`createEngine` signatures byte-identical; the deepening loop byte-identical.

## Commands run on the tip, transcribed

```
$ npm run lint                       # biome check .
Checked 75 files in 72ms. No fixes applied.                                     exit 0
$ npm run typecheck                  # tsc --noEmit                              exit 0
$ npm run build                      # tsc --noEmit                              exit 0
$ npx vitest run --dir src
Test Files  2 failed | 39 passed (41)
     Tests  5 failed | 1238 passed (1243)                                        exit 1
$ npx vitest run --dir src --reporter=json 2>/dev/null | jq '.numPendingTests + .numTodoTests'
0
$ node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0
No findings.                                                                    exit 0
```

The five failures, by name: `src/quiescence.test.ts` `A5` ×2 (the stop condition, asserted);
`src/engine.test.ts` `A2` "visits only a bounded number of nodes past the deadline" (38 496 >
10 240), `A3` "aborts INSIDE depth 3" (depth 1, not 2), `A3` "returns the completed depth-2 move"
(score 10 vs 30 — the reference is the depth the run no longer reaches). All five are one cause.

The deep lanes and the CPU measurements are in the gate-results `claim` and the measurement
`observation` of this task; not restated here.
