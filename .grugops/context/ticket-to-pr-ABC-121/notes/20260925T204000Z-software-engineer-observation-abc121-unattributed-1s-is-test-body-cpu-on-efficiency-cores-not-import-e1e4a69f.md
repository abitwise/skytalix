---
id: 20260925T204000Z-software-engineer-observation-abc121-unattributed-1s-is-test-body-cpu-on-efficiency-cores-not-import-e1e4a69f
kind: observation
by: software-engineer
at: 2026-09-25T20:40:00Z
verified_by:
confidence: medium
refs:
  - ABC-121
  - N8-LANE
  - NFR-008
  - .grugops/context/ticket-to-pr-ABC-121/notes/20260925T200200Z-software-engineer-observation-abc121-n8lane-1830ms-gross-1670ms-net-over-line-stop-24e3648a.md
  - .grugops/context/ticket-to-pr-ABC-121/probe/rehop-build.mjs
  - .grugops/context/ticket-to-pr-ABC-121/probe/rehop-lane.mjs
  - .grugops/context/ticket-to-pr-ABC-121/probe/rehop-attr-summary.txt
  - .grugops/context/ticket-to-pr-ABC-121/probe/rehop-attr-raw.tsv
  - .grugops/context/ticket-to-pr-ABC-121/probe/rehop-cpu-ratio.mjs
  - .grugops/context/ticket-to-pr-ABC-121/probe/rehop-cpu-ratio.txt
supersedes:
---

# The "unattributed ≈ 1 s" is NOT collect/import cost. It is the new file's own test bodies, whose CPU inflates in the lane: this Mac mixes performance and efficiency cores, and the load is high

Hand-authored, no `seal`. **Confidence medium:** the in-lane arms ran at load1 median 22.6. Their
null control read −1.84%, outside the protocol's 1.5%. So the run is usable **only as a relative
attribution** (every arm shared each round), **never as an `N8-LANE` reading**. `…e4d6fcc8` is
the reading.

## Arms in the full lane (`npx vitest run --dir src`, 9 rotated rounds, round 0 dropped)

Every arm is a `git archive` outside the repository. Each differs from base `B` = `15c6eb0` by one
file. The figure is the median paired CPU delta against `B`:

| arm | `src/search.pvs-lmr.test.ts` is… | vs `B` |
|---|---|---|
| `T` | a trivial file importing nothing from `src/` (the per-file floor) | +0.275 s |
| `M` | the real file, every `it` skipped, `vi.mock` block removed | +0.290 s |
| `S` | the real file, every `it` skipped (imports, `vi.mock`, module level, collect) | +0.320 s |
| `A` | the real file (`66afd16`; `src/` identical to the measured `9823c27`) | +2.055 s |

- **Import + module-level + collect ≈ 45 ms above the floor.** Of that, `vi.mock("./transposition.ts")`
  accounts for ≈ 30 ms. The `src/search.mate-corpus.ts` import is inside the remainder, and nothing
  in either file computes at import time.
- **Therefore ≈ 1.7 s of the charge is the test bodies**, against ≈ 0.7 s of vitest-reported test
  time.

## Why bodies cost more CPU in the lane than their test-time (`rehop-cpu-ratio.*`)

The instrument: `process.cpuUsage()` is process-wide, so it counts every thread, JIT and GC helpers
included. It was read around all of the file's bodies, with the file running alone.

- **Unconstrained, 5 runs:** 930 ms CPU over 823 ms wall, ratio **1.13**. JIT/GC helper threads
  add only ≈ 110 ms.
- **Pinned to efficiency cores (`taskpolicy -b`), 3 runs:** **3 893 ms CPU** for the same work,
  about 4.2x. This is an upper bound, because the background clamp also lowers the clock.
- **The machine:** Apple M3, 4 performance + 4 efficiency cores (`hw.perflevel0/1`).

The lane runs one worker per core under an external load of 16–32. **CPU-seconds are therefore not
work-invariant on this machine.** 0.93 s of performance-core work reads as ≈ 1.7 s in the lane.

## What follows

- **The lever is body work, not imports.** A second file splitting the `vi.mock` instrument and the
  corpus import from the rest (the build's "next lever", `…24e3648a`) would save ≈ 45 ms at best.
  **Not worth a structural change.**
- **Absolute `N8-LANE` figures scale with load.** The same `A − B` read +1.83 s at load 13.6
  (`…24e3648a`) and +2.27 s at load 22.8 (`…e4d6fcc8`). Compare charges only within one run's
  pairs, and record the load alongside.
