---
task: ticket-to-pr-ABC-015
subtask: bapm-abc015-spec-gaps
role: ba-pm
workflow: agent-factory/workflows/07-refinement.md
ref: .grugops/context/ticket-to-pr-ABC-015/
enqueued_by: orchestrator
enqueued_at: 2026-08-08T19:16:00Z
---

Rule three acceptance-criteria items on `ABC-015`. You corrected this ticket once already today at
the `Backlog → Ready` exit; the Engineer and QE each found more while building and breaking against
it, and one of them is your own corrected section violating the ticket's own test notes.

Work on branch `grugops/ticket-to-pr-ABC-015`. Never commit on `main`.

Read the `ref:` context folder FIRST (Workflow 16). The Engineer, QE and the Orchestrator have all
published there, including the Orchestrator's decision to schedule you BEFORE the Security/NFR gate
and why. **Nothing is inlined here.** Do not take any role's count or characterisation on trust —
this task has already produced one confirmed miscount by the Orchestrator and one flagged
non-defect by the Engineer.

**The ticket is in `In Security/NFR` and it does NOT move for this subtask.** You are amending
acceptance criteria, not taking a column exit. Do not move it, do not move it back, and do not touch
the `In Security/NFR` exit — that is Security/NFR's.

**One of the three can change code.** If your ruling changes required behaviour, say so plainly and
name it as owed back to the Software Engineer with a QE re-run — do not quietly reshape a criterion
to fit what was built. If your ruling ratifies what was built, say that too, and say what evidence
it rests on.

Do not touch `src/`. Do not edit another role's published notes.

NOTE — degraded substrate: this install has no `scripts/claim.js` and no `scripts/context-io.ts`.
Move this file `pending/` → `claimed/ticket-to-pr-ABC-015-spec/` → `done/` by hand with a `claim.md`
registry record beside it, and say so. Hand-write notes into the `ref:` folder's `notes/` in the
schema's exact shape. **`finding` is NOT admissible — no §14 gate exists here to issue a stamp.
Never self-stamp.**

Never merge and never deploy — a human holds both.
