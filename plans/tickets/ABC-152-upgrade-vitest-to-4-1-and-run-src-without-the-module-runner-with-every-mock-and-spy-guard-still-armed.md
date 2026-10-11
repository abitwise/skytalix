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

> **Re-cut 2026-10-11 by BA/PM** (task `wave-2026-09-25`, subtask `bapm-recut-ABC-152`) to the owner's route, as
> ruled in `ADR-0042`'s addendum (`aff180c7`; decision `…f9b73048`, hand-off `…80a214d3`). The first cut was
> subtask `bapm-cut-k2-vitest41` (`59f78226`), on *"vitest - yes do a ticket and upgrade"* (`…fbbdde16` item 4).
>
> - **The owner's word, 2026-10-11** (`.grugops/context/wave-2026-09-25/notes/…06bfc2d7`, item 2, verbatim):
>   *"Vitest - upgrade and fix/upgrade tests as well, use one ticket for it, include CPU saving."*
>   - It **replaces** the first cut's reading that his "yes" covered only spy-form rewrites.
>   - **`D4` is answered:** the runner is off, the tests are reworked, and both happen in this ticket.
> - **The test rework in scope** is the addendum's admitted content: forms R1–R5 (ruling 1), `san.test.ts` A20's one
>   assertion (ruling 2) and `src/book.test.ts` ABC-094 A2's one import (ruling 3). Each rewritten guard is
>   plant-checked (`V4`).
> - **These stay the owner's** (ruling 7): deleting, skipping, moving, merging or weakening a test, and any guard
>   that no admitted form arms. **Found so far: 0.**
> - **The `deps.external` pin question is closed:** no separate ticket (`…06bfc2d7` item 3). `V3` is the guard now.
> - **The owner then accepted `ADR-0042` with its addendum, and `RISK-ABC152-A2-GRAPH`** (`…c9b52bb2`, verbatim:
>   *"1. ADR-0042 - accept ; 2. yes"*). That clears the merge hold.
> - **This hop measured nothing.** Every figure is cited from `ADR-0042`, its addendum or their notes.

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
  - On 4.1.11 with the runner off, **98 tests in 13 files go red** (`ADR-0042` `D3`). In the screen, the
    addendum's forms take that to 1 red (`F3`, post-hoc). That 1 red is ruling 2. **No guard was
    plant-checked in that screen.** That is `V4`'s job.
  - Its CPU effect is `UNKNOWN - verify` (`V9`). C4 is the nearest reading: ~100 % of the excess, inside the same
    worker.
- **The recoverable share is an estimate.** It was 26.0–35.8 % of lane CPU at 7 workers (`ABC-147`). At 2
  workers it is `UNKNOWN - verify` (`ADR-0041` § Consequences).

*Value*: the larger of the owner's two CPU levers, stacked on `ABC-151`'s cap. CPU that is never spent is
heat that is never made.

## Scope

1. **Architect/Design: done.** `ADR-0042` (`D1`–`D4`) and its addendum (rulings 1–7) were read in scratch trees.
   The owner accepted the ADR with its addendum on 2026-10-11 (`…c9b52bb2`).
2. **Software Engineer: the build**, following the addendum's build plan (`…80a214d3`):
   - **the bump:** `vitest` and `@vitest/coverage-v8` `~4.1.11`, and `vite` `~7.3.6` as a direct
     devDependency, plus the lockfile (`npm install`, no `--force`);
   - **`experimental: { viteModuleRunner: false }`** in `vitest.config.ts`, plus one header paragraph (ruling 4);
   - **the pin:** `A7` edited in place, plus one new `it` for `V3` (ruling 4, `probe/pin-prototype.diff`);
   - **the reporter:** the route, its header and its plant block, in one commit (ruling 5);
   - **the test rework:** R1, R2, R3 + R5, R4 + R5, ruling 2 and ruling 3, one commit per form;
   - **the plants (`V4`):** each recorded with its diff and its red message.
3. **QE:** `V2` (with `M9b`) and `V4`–`V8`.
4. **Security/NFR:** the dependency review (`V12`) and the width-1 window (`V9`–`V11`).

## Out of scope

- **vitest 5.x.** QE read 5.0.3 on `ABC-143`, and its import fails loudly (`RISK-ABC143-01`).
- **`isolate: false`, `vmThreads`/`vmForks`** (`ADR-0008` d7), and **any `deps.external` over production
  `src/`** (`ADR-0041` d3).
