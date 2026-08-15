---
task: owner-grants-2026-08-15
subtask: agents-md-owner-grants
by: agents-md-scribe
at: 2026-08-15T13:13:00Z
---

Now-running registry record for the queue CLAIM (Workflow 17 step 2). This is NOT a `kind: claim`
context note — it carries work-ownership only, and it shares nothing but the word with the note kind.

**Claimed BY HAND**, on the degradation this project has recorded since 2026-08-06 and that
`AGENTS.md` § Role / workflow files now states outright: `scripts/claim.js` does not exist in this
repository or in the kit, so Workflow 17 step 2's `claimTask` could not be called. The atomicity
property was preserved with a **bare** `mkdir` (no `-p`) of
`.grugops/queue/claimed/agents-md-owner-grants/`, which returned **0** — the claim is mine; a second
claimant would have taken `EEXIST` and lost. The parent `claimed/` was re-asserted with `mkdir -p`
first (it did not exist — git tracks no empty directory and every earlier claim has drained to
`done/`), so the atomic create ran against a live parent and a parent-missing error could not be
mistaken for contention.

**The atomic act was performed in the MAIN worktree's queue**
(`/Users/olgeroeselg/Projects/hacks/grugops-examples/cli-chess-example`), because that is the only
filesystem location the concurrent Architect/Design hop (`design-adr0007-deploy-authority`) and I
share — a `mkdir` inside my own private worktree would exclude nobody. Nothing was committed there
and no tracked file was touched there: the directory is untracked on whatever branch that worktree
holds, and the `pending/` → `claimed/` transition is committed here, on my branch, where the work
happened.

**Work happens on branch `grugops/agents-md-owner-grants`**, cut by NAME from
`grugops/owner-grants-2026-08-15` at its tip (`daa20c4`), in a private `git worktree` so that the
shared worktree's `HEAD` is never moved out from under the parallel Architect/Design hop.

**Scope is `AGENTS.md` and this subtask's own notes.** `memory-bank/60-progress.md` and
`memory-bank/50-decisions/ADR-0007-deployment-posture-local-only.md` are cited, never written:
`ADR-0007` is the concurrent Architect/Design hop's file. The two file sets are disjoint and stayed
that way.
