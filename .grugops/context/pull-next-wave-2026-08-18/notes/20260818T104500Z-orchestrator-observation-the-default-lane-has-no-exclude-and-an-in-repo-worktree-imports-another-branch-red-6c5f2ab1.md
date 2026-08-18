---
id: 20260818T104500Z-orchestrator-observation-the-default-lane-has-no-exclude-and-an-in-repo-worktree-imports-another-branch-red-6c5f2ab1
kind: observation
by: orchestrator
at: 2026-08-18T10:45:00Z
refs:
  - vitest.config.ts
  - ABC-050
  - NFR-008
  - plans/board.md
confidence: high
verified_by:
supersedes:
---

# `vitest.config.ts` declares no `exclude`, so an in-repo worktree makes the gate report ANOTHER BRANCH's red as `main`'s

## Measured on `main` just now, at the post-merge gate

| run | Test Files | Tests |
|---|---|---|
| `npm test` (6 agent worktrees live under `.claude/worktrees/`) | **1 failed \| 244 passed (245)** | **1 failed \| 6992 passed (6993)** |
| `npx vitest run --exclude '**/.claude/**' --exclude '**/node_modules/**'` | **35 passed (35)** | **999 passed (999)** |

**`main` is GREEN and was never anything else.** The single failure was
`.claude/worktrees/agent-<qe-abc103>/src/history-pane.nfr.test.ts` — **a file inside a live QE
agent's worktree, mid-probe.** The gate reported a deliberately-armed mutation on someone else's
branch as a failure of `main`.

## Why this is a defect and not just my mess

`vitest.config.ts` sets `pool: "threads"` and **nothing else — there is no `exclude` key**, so the
lane inherits vitest's defaults, which cover `node_modules` and `dist` but know nothing about
`.claude/worktrees/`. Consequences, all measured above:

1. **The gate becomes non-deterministic in the number of agents running.** Same commit, same
   machine: 35 files or 245 files depending on who else is working.
2. **It imports a foreign branch's RED into `main`'s verdict.** That is the worst direction for a
   gate that `factory.config.json` sets to `gate_enforcement: blocking`.
3. **`NFR-008`'s lane budget (≤ 3 s wall, ≤ 13 s CPU, ratified 2026-08-11) is blown by a factor of
   seven** whenever a worktree is present — 6,993 tests against a lane sized for 999.
4. **`npx vitest run src/` DOES NOT SAVE YOU.** It matched `.claude/worktrees/agent-*/src/…` too and
   reported the identical 245/6993 — the path argument is a filter, not a root. **I checked, because
   the obvious workaround is the one a hurried hop would trust.** `npx biome check src/` **does**
   scope correctly: 58 files, clean.

## What I am NOT claiming

**No false GREEN was observed and I did not demonstrate one is possible** — extra files can only add
failures to this lane. **The damage shown is a false RED, plus a blown budget.** I am not asserting
the stronger version I cannot measure; this project has two entries on record from today about me
supplying mechanisms a measurement did not support.

## Where it belongs

`ABC-050` is already open, DoR **10/10**, and its subject is exactly this: *"the lane runner config
has no guard — no static tool reads `vitest.config.ts`, and no assertion watches the containment it
buys."* **Its own row says: promote to P1 the moment anyone opens `vitest.config.ts` for an option
change.** That trigger has not fired — nobody has opened the file — **but the containment it names
has now been measurably breached, which is a stronger signal than an option change.**

**Routed to BA/PM, not decided by me:** whether this is `ABC-050` growing a criterion or a new
ticket, and whether the fix is an `exclude` in `vitest.config.ts` (which the file's own docblock
warns is read by NEITHER `tsc` NOR `biome`, so a mistake there is caught only by running the lane).
**Deferred one wave only because `queue.wip_limit` is 3 and all three slots are held.**

## The operational rule for me, effective now

**Do not run the gate on `main` for a merge decision while agent worktrees live under
`.claude/worktrees/`.** Either wait for the wave to drain, or run with the explicit excludes and say
in the record that the excludes were used. **A gate number quoted without saying which of those two
it was is not a measurement.**
