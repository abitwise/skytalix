---
id: 20260924T201200Z-software-engineer-artifact-ref-rehop2-branch-files-commit-c27e4a61
kind: artifact-ref
by: software-engineer
at: 2026-09-24T20:12:00Z
verified_by:
confidence: high
refs:
  - ABC-079
  - ABC-077
  - src/search.ts
  - src/search.test.ts
  - src/search.qe.test.ts
  - plans/traceability.md
  - plans/tickets/ABC-079-quiescence-search-on-captures.md
  - .grugops/queue/done/ticket-to-pr-ABC-079-rehop2/
supersedes:
---

# The re-hop 2 artifact

## Branch and commits

```
branch   grugops/ABC-079-quiescence-rehop2   (sibling of grugops/ABC-079-quiescence; see the decision note §4)
base     grugops/ruling-abc079-oracle @ b324cb6  (= re-hop fa80923 + the oracle ruling), fast-forwarded
commit   33b9a02  test(search): grug run the depth-3 oracle on the bare leaf, ABC-079 re-hop 2 per the oracle ruling
```

`git merge-base --is-ancestor grugops/ABC-079-quiescence grugops/ABC-079-quiescence-rehop2`
holds, so the named branch can be moved to this tip by a fast-forward. A second commit carries
these notes, the trace-row edit, the ticket's `## Delivery (re-hop 2)` section and the queue
record's move to `done/`. **NOT merged.** `plans/board.md`, `AGENTS.md`, `plans/nfr-catalog.md`
and `ADR-0024` are untouched.

## Files (`git diff --numstat b324cb6 33b9a02`)

```
  5   0  src/search.qe.test.ts   QE-G1: the door's depthless-call case, plus the import
 87  30  src/search.test.ts      A1 bare-leaf d3 x6 + quiescence d3 on startpos/position-3 only; A2/A7/A6; header
 14   0  src/search.ts           searchWithoutPruningOrQuiescence, TEST-ONLY, documented like its siblings
```

## Commands run at `33b9a02` (node runner, `/usr/bin/time -p`)

```
SEARCH_DEEP=1 npx vitest run src/search.test.ts       exit 0   43 passed   125.5 s   load 3.9 -> 7.9
SEARCH_DEEP=1 npx vitest run src/quiescence.test.ts   exit 0   37 passed    13.2 s   load 7.1 -> 6.6
ENGINE_DEEP=1 npx vitest run src/engine.test.ts       exit 0   33 passed   133.3 s   load 6.6 -> 6.9
npm run lint / typecheck / build                      exit 0 / 0 / 0
npx vitest run --dir src                              exit 0   41 files / 1244 passed / 0 skipped   5.8 s
node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0   exit 0  No findings.
```

Per-case shares, NFR figures and limits are in the sibling notes of this hop, not restated here.
