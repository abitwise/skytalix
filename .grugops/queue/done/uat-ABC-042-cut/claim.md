---
task: uat-ABC-042-followups-2026-08-15
subtask: uat-ABC-042-cut
by: ba-pm
at: 2026-08-15T13:00:27Z
---

Now-running registry record for the queue CLAIM (Workflow 17 step 2). This is NOT a `kind: claim`
context note — it carries work-ownership only, and it shares nothing but the word with the note kind.

**Claimed BY HAND**, on the degradation `AGENTS.md` § Role / workflow files states outright:
`scripts/claim.js` exists neither in this repository nor in the kit, so Workflow 17 step 2's
`claimTask` could not be called and re-deriving that fact was skipped on the file's own instruction.
The atomicity property was preserved with a **bare** `mkdir` (no `-p`) of
`.grugops/queue/claimed/uat-ABC-042-cut/`, which returned **0** — the claim is mine; a second
claimant would have taken `EEXIST` and lost. The parent `claimed/` was re-asserted with `mkdir -p`
first, so the atomic create ran against a live parent and a parent-missing error could not be
mistaken for contention.

**The atomic act was performed in the MAIN worktree's queue**
(`/Users/olgeroeselg/Projects/hacks/grugops-examples/cli-chess-example`), because that is the only
filesystem location the concurrent UAT Planner hop (`uat-ABC-042-amend`) and I share — a `mkdir`
inside my own private worktree would exclude nobody. Nothing was committed there and no tracked file
was touched there; the `pending/` → `claimed/` transition is committed on my branch, where the work
happened.

**Work happens on branch `grugops/uat-ABC-042-cut`**, cut BY NAME from
`grugops/uat-ABC-042-followups` at its tip (`6ae5629`), in a private `git worktree`, so that the
shared worktree's `HEAD` is never moved out from under the parallel UAT Planner hop that is amending
the pack right now.

**Scope is `plans/tickets/` (new files only), one appended block in `plans/board.md` under Backlog,
one appended row per new ticket in `plans/traceability.md`, and this subtask's own notes.**
`ABC-042`'s page does not move and is not edited; `.grugops/context/uat-ABC-042-pack/`,
`.grugops/context/uat-ABC-042-amend/`, `memory-bank/**` and `plans/metrics.md` are cited, never
written. No test is written or edited, no file under `src/` is touched, and `AGENTS.md` is not
edited — the `--` repair is CUT AS A TICKET here, not performed.
