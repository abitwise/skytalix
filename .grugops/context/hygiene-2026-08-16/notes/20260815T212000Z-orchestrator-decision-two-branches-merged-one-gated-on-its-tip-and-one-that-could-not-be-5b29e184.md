---
id: 20260815T212000Z-orchestrator-decision-two-branches-merged-one-gated-on-its-tip-and-one-that-could-not-be-5b29e184
kind: decision
by: orchestrator
at: 2026-08-15T21:20:00Z
verified_by: 
confidence: high
refs:
  - memory-bank/50-decisions/ADR-0007-deployment-posture-local-only.md
  - .grugops/context/security-nfr-ABC-041/notes/
  - .grugops/queue/done/agents-md-owner-grants.claim.md
supersedes: 
---

# Two branches merged, and the honest difference between the two gate records

The owner's instruction — *"make sure the ones that need to be merged are merged"* — is the
authority for this hop, on top of the standing 2026-08-06 / 2026-08-15 merge grants recorded in
`memory-bank/60-progress.md`. Two branches were unmerged. Both are now in `main`. Neither touches
`src/`.

## `grugops/design-adr0007-deploy-authority` → `main` as `9671a22`

**Gated on its own tip at `eca0f10` BEFORE the merge**, and every number is a real exit code:
`lint 0`, `typecheck 0`, `unit 0` at **856/856 over 30 files**, `build 0`, and
`test-skip-integrity` `No findings.` at skip count `0`.

It carries the ADR-0007 amendment for the owner's 2026-08-15 deploy grant (176 lines), four
Architect/Design notes, and the `pending → done` transition of its own queue task file.

**The hazard its author flagged did not fire.** That branch's claim record warned that
`.grugops/queue/pending/design-adr0007-deploy-authority.md` is tracked on `main` too, so a
concurrent Orchestrator transition there would surface a rename conflict on the queue substrate.
No Orchestrator ever took it, so the rename applied at 100% similarity. `git merge-tree
--write-tree` returned `0` before the attempt — the merge was not discovered to be clean by
trying it.

## `grugops/security-nfr-ABC-041` → `main` as `60721e5`

**This one was NOT gated on its own tip, and the reason is recorded rather than papered over.**

Two facts made a tip gate meaningless here. Its merge-base with `main` is `ac17fe2` — sixty-odd
commits back — so its tree is an ABC-041-era snapshot; a green gate there would have described a
tree nobody is merging. And it is checked out in the worktree `cli-chess-sec041`, which has **no
`node_modules`**, so the gate could not have been run in place without an install.

What it actually contributes, by `git diff --name-only main...`: **five files, all under
`.grugops/context/security-nfr-ABC-041/notes/`, and zero lines under any path a gate reads.**

**A first attempt to gate it was made and is disclosed here because it produced a
number-shaped lie.** `git checkout grugops/security-nfr-ABC-041` in the main worktree failed —
`already used by worktree` — and the gate commands in the same block ran anyway, against the
still-checked-out `eca0f10`. That run returned four zeroes and 856/856 and it was **discarded, not
recorded**: it is the previous branch's gate wearing this branch's heading. The check that caught
it was reading `git rev-parse HEAD` in the same output, not intuition.

**So the binding gate for this merge is the one on `main` after it.**

## The gate on `main` after both merges — `60721e5`

`lint 0` · `typecheck 0` · `unit 0` at **856/856 over 30 files** · `build 0` · skip count `0` ·
`test-skip-integrity` `No findings.` All four of `quality.mandatory_gates` are green on the
integrated tree. `quality.gate_enforcement` is `blocking`; nothing was skipped or softened, and
the merge authority is approval to merge work that PASSED.

## The queue claim was swept, not because it was stale but because it was DONE

`.grugops/queue/claimed/agents-md-owner-grants/` was escalated by the previous Orchestrator rather
than swept, on the sound reasoning that a mechanical TTL sweep returns finished work to `pending/`
and invites a redo. That reasoning is now moot: `git branch --contains` puts
`grugops/agents-md-owner-grants` **in `main`**, whose tip `c732fe2` is literally
`Merge branch 'grugops/agents-md-owner-grants'`. The work landed; only the bookkeeping was
outstanding. Both files moved `claimed/` → `done/`, which is the transition Workflow 17 defines
for completed work — **not** the `claimed/` → `pending/` a TTL sweep would have taken.
`claimed/` is now empty of finished work.
