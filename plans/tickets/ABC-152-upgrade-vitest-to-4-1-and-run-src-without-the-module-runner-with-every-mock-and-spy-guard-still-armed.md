---
id: ABC-152
title: "Upgrade vitest 3.2.7 → 4.1 and run `src/` without the module runner (`viteModuleRunner: false`): cut the lane's CPU with every mock and spy guard still armed and the result file still telling the truth"
status: backlog
column: Backlog
size: L
priority: P1
epic: —
feature: —
---

# ABC-152 — `ADR-0041` route (a): the major bump, the runner switch, the guards it could blind, and the reporter it could break

> **Cut 2026-10-11 by BA/PM** (task `wave-2026-09-25`, subtask `bapm-cut-k2-vitest41`), on the owner's word
> of 2026-10-11 (note `.grugops/context/wave-2026-09-25/notes/…fbbdde16`, item 4, verbatim):
> *"vitest - yes do a ticket and upgrade"*.
>
> - **His "yes" answers `ABC-150`'s owner question 2** (`…7dc3b488`). That question bundled route (a) with
>   its test-content change ("your R-3 call"). This ticket reads the "yes" as covering **only that change**:
>   mechanism-preserving rewrites of the spy form (`V5`). Deleting, skipping, moving or weakening a test stays
>   R-3, and stays his.
> - **His question 3 (a `deps.external` value pin) is unanswered** (`…fbbdde16` item 6). It is not in this
>   ticket.
> - **This hop measured nothing.** Every figure is cited. Counts marked "grep" were read from the tree at
>   `619abc14` by text search, with no run.

## Problem

*User*: the owner at the fanless M3 ("it was choking cpu and generating heat"), and every hop that runs
`npm test`.

*Pain*: inside vitest, production code costs **~5x** what it costs under plain `node` (E 5.009x, S 5.106x,
perft 4.328x; `ADR-0041` `D1`).
- **The cause is the module runner's cross-module interop.** Every import across `src/` reads a getter on a
  dictionary-mode namespace object. On 3.2.7 it accounts for ≥ 100 % of the excess (`ADR-0041` d1).
- **On 3.2.7, nothing admissible removes it.** The one setting that does (C4, `deps.external` over `src/`)
  turned **12 files / 47 tests red** and left 5 files unfinished. It blinds `vi.mock` and `vi.spyOn`
  (`ADR-0041` d2, `…f80e9eba`).
- **Route (a), `ADR-0041` d4:** vitest ≥ 4.1 with `test.experimental.viteModuleRunner: false`. This uses
  native import, with `vi.mock` carried by Node loader hooks.
  - Whether its mocks reach every importer is `UNKNOWN - verify`, and so is its CPU effect.
  - C4 is the nearest reading: ~100 % of the excess, inside the same worker.
- **The recoverable share is an estimate.** It was 26.0–35.8 % of lane CPU at 7 workers (`ABC-147`). At 2
  workers it is `UNKNOWN - verify` (`ADR-0041` § Consequences).

*Value*: the larger of the owner's two CPU levers, stacked on `ABC-151`'s cap. CPU that is never spent is
heat that is never made.

## Scope

1. **Architect/Design (`In Design`): an ADR, before any build.**
   - It reads vitest 4.1 in a scratch tree, never in this checkout.
   - It answers `D1`–`D4`.
   - It ends in a pre-registered split (`D4`).
2. **Software Engineer: the build.**
   - The bump, in `package.json` and the lockfile.
   - The runner setting and its pin.
   - The ruled spy-form rewrites.
   - Any reporter change the ADR rules.
   - The `ADR-0040` pin re-armed on 4.1.
3. **QE:** the screens in `V2`, `V4`–`V8`.
4. **Security/NFR:**
   - the dependency review (`V12`);
   - the width-1 window (`V9`–`V11`).

## Out of scope

- **vitest 5.x.** QE read 5.0.3 on `ABC-143`, and its import fails loudly (`RISK-ABC143-01`).
- **`isolate: false`, `vmThreads`/`vmForks`** (`ADR-0008` d7), and **any `deps.external` over production
  `src/`** (`ADR-0041` d3).
