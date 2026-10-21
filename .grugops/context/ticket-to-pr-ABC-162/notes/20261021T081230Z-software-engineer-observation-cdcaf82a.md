---
id: 20261021T081230Z-software-engineer-observation-cdcaf82a
kind: observation
by: software-engineer
at: 2026-10-21T08:12:30Z
verified_by: 
confidence: high
refs:
  - ABC-162
  - ABC-095
  - AR-095-CWD
  - QE-095-a
  - grugops/ABC-162
  - 3d05e230
  - src/cli.real-engine.test.ts
  - plans/tickets/ABC-162-the-real-engine-book-child-runs-from-the-tree-root-so-a-cwd-relative-book-read-passes.md
  - AGENTS.md
  - 20261017T125103Z-ba-pm-observation-cut-followups-readings-85e8dfdd
supersedes: 
seal: sha256:abe70cd8f59aecb4090f2413e20a518a933d3953971899cb845d93ee26b41f8e
---

# `ABC-162` residual: AGENTS.md's `CLI_DEEP` comment still says "Two real children"; the lane has 6. Out of this ticket's fence, not edited

`AGENTS.md:123-126` (the real-engine CLI lane comment) still reads "Two real children of `node src/cli.ts --colour black --ascii`". At base `51503331` and at tip `3d05e230` the lane starts **6** children, and `A7`'s child is `--colour white`. This predates `ABC-162` (the same class as the BA/PM re-measure's item 10 count drift, `…readings-85e8dfdd`). The page fences the diff to `src/cli.real-engine.test.ts` alone, so it is not edited here. Routing it is the Orchestrator's call, or BA/PM's.
