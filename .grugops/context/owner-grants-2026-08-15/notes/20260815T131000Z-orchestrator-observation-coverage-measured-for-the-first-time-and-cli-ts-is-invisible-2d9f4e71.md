---
id: 20260815T131000Z-orchestrator-observation-coverage-measured-for-the-first-time-and-cli-ts-is-invisible-2d9f4e71
kind: observation
by: orchestrator
at: 2026-08-15T13:10:00Z
verified_by: 
confidence: high
refs:
  - ABC-042
  - N8-SPAWN
  - NFR-008
  - quality.coverage_threshold
  - memory-bank/60-progress.md
supersedes: 
---

# Orchestrator Observation — coverage measured for the first time in this project's life, and the module that just merged is invisible to it

## What was run, and what had never been run

`npx vitest run --coverage` on `main` @ `7313156`. **Apple M3, Darwin 25.5.0 arm64, Node v24.12.0,
vitest 3.2.7.** `UNKNOWN - verify` elsewhere. Exit 0, 856/856 on 30 files, 2.79 s.

**`@vitest/coverage-v8` has been sitting in `devDependencies` and nothing has ever invoked it.** No
`package.json` script mentions coverage. `vitest.config.ts` carries no `coverage` key. `AGENTS.md`
has no coverage command in any slot. `.grugops/factory.config.json` sets
`quality.coverage_threshold: 0.8` and `quality.mandatory_gates: ["lint","typecheck","unit","build"]`.

**So the bar had a number, an installed instrument, and nothing connecting them.** This is the same
class this project has now found four times: a stated rule with no live instrument
(`ABC-058`'s three security-bar instruments, `ABC-059`'s spelling-not-fact guard, `ABC-050`'s
unguarded lane-runner config).

## The numbers, both denominators

| denominator | % stmts | % branch | % funcs | % lines | vs `0.8` |
|---|---|---|---|---|---|
| all files | **79.15** | 99.14 | 97.64 | 79.15 | **NOT MET** |
| `src/` | **97.29** | 99.48 | 100 | 97.29 | **MET** |
| `tools/grugops/` (2 files, 279 lines) | 0 | 0 | 0 | 0 | — |

**Two files nobody has ever tested decide whether this project is above or below its own coverage
bar.** `licence-check.js` (1–73) and `test-skip-integrity.js` (1–206) are tooling, not product — and
`test-skip-integrity.js` is the very script the test-integrity gate step runs on every hop.

**The denominator is the whole question, and it is the SAME SHAPE as `N8-LANE`'s** — the defect
`ABC-026` was cut to fix, one file down. *"5% of the lane as it stands"* versus *"5% of a fixed
total"* is exactly *"coverage of everything the runner can see"* versus *"coverage of `src/`"*.
**Not resolved here. Choosing a denominator is setting a bar, and a bar is not the Orchestrator's.**

## The finding that outranks the number

**`src/cli.ts` reads 0% statements, 0% lines, uncovered 43–93.** It is the entry point `ABC-042`
merged today, and it is **not untested** — `src/cli.test.ts` holds 29 tests that exercise it by
**spawning it as a child process**. V8 coverage instruments the process it runs in; it does not
follow a `child_process` boundary.

**The module is thoroughly tested and completely invisible to the instrument at the same time.**

Three consequences, recorded before someone trips on them:

1. **A coverage gate adopted as written would go RED on the best-tested new module in the
   repository** — and the natural "fix" is to delete the child-process tests in favour of in-process
   ones, which would delete the security instrument. `ABC-042`'s whole `G1` history is that same
   trade seen from a different side.
2. **One test strategy is now blind to three instruments.** Child spawning cost `N8-LANE` 1236 ms
   (which is why `N8-SPAWN` exists), it is invisible to line coverage, and Security/NFR separately
   recorded that the 3 s wall clause has no account and spawning is the first cost it can see.
   **Three bars, one strategy, all three surprised by it.**
3. **`cli-options.ts` at 100% is the counter-example that proves the split was right.** `A3`/`A4`
   forced the pure resolver into its own module so 1000 random resolutions could run without
   spawning. That decision, made for lane cost, is also the reason 156 of the 249 lines `ABC-042`
   delivered ARE visible to coverage.

## Not repaired, and by whose choice

**Nothing was changed.** No script added, no `vitest.config.ts` key, no threshold moved, no gate
added. Adding a `coverage` command to `AGENTS.md` is the **AGENTS.md Scribe's** (and it must be RUN
before it is recorded, which it now has been). Choosing the denominator and deciding whether coverage
joins `mandatory_gates` is **BA/PM's at a cut** or the **Factory Coach's**, under the owner — and
`mode` is lean, so the Coach's trigger is the owner's.

**The measurement is the deliverable here, not a fix.**
