---
id: 20260818T003200Z-qe-e2e-observation-gate-run-and-lane-measurements-2b98e5f7
kind: observation
by: qe-e2e
at: 2026-08-18T00:32:00Z
verified_by:
confidence: high
refs:
  - ABC-077
  - NFR-008
  - N8-LANE
  - src/search.qe.test.ts
supersedes:
---

# The gate, run and transcribed — and the lane numbers, including one that is close to a clause

Machine: Darwin 25.5.0, **8 logical cores**, load average **2.48 / 2.96 / 4.86** at the start of the run and 4.74 / 3.42 / 4.99 at the end. **Not the 24.77-on-8-cores the delivery hop reported** — this session's machine is comparatively quiet, which matters for the two readings below.

## Gate on the tip `45d6591`, before QE added anything

| step | command | result |
|---|---|---|
| lint | `npm run lint` | **exit 0** — `Checked 60 files in 104ms. No fixes applied.` |
| typecheck | `npm run typecheck` | **exit 0** — no output |
| build | `npm run build` | **exit 0** — no output (`tsc --noEmit`) |
| test | `npm test` | **exit 0** — `Test Files 33 passed (33)`, `Tests 963 passed (963)`, 2.09 s |
| skip count | `npx vitest run --reporter=json \| jq '.numPendingTests + .numTodoTests'` | **0** |
| test integrity | `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0` | **`No findings.`, exit 0** |
| deep perft | `PERFT_DEEP=1 npx vitest run src/perft.test.ts` | **32 passed (32)**, 36.25 s |
| deep search | `SEARCH_DEEP=1 npx vitest run src/search.test.ts` | **41 passed (41)**, 23.48 s |

## Gate after QE added `src/search.qe.test.ts`

| step | result |
|---|---|
| `npm run lint` | **exit 0** — `Checked 61 files in 85ms. No fixes applied.` |
| `npm run typecheck` | **exit 0** |
| `npm run build` | **exit 0** |
| `npm test` | **exit 0** — `Test Files 34 passed (34)`, `Tests 969 passed (969)`, 2.05 s |
| skip count | **0** |
| test integrity | **`No findings.`, exit 0** |
| `SEARCH_DEEP=1` on both search files | **47 passed (47)**, 22.43 s |

`.grugops/test-skips.md` was **read only**. Nothing was written to it.

## `N8-LANE` for the file QE added — **155 ms net, inside the 650 ms bar**

Nine interleaved rounds, round 0 discarded, condition order rotated every round, one fresh OS process per run, CPU = user + sys of `npm test`. Conditions: the tree **with** `src/search.qe.test.ts`, the tree **without** it, and a **second without-run as the null control**.

```
round 1  with=12.08  without=11.46  null=11.66   delta=+0.62  null=+0.20
round 2  with=12.11  without=11.59  null=11.64   delta=+0.52  null=+0.05
round 3  with=12.16  without=11.98  null=11.67   delta=+0.18  null=-0.31
round 4  with=12.34  without=11.89  null=11.82   delta=+0.45  null=-0.07
round 5  with=12.36  without=12.28  null=12.00   delta=+0.08  null=-0.28
round 6  with=12.50  without=12.34  null=12.00   delta=+0.16  null=-0.34
round 7  with=12.27  without=12.10  null=12.00   delta=+0.17  null=-0.10
round 8  with=12.43  without=11.77  null=12.08   delta=+0.66  null=+0.31
```

- **median delta 315 ms CPU, sign 8/8**;
- **minus the 160 ms per-file floor for the one file added = 155 ms net** against the **650 ms** bar;
- **null control: median −85 ms = −0.72%, sign 3/8** — inside the ≤ 1.5%-at-chance admissibility rule;
- direct file cost under the runner: **171 ms** test time, 6 tests.

**One honesty note on my own instrument:** the null floor (85 ms) is over half my net signal (155 ms). The reading is inside the bar by a wide margin and the sign is unanimous, so the conclusion holds — but this is not a precision measurement, and I used **run-pairing, not the catalog's `cmp`-verified second-TREE pairing**, the same deviation the delivery hop disclosed.

## `NFR-008` — reproduced, **not breached, and closer to the CPU clause than is comfortable**

`NFR-008` is **≤ 3 s wall AND ≤ 13 s CPU (user + sys)**, median of ≥ 7 interleaved runs. From the same eight rounds:

| | median CPU | % of the 13 s clause | wall |
|---|---|---|---|
| lane **without** `src/search.qe.test.ts` | **11.94 s** | 92% | 2.37–2.39 s |
| lane **with** it | **12.31 s** | **95%** | 2.39 s |

**Both clauses are MET, with and without QE's file.** But the engineer's incidental observation is **reproduced in magnitude and its caveat removed**: he saw 11.3–13.3 s and attributed it partly to a machine at load 24.77. This machine was at load ~2.5–5.0 and still reads ~12 s. **The load was not the explanation.** I never observed a single run above 12.50 s, so I do **not** reproduce his upper figure of 13.3 s, and by the row's own statistic (a median) nothing is breached.

**This is Architect/Design's row and I take no verdict on it.** What I hand over is: the CPU clause has roughly **0.7 s of headroom** on a quiet machine, that is about **four more test files at the 160 ms floor before the floor alone consumes it**, and QE's own file spent 0.37 s of it. If that headroom matters, `src/search.qe.test.ts` is a legitimate thing to ask QE to trim — say so and it will be.
