---
id: ABC-192
title: "Nothing pins the stream `setup` hands the heap guard, and a vitest bump re-runs no capture arm (QE-176-a, QE-176-b)"
status: in-review
column: In Review
size: XS
priority: P3
epic: —
feature: —
---

# ABC-192: one parser-view row pins `setup`'s `process.stdout`, and one version row turns red on a vitest bump and names what to re-run. Test-only: `src/cli.test.ts`, 0 production lines

> **Cut 2026-10-21 by BA/PM** (subtask `bapm-rule-QE-176`, at `main` `03ac8bc4`). Sources:
> - QE's gap register on `ABC-176`: `.grugops/context/qe-ABC-176/notes/…decision-75bc28e0` (`QE-176-a`, `QE-176-b`),
>   with the mutant table in `…observation-fbdf5a60` (M4) and the ordering readings in `…observation-c9b3023e`.
> - The SE's residual: `.grugops/context/ticket-to-pr-ABC-176/notes/…observation-74594565` ("Ordering (LOW)").
>
> The readings measured for this cut are in `.grugops/context/bapm-rule-QE-176/notes/`. They were taken on scratch
> copies outside the repository and are not a design.

## Problem

*User:* every agent hop (and the owner) that trusts the skip-count gate step. Also the hop that next bumps `vitest`.

*Pain:*
- **The stream `setup` passes is pinned by no row (`QE-176-a`).** Change `setup`'s call to
  `guard(project, v8.getHeapStatistics(), process.stderr)` and the whole suite stays green (59 files / 1992, QE M4).
  Yet the refusal arm of `AGENTS.md`'s skip-count line then prints `0`, exits 0, and the gate reads `No findings.`:
  `SEC-173-1` is back, silently. Every `ABC-176` row calls `guard` with a stub stream, so none of them reads the
  call site.
- **The order the capture relies on has no trigger (`QE-176-b`).** `ABC-176` `A1`/`A2` hold only because the guard's
  line reaches stdout before vitest's JSON report. That holds by vitest 4.1.11's internal order on one
  `process.stdout` (46 of 46 runs, QE). It is not a documented contract. On a vitest bump, the reporter header
  re-runs its seven rows, which read the result file (`A3`), but nothing re-runs the capture arm (`A1`/`A2`). Nothing
  turns red on a bump at all: no `src` row reads the installed vitest version (0 at cut).

*Value:*
- A build that sends the refusal anywhere but stdout fails `npm test`.
- A vitest bump fails `npm test` until the hop re-runs the capture arm and re-pins the version with its reason.

## Scope

One file: **`src/cli.test.ts`**. Add a new `describe("ABC-192 — …")` block directly after the `ABC-176` block,
holding two rows:

1. **The call-site row (`QE-176-a`).** It reads `tools/grugops/heap-guard.js` through the TypeScript parser, never
   its text (`ABC-133`). It asserts the call `setup` makes to `guard` passes `process.stdout`.
2. **The version row (`QE-176-b`).** It reads the installed `vitest` version (`node_modules/vitest/package.json`)
   and compares it with a constant that names the version the capture arm was last read on (`4.1.11`). Its failure
   message is the re-run list (see `A2`).

## Out of scope

- **Any edit to `tools/grugops/heap-guard.js`, `tools/grugops/result-file-reporter.js`, `package.json`,
  `package-lock.json`, `vitest.config.ts` or `AGENTS.md`.** This is a cut, with its reason. The reporter header's own
  rule re-runs all seven `ABC-149` rows (seven `npm test` runs) when a hop changes `heap-guard.js` or the reporter.
  A header-only closure of `QE-176-b` would buy that re-run and still trigger nothing on a bump. The version row
  carries the re-run list where a bump makes it seen.
- **A new child process.** `N8_SPAWN` stays 28 ("a ceiling, not a target", `ADR-0008` addendum). The QE's other
  option, a spawned refusal row, would raise it for a LOW P3 gap. Measured at cut: a plain Node child does tell base
  from M4 (stdout 79 B vs 0 B, about 58 ms each). It is not taken.
- **A spawned `vitest` inside the suite.** Its own workers fall outside `ADR-0008`'s SUITE row. The ordering itself
  stays a hop reading, made on a bump (`A2`).
- **An in-process `setup` call.** Measured at cut and failed: `vi.doMock("node:worker_threads")` does not reach
  `tools/grugops/heap-guard.js`, so `setup` still throws "off the main thread". Recorded as a failed attempt; do not
  retry it.
- **`QE-176-c`** (accepted, see `ABC-176`'s erratum and `bapm-rule-QE-176`), the triple print of a refused
  `npm test` (INFO), and `RISK-ABC173-STATE`'s widening to `catchError` (Security/NFR's).

## Acceptance (Given/When/Then)

"Base" is `main` at pull time (`03ac8bc4` at cut). Rows run at `NODE_OPTIONS=--max-old-space-size=400` for one file
and as `npm test` for the suite, as `AGENTS.md` spells them. Mutants go in a scratch copy OUTSIDE the repository
with a private `TMPDIR`, never in a worktree, and each file is restored and checked with `cmp`.

