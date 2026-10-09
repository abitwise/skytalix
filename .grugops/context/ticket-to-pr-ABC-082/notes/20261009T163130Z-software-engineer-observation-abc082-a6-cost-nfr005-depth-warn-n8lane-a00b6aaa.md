---
id: 20261009T163130Z-software-engineer-observation-abc082-a6-cost-nfr005-depth-warn-n8lane-a00b6aaa
kind: observation
by: software-engineer
at: 2026-10-09T16:31:30Z
verified_by:
confidence: high
refs:
  - ABC-082
  - NFR-005
  - NFR-008
  - ABC-108
  - ADR-0003
  - .grugops/context/ticket-to-pr-ABC-082/probe/cost.ts
  - .grugops/context/ticket-to-pr-ABC-082/probe/cost.jsonl
  - .grugops/context/ticket-to-pr-ABC-082/probe/depth.ts
  - .grugops/context/ticket-to-pr-ABC-082/probe/depth.jsonl
  - .grugops/context/ticket-to-pr-ABC-082/probe/lane.mjs
  - .grugops/context/ticket-to-pr-ABC-082/probe/n8-raw.tsv
supersedes:
---

# `A6` cost 385–394 ns (bar ≤ 1,100: met). `NFR-005` depth: no FAIL; **WARN on kiwipete**, depth 7 reached in 1 of 3 rounds. `N8-LANE` ≈ +130 ms net: met. `NFR-008` second-order ≈ +0.6 s CPU

All readings: Apple M3 (8 cores), macOS, Node v26.11.0, plain node. A parallel Engineer
(`ABC-102`) was testing on the same machine, so load is recorded with every figure. These are
measurements; no level is claimed or moved. Security/NFR adjudicates, and only the owner's word
moves an `NFR-005` level.

## `A6` cost: combined `evaluate`, ABC-076's method

Method: best of 5 × 2,000,000 calls per position after warm-up, six perft roots. Base and branch
alternating, two rounds each.

| | startpos | kiwipete | pos-3 | pos-4 | pos-5 | pos-6 | **mean** | load1 |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| base r1 | 147.8 | 152.8 | 91.1 | 161.5 | 157.8 | 166.9 | **146.3** | 4.75 |
| branch r1 | 479.1 | 368.8 | 248.6 | 400.2 | 391.6 | 420.8 | **384.9** | 4.67 |
| base r2 | 144.2 | 144.5 | 86.5 | 140.8 | 140.9 | 161.8 | **136.5** | 4.71 |
| branch r2 | 543.6 | 387.4 | 251.0 | 393.4 | 382.2 | 407.4 | **394.2** | 9.02 |

- **≤ 1,100 ns: MET**, about 2.8x headroom. The term costs about +250 ns, 2.7x the base
  evaluator.
- Startpos is the worst case, because each pawn's passed scan walks five ranks.
- Purity: `A6` row green.

## `NFR-005` part 2: `chooseMove` at `DEFAULT_BUDGET_MS`, plain node, 3 rounds, same process, order alternating

| round | kiwipete branch | kiwipete base | pos-6 branch | pos-6 base | load1 |
|---|---|---|---|---|---|
| 1 | **6** (603 730 n) | 7 (589 564) | 7 (618 926) | 7 (580 009) | 7.7–8.1 |
| 2 | **6** (560 722) | 7 (562 940) | 7 (589 230) | 7 (591 273) | 12.8–12.9 |
| 3 | 7 (636 498) | 7 (602 876) | 7 (644 526) | 7 (648 617) | 11.1–12.0 |

- **No FAIL:** depth ≥ 6 on both positions in every round.
- **WARN (kiwipete): depth 7 missed in 2 of 3 rounds**, against base 3 of 3. Position-6 reached
  7 in 3/3 on both builds.
- **The cause is tree size, not evaluator cost.** Node rate is equal: branch 187k–215k nps, base
  187k–216k.
  - Clock-free companion (`ABC-121` `A2` deep row, this build): cumulative nodes to depth 7 are
    kiwipete **610 179** (base 532 363, **+14.6%**) and position-6 462 871 (base 467 461, −1.0%).
  - Kiwipete's 3 s capacity this session was about 560k–640k nodes, so depth 7 is now at or
    above the edge.
- **The load was high** (7.7–12.9). A quieter re-read is `UNKNOWN - verify`.
- Reported to the owner per `A6`. Not tuned around.

## `N8-LANE` and the `NFR-008` second-order delta

Method: `ABC-121`'s `NFR-008` protocol (`lane.mjs`):
- the whole default lane, `npx vitest run --dir src`, one fresh process per run;
- 8 rounds, round 0 discarded, arm order rotating, CPU = user + sys;
- arms: A = branch, N = null copy of A, X = branch without `src/evaluate.pawns.test.ts`,
  B = base;
- 0 harness errors in 32 runs; load1 median 8.6 (3.0–17.4).

| pair | median ΔCPU | sign |
|---|---:|---|
| N − A (null control) | −0.11 s (−0.44%) | 3/7 |
| A − X (the new suite) | **+0.29 s gross → ≈ +0.13 s net** of the 160 ms floor | 5/7 |
| X − B (the second-order evaluator cost on existing rows, plus the lift) | **≈ +0.6 s** | from paired rounds |
| A − B (whole change) | **+0.83 s (+3.4%)** | 7/7 |

- **`N8-LANE` (≤ 650 ms net): MET**, at about +130 ms. That is about the size of the null
  control's ±0.1 s spread.
- **`NFR-008`:** about +0.6 s CPU on the default lane from a costlier `evaluate` in every search
  row. Reported, not claimed against a level (`ABC-108`).
