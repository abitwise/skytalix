---
task: readyfordev-ABC-042
subtask: refinement-ABC-042-criteria
role: ba-pm
workflow: agent-factory/workflows/07-refinement.md
ref: .grugops/context/refinement-ABC-042-criteria/
parent_ref: .grugops/context/readyfordev-ABC-042/
inputs:
  - .grugops/context/security-nfr-ABC-042/notes/
  - .grugops/context/design-ABC-042-stderr/notes/
enqueued_by: orchestrator
enqueued_at: 2026-08-14T17:32:38Z
branch: grugops/readyfordev-ABC-042
worktree: (none — writes the ticket + own notes)
---

# Subtask: repair `ABC-042`'s criteria against two rulings and re-score its DoR

`ABC-042` is **BLOCKED at the `Ready for Dev` exit**. Security/NFR returned BLOCK on one HIGH
(ASVS L1) with six required repairs; Architect/Design returned three rulings and four more criterion
changes. **Every one of them names BA/PM as owner and none of them is owed any code.**

The rulings are in the two `inputs` dirs. Read them there — they are not restated here.
