---
id: 20260817T123000Z-orchestrator-observation-post-merge-gate-on-main-5b91d7e0
kind: observation
by: orchestrator
at: 2026-08-17T12:30:00Z
verified_by: 
confidence: high
refs:
  - src/cli.test.ts
  - 682c9e8
  - 74900e79a00caafa1ddfb1622c565c1a1b1ca938
supersedes: 
---

# `ABC-061` — the post-merge gate on `main`, RUN rather than assumed

`AGENTS.md` § Safety rules: *"run the gates on the branch tip before and on `main` after, and record
both."* The before is in this task's gate note. This is the after.

**Merge commit `682c9e8`** (`--no-ff` of `grugops/abc061-resolver-value-assertions` into `main`).
**Delivered commit `74900e7`.**

| gate | result on `main` @ `682c9e8` |
|---|---|
| `npm run lint` | `Checked 54 files in 121ms. No fixes applied.` exit 0 |
| `npm run typecheck` | no output, exit 0 |
| `npm run build` | no output, exit 0 |
| `npm test` | `Test Files 30 passed (30)`, `Tests 863 passed (863)`, `src/cli.test.ts (36 tests)` |
| skip count | **0** |
| test integrity | `No findings.` exit 0 |

**863 on `main` after the merge equals 863 on the branch tip**, and equals the 861 measured on `main`
before it plus exactly the two new `it` blocks. All measured; none quoted.

## The owner's second clause, closed out and verified after the fact

`git branch --no-merged main` now returns **0**. Before the merge it returned exactly one — this
ticket's branch. **His instruction is fully discharged, and it was discharged by merging one gated,
green branch rather than by sweeping anything.** 15 of the 16 branches were already in `main`,
including the four that stale worktrees still point at.

**What was NOT done, deliberately:** no branch was deleted and no worktree pruned. He said merge; he
did not say clean up, and a repository's branch history is not mine to tidy on an inferred
instruction. The four stale worktrees under `/private/tmp/…/scratchpad/` are from earlier sessions,
point at already-merged branches, and are noted here as housekeeping somebody may want — not acted
on.

**No deploy was performed and none exists to perform** (`AGENTS.md` § Deployment posture).
`production_requires_human_confirmation` is untouched and still `true`.