- **Re-ruling k** (`ABC-151` merged k = 2) and **a CPU level** (R-1).
- **`src/` changes** (`ADR-0041` d4b).
- **Test content beyond the addendum's admitted forms** (R1–R5, ruling 2, ruling 3 and the pins). A test that is
  deleted, skipped, moved to an opt-in lane, merged or weakened is the owner's (ruling 7).
- **A sixth rewrite form.** If no admitted form arms a guard, the build stops and the owner rules (ruling 7).
- **Pinning `experimental.nodeLoader`.** Turning it off fails loudly (ruling 1).
- **The `ABC-146`, `ABC-095` and `ABC-096` rows:** nothing changes on them. See § Dependencies for `ABC-146`'s
  straddle.

## Acceptance (Given/When/Then)

### Design: met

**`D1`–`D4` are met in `ADR-0042` (`ACCEPTED`) and its addendum.** The first cut's text for them is in `59f78226`.
`D4` fired, and the owner's pick answered it (see the banner).

### Build, screens and readings

- **`V1` (the version).** **Given** head, **then**:
  - the installed `vitest` and `@vitest/coverage-v8` resolve from `~4.1.11`, and `vite` resolves from `~7.3.6`;
  - `npm ls vitest @vitest/coverage-v8 vite` exits 0;
  - no other devDependency changes major.
- **`V2` (the result file still tells the truth: `RISK-ABC143-01`, ruling 5).** **Given** head, **when** `ABC-149`'s
  six REGRESSION PLANTS run in a scratch copy, **then**:
  - **all six rows**, including the **exit-code-only row**, match the block **by content**: the exit code, the
    file fields and the query lines.
  - **The unhandled row's plant awaits its timer.** It throws from a `setTimeout(…, 0)` and then awaits a 50 ms
    timer. That form exits non-zero, and the reporter names `PLANT-timer` in `unhandledErrors` with
    `success: false`. The un-awaited form is not admitted, because it races on 4.1.11: 5 of 10 runs exited 0.
  - **`M9b` (`QE-149-c`):** QE re-runs it (a report-time write of `runState` / `exitCode` from
    `process.exitCode`). The exit-code-only row kills it.
  - **`QE-149-a`:** the READ IT query is joined onto the line that carries its closing `'`. That one join is the
    whole change. Pasted with its line breaks, the query prints the row's lines.
  - `ABC-143` `A1`–`A6` still hold. They run as well as the rows, **never instead of one**.
  - The reporter's route (`onTestRunEnd` and a load-time check) and its plant block change **in one commit**.
- **`V3` (the runner is off, and pinned).** **Given** head, **then**:
  - the resolved configuration shows `test.experimental.viteModuleRunner` as `false`
    (`design-ABC-152/probe/resolved-workers-v4.mjs`);
  - one new `it` in `src/cli.test.ts` asserts that the key is exactly `false`. On a scratch copy it goes red when the
    key is deleted, and red when the key is `true`. It makes no wall-clock or CPU assertion.
- **`V4` (every guard still armed: the reason this ticket exists).** **Given** head, **then**:
  - **The set** is three groups, and every test in it passes:
    - the 13 files that `D3`'s runner-off arm turned red: `cli`, `render-seam`, `command-input`, `san`,
      `tools/opening-book/book`, `gameend.nfr`, `glyph-mode.nfr`, `history-pane.nfr`, `san.nfr`,
      `status-panel.nfr`, `turn-loop.nfr`, `turn-loop` and `zobrist.nfr`;
    - `src/book.test.ts`;
    - C4's set (`…f80e9eba`).
  - **Armed (ruling 1):** for each file in the set, at least one plant turns a call-count or mock-routing guard
    **red** at head. The plant goes in a scratch copy outside the repository, in production code (`src/*.ts` or
    non-test `tools/**`). It adds or removes **one call** to the spied or mocked function, on the path the test
    drives. **For an expected-0 guard, the plant adds the call.** Each plant is recorded with its diff, its red
    message and the file.
  - **Per form:**
    - R2 gets two plants: delete the `mockImplementation` line, and delete the `finally` reset. For the second,
      if no later test in the file reads the real function, record "no leak reader" and do not invent one.
    - R3's extra call reads `called 1 times, but got 2`.
    - R5 in `command-input` is planted inside the deps path of `PRODUCTION_DEPS` (`src/move-input.ts:108`).
  - **`glyph-mode.nfr` (`NFR-007`):** one plant per spied module (`node:fs`, `node:fs/promises`,
    `node:child_process`), and each is red.
  - **`NFR-001`** (`gameend.nfr`), **`NFR-005`** (`zobrist.nfr`) and **`ABC-025` `N1`** (`san.nfr`) are each
    shown red on a plant.
  - **`san.test.ts` A20 (ruling 2):** it is red on an added `export const PLANT`, and red on an added
    `export { toSan as toSanX }`.
  - **`src/book.test.ts` ABC-094 A2 (ruling 3):** a load-time salt plant in `book.ts` is red at head. The same
    plant is also shown green, and so blind, under the old `vi.resetModules()` form.
  - **The stop rule (ruling 7).** Either of these stops the build. It then goes to the owner via the Orchestrator,
    with its reading:
    - a guard that stays green under every admitted form;
    - a test that only a deletion, a skip, a move, a merge or a weaker assertion would turn green.

  **A green run alone is not evidence. The plants are.**
