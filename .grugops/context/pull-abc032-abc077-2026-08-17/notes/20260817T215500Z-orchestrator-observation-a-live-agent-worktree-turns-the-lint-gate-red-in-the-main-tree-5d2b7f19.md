---
id: 20260817T215500Z-orchestrator-observation-a-live-agent-worktree-turns-the-lint-gate-red-in-the-main-tree-5d2b7f19
kind: observation
by: orchestrator
at: 2026-08-17T21:55:00Z
verified_by:
confidence: high
refs:
  - ABC-032
  - ABC-077
  - AGENTS.md
  - biome.json
  - .gitignore
supersedes:
---

# A live agent worktree turns `npm run lint` RED in the main tree. Measured, and caused by this hop.

## What happened

I scheduled two engineers into isolated git worktrees to avoid `G5`. The host created them at
`.claude/worktrees/agent-<id>/` — **inside the repository** — each a full checkout carrying its own
`biome.json`. `npm run lint` is `biome check .` from the repo root, and biome **refuses nested root
configurations**:

```
× Found a nested root configuration, but there's already a root configuration.
  .claude/worktrees/agent-a46fb830…/biome.json
  .claude/worktrees/agent-a7dbec3c…/biome.json
× Biome exited because the configuration resulted in errors.
```

**Real exit code 1.** `lint` is in `quality.mandatory_gates`. **The mitigation for one hazard
created another, in a different gate, and I caused it.**

## Two things that are NOT wrong, checked rather than assumed

1. **Nothing leaked into git.** `git check-ignore -v` → `.gitignore:17:.claude/worktrees/`. The
   path was **already** ignored before this hop; someone anticipated agent worktrees. My commit
   `dd30f90` carries **10 files**, all `plans/` and `.grugops/`.
2. **The source tree is clean.** `npx biome check src/` → `Checked 54 files in 81ms.`, **exit 0**.
   The failure is **config discovery only**, not a lint violation. My diff is markdown; it could not
   have produced a lint error.

## The transferable finding

**`.gitignore` does not govern biome's configuration discovery.** Git ignores the path; biome walks
into it anyway. So the two are not interchangeable as "this directory is not part of the project",
and a gate that reads the filesystem can disagree with a gate that reads the index.

**The consequence to guard against is a FALSE RED, not a false green** — and false reds are how a
future hop gets sent to "fix" a config that was never broken. Anyone running the full gate while a
parallel agent is live sees `lint` fail **for a reason that has nothing to do with their diff**.

## What I did about it — and what I deliberately did NOT do

**I did not edit `biome.json`.** Adding an ignore entry would be changing project config to
accommodate my own scheduling choice, unrelated to either ticket in flight — coding rules 5 and 9.
If this recurs it is worth a ticket of its own, cut deliberately; it is not worth a silent patch
slipped into a docs commit.

**I am HOLDING the merge of `dd30f90`** rather than recording a green I cannot truthfully get. The
condition is transient: the worktrees are removed when the agents finish, and the full gate can then
be run and recorded honestly. **The scoped run above is evidence about my diff; it is not a
substitute for the mandatory gate, and it is not recorded as one.**
