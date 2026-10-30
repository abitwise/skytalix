<!-- GENERATED — do not hand-edit. Re-run: node scripts/context-io.js render <task> -->
# Context: qe-ABC-229

## Current state

| at | kind | by | confidence | verified_by | note |
| --- | --- | --- | --- | --- | --- |
| 2026-10-30T16:21:59Z | decision | qe-e2e | high: written before any timed read, value read on the delivered build, or game; bars copied from ABC-229 A1-A5 (RE-SCORED 2026-10-30), ADR-0053 d5-d10 and EPIC-010 § The merge rule |  | # qe-ABC-229 PREREG: the Q-SET gate, QE's own breaking reads, the gates (G8 first), graded G6 at 4 000 ms on both sides, G5, G11, then the A5 smoke pair. Sealed before any timed read, value read or game |
| 2026-10-30T20:23:20Z | decision | qe-e2e | high: every bar from the sealed PREREG § 7; rows read from the committed records |  | # qe-ABC-229 verdict: PASS_WITH_GAPS. A1–A5, the gates, G5, G8, G6 and S-1..S-4 MET; the gaps are non-blocking. This verdict signs UAT |
| 2026-10-30T20:23:20Z | observation | qe-e2e | high: read from the committed raw records under .grugops/context/qe-ABC-229/raw/; an observation, because no §14-gate verdict stamps this run |  | # qe-ABC-229 gates and timing: lint, typecheck, build, npm test 2 322/2 322, 16/16 deep lanes, G1 54/58, A3 1.019×/1.000×, G5 4 001 ms, G9 identical, G8 head 9.90 s (base 9.90 s, MET with 0.10 s headroom), G6 MET at 4 000 ms (8 = 8, 10 = 10), G11 5/5 |
| 2026-10-30T20:23:20Z | observation | qe-e2e | high: read from the committed raw records under .grugops/context/qe-ABC-229/raw/; an observation, because no §14-gate verdict stamps this run |  | # qe-ABC-229: the Q-SET gate and QE's own breaking reads (no clock). Q-SET 55/55, A1 spot 0 of 114 differ, list sweep 0 of 516 518 nodes wrong, value sweep 0 of 250 wrong, all five planted faults red |
| 2026-10-30T20:23:20Z | observation | qe-e2e | high: a pointer to files committed on the QE branch (an observation: an artifact-ref needs §14-gate provenance this run does not have) |  | # qe-ABC-229 artifacts: where the records are |
| 2026-10-30T20:23:20Z | observation | qe-e2e | high: read from the committed raw records under .grugops/context/qe-ABC-229/raw/; an observation, because no §14-gate verdict stamps this run |  | # qe-ABC-229 A5 smokes, ALONE at width 1: D 2/3/5 = 4.5 / 10, R 9/1/0 = 9.0 / 10 at 4 000 ms (recorded, not pooled). S-1..S-4 MET. The first R run was killed externally in game 1 (VOID) and re-run once |
