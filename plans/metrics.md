# Metrics
_Updated: 2026-07-30 (EPIC-002 decomposed into ABC-012..ABC-019; throughput counts creation, not completion — nothing new reached Done)_

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
| Throughput | tickets reaching Done per period | 8 done (ABC-001..008, all merged to main) · **0 reached Done since 2026-07-24** | 2026-07-30 (EPIC-002 decomposed: 8 tickets created, 23 points, none started. Creation is not throughput — the number above deliberately does not move) |
| Cycle time | Ready for Dev -> Done, median | ~1 day — all 3 were cut, built, and merged across 2026-07-22..23 | 2026-07-23 |
| Lead time | Backlog -> Done, median | no data — clock starts 2026-07-22 | 2026-07-22 |
| WIP | average tickets in flight | 0 in flight — nothing is past Ready. Ready 3/8 (ABC-011, ABC-012, ABC-014); no WIP limit approached and no override taken | 2026-07-30 |
| Blocked time | total/median time in Blocked | 1 ticket entered Blocked 2026-07-30 — ABC-013, waiting on ADR-0004's ratification by a named human. `blocked_escalation_days` is 2, so it escalates on 2026-08-01 if unratified. **First use of the Blocked column in this project.** | 2026-07-30 |
| Rework rate | tickets bounced back a column (e.g. Review -> Development) | | |
| Gate pass rate | first-pass PASS at quality + security gates | 0/8 first-pass; 8/8 after ≤1 self-fix round each. ABC-008/001/002 lint; ABC-003 typecheck+build; ABC-004 unit-test correction + lint autofix; ABC-005 lint; ABC-006 lint autofix + deep-suite timeout (counts correct); ABC-007 lint autofix only — green after 1 round. All self-fixes were gate-mechanical (format/timeout/test-assertion), never a weakened production path | 2026-07-23 |
| Escaped defects | bugs found in UAT or prod that tests missed | | |
| Velocity | (scrum) size points per sprint | | |