- **Re-ruling k** (that is `ABC-151`) and **a CPU level** (R-1).
- **`src/` changes** (`ADR-0041` d4b). **Test content beyond `V5`'s rewrites** (R-3).
- **The `deps.external` value pin.** That is owner question 3, which is open.
- **`ABC-146`, `ABC-095` and `ABC-096` rows:** nothing changes on them. See § Dependencies for `ABC-146`'s
  straddle.

## Acceptance (Given/When/Then)

### Design (Architect/Design: an ADR, `proposed`, read only in a scratch tree)

- **`D1` (the target).** The ADR names:
  - one vitest 4.1.x patch (QE read 4.1.11 on 2026-10-11, `…4f652dad`);
  - the matching `@vitest/coverage-v8`. Its 3.2.7 manifest peers `vitest: 3.2.7` exactly
    (`RISK-ABC143-01`), so it moves too;
  - any `vite` or Node requirement, checked against Node v26.11.0 and vite 7.3.6;
  - the `package.json` range, which must not resolve to 5.x.
- **`D2` (what 4.1 changes under this lane).** Each item is read from the 4.1 source or docs, and is
  `UNKNOWN - verify` until then:
  - **(a) the worker count's precedence.** What decides it on 4.1: `maxWorkers`, `poolOptions` (does it still
    exist?), `fileParallelism`, and `VITEST_MAX_THREADS`/`VITEST_MAX_FORKS`. This also covers whether
    `resolved-workers.mjs` still reads the truth; its own header says to re-read on an upgrade;
  - **(b) `isolate`** under `pool: "threads"` with the runner off. Does each test file still get a fresh
    module registry (`ADR-0008` d7)?
  - **(c) `viteModuleRunner: false`.** Its exact key, and whether `vi.mock` and `vi.spyOn` reach every
    importer;
  - **(d) the five reporter surfaces** of `RISK-ABC143-01`.
