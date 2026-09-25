---
id: 20260925T200200Z-software-engineer-observation-abc121-n8lane-1830ms-gross-1670ms-net-over-line-stop-24e3648a
kind: observation
by: software-engineer
at: 2026-09-25T20:02:00Z
verified_by:
confidence: medium
refs:
  - ABC-121
  - N8-LANE
  - NFR-008
  - AR-N8LANE-079
  - .grugops/context/ticket-to-pr-ABC-121/probe/build121.mjs
  - .grugops/context/ticket-to-pr-ABC-121/probe/lane121.mjs
  - .grugops/context/ticket-to-pr-ABC-121/probe/lane-files.mjs
  - .grugops/context/ticket-to-pr-ABC-121/probe/lane-summary.txt
  - .grugops/context/ticket-to-pr-ABC-121/probe/lane-raw.tsv
supersedes:
---

# `N8-LANE`: +1 830 ms CPU gross, +1 670 ms net — OVER the 650 ms line (about 2.6x). The queue's stop condition: measured, deep-lane placement PROPOSED below, NOTHING TRIMMED

Hand-authored, no `seal`. **Confidence is medium because of load** (median load1 13.6 during the
harness), not because of the protocol.

## Instrument

`ABC-081`'s harness, arms re-pointed (`probe/lane121.mjs`, `probe/build121.mjs`), `NFR-008`'s
own protocol:
- the lane is `npx vitest run --dir src`, one fresh process per run;
- 9 rounds with the order rotated, round 0 discarded;
- counts asserted every run;
- CPU is user + sys from `/usr/bin/time -p`.

Arms, each a `git archive` outside the repository: A = `9823c27`; N = a copy of A, byte-identical
by `diff -rq`; B = `15c6eb0`, the base.

| arm | files / tests | median CPU | median wall |
|---|---|---|---|
| A (ABC-121) | 48 / 1 467 | 25.390 s | 5.620 s |
| N (identity) | 48 / 1 467 | 25.180 s | 5.620 s |
| B (base) | 47 / 1 446 | 23.435 s | 5.395 s |

- **Null control, N − A:** median **+0.030 s (0.12%)**, sign 4/8. Per-round values range from
  −0.97 to +0.55. Admissible: within 1.5%, sign at chance.
- **Charge, A − B:** per round 2.19, 1.61, 1.83, 1.59, 1.38, 2.29, 1.83, 1.95. Median
  **+1.830 s (7.21%)**, **sign 8/8**, every round above the null's largest swing. This is a real
  charge, not noise.
- **Net of the 160 ms floor for the one new file: +1 670 ms against 650 ms. NOT MET.**
- Load1 before each run: min 5.1, median 13.64, max 16.99. 0 harness errors in 27 runs.

## Where it comes from (`probe/lane-files.mjs`: each touched file alone, A vs B, 5 interleaved rounds)

| file | CPU A | CPU B | A − B | vitest test-time A / B |
|---|---|---|---|---|
| `search.pvs-lmr.test.ts` (new) | 1.98 s | — | new | 672 ms |
| `transposition.test.ts` | 1.82 | 1.75 | +0.07 | 543 / 458 ms |
| `engine.test.ts` | 2.51 | 2.47 | +0.04 | 212 / 215 ms |
| `search.test.ts` | 1.93 | 1.94 | −0.01 | 680 / 686 ms |
| `search.ordering.test.ts` | 1.80 | 1.81 | −0.01 | 493 / 512 ms |
| `quiescence.test.ts` | 1.48 | 1.49 | −0.01 | 242 / 237 ms |

- **The re-pointed merged files cost about +0.1 s combined.** The charge is the new file.
- **Its own rows are about 672 ms of test time.** Default-lane rows by cost:
  - mate-floor seven-seed guard 182 ms;
  - `A4` `search()` 136 ms;
  - PVS identity endgames + position-3 126 ms;
  - `A4` `chooseMove` 104 ms;
  - engine-doors bite 47 ms;
  - `A5` position-3 29 ms;
  - PVS bite 29 ms;
  - corpus pin 12 ms;
  - `A3` ×12 ~0 ms.
- **About 1 s is NOT attributed by a per-file run: `UNKNOWN - verify`.** Candidates:
  - the file's `vi.mock("./transposition.ts")` re-instantiating the search/engine module graph
    in its worker;
  - transforming the 321-line mate corpus;
  - load (median 13.6, three times `ABC-081`'s harness load).

## PROPOSED placement — for the Orchestrator / Architect-Design to rule; NOT applied

**Move to `SEARCH_DEEP=1`** (each row's deep form already exists, so nothing is lost at the
opt-in hop):
1. the mate-floor seven-seed guard (182 ms); the full 287 is already deep;
2. the PVS identity endgames + position-3 guard (126 ms); the 190 at d4 is already deep. The
   `door-withoutReductions-reduces` mutant would then be red only in the deep lane;
3. `A4`'s `chooseMove` row (104 ms). `A4`'s `search()` row stays default, as the ticket asks;
4. the engine-doors bite row (47 ms). The mutant it closes would then be red only in the deep
   lane.

**Keep in the default lane:** `A3` (the table and both source rows), `A4` `search()`, `A5`'s
position-3 guard, the PVS bite, and the corpus length pin.

**That saves about 460 ms of test time. It does NOT by itself reach 650 ms net on this reading.**
If the unattributed ~1 s is module-graph cost, the next lever is to put the `vi.mock`
instrument and the corpus import behind the deep flag, which means a second file. That is a
structural change and is not made here.

**Alternatives for the owner / Architect-Design:**
- accept the charge as an accepted risk, as `AR-N8LANE-078` (1.29x) and `AR-N8LANE-079` were;
- apply the placement above and re-measure at low load; or
- both.

The lane is already over `NFR-008`'s 15 s CPU clause with or without this ticket (≈ 23.4 s → 25.4 s,
`AR-N8LANE-079`, inherited).

## Deep-lane costs of the new rows (plain node / runner, this build)

- PVS identity 190 at d4: 21 s.
- Drift d5, both recursions: fixed 54 s plain node; the file's whole `SEARCH_DEEP` run took 911 s
  under a load of about 5–6 while other lanes ran.
- Mate floor 287, d4 → 5: 1.1 s plain node; d5 → 6 (probe only): 3.6 s.
- Companion to d7: two positions × two engines.
- `A2` wall clock (`ENGINE_DEEP`): 36 s.
- **`AGENTS.md` owes a `SEARCH_DEEP=1 npx vitest run src/search.pvs-lmr.test.ts` line and an
  `ENGINE_DEEP` one: a later Scribe pass, blocked on `ABC-109`'s headroom. Not written here
  (fence).**
