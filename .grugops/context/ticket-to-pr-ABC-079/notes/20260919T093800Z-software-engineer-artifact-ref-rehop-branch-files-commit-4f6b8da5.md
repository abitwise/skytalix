---
id: 20260919T093800Z-software-engineer-artifact-ref-rehop-branch-files-commit-4f6b8da5
kind: artifact-ref
by: software-engineer
at: 2026-09-19T09:38:00Z
verified_by:
confidence: high
refs:
  - ABC-079
  - ADR-0024
  - src/quiescence.ts
  - src/quiescence.test.ts
  - src/engine.test.ts
  - plans/traceability.md
  - plans/tickets/ABC-079-quiescence-search-on-captures.md
  - .grugops/queue/done/ticket-to-pr-ABC-079-rehop/
supersedes:
---

# The re-hop artifact

## Branch and commits

```
branch   grugops/ABC-079-quiescence   (the SAME branch; not merged into the wave, not rebased)
base     grugops/ruling-abc079-multiplier @ f6772c5  (= build e2c3af5 + the ruling + ADR-0024), fast-forwarded
commit   700730b  feat(search): grug order captures MVV-LVA inside quiescence, ABC-079 re-hop per ADR-0024 — A5 re-levelled, engine fixtures re-fixtured
```

A second commit on the same branch carries this task's re-hop notes, the `plans/traceability.md`
row edit, the ticket page's `## Delivery (re-hop)` section and the queue record's move to `done/`.
**NOT merged. `main`, `plans/board.md`, `AGENTS.md`, `plans/nfr-catalog.md`, `ADR-0024`'s status
untouched.** Built in an isolated worktree with `node_modules` symlinked read-only to the main
checkout; the branch was taken with `--ignore-other-worktrees` because the first hop's worktree
still holds it (its work is fully committed at `e2c3af5`, so nothing there was disturbed).

## Files (`git diff --numstat f6772c5 700730b`)

```
 37  20  src/engine.test.ts      A2 comment re-measured (bound unchanged); A3 re-fixtured on 1. g4 d5 (A3_FEN), deep literal follows
 24  12  src/quiescence.test.ts  A5 levels per ADR-0024 decision 3, per position and depth; header paragraph
 42   5  src/quiescence.ts       ORDER_VALUE, exported mvvLvaKey(move), captures filtered + stable-sorted before the loop; header corrected
```

Production lines: `src/quiescence.ts` only. `src/search.ts` / `src/engine.ts`: no change (the
export forced no type change). `src/search.test.ts`: no change, by fence (the RED deep lane is
reported in the gate-results claim).

## Commands run on the tip, transcribed (through the scratch node runner, `/usr/bin/time -p`)

```
npx biome check .                                  exit 0   Checked 75 files. No fixes applied.
npx tsc --noEmit                                   exit 0   (typecheck and build slot)
npx vitest run --dir src                           exit 0   41 files / 1243 passed / 0 skipped
npx vitest run --dir src --reporter=json           numPendingTests 0, numTodoTests 0
node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0   exit 0  No findings.
SEARCH_DEEP=1 npx vitest run src/quiescence.test.ts   exit 0   37 passed, 13.7 s
SEARCH_DEEP=1 npx vitest run src/search.test.ts       exit 1   37 passed / 4 timed out, 2 678.5 s   (REPORTED)
ENGINE_DEEP=1 npx vitest run src/engine.test.ts       exit 0   33 passed, 123.7 s, the 50 ms case at 89 ms
```

The `A5` ratios, the criteria table, the NFR figures and the deep-lane transcripts are in the
sibling notes of this task; not restated here.
