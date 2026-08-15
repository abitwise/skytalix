---
id: 20260815T140000Z-agents-md-scribe-artifact-ref-agents-md-at-08ab82d-with-five-gates-green-e2b777c0
kind: artifact-ref
by: agents-md-scribe
at: 2026-08-15T14:00:00Z
verified_by: 
confidence: high
refs:
  - AGENTS.md
  - grugops/agents-md-owner-grants
  - 08ab82d
  - .grugops/queue/claimed/agents-md-owner-grants/
supersedes: 
---

# Artifact — `AGENTS.md` at `08ab82d` on `grugops/agents-md-owner-grants`, five gate steps green

## The artifact

| what | where |
|---|---|
| the edited file | `AGENTS.md` — **21,299 bytes (20.8 KiB) of the 32 KiB Codex cap** |
| branch | `grugops/agents-md-owner-grants`, cut by NAME from `grugops/owner-grants-2026-08-15` @ `daa20c4` |
| commit | **`08ab82d`** — 6 files, +341 / −21 |
| queue | `.grugops/queue/claimed/agents-md-owner-grants/` (claim + subtask file) |
| notes | this folder — one `decision`, two `observation`, this `artifact-ref` |

**Correction to my own earlier note:** the `decision` note says 20.6 KiB. That was measured before the
last two edits (the two precedence paragraphs that name where the kit's never-deploy line is and is
not overridden). **21,299 bytes is the committed figure.** Notes are append-only, so the number is
corrected here rather than edited there.

**The subtask file was left in `claimed/`, not moved to `done/`.** That matches every other hop's
branch in this project: the drain to `done/` happens when the Orchestrator merges, and marking it
done on an unmerged branch would advertise a finished subtask nobody can reach.

## Gates, run on the branch tip — the exact invocations

Run in the branch's own `git worktree`, on the tree that became `08ab82d`:

| step | invocation | result |
|---|---|---|
| lint | `npm run lint` | **exit 0** — "Checked 54 files … No fixes applied. Found 2 infos." |
| typecheck | `npm run typecheck` | **exit 0** |
| unit | `npm test` | **exit 0** — 30 files, **856/856** |
| build | `npm run build` | **exit 0** (`tsc --noEmit`; still a typecheck wearing the build slot's name) |
| skip count | `npx vitest run --reporter=json 2>/dev/null \| jq '.numPendingTests + .numTodoTests'` | **0** |
| test integrity | `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0` | **exit 0** — `No findings.` |

All four of `quality.mandatory_gates` are green and the test-integrity step ran rather than
exiting 2. **Nothing was self-certified: no `finding` was written, no `§14-gate#<id>` stamp exists on
this install, and none was invented.** These are recorded results, not a verdict.

The gates were run TWICE: once on the tree before I added the two precedence paragraphs, and again
on the final tree. **Only the second run is reported above**, because only the second run is the tree
that was committed.

## Two things a later reader will want to know about the run environment

1. **This hop ran in a private `git worktree`** so the shared checkout's `HEAD` was never moved out
   from under the parallel Architect/Design hop on `grugops/design-adr0007-deploy-authority`. The
   shared checkout stayed on its own branch and clean throughout; **the only thing this hop created
   there is the untracked claim directory**, which is the whole point of putting the atomic `mkdir`
   where both hops can see it.
2. **`node_modules` in that worktree is a symlink to the main checkout's**, and `package.json` /
   `package-lock.json` were not touched by this hop, so the dependency tree under every command above
   is the same one every other gate on this branch has used. Recorded because a symlinked
   `node_modules` is exactly the kind of detail that turns into an argument later.

## Not done, and by whose choice

**`plans/traceability.md` has no row for this hop.** The role file makes that a standing duty; the
subtask's hard limits forbid touching `plans/`. The subtask won, and the row is owed by whoever
merges — see the `observation` note in this folder.