- **`A1`: the call site is pinned (`QE-176-a`).**
  - **Given** `heap-guard.js` as merged, **when** `npx vitest run src/cli.test.ts -t "ABC-192"` runs, **then** the
    call-site row passes. It finds exactly one default-exported `setup`, exactly one `guard(…)` call inside it, and
    that call's third argument is `process.stdout`.
  - **Wrong builds this fails** (each one makes the row red, in the one-file run and in `npm test`):
    - M4: `guard(project, v8.getHeapStatistics(), process.stderr)`;
    - M4b: `guard(project, v8.getHeapStatistics(), { write() {} })`.
  - **Non-vacuity:** the row is first watched losing its evidence, in memory, on planted sources, in the house style
    of `ABC-173`'s `A6 (static)` row. A planted `process.stderr`, a planted no-op stream, a `setup` with no `guard`
    call and a `setup` with two each give a fault. The real file gives none.
  - *(Measured at cut. A parser-view prototype over base, M4 and M4b reads `ok` / fault / fault, and finds one
    `setup` with one `guard` call whose arguments are `project`, `v8.getHeapStatistics()`, `process.stdout`.)*
- **`A2`: a vitest bump turns `npm test` red and names what to re-run (`QE-176-b`).**
  - **Given** the installed `vitest` is 4.1.11, **when** the version row runs, **then** it passes.
  - **Given** a scratch copy whose `node_modules/vitest/package.json` reads any other version (e.g. `4.1.12`), **when**
    the row runs, **then** it fails, and its message names, as one list:
    1. the `ABC-176` capture arm: `AGENTS.md`'s skip-count line with its prefix removed, on the SUITE and ONE-FILE
       shapes. Raw stdout line 1 begins `heap-guard: refused.` and the JSON report follows. The capture prints no
       integer and the pipe exits non-zero. The gate reads `Skip count was not provided`, exit 1. The green arm
       (as spelled) still prints exactly one integer;
    2. the reporter header's seven rows (`ABC-149` + `refused`);
    3. re-read `RISK-ABC173-STATE` (`getPaths` and `catchError`) and `RISK-ABC143-01`;
    4. then re-pin the constant, with the reason and the hop's readings, never silently.
  - The constant is one literal in the row, with a comment that says when to change it.
  - *(Measured at cut: `package-lock.json` and `node_modules` both read `vitest` 4.1.11 and `@vitest/coverage-v8`
    4.1.11. 0 `src` files read `vitest/package.json`.)*
- **`A3`: no budget moves.**
  - `N8_SPAWN` is still 28 and `spawned` still equals it. `ABC-173` `C2` is green, with no new child call.
  - The new rows spawn nothing and take no timing.
- **`A4`: files and gates.**
  - `git diff --name-only main...HEAD` lists `src/cli.test.ts` and nothing else outside this hop's own records
    (notes under `.grugops/context/*/notes/`, `.grugops/queue/`, this page and `plans/board.md`; `QE-182-d`).
  - The UAT waiver form in `AGENTS.md`
    (`git diff --name-only <range> | grep -v '\.test\.ts$' | grep '^src/'`) prints nothing.
  - lint, typecheck and build exit 0. `npm test` exits 0 with 59 files and 1992 + the new rows passed, 0 failed.
    `.test-results/last-run.json` reads `success` true. Skip count 0, and the gate reads `No findings.`.
  - `AGENTS.md` is byte-identical (15,797 B at cut).

## Dependencies

- **None blocking.** `ABC-176` is merged (`03ac8bc4`), so `guard`, `setup` and the `ABC-176` block are on `main`.
- **File overlap:** `ABC-189` also edits `src/cli.test.ts` (one assertion in `ABC-042` `A10`, about line 1800). It
  sits in a different block, so the textual merge is expected clean, but that is `UNKNOWN - verify` at merge. No open
  page cites a `src/cli.test.ts` line past 4160 (measured at cut), so appending after the `ABC-176` block moves no
  live pointer.
- **Gates no merge.** Both gaps are LOW regression holes, not criterion misses.

## Security / NFR triggers

- **Test integrity** (`quality.test_integrity: warn`). It closes the silent path back to `SEC-173-1` (`A1`) and turns
  an unwatched dependency into a red row (`A2`). Both targets are observable: a row red or green, a named argument,
  a version string.
- **`NFR-008`:** 0 new children, 0 spawned vitest, 0 new files read beyond `heap-guard.js` and one `package.json`.
  No timing target is set and none is taken.
- No new security surface.

## Test notes

1. **Run the mutants before calling `A1` met**, in a scratch copy outside the repository. Restore and check with
   `cmp`. QE's M4 is already on record as surviving today's suite (`…fbdf5a60`).
2. **`A2`'s red arm:** edit the version only in a scratch copy's `node_modules/vitest/package.json`, never in the
   repository. The message is compared by content against `A2`'s list.
