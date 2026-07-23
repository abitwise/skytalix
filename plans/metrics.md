# Metrics
_Updated: 2026-07-23_

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
| Throughput | tickets reaching Done per period | 4 | 2026-07-23 (ABC-008, ABC-001, ABC-002, ABC-003 merged to main; 8 tickets exist) |
| Cycle time | Ready for Dev -> Done, median | ~1 day — all 3 were cut, built, and merged across 2026-07-22..23 | 2026-07-23 |
| Lead time | Backlog -> Done, median | no data — clock starts 2026-07-22 | 2026-07-22 |
| WIP | average tickets in flight | 0 — ABC-003 merged to main and moved to Done; Ready empty pending ABC-004 promotion | 2026-07-23 |
| Blocked time | total/median time in Blocked | | |
| Rework rate | tickets bounced back a column (e.g. Review -> Development) | | |
| Gate pass rate | first-pass PASS at quality + security gates | 0/4 first-pass; 4/4 after 1 self-fix round each. ABC-008/001/002 failed lint (formatting/imports); ABC-003 passed lint first-pass but failed typecheck+build on a test-only noUncheckedIndexedAccess, green after 1 self-fix | 2026-07-23 |
| Escaped defects | bugs found in UAT or prod that tests missed | | |
| Velocity | (scrum) size points per sprint | | |
