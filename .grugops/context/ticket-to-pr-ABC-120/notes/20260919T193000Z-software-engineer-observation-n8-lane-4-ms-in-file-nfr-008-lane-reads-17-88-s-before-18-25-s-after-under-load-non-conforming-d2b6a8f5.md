---
id: 20260919T193000Z-software-engineer-observation-n8-lane-4-ms-in-file-nfr-008-lane-reads-17-88-s-before-18-25-s-after-under-load-non-conforming-d2b6a8f5
kind: observation
by: software-engineer
at: 2026-09-19T19:30:00Z
verified_by:
confidence: medium
refs:
  - ABC-120
  - ABC-108
  - ABC-111
  - ADR-0019
  - ADR-0014
  - NFR-008
  - N8-LANE
  - src/turn-loop.test.ts
  - plans/nfr-catalog.md
supersedes:
---

# `N8-LANE` at this hop: +4 ms in-file, 0 new files; `NFR-008` CPU reads 17.88 s BEFORE and 18.25 s AFTER — both over 15 s, under sibling load, at n = 3: REPORTED AS NON-CONFORMING, NOT RULED, NOTHING TRIMMED

**NOT A STAMP, and NOT a conforming `ADR-0019` reading.** The subtask asked for `/usr/bin/time -p`,
≥ 3 runs, median, load noted, and said a > 15 s reading under load is REPORTED as non-conforming,
never ruled and never trimmed. That is what was run and this is what it says. `ADR-0019` trigger
(a) needs the row's own protocol (n ≥ 7 interleaved, rotated order, round 0 discarded, identity
null control ≤ 1.5%); **this sample does not meet it.** `plans/nfr-catalog.md` is NOT opened here.

## Instrument

`/usr/bin/time -p npx vitest run --dir src` spawned from a node script (`scratchpad/abc120/lane.mjs`),
one fresh OS process per run; `sysctl -n vm.loadavg` sampled before each run. CPU = user + sys.
"Before" ran on a copy of the base tree (`20ad7cb`'s `src/`, `node_modules` symlinked) in the
scratchpad; "after" ran in the worktree at `d8e7ccc`. Two sibling hops (`ABC-079`, `qe-ABC-034`)
were live throughout, and the load rose sharply between the two samples.

## Before (base `20ad7cb`, 42 files / 1291 tests)

| run | load (1/5/15) | real | user | sys | CPU |
| --- | --- | --- | --- | --- | --- |
| 1 | 3.08 5.43 6.08 | 4.81 | 15.96 | 1.71 | **17.67** |
| 2 | 7.40 6.29 6.38 | 4.55 | 16.21 | 1.67 | **17.88** |
| 3 | 7.28 6.29 6.38 | 4.58 | 16.51 | 1.66 | **18.17** |

**Median CPU 17.88 s** (range 17.67–18.17). Counts asserted 42 / 1291 on every run.

## After (tip `d8e7ccc`, 42 files / 1297 tests)

| run | load (1/5/15) | real | user | sys | CPU |
| --- | --- | --- | --- | --- | --- |
| 1 | 13.51 6.35 6.08 | 4.97 | 16.22 | 1.80 | **18.02** |
| 2 | 17.71 7.34 6.43 | 4.67 | 16.53 | 1.72 | **18.25** |
| 3 | 20.78 8.15 6.72 | 4.84 | 16.69 | 1.77 | **18.46** |

**Median CPU 18.25 s** (range 18.02–18.46). Counts asserted 42 / 1297 on every run.

## `N8-LANE` — the ticket's own charge, in-file

`npx vitest run src/turn-loop.test.ts` alone, base copy (57 rows) vs tip (63 rows), 7 paired
rounds with the order alternated (`scratchpad/abc120/infile.mjs`, load 1-min 12.5 at start):

| tree | rows | median `tests` ms | range | median file duration |
| --- | --- | --- | --- | --- |
| base | 57 | 48 | 46–50 | 250 ms |
| tip | 63 | 51 | 49–59 | 265 ms |

Paired per-round deltas of the in-file `tests` figure: 3, 4, 4, 0, 11, 4, 3 → **median +4 ms**.
**0 new test files, 0 new modules, 0 new dependencies.** Six rows, ≤ 16 plies each on a spied
`gameStatus`, exactly the shape the ticket priced.

## Clause state, in `ADR-0014` decision 4's form

- **Measured: `N8-LANE` +4 ms in-file (paired median, n = 7), 0 files** — against the ticket's
  650 ms bar, met by two orders of magnitude on the number this ticket controls.
- **`NFR-008` CPU: the lane reads OVER 15 s BEFORE this ticket's change exists** (17.88 s at load
  3–7) **and after** (18.25 s at load 13–21). The paired before→after delta is +370 ms, taken
  across a 2–3× rise in 1-min load and at n = 3; it is not attributable to six rows and +4 ms of
  test content by this sample. The ticket's "effective bar is `min(650 ms, the CPU headroom
  re-measured at the delivery base)`": **the headroom re-measured at the delivery base is
  NEGATIVE (−2.9 s at this instrument), so this delivery reads as a lane breach, not a ticket
  pass — and the breach is the base's, not the diff's.** This is the same shape `ABC-107` and
  `ABC-034` reported on the same day (17.16 s / 16.92 s before their changes).
- Wall: 4.55–4.97 s, REPORTED, NOT RULED (`ABC-111`).
- **Nothing was trimmed, folded, skipped or made opt-in** to move any of these numbers; the
  subtask forbids it and the rows are the guard.

## Hand-up

Whether these readings are `ADR-0019` trigger (a) is not this role's to decide — trigger (a)
needs a conforming n ≥ 7 reading with a null control at a named commit, and the Orchestrator
already holds two sibling samples from today saying the same thing about the base. The sized
remedy `OPT-1` and `ABC-108` / `ABC-111` are where the lane question lives.
