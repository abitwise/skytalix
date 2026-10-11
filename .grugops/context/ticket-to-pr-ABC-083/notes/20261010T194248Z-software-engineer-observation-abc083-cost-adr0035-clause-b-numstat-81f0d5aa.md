---
id: 20261010T194248Z-software-engineer-observation-abc083-cost-adr0035-clause-b-numstat-81f0d5aa
kind: observation
by: software-engineer
at: 2026-10-10T19:44:49Z
verified_by:
confidence: high
refs:
  - ABC-083
  - ADR-0035
  - ADR-0036
  - N8-LANE
  - NFR-008
  - .grugops/context/ticket-to-pr-ABC-083/probe/n8.sh
  - .grugops/context/ticket-to-pr-ABC-083/probe/n8-raw.tsv
  - .grugops/context/ticket-to-pr-ABC-083/probe/n8-summary.txt
  - .grugops/context/design-F-072-1/probe/clause-b.mjs
supersedes:
---

# Cost per `ADR-0035`: `N8-LANE` NOT MET on the narrow set (+1.08 s CPU). Clause (b) does not fire. Production is one file

## `ADR-0035` decision 2, the narrow set

- **The set (15 files):** the 8 test files the ticket adds or modifies, plus
  `npx vitest related --run src/evaluate.ts`. That is cli.real-engine, engine.capacity, engine,
  evaluate.king-mobility, evaluate.pawns, evaluate, levels, puzzle-suite, quiescence,
  search.capacity, search.ordering, search.pvs-lmr, search.qe, search and transposition.
- **Harness** `probe/n8.sh`: three out-of-tree trees. Base is `git archive 489c549e`, head is
  `79248602`, and the twin is a byte-identical copy of base (`/usr/bin/diff -r -x node_modules`).
  Base and twin carry a one-assertion placeholder at the added path. CPU is user + sys of
  `npx vitest run <set>`. One fresh process per run, rotated order, 9 rounds with round 0
  discarded (n = 8), load1 5.1–8.2 (logged, not gated). Counts: base/twin 263 passed; head 272
  passed, 1 failed (row 15, the R red).
- **Admissible:** the twin median is −0.064 s (−0.57% of 11.23 s), sign 2/8. **R = 0.316 s** (k = 2),
  which resolves 650 ms.
- **Head − base CPU: median +1.083 s, interval x(2)..x(7) = +0.923..+1.410, sign 8/8.
  `N8-LANE` (≤ 650 ms): NOT MET** (the median and the lower interval end are both above the bound).
  Wall +0.306 s (+0.255..+0.495), twin R 0.169 s.
- This set had no prior reading. Its provisional `F` (16% of 11.2 s) is replaced by this reading's
  R = 0.316 s (decision 3's per-set amendment).
- **Attribution is UNKNOWN - verify.** The likely source is the evaluation itself: 636 against 346
  ns per call, paid in every search-bound row. The new file is 9 rows over about 210 positions.
  Security/NFR rules the charge (`N8-LANE` is a rate limit, `ADR-0014` decision 4).
- `NFR-008` (R-1: wall ≤ 10 s is the gate): one unpaired reading, `npm test` at `79248602`, reported
  **Duration 6.02 s** at load1 3.17 (53 files, 1 673 passed / 1 failed). A trip-wire reading, not a paired
  charge; Security/NFR's to rule.

## `ADR-0036` clause (b), the canonical instrument, `489c549e..79248602`

- **Limb 1** (non-local import): (b1) 0, (b2) 0. **Does not fire.**
- **Limb 2** (`process`): (b1) 0, (b2) 0. **Does not fire.**
- **Limb 3** (spawn/exec/fetch/eval/Function/WebSocket): (b1) 0, (b2) 0. **Does not fire.**
- **No capability line was added or changed.** The production files changed number 1: `src/evaluate.ts`.

## `src/` numstat, `489c549e..79248602`

- **Production:** `src/evaluate.ts` +137 / −5.
- **Test:** 7 files, +281 / −36:
  - `evaluate.king-mobility.test.ts` +158 (new);
  - `evaluate.pawns.test.ts` +37 / −3;
  - `search.ordering.test.ts` +28 / −13;
  - `transposition.test.ts` +18 / −9;
  - `quiescence.test.ts` +17 / −6;
  - `search.pvs-lmr.test.ts` +15 / −4;
  - `engine.test.ts` +8 / −1.
- **This ticket changes a production file, so the zero-production-lines UAT waiver does not apply.
  The owner's UAT word is owed.**
