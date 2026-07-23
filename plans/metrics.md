# Metrics
_Updated: 2026-07-23 (ABC-004 gate green → In Review; nonstop ABC-004..007 batch in flight)_

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
| WIP | average tickets in flight | 1 — ABC-004 in In Review (autonomy=pr, no merge); ABC-005..007 to follow in the same batch | 2026-07-23 |
| Blocked time | total/median time in Blocked | | |
| Rework rate | tickets bounced back a column (e.g. Review -> Development) | | |
| Gate pass rate | first-pass PASS at quality + security gates | 0/5 first-pass; 5/5 after 1 self-fix round each. ABC-008/001/002 failed lint (formatting/imports); ABC-003 failed typecheck+build on a test-only noUncheckedIndexedAccess; ABC-004 needed a unit-test correction (mis-asserted attack case) + lint safe-autofix — green after 1 round | 2026-07-23 |
| Escaped defects | bugs found in UAT or prod that tests missed | | |
| Velocity | (scrum) size points per sprint | | |
