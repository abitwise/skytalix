# PREREG, se-ABC-305: `ABC-305` A5, the `N8-LANE` read. Sealed and committed before any timing run

Software Engineer, task `se-ABC-305` (brief by the Orchestrator, 2026-11-05T12:30:40Z; the build and read may run now by `…f40ce634` ruling 3). The method is `secnfr-census-1105`'s session 1 (`…b9038a14`), its scripts copied into `raw/scripts/`. The changes are stated here.

## What is already known, and is not timing
- **The merge is `158bb992`,** parents `2dd18186` and `b297ab89`. One preflight `npm test` per arm, under the lock, read counts only: `main` `a21136b0` 71 files / 2 709 / 0 / 0, and `158bb992` 71 / 2 710 / 0 / 0, each exit 0. Those are the harness's expected counts. Its wall is not used.

## The read: one `flock <scratch>/host-test.lock` hold, ALONE
- **Arms, out of tree, each borrowing `node_modules` by symlink:**
  - **B = `main` `a21136b0`** (`git archive`), the tip's base on `main`. `2dd18186`, the claim, adds no lane input.
  - **H = the commit holding this note** (`git archive`): `158bb992` plus records only. Named in the readings note. Over `src tools package.json package-lock.json vitest.config.ts tsconfig.json AGENTS.md` it equals `158bb992`, checked before the hold.
  - **H2 = `cp -a` of H,** `diff -r` clean before the hold. The identity twin.
- **Harness:** `n8.sh` and `stage.inc.sh` as `secnfr-census-1105` ran them, with the expected counts above and no other change. Order rotates B H H2 / H H2 B / H2 B H. Round 0 is discarded. Until 8 complete scored rounds or 12 rounds, no new round past 1 200 s. `npm test` as spelled, one fresh process per run, `/usr/bin/time` wall and CPU. Every output file is checked non-empty before it is read, and an empty one leaves the run unscored.
- **Starting clear:** `reread.sh` takes the lock, and five samples 3 s apart must name no vitest. If any does, it releases the lock and tries again after 60 s, for at most 1 800 s. Past that, nothing is read, and I report it.
- **Host gate, unchanged:** load1 ≤ 8 before every run, waiting up to 120 s. A run that starts over it, exits non-zero or reads other counts is not scored.
- **Grader:** `n8-grade.py` unchanged; k by `ADR-0035` D1 (k = 2 at n = 8–10). Twin admissible when |H2 − H CPU median| ≤ max(1.5 % of H's CPU, 10 ms), sign at chance, n ≥ 8.
- **ALONE:** `flags.py` unchanged. A flagged run is one with a busy foreign vitest before or after it, a foreign vitest sampled in its window, or `foreign_cpu_s` over the session median + 5 s. **More than 2 flagged rounds of the 8, and the read is not ALONE.**

## The rules, fixed before the read
- **A5's bar:** the paired H − B median wall ≤ **+0.10 s** (`n8-grade.py`'s BUDGET line), with an admissible twin, **and** H's median wall ≤ 10 s. The difference of the two arm medians, the k = 2 interval and the twin's wall R are reported beside it and do not change the outcome. The page's bar is the median.
- **VOID:** not ALONE, an inadmissible twin, or fewer than 8 complete rounds. **The brief says to say so and stop, so a VOID read gets no re-read here.** That differs from the census's one re-read. The call goes back to the Orchestrator.
- **Over budget:** I report it. The page's answer is that the row goes deep and the read is taken again. Whether that can be done without breaking A2 is read then, and if the page does not cover it, I STOP.
- **Rows (A5):** from H's and H2's scored JSON, `census.cjs` medians: every default-lane row of ≥ 50 ms among those this ticket adds or changes, and the sum of the added and changed rows against the 90 ms aim. "Added or changed" is listed by name from the diff against `main`, for the two `src/` files and `tools/tune/tune.test.ts`. A row of ≥ 50 ms that this ticket did not add or change is not this ticket's, and is only reported if it is new against `main`.
- **Not read here:** whether `G-WITH` lifts. The landing waits on the row move whatever this read says (`…f40ce634` rulings 1 and 3). This read is a build read, not a `NFR-008` grade for the catalog.

## Then, after the hold
Gates and deep lanes (A4, A6, A7), one job at a time under the same lock. Total lock forecast about 15 minutes. Foreign load is recorded and never touched. Nothing left running.
