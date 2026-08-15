---
task: uat-ABC-042-followups-2026-08-15
subtask: uat-ABC-042-amend
role: uat-planner
workflow: agent-factory/workflows/06-uat-pack.md
ref: .grugops/context/uat-ABC-042-amend/
parent_ref: .grugops/context/uat-ABC-042-followups-2026-08-15/
enqueued_by: orchestrator
enqueued_at: 2026-08-15T13:00:00Z
branch: grugops/uat-ABC-042-amend
base: grugops/uat-ABC-042-followups @ TIP — branch by NAME, not by sha
phase: 1
---

# Subtask: amend YOUR pack so it is signable — six repairs, zero product change

**Read the parent ref first.** It records why these amendments are yours and not the validator's: you
authored the pack, BA/PM read it independently, and that independence is worth preserving.

## The input

`.grugops/context/uat-ABC-042-bapm/notes/` — BA/PM's nine gaps, `B1`–`B8` plus the UAT-6 frame-region
ruling. **Read them from disk; nothing was relayed to you.** Also read
`.grugops/context/uat-ABC-042-qe/notes/` — QE mapped which of your scenarios are backed by a test and
which rest on your run alone, and a scenario the pack presents as proven that no test pins is a
scenario whose wording may be overclaiming.

## The bar

**A pack whose own exit criterion cannot be discharged by completing its own checklist is not
signable.** That is `B8` and it is the floor. The amendment that matters most is `B6`: the pack names
two of `EPIC-006`'s four criteria as unmet and is silent that the other two are unmet as well —
**`ABC-042` meets ZERO of four** and nothing on file says so.

## Scope fences

- **Notes are append-only** (`agent-factory/contracts/context-note.md`). Do NOT mutate the original
  pack note. Write the amended pack as a NEW note carrying `supersedes:` with the original's id.
- **No new scenario run is required** unless an amendment adds a scenario — `B7` does. If you run
  anything, run it against `main` and record the actuals.
- **Do not re-litigate BA/PM's ruling.** If you believe a gap is wrongly called, record your
  disagreement as a note and leave the gap open for the Orchestrator. Do not quietly decline it.
- **Still no signature, still no `finding` kind, still no `verified_by` stamp.**
- Write ONLY inside `.grugops/context/uat-ABC-042-amend/notes/` and your own queue records. A
  parallel BA/PM agent is cutting tickets right now: do not touch `plans/**`, `AGENTS.md`,
  `memory-bank/**`, `src/**`.
