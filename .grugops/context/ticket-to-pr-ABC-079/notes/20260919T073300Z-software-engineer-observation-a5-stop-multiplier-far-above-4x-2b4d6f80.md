---
id: 20260919T073300Z-software-engineer-observation-a5-stop-multiplier-far-above-4x-2b4d6f80
kind: observation
by: software-engineer
at: 2026-09-19T07:33:00Z
verified_by:
confidence: high
refs:
  - ABC-079
  - ABC-080
  - ABC-078
  - ADR-0003
  - NFR-005
  - NFR-004
  - src/quiescence.ts
  - src/quiescence.test.ts
  - src/engine.test.ts
supersedes:
---

# `A5` STOP CONDITION TRIPPED: the node-count multiplier is 62x–1 540x, not 2.5x. Halted, reported.

The ticket: *"If the measured multiplier exceeds 4x, stop and report — the depth arithmetic this
epic rests on was derived at 2.5x and a 4x reading invalidates it. Do not tune the number to fit."*
Owner named on the page: **Architect/Design** (`NFR-005` trigger). This note is that report.

## The measurement (the delivered code, `search()` vs `searchWithoutQuiescence()`, same depth)

Nodes as `SearchResult.nodes` counts them — one per position entered, quiescence nodes included.
Apple M3, Node v24, load average 2.4–7.6 (two sibling hops running; node counts are deterministic
and unaffected by load, the ms are not).

```
position    depth   without      with          multiplier   with-ms
kiwipete    1            49      34 401         702.1x         88
kiwipete    2           313     274 704         877.7x        766
kiwipete    3         9 016  13 368 024       1 482.7x     28 853
kiwipete    4        38 023  58 567 981       1 540.3x    161 441
position-6  1            47       2 899          61.7x          7
position-6  2           562     211 986         377.2x        509
position-6  3        14 565   1 740 783         119.5x      4 001
position-6  4       222 697  37 116 041         166.7x     94 921
startpos    1-3    21/114/1098  21/122/1003     1.00x / 1.07x / 0.91x
position-3  1-3    15/96/530    20/166/893      1.33x / 1.73x / 1.68x
```

The quiet positions sit at the model's 1x–2x. The two BENCHMARK positions the criterion names are
capture-dense, and there the multiplier is two to three orders of magnitude above the level.

## What the number is sensitive to — a DIAGNOSTIC, not shipped, not a tuning

A scratch copy of the leaf (never committed) was run with two knobs the ticket fences off, so the
owner of the number can see what moves it. Depth 2, same node definition:

```
                       kiwipete             position-6
no ordering, cap 8      877.7x  (shipped)    377.2x  (shipped)
no ordering, cap 4       31.1x                19.5x
no ordering, cap 2        4.6x                 5.2x
MVV-LVA order, cap 8     33.2x                17.4x
MVV-LVA order, cap 4     12.7x                 8.0x
MVV-LVA order, cap 32    39.7x                24.9x
```

Read: **capture ORDERING (ABC-080's) cuts the multiplier ~25x and still leaves it 4–8x above the
stop level; only a cap of 2 plies — which is not a runaway guard but a budget, and which the ticket
forbids — reaches the neighbourhood of 4x.** The 2.5x in `ADR-0003` is a literature figure for an
ordered engine measured as a share of total nodes, not a same-depth node ratio on capture-dense
positions with unordered captures. Whether the model's constant, the criterion's measure, or the
ticket's ordering (`ABC-080` first) should change is the Architect's call. None of the three was
made here.

## Consequences already visible at the branch tip

1. **`NFR-004` holds; `NFR-005` gets worse.** At `DEFAULT_BUDGET_MS` on a real clock (load 7.98)
   every perft root returned in 3 000–3 002 ms; the 5 s ceiling was never approached. Completed
   depth with quiescence: startpos 6, kiwipete **2**, position-3 6, position-4 4, position-5 3,
   position-6 **2** — against the `ABC-078` record of kiwipete 4 and position-6 3 at the same
   budget. `NFR-005`'s depth-6 FAIL floor was already unmet; it is now further away. Reported,
   not ruled.

2. **Three `src/engine.test.ts` fixtures have their PREMISE broken, and were NOT re-fixtured.**
   - `A2` "visits only a bounded number of nodes past the deadline": 38 496 > 10 240. The bound
     assumed the UNABORTABLE depth-1 iteration is tiny; on kiwipete it now costs 34 401 nodes
     (the 702x above) before the clock is even armed. The in-recursion check itself is intact —
     quiescence nodes go through the same `countNode`.
   - `A3` "aborts INSIDE depth 3 … depth reached 2" and "returns the completed depth-2 move":
     at a 5 ms budget on a 1 ms tick, position-6 now completes depth 1 only (depth 2 costs
     211 986 nodes with quiescence, not 562), so `choice.depth` is 1 and the depth-2 reference
     no longer applies. The identity sweep (engine copy equals `search()` in move AND score) is
     GREEN — the two recursions agree; only the fixtures' node assumptions are stale.
   Re-fixturing them means choosing budgets and bounds around the 1 500x, which is tuning the
   ticket to fit the number it says to stop on. Left red, on purpose, until the number is ruled.

3. **`src/quiescence.test.ts` `A5` is RED by design** — the 4x is asserted, not admired.

4. `SEARCH_DEEP=1` on `src/search.test.ts` is no longer practical at its 30 s per-case timeouts:
   kiwipete at depth 3 pruned alone is 28.9 s with quiescence, and the unpruned pair is far
   longer. Measured separately in the gate-results claim.
