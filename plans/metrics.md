# Metrics
_Updated: 2026-07-23 (ABC-007 gate green → In Review; nonstop ABC-004..007 batch COMPLETE, EPIC-001 rule-complete)_

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
| Throughput | tickets reaching Done per period | 4 done + 4 In Review awaiting one human merge | 2026-07-23 (ABC-008/001/002/003 merged to main; ABC-004/005/006/007 gate-green In Review, EPIC-001 rule-complete) |
| Cycle time | Ready for Dev -> Done, median | ~1 day — all 3 were cut, built, and merged across 2026-07-22..23 | 2026-07-23 |
| Lead time | Backlog -> Done, median | no data — clock starts 2026-07-22 | 2026-07-22 |
| WIP | average tickets in flight | 4 — ABC-004/005/006/007 all In Review (autonomy=pr, no merge); In Review 4/3 under the pre-authorized batch WIP-override (one stacked review unit, single human merge clears it) | 2026-07-23 |
| Blocked time | total/median time in Blocked | | |
| Rework rate | tickets bounced back a column (e.g. Review -> Development) | | |
| Gate pass rate | first-pass PASS at quality + security gates | 0/8 first-pass; 8/8 after ≤1 self-fix round each. ABC-008/001/002 lint; ABC-003 typecheck+build; ABC-004 unit-test correction + lint autofix; ABC-005 lint; ABC-006 lint autofix + deep-suite timeout (counts correct); ABC-007 lint autofix only — green after 1 round. All self-fixes were gate-mechanical (format/timeout/test-assertion), never a weakened production path | 2026-07-23 |
| Escaped defects | bugs found in UAT or prod that tests missed | | |
| Velocity | (scrum) size points per sprint | | |
