# qe-ABC-274 verdict: **PASS_WITH_GAPS** (none blocking; one LOW, three INFO). A1 node identity 11 / 11 and cross-build 0 / 9 120; A2 0 / 4 840 290 `Object.is`; A3 15 / 15 with Q1–Q4 met; A4 green; **A5 `G2` MET, R = 0.9897** (0.9797 / 0.9997, control 0.9982 / 1.0001); **A6 `G6` MET** (9 × 5 / 10 × 5, medians = base); A7 2 588 / 2 588 and the deep lanes equal to base; A8 clean; A9 inside int16; S1–S3 green. Under the owner's delegation this verdict signs UAT for `ABC-274` on `grugops/ABC-274`. The merge is the humans', and it waits on the owner's "accept ADR-0067"

QE/E2E, task `qe-ABC-274`, 2026-11-03 13:53Z–14:30Z. The timing (A5, A6) was taken in an ALONE window, 14:05Z–14:13Z. Every test, build and engine run was under `flock host-test.lock`, one at a time. No `src/` edit; the mutants were on a scratch copy. Nothing pushed, merged or left running.

## Rows
| row | bar | read | result |
|---|---|---|---|
| A1 B0 | 11 counts exact against the pre-ticket head | 11 / 11 (one process, on the repair head) | **MET** |
| A1 cross-build | 0 mismatches on the 190 | 0 / 9 120 (8 360 door rows) | **MET** |
| A2 | 0 `Object.is` misses | 0 / 4 840 290 (62 055 FENs × mirror; the ticket's corpora plus random play and extremes) | **MET** |
| A3 | every family's offset blended exactly | 15 / 15; Q1–Q4 met; mutant M1 caught by A3 alone | **MET** |
| A4 | `G3` mirror; purity | green; mirror 0 / 62 055 | **MET** |
| A5 `G2` | R ≤ 1.0500, mean of two sessions | 0.9797, 0.9997 → **0.9897**; c 0.9982 / 1.0001 | **MET** |
| A6 `G6` | median ≥ base, every run ≥ 6 | head 9 × 5 / 10 × 5; base the same; WARN 0 | **MET** |
| A7 | no row moves; lanes pass | 2 588 / 2 588; 0 expectations moved; deep lanes = base (taper +22 added) | **MET** |
| A8 | no games; no budget / clock / env read | none played; clean | **MET** |
| A9 | Σ mg, Σ eg inside int16 | 15 910 / 17 510 | **MET** |
| S1–S3 | seam conditions | present, green | **MET** |
| S2 nps | report only | H / B 0.977–1.002 ns per node | reported |
| carry-over | `c131ecd0` → repair = the seam body plus tests | holds (A1, A2, A5 and A6 were also read on the repair head) | met |

Falsifier F8: (a) does not fire (0 mismatches, 0 moved); (b) does not fire (0.9897 ≤ 1.0500); (c) does not fire (medians equal, every run ≥ 9).

## Board move
`In Review` → UAT signed by this verdict. The column move is the Orchestrator's. The merge is human and waits on the owner's "accept ADR-0067" (reading (b)). On merge, `ABC-239`'s A3 / A4 hold as written (`ADR-0067` d8).

## Notes in this task
PREREG `…4b732a08` (sealed and committed at `25dc5b1e` before any timing); A5 / S2, A6, A1 / A2, verification, gaps, and this verdict, sealed together after the last run.
