---
id: 20261018T132100Z-qe-e2e-observation-abc170-break-attempts-bca451d6
kind: observation
by: qe-e2e
task: qe-ABC-170
at: 2026-10-18T13:21:00Z
verified_by:
confidence: high
refs:
  - ABC-170
  - QE-170-a
  - QE-170-e
  - QE-170-f
  - QE-170-g
  - ABC-167
  - .grugops/context/qe-ABC-170/probe/probe-a.out
  - .grugops/context/qe-ABC-170/probe/probe-b.out
supersedes:
---

# ABC-170 break attempts: probes A and B, on the virtual clock only

The probe sources and outputs are under `.grugops/context/qe-ABC-170/probe/`. They ran from `src/` of the scratch worktree and
were removed from it afterwards.

## Probe A: "absent = today's engine", node for node, outside the six perft FENs
- **Corpus:** 72 positions: the 6 perft roots, the 6 `ENDGAME_CORPUS` positions, and 60 seeded random walks of 4-53 plies
  from the roots.
- **Grid:** budgets 1/2/5/13/40/90 ms on `tickingClock(1)`, plus 20 ms on 3-ms and 0.5-ms steps, across all three doors
  (`chooseMove`, `…WithoutReductions` and `…WithoutPvsOrReductions`).
- **Comparison:** the **base** engine (`git show 358810ac:src/engine.ts`) against the tip run four ways: absent,
  explicit `undefined`, `maxDepth 1000 / maxNodes MAX_SAFE_INTEGER`, and `Infinity / Infinity`.
- **Result: 6 768 comparisons of move, score, depth, nodes and elapsedMs, 0 mismatches.** The FEN was restored after every
  run, and depths ranged from 1 to 15. A3 holds against the base itself, not only tip against tip.

## Probe B: edge values, tiny budgets, and a sweep of `maxNodes` values
- **`maxDepth`** (kp-vs-k, 10 ms):
  - 0, -1, -Infinity, NaN, 0.5, 1 and 1.5 each give d1 with a legal move. Nothing throws.
  - Fractional values floor: 2.5 gives d2 and 3.999 gives d3.
  - 8, Infinity and 1e9 give d7, the same as unlimited.
  - `null` is treated as absent. `"3"` coerces to 3, which only a JS caller can send.
- **`maxNodes`** (Kiwipete, 5 000 ms):
  - 0, -1, -Infinity, NaN, 0.5 and 1 each give d1 with 602 nodes.
  - 1023, 1024 and 1025 give d1 with 1 626 nodes: depth 2 is entered and then aborted at its first check.
  - 3000 gives d2 with 3 674 nodes. Infinity gives d8 with 5 112 410 nodes at the ceiling.
- **Limit plus tiny budget** (startpos, kp-vs-k and Kiwipete at budgets NaN, -1, 0, 1, 2, 3, 5):
  - `maxDepth` d gives min(free depth, d) in all 63 cases.
  - `maxNodes` never goes deeper than the clock-only run.
  - When maxDepth > free depth the result is byte-identical to the free run.
  - When maxDepth equals free depth the node count is lower, because the iteration the free run aborted is never
    started. That is correct.
- **Sweep of `maxNodes`:** 6 positions × 17 values = 102 rows, from 1 to 90 000, including the 1024 boundaries.
  - The bound `nodes ≤ max(maxNodes, depth-1 cost) + 1024` held in 102/102 rows.
  - The discard held in 102/102 rows: move, score and depth equal a `chooseMove({maxDepth: d})` run.
  - Depth is monotone in `maxNodes`, the FEN is restored, and every move is legal.
  - **30 of the 78 aborts landed in a quiescence node and 48 in a full-width node.** The node limit inside quiescence is
    therefore exercised, and it is safe.
- **The `search(p, d)` reference is not an invariant.** In 21 of 102 sweep rows the engine at completed depth d differs
  from `search(p, d)`, while the discard identity holds. Examples: startpos at d2-d6, such as d6 `d2d4` 52 against `e2e4` 34,
  and kp-vs-k at d5-d9, such as d5 `e1d1` 145 against `e1f2` 150. A1's d3 fixture and A2's Kiwipete d3 fixture are cases where
  the two coincide (QE-170-e).
- **Below the depth-1 cost, `maxNodes` reports more nodes than asked.** position-4 at `maxNodes: 1` reports 1 484 nodes,
  because the first iteration always completes, by design. `ABC-167` should expect `go nodes N` with a small N to report
  more than N (QE-170-g).

## The A3 row's run time is close to vitest's default 5 s `testTimeout` (QE-170-a)
These durations are as vitest reported them, incidental to the runs. They are **not** an `NFR-005` or `NFR-008` reading.
- In my green `npm test` run the `ABC-170 A3` row took 4 816 ms. In a later quiet-ish lane run it took 3 404 ms.
- In the first pass of the mutant catalogue, run at the default timeout, the row failed with `Test timed out` (5.4-6.4 s)
  in 11 of 18 lane runs. Re-run at `--testTimeout=120000`, none of those 11 mutants fails the row, so each of those failures was a timeout and not a kill. The load average was about 5-9 during those runs.
- The row makes 12 `chooseMove` calls at 50 ms on `tickingClock(1)`, about 51 k nodes each. It has no per-row timeout,
  whereas the deep rows have `120_000`.
- Its share of the `NFR-008` lane budget is `UNKNOWN - verify` at the gate's `N8-LANE` measurement.
