---
task: uat-ABC-042-2026-08-15
subtask: uat-ABC-042-pack
by: uat-planner
at: 2026-08-15T10:59:14Z
---

Now-running registry record for the queue CLAIM (Workflow 17 step 2). This is NOT a `kind: claim`
context note — it carries work-ownership only and shares nothing with that note kind but the word.

**Claimed BY HAND**, per `AGENTS.md` § "Role / workflow files": `scripts/claim.js` is absent from
this repository and from the kit, so Workflow 17 step 2's `claimTask` could not be called and was
**not faked**. The atomicity property was preserved with a **bare** `mkdir` (no `-p`):

```
mkdir -p .grugops/queue/claimed                        # parent, re-asserted first
mkdir    .grugops/queue/claimed/uat-ABC-042-pack       # BARE mkdir — the atomic act
```

The bare `mkdir` returned **0**, so the claim was **WON**; a second claimant would have taken
`EEXIST` and lost. The parent was re-asserted first so a parent-missing error could not be mistaken
for contention.

**The atomic act was performed in the MAIN worktree's queue**
(`/Users/olgeroeselg/Projects/hacks/grugops-examples/cli-chess-example`) — the only filesystem
location this hop shares with the two phase-2 subtasks (`uat-ABC-042-bapm`, `uat-ABC-042-qe`). A
`mkdir` inside a private worktree would exclude nobody. Nothing was committed in the main worktree
and no tracked file was touched there.

Concurrent width at the time of the claim: one other directory under `claimed/`
(`agents-md-owner-grants`, an open claim from an earlier hop, left untouched — not adjudicated, not
released).

**Work happens on branch `grugops/uat-ABC-042-pack`**, cut by NAME from `grugops/uat-ABC-042` at its
tip, in a private `git worktree`, so the shared worktree's `HEAD` is never moved under a running
agent.
