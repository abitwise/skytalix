---
id: 20260817T210000Z-software-engineer-artifact-ref-branch-files-gates-b58e0f4c
kind: artifact-ref
by: software-engineer
at: 2026-08-17T21:00:00Z
verified_by:
confidence: high
refs:
  - ABC-077
  - ABC-103
  - src/search.ts
  - src/search.test.ts
  - src/cli.test.ts
  - AGENTS.md
  - plans/traceability.md
supersedes:
---

# The delivered artifact, and the gate run on its tip

## Branch and commit

```
branch   grugops/abc077-negamax-alpha-beta
base     main @ bf371d7
commit   a00c2a3  feat(search): grug add negamax with alpha-beta, the ABC-077 recursion core
```

**NOT merged. `main` NOT touched.** The Orchestrator re-runs the gate and holds the merge.

## Files

```
src/search.ts        NEW   the recursion core (the delivered module A6 reads by name)
src/search.test.ts   NEW   A1-A7, two lanes
src/cli.test.ts      EDIT  one integer + its comment: the production-module count 22 -> 23
AGENTS.md            EDIT  one command slot: the SEARCH_DEEP=1 deep lane, with its RUN evidence
plans/traceability.md EDIT one row in place (ABC-077), four cells, + the update note
.grugops/queue/claimed/ticket-to-pr-ABC-077/claim.md   NEW  the queue claim record
```

**`plans/board.md` was NOT opened** — that column move is the Orchestrator's. **`.grugops/test-skips.md`
was NOT written** — human-owned; it was read and the integrity check run against it.

## The `ABC-103` tax, paid a fourth time

`src/cli.test.ts:738` hard-codes the count of production modules flat in `src/`. Adding
`src/search.ts` made it 23 and reddened `ABC-042`'s `A3` row. **The integer was moved 22 -> 23 and
its comment updated; nothing else in that file or that assertion changed.** This is exactly the
recurring cost `ABC-103` was cut to remove — its page says the tax had cost three tickets; **this is
the fourth**, and it is recorded here rather than absorbed silently.

## Gates, run on the branch tip, transcribed

```
$ npm run lint                     # biome check .
Checked 60 files in 81ms. No fixes applied.                                   exit 0

$ npm run typecheck                # tsc --noEmit
(no output)                                                                   exit 0

$ npm run build                    # tsc --noEmit
(no output)                                                                   exit 0

$ npm test                         # vitest run
Test Files  33 passed (33)
     Tests  963 passed (963)
  Duration  1.95s                                                             exit 0

$ npx vitest run --reporter=json 2>/dev/null | jq '.numPendingTests + .numTodoTests'
0

$ node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0
No findings.                                                                  exit 0
```

The opt-in lane, which is NOT part of the gate and is run because this ticket's criteria live partly
in it:

```
$ SEARCH_DEEP=1 npx vitest run src/search.test.ts
Test Files  1 passed (1)
     Tests  41 passed (41)
  Duration  22.99s                                                            exit 0
```

`npm test` before the `src/cli.test.ts` integer moved: **1 failed | 962 passed**, the single failure
being `ABC-042`'s `A3` expecting 22 modules and finding 23. Recorded because a gate that was red at
any point on this branch should be visible, not smoothed away.