- **`D3` (the correctness screen: no timing, as `ADR-0041`'s C4 screen).** The full default lane runs in a
  scratch tree at 4.1, in two arms: **(i)** the runner on (the bump alone), and **(ii)** the runner off.
  For each arm, report:
  - exit code;
  - files, tests, failures and skips;
  - every red test, by name;
  - files that did not finish.

  Then rule which tests need `V5`'s rewrite. **The known-sensitive set is C4's 12 files / 47 tests plus its
  5 unfinished files.** That list is a proxy: what the runner switch on 4.1 actually touches is the screen's
  answer. Grep at `619abc14` reads 21 `vi.spyOn(` calls in 7 test files and `vi.mock(` in 16.
- **`D4` (the split, pre-registered).** **If no configuration with the runner off passes `V4` with only
  `V5`-shaped rewrites, no runner-off lever is built.** The `D3` table then goes to the owner, with two
  options: ship 4.1 with the runner on, which buys no CPU and still pays `V2` and `V12`, or stay on 3.2.7.
  **No agent picks between them.**

### Build, screens and readings

- **`V1` (the version).** **Given** head, **then**:
  - the installed `vitest` and `@vitest/coverage-v8` are `D1`'s patch;
  - `npm ls vitest @vitest/coverage-v8` exits 0;
  - no other devDependency changes major unless `D1` names it.
- **`V2` (the result file still tells the truth: `RISK-ABC143-01`).**
  - **Given** head, **when** `ABC-149`'s six REGRESSION PLANTS run in a scratch copy, **then** every row's exit
    code, file fields and query lines **read by content** match the block.
  - **The 4.x hazard is planted:** a red caused only by an unhandled error must exit non-zero and leave
    `success: false` that names it.
  - `ABC-143` `A1`–`A6` still hold.
  - If `tools/grugops/result-file-reporter.js` needs a change, it is in scope, and its plant block is updated
    in the same commit.
- **`V3` (the runner is off, and pinned).** **Given** head, **then**:
  - the resolved configuration shows `D2`(c)'s key off;
  - a value check in the default lane goes **red when the key is removed**, shown on a scratch copy. No
    wall-clock or CPU assertion.
- **`V4` (every guard still armed: the reason this ticket exists).** **Given** head, **then**:
  - every test in `D3`'s sensitive set passes, and so does every test the `D3`(ii) screen turned red;
  - **for each of those files, at least one plant in a scratch copy turns a call-count or mock-routing guard
    red at head.** The plant is an added or removed call to the spied or mocked function. It never relies on
    a guard whose expected count is 0 (`ADR-0041` d3: a blind guard can read 0 where 0 is expected);
  - **`NFR-001`** (`gameend.nfr`), **`NFR-005`** (`zobrist.nfr`) and **`ABC-025` `N1`** (`san.nfr`) are each
    shown red on a plant.

  **A green run alone is not evidence. The plants are.**
- **`V5` (test content: mechanism-preserving only).** **Then** `git diff <base> -- '*.test.ts'` contains only:
  - `D3`-ruled spy-form rewrites (for example, `vi.spyOn(ns, …)` → `vi.mock(path, { spy: true })`, or the
    form the ADR names);
  - the imports they need;
  - `V3`'s pin and `V6`'s re-arm.

  Each rewritten file is listed with its `expect` count before and after, and the counts are equal. No test is
  deleted, skipped, moved to an opt-in lane or merged. File count = base. Test count = base + the pins
  declared in the ADR before any reading. Skips 0.
- **`V6` (`ADR-0040`'s cap means the same thing on 4.1).** **Given** head, **then**:
  - resolved effective workers = **k (2, after `ABC-151`)**;
  - the `ABC-144` `A7` pin passes;
  - its reds are re-planted on 4.1 and each is red: delete the cap, `isolate: false`, an env raise to 8, and
    an env raise to k + 1.
  - If `D2`(a) finds a key or variable renamed or removed, the ADR amends `ADR-0040` d3 and the pin follows.
  - **`QE-144-a`'s trigger fires here** (the pin does not read `test.projects`). The ADR rules on it.
- **`V7` (isolation is kept: `ADR-0008` d7/d8).** At head:
  - `isolate` resolves `true`;
  - **≥ 20 consecutive green `npm test` runs**, each with every `*.nfr.test.ts` file passing.
- **`V8` (the lanes collect the same things).** At head:
  - `npm test` collects the **same file paths** as base, compared as a list by path, not as a count;
  - each opt-in lane (`PERFT_DEEP`, `SEARCH_DEEP`, `ENGINE_DEEP`, `INPUT_DEEP`, `ZOBRIST_DEEP`, `PUZZLE_DEEP`,
    `CLI_DEEP`, `LADDER_DEEP=1`) collects the same files and tests as base and exits 0, with its wall
    reported;
  - `npx vitest run --coverage` exits 0;
  - a lane whose result rests on a wall-clock budget may read differently because the engine runs faster.
    That is reported and routed, **never fixed by moving a baseline here**.
- **`V9` (CPU goes down: the bar).** **Given** base = the wave tip with `ABC-151` (k = 2) and `ABC-149`
  merged, and head = base + this ticket, **when** the full lane is read with `ABC-144`'s instrument
  (`lane144.mjs`, `ADR-0035` d2, identity twin, n ≥ 8 scored rounds, rotated, round 0 discarded, width 1,
  unprofiled), **then** the twin is admissible, and:
  - **a paired median CPU delta of ≤ −15 % of base** merges;
  - **a delta between −15 % and 0, with the interval wholly below 0,** goes to the owner;
  - **any other result does not merge**, and goes to the owner with the `D3` table.

  The bar is the measured lane CPU. `ADR-0041`'s ratios and `ABC-147`'s R are never quoted as `V9`. **The
  number is never weakened silently.**
- **`V10` (the wall does not rise).** **Then** head's paired median wall delta is ≤ + the twin's wall R, and
  head's median wall + R is ≤ W (10 s).
- **`V11` (heat, reported, with no bar).** `thermalpressurelevel` is logged before and after every `V9` run.
  The count of runs at level ≥ 1 is reported per arm. If head's count is higher than base's, that goes to the
  owner.
- **`V12` (the dependency change is reviewed, and there are 0 production lines).**
  - **Security/NFR reviews:**
    - the lockfile diff: packages added and removed, licences, and install scripts;
    - `npm audit` (dev and `--omit=dev`) at base and at head. `--omit=dev` must stay 0;
    - the effect on `AR-1`'s three advisories. `ABC-056`'s row gets a pointer.
  - `git diff --name-only <base> <head> | grep -v '\.test\.ts$' | grep '^src/'` is **empty**.

## Dependencies

- **`ABC-149` merges first.** Its plant set is `V2`'s instrument (`ADR-0041` d4a).
- **`ABC-151` merges first.** Both edit `vitest.config.ts` and the `A7` pin, and `V9`'s base carries k = 2.
  The ADR hop (`D1`–`D4`) may run before either merge, because it reads only a scratch tree.
- **A no-other-hop window for `V9`–`V11`**, scheduled by the Orchestrator. It never overlaps `ABC-146`'s
  verdict run.
- **The straddle rule (`ADR-0040` d5).** Any paired reading in flight whose base and head straddle this merge
  is void. This includes:
  - `ABC-146` `A1`'s `LADDER_DEEP=1` equivalence check, which runs inside vitest;
  - `ADR-0035`'s floors `F`, which the ADR states carry over or must be re-read.
- **`ABC-056`** (`AR-1`, owner Release Manager): this ticket performs the coverage-v8 major upgrade that
  `ABC-056` priced.

## Security / NFR triggers

- **Security: triggered.** It is a dependency major bump (`V12`). The review covers the lockfile, the
  licences, the install scripts and the audit.
- **`NFR-008`:** wall ≤ W (`V10`); CPU is reported, and `V9` is a ticket target.
- **`NFR-001`, `NFR-005`, `ABC-025` `N1`:** `V4`'s plants and `V7`'s screen.
- **`N8-LANE`:** + the declared pin tests, 0 test files, 0 spawns.

## Test notes

1. **The screens come before the clock.** `D3`, `V4` and `V7` gate `V9`. A fast lane whose mocks went blind is
   not a fast lane (`ADR-0041` d3).
2. **Every reading lives in the notes**, with its machine, load1, thermal level, commit and vitest version.
3. **No `V` reading is profiled.** `--cpu-prof` hung 5 of 18 runs (`RISK-ABC147-01`).
4. **Mandatory gates:** lint, typecheck, build, `npm test`. Then QE, then `In Security/NFR`.
5. **UAT:** the zero-production-lines waiver applies only if `V12`'s diff check is empty.
6. **`AGENTS.md`'s `vitest` lines** (the worker cap, `RISK-ABC143-01`, the Stack line) are re-read after the
   merge by the Scribe.

## Size and priority

**`L`.** A dependency major bump, an ADR with a two-arm correctness screen, up to 7 rewritten test files
(grep), plants across about 12 files, a possible reporter change, a Security review, a 20-run screen, a window
and the opt-in lanes.
- **Not `M`:** this is `ABC-150`'s window and screen plus the test content and the dependency.
- **Not `XL`:** one dependency, one setting, no production code, and `D4` closes it early if the switch is
  inadmissible.
- **Considered and not split:** "bump" and "runner off" as two tickets. The bump alone has no CPU value, and
  `D4` already sends that option to the owner.

**`P1`.** The owner asked for it today, by name, for his P1 goal.
- **Not `P0`:** nothing is broken.

## Definition of Ready

BA/PM, 2026-10-11. **Result: 10 of 10.** Recommended placement: **`Ready`, then `In Design`** for the ADR.
`D1`–`D4` read a scratch tree and do not wait on the merges. The build waits for `ABC-149` and `ABC-151`.

| # | item | verdict |
|---|---|---|
| 1 | problem clear | **✅** ~5x factor, cause named, the one admissible route |
| 2 | scope and out-of-scope clear | **✅** 5.x, isolation, `deps.external`, k, `src/`, other R-3 and the open pin are fenced off |
| 3 | INVEST-shaped | **✅** one bump, one setting; a pre-registered split in `D4` |
| 4 | acceptance testable and measurable | **✅** a named patch; the plants by content; red-on-removal pins; a plant red per sensitive file; equal `expect` counts; resolved k; 20 green runs; equal path lists; ≤ −15 % measured CPU with an owner band; wall ≤ + R and ≤ W |
| 5 | dependencies known | **✅** `ABC-149` and `ABC-151` first, a window, the straddle, `ABC-056` |
| 6 | security/NFR triggers with a measurable target | **✅** lockfile review and audit `--omit=dev` = 0; `NFR-008` |
| 7 | test notes present | **✅** six |
| 8 | size assigned | **✅** `L` |
| 9 | priority assigned | **✅** `P1` |
| 10 | no major unresolved blocker | **✅** the owner's yes covers the bump and `V5`; the 4.1 unknowns are the design hop's job |

Column moves are the Orchestrator's.
