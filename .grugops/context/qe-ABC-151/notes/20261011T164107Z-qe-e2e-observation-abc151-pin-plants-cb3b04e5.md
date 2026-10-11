---
id: 20261011T164107Z-qe-e2e-observation-abc151-pin-plants-cb3b04e5
kind: observation
by: qe-e2e
at: 2026-10-11T16:41:07Z
verified_by:
confidence: high
refs:
  - ABC-151
  - ABC-144
  - ADR-0040
  - ADR-0008
  - QE-151-a
  - QE-151-b
  - QE-144-b
  - src/cli.test.ts
  - vitest.config.ts
  - 20261011T163112Z-software-engineer-observation-abc151-reds-counts-gates-d73145f6
  - 20261011T114054Z-qe-e2e-observation-abc144-pin-plants-21613086
supersedes:
---

# QE `ABC-151`: the `A7` pin re-planted at k = 2. All 8 addendum-2 rows behave as designed. Of QE's 19 extras, 15 go red as designed; 2 survive (`QE-151-a`), 1 is a false red (`QE-151-b`), 1 is the known CLI route

This note is hand-authored and unsealed (`AGENTS.md`: no `finding` is admissible on this install). Every row
was RUN by QE on 2026-10-11. **No timing was read.**

**Method (as `qe-ABC-144`, `…21613086`):**
- one fresh `git archive fc4ebb33` copy per row, outside the repository, with `node_modules` linked and one
  change applied;
- each config change must hit its anchor exactly once, or the script throws;
- the pin runs once with `npx vitest run src/cli.test.ts -t "ABC-144"`;
- `eff` is the Architect's `resolved-workers.mjs`, run on the same copy under the same environment.

Script and raw output: `../probe/plants.mjs`, `../probe/plants.out.tsv`. q6 and q8 were re-run with a fixed
message regex (`../probe/plants-rerun-q6-q8.tsv`). On the first pass they were RED too, but the regex had
caught vitest's "Errors 1 error" summary.

## `ADR-0040` addendum 2 item 4: the armed reds and the two greens. 8 of 8 as designed

| id | change | pin | message | resolved |
|---|---|---|---|---|
| control | none | green, 1 passed / 67 skipped | — | eff 2, isolate true |
| r1 | delete `maxWorkers: 2` | **RED** | `expected undefined to be 2` | eff 7 |
| r2 | add `isolate: false` | **RED** | `expected false to be true` | isolate false |
| r3 | `VITEST_MAX_THREADS=8` | **RED** | `VITEST_MAX_THREADS: expected 8 to be less than or equal to 2` | eff 8 |
| r3b | `VITEST_MAX_THREADS=3` | **RED** | `VITEST_MAX_THREADS: expected 3 to be less than or equal to 2` | eff 3 |
| raise3 | `maxWorkers: 3` (a revert) | **RED** | `expected 3 to be 2` | eff 3 |
| lower2 | `VITEST_MAX_THREADS=2` | green (as designed) | — | eff 2 |
| lower1 | `VITEST_MAX_THREADS=1` | green (as designed) | — | eff 1 |

Every message matches the SE's table (`…d73145f6`). r3b is red, so the stale `≤ 3` boundary is caught.

## QE's extras (the `ABC-144` set re-targeted at 2, plus the env parser's edges)

