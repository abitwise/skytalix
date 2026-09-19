---
id: 20260919T075000Z-software-engineer-claim-gate-results-and-deep-lanes-8a0c2e46
kind: claim
by: software-engineer
at: 2026-09-19T07:50:00Z
verified_by:
confidence: UNKNOWN - verify
refs:
  - ABC-079
  - ABC-078
  - NFR-004
  - NFR-005
  - NFR-008
  - src/quiescence.test.ts
  - src/engine.test.ts
  - src/search.test.ts
  - .grugops/test-skips.md
supersedes:
---

# Gate results at `ead14eb`, raw, plus the three opt-in deep lanes — a `claim`, no stamp

No `finding` is admissible on this install (`AGENTS.md`); the §14 gate is the Orchestrator's to
run. These are the numbers as they ran, exit codes included.

## The four mandatory gates + test integrity, on the branch tip

```
npm run lint        biome check .   Checked 75 files. No fixes applied.        exit 0
npm run typecheck   tsc --noEmit                                               exit 0
npm run build       tsc --noEmit                                               exit 0
npx vitest run --dir src
                    Test Files  2 failed | 39 passed (41)
                         Tests  5 failed | 1238 passed (1243)                  exit 1   RED
skip count          npx vitest run --dir src --reporter=json | jq '.numPendingTests + .numTodoTests'  → 0
integrity           node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0
                    No findings.                                               exit 0
```

Baseline at `4f0ef01`: 40 files / 1213 passed / 0 skipped, exit 0. The 5 reds are named in the
artifact-ref note; all five are the `A5` multiplier seen from different sides.

## `SEARCH_DEEP=1 npx vitest run src/quiescence.test.ts` — exit 1, 227.2 s wall, load 9.5

```
Tests  6 failed | 31 passed (37)     user 203.85 s
A1 depth 3: losing capture chosen 0/24 with quiescence, 0/24 without           pass
A3 broad corpus (six roots + 184 children) under the cap; A4 door 14 565/c3d5; A6 broad 0 mutated   pass
A5 kiwipete   d1 702.06x  d2 877.65x (6.3 s)  d3 1482.70x (187.8 s)             all FAIL vs 4x
A5 position-6 d1  61.68x  d2 377.20x (2.5 s)  d3  119.52x (21.6 s)              all FAIL vs 4x
```

## `ENGINE_DEEP=1 npx vitest run src/engine.test.ts` — exit 1, 179.7 s wall, load 4.8–8.6

```
Tests  4 failed | 29 passed (33)     user 179.60 s
A1 (30 positions, real clock, 3 s budget): 0/30 over the 5 s ceiling; worst 3 016 ms at
   completed depth 5 (startpos/g1f3); over 3 s: 26/30 by the abort granularity      pass
NFR-005: kiwipete completed depth 1 (205 408 nodes, 3 003 ms); position-6 depth 2
   (251 730 nodes, 3 001 ms) — REPORTED; the ABC-078 record was 4 and 3               pass (reports)
A3 identity sweeps (engine copy == search() in move AND score), all corpora            pass
A7 1 ms budget, 200+ positions, legal move every time, byte-identical                  pass
FAIL default-lane A2 node bound (38 496 > 10 240), A3 ×2 (depth-2 premise)              same as gate
FAIL NEW, deep only: "A2 — a 50 ms budget returns inside 100 ms": 444 ms at completed depth 1
```

**That last line is a finding-shaped regression the default lane cannot see and it is stated
here rather than smoothed:** the UNABORTABLE first iteration now carries the quiescence cost, so
on kiwipete depth 1 is 34 401 nodes (≈ 90 ms unloaded, 444 ms at this load) and a 50 ms budget
cannot be honoured. `NFR-004`'s 3 s clause is unaffected (the 3 s runs above land at +0–16 ms),
but any small budget `ABC-087`/`ABC-101` might choose is bounded below by the depth-1
quiescence cost. Same cause, same owner.

## `SEARCH_DEEP=1 npx vitest run src/search.test.ts` — KILLED at a 300 s wall cap, no result

`ABC-077`'s deep lane took 23.0 s at its own tip. With quiescence its kiwipete depth-3 PRUNED
search alone is 28.9 s and the unpruned pair is unbounded in practice; the lane did not finish
inside 300 s and was SIGTERMed by the measurement script. **`UNKNOWN - verify` — not run to
completion; no pass/fail is claimed for it.**

## Scratch artefacts (not committed, in the session scratchpad)

`abc079-measure-lane.mjs` (the `/usr/bin/time -p` runner), `abc079-probe.ts` (corpus/multiplier
probe), `abc079-diag.ts` (the ordering/cap sensitivity diagnostic), `abc079-nfr004.ts`,
`abc079-deep-lanes.mjs`, `abc079-rowcheck.mjs`, and the two commit-message files.
