# se-ABC-305-read: the `N8-LANE` read STANDS. 0 of 8 rounds flagged. A5's bar is met: paired H − B wall −0.110 s against +0.10 s, H 9.085 s against 10 s

Software Engineer, brief `se-ABC-305-read`, under PREREG `…987ae6ca` as sealed. H `35a694ee`, B `a8594b50`, H2 `cp -a` of H. Records: `raw/out/n8-r2/`. The re-read was not needed and `n8-r3` does not exist.

## Pre-checks, before launch
- `git diff --name-only 35a694ee HEAD` over the lane inputs: empty. `git diff --name-only a8594b50 main` over the same: empty, `main` at `0fe83b27`.
- `raw/scripts` `cmp`-equal to `<scratch>/se305/scripts`, and the sha256 prefixes are the PREREG's. `diff -r --no-dereference H H2`: empty. `n8-r2` did not exist.
- `ps` at 13:05:11Z: no vitest. load1 0.35.

## The slot
- Launch 13:05:33Z, 900 s clock. Clear on the first try at 13:05:48Z, 15 s after launch. No foreign try was released.
- One hold, 13:05:48Z to 13:09:58Z, 250 s. Wait-clear 0 s. 9 rounds, 27 runs, 8 complete scored rounds. Every run exit 0 with its expected counts: B 71 / 2 709, H and H2 71 / 2 710, 0 skipped, 0 failed. No output file was empty.
- load1 rose 0.52 to 3.89 and no run waited on the load gate. Every run was the harness's own: 83 samples, no sample row names a foreign vitest.

## Flags, read before the grade
**None: 0 of 8 scored rounds flagged, 8 unflagged, round 0 included.** `foreign_cpu_s` median 3.12 s, min 2.55, max 4.10. Foreign vitest 0 in every before and after reading. The void line is not reached: flagged 0 (limit 2), twin admissible, n = 8. **The read stands and is final.** The unflagged sensitivity equals the grade, because all 8 rounds are in it: B 9.240, H 9.085, H2 9.235.

## The figures, n = 8, k = 2
| arm | wall median | interval | max | CPU median |
|---|---|---|---|---|
| B | 9.24 s | [9.03, 9.31] | 9.33 | 31.29 s |
| H | 9.085 s | [9.06, 9.25] | 9.27 | 31.23 s |
| H2 | 9.23 s | [9.04, 9.29] | 9.37 | 31.54 s |

- **H − B wall, paired:** median **−0.110 s**, interval [−0.250, +0.150], 3 of 8 positive. Bar ≤ +0.10 s.
- **H − B CPU, paired:** median −0.025 s, interval [−0.430, +0.440], 4 of 8 positive.
- **Difference of the arm medians,** reported: −0.155 s.
- **Twin H2 − H:** CPU median +0.320 s, 1.02 % of H's 31.23 s, limit 0.469 s; sign 6 of 8, at chance by the grader's rule; n = 8. **ADMISSIBLE.** Wall median −0.010 s, R 0.220 s, 4 of 8 positive.

## A5
- **Bar: MET.** Paired H − B median wall −0.110 s ≤ +0.10 s, admissible twin, H's median 9.085 s ≤ 10 s. Headroom to 10 s: 0.915 s.
- **Against 9.6 s and 9.5 s, as figures:** H is 0.515 s below 9.6 s and 0.415 s below 9.5 s. Routing is the Orchestrator's.
- **What the figures do not say.** The bar is the median, and it decides. H is not shown faster than B: the interval spans 0 and its top, +0.150 s, is above +0.10 s. The twin's wall R of 0.220 s is more than the whole budget, and its CPU median, +0.320 s between identical trees, is the session's own noise. This read shows no cost above its noise. It does not resolve 0.10 s.
- **Rows, `census.cjs` medians over H's and H2's 16 scored runs:**
  - Added: `ABC-301 P1 … on 44 of 44`, 1.45 ms. Changed: the seams row (`QE-271-g`), 2.18 ms; the FEN source row, 2.90 ms. **Sum 6.52 ms against the 90 ms aim.** H has 3 row names B lacks and B has 2 H lacks, + 1 net.
  - **No added or changed row is ≥ 50 ms**, and none of the three files' rows is: the slowest there is `king-mobility` A6, 34.8 ms, a row this ticket did not change, B 32.2 ms. A row of ≥ 50 ms new against `main`: none, because the 3 new names are the three above. So no row goes deep.
  - One reading of my own: the `zeroed` helper in `src/evaluate.king-mobility.test.ts` changed and its two `phase-24 twin bites` rows call it. Their bodies did not change, so they are not listed above. Counted, each is under 1 ms and the sum stays under 90 ms.
  - `rowdiff.py` in `raw/scripts/` is new here: it lists the row names H and B differ in, and it is not one of the PREREG's scripts. The medians come from `census.cjs`, and the sum to two places from the same JSON.
  - No new test file: 71 and 71.

**Not done, as briefed:** no landing, no `main` merge, no `R-N8H-1` or `NFR-008` line read. Foreign load: none seen, nothing touched. Nothing of this hop is left running, by `ps`.
