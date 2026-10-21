---
id: ABC-194
title: "A try/catch or an off-switch around `setup`'s guard call lets an uncapped run through, and the ABC-192 row stays green (QE-192-a)"
status: done
column: Done
size: XS
priority: P3
epic: —
feature: —
---

# ABC-194: the `ABC-192` call-site check also requires `setup`'s `guard(…)` call to be a direct statement of its body, with no `return` in `setup`. Test-only: `src/cli.test.ts`, 0 production lines, no new row

> **Cut 2026-10-21 by BA/PM** (subtask `bapm-rule-QE-192`, at `main` `7a2ec8bc`). Sources:
> - QE's gap register on `ABC-192`: `.grugops/context/qe-ABC-192/notes/…decision-21079de0` (`QE-192-a`), with the
>   mutant table in `…observation-5eac2736`.
> - The SE's design of the row this ticket tightens: `.grugops/context/ticket-to-pr-ABC-192/notes/…decision-8fd17c58`.
>
> The readings measured for this cut are in `.grugops/context/bapm-rule-QE-192/notes/`. They were taken with a
> parser prototype over a copy of base's `tools/grugops/heap-guard.js` outside the repository. They are not a design.

## Problem

*User:* the owner, whose word is the cap ("vitest needs to be capped to max 2 cpu cores and 2GB of memory",
`ADR-0008` § ADDENDUM 2026-10-19). Also every agent hop that runs a vitest lane on his machine.

*Pain:*
- **A swallowed refusal runs the suite uncapped (`QE-192-a`).** Wrap `setup`'s call as
  `try { guard(project, v8.getHeapStatistics(), process.stdout); } catch {}`. Then `ABC-192` `A1`, lint and `npm test`
  all stay green (59 files / 1994, QE). A prefix-less run is no longer stopped: QE watched all 1994 tests run at a
  4192 MiB heap, and vitest exited 1 only through `catchError`.
- **That is against the guard's ruling.** `ADR-0008` says of the guard: "The run exits 1 and no test runs … It never
  runs uncapped". `ABC-173` `A5`'s literal text ("the run exits non-zero") still holds, so this is a hole in the pin,
  not a missed criterion.
- **The same row also misses an off-switch** (measured at cut, not by QE). Both of these leave the row green:
  - `if (process.env.HEAP_GUARD_OFF) return;` before the call;
  - `if (!process.env.HEAP_GUARD_OFF) guard(…)`.
  With the variable unset, each behaves exactly like base, so no suite row can tell them apart (by construction;
  not run). With the variable set, the run is uncapped.
- `ABC-192`'s check counts `guard(…)` calls anywhere inside `setup`. It never asks whether the call is on
  `setup`'s path.

*Value:* the refusal reaches vitest whenever `setup` runs. Any build that catches it, branches around it, defers it
or returns before it fails `npm test`.

## Scope

One file: **`src/cli.test.ts`**. The check `guardStreamFaultOf` in the `ABC-192` block gains two conditions. The
`A1` row's in-memory plant table gains four planted setups. No new row and no new `describe`.

1. **A direct statement.** The one `guard(…)` call is the whole expression of an expression statement, and that
   statement is a direct child of `setup`'s body block. It is not nested in a `try`, `if`, block, label, arrow,
   callback or larger expression.
2. **No `return` in `setup`.** `setup`'s body has no `return` statement outside nested functions. The existing
   `if (!isMainThread) throw …` stays allowed: a throw refuses, it does not bypass.

The fault message names which condition failed and where the call sits.

## Out of scope

- **`QE-192-b`** (a shadowed `process`, or a shadowed `guard`). It is accepted (see `bapm-rule-QE-192`): a
  parser view cannot resolve bindings, so the class stays open whatever spelling one check closes. Measured at
  cut: the tightened check is green on both shadows.
- **Any edit to `tools/grugops/heap-guard.js`, `tools/grugops/result-file-reporter.js`, `package*.json`,
  `vitest.config.ts` or `AGENTS.md`.** No call-site refactor is needed: base already has the shape (measured).
- **A behavioural refusal row.** `N8_SPAWN` stays 28. The in-process `setup` call failed at `ABC-192`'s cut
  (`bapm-rule-QE-176` failed attempt `…ef39afc9`); do not retry it.
- **A binding-resolving check** (a TypeScript `Program` or type checker over `heap-guard.js`). It costs more than
  this LOW gap, and no rule needs it.
