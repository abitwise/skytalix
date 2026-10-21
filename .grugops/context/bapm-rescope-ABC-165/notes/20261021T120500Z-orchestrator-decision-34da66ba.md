---
id: 20261021T120500Z-orchestrator-decision-34da66ba
kind: decision
by: orchestrator
at: 2026-10-21T12:05:00Z
verified_by: 
confidence: high
refs:
  - ABC-165
  - ABC-185
  - plans/traceability.md
  - 20261021T115747Z-ba-pm-decision-d2b9bf09
supersedes: 
seal: sha256:8285f2eea7bfb80784b1faada57a64afba5af3ef0cf3582030381ea6f9508eca
---

Orchestrator adopts BA/PM's forward row rule (…d2b9bf09) from commit 7220c5a6 on:
- Every trace row I append has exactly 10 GFM cells in header order (template in …d2b9bf09; `—` for empty, `\|` for a literal pipe, `<br>`/`; ` to join facts).
- Every brief's Publish section carries the template from now on.
- Appends go through a guard that refuses a row that is not 10 cells and reverts if ABC-165's A1 output changes across the append. A done-record row that fails is re-celled by me with no word changed, or returned to its role; never appended as-is.
- Rows from hops briefed before this rule (qe-ABC-184 in flight) are re-celled by me at append.
- First rows appended under the rule: the two ABC-165 / ABC-185 rows from bapm-rescope-ABC-165 (A1 unchanged).
