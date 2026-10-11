---
task: wave-2026-09-25
subtask: design-ABC-144-fcap
role: architect-design
ticket: plans/tickets/ABC-144-npm-test-chokes-the-macbook-air-m3-cut-its-cpu-and-cap-its-cores.md
ref: .grugops/context/design-ABC-144-fcap/
enqueued_by: orchestrator
enqueued_at: 2026-10-12T00:00:00Z
branch: grugops/design-ABC-144-fcap (create from main)
base: main
---

# Subtask: close RISK-ABC144-FCAP per ADR-0042 ruling 6 / ADR-0040 addendum 2 item 4.

Security/NFR read the full-lane twin R at k = 2 on 3.2.7 (CPU R 0.440 s, wall R 0.190 s; note `…bceca0ca` and probe
under .grugops/context/secnfr-ABC-152-window/). Rule the recorded floors F after ABC-152 (vitest 4.1, runner off):
whether the 3.2.7 twin applies post-merge or the floor needs a 4.1 re-read, and record it in ADR-0035/0040 status
text and the NFR catalog line. Nothing measured. Commit on your branch; never merge. Use /usr/bin/diff.
