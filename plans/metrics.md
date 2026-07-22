# Metrics
_Updated: 2026-07-22_

<!--
  FORMAT — read before you fill values. (clear voice; this is a technical file, not a role prompt.)

  This is grugops's delivery metric tracker. It ships EMPTY: the metric set is named below
  with its one-line meaning, but every value/period cell is blank — zero live data.

  Update owners: the daily sweep and the retro update these counts. The Factory Coach reads
  them and writes improvement tickets. Do not over-instrument; these are markdown counts,
  not a metrics platform.
-->

| Metric | Meaning | Value | Period |
|--------|---------|-------|--------|
| Throughput | tickets reaching Done per period | 0 | 2026-07-22 (8 tickets exist; 3 reached In Review, 0 reached Done — humans hold merge) |
| Cycle time | Ready for Dev -> Done, median | no data — 0 tickets have reached Done | 2026-07-22 |
| Lead time | Backlog -> Done, median | no data — clock starts 2026-07-22 | 2026-07-22 |
| WIP | average tickets in flight | 3 in In Review (at the limit of 3), 0 in In Development | 2026-07-22 |
| Blocked time | total/median time in Blocked | | |
| Rework rate | tickets bounced back a column (e.g. Review -> Development) | | |
| Gate pass rate | first-pass PASS at quality + security gates | 0/3 first-pass; 3/3 after 1 lint autofix each | 2026-07-22 (ABC-008, ABC-001, ABC-002 — all three failed lint on formatting/import order only) |
| Escaped defects | bugs found in UAT or prod that tests missed | | |
| Velocity | (scrum) size points per sprint | | |
