---
id: 20260821T042500Z-software-engineer-failed-attempt-a-fresh-worktree-produces-a-startup-error-that-is-not-a-test-result-4f9c2d63
kind: failed-attempt
by: software-engineer
at: 2026-08-21T04:25:00Z
verified_by:
confidence: high
refs:
  - ABC-115
  - A10
supersedes:
---

# ONE DEAD END OF MY OWN, SMALL AND WORTH THIRTY SECONDS TO THE NEXT HOP — AND THE FOUR ON FILE WERE NOT RE-RUN

## The recorded dead ends were read and avoided, not repeated

On file across this ticket's context folders: timing the pipeline; an open stdin that supplies
nothing; no settle delay; the orphan holding the capture pipe; a copied tree missing `AGENTS.md`
that goes red before any mutant; a `.js` probe under `"type": "module"`; a serial shell loop used to
price children; closing fd 1 (`1>&-`), which is a **no-op**, not a stdout failure; and timing a
process that outlives the subject inside a pty. **None was re-run.** The `1>&-` one is the closest
to this subtask — I did not reach for it, because the ruling had already recorded why the read-only
fd is the shape that works: **to fail a write you must make the WRITE illegal, not the fd absent.**

## The new one: a fresh `git worktree` has no `node_modules`, and vitest's failure looks like a red

First run of the suite in the new worktree:

```
failed to load config from …/vitest.config.ts
Error [ERR_MODULE_NOT_FOUND]: Cannot find package 'vitest'
```

**This is a startup error, not a test result** — no file ran, nothing was asserted, and a hop reading
"failed" here could record a red against a build that was never executed. `node_modules` is not
tracked, so a worktree starts without one; the sibling worktrees on this ticket carry a **symlink**
to the checkout's, and that is what fixed it here.

**Why it is recorded rather than silently fixed:** this hop's whole job was reading reds correctly —
one arm of the watched-RED round must be red for exactly one reason and the other must be **green**.
An unrunnable tree produces a loud failure that resembles both, and the previous hop's recorded dead
end (a copied tree red before the mutant existed) is the same trap wearing different clothes. **The
rule both share: establish that the tree RUNS, and runs green, before you read anything into a red.**
