# Metrics
_Updated: 2026-07-31 (ABC-020 + ABC-021 cut under the owner's legality-first directive; ABC-009 escalated P2→P1 and promoted. Throughput still counts completion, not creation — nothing new reached Done, and the number below still does not move)_

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
| Throughput | tickets reaching Done per period | 8 done (ABC-001..008, all merged to main) · **0 reached Done since 2026-07-24 — seven days** | 2026-07-31 (2 more tickets created: ABC-020, ABC-021. Open ticket count is now 13 against 8 ever completed. Creation is not throughput and the number to the left deliberately does not move — but a backlog growing at 10 tickets in two days with a delivery rate of zero is the thing this row exists to make visible) |
| Cycle time | Ready for Dev -> Done, median | ~1 day — all 3 were cut, built, and merged across 2026-07-22..23 | 2026-07-23 |
| Lead time | Backlog -> Done, median | no data — clock starts 2026-07-22 | 2026-07-22 |
| WIP | average tickets in flight | 0 in flight — nothing is past Ready, on day 9. Ready **6/8** (ABC-009, ABC-011, ABC-012, ABC-013, ABC-014, ABC-020); no WIP limit approached and no override taken. **Ready has grown 3 → 4 → 6 in two days while In Development stayed at 0**, which is worth naming rather than only recording: Ready is a buffer feeding In Development (WIP 3), and a buffer that fills while the column it feeds is empty is a queue, not a pipeline. Every promotion was individually justified (each ticket has no unbuilt dependency), so no single one was wrong; the trend is the signal | 2026-07-31 |
| Blocked time | total/median time in Blocked | **1 ticket, 1 day, resolved — total and median both 1 day.** ABC-013 entered Blocked 2026-07-30 waiting on ADR-0004's ratification and left it 2026-07-31 when the ADR was ratified, against `blocked_escalation_days: 2` — **it never escalated**. First entry to and first exit from the Blocked column in this project's history; the column is empty again and the convention worked exactly as written. *(This row previously read "escalates on 2026-08-01 if unratified" — that contingency did not occur.)* Note for the record: that ratification was made by the Orchestrator under a named, quoted delegation from Olger Oeselg, not by a human directly, and it is explicitly not precedent | 2026-07-31 |
| Rework rate | tickets bounced back a column (e.g. Review -> Development) | | |
| Gate pass rate | first-pass PASS at quality + security gates | 0/8 first-pass; 8/8 after ≤1 self-fix round each. ABC-008/001/002 lint; ABC-003 typecheck+build; ABC-004 unit-test correction + lint autofix; ABC-005 lint; ABC-006 lint autofix + deep-suite timeout (counts correct); ABC-007 lint autofix only — green after 1 round. All self-fixes were gate-mechanical (format/timeout/test-assertion), never a weakened production path | 2026-07-23 |
| Escaped defects | bugs found in UAT or prod that tests missed | | |
| Velocity | (scrum) size points per sprint | | |