| id | change | pin | message / what it shows | resolved |
|---|---|---|---|---|
| x1 | `maxWorkers: 4` | RED | `expected 4 to be 2` | eff 4 |
| x2 | add `fileParallelism: false` | RED | `expected false to be true` | eff 1 |
| x3 | add `poolOptions.threads.maxThreads: 2` (same value, forbidden key) | RED | `expected { threads: { maxThreads: 2 } } to be undefined` | eff 2 |
| x3b | add `poolOptions.threads.maxThreads: 8` | RED | `… { maxThreads: 8 } } to be undefined` | eff 8 |
| x4 | `VITEST_MAX_FORKS=3` | RED | `VITEST_MAX_FORKS: expected 3 to be ≤ 2` | eff 2 |
| x4b | `VITEST_MAX_FORKS=8` | RED | `VITEST_MAX_FORKS: expected 8 to be ≤ 2` | eff 2 |
| q1 | `pool: "forks"` | RED | `expected 'forks' to be 'threads'` | eff 2 |
| q2 | `maxWorkers: "50%"` | RED | `expected '50%' to be 2` | eff 4 |
| q2b | `maxWorkers: "2"` (a string) | RED | `expected '2' to be 2` | eff 2 |
| q3 | `maxWorkers: 1` | RED | `expected 1 to be 2`. A lowering in the config is a ruling too | eff 1 |
| q4 | `poolOptions.threads.isolate: false` | RED | `poolOptions` must be undefined | eff 2 |
| q6 | add `minWorkers: 8` | RED, the whole run | `RangeError: options.minThreads and options.maxThreads must not conflict` | eff 2 |
| q8 | `VITEST_MAX_THREADS=abc` | RED, the whole run | `RangeError: Invalid array length` | eff null |
| q12 | `VITEST_MAX_THREADS=3abc` | RED | `expected 3 to be ≤ 2` (both parsers read 3) | eff 3 |
| q14 | `VITEST_MAX_THREADS=' 3'` | RED | `expected 3 to be ≤ 2` | eff 3 |
| **q11** | `VITEST_MAX_THREADS=0x3` | **green: survives** | `QE-151-a` | **eff 3** |
| **q11b** | `VITEST_MAX_THREADS=0x8` | **green: survives** | `QE-151-a` | **eff 8** |
| q13 | `VITEST_MAX_THREADS=` (empty) | RED: **a false red** | `expected NaN to be ≤ 2`, while vitest ignores the empty value | eff 2 (`QE-151-b`) |
| q9 | `--maxWorkers=8` on the narrow-set command line | green: survives | the known route `QE-144-b`. The probe takes no CLI flags, so its eff 2 is not this run's | eff 2 (n/a) |

## Why q11 and q11b survive: two parsers disagree (`QE-151-a`)

- **vitest 3.2.7 parses the variable with no radix:** `Number.parseInt(process.env.VITEST_MAX_THREADS)`
  (`node_modules/vitest/dist/chunks/coverage.DfSpMS-b.js:3723`, `:3727`; `VITEST_MAX_FORKS` the same at `:3745`,
  `:3749`). With no radix, a `0x` prefix is read as hexadecimal, so `"0x3"` becomes 3.
- **The pin parses it with radix 10:** `Number.parseInt(raw, 10)` (`src/cli.test.ts`, the `ABC-144 A7` env loop).
  So `"0x3"` becomes 0, and `0 ≤ 2` passes.
- **The raise is real at runtime, not only in the resolver.** QE ran six one-test probe files that each record
  `VITEST_POOL_ID`, on a scratch copy of the head (`../probe/rt.sh`). Under `VITEST_MAX_THREADS=0x3`, 3 distinct
  pool slots ran, and the pin is green. The probe's discrimination is in the readings note (`…6774ed96`).
- **Not introduced by this ticket.** The radix-10 parse came in with `ABC-144`'s pin (`d4468fd3`). `ABC-151`
  changed only its bound, 3 → 2. QE ran q11b at base `f439c8fd` (k = 3): the pin is green and resolves eff 8
  (`../probe/plants-base-f439c8fd-q11b.tsv`). So the route is the same at base.
- **Shape of a fix (QE does not write it):** parse as vitest does, `Number.parseInt(raw)` with no radix, or
  assert `Number(raw)` and the radix-less parse both. `ABC-152` already owns re-reading these variable names on
  vitest 4.1 (`ADR-0040` addendum 2, "What this does NOT change"), so it is the natural carrier.

## Not added

QE added no test to the repository. The probe files ran only in scratch copies. The scratch copies were deleted,
and no plant touched the worktree.
