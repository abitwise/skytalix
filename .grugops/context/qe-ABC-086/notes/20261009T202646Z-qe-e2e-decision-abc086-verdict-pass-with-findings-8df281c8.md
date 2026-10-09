---
id: 20261009T202646Z-qe-e2e-decision-abc086-verdict-pass-with-findings-8df281c8
kind: decision
by: qe-e2e
at: 2026-10-09T20:26:46Z
verified_by:
confidence: high
refs:
  - ABC-086
  - ABC-084
  - ABC-085
  - ABC-087
  - ADR-0027
  - NFR-004
  - N8-LANE
  - src/virtual-clock.ts
  - src/engine.ts
  - src/engine.test.ts
  - 20261009T202646Z-qe-e2e-observation-abc086-gates-deep-lane-criteria-reread-443237bf
  - 20261009T202646Z-qe-e2e-observation-abc086-cross-process-and-slice-floor-is-a-ceiling-1e512aa1
  - 20261009T202646Z-qe-e2e-observation-abc086-step-guard-and-a4-aliasing-82f4e3ed
  - 20261009T202646Z-qe-e2e-observation-abc086-own-mutants-0df7078c
supersedes:
---

# `ABC-086` QE verdict: **PASS WITH FINDINGS** at `82cccba`

Hand-authored, no seal. This is a `decision`, not a `finding`: no `§14-gate` verdict exists on
this install. Diff under review `1eae90c...82cccba`. QE's own probes re-measured every figure
below (`.grugops/context/qe-ABC-086/probe/`).

## Criteria

| | reading | result |
|---|---|---|
| `A1` | deep 300/300 green; depth ≥ 4 on 24/30 (floor 15), QE's own count; slice 30/30, 15/15 at d2; rows import the shipped module | **MET** |
| `A2` | `e2a6@d5` ×10, 3 002–3 028 ms, legal, identity not asserted | **MET** |
| `A4` | delivered-diff grep 0 hits; module row green | **MET as written** (G-QE-3) |
| `A5` | (i) `cli.ts:175` unchanged; (ii) `tsc` graph of `cli.ts`, 29 modules, no `virtual-clock.ts`, and the same 29 from the row's walk; (iii) 0 non-comment lines in `engine.ts` | **MET** |
| `A6` | deep 10/10 per engine; state row green | **MET as written** (G-QE-1) |
| `A7` | 5/5 `RangeError`; exact readings at 0.5 and 1 | **MET** (G-QE-2) |

Gate at `82cccba`: lint, typecheck and build exit 0. `npm test` 49 / 1530 / 0 skipped. Skip count
0, integrity `No findings.`. `host-protection.js` exit 2 (`UNKNOWN - verify`). `ENGINE_DEEP` exit
0, 45 passed, 291.9 s.

## The five focus questions

1. **Cross-process determinism: holds.** 450 rows (5 budget/step configurations × 30 positions
   × 3 processes: forward, reverse and warmed-up) agree on move, score, depth, nodes and elapsed.
   0 differ.
2. **Step guard:** the five named steps and every non-number throw. **Small positive steps pass
   and run for budget/step × ~1 020 nodes.** `0.001` takes 13.8 s per search at budget 2;
   `≤ 1e-9` effectively never ends; `1e-17` and `MIN_VALUE` **freeze** below the deadline. Huge
   steps terminate at depth 1, with `elapsedMs` `Infinity` and then `NaN`.
3. **The slice floor is a ceiling, and it is a real guard.** At budget 2 / step 1 the depth is
   1 or 2 by construction. The margin to the floor is 635–985 nodes, not tight. The
   "jumps the budget in one read" mutant (`R1`) reds the floor and nothing else. The slice never
   reaches LMR depths; that is deep-lane-only.
4. **`A4` aliasing:** it catches `globalThis.Date.now` and `const n = Date.now`. It misses
   destructuring, bracket access, `new Date()`, an aliased `perf_hooks` import, `process.uptime`,
   `crypto` and `Temporal.Now`. All were confirmed live.
5. **Mutants:** 12 planted. 9 killed, 2 equivalent, **1 survives (M5, a module-level step)**.

## Gaps

- **G-QE-1 (LOW–MEDIUM, test gap; the code is correct).** A module-level step survives the whole
  `ABC-086` suite, both lanes. The `A6` interleaved row is blind to clock state by construction
  (relative deadline, synchronous calls); only the per-instance row sees a shared *reading*.
  Remedy, verified green-on-shipped and red-on-M5: one ≈ 0 ms default row, two live clocks at
  steps 1 and 0.5, interleaved reads `[0, 0, 1, 0.5, 2, 1]`. QE does not add it (fenced:
  `src/`). The Engineer can add it on a licensed touch of `src/engine.test.ts`, before `ABC-085`
  builds on it.
- **G-QE-2 (LOW, design limit; tell the harness authors).** The guard stops the five named steps
  only. A small positive step is the `ADR-0027` dial and cannot be refused without knowing the
  budget, but a units slip such as `virtualClock(0.001)` silently costs 14 s per move at budget 2.
  A step below about 1e-16 × budget is a frozen clock. Also: a reused clock with a non-dyadic step
  shifts node counts by one interval (move and depth identical 60/60 in the probe). For
  `ABC-084`/`ABC-085`/`ABC-087`: a fresh clock per move or a dyadic step, and a sane lower bound on
  the step in the harness.
- **G-QE-3 (LOW, criterion robustness).** `A4` is a spelling grep. It is met as written, and it
  is weaker than test note 1 claims against aliasing. Mitigated: the 37-line module was read by
  eye, and a reading-changing stray clock would also break `A7` and the cross-process identity.
- **Info.**
  - The ticket's `A4` cites `src/engine.ts:452`; the line is now `:457` (the comment edit). Noted
    in the build.
  - The test's move label appends `promotion` (`0` = `EMPTY`) to every move (`e2a60`). This is
    cosmetic in failure text; the identity is unaffected.
  - The `RangeError` message reads `got 1` for `"1"`, `1n`, `[1]` and `new Number(1)`.
  - `Symbol` throws `TypeError`, not `RangeError`.
  - The `AGENTS.md` `ENGINE_DEEP` / `npm test` lines are still stale (Scribe, already owed).
    QE's reading for that line: 45 passed (32 default), 291.9 s.

## Routing

Security/NFR is **not triggered**: no shipped-path change. `A5` confirms that `cli.ts`'s graph
excludes the module and that the `engine.ts` diff is comment-only, so `NFR-004` is unchanged.
`N8-LANE` is the Engineer's reading (+35 ms); QE did not re-run the instrument. **`ABC-086` may
leave `In Review`.** The board move is the Orchestrator's. G-QE-1 is not a blocker: `A6` is met as
written, and the remedy is one row.
