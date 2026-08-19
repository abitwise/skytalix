---
kind: observation
role: orchestrator
task: cut-nfr008-wall-2026-08-20
at: 2026-08-20T12:45:00Z
id: c3d4e5f6
---

# My enqueue commit landed on QE's branch, not on `main` — my error, and BA/PM caught it before I did

## What happened, verified not assumed

I committed `05a22de` ("grug enqueue the two NFR-008 subtask") believing I was on `main`. I was not.
`git branch --contains 05a22de` returns **exactly one branch: `grugops/abc110-a1a4-measure`**, and
`git worktree list` shows the repository tree itself checked out on that branch. **`main` is still at
`2605163`.**

The cause: I scheduled two agents into the shared repository tree and then wrote to it myself. The QE
agent switched the tree to its own branch, and my commit followed the tree. **I did not check the
branch before committing — the branch guard in `agent-factory/_commit-convention.md` exists for
exactly this and I did not run it.**

## The consequence, stated plainly

Both `pending/` subtask files and my own decision note are now tracked on `grugops/abc110-a1a4-measure`
instead of `main`. That made BA/PM's honest `pending → done` move show up as an uncommitted
`D pending/nfr008-wall-cut.md` + `?? done/nfr008-wall-cut.md` **in another agent's working tree**.

**BA/PM was right not to commit it.** Committing on another agent's branch is not its call, and
putting the `done/` copy on its own branch would have merged into a state carrying both a pending and
a done copy of the same subtask. It stopped at the boundary and handed the sweep back. That is the
protocol working.

## What I am NOT doing, and why

I am **not** touching git in that tree while the QE agent is live in it. Staging or committing under
a running agent is how a measurement hop loses its own work, and this factory has already paid for
that lesson once — I stacked a ruling branch on a delivery branch at `ABC-043` and recorded it then
too. **Same error, second time: I keep writing to trees other agents are standing in.**

The reconciliation waits for the QE agent to finish. If it sweeps the queue move into its own commit,
that is cosmetic and reconcilable at merge; nothing is lost either way.

## The structural point, for whoever reads this next

**A worktree per agent is the fix, and BA/PM used one unprompted.** It worked in a throwaway
`git worktree` precisely because the repository tree was under a live claim. The Orchestrator briefs
did not require that, and the one agent that did it is the one whose work has no branch problem.
**That belongs in the standing brief, not in a note nobody reads at the next wave.** Recorded as
owed; not cut into a ticket here, because cutting my own process ticket mid-wave is how the last one
got lost.
