---
id: 20261106T171254Z-qe-e2e-observation-f0be43f8
kind: observation
by: qe-e2e
at: 2026-11-06T17:12:54Z
verified_by: 
confidence: high: flags before grade as sealed, the grader unchanged, 0 foreign samples
refs:
  - qe-ABC-303
  - grugops/ABC-303
  - grugops/qe-ABC-303
  - ABC-303
  - ABC-286
  - ABC-288
  - EPIC-011
  - ADR-0056
  - ADR-0072
  - ADR-0073
  - ADR-0046
  - R-BUNDLE-1
  - PREREG
  - C2-prime
  - S-prime
  - G1
  - G2
  - G6
  - NFR-005
  - NFR-008
  - NFR-009
  - R-CEN-1
  - bb0cc134
  - 63667fc8
  - 38914841
  - arch-owner-answers-1104b/20261104T220311Z-architect-design-decision-d776c0f0
  - arch-bundle-1/20261104T201203Z-architect-design-decision-aa5c4dc1
  - orch-2026-10-30a/20261104T215525Z-orchestrator-decision-3e73f9f9
  - orch-2026-10-30a/20261105T215707Z-orchestrator-decision-43e6d8fd
  - se-ABC-303-main/20261105T122839Z-software-engineer-observation-bd60978c
  - se-ABC-303-main2/20261106T134724Z-software-engineer-observation-e6cff498
  - secnfr-census-1105/20261105T115526Z-security-nfr-decision-b9038a14
  - qe-ABC-303/20261106T135702Z-qe-e2e-decision-53858301
  - qe-ABC-282/20261104T230342Z-qe-e2e-observation-b4427cbd
  - qe-ABC-303/20261106T140659Z-qe-e2e-decision-b59650bc
  - orch-2026-10-30a/20261106T164759Z-orchestrator-decision-318c9e3b
  - arch-ABC-303-load/20261106T141500Z-architect-design-decision-a5dc0532
  - FL
  - 55996783
  - qe-ABC-303/20261106T165315Z-qe-e2e-decision-79bd6622
  - qe-ABC-303/20261106T170749Z-qe-e2e-observation-397a7ec5
supersedes: 
seal: sha256:682f47a49985c1b0c3f1b437fc4b54bc9434c7e1ef722a925e376c825a4ca9a7
---

# qe-ABC-303 Stage A's re-read: **P7, `NFR-008`, stands and is MET: 0 of 8 rounds flagged, twin admissible, H 9.14 s, H − B −0.010 s.** With P6 met, table 2 is whole and the games may start

QE/E2E, task `qe-ABC-303`, addendum `…79bd6622`, re-read named in `…397a7ec5`. The slot cleared at 17:08:12Z on the first try. One hold, to 17:12:20Z. `flags.py` read first, then the grade. Raw: `raw/out/stage-a2/`.

- **Flags:** 0 of 8 rounds; 0 of 83 samples name a foreign vitest; `foreign_cpu_s` median 2.96, at most 4.01; largest load1 4.32, the arms' own.
- **Counts:** all 27 runs exit 0, B 71 files, 2 710 passed, H and H2 71 files, 2 734 passed, 0 skipped, 0 failed. 8 complete scored rounds in 9.
- **Twin:** admissible, |H2 − H CPU median| 0.365 s, 1.16 % of H's 31.38 s against a limit of 0.471 s; sign 2 of 8, at chance; n = 8.
- **H:** median wall 9.14 s, interval [9.03, 9.28], max 9.38, ≤ 10 s. Wall R 0.140 s, ≤ 10 s. B 9.12 s.
- **Budget:** paired H − B median wall **−0.010 s**, bar ≤ +0.10 s. Interval [−0.070, +0.150]. CPU +0.320 s, reported. Difference of the arm medians +0.020 s, reported.
- **Marks:** under 9.5 s and 9.6 s, 0.86 s under 10 s. By `…b9038a14`'s marks, 9.0 < m < 9.5 s is LOW on `R-N8H-1`, for the Orchestrator.

**State of table 2:** P1 to P5 and P8 met (`…7141269d`), P6 met (`…397a7ec5`), P7 met here. Table 1 met. No STOP fired. Stage B starts now.

**One correction to `…397a7ec5`, no line moved.** It says the first foreign row came "about a second into the hold". The first row sampled by `fsample.sh` is 16:54:47Z, 6 s in, and the first run count showing it is 16:54:51Z.
