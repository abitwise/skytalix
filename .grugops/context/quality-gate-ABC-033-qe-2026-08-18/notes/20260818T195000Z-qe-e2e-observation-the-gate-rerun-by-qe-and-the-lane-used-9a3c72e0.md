---
id: 20260818T195000Z-qe-e2e-observation-the-gate-rerun-by-qe-and-the-lane-used-9a3c72e0
kind: observation
by: qe-e2e
at: 2026-08-18T19:50:00Z
verified_by:
confidence: high
refs:
  - ABC-033
  - ABC-050
  - NFR-008
  - vitest.config.ts
supersedes:
---

# The blocking gate, re-run by QE on the delivery branch tip `64b596c` — my numbers, not the engineer's

Every step below I ran myself. **I did not quote the engineer's observation note**; where my figure
matches theirs, that is an independent reproduction, and I say so.

## The lane I used

A **dedicated git worktree**, `.claude/worktrees/agent-a5ab455da39c14df5`, checked out on
`grugops/quality-gate-ABC-033-qe-2026-08-18` branched from
`grugops/abc033-one-prompt-both-formats` @ **`64b596c`** — **not** from `main`, per the brief.

Lane containment was **verified, not assumed**: the worktree has no `.claude/worktrees/` of its own
(`ls` returns "No such file or directory"), so no sibling agent's checkout can be swept in.
`node_modules` is a symlink to the repository root's. **`biome check .` reports 64 files**, which is
this repository alone — the contamination signature of `ABC-050` is a count in the hundreds.

This is the same containment strategy the engineer used, arrived at independently. The known
repo defect (`vitest.config.ts` has no `exclude`, so a root-level run sweeps sibling worktrees to
~246 files and a non-zero lint) is `ABC-050`, already routed, and I did not chase it.

## Every step, as it ran

| step | command | result |
|---|---|---|
| test | `npx vitest run` | **36 files, 1039 tests, 36 passed / 1039 passed**, 0 failed, 4.00 s |
| skip count | `npx vitest run --reporter=json \| jq '.numPendingTests + .numTodoTests'` | **0** |
| test integrity | `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0` | **`No findings.`**, exit **0** |
| lint | `npm run lint` (`biome check .`) | **Checked 64 files, no fixes applied**, exit **0** |
| typecheck | `npm run typecheck` (`tsc --noEmit`) | clean, exit **0** |
| build | `npm run build` (`tsc --noEmit`) | clean, exit **0** |
| deep perft | `PERFT_DEEP=1 npx vitest run src/perft.test.ts` | **32/32 passed**, 39.07 s |
| **deep search** | `SEARCH_DEEP=1 npx vitest run src/search.test.ts` | **41/41 passed**, 23.75 s |

**All eight steps green.** The first seven reproduce the engineer's reported figures exactly.

## The eighth step is mine, and it closes a gap in the engineer's gate (`G7`)

The engineer did **not** run `SEARCH_DEEP=1`, reasoning that *"this branch changes nothing under
`src/search.ts`"*. That reasoning is incomplete. `AGENTS.md` § Test names **two** triggers for that
lane, joined by "and", not "or":

> *"Run it at the **QE hop** and after any change to `src/search.ts`."*

The QE hop is a trigger in its own right, independent of the diff. This hop is the QE hop, so I ran
it. **41 passed (28 in the default lane), 23.75 s** — matching the figure `AGENTS.md` itself records
from `ABC-077`. Nothing red. **`G7` is discharged here and needs no follow-up**; I record it only so
the next hop does not repeat the omission, and because a lane skipped on a reason that does not cover
the rule is the kind of thing that stays skipped.

## `A7` re-measured from git

```
git diff --numstat a83b933~1 a83b933
374     0       src/move-input.test.ts
182     0       src/move-input.ts
```

Nothing else, under `src/` or anywhere. **`A7`'s diff clause is confirmed by measurement**, and its
suite clauses (green, skip 0, `PERFT_DEEP=1` 32/32) are confirmed by the table above. `A7` is the one
criterion I can mark unambiguously **met**.

The `A7` measurement also confirms the **2026-08-17 zero-production-lines UAT waiver does NOT
apply**: `src/move-input.ts` is a production file, so this ticket needs the owner's word as before.
That is the owner's to give and is outside QE's hop entirely — **QE is not UAT**, per `AGENTS.md`
§ "QE validation authority".

## The tree I gated is the tree that was delivered

All thirteen mutations in the sibling note were applied and reverted under a shell `EXIT` trap, and
each battery ended with `diff -q` against a pristine copy taken before the first mutation:
**RESTORE VERIFIED** for both `src/move-input.ts` and `src/legal.ts`. The gate figures above were
taken **before** any mutation. No production file on this branch differs from `64b596c`.

## `N8-LANE`, unchanged and still not measured to its own method

I did not re-measure lane cost and I am not asserting one. The engineer's note is honest that the
**paired-delta protocol (n ≥ 7 interleaved rounds, identity null control) was NOT run**, and that
what is recorded is the runner's own per-file figure (11 ms for `src/move-input.test.ts`, 40 tests)
rather than a measurement conducted to `N8-LANE`'s stated method. **That remains the state.** My own
full-suite wall time (4.00 s for 1039 tests) is consistent with one cheap added file and is not a
`N8-LANE` measurement either. Recording this so nobody later reads the ticket as having measured
`N8-LANE` — it did not, and it said so.
