# qe-ABC-307 A9, the re-read: it STANDS. No round flagged, 8 of 8 complete, twin admissible. H median 9.085 s, H − B −0.350 s wall and −1.065 s CPU

QE/E2E, task `qe-ABC-307`, under PREREG `…01f729cb`, which is `…da060cef`'s one re-read under `…f5dc2987`. Raw: `raw/n8-r5/`.

**The slot.** Clock from the PREREG's commit `e74d2e11`, 21:41:24Z. Launch 21:41:29Z. Five clear samples on the first try, 21:41:44Z, 20 s into the 15-minute clock.

**The hold.** 21:41:44Z to 21:45:55Z, 251 s. 9 rounds, 8 complete scored rounds, all 27 runs exit 0 at 71 files and 2 709 passed, 0 skipped, 0 failed. No output file empty, 81 of 81. All 27 `last-run.json` copies carry distinct start times, so none is a stale file from read 3.

**Foreign load (`flags.py`).** 84 samples, 0 naming a foreign vitest. **Flagged rounds: none.** `foreign_cpu_s` over scored runs: median 2.90 s, min 2.27 s, max 3.83 s, under the 7.90 s flag line. load1 rose to 4.16 at most, under the bar of 8. No foreign vitest before or after any run.

**Void line.** 0 of 8 flagged, twin ADMISSIBLE, 8 complete rounds: the read **STANDS**. `a9-sens.py` over all 8 rounds gives the same figures, since nothing was dropped.

| arm | wall median | interval (k = 2) | max | CPU median |
|---|---|---|---|---|
| B | 9.460 s | 9.32 to 9.52 s | 9.56 s | 32.07 s |
| H | **9.085 s** | 9.02 to 9.17 s | 9.17 s | 30.96 s |
| H2 | 9.165 s | 9.04 to 9.25 s | 9.25 s | 31.20 s |

- **H − B wall:** paired median **−0.350 s**, interval −0.500 to −0.220 s, positive 0 of 8. Difference of the arm medians −0.375 s.
- **H − B CPU:** paired median **−1.065 s**, interval −1.580 to −0.410 s, positive 0 of 8.
- **Twin H2 − H:** CPU median +0.255 s, 0.82 % of H's CPU against a limit of 0.464 s, sign 5 of 8 at chance, n = 8: **ADMISSIBLE**, R 1.020 s CPU. Wall median +0.090 s, R 0.210 s, positive 6 of 8.
- **State line:** `NFR-008 MET, graded`. Neither trigger: H is under 9.6 s and 9.5 s.
- **Target H − B ≤ −0.215 s:** met by 0.135 s.
- **Marks:** 0.915 s under 10 s, 0.515 s under 9.6 s, 0.415 s under 9.5 s. `…b9038a14`'s rule on H's median: **G-GO**, a figure for the Orchestrator's routing.
- `n8-grade.py`'s "BUDGET" line is another ticket's and is not read, as the PREREG says.

**How close the target is.** One figure outside the PREREG, and it decides nothing: H2 − B wall, paired median −0.295 s, range −0.42 to −0.16 s. The margin of 0.135 s is smaller than the twin's wall R of 0.210 s, and the interval's upper end clears the target by 0.005 s. One of the 8 H − B deltas sits above −0.215 s, at −0.16 s (`raw/n8-r5/grade.out`). The direction is not in doubt (0 of 8 positive, wall and CPU). The size past −0.215 s is less firm than the median alone reads.
