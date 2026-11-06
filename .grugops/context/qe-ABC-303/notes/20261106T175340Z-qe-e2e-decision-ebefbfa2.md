---
id: 20261106T175340Z-qe-e2e-decision-ebefbfa2
kind: decision
by: qe-e2e
at: 2026-11-06T17:53:40Z
verified_by: 
confidence: high: every bar read as sealed; the gain itself is not proved and is named as a gap
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
  - qe-ABC-303/20261106T171254Z-qe-e2e-observation-f0be43f8
  - qe-ABC-303/20261106T171431Z-qe-e2e-observation-2f8fccef
  - qe-ABC-303/20261106T175319Z-qe-e2e-observation-43c7fbb6
supersedes: 
seal: sha256:2fa04fa2edf20de547126ac795ed5d94355dd65bdd80233b48992301d0840fd7
---

# qe-ABC-303 VERDICT: **MET. PASS_WITH_GAPS, no blocking gap.** Every row of tables 1 and 2, C2′ 55.5 / 100, S′ 9.0 / 10 and the Levels lane are met on `bb0cc134` against `38914841`. This verdict signs UAT by the page and the 2026-10-22 delegation. Nothing is merged: the merge is the owner's

QE/E2E, task `qe-ABC-303`, under PREREG `…53858301`, addendum `…79bd6622`. Every row is read. None was re-played, and nothing was tuned.

| row | read | state | note |
|---|---|---|---|
| Table 1, S1–S7 | all as sealed | met | `…7141269d` |
| Table 2, P1–P5, P8 | all as sealed; P3 0.6039 / 0.8170 / 0.7509 / 0.8363; P4 +0.116; P5 3 072 | met | `…7141269d` |
| P6, `G6` | 0 of 5 rounds flagged; kiwipete median 10 ≥ 9, position-6 12 ≥ 12; every run ≥ 6 | met | `…397a7ec5` |
| P7, `NFR-008` | first read VOID, 8 of 8 flagged. The one re-read: 0 of 8 flagged, twin admissible, H 9.14 s, R 0.140 s, H − B −0.010 s | met | `…397a7ec5`, `…f0be43f8` |
| C2′ | 100 of 100, 47 / 36 / 17, 55.5 ≥ 50.0, 0 faults, 0 losses on time | MET | the games note |
| S′ at E 1 810 | 10 of 10, 9 / 1 / 0, 9.0 ≥ 3.0, 0 faults, 0 losses on time | MET | the games note |
| Levels deep lane | exit 0, 58 / 58 | MET | the games note |
| Table 3 | R1–R4, R6, R7 equal the figures on `0cc9afd1`. R5 0.9874 / 1.0492, mean 1.0183, beside 0.9921 / 1.0537, mean 1.0229. No verdict on these | reported | `…7141269d`, `…397a7ec5` |

No CF line fired: 0 candidate faults and 0 losses on time in C2′ and S′, and no Levels red.

**What follows, by the sealed lines; none of it is QE's to do.**
- **§ 7 (B4), before the merge:** `main` goes into the branch with no rewrite, and tables 1 and 2 are read again on the merged tree, with no games unless the stale rule fires. It did not fire at `main` `55996783` (addendum § 3). It is checked again at the merge.
- **B5, on MET and the merge:** `ADR-0072` and `ADR-0073` come into force, and the Architect's dated line names this ticket and this read.
- **`ABC-289`:** the merge starts its build, by the page.
- **`R-N8H-1`:** at m = 9.14 s the sealed marks read LOW, for the Orchestrator.

**The gaps, none blocking.**
1. **The gain is not proved.** +38.4 ± 63.0 spans 0, and the harness's own label is NEUTRAL. The bar is ≥ 50.0, and it is met. The credit is the bundle's (B5), with no per-part Elo.
2. **The read ran on a host that was not quiet.** W was dropped, so FL governed. Foreign vitest: C2′ 8 of 405 samples, S′ 70 of 138, Levels 34 of 191. Largest moves stayed at 105 ms and 505 ms, so nothing shows load reaching a move. How load moves a score stays `UNKNOWN - verify`, as `…a5dc0532` says. FL covers C2′ and S′. For Levels, § 6's "alone" was held as the lock's alone. No line voids a passing Levels run for load, and load can only work against a time-bound row.
3. **The premises stay overridden, not met** (`ADR-0072` L2's drift and audit rows, `ADR-0073` CH3), by the owner's word. This read does not change that.
4. **R2's hooks are the engineer's** (PREREG § 2). P4's margin stays thin at +0.116 against +0.10.
5. **My own faults, none in a figure.** C2′'s first launch hit a disk quota before any game (`…2f8fccef`). Two small wording slips are corrected in `…f0be43f8` and `…397a7ec5`. The addendum's clock of 40 minutes and its reading of "busy" were my fills of what § 6a left open, stated before any run. Neither decided anything: the first slot cleared in under 2 minutes, and P6 had no busy row and no named row in a run's window.
6. **Host limit, for later hops:** `/tmp` has a user quota that `df` does not show. A C2′ needs about 1.4 GB of it, and most of what fills it is not this hop's.
