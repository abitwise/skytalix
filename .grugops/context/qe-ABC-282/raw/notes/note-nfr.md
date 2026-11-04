# qe-ABC-282 NFR-008, graded with twin arms: **H − B +0.020 s paired median wall, ≤ +0.10 s, MET.** H median 9.48 s [9.42, 9.55], 0.52 s under 10 s and below 9.6 s. Twin admissible. One round had a foreign vitest busy; without it the delta is the same

`raw/out/n8/`. `qe-ABC-283`'s form, ONE hold, 22:11:46Z to 22:16:05Z, 9 rounds, round 0 discarded, **n = 8 complete scored rounds**, k = 2. Every run exit 0: B 71 files / 2 684, H and H2 71 / 2 709, 0 skipped or failed. load1 1.90–4.15.

- **H:** wall median **9.48 s** [9.42, 9.55], max 10.01; CPU 32.41 s. **H2:** 9.48 s [9.41, 9.69]. **B:** 9.50 s [9.35, 9.58], max 9.83; CPU 32.25 s.
- **Budget (graded, fixed in the PREREG): paired H − B median +0.020 s** [−0.060, +0.100], positive 6 / 8. **≤ +0.10 s, MET.** The difference of the arm medians is −0.015 s.
- **Twin H2 − H:** CPU median −0.155 s = 0.48 % of H's CPU (limit 0.486 s), sign 4 / 8 at chance. **ADMISSIBLE.**
- **Against 10 s:** MET, 0.52 s headroom. **Against 9.6 s:** below. Below R-N8H-1's 9.5 s too, which is reported and moves nothing.
- **Foreign load (QE-282-d):** round 8's three rows show `vitest_busy_foreign` 2–3, and H's single 10.01 s is in it, so that one run is not an alone read. Sensitivity, rounds 1–7 (n = 7, not the graded form): H 9.45 s, B 9.48 s, paired +0.020 s. The grade does not rest on that round.
- The read cannot separate +0.02 from SE's +0.075 or +0.10: the interval's top is +0.100. It is under the bar, not far under it.
- `NFR-004`, `NFR-005`, `NFR-009`: A3 above; `level` byte-identical; no table added.
