---
id: 20261021T071304Z-qe-e2e-observation-bc49c2fe
kind: observation
by: qe-e2e
at: 2026-10-21T07:13:04Z
verified_by: 
confidence: high (readout output verbatim); reading stands only under owner amendments; nothing estimated
refs:
  - ABC-177
  - NFR-008
  - R-174-1
  - QE-177-g
  - ADR-0046
  - A9
  - A10
  - A11
  - 20261021T065500Z-orchestrator-decision-31ab7d2d
  - 20261021T065000Z-orchestrator-decision-f8cd47ba
  - 20261021T055500Z-orchestrator-decision-b87c35b6
  - .grugops/queue/pending/qe-ABC-177-timing-3.md
  - .grugops/context/qe-ABC-177/probe/timing3/
  - .grugops/context/qe-ABC-177/probe/timing3/preregistration-timing3-addendum.txt
  - .grugops/context/qe-ABC-177/probe/timing3/readout-nfr008-174b.py
  - amends:20261021T071200Z-qe-e2e-observation-277060fc
supersedes: 
seal: sha256:86d47375e91d768fe6c42f5fb4f0afc246f5e16265522b07cf3e70baecfa0b9d
---

# `ABC-177` timing-3 under owner amendment 2 (`…31ab7d2d`, thermal kept and logged, ABC-177 only): **t3-r1 stands. H median wall 9.395 s. `NFR-008` MET, flagged "warm host (thermal ≥ 1 in 5/8 rounds)". A11's 9.2 s target is missed, so the O3 route fires**

This amends the readings in `20261021T071200Z-qe-e2e-observation-277060fc`. The stages, rows and runs are the same, and no new
stage was run. All figures are `readout-nfr008-174b.py`'s and lane174's own output in `probe/timing3/`. Nothing is estimated.

**Timing and disclosure.**
- `…31ab7d2d` (owner word about 06:55Z; commit `97ef5027` at 07:08:15Z) reached QE at about 07:09Z. That was after both
  stages had run and after the VOID grading was sealed (07:08:22Z).
- `timing3/preregistration-timing3-addendum.txt` (`2eec6b05558c`, 07:11Z) fixed the readout and the selection rule before
  174b ran (07:10:45Z).
- QE had already seen the per-run rows and lane174's all-round summary for t3-r1. The rule change is the owner's. The selection
  rule ("the lower H median wall stands") was registered at 06:38:58Z.

**Instrument.** `timing3/readout-nfr008-174b.py` (`464d97c6fa2e`) is `timing2/readout-nfr008-174a.py` with one rule change:
the thermal discard is logged, not discarded. It adds per-row thermal and the warm-round count. Status, counts, n = 8, k, R,
A1 admissibility, load1 ≤ 8 and the 10 s bound are unchanged.

## 174b on both stages (`t3-r*/readout-nfr008-full-b.out`)
| | t3-r1 | t3-r2 |
|---|---|---|
| scored | 8 [1–8] | 8 [1–8] |
| warm host | **thermal ≥ 1 in 5/8 rounds** [4–8] | thermal ≥ 1 in 8/8 rounds |
| H median wall | **9.395 s** (range 9.06–9.55); H2 9.410 s | 11.050 s (range 10.12–13.04); H2 10.740 s |
| H/H2 twin, wall | median +0.100 s, sign +5/−3, p 0.727, **R 0.250 s** | median −0.140 s, R 1.030 s |
| H median CPU | 26.915 s; H2 26.895 s | 31.510 s; H2 30.955 s |
| H/H2 twin, CPU | median +0.340 s, sign +6/−2, p 0.289, R 0.600 s | median −0.390 s, p 1.000, R 2.750 s |
| A1 admissible | **True** (0.340 s ≤ 0.404 s, 1.5 % of H CPU) | True (0.390 s ≤ 0.473 s) |
| load1 before scored runs | 3.75–7.28, all ≤ 8 | 5.40–9.09, **not all ≤ 8** |
| A9 STATE at 10 s wall | **MET** (wall median 9.39 s, R 0.25 s) | **NOT APPLICABLE** (load1 > 8 on a scored run) |

