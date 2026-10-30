---
id: 20261030T202320Z-qe-e2e-decision-2afef8bf
kind: decision
by: qe-e2e
at: 2026-10-30T20:23:20Z
verified_by: 
confidence: high: every bar from the sealed PREREG § 7; rows read from the committed records
refs:
  - qe-ABC-229
  - ABC-229
  - EPIC-010
  - ADR-0053
  - grugops/ABC-229
  - grugops/qe-ABC-229
  - e196a281
  - f6ff1c4a
  - b92a3394
  - Q-SET
  - A1
  - A2
  - A3
  - A4
  - A5
  - G1
  - G5
  - G6
  - G8
  - G9
  - G11
  - S-1
  - S-2
  - S-3
  - S-4
  - NFR-004
  - NFR-005
  - NFR-008
  - qe-ABC-229/20261030T162159Z-qe-e2e-decision-8ecd4ea6
supersedes: 
seal: sha256:6171a5abe7a163b6a1d9d8f5faf973b1a107a782cf1d6a269c72ec3d148abb7a
---

# qe-ABC-229 verdict: PASS_WITH_GAPS. A1–A5, the gates, G5, G8, G6 and S-1..S-4 MET; the gaps are non-blocking. This verdict signs UAT

QE/E2E, task `qe-ABC-229`, under the PREREG `20261030T162159Z-qe-e2e-decision-8ecd4ea6` § 7. Candidate `e196a281` (code `f6ff1c4a`, `main` `b92a3394` merged in); base `b92a3394`. A resumed QE run re-read the first run's records, did not re-run any timed read that had a record, and re-ran only the R smoke, whose first run was killed externally (VOID).

## Rows
| row | bar | read | result |
|---|---|---|---|
| A2 Q-SET | QP-1..QP-9 at the frozen values, in src and on the head build | 55 / 55 checks | MET |
| A1 door identity | QE spot-check, 0 rows differ, non-vacuous | 0 / 114 differ; head ≠ base on 40 / 76 | MET |
| List and value sweeps | 0 mismatches, non-vacuous | 0 / 516 518 nodes; 0 / 250 values | MET |
| Planted faults | the SE's three red as recorded | P2, P3, P5 red; QE1 and QE2 red too | MET |
| A3 | ≤ 1.2× | 1.019× / 1.000× | MET |
| Gates | lint, typecheck, build, `npm test` exit 0; 0 skips | all 0; 2 322 / 2 322; `No findings.` | MET |
| Deep lanes | each green | 16 / 16 | MET |
| G1 | ≥ 54 / 58 | 54 / 58 | MET |
| G5 | level 5 max ≤ 4 031 ms, every move ≤ 5 000 | max 4 001 ms | MET |
| G9 | levels, tools, data identical | identical | MET |
| G8 (NFR-008) | head median ≤ 10 s | head 9.90 s, base 9.90 s (+0.01 s) | MET, 0.10 s headroom |
| G6 (A4) | head median depth ≥ base per board, floor 6 | kiwipete 8 = 8, position-6 10 = 10, every run ≥ 8 | MET |
| G11 | reported | depth and move equal on 5 / 5 | reported |
| S-1 / S-2 | 0 candidate faults, 0 time losses in 20 games | 0 / 0 | MET |
| S-3 | D ≥ 3.0 / 10 | 4.5 (2/3/5) | MET |
| S-4 | R ≥ 3.0 / 10 | 9.0 (9/1/0) at 4 000 ms | MET |

## Findings and gaps
- **QE-229-a (MEDIUM, non-blocking for this ticket; route to the NFR-008 owner):** G8 has 0.10 s of headroom, and the base has used it up. The base median was already 9.90 s before this ticket added anything, and one base run and one head run each went over 10 s. `src/uci-session.test.ts` (`ABC-220`) takes about 2.0 s of test time per run. This ticket costs about 22 ms (`src/quiescence.test.ts`). The next ticket that adds default-lane time is likely to FAIL G8 for a cost it did not cause.
- **QE-229-b (LOW, host/method):** another project's vitest suite ran on this host during most of the R re-run (127 of 188 samples, games 2–10) and 25 of D's 220 samples. R's Tctl was median 78.44 °C, max 87.5 °C, with 8 samples above 85 °C. No thermal stop fired, and the clock fell 0.82 % (D 0.10 %). The PREREG rules keep both readings. The wait-clear gates only the start of a run, so "ALONE" is not guaranteed for the length of a 30-minute smoke on a shared host.
- **QE-229-c (INFO, process):** the first R run was killed from outside at 17:43:44Z, in game 1. It is VOID and was re-run once, ALONE, from the start. This was not a product fault.
- **QE-229-d (INFO, test strength):** QE's two planted faults (QE1, QE2) are caught in the default lane by a single list-shape row each. No Q-SET value row reds them. QE's sweep reds both on more than 150 000 nodes.
- **INFO:** the R reading (9/1/0, +381.7 ± nan) is recorded at 4 000 ms and is not pooled or compared. The undefined interval comes from 0 draws in 10 games.

## Verdict
**PASS_WITH_GAPS.** Every graded row of §§ 1–6 is MET, and the named gaps are non-blocking. Under Test note 2 and the 2026-10-22 ruling, this QE verdict signs UAT. The merge is a human's. QE merged nothing, pushed nothing, and edited no `src/`, `tools/` or `data/` file.