3. **Do not retry an in-process `setup` call** with `vi.doMock("node:worker_threads")`. It does not reach the
   module (failed at cut, `bapm-rule-QE-176` notes).
4. **`ABC-176`'s capture arm is not re-run by this ticket.** No vitest version moves here. `A2` makes the next bump
   re-run it.
5. **Gates:** lint, typecheck, build, `npm test`, skip count 0. A QE hop is owed. The UAT waiver is expected
   (0 production lines). The waiver is not a signature.
6. **Builder:** Software Engineer. No timing at any hop.

## Size and priority

**`XS`:** two rows in one test file, both shaped like rows already in it (`ABC-173` `A6 (static)` for the parser
view, and a constant compared with one read file). Every criterion was prototyped at cut.

**`P3`:** both gaps are LOW and gate nothing. `A1` closes a silent regression path to `SEC-173-1` that needs a
wrong edit to open. `A2` matters only at the next vitest bump, and none is planned.

## Definition of Ready

BA/PM, 2026-10-21 at `03ac8bc4`. **Result: 10 of 10.**

| # | item | verdict |
|---|---|---|
| 1 | problem clear | **✅** M4 survives 59/1992 while the capture prints `0` (QE); the A1/A2 order rests on vitest internals and nothing fires on a bump (0 version readers, measured) |
| 2 | scope and out-of-scope clear | **✅** one file, two rows; `tools/`, `AGENTS.md`, children, a spawned vitest and the in-process route fenced, each with its reason |
| 3 | INVEST-shaped | **✅** independent (gates nothing; one expected-clean overlap); valuable alone; `XS`; each criterion is a row or a mutant run |
| 4 | acceptance testable and measurable | **✅** a named argument; two mutants red; four planted faults; the version string; a four-item message; `N8_SPAWN` 28; file list and counts |
| 5 | dependencies known | **✅** `ABC-176` merged; `ABC-189`'s overlap named |
| 6 | security/NFR triggers with a measurable target | **✅** test integrity via `A1`/`A2`; `NFR-008` 0 children / 0 timing |
| 7 | test notes present | **✅** six |
| 8 | size assigned | **✅** `XS` |
| 9 | priority assigned | **✅** `P3` |
| 10 | no major unresolved blocker | **✅** none. The `ABC-189` merge being clean is `UNKNOWN - verify`, and the row is in a different block |

Column moves after `Ready` are the Orchestrator's.

## QE

**QE/E2E, 2026-10-21 (subtask `qe-ABC-192`). Verdict: PASS_WITH_GAPS** (`QE-192-a` LOW, `QE-192-b`/`-c`/`-d` INFO;
0 blocking; none against a criterion). Run at `grugops/qe-ABC-192` merge `bfccd564` (tip `b5b8b0f9` + main `ec5c42d7`).
Mutants ran in a scratch copy outside the repository (full `node_modules` copy, private `TMPDIR`), each restored and
checked with `cmp`. No timing taken. Notes: `.grugops/context/qe-ABC-192/notes/` (`…observation-dfdea161` criteria,
`…observation-5eac2736` mutants, `…observation-25aa4be6` gates, `…decision-21079de0` verdict).

- **A1 met.** The row passes on the merged file. M4 and M4b each turn exactly A1 red, in the one-file run and in
  `npm test` (1993/1994, `success` false). Three test-side weakenings each red the in-memory plant table.
- **A2 met.** On a bump to 4.1.12, A2 alone is red, one-file and in `npm test`, and the message carries the four
  items in order. 4.2.0, 5.0.0, a prerelease, a downgrade, and a missing or empty version are red too.
- **A3 met.** `src/cli.test.ts` 95/95, with `N8-LANE` (28) and `ABC-173` `C2` green. The diff removes 0 lines and adds no
  child or timing call.
- **A4 met.** The diff is `src/cli.test.ts` plus the SE's notes. Gates: lint 0, typecheck 0, build 0. `npm test` 59
  files / 1994 passed, `last-run.json` `success` true. Skip count 0 → `No findings.`. The waiver form prints nothing.
  `AGENTS.md` is byte-identical from base to tip (15,797 B).
- **UAT waived** (0 production lines). The AR-191-GITENV stand-in prints nothing. A waiver is not a signature.
- **Gaps:**
  - **`QE-192-a` LOW:** `try { guard(…) } catch {}` in `setup` survives the row, lint and the suite. The line still
    reaches stdout, but a prefix-less run is not stopped (1994 tests ran at 4192 MiB). That is against ABC-173, not
    QE-176-a. A possible closure: the call must be a direct statement of `setup`'s body.
  - **`QE-192-b` INFO:** shadowing `process` inside `setup` survives every gate, and the capture prints `0`. It takes
    a deliberate edit. Recommend accept.
  - **`QE-192-c` INFO:** the row fails closed on behaviour-equivalent refactors of the call site.
  - **`QE-192-d` INFO:** a bump of `@vitest/coverage-v8` alone, or of the lockfile before reinstall, stays green.
    A lockfile reader would be weaker than the SE's `node_modules` read.