**Selection (registered).** A stage "reads" with a state of MET, NOT MET or UNRESOLVED. t3-r2 does not read (NOT APPLICABLE),
so **t3-r1 stands with its whole readout set.**

**The strict view stays VOID** on both stages: the registered `readout-nfr008-174.py` and the timing-2 `174a`. The t3-r1
reading stands only under the owner amendments `…b87c35b6`, `…f8cd47ba` and `…31ab7d2d`.

## t3-r1, lane174's own summary (rounds 1–8, n = 8, k = 2; this now matches the kept-thermal rule)
- B: CPU 30.59 s, wall 10.93 s. T: CPU 29.93 s, wall 10.83 s. H: CPU 26.91 s, wall 9.39 s. 59 files and 1987 tests each; load1 > 8 on 0/8.
- **H−B wall median −1.620 s, interval [−1.710, −1.540]**, sign 0/8.
- **H−B CPU median −3.605 s (−11.79 % of base), interval [−3.810, −3.390]**, sign 0/8.
- **B/T twin R: CPU 0.900 s, wall 0.280 s.** T−B CPU median −0.470 s (**−1.54 % of base**), sign 1/8. T−B wall median
  −0.070 s, sign 2/8.
  - lane174's admissibility line is "twin CPU median ≤ 1.5 % of base with sign at chance" (`ADR-0035` d1). The B/T CPU
    median is **1.54 %, above 1.5 %**, so the B/T twin fails that bound by 0.04 percentage points.
  - This bears on (ii), the H−B attribution. It does not bear on `NFR-008`, which reads from the admissible H/H2 twin.
  - The H−B wall delta (−1.62 s) is about 6 × the B/T wall R (0.28 s).

## Grades (the standing stage, t3-r1)
| crit | grade |
|---|---|
| A9 | **MET under the owner amendments.** `npm test` as spelled; B/T and H/H2, each with its own `npm ci`; load1 3.75–7.28 on every scored run; AC before and after all 32 scored runs (`speed_limit` "none"); n 8, k 2, round 0 discarded; `R-173-1/-2` not read. Deviations, all under owner word: the window had 20/181 foreign polls (single-file run; `…b87c35b6`/`…f8cd47ba` log them); the grading readout is `174b`, not `readout-nfr008-174.py` (`…31ab7d2d`); the strict view is VOID |
| A10 | **MET, flagged warm (5/8).** (i) H median wall 9.395 s → `NFR-008` MET; (ii) H−B wall −1.620 s [−1.710, −1.540] and CPU −3.605 s [−3.810, −3.390]; (iii) B/T twin R CPU 0.900 s / wall 0.280 s (B/T 1.54 % > 1.5 %, flagged), H/H2 twin R CPU 0.600 s / wall 0.250 s |
| A11 | **Target NOT MET: 9.395 s > 9.2 s and ≤ 10 s → the O3 route** (see the O3 note). Per the ticket, `NFR-008` is MET and `ABC-177` may close on its other criteria. Architect/Design re-opens with O3 for a BA/PM ruling, as tranche 2 under a new ticket |

## `NFR-008` and `R-174-1`
- **`NFR-008` on `f81bf03c`: MET, 9.395 s** (R 0.25 s, load1 ≤ 8, AC). It is flagged "warm host (thermal ≥ 1 in 5/8
  rounds)" and foreign-window-logged, under an ABC-177-only rule.
  - This replaces `QE-174-b`'s NOT MET (10.010 s) as the latest reading.
  - It is not comparable as a thermal-0 reading: `QE-174-b` was thermal 0.
- **`R-174-1`: the discharge condition is MET** (A10 (i), ≤ 10 s). QE does not discharge it: Security/NFR rules. `…31ab7d2d`
  calls the thermal rule "not a catalog/NFR-008 rule change; no precedent".
