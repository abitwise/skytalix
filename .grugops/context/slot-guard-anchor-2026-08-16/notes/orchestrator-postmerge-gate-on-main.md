---
type: observation
task: slot-guard-anchor-2026-08-16
author: Orchestrator
date: 2026-08-16
subject: the post-merge gate on `main` — the half of the safety rule that is easy to skip
---

# Gate re-run on `main` AFTER the merge. Green.

`AGENTS.md` § Safety rules requires the gate be run **"on the branch tip before and on `main` after,
and record both."** The before-half is in `orchestrator-gate-verification.md`. **This note is the
after-half, and it exists because a rule that is only ever half-performed is not a rule.** A green
branch tip does not prove a green `main` — the merge itself is a change.

Merge commit: **`080b6a4`** (`--no-ff`, so the hop stays legible in history).

| gate | result on `main` |
|---|---|
| `npm run lint` | `Checked 54 files in 88ms. No fixes applied.` **exit 0** |
| `npm run typecheck` | **exit 0** |
| `npm run build` | **exit 0** |
| `npm test` | **`Test Files 30 passed (30)` / `Tests 861 passed (861)`** |
| skip count | **0** |
| `test-skip-integrity.js` | **`No findings.` exit 0** |

Identical to the branch-tip figures. **`main` was never red.**

`AGENTS.md` re-checked across the WHOLE hop, not just the delivered commit:
`git diff --stat 3d23aa5 HEAD -- AGENTS.md` is **empty**. The fence both tickets called load-bearing —
*"the defect is in the reader, not the read"* — held from the pre-hop commit through to merged `main`,
including across the five mutants that were applied and reverted in between.

## Standing corrections, so the record is not read as more than it is

- **No UAT was conducted.** The owner waived the step for these two tickets. **A green gate is not an
  acceptance and this note is not a signature.**
- `context.human_admission` is **`off`**. No `finding`, no `§14-gate` verdict, no `human:<name>`
  stamp. Hand-authored `observation`, per `AGENTS.md`'s callout.
- **Nothing was deployed.** `production_requires_human_confirmation` is still `true` and this project
  deploys nowhere; merging is not deploying.
