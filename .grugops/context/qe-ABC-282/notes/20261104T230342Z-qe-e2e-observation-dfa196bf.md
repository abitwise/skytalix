---
id: 20261104T230342Z-qe-e2e-observation-dfa196bf
kind: observation
by: qe-e2e
at: 2026-11-04T23:03:42Z
verified_by: 
confidence: high: twin admissible, n = 8; medium on alone-ness, one round had a foreign vitest, sensitivity read
refs:
  - qe-ABC-282
  - grugops/ABC-282
  - grugops/qe-ABC-282
  - ABC-282
  - ABC-300
  - ABC-223
  - ABC-221
  - ABC-078
  - EPIC-011
  - EPIC-009
  - ADR-0071
  - A0
  - A1
  - A2
  - A3
  - A4
  - A5
  - A6
  - D12
  - F5
  - NFR-004
  - NFR-008
  - R-0071-1
  - R-281-a
  - QE-300-a
  - QE-282-a
  - QE-282-b
  - QE-282-c
  - QE-282-d
  - QE-282-e
  - QE-282-f
  - QE-282-g
  - QE-282-h
  - QE-282-i
  - QE-282-j
  - UAT
  - 04ebeb7e
  - 22931005
  - d235214c
  - src/engine.ts
  - src/uci-session.ts
  - src/engine.test.ts
  - src/uci-session.test.ts
  - qe-ABC-282/20261104T212617Z-qe-e2e-decision-416a183f
  - qe-ABC-282/20261104T213029Z-qe-e2e-decision-5833fc48
  - qe-ABC-282/20261104T213054Z-qe-e2e-observation-0680580d
  - se-ABC-282/20261104T211719Z-software-engineer-decision-988cd2cb
supersedes: 
seal: sha256:8ef76e2805dfd642f94b6dcaac5ac096c2dc144f8af52deb7be585c5f33879c7
---

# qe-ABC-282 NFR-008, graded with twin arms: **H − B +0.020 s paired median wall, ≤ +0.10 s, MET.** H median 9.48 s [9.42, 9.55], 0.52 s under 10 s and below 9.6 s. Twin admissible. One round had a foreign vitest busy; without it the delta is the same

`raw/out/n8/`. `qe-ABC-283`'s form, ONE hold, 22:11:46Z to 22:16:05Z, 9 rounds, round 0 discarded, **n = 8 complete scored rounds**, k = 2. Every run exit 0: B 71 files / 2 684, H and H2 71 / 2 709, 0 skipped or failed. load1 1.90–4.15.

- **H:** wall median **9.48 s** [9.42, 9.55], max 10.01; CPU 32.41 s. **H2:** 9.48 s [9.41, 9.69]. **B:** 9.50 s [9.35, 9.58], max 9.83; CPU 32.25 s.
- **Budget (graded, fixed in the PREREG): paired H − B median +0.020 s** [−0.060, +0.100], positive 6 / 8. **≤ +0.10 s, MET.** The difference of the arm medians is −0.015 s.
- **Twin H2 − H:** CPU median −0.155 s = 0.48 % of H's CPU (limit 0.486 s), sign 4 / 8 at chance. **ADMISSIBLE.**
- **Against 10 s:** MET, 0.52 s headroom. **Against 9.6 s:** below. Below R-N8H-1's 9.5 s too, which is reported and moves nothing.
- **Foreign load (QE-282-d):** round 8's three rows show `vitest_busy_foreign` 2–3, and H's single 10.01 s is in it, so that one run is not an alone read. Sensitivity, rounds 1–7 (n = 7, not the graded form): H 9.45 s, B 9.48 s, paired +0.020 s. The grade does not rest on that round.
- The read cannot separate +0.02 from SE's +0.075 or +0.10: the interval's top is +0.100. It is under the bar, not far under it.
- `NFR-004`, `NFR-005`, `NFR-009`: A3 above; `level` byte-identical; no table added.
