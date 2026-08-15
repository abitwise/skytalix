---
task: hygiene-2026-08-16
subtask: lint-config-drift
claimed_by: software-engineer
claimed_at: 2026-08-15T21:08:31Z
branch: grugops/lint-config-drift
base: main @ c732fe2 (branched by NAME)
worktree: ../cli-chess-lintcfg
ttl_minutes: 30
---

# Claim record — lint-config-drift

Claim taken by hand, per `AGENTS.md` § Role / workflow files: `scripts/claim.js` is absent from this
repository and from the kit, so there is no scripted claim path. `mkdir -p
.grugops/queue/claimed` for the parent, then a **bare** `mkdir` (no `-p`) of
`.grugops/queue/claimed/lint-config-drift/` — that bare `mkdir` returned exit 0, no `EEXIST`, so the
claim is held.

`claimed_at` is `date -u` on this machine. It reads **2026-08-15T21:08:31Z**, which is BEHIND the
session date (2026-08-16) and behind several `at` values already in this repository's shared context.
The measured value is recorded; no timestamp was moved forward to make replay order look tidy. This
is the same clock skew the parent `observation` note recorded at 21:05:14Z.

## Deviation from the stated claim procedure, recorded rather than hidden

The subtask file says "`git mv` this file from `pending/` to `claimed/lint-config-drift/`". **That
`git mv` was not possible and was not run.** At `main` (`c732fe2`) the file
`.grugops/queue/pending/lint-config-drift.md` is **untracked** — `git ls-files --error-unmatch` on it
returns `did not match any file(s) known to git`, and `git log --all -- <path>` returns nothing. It
exists only as an untracked file in the **main** worktree's working tree, which is not this worktree
and which the Orchestrator is actively merging into.

What was done instead: the task file's bytes were copied verbatim to
`.grugops/queue/claimed/lint-config-drift/lint-config-drift.md` in this worktree and staged by
explicit path. The end state on this branch is the intended one (task file under `claimed/`, claim
record beside it); only the mechanism differs, because there was no tracked source to move.

**Left for the Orchestrator:** the untracked copy at `.grugops/queue/pending/lint-config-drift.md` in
the MAIN worktree still exists. It was deliberately not touched — the main worktree's `HEAD` was
observed moving during this hop (`eca0f10` on `grugops/design-adr0007-deploy-authority`, then
`c732fe2`), and writing into a tree that is mid-merge is not this role's to do. After this branch
merges, that untracked file is a duplicate and is the Orchestrator's to remove.
