---
id: 20261104T041512Z-qe-e2e-observation-c7e298cd
kind: observation
by: qe-e2e
at: 2026-11-04T04:15:12Z
verified_by: 
confidence: high: 27 runs in one lock hold, ALONE, counts asserted on every run, readout script fixed by sha256 in the PREREG
refs:
  - qe-ABC-281
  - ABC-281
  - EPIC-011
  - ADR-0046
  - ADR-0050
  - ADR-0035
  - ADR-0032
  - NFR-008
  - R-N8H-1
  - R-281-a
  - Q-N8H-1
  - QE-208-a
  - QE-208-c
  - QE-087-d
  - ABC-230
  - ABC-087
  - src/search.null-move.test.ts
  - src/engine.test.ts
  - src/levels.test.ts
  - AGENTS.md
  - se-ABC-281/20261104T034410Z-software-engineer-decision-82caa3b2
  - se-ABC-281/20261104T034410Z-software-engineer-observation-7fafddb2
  - se-ABC-281/20261104T034427Z-software-engineer-observation-4e6d364a
  - arch-ABC-281/20261104T032140Z-architect-design-decision-d7b2b02b
  - arch-ABC-281/20261104T032140Z-architect-design-observation-e969c2f0
  - grugops/ABC-281
  - 748d4fa3
  - ea08d7b6
  - 9a8d7493
  - qe-ABC-281/20261104T035245Z-qe-e2e-decision-b3d88219
  - fb2a0ee5
  - secnfr-nfr008-headroom/20261104T025651Z-security-nfr-observation-f925027f
  - UAT
supersedes: 
seal: sha256:61667adc9e76ae4263e7d40a7150755cd1e21491d321e05f05912ba4ea0302c9
---

# qe-ABC-281 A8 (`NFR-008`, graded, B / H / H2 twin) under PREREG `…b3d88219`: **MET, graded.** H median **9.42 s** wall [9.33, 9.51], n 8; H − B **−0.37 s** wall (0 of 8 rounds positive), −0.78 s CPU; twin admissible (+0.51 % CPU, R 0.07 s wall). Below the 9.6 s `Q-N8H-1` trigger

QE/E2E, task `qe-ABC-281`. The PREREG `…b3d88219` was sealed and committed (`fb2a0ee5`) before the first run. Scripts `raw/a8.sh` and `raw/a8-grade.py` match the PREREG's sha256. Raw: `raw/a8/a8.tsv` (27 runs), `raw/a8/grade.out`.

## Conditions
- **ALONE:** one `flock <scratch>/host-test.lock` hold, 03:53:00Z–03:57:20Z, with nothing else in it. The lock was free on arrival (acquired the same second).
- Before every run there were 0 foreign `vitest run` processes and 0 busy (> 1 % CPU) vitest-named processes. The only vitest-named process on the host was a foreign idle daemon at 0.0 % CPU.
- load1 before scored runs was **1.29–3.42** (≤ 8 on every run, no wait). `/sys/class/power_supply` has no entry (no battery, so AC holds trivially), logged per run.
- Arms: B = `748d4fa3`, H = `ea08d7b6`, and **H2 = an identity twin of H**: its own copy, `diff -r` clean, sha256 over 11 819 files. All three are out of tree, with `.grugops/context/*/raw/` left out (no test reads it) and a borrowed `node_modules`. `npm test` as spelled; Node v26.12.1, vitest 4.1.12.
- **27 runs, all exit 0, each 69 files / 2 650 passed / 0 skipped / 0 failed.** 9 rounds; round 0 discarded; **8 complete scored rounds**; order rotated (B H H2 / H H2 B / H2 B H).

## Readings (k = 2 at n = 8, `ADR-0035` D1)
| arm | wall median | interval [x(2), x(7)] | max | CPU median |
|---|---|---|---|---|
| B (base) | 9.90 s | [9.74, 9.93] | 9.99 s | 32.60 s |
| **H (tip)** | **9.42 s** | **[9.33, 9.51]** | 9.63 s | 31.31 s |
| H2 (twin) | 9.47 s | [9.35, 9.55] | 9.62 s | 31.62 s |

- **H − B, per round:** wall median **−0.370 s**, interval [−0.600, −0.280], 0 of 8 positive. CPU median **−0.780 s**, interval [−1.380, −0.620], 0 of 8 positive.
- **Twin, H2 − H per round:** CPU median +0.160 s = **0.51 %** of H's 31.31 s (limit 1.5 % = 0.470 s), 7 of 8 positive, **R 0.340 s**. Wall median +0.040 s, 6 of 8 positive, **R 0.070 s**.
- **Admissible** under the pre-registered rule: |median| ≤ 1.5 %, and the sign is not all one way. The CPU sign, 7 of 8, is the edge of chance (two-sided binomial p ≈ 0.07). One likely cause is order: H runs just before H2 in two of the three rotations. The median is a third of the limit, so the grade does not depend on that sign.

## Routing
- Admissible, H median 9.42 s ≤ 10 s, and wall R 0.07 s ≤ 10 s, so **`NFR-008` is MET, graded** (`ADR-0035` D1).
- **Not ≥ 9.6 s:** the Orchestrator's `Q-N8H-1` trigger is not met. Two single runs read above 9.6 s (H 9.63 s, H2 9.62 s, both in round 8). The trigger is on the median, so this is reported, not routed.
- **Against the forecast:** the Architect forecast about −0.36 s and 9.4–9.55 s. QE read −0.37 s and 9.42 s. Headroom on H's median is **0.58 s**, against 0.10–0.23 s at `main` (`…f925027f`). That is larger than the 0.3–0.5 s window spread, but only by about 0.1–0.3 s.
- In the same window, B read 9.90 s, matching Security/NFR's 9.90 s session P on the same `src/` tree.
- **A9 is Security/NFR's:** this reading is what `R-N8H-1`'s state is ruled on.
