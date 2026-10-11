---
id: 20261011T140910Z-security-nfr-observation-abc083-n8lane-k3-narrow-set-split-4583f42c
kind: observation
by: security-nfr
at: 2026-10-11T14:09:10Z
verified_by:
confidence: high
refs:
  - ABC-083
  - N8-LANE
  - NFR-008
  - ADR-0035
  - ADR-0040
  - ADR-0014
  - .grugops/context/secnfr-ABC-083-quiet-readings/probe/preregistered.txt
  - .grugops/context/secnfr-ABC-083-quiet-readings/probe/n8-narrow-set.txt
  - .grugops/context/secnfr-ABC-083-quiet-readings/probe/abc083-n8-k3.tsv
  - .grugops/context/secnfr-ABC-083-quiet-readings/probe/abc083-n8-k3.summary.txt
  - .grugops/context/secnfr-ABC-083-quiet-readings/probe/abc083-n8-split.tsv
  - .grugops/context/secnfr-ABC-083-quiet-readings/probe/abc083-n8-split.summary.txt
  - .grugops/context/secnfr-ABC-083-quiet-readings/probe/abc083-fulllane-k3.tsv
  - .grugops/context/secnfr-ABC-083-quiet-readings/probe/abc083-fulllane-k3.summary.txt
  - .grugops/context/secnfr-ABC-083-quiet-readings/probe/window-once.txt
  - .grugops/context/secnfr-ABC-144-window-b/probe/lane144b.mjs
  - .grugops/context/ticket-to-pr-ABC-083/probe/n8-summary.txt
supersedes:
---

# `N8-LANE` at k = 3: **+1.005 s CPU** (interval +0.910..+1.060, sign 8/8, twin R 0.110 s, admissible). About 0.8 s of it is second order: the costlier `evaluate` paid by search tests. The added file's own content is about 0.15 s

This note is hand-authored and unsealed. It is an observation, not a stamp.

## Arms

All arms are git worktrees in the session scratchpad, with `node_modules` symlinked from the main checkout.

- **B** = main tip `322427b3`, which carries `maxWorkers: 3` (`ADR-0040`, `ABC-144` merged `f272eedb`). It has a one-assertion placeholder at `src/evaluate.king-mobility.test.ts` (`ADR-0035` decision 2).
- **T** = a twin of B. `/usr/bin/diff -rq -x node_modules -x .git -x .test-results` is clean.
- **H** = `00e70e58`, a scratch merge of the branch tip `09b8c960` with `322427b3`.
  - It sits on a detached HEAD, on no branch, and was not pushed. The ticket branch was not touched.
  - The one conflict was `plans/traceability.md`, taken from main. No test in the set reads it.
  - **H − B is exactly the eight ABC-083 `src/` files** (`src/evaluate.ts` plus seven test files). `vitest.config.ts`, `AGENTS.md`, `package.json` and `tools/` are identical to B.
- **Resolved config:** `maxWorkers` 3 and `isolate` at its default on B, T and H. `VITEST_MAX_THREADS` was unset.
- **Narrow set: 17 files** (`probe/n8-narrow-set.txt`). These are the seven test files the ticket adds or modifies, plus `npx vitest related --run src/evaluate.ts` on H.
  - That command ran 17 files, 321 tests and 0 failures.
  - It is the build's 15 files plus `src/book.test.ts` and `src/ladder.test.ts`, which came in with main.
- **Harness:** `secnfr-ABC-144-window-b/probe/lane144b.mjs`, run from a `cmp`-identical copy.
  - `NARROW=<set>`, ROUNDS=9, GAP=0, round 0 discarded, so n = 8.
  - Counts are asserted from a fresh result file on every run. Thermal is read before and after every run.

## Graded reading (declared before the run, `probe/preregistered.txt` item 4), 14:00–14:03Z

| arm | CPU median | wall median | CPU/wall | files / tests | load1 median |
|---|---:|---:|---:|---|---:|
| B | 9.50 s | 3.09 s | 3.095 | 17 / 311 | 3.72 |
| H | 10.51 s | 3.55 s | 2.960 | 17 / 321 | 3.67 |
| T | 9.53 s | 3.17 s | 3.067 | 17 / 311 | 3.67 |

- **H − B CPU: median +1.005 s** (10.58 % of base). Sign 8/8, k = 2, interval **[+0.910, +1.060]**.
- **T − B CPU:** median +0.040 s (0.42 %), sign 4/8, interval [−0.050, +0.110], **R = 0.110 s**. This is admissible (≤ 1.5 %, sign at chance), and it **resolves 650 ms** (R ≤ b).
- H − B wall: +0.465 s (interval +0.450..+0.520).
- 0 harness errors in 27 runs. Thermal was 0 → 0 on every run, and load1 ranged 2.75–4.03.
- **Contention:** the `foreign_vitest` column reads 1 on every run, and that 1 is the driver shell itself. Its command line contained `vitest.config.ts` and `VITEST_MAX_THREADS` (the self-match trap `AGENTS.md` warns about). `ps` showed no vitest process after the run. The two later windows, whose driver lines did not contain the word, read 0.
- **Against the build's reading** (7 workers, 15 files, load1 5.1–8.2): +1.083 s (interval +0.923..+1.410, R 0.316). **The k = 3 cap did not change the charge** (+1.005 s). It lowered the base set's CPU from 11.23 s to 9.50 s.

## Attribution split, DESCRIPTIVE only

This split was declared after the graded read (`preregistered.txt` item 5), 14:03–14:06Z, at load1 4.6–5.6, thermal 0, foreign 0.

Arm **X** = H with the added file replaced by B's placeholder.

| pair | CPU median | interval | sign | reading |
|---|---:|---|---|---|
| X − B | **+0.795 s** | [+0.570, +0.910] | 8/8 | `src/evaluate.ts` plus the six modified test files (re-pins) |
| H − X | **+0.150 s** | [+0.01, +0.33] | 7/8 | the added `evaluate.king-mobility.test.ts` content |
| H − B | +0.905 s | [+0.880, +1.090] | 8/8 | agrees with the graded +1.005 s |
| T − B | −0.135 s (−1.39 %) | [−0.220, +0.010] | 2/8 | R 0.220 s; inside 1.5 % |

- **Per-file test time (one sample per arm, the last run's result file):**
  - `src/search.test.ts`, a file the ticket does NOT modify: 0.93 s on B, 1.07 s on X and 1.06 s on H.
  - `src/search.ordering.test.ts`: 0.66 → 0.85 s. `src/quiescence.test.ts`: 0.29 → 0.42 s.
  - One sample is indicative, not a measurement. It points the same way as X − B: most of the charge comes from search-running tests paying a leaf evaluator that costs about 2x base (`A5`: 775.8 ns against base 346–383 ns).
- **The added file alone, +0.15 s, would sit under 650 ms.** The charge over the bar comes from the change to `src/evaluate.ts`, not from test content the ticket wrote.

## `NFR-008` R-1 wall trip-wire, DESCRIPTIVE

Declared as item 6. Full `npm test` on H and on T (main plus one trivial file), 3 scored rounds, 14:06–14:08Z, load1 4.2–4.4, thermal 0.

- **H: 7.63 s wall median (7.38–7.64)** against W = 10 s. **The trip-wire did not trip.** 56 files, 1740 tests, 0 failed, 0 skipped.
- H CPU: 24.75 s median, reported and not levelled. H − T: +1.09 s CPU and +0.32 s wall, 3/3. With n = 3 this is not an `ADR-0035` reading.
