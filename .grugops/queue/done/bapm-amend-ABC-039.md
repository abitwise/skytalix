---
task: wave-2026-09-25
subtask: bapm-amend-ABC-039
role: ba-pm
status: done
branch: grugops/ABC-039-ordinal-register
tip: e1a62a6b
base: 6c1257dd
finished_at: 2026-10-17T12:10:00Z
---

BA/PM ruled ABC-039 A3 **option (a)**. The SE's chronology was re-derived at source and holds: 15 moves at or before
3215004c, all 15 commits ancestors of it. ABC-017 has 2 moves and ABC-019 has 3; metrics.md:28 says 13.
A3 window is fixed to commit 3215004c (inclusive), git order, 15 rows, 47b5b935 excluded, a per-row ancestry check,
and ordinals 2/3/4/5. A4 gains (c), the metrics undercount. A5 allows the ABC-156 page and keeps metrics.md at 0 lines.
Cites refreshed: #1 board :1001, #9 trace :438, #2 history :814-815.
DoR 10/10. Resume the SE hop on this branch (re-dispatch ticket-to-pr-ABC-039).
Cut ABC-156 (XS, P3, DoR 10/10): repair plans/metrics.md:28. Placement requested: Backlog, blocked by ABC-039 merging.
Watch for an id collision with any ticket the parallel bapm-amend-ABC-056 hop cuts.
Notes: .grugops/context/bapm-amend-ABC-039/notes/ (…1055cfc1 observation, …bd22b8d2 decision). Two trace rows appended.
No owner question. Not merged, not pushed. No test suite run, no timing read, no src/ change.
