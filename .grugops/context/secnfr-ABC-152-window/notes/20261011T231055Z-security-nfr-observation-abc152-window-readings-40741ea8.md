---
id: 20261011T231055Z-security-nfr-observation-abc152-window-readings-40741ea8
kind: observation
by: security-nfr
at: 2026-10-11T23:10:55Z
verified_by:
confidence: high
refs:
  - ABC-152
  - ADR-0042
  - ADR-0040
  - ADR-0035
  - NFR-008
  - RISK-ABC144-FCAP
  - RISK-ABC152-PUZZLE-SPY
  - .grugops/context/secnfr-ABC-152-window/probe/abc152-warm.tsv
  - .grugops/context/secnfr-ABC-152-window/probe/abc152-warm.summary.txt
  - .grugops/context/secnfr-ABC-152-window/probe/abc152-puzzle.tsv
  - .grugops/context/secnfr-ABC-152-window/probe/abc152-puzzle-firstpass.tsv
  - .grugops/context/secnfr-ABC-152-window/probe/readout.out.txt
  - .grugops/context/secnfr-ABC-152-window/probe/w152.thermal.tsv
supersedes:
---

# `ABC-152` window readings: warm full lane, B / H / T, n = 8; the `PUZZLE_DEEP=1` wall, B / H, n = 4

This note is hand-authored and unsealed. Every number is printed by `probe/readout152.py` (`probe/readout.out.txt`) from
the raw TSVs beside it.
- B = `91024242` (vitest 3.2.7, runner on, k = 2). T = the same commit in a second tree.
- H = `3c55b965` (vitest 4.1.11, `viteModuleRunner: false`, k = 2).
- Apple M3 (Mac15,13, 4P + 4E), Darwin 25.5.0, Node v26.11.0, on AC power, `lowpowermode` 0.

## Step 1: warm paired (`npm test`, `lane144b.mjs`, rotated, ROUNDS 9, round 0 discarded, GAP 0, unprofiled)

The runs went from 22:55:24Z to 22:59:04Z: **27 runs, 0 harness errors.** The foreign runner was present before 0 of
27 runs and after 0 of 27.

| arm | n | CPU median (range) s | wall median (range) s | CPU ÷ wall | load1 before, median (range) | files / tests (every run) |
|---|---|---|---|---|---|---|
| B | 8 | **23.41** (22.75–23.69) | **9.17** (8.90–9.41) | 2.549 | 4.66 (4.11–5.48) | 56 / 1740 |
| H | 8 | **18.54** (18.18–19.03) | **6.12** (5.95–6.28) | 3.029 | 4.73 (3.89–5.37) | 56 / 1741 |
| T | 8 | 23.38 (23.00–24.18) | 9.19 (9.00–9.51) | 2.552 | 4.57 (4.14–5.67) | 56 / 1740 |

Round 0, discarded: B 22.05 / 8.63, H 17.60 / 5.81, T 22.72 / 8.93 (CPU / wall, s). Every run passed every test with 0
skipped. No run had load1 > 8 before it.

**Paired deltas against B** (`ADR-0035` d1 order statistics, k = 2 of n = 8, ≥ 92 % coverage):

| pair | median | interval | sign + | R | per-round deltas |
|---|---|---|---|---|---|
| **H − B CPU** | **−4.855 s (−20.74 % of B)** | **[−4.930, −4.520] s = [−21.06 %, −19.31 %]** | 0/8 | 4.930 | −5.37, −4.57, −4.93, −4.86, −4.52, −4.89, −4.85, −3.98 |
| H − B wall | −3.105 s | [−3.190, −2.820] | 0/8 | 3.190 | −3.29, −2.82, −3.13, −3.09, −2.90, −3.12, −3.19, −2.78 |
| **T − B CPU** | +0.145 s (+0.62 % of B) | [−0.440, +0.340] = [−1.88 %, +1.45 %] | 5/8 | **0.440 (1.88 % of B)** | −0.52, 0.27, −0.22, 0.34, 0.22, 0.07, −0.44, 1.17 |
| **T − B wall** | +0.040 s | [−0.190, +0.120] | 4/8 | **0.190** | −0.19, 0.12, −0.10, 0.08, 0.11, 0.00, −0.29, 0.45 |

