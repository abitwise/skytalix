---
task: refinement-abc076-a1-claim-2026-08-17
subtask: refinement-abc076-a1-claim
role: ba-pm
workflow: agent-factory/workflows/07-backlog-refinement.md
ref: .grugops/context/refinement-abc076-a1-claim-2026-08-17/
enqueued_by: orchestrator
enqueued_at: 2026-08-17T19:30:00Z
branch: grugops/refinement-abc076-a1-claim-2026-08-17
---

# Subtask: repair `ABC-076` `A1`'s false claim, rule on the 184 corpus, rule on the mirror helper

Closed 2026-08-17. Outcome, in one line each — reasoning is in the two notes under `ref:`:

- **`A1` repaired.** The "or one wrong mirrored table entry" promise is gone; `A1` now states what
  QE measured it detects (the side-to-move sign flip) and states that its greenness is NOT evidence
  about table contents. Identity and the 184 corpus kept.
- **184 corpus SURVIVES** on `ABC-082`/`ABC-083`'s account, with a new stated purpose.
- **QE's mirror-helper recommendation ACCEPTED with one addition**; written into `ABC-082` as `A7`,
  which also fences `productionModules()`.
- No `src/` change, no board move, no ticket cut, no merge.
