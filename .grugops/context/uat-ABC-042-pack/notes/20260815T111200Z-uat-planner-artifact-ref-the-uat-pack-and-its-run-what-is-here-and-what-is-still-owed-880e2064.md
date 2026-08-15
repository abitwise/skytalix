---
id: 20260815T111200Z-uat-planner-artifact-ref-the-uat-pack-and-its-run-what-is-here-and-what-is-still-owed-880e2064
kind: artifact-ref
by: uat-planner
at: 2026-08-15T11:12:00Z
verified_by: 
confidence: high
refs:
  - ABC-042
  - EPIC-006
  - plans/tickets/ABC-042-entry-point-argv-and-the-first-frame.md
  - agent-factory/checklists/uat-checklist.md
  - agent-factory/workflows/06-uat-pack.md
  - .grugops/context/uat-ABC-042-2026-08-15/notes/20260815T105600Z-orchestrator-decision-uat-abc042-ordered-routing-and-the-row-that-does-not-move-97f07fc1.md
  - 20260815T110533Z-uat-planner-decision-the-abc042-uat-pack-seventeen-scenarios-a-non-engineer-can-run-and-judge-f43cd04c
  - 20260815T110727Z-uat-planner-observation-the-tree-under-test-is-byte-identical-to-main-and-the-check-that-says-so-8e4f1770
  - 20260815T110900Z-uat-planner-observation-the-run-seventeen-scenarios-executed-against-main-and-what-actually-came-back-8c6e3c04
  - 20260815T111100Z-uat-planner-observation-six-facts-the-run-turned-up-that-no-criterion-asks-about-99da7613
supersedes: 
---

# What this subtask produced, where it is, and what is still owed to `ABC-042`

## The artifacts

| note | kind | what it is |
|---|---|---|
| `…110533Z-…-f43cd04c` | `decision` | **The UAT pack.** Goal, entry criteria, roles, test data, seventeen business scenarios with pass/fail lines, the limitations, rollback, the signoff checklist naming **Olger Oeselg**, exit criteria, and the kit checklist worked through nine of nine |
| `…110727Z-…-8e4f1770` | `observation` | The tree under test is byte-identical to `main` — the check, its result, and the machine that ran it |
| `…110900Z-…-8c6e3c04` | `observation` | **The run.** 17 written · 17 run · **17 passed** · 0 failed · 0 not run, with actual output and exit codes |
| `…111100Z-…-99da7613` | `observation` | Six behaviours the run met that no criterion asks about |

## The one sentence this pack exists to prevent being written

> *"The chess game works."*

**It does not.** The board is drawn correctly; **the game does not exist.** No move can be made, there
is no opponent, and the position never changes. The pack's § 7 states it in nine points and its
Group F (UAT-15, UAT-16, UAT-17) turns three of them into commands the signer can run and watch fail,
so the limitation is verified rather than asserted. **Signoff checklist item 8 is the item that
matters; items 1–7 without it are the failure mode.**

## What is NOT here, deliberately

- **No signature.** No box in § 9 is ticked and no acceptance was recorded. `context.human_admission`
  is `off`; no `finding` kind and no verification stamp is admissible on this install; every note in
  this folder is `decision` / `observation` / `artifact-ref` with an empty `verified_by`. **The
  agent's run is evidence offered to the signer, not the signature** — the project owner's own
  distinction, carried from `memory-bank/60-progress.md` grant 3 and from the parent decision.
- **No board move, no traceability row, no metrics row, no edit to `ABC-042`'s ticket page.** The
  Orchestrator owns all four at close. This hop wrote only this notes folder and its own queue
  records.
- **No defect ticket** — none was owed: zero scenarios failed. Had one failed, it would have been
  reported here and routed, not self-triaged.
- **No production code and no test file** was created or edited.

## What is still owed before `ABC-042` can be called accepted

1. **BA/PM** (`uat-ABC-042-bapm`) — do the seventeen scenarios cover the user value and the scope.
2. **QE/E2E** (`uat-ABC-042-qe`) — do the automated tests back the scenarios, and what gaps remain.
3. **Olger Oeselg** — execute or witness the scenarios and sign, **items 8 to 11 included**. Until he
   does, `ABC-042`'s UAT state is *pack built and run by an agent, all scenarios passed, NOT accepted*
   — which is a different and lesser thing than *accepted*, and must not be recorded as the latter.

**This discharges the UAT deferral for `ABC-042` only.** The other twenty-seven `Done` tickets stay
*UAT deferred → `EPIC-006`, explicitly NOT passed*.
