---
id: 20260925T124300Z-security-nfr-observation-abc081-n8lane-met-plus-360ms-gross-200ms-net-null-admissible-a4e009b8
kind: observation
by: security-nfr
at: 2026-09-25T12:43:00Z
verified_by:
confidence: medium
refs:
  - ABC-081
  - NFR-008
  - N8-LANE
  - ADR-0019
  - AR-N8LANE-079
  - .grugops/context/ticket-to-pr-ABC-081/notes/20260925T105000Z-software-engineer-observation-abc081-n8lane-charge-220ms-gross-60ms-net-met-58f3eaed.md
  - .grugops/context/secnfr-ABC-081/notes/raw-harness-lane.mjs.txt
  - .grugops/context/secnfr-ABC-081/notes/raw-harness-lane-files.mjs.txt
  - .grugops/context/secnfr-ABC-081/notes/raw-out-lane-summary.txt
  - .grugops/context/secnfr-ABC-081/notes/raw-out-lane.tsv.txt
  - .grugops/context/secnfr-ABC-081/notes/raw-out-lane-load.txt
  - .grugops/context/secnfr-ABC-081/notes/raw-out-lane-files.json.txt
supersedes:
---

# ABC-081 `N8-LANE`: MET. The charge reads +360 ms CPU gross, which is +200 ms net of the new-file floor, against an admissible null. The build's +220 / +60 is confirmed as MET and corrected upward in size

Hand-authored, with no `seal`. **Confidence is medium because of load, not because of the
protocol.**

## The instrument

This is `secnfr-ABC-079`'s lane harness, via `secnfr-ABC-080`. Only the arms directory, the arm
labels and the charge label were changed; `raw-harness-lane` shows this in its header. It follows
`NFR-008`'s own protocol:
- contained lane `npx vitest run --dir src`, one fresh OS process per run;
- condition order rotated every round;
- 9 rounds, with round 0 discarded;
- file and test counts asserted on every run;
- CPU is user + sys from `/usr/bin/time -p`.

The arms are this gate's own: A = `504f046`, N = a byte-identical copy of A, B = `6033d05`. See
the sibling NFR observation for how they were built.

## The reading

| arm | files / tests | median CPU | CPU range | median wall |
|---|---|---|---|---|
| A (ABC-081) | 45 / 1 444 | 24.005 s | 23.58 – 24.31 | 5.955 s |
| N (identity) | 45 / 1 444 | 23.995 s | 23.36 – 24.47 | 6.210 s |
| B (base) | 44 / 1 418 | 23.490 s | 23.16 – 24.47 | 5.925 s |

- **Null control, N − A.** Per round: −0.20, −0.06, −0.06, 0.58, −0.22, −0.57, −0.03, 0.63.
  - Median **−0.060 s (−0.25%)**, sign 2/8.
  - **Admissible:** it is within 1.5%, and the sign is at chance.
  - The per-round spread is ±0.63 s.
- **Charge, A − B.** Per round: 0.46, −0.28, −0.16, 0.49, 0.12, 0.80, 0.52, 0.26.
  - Median **+0.360 s CPU (+1.50%)**, sign **6/8**.
  - The median wall charge is +0.080 s.
- **Net of the 160 ms per-file floor for the one new file (`src/transposition.test.ts`): +200 ms,
  against 650 ms. MET.**
- **Load was very high.** The 1-minute load before each run was min 3.62, median 18.67, max
  24.09, because the harness loads the machine itself. There were 0 harness errors in 27 runs.

## The ruling on the Engineer's figure

- **MET is CONFIRMED. The size is CORRECTED UPWARD, and the correction is in form, not in
  verdict.**
  - The Engineer read +220 ms gross (+60 ms net), sign 5/8.
  - This gate reads +360 ms gross (+200 ms net), sign 6/8.
- Unlike `ABC-080`, where the two instruments disagreed in sign, **both instruments read a
  positive charge here (11 of 16 rounds together)**.
- **The honest reading is a small, probably real charge of about 0.2–0.4 s gross.** That is
  0.06–0.24 s net, under 650 ms in either reading. Quoting either figure to the millisecond would
  be false precision at this load.

## Attribution, which the Engineer left `UNKNOWN - verify`, now measured

This is test time from the vitest JSON (`raw-harness-lane-files`, re-pointed with the arms
directory only, 3 alternating rounds). It is an indicator, not CPU. The table lists files that
moved by 50 ms or more.

| file | A | B | Δ test time |
|---|---|---|---|
| `transposition.test.ts` (new) | 891 ms | — | **+891** |
| `engine.test.ts` | 580 | 387 | **+193** (the `G1` pin, the `A5` engine rows and the re-pinned `A3` fixture) |
| `search.test.ts` | 1 346 | 1 404 | −58 |
| `search.ordering.test.ts` | 996 | 1 087 | −91 |
| `search.qe.test.ts` | 45 | 807 | **−762** |
| `perft.test.ts`, `zobrist.test.ts` (untouched by the ticket) | — | — | −122, −78: **the noise band** |

- **The −762 ms comes from the build's forced edit (a).** On the base, `QE-G1`'s depth-less call
  recursed until the stack overflowed, and that took 807 ms. The `!(depth >= 1)` root guard now
  returns at once.
- **The new rows alone add about +1.08 s of test time** (+891 and +193). The ticket fits under
  650 ms net only because that saving offsets them. Test time is an indicator, not CPU.
- The same line, reverted (mutant K4), does not cost 807 ms on this build. **It hangs the lane**,
  because the capacity guard turns the recursion into a depth-128 search. See the security
  observation.

## About the lane, not about `ABC-081`

- The lane reads **about 24.0 s CPU with this ticket and 23.5 s without it**, against
  `NFR-008`'s 15 s.
- `ADR-0019` trigger (a) stays fired. **`AR-N8LANE-079` was accepted by the owner on 2026-09-25
  (option a, note `…36b66fbd`).**
- That acceptance covers `ABC-079`'s charge. It is not a blanket allowance. Each later ticket is
  still held to `N8-LANE`'s 650 ms, and **this one meets it.** No new owner word is owed for
  `ABC-081`.
- **Cross-session comparison is not a measurement.** Lane totals read 22.29 s at the acceptance,
  23.7 s at `secnfr-ABC-080` and 24.0 s here, with median loads of 4.4, 15.7 and 18.7. The drift
  tracks load as much as content. Only the paired, same-session A − B above is this ticket's
  charge.
- The wall clause (≤ 3 s; this gate reads 5.96 s) is reported, not ruled. `ABC-111` owns it.