- Ratio of medians, H ÷ B: CPU **0.792**, wall **0.667**.
- The −15 % bar sits at −3.511 s. All 8 paired CPU deltas lie beyond it. The smallest is −3.98 s, in round 8, the
  window's hottest run.

## Heat during step 1 (`thermalpressurelevel`, read before and after every run)

| arm | scored runs at level ≥ 1 (before or after) | incl. round 0 | max level |
|---|---|---|---|
| B | **5 / 8** | 5 / 9 | 1 |
| H | **4 / 8** | 4 / 9 | **2**, once: the after-read of the 27th and last run (round 8 H) |
| T | 4 / 8 | 4 / 9 | 1 |

- The first level-1 read came after run 15 (round 4, B). From round 5 on, every before-read was 1.
- **The sequence position decides who is hot, not the arm.** All three arms were at level 1 for the last 4 rounds.
- The sampler, every 15 s across the step, read level 0 in 8 samples and level 1 in 7. `CPU_Speed_Limit` was absent
  (`none`) on every run and every sample.

## Step 3b: `RISK-ABC152-PUZZLE-SPY` (`PUZZLE_DEEP=1 npx vitest run src/puzzle-suite.test.ts --reporter=verbose`, B and H rotated, 5 rounds, round 0 discarded)

The runs went from 23:06:29Z to 23:09:28Z, after the gate. **10 runs, every one exit 0, 18 passed, `solved 54/58`.**
The foreign runner was present before 0 of 10. Level 0 before and after every run.

| arm | n | printed `PUZZLES … wall` median (range) s | process wall median (range) s | CPU median s | `ORACLE` mate-in-3 / win-material wall (round 2) |
|---|---|---|---|---|---|
| B | 4 | **19.95** (19.66–21.39) | 29.16 (28.82–31.68) | 29.67 | 4.08 / 4.26 s |
| H | 4 | **3.96** (3.94–4.03) | 6.00 (6.00–6.17) | 6.59 | 0.74 / 0.81 s |

- **H − B, paired:**
  - printed wall: −16.21, −15.79, −15.70 and −17.36 s, median **−16.00 s**;
  - process wall: median −23.16 s;
  - CPU: median −23.13 s.
- **The results are unchanged:** the 58 per-row verdict and move columns of round 1 are byte-identical, B against H
  (`/usr/bin/diff`, exit 0).
- **Against `AGENTS.md`'s 32–36 s** (the command wall of `PUZZLE_DEEP=1`, recorded at 3.2.7 on 2026-10-10): H's
  command wall is **6.0–6.2 s**, and B's today is 28.8–31.7 s.

**Supplementary, first pass** (`probe/abc152-puzzle-firstpass.tsv`): the same command without `--reporter=verbose`,
from 23:00:41Z, after the gate passed.
- On 4.1 the default reporter hides a passing test's stdout, so H printed no wall and no `solved` line. All 10 runs
  were exit 0 with 18 passed.
- Process wall medians: B 30.19 s, H 6.39 s. CPU: B 30.69 s, H 6.90 s.
- **A foreign runner was present before 7 of these 10 runs.** The same foreign session started a new run at about
  23:01:24Z.
- It is listed, not graded.

## The full-lane twin R at k = 2 (`RISK-ABC144-FCAP`)

**T − B at k = 2, on 3.2.7 with the runner on, warm, n = 8: CPU R 0.440 s, wall R 0.190 s.**
- This is the first full-lane twin R at k = 2. Earlier twins were read at 7 workers (Window B) and at k = 3
  (`ABC-151`).
- The recorded `F` is 1.72 s CPU / 3.25 s wall. Both readings sit well below it.
- No cooled twin was read, because the cooled state was not owed (step 2).
