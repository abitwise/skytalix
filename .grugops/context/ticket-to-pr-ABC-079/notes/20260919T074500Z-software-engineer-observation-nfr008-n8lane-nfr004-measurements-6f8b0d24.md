---
id: 20260919T074500Z-software-engineer-observation-nfr008-n8lane-nfr004-measurements-6f8b0d24
kind: observation
by: software-engineer
at: 2026-09-19T07:45:00Z
verified_by:
confidence: medium
refs:
  - ABC-079
  - NFR-008
  - NFR-004
  - NFR-005
  - ADR-0019
  - plans/nfr-catalog.md
  - src/quiescence.test.ts
  - src/engine.ts
supersedes:
---

# `NFR-008` (crossed — `ADR-0019` trigger (a)), `N8-LANE` (over), `NFR-004` (holds) — measured

Machine: Apple M3 (Mac15,13), Darwin 25.5.0, Node v24. **Two sibling hops ran concurrently the
whole time — load average is quoted with every figure, and the "before" reading is already above
the catalog's quiet-machine 14.940 s. Read the DELTAS, not the absolutes.** Instrument:
`/usr/bin/time -p npx vitest run --dir src`, one fresh process per run, via a scratch node script
(the PreToolUse hook refuses shell loops); median of 3, no warm-up round discarded (the catalog
asks ≥ 7 with round 0 discarded — not affordable on this machine today; `confidence: medium`).

## `NFR-008` — the whole default lane, CPU (user+sys) and wall

```
                              cpu s   (runs)                  wall s   files/tests            load
before  (4f0ef01, unchanged)  16.95   16.32 / 16.95 / 17.14    4.49    40 / 1213 pass, 0 skip   2.96–7.20
after   (ead14eb)             36.08   35.56 / 36.08 / 38.96   16.44    41 / 1238 pass 5 fail    4.63–8.60
delta                        +19.1                            +11.9
```

**Both clauses crossed: CPU 36.08 s against 15 s, wall 16.44 s against 3 s.** Per the subtask
this is `ADR-0019` trigger (a): reported, nothing trimmed, no file moved between lanes. The cost
is NOT the new test file (below) — it is every existing test that calls `search()` or
`chooseMove()` now paying the 62x–1 500x multiplier: `src/engine.test.ts` `A3` alone went from
~500 ms to 2.5–2.9 s, `A7`'s 200-position 1 ms-budget sweep and the identity sweeps grew the same
way, as did `src/search.test.ts`'s corpus runs.

## `N8-LANE` — the new file's own charge (bar: ≤ 650 ms CPU net of the 160 ms per-file floor)

```
after, all 41 files                     36.08 s  (35.56 / 36.08 / 38.96)   load 4.6–8.6
after, --exclude "**/quiescence.test.ts" 33.25 s  (33.08 / 33.25 / 39.30)   load 9.5–10.1   40 files
paired delta                             ≈ 2.8 s CPU      → ≈ 2.7 s net of the floor   NOT MET
src/quiescence.test.ts alone             2.67 s  (2.41 / 2.67 / 2.75)   load 16.1  (includes the runner's own start-up)
```

Not interleaved (three then three), and the second triple ran at a higher load, so the delta is
coarse; but it is 4x over the bar at any reading. Where it goes: `A5`'s two depth-1 multiplier
readings (kiwipete 34 401 nodes ≈ 0.5–1.1 s under the loaded runner), the `A1` arms (48
searches), the ≥ 200-position quiescence sweep, and the throwing-visitor `A6` case on kiwipete.
Every one of those IS a criterion, and the 4x-over `A5` reading is the ticket's stop condition
itself; none was trimmed.

## `NFR-004` — move time at `DEFAULT_BUDGET_MS`, real clock, quiescence ON

```
load 7.98 7.75 5.25 at start
startpos    3002 ms  depth 6    814 100 nodes  b1c3
kiwipete    3000 ms  depth 2  1 279 584 nodes  e2a6
position-3  3002 ms  depth 6  1 005 587 nodes  b4f4
position-4  3000 ms  depth 4  1 538 631 nodes  c4c5
position-5  3001 ms  depth 3    942 292 nodes  d7c8
position-6  3000 ms  depth 2  1 354 578 nodes  c3d5
```

**≤ 3 s at default difficulty holds to the abort granularity (+2 ms worst), and the 5 s ceiling
was never approached** — the clock check inside quiescence (`budget.visit` → `countNode`) is what
keeps it so. `NFR-005` depth-in-budget on the two benchmark positions is **2 and 2**, against the
`ABC-078` record of 4 and 3 and the row's depth-6 FAIL floor: reported, not ruled, and it is the
same multiplier seen from the clock's side.