- **A top-level reassignment of `setup`** and the other dead-call shapes that lint or the suite already kill
  (`ABC-173` `A4`–`A6`, QE's table). They need nothing here.

## Acceptance (Given/When/Then)

"Base" is `main` at pull time (`7a2ec8bc` at cut). Rows run at `NODE_OPTIONS=--max-old-space-size=400` for one file
and as `npm test` for the suite, as `AGENTS.md` spells them. Mutants go in a scratch copy OUTSIDE the repository
with a private `TMPDIR`, never in a worktree. Each file is restored and checked with `cmp`.

- **`A1`: base is green.** **Given** `heap-guard.js` as merged, **when**
  `npx vitest run src/cli.test.ts -t "ABC-192"` runs, **then** it exits 0 and both rows pass.
  - *(Measured at cut: the prototype finds base's call as a direct statement of `setup`'s body, with 0 `return`
    statements.)*
- **`A2`: the dead and conditional calls go red.** **Given** a scratch copy with `setup`'s call changed to each
  build below, **when** the one-file run and `npm test` run, **then** each exits 1. `ABC-192 > A1` fails, and its
  message names the condition. In the one-file run, and for builds 1–3 in `npm test`, it is the only failing row.
  Build 4 also reds `ABC-173` `A4`/`A6` in `npm test`, as QE's table records, because the guard never runs.
  1. `try { guard(…, process.stdout); } catch {}` (`QE-192-a`);
  2. `if (!process.env.HEAP_GUARD_OFF) guard(…, process.stdout);`;
  3. `if (process.env.HEAP_GUARD_OFF) return;` placed before the call;
  4. `const later = () => guard(…, process.stdout);`.

  M4 (`process.stderr`) and M4b (`{ write() {} }`) still red the same row.
  - Builds 2 and 3 run with `HEAP_GUARD_OFF` unset, so the guard runs and only the call-site check can see them.
  - *(Measured at cut: the merged check is green on all four. The tightened prototype is red on all four, and on
    `if (false)`, `return;`, `try … finally { return; }`, a labelled `break`, `Promise.resolve().then(() => guard(…))`
    and `guard(…) || 0`.)*
- **`A3`: non-vacuity.** The `A1` row's in-memory plant table gains four entries:
  - `try { … } catch {}` around the real call;
  - `if (false)` before the real call;
  - an uncalled arrow holding the real call;
  - `return;` before the real call.

  The row asserts the table reads `[false, true, true, true, true, true, true, true, true]`.
  - At least one test-side weakening, dropping either new condition, must turn that assertion red. Record it in the
    hop's note.
  - *(Measured at cut: the merged check reads `[false, true, true, true, true, false, false, false, false]`; the
    tightened prototype reads the target.)*
- **`A4`: no budget moves.** `N8_SPAWN` is still 28, and `spawned` still equals it. `ABC-173` `C2` is green, and
  no child call is added. The change spawns nothing and takes no timing.
- **`A5`: files and gates.**
  - `git diff --name-only main...HEAD` lists `src/cli.test.ts` and nothing else outside this hop's own records
    (notes under `.grugops/context/*/notes/`, `.grugops/queue/`, this page and `plans/board.md`).
  - The UAT waiver form in `AGENTS.md` prints nothing.
  - lint, typecheck and build exit 0.
  - `npm test` exits 0 with 59 files and 1994 tests passed (no new row), 0 failed. `.test-results/last-run.json`
    reads `success` true. Skip count 0, and the gate reads `No findings.`.
  - `AGENTS.md` is byte-identical (15,821 B at cut).

## Dependencies

- **None blocking.** `ABC-192` is merged (`7a2ec8bc`), so `guardStreamFaultOf` and its plant table are on `main`.
- **File overlap:** `ABC-189` (Backlog) also edits `src/cli.test.ts`, at one assertion in `ABC-042` `A10` (about
  line 1800). This ticket edits the `ABC-192` block (about lines 4166–4262). They are different blocks, so the
  textual merge is expected clean, but that is `UNKNOWN - verify` at merge. `ABC-193` (In Review) edits no `src/`
  file.
- **Gates no merge.** This is a LOW regression hole, not a missed criterion.

## Security / NFR triggers

- **Test integrity** (`quality.test_integrity: warn`). It closes a silent path past the owner's 2 GB cap
  (`ADR-0008` addendum). The target is observable: a row goes red or green, with a named fault.
- **`NFR-008`:** 0 new children, 0 spawned vitest, 0 new files read. No timing target is set and none is taken.
- No new security surface.

## Test notes

1. **Run the mutants before calling `A2` met**, in a scratch copy outside the repository. Restore each file and
   check it with `cmp`.
2. **The fail-closed side grows (`QE-192-c`, accepted).** A block, `void` or `|| 0` around an otherwise unchanged
   call is behaviour-equivalent to base, and it now reds the row too (measured at cut). That is expected. A later
   hop that refactors the call site updates the row in the same diff.
3. **Do not retry an in-process `setup` call** with `vi.doMock("node:worker_threads")`.
4. **Gates:** lint, typecheck, build, `npm test`, skip count 0. A QE hop is owed. The UAT waiver is expected
   (0 production lines). A waiver is not a signature.
5. **Builder:** Software Engineer. No timing at any hop.

## Size and priority

**`XS`:** two conditions added to one existing check, and four entries added to one existing plant table, in one
test file. A prototype of the check was run at cut against base and 18 builds.

**`P3`:** the gap is LOW and gates nothing. Opening it takes a deliberate edit to `tools/grugops/heap-guard.js`.
The cost of it is the owner's cap, silently, so it is cut rather than accepted.

## Definition of Ready

BA/PM, 2026-10-21 at `7a2ec8bc`. **Result: 10 of 10.**

| # | item | verdict |
|---|---|---|
| 1 | problem clear | **✅** the try/catch survives 59/1994, and 1994 tests run at 4192 MiB (QE). The merged check is green on the try/catch and on two env off-switches (measured) |
| 2 | scope and out-of-scope clear | **✅** one function and one plant table in one file. `QE-192-b`, `tools/`, children, the in-process route and a type checker are fenced, each with its reason |
| 3 | INVEST-shaped | **✅** independent (gates nothing; one expected-clean overlap); valuable alone; `XS`; each criterion is a row or a mutant run |
| 4 | acceptance testable and measurable | **✅** base green; four named builds red, in one-file and `npm test`; a 9-entry plant array; `N8_SPAWN` 28; file list and counts 59/1994 |
| 5 | dependencies known | **✅** `ABC-192` merged; the `ABC-189` overlap is named |
| 6 | security/NFR triggers with a measurable target | **✅** test integrity via `A2`/`A3`; `NFR-008` 0 children and 0 timing |
| 7 | test notes present | **✅** five |
| 8 | size assigned | **✅** `XS` |
| 9 | priority assigned | **✅** `P3` |
| 10 | no major unresolved blocker | **✅** none. A clean `ABC-189` merge is `UNKNOWN - verify`; the edits are in different blocks |

Column moves after `Ready` are the Orchestrator's.

## QE

**QE/E2E, 2026-10-21 (subtask `qe-ABC-194`), at `grugops/qe-ABC-194` merge `0fd86eb4` (tip `fcf47534`, code `5e0839fd`, base `99d07d32`, `main` `5427f807` merged, no conflict). Verdict: PASS_WITH_GAPS.** Every criterion was read by my own runs before I opened the SE's notes. Mutants ran in two scratch copies outside the repository (`git archive` + full `cp -R` of `node_modules`, private `TMPDIR`, `HEAP_GUARD_OFF` unset for every vitest run); each file was restored and `cmp`-checked. No run was made uncapped, and no timing was taken.

- **A1 MET.** One-file `-t "ABC-192"` at 400: exit 0, 2 passed. Base's `if (!isMainThread) throw …` stays allowed (0 returns, direct statement).
- **A2 MET.** Builds 1–4, M4 and M4b each exit 1 with only `ABC-192 > A1` red in the `-t` one-file run, and the fault names the condition (`TryStatement`, `IfStatement`, `1 return statement(s) (return;)`, `ArrowFunction`, the `process.stderr` / `{ write() {} }` arguments). In `npm test`, builds 1–3, M4 and M4b give 1993/1994 with only A1 red; build 4 gives 1991/1994 (A1 + `ABC-173` A4/A6).
- **A3 MET.** The row reads the 9-entry array. Dropping the direct check, the no-return check or the `parent !== body` half each reds the plant assertion.
- **A4 MET.** `N8_SPAWN` = 17+7+1+2+1 = 28; `N8-LANE` and `ABC-173` `C2` pass; the diff adds no child call and no timing.
- **A5 MET.** `main...tip` lists `src/cli.test.ts` + 3 SE notes. Lint, typecheck and build exit 0. `npm test` exits 0 with 59/1994, and `last-run.json` reads `success` true. Skip count 0 → `No findings.`. The waiver and the `AR-193-HUNKHDR` stand-in print nothing. `AGENTS.md` is 15,821 B and unchanged.

**Gap register** (0 blocking; none against a criterion):
- **QE-194-a (LOW proposed).** An off-switch on the guard's *inputs* passes the tightened check and every gate: an env-gated heap-statistics argument, an env-gated `v8.getHeapStatistics` patch in `setup` or at module top, a default parameter (lint-red as spelled), or an env early `return` inside `guard`. With the variable unset each is base-identical (59/1994); with it set, the call admits an uncapped heap. This is the same class and deliberateness as builds 2 and 3. Owner: BA/PM rules, Security/NFR rates.
- **QE-194-b (INFO).** The plant table pins neither the return walk's descent nor the `ExpressionStatement` half. Each weakening leaves the row green and lets build 3 or `do { break; } while (guard(…))` back.
- **QE-194-c (INFO).** `process.exit(0)` or a never-settling `await` before the call: `npm test` exits 0 with no test run. Only `last-run.json` (`success` false, `runState` `exited`) catches it. Nothing runs uncapped.
- **QE-194-d (INFO).** The fail-closed side grows as the page expects (`QE-192-c`): a block, `void`, `|| 0`, a comma or a `return;` after the call each red A1.

UAT waived (0 production lines); a waiver is not a signature. The `In Review` exit is the Orchestrator's.