- **`V5` (test content: the admitted forms only).** **Then** `git diff <base> -- '*.test.ts'` contains only:
  - the R1–R5 rewrites (ruling 1) and the imports they need;
  - ruling 2's one assertion, with its one comment sentence;
  - ruling 3's one import;
  - `V3`'s new `it` and `V6`'s edited `A7`.

  Each rewritten file is listed with its `expect(` count before and after.
  - **The counts are equal per file, except `src/cli.test.ts`, which is +3** (`A7` 6 → 8, and `V3` +1).
  - No test is deleted, skipped, moved to an opt-in lane or merged.
  - **Files = base (56). Tests = base + 1 (1741). Skips 0.**
- **`V6` (`ADR-0040`'s cap means the same thing on 4.1, ruling 4).** **Given** head, **then**:
  - the resolved effective workers are **k = 2**, and `isolate` is `true` (`resolved-workers-v4.mjs`);
  - **the `ABC-144` `A7` pin is edited in place, and it passes.** It asserts:
    - `pool` is `"threads"`, and `maxWorkers` is exactly 2;
    - `fileParallelism` and `isolate` are both `true`;
    - `Object.hasOwn(test, "poolOptions")` is `false`;
    - `test.projects` is `undefined`;
    - **`VITEST_MAX_WORKERS`**, when it is set and non-empty, is parsed as vitest parses it, to **1 ≤ n ≤ 2**.
      That parse is `Number.parseInt` with no radix, with the `biome-ignore` that ruling 4 gives.
  - The `VITEST_MAX_THREADS` / `_FORKS` loop is dropped, because 4.x reads neither variable.
  - **Reds (11):** each is re-planted on a scratch copy, and each is red. They are: r1, delete `maxWorkers`; r2,
    `isolate: false`; r3, `VITEST_MAX_WORKERS=8`; r3b, `=3`; r4, a `projects` entry; `maxWorkers: 3`;
    `fileParallelism: false`; a `poolOptions` entry; `=0x3`; `=0`; and `=abc`.
  - **Greens:** `VITEST_MAX_WORKERS=` (empty), `=1` and `=2`.
  - **Folded by name:** `QE-151-a` (the hex raise: `=0x3` is red) and `QE-151-b` (an empty value is ignored).
    **`QE-144-a` closes**, because the pin now reads `test.projects`.
  - In `vitest.config.ts`'s header, `VITEST_MAX_WORKERS` replaces the 3.x pair. The isolation warning stays word
    for word.
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
- **`V9` (CPU goes down: the bar, ruling 6).** **Given** three trees:
  - **base B** is the build's merge-base on `main`: vitest 3.2.7, runner on, k = 2, with `ABC-149` and `ABC-151`
    merged;
  - **head H** is the branch tip;
  - **twin T** is a second tree of base.

  Each tree is built by its own `npm ci` from its own lockfile. **No tree symlinks `node_modules` to the main
  checkout.** Before the first run, each tree logs `npm ls vitest` and its resolved workers. Head also logs
  `viteModuleRunner: false`.

  **When** the full lane is read with `lane144b.mjs`, **then** the twin is admissible (its CPU R is ≤ 15 % of
  B's), and the bar is applied.
  - **The reading's conditions:**
    - the script is used in place, from `.grugops/context/secnfr-ABC-144-window-b/probe/` (`ADR-0035` d2);
    - it runs behind the step-0 gate: 4 consecutive 15 s samples at thermal level 0, load1 ≤ 4.0, and no
      `[v]itest` process;
    - width 1; n ≥ 8 scored rounds, rotated; round 0 discarded; warm; unprofiled;
    - counts are asserted on every run: base 56 / 1740, head 56 / 1741.
  - **The bar:**
    - **an H − B paired median CPU delta of ≤ −15 % of B's median** merges;
    - **a delta between −15 % and 0, with the interval wholly below 0,** goes to the owner;
    - **any other result does not merge.** It goes to the owner with the `D3` table and the addendum.

  The bar is the measured lane CPU. `ADR-0041`'s ratios and `ABC-147`'s R are never quoted as `V9`. **The
  number is never weakened silently.**
- **`V10` (the wall does not rise).** **Then**:
  - H's warm median wall + T's wall R is ≤ W (10 s);
  - H − B's paired median wall is ≤ + T's wall R;
  - **when H warm + R > 9.0 s, the cooled state is owed**, because at k = 2 the cooled state bound (`ABC-151`:
    f = 1.023). Its median wall + R must also be ≤ W.
- **`V11` (heat, reported, with no bar).** `thermalpressurelevel` is logged before and after every `V9` run, and
  the count of runs at level ≥ 1 is reported per arm. If head's count is higher than base's, that goes to the
  owner. No `A5`-style sequence is owed. A foreign runner's presence is logged per run and named in the grade
  (`RISK-ABC151-FOREIGN`).
- **`V12` (the dependency change is reviewed, and there are 0 production lines).**
  - **Security/NFR reviews:**
    - the lockfile diff: packages added and removed, licences, and install scripts;
    - `npm audit` (dev and `--omit=dev`) at base and at head. `--omit=dev` must stay 0;
    - the effect on `AR-1`'s three advisories. `ABC-056`'s row gets a pointer.
  - `git diff --name-only <base> <head> | grep -v '\.test\.ts$' | grep '^src/'` is **empty**.

## Dependencies

- **`ABC-149` and `ABC-151` are merged** (`abd21ff4`, `ef581383`). Nothing the build waits on is open.
- **`ADR-0042` and its addendum are accepted** (`…c9b52bb2`), so the merge hold the Architect named is cleared.
- **A no-other-hop window for `V9`–`V11`**, scheduled by the Orchestrator. It never overlaps `ABC-146`'s
  verdict run.
- **The straddle rule (`ADR-0040` d5).** Any paired reading in flight whose base and head straddle this merge
  is void. That includes `ABC-146` `A1`'s `LADDER_DEEP=1` equivalence check, which runs inside vitest.
- **The floors `F`: none carries over the merge** (ruling 6), because the runner change moves every file's cost.
  - After the merge, every set takes `ADR-0035` d3's provisional 16 % until three readings on 4.1 replace it.
  - The full lane keeps 1.72 s CPU / 3.25 s wall until a twin R exists on 4.1 with the runner off at k = 2.
- **`RISK-ABC144-FCAP`** closes for the pre-merge lane at `V9`'s twin R, a 3.2.7, k = 2 reading. After the merge
  that R is listed, not used.
- **`ABC-056`** (`AR-1`, owner Release Manager): this ticket performs the coverage-v8 major upgrade that
  `ABC-056` priced.

## Risks (residuals carried, `ADR-0042` addendum)

| id | residual | severity | owner |
|---|---|---|---|
| `RISK-ABC152-NEGWORKERS` | On 4.1.11, `VITEST_MAX_WORKERS=-1` makes `vitest run` **exit 0 having run no test**. The pin cannot see it, because nothing runs. The result file reads `success: false` with no counts | low: nobody sets −1 by accident, and the result file stays truthful. Only a consumer that reads the exit code alone is fooled | QE (the `V2` / `V6` review); Security/NFR |
| `RISK-ABC152-A2-GRAPH` | Ruling 3: A2 re-evaluates `book.ts`, but not its imports (`legal`, `zobrist`, `position`, `apply`) | low | **accepted by the owner, 2026-10-11** (`…c9b52bb2`: "yes"). The worker-per-sequence route is not taken |

## Security / NFR triggers

- **Security: triggered.** It is a dependency major bump (`V12`). The review covers the lockfile, the
  licences, the install scripts and the audit.
- **`NFR-008`:** wall ≤ W (`V10`); CPU is reported, and `V9` is a ticket target.
- **`NFR-001`, `NFR-005`, `NFR-007`, `ABC-025` `N1`:** `V4`'s plants and `V7`'s screen.
- **`N8-LANE`:** + 1 test (`V3`), 0 test files, 0 spawns.

## Test notes

1. **The screens come before the clock.** `V4` and `V7` gate `V9`. A fast lane whose mocks went blind is not a
   fast lane (`ADR-0041` d3).
2. **Every reading lives in the notes**, with its machine, load1, thermal level, commit and vitest version.
3. **No `V` reading is profiled.** `--cpu-prof` hung 5 of 18 runs (`RISK-ABC147-01`).
4. **Mandatory gates:** lint, typecheck, build, and `npm test` at 56 / 1741 / 0 skipped. Then the skip-count
   capture and the integrity check. Then QE, then `In Security/NFR`.
5. **UAT:** the zero-production-lines waiver applies only if `V12`'s diff check is empty.
6. **After the merge, the Scribe re-reads `AGENTS.md`:** the worker-cap line, the Stack line, the
   `RISK-ABC143-01` line, and what the coverage figure means. The `RISK-ABC152-NEGWORKERS` line is added too, if
   QE keeps that residual.
7. **Rollback** is the addendum's (§ "Rollback, extended for this addendum").

## Size and priority

**`L`, at the upper edge.** The work is a dependency major bump, 14 test files touched, plants across about 16
files, the reporter, a Security review, a 20-run screen, a window and the opt-in lanes.
- **Not `XL`:**
  - the design risk is retired. Every form, the pin, the reporter route, A20 and A2 have a prototype the
    addendum ran;
  - there are no production lines;
  - the one open unknown, a guard that no form arms, has a stop rule (ruling 7), so the build cannot grow past it.
- **Not split.** The owner said *"use one ticket for it"*. Neither half ships alone anyway: the bump with the
  runner on buys no CPU, and the runner off without the rework is red in 13 files (`ADR-0042` `D3`).
- **What no longer applies:** the first cut's "`D4` closes it early". `D4` is answered.

**`P1`.** The owner asked for it today, by name, for his P1 goal.
- **Not `P0`:** nothing is broken.

## Definition of Ready

BA/PM, 2026-10-11, re-scored at the re-cut. **Result: 10 of 10.** Recommended placement: **`In Design` →
`Ready for Dev`**. Under process rule 1, the criteria are re-read against `main` at the `Ready for Dev` exit.

| # | item | verdict |
|---|---|---|
| 1 | problem clear | **✅** ~5x factor; cause named; the route, and what it turns red (`D3`) |
| 2 | scope and out-of-scope clear | **✅** the admitted forms by name. Fenced off: deletes, skips, moves, merges, weakening and a sixth form (ruling 7), plus 5.x, isolation, `deps.external`, k, `src/` and `nodeLoader` |
| 3 | INVEST-shaped | **✅** one ticket by the owner's word; neither half has value alone; a stop rule bounds it |
| 4 | acceptance testable and measurable | **✅** named ranges; six rows by content plus `M9b`; 11 reds and 3 greens on the pin, plus `V3`'s 2; one production plant red per file in the set; `expect(` equal except +3; 56 / 1741 / 0; 20 green runs; equal path lists; ≤ −15 % measured CPU with an owner band; wall + R ≤ W, cooled if owed |
| 5 | dependencies known | **✅** `ABC-149` and `ABC-151` merged; `ADR-0042` accepted; the window, the straddle, the floors, `ABC-056` |
| 6 | security/NFR triggers with a measurable target | **✅** lockfile review and audit `--omit=dev` = 0; `NFR-008` W = 10 s and ≤ −15 % CPU; `NFR-001`/`005`/`007` and `N1` red on plants |
| 7 | test notes present | **✅** seven |
| 8 | size assigned | **✅** `L` (upper edge) |
| 9 | priority assigned | **✅** `P1` |
| 10 | no major unresolved blocker | **✅** the owner picked the route and accepted `ADR-0042` and `RISK-ABC152-A2-GRAPH`. Ruling 7 cases found: 0 (`UNKNOWN - verify` until `V4`) |

Column moves are the Orchestrator's.
