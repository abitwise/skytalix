---
id: 20260815T131400Z-uat-planner-artifact-ref-what-this-amendment-produced-and-what-is-still-owed-1b42f2b6
kind: artifact-ref
by: uat-planner
at: 2026-08-15T13:14:00Z
verified_by: 
confidence: high
refs:
  - ABC-042
  - EPIC-006
  - agent-factory/workflows/06-uat-pack.md
  - agent-factory/checklists/uat-checklist.md
  - .grugops/context/uat-ABC-042-followups-2026-08-15/notes/20260815T125900Z-orchestrator-decision-the-validator-does-not-rewrite-what-it-validated-5dd97e41.md
  - 20260815T130800Z-uat-planner-observation-the-amendment-run-two-new-scenarios-executed-and-four-facts-re-measured-a2c53294
  - 20260815T131000Z-uat-planner-decision-the-amended-abc042-uat-pack-nineteen-scenarios-and-zero-of-epic006s-four-ad75b356
  - 20260815T131200Z-uat-planner-observation-nine-gaps-closed-none-declined-and-the-three-things-left-open-b5756806
supersedes: 
---

# What this subtask produced, and what is still owed to `ABC-042`

## The notes

| note | kind | what it is |
|---|---|---|
| `…130800Z-…-a2c53294` | `observation` | **The amendment run.** The tree-identity proof against a `main` that has moved, the two NEW scenarios executed with their actuals, the widened UAT-6 clause re-run, UAT-13's printed command executed, and the two facts that came back different from what I first wrote |
| `…131000Z-…-ad75b356` | `decision` | **THE AMENDED PACK — the version to execute and sign.** `supersedes: 20260815T110533Z-…-f43cd04c`. Nineteen scenarios, the `EPIC-006` zero-of-four table, the nine-row limitation table, § 9b's nineteen-row outcome table, and a *what else backs this* line on every scenario |
| `…131200Z-…-b5756806` | `observation` | **Gap by gap:** BA/PM's nine closed with how and where, QE's map applied scenario by scenario, my two self-corrections, and the three items left open for the Orchestrator |

## The headline

**Nineteen scenarios. Nine gaps closed, none declined. `ABC-042` meets ZERO of `EPIC-006`'s four
acceptance criteria, and the pack now says so in a table, with the reason for each and the scenario
that shows it.** Two scenarios were added and both were RUN against a tree proven byte-identical to
`main` — **UAT-18** (twelve blank move-list rows: 23-row frame, 12 rows below the status lines, zero
non-space characters, on a pipe and under a real terminal) and **UAT-19** (the board saved to a file:
zero chess figures, zero bytes above `U+007F`, exit `0`). **The exit criterion the first version could
not discharge now has a form to be discharged on.**

**Preparer's outcome across the nineteen: 19 recorded PASS, 0 fail, 0 not run** — seventeen executed at
the pack hop, two at this one, four re-measured here. **A preparer's PASS is not an acceptance.**
UAT-8's PASS is re-evidenced on a pseudo-terminal because the original piped evidence could not
discriminate, and UAT-14 carries a named documentation defect that is not a product failure.

## What is NOT here, deliberately

- **No signature and no request for one.** Every box in § 9 and every cell in § 9b is empty. No agent
  may tick them and none has.
- **No `finding` kind and no `verified_by` stamp.** `context.human_admission` is `off` on this install.
- **No mutation of the first pack note.** Notes are append-only; the amendment is a new note with
  `supersedes` set, and the superseded version stays on file with its gaps intact.
- **No product change, no test written, no ticket cut, no board move, no traceability row.** This hop
  wrote only this notes folder and its own queue records, on `grugops/uat-ABC-042-amend` in a private
  `git worktree`, so the shared worktree's `HEAD` never moved and the parallel BA/PM cut was never
  disturbed.
- **Nothing under `plans/**`, `AGENTS.md`, `memory-bank/**`, `src/**` or
  `.grugops/context/uat-ABC-042-cut/` was touched.**

## What is still owed before `ABC-042` can be called accepted

1. **The Orchestrator reads the amended pack** and disposes of the three open items in
   `…131200Z-…-b5756806` — chiefly `O1`: **"zero of four" is currently written down only in a context
   note, and nothing in `plans/` says it.**
2. **Olger Oeselg** — execute or witness the nineteen scenarios, fill § 9b, and sign § 9 **items 8 to
   12 included**. Until he does, the UAT state is *pack amended and run by an agent, NOT accepted* —
   a different and lesser thing than accepted, and it must not be recorded as the latter.
3. **QE's coverage repairs** stay recommendations; `R1`/`R2` is the one the pack now leans on a single
   human run to cover.

**This amendment discharges the UAT deferral for nothing.** It makes the pack signable; the signature
is what discharges it, and it is the owner's. The other twenty-seven `Done` tickets remain *UAT
deferred → `EPIC-006`, explicitly NOT passed*.
