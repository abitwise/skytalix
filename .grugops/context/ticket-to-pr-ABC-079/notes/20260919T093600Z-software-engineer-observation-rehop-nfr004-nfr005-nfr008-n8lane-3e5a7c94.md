---
id: 20260919T093600Z-software-engineer-observation-rehop-nfr004-nfr005-nfr008-n8lane-3e5a7c94
kind: observation
by: software-engineer
at: 2026-09-19T09:36:00Z
verified_by:
confidence: medium
refs:
  - ABC-079
  - ABC-078
  - NFR-004
  - NFR-005
  - NFR-008
  - ADR-0019
  - ADR-0024
  - plans/nfr-catalog.md
  - src/quiescence.test.ts
  - src/engine.ts
supersedes: 20260919T074500Z-software-engineer-observation-nfr008-n8lane-nfr004-measurements-6f8b0d24
---

# `NFR-004` (holds), `NFR-005` (reported: kiwipete 2–3, position-6 3), `NFR-008` (non-conforming under load), `N8-LANE` (≈ 0.61 s paired) — measured at `700730b`

Apple M3 (Mac15,13), 8 cores, Darwin 25.5.0, Node v24.12.0. **Load average quoted with every
figure; it ran 4–19 (two sibling hops live plus other work), against the catalog's quiet-machine
protocol. Read the DELTAS and the node counts; the absolute seconds are not the catalog's.**
`confidence: medium` for that reason, and because the runs are 3 per arm, not the catalog's ≥ 7.

## `NFR-004` — move time at `DEFAULT_BUDGET_MS` (3 000), real clock, six perft roots (load 3.9)

```
startpos    wall 3004 ms  depth 6    680 980 nodes  b1c3
kiwipete    wall 3002 ms  depth 3  1 024 757 nodes  e2a6
position-3  wall 3001 ms  depth 6    899 090 nodes  b4f4
position-4  wall 3001 ms  depth 4  1 060 793 nodes  c4c5
position-5  wall 3003 ms  depth 3    678 232 nodes  d7c8
position-6  wall 3003 ms  depth 3    685 352 nodes  c3d5
```

**≤ 3 s at default difficulty holds to the abort granularity (+4 ms worst); the 5 s ceiling was
never approached.** The `ENGINE_DEEP` `A1` sweep says the same over 30 positions (worst
3 036 ms, 0/30 over the ceiling).

## `NFR-005` — completed depth at 3 s on the two benchmark positions, REPORTED (the ruling's `UNKNOWN - verify`)

| position | `ABC-078` record | unordered `e2c3af5` | ordered, `ENGINE_DEEP` case (load ~4.5) | ordered, out-of-tree run (load 3.9) | ruling's estimate |
|---|---:|---:|---:|---:|---:|
| kiwipete | 4 | 2 | **2** (203 509 nodes, 3 004 ms) | **3** (1 024 757 nodes, 3 002 ms) | 3 |
| position-6 | 3 | 2 | **3** (180 520 nodes, 3 010 ms) | **3** (685 352 nodes) | 3 |

Kiwipete reads 2 or 3 depending on the moment's load: depth 3 costs 405 945 nodes and the
measured rate under the runner swung from ~68k to ~340k nodes/s between the two runs. Position-6
is back to the `ABC-078` record; kiwipete is one ply under it on the better reading. The row's
depth-6 FAIL floor stays unmet, as `ADR-0024` decision 6 states for the owner. Not ruled here.

## `NFR-008` — the whole default lane, CPU (user+sys) and wall, `/usr/bin/time -p`, one fresh process per run, INTERLEAVED, 3 rounds

The subtask's pairing (before = wave branch `b65f5f1`, after = tip) — **with a confound named:
`b65f5f1` carries 42 files / 1 297 tests (tickets merged to the wave after this branch's base)
and the tip 41 / 1 243, so the delta is not attributable to this ticket alone.**

```
                                cpu s   (rounds)                 wall s   files/tests          load
before  wave b65f5f1            25.11   25.11 / 25.61 / 24.08     7.49    42 / 1297 pass        4.0–17.9
after   tip 700730b             29.12   29.12 / 27.46 / 29.53     7.69    41 / 1243 pass       10.4–18.4
delta                           +4.0                              +0.2
```

The attributable pairing (before = this branch's base `4f0ef01`, same test set minus the new
file; a second interleaved triple):

```
base    4f0ef01                 21.27   18.36 / 23.75 / 21.27     5.34    40 / 1213 pass       10.0–19.0
after   tip 700730b             27.28   29.13 / 27.28 / 25.50     6.78    41 / 1243 pass        9.4–19.5
delta                           +6.0                              +1.4
```

**Non-conforming, reported: CPU 27–29 s against the 15 s level, wall 6.8–7.7 s against 3 s —
and the BEFORE arms are already over both clauses at this load (21–25 s CPU, 5.3–7.5 s wall).**
The first hop's unordered delta was +19.1 s CPU (16.95 → 36.08); ordered it is +4 to +6 s on a
noisier day. Where the remaining cost sits: every existing `search()` / `chooseMove()` test
paying the ordered multiplier (8x–120x), not the new file (below). No test trimmed, none moved
between lanes; `ADR-0019` trigger (a) stands as the first hop recorded it.

## `N8-LANE` — the new file's own charge (bar ≤ 650 ms CPU net of the 160 ms per-file floor)

Paired within each round, `after tip` minus `after --exclude "**/quiescence.test.ts"`:

```
round 0   29.12 − 28.82 = 0.30 s      load 9.5–10.4
round 1   27.46 − 26.85 = 0.61 s      load 14.4–18.7
round 2   29.53 − 28.16 = 1.37 s      load 17.4–18.4
paired median 0.61 s CPU gross  ≈ 0.45 s net of the 160 ms floor
src/quiescence.test.ts alone (one run): 1.90 user + 0.42 sys, runner start-up included
```

**Stated against 650 ms: the paired median reads UNDER (≈ 450 ms net, 610 ms gross) — but the
three pairs span 0.30–1.37 s at load 9–19, so this is a low-confidence reading, not a claim of
`N8-LANE MET`; the first hop's 2.8 s was 4x over.** Where it goes now: `A5`'s two depth-1
readings (5 878 + 297 nodes, was 34 401 + 2 899), the `A1` arms (48 searches), the ≥ 200-position
sweep, the throwing-visitor case. Nothing was trimmed to get here; the sort did it.
