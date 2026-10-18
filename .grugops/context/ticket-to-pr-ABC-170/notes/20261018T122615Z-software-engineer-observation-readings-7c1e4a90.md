---
id: 20261018T122615Z-software-engineer-observation-readings-7c1e4a90
kind: observation
by: software-engineer
task: ticket-to-pr-ABC-170
at: 2026-10-18T12:26:15Z
verified_by:
confidence: high
refs:
  - ticket-to-pr-ABC-170
  - ABC-170
  - ADR-0044
  - EPIC-007
  - NFR-005
supersedes:
---

# ABC-170 readings at code `e29f7951` (base `358810ac`, src-identical to `a0c6db6c`)

Hand-authored and unsealed (`AGENTS.md`: no `finding` is admissible on this install). **No timing was read**:
the ABC-169 engineer ran vitest beside this hop. Every reading is a count or a pass/fail on `tickingClock`.

- **Red first.** Tests written before the engine edit: `src/engine.test.ts` 42 tests, **7 failed** on the base
  engine (the two amended `A4` checks, `A1` x2, `A2` x3). The `A3` and `A5` rows pass on base, as a regression
  guard should. With the edit: 42/42.
- **Probe readings (tickingClock(1)), engine vs `search()`:**
  - `kp-vs-k`, 10 ms: unlimited `chooseMove` depth 7; `maxDepth: 3` depth 3, 147 nodes, `e1f2` 151 = `search(p,3)`;
    `maxDepth: 1` depth 1, `e2e3` 153 = `search(p,1)`.
  - Kiwipete, 5 000 ms, `maxNodes: 20000`: depth 3, **20 058 nodes** (bound 21 024), `e2a6` 70 = `search(p,3)`.
    `maxNodes: 1`: depth 1, 602 nodes, `e2a6` 166.
- **Gates on `e29f7951`:** lint, typecheck, build, `npm test` exit 0; 58 files, 1839/1839; `last-run.json`
  success true; skip-integrity `--skip-count 0` "No findings."; `CLI_DEEP=1` cli.real-engine 10/10;
  `PERFT_DEEP=1` perft 32/32; `ENGINE_DEEP=1 -t "the full sweep, with breadth"` (A3 identity deep sweep only,
  virtual clock) 2/2 passed.
- **A6 (NFR-005) OPEN**: owed in a quiet window. Not read, not estimated.
