---
id: 20261009T213535Z-qe-e2e-observation-abc125-five-mutants-red-toequal-exact-ed9e7ff5
kind: observation
by: qe-e2e
at: 2026-10-09T21:35:35Z
verified_by:
confidence: high
refs:
  - ABC-125
  - ABC-086
  - G-QE-1
  - M5
  - src/virtual-clock.ts
  - src/engine.test.ts
supersedes:
---

# `ABC-125`: five clock mutants all red; `toEqual` on the six readings is exact

Hand-authored, no seal (degraded posture, `AGENTS.md`). The figures were re-measured at `ca3ca0f` in QE's
worktree. Runner: `.grugops/context/qe-ABC-125/probe/mutants.mjs`; raw output: `probe/mutants.out.jsonl`.
Each mutant is planted in `src/virtual-clock.ts`, and `npx vitest run src/engine.test.ts` runs twice: once
as the whole file, once as the new row alone (`-t "keeps each clock's own step"`). The runner then reverts
with `git checkout`. `git status --porcelain -- src` afterwards: empty.

| mutant | whole file | row alone | the rows that went red |
|---|---|---|---|
| none (pristine) | exit 0, 33/33 | exit 0, 1 passed / 32 skipped | — |
| `M5`: step in module state, LAST factory call wins (re-planted by QE) | exit 1, 1 failed | exit 1 | **the new row only**; received `[0,0,0.5,0.5,1,1]` |
| `M5b`: FIRST factory call wins (`sharedStep ??= stepMs`), the case the build left `UNKNOWN - verify` | exit 1, 2 failed | exit 1; received `[0,0,1,1,2,2]` | new row + `A7` "reads exactly 0, 0.5, 1 at a step of 0.5" |
| `Q1` (own): one module-level reading counter, per-clock step | exit 1, 4 failed | exit 1 | new row + `A6` "second clock starts at 0" + both `A7` reading rows |
| `Q2` (own): shared reading, reset by every factory call | exit 1, 2 failed | exit 1 | new row + `A6` "second clock starts at 0" |
| `Q3` (own): step captured lazily at a clock's first READ from module state | exit 1, 1 failed | exit 1 | **the new row only** |

- **The build's `UNKNOWN - verify` is now resolved.** The row kills first-call-wins on its own. In the whole
  file, the `A7` 0.5-step row kills it as well, but only because an earlier test already called
  `virtualClock(1)`. That kill depends on test order. The new row does not depend on it.
- **The new row is the only row in the file that kills `M5` or `Q3`.**
- **`toEqual` is exact** (`probe/float.mts`, `probe/float.out.txt`, vitest's own `@vitest/expect` matcher).
  The shipped six readings are `Object.is`-equal to the expected values. `toEqual` rejects a reading 2 ulp
  off, a string `"1"`, a `-0`, and a seventh element. No tolerance applies. Steps 1 and 0.5 are dyadic and
  every sum stays a small dyadic rational, so float equality is safe for this row. **It is not safe for a
  non-dyadic step**: `virtualClock(0.1)` reads `[0, 0.1, 0.2, 0.30000000000000004]`. A later row that uses
  a step such as 0.1 needs `toBeCloseTo`, or an expected value built by the same accumulation.
