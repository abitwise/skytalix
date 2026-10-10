---
task: wave-2026-09-25
subtask: ruling-abc053-abc054
role: architect-design
workflow: agent-factory/workflows (Architect ruling hop; ADR per memory-bank/50-decisions/ADR-template.md)
ref: .grugops/context/ruling-abc053-abc054/
enqueued_by: orchestrator
enqueued_at: 2026-10-10T08:06:21Z
branch: grugops/ruling-abc053-abc054
base: grugops/wave-2026-09-25 (tip after this enqueue)
---

# Subtask: rule the two Architect/Design questions that hold P1 tickets ABC-053 and ABC-054

- `ABC-053` (P1, DoR 9/10 ⚠️x1): the frame-path probe measures LOAD-time closure; `NFR-002`'s
  premise is the PER-FRAME path. The ticket says the ruling is Architect/Design's by `ADR-0011`'s own
  words, and `ADR-0011` clause 2's dated expiry is ripe.
- `ABC-054` (P1, DoR 8/10 ⚠️x2): two merged guards count import STATEMENTS, not consumers. Needs the
  "imports" vs "consumes" ruling. Its ordering on `ABC-041` is met (`ABC-041` Done).

Output: ruling(s) as ADR(s) (status `proposed` unless an existing accepted ADR already gives you the
authority — say which), a typed decision note per Workflow 16, and the ticket pages' DoR items the
ruling discharges marked with the ADR id. Do NOT re-score DoR (BA/PM's pen), do NOT edit `src/`,
`plans/board.md`, or any page under re-score (`ABC-126/083/036/038/010/087`) or `ABC-127`.
