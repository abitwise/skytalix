# Metrics
_Updated: 2026-07-23 (ABC-006 gate green → In Review, RISK-001 retired; nonstop ABC-004..007 batch in flight)_

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
| WIP | average tickets in flight | 3 — ABC-004, ABC-005, ABC-006 in In Review (autonomy=pr, no merge); ABC-007 to follow (will overflow In Review to 4/3 under the pre-authorized batch WIP-override) | 2026-07-23 |
| Blocked time | total/median time in Blocked | | |
| Rework rate | tickets bounced back a column (e.g. Review -> Development) | | |
| Gate pass rate | first-pass PASS at quality + security gates | 0/7 first-pass; 7/7 after ≤1 self-fix round each. ABC-008/001/002 failed lint; ABC-003 typecheck+build; ABC-004 unit-test correction + lint autofix; ABC-005 lint (format + unused import); ABC-006 lint autofix + deep-suite per-test timeout (counts were correct — vitest timeout, not a wrong value), green after 1 round | 2026-07-23 |
| Escaped defects | bugs found in UAT or prod that tests missed | | |
| Velocity | (scrum) size points per sprint | | |
