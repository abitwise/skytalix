---
by: architect-design
at: 2026-08-15T10:13:52Z
task: design-adr0007-deploy-authority
---

# Now-running registry record

Claimed by hand per `agent-factory/workflows/17-task-claim.md` and `AGENTS.md` § "Role / workflow
files": `scripts/claim.js` is absent from this repository and from the kit, so `claimTask` /
`transition` were **not called and not faked**.

```
mkdir -p .grugops/queue/claimed                                    # parent
mkdir    .grugops/queue/claimed/design-adr0007-deploy-authority    # BARE mkdir — the atomic act
```

The bare `mkdir` returned success (exit 0, no `EEXIST`), so the **claim was WON, not lost**.

## Concurrent width at claim time — one LIVE competitor, and it is expected

`.grugops/queue/claimed/` held exactly one other directory: **`agents-md-owner-grants`**, the
AGENTS.md Scribe, working the SAME owner authority in parallel on its own branch. That is the
declared parallel hop, not a stale claim. **It is on `AGENTS.md`; this hop is on
`memory-bank/50-decisions/ADR-0007-deployment-posture-local-only.md`. Disjoint files, no shared
path, no merge expected.**

**Shared-worktree hazard, recorded because it is real rather than theoretical.** Both hops run in
the SAME git worktree. The Scribe's claim directory is untracked, so it was carried across my
`git checkout -b` and is visible in my tree; I did not stage it and did not touch it. Anything the
Scribe leaves untracked while I commit is at risk of being swept into my commit by a careless
`git add -A` — so every commit on this branch stages **explicit paths only**. Branch checkouts on
this worktree are also a live race between the two hops; mine is
`grugops/design-adr0007-deploy-authority` and I check out nothing else.

## Base

`grugops/owner-grants-2026-08-15` @ **`daa20c4`** — the branch tip, taken by NAME as the subtask
requires. `daa20c4` is the commit that both adds this subtask file and writes the owner's directive
into `memory-bank/60-progress.md`, so the authority this hop cites is present in the tree it was
branched from. No sha was pinned by the subtask; none was needed.

## The `pending → claimed` transition IS taken here

`.grugops/queue/pending/design-adr0007-deploy-authority.md` is tracked in `daa20c4`, so the file
exists in this branch's tree and is renamed from it per Workflow 17 steps 3 and 5.

**Merge hazard, flagged rather than avoided.** The same path is tracked on `main`. If the
Orchestrator also transitions it there, integrating this branch surfaces a rename conflict on the
queue substrate only.

## Clock

`date -u` on this machine read **`2026-08-15T10:13:52Z`** at the bare `mkdir`, and that measured
value is what this record carries. It is **behind** several `at` values already in the shared
context — the parent task's own note is stamped `2026-08-15T13:10:00Z` and one task carries
`2026-08-16T10:35:00Z`. No timestamp was adjusted forward to make replay order look right; the
discrepancy is recorded as an observation instead.

This record is NOT a `kind: claim` note. The queue owns work-ownership; Workflow 16 owns memory.
