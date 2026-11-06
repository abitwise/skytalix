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
