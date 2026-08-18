---
task: design-oq1-lane-budget-2026-08-19
subtask: design-oq1-lane-budget
role: architect-design
workflow: agent-factory/workflows/07-adr-and-nfr.md
ticket: plans/tickets/ABC-108-the-default-test-lanes-own-budget-is-spent.md
ref: .grugops/context/design-oq1-lane-budget-2026-08-19/
parent_ref: .grugops/context/security-nfr-ABC-078-2026-08-18/
enqueued_by: architect-design
enqueued_at: 2026-08-19T00:00:00Z
branch: grugops/design-oq1-lane-budget
base: main @ 54cbb23
---

# Subtask: `ABC-108` / `OQ-1` — re-measure the default lane and RULE on `NFR-008`'s CPU clause

Re-measure the default test lane under `N8-LANE`'s ratified protocol and rule on `NFR-008`'s 13 s
CPU clause, either way, in writing. `N8-LANE`'s 650 ms cannot honestly be granted to any ticket
until this is ruled.

Constraints: nothing under `src/`; no bar, floor or level relaxed; `isolate: false` is UNAVAILABLE
(`ADR-0008`); moving the 13 s level is the owner's alone. No merge, no deploy, no board move.
Publish typed notes into `ref:`.
