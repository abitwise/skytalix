---
id: 20260919T232000Z-software-engineer-observation-n8-lane-123-ms-in-file-0-files-nfr-008-lane-19-70-s-before-20-49-s-after-under-load-non-conforming-3f7a1c68
kind: observation
by: software-engineer
at: 2026-09-19T23:20:00Z
verified_by:
confidence: medium
refs:
  - ABC-075
  - ABC-108
  - ABC-111
  - ADR-0019
  - ADR-0014
  - NFR-008
  - N8-LANE
  - NFR-005
  - src/zobrist.test.ts
  - src/zobrist.nfr.test.ts
  - plans/nfr-catalog.md
supersedes:
---

# `N8-LANE` at this hop: +123 ms in-file, 0 new files; `NFR-008` CPU reads 19.70 s BEFORE and 20.49 s AFTER — both over 15 s, under sibling load, at n = 3: REPORTED AS NON-CONFORMING, NOT RULED, NOTHING TRIMMED

**NOT A STAMP, and NOT a conforming `ADR-0019` reading.** The subtask asked for `/usr/bin/time -p`,
≥ 3 runs, load noted, and said a > 15 s reading under load is REPORTED as non-conforming, never
ruled and never trimmed. That is what was run and this is what it says. `ADR-0019` trigger (a)
needs the row's own protocol (n ≥ 7 interleaved, rotated order, round 0 discarded, identity null
control ≤ 1.5%); **this sample does not meet it.** `plans/nfr-catalog.md` is NOT opened here.

## Instrument

`/usr/bin/time -p npx vitest run --dir src` spawned from a node script (`raw-lane-harness.mjs.txt`
beside this note, the `ABC-120` harness with the path changed), one fresh OS process per run;
`sysctl -n vm.loadavg` sampled before each. CPU = user + sys. "Before" ran on a `git archive` copy
of the base tree (`b65f5f1`, `node_modules` symlinked) in the scratchpad; "after" ran in the
worktree at the tree that became the commit. Two sibling hops (`qe-ABC-120`,
`ruling-abc079-multiplier`) were live throughout; the 1-min load roughly doubled between the two
samples.

## Before (base `b65f5f1`, 42 files / 1297 tests)

| run | load (1/5/15) | real | user | sys | CPU |
| --- | --- | --- | --- | --- | --- |
| 1 | 4.60 4.95 5.34 | 6.53 | 20.77 | 2.17 | **22.94** |
| 2 | 5.44 5.11 5.40 | 5.49 | 17.83 | 1.87 | **19.70** |
| 3 | 7.56 5.56 5.55 | 5.16 | 17.78 | 1.90 | **19.68** |

**Median CPU 19.70 s** (range 19.68–22.94). Counts asserted 42 / 1297 on every run.

## After (tip tree, 42 files / 1305 tests)

| run | load (1/5/15) | real | user | sys | CPU |
| --- | --- | --- | --- | --- | --- |
| 1 | 6.26 5.53 5.47 | 6.72 | 18.24 | 2.10 | **20.34** |
| 2 | 12.65 6.87 5.95 | 6.82 | 19.38 | 2.23 | **21.61** |
| 3 | 12.91 7.02 6.00 | 5.77 | 18.51 | 1.98 | **20.49** |

**Median CPU 20.49 s** (range 20.34–21.61). Counts asserted 42 / 1305 on every run.

## `N8-LANE` — the ticket's own charge, in-file

`npx vitest run src/zobrist.test.ts src/zobrist.nfr.test.ts` alone, base copy (27 rows) vs tip
(35 rows), 8 paired rounds with the order alternated, round 0 discarded, one fresh process per
run, `/usr/bin/time -p` around each (`raw-infile-harness.mjs.txt`, `raw-infile-summary.json.txt`;
load 1-min 4.3–5.1 throughout):

| tree | rows | median `tests` ms | median process CPU | median file duration |
| --- | --- | --- | --- | --- |
| base | 27 | 93 | 1.52 s | 270 ms |
| tip | 35 | 215 | 1.68 s | 397 ms |

Paired per-round deltas, n = 7: `tests` ms **121, 123, 117, 143, 115, 124, 132 → median +123 ms,
sign 7/7**; process CPU **+0.13, +0.08, +0.15, +0.18, +0.14, +0.16, +0.14 → median +0.14 s, sign
7/7**. **0 new test files, 0 new modules, 0 new dependencies**, so no 160 ms floor is charged and
`N8-SPAWN` is 0 / 0. The charge is the depth-2 oracle walk over twelve positions (the six perft
positions plus six hand-picked), each node paying one full-scan `zobristKey` plus one
`zobristKeyAfterMove` plus a second full scan after unmake, and the re-pointed ep-field property
walk now checking every node rather than only double pushes. The depth-4 walk (40 s) is behind
`ZOBRIST_DEEP=1` and charges the default lane nothing.

## Clause state, in `ADR-0014` decision 4's form

- **Measured: `N8-LANE` +123 ms in-file `tests` time / +140 ms process CPU (paired medians,
  n = 7, sign 7/7), 0 files** — against the ticket's 650 ms bar, **met with 5x headroom** on the
  number this ticket controls.
- **`NFR-008` CPU: the lane reads OVER 15 s BEFORE this ticket's change exists** (19.70 s at load
  4.6–7.6) **and after** (20.49 s at load 6.3–12.9). The before→after delta is +0.79 s at n = 3
  across a ~2x rise in 1-min load; the in-file instrument attributes +0.14 s of it to this ticket's
  content and the rest is not separable from load by this sample. The headroom re-measured at the
  delivery base is **NEGATIVE (−4.7 s at this instrument)**, so this delivery reads as a lane
  breach that is the base's, not the diff's — the same shape `ABC-120`, `ABC-107` and `ABC-034`
  reported today (17.88 s / 17.16 s / 16.92 s before their changes; this session's base reads
  higher still, and the 22.94 s first run is reported, not dropped).
- Wall: 5.16–6.82 s, REPORTED, NOT RULED (`ABC-111`).
- **Nothing was trimmed, folded, skipped or made opt-in** to move any of these numbers; the depth
  split (2 default / 4 deep) was designed before the first timing was taken, on the 4.1 M-node
  arithmetic in the sibling `decision` § 6, not in response to a reading.

## `NFR-005` — per-node cost, for the record

`zobristKey` 340.7 ns vs `zobristKeyAfterMove` 37.1 ns, interleaved, ratio 9.19x — in the sibling
`claim` with rounds. The no-ep path of `zobristKey` runs identical code to before; the ep-set path
lost the probe move. No target moves.

## Hand-up

Whether these readings are `ADR-0019` trigger (a) is not this role's to decide — trigger (a) needs
a conforming n ≥ 7 reading with a null control at a named commit. The sized remedy `OPT-1` and
`ABC-108` / `ABC-111` are where the lane question lives; this hop adds one more same-day sample
saying the base is over the level before any diff is applied.
