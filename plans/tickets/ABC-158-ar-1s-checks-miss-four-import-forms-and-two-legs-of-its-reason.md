---
id: ABC-158
title: "`AR-1`'s recorded checks miss four ways code reaches the runtime path, and pin neither \"no loader flag\" nor \"no non-dev dependency\""
status: backlog
column: Backlog
size: XS
priority: P3
epic: —
feature: —
---

# ABC-158 — re-state `AR-1`'s check set so that each of six planted forms changes a reading. Record only: 0 `src/` lines, 0 manifest bytes

> **Cut 2026-10-17 by BA/PM** (task `wave-2026-09-25`, subtask `bapm-cut-followups`), bundling two LOW gaps from
> `ABC-056`'s QE register (`.grugops/context/qe-ABC-056/notes/…8f36c18b`, plants `…a1a81cb9`). Both sit in the
> same record, `AR-1`'s re-statement (`.grugops/context/ticket-to-pr-ABC-056/notes/…ar1-restated-718112dd`), and
> both are the Release Manager's:
> - **`QE-056-a`**: check 5 does not cover the whole runtime import surface;
> - **`QE-056-b`**: two legs of the reason are pinned by no check.
>
> Re-measured at `main` `1671f24f` in a scratch copy outside the repository (`…bapm-cut-followups/notes/…readings-85e8dfdd`).

## Problem

*User:* whoever reads `AR-1` to decide whether its trigger has fired: the Release Manager, or Security/NFR at a
gate.

*Pain:* `AR-1` accepts three dev-only advisories because *no package from the npm tree is loaded on the runtime
path*. Its trigger fires when a recorded check reads differently from the record. At `1671f24f`, with these four
forms planted together in a copy of `src/`, checks 5a, 5b and 5c read **exactly as recorded** (5a empty, 5b empty,
5c `node:fs`). QE showed `nanoid` loads at runtime under each of them:

| form | why check 5 is blind |
|---|---|
| G1: `src/qe-sub/x.ts` holding `import "nanoid";`, imported from `src/cli.ts` | the file set is `ls src/*.ts`, so subdirectories are unread |
| G2: `import "./../node_modules/nanoid/index.js";` | 5a drops every specifier that starts with `./` |
| G3: `await import (name);` (a space before `(`) | 5b reads `import\(` with no space |
| G4: `process.getBuiltinModule("node:child_process")` | 5c sees only import specifiers |

Two more legs of the reason are pinned by no check at all:
- G5: `scripts.chess` = `node --import nanoid src/cli.ts` loads `nanoid` and changes no check. Today it reads
  `node src/cli.ts`.
- G6b: an `optionalDependencies` entry (a package with no advisory) changes no check, and "every audited package
  is a dev dependency" is then false. Today `package.json` has no `dependencies`, `optionalDependencies`,
  `peerDependencies` or `bundleDependencies` key, and 0 of 122 lockfile packages lack `dev: true`.

*Value:* the trigger fires on every form that voids the premise, so "the trigger is quiet" means the premise holds.

## Scope

- **One new Release Manager decision note** re-stating `AR-1`, with `supersedes: …718112dd`. The reason, the
  advisory table and clause (1) of the trigger carry over unchanged unless a reading moved.
- **Check 5 is widened** so that G1–G4 each change a reading. The Release Manager writes the commands. The file set
  should be `ADR-0036`'s production set (every non-test `.ts .mts .cts .js .mjs .cjs` under `src/`, recursively,
  excluding `.d.ts` files).
- **Two new checks:** check 6 records `scripts.chess`; check 7 records that no non-dev dependency key exists in
  `package.json` and that 0 lockfile packages lack `dev: true`.
- **Trigger clause (2)** names checks 6 and 7 as well.

## Out of scope

- **Any byte of `src/`, `package.json` or `package-lock.json`.** `npm audit fix` is not run.
- `QE-056-c` (install scripts) and `QE-056-d` (record ergonomics): INFO, unchanged.
- `ADR-0036` and `ABC-041`: they already route G1–G4 (clause (b)) and G5/G6b (clause (a)) to Security/NFR, and they
  are not edited.

## Acceptance (Given/When/Then)

- **`A1` (the baseline is true at the tip).** **Given** the branch tip, **when** every check 1–7 runs, **then**
  the new note records each command and its output, and each output equals what the note claims. Expected from
  `1671f24f`: 5a empty, 5b empty, 5c `node:fs`, check 6 `node src/cli.ts`, check 7 `0` keys and `0` packages.
- **`A2` (each blind form now changes a reading).** **Given** a scratch copy outside the repository with **one**
  plant at a time, G1, G2, G3, G4, G5 and G6b with QE's texts (`…a1a81cb9`), **when** checks 1–7 run on the copy,
  **then** at least one check reads differently from the record, **6 of 6**. The note names, per plant, the check
  that moved.
- **`A3` (the old plants still move a reading).** **Given** the same scratch method, **when** QE's required plants
  P1, P2, P3, P3b, P4 and P4b run, **then** each still changes at least one reading, **6 of 6**.
- **`A4` (the trigger names the new checks).** The note's trigger clause (2) fires when **any** of checks 1–7 reads
  differently from the record. Clause (1) is unchanged.
- **`A5` (fences).** `git diff --name-only <base>` lists only files under `.grugops/context/` and `plans/`.
  `git diff --numstat <base> -- src/ package.json package-lock.json` is empty.

## Dependencies

- **`ABC-056` — `Done`**: its record is the one superseded. None blocking.

## Security / NFR triggers

- **Security: touched, as a record.** This tightens an accepted risk's detective control. It changes no code, so no
  gate reading moves. `security.block_on` stays `high`, and `AR-1` stays accepted unless a reading in `A1` moves.
- **`NFR-008`:** not triggered. 0 test files, 0 tests.

## Test notes

1. **One plant per copy.** A combined plant cannot show which check moved.
2. **Plants live in scratch copies outside the repository.** `git status --porcelain` is empty afterwards.
3. **Mandatory gates** run, though nothing under `src/` changes. A QE hop is owed. The UAT waiver is expected
   (0 production lines); it is measured at the exit.

## Size and priority

**`XS`:** one record note, about seven commands, twelve scratch plants. **Not `S`:** no code.

**`P3`:**
- **Not `P2`:** every blind form is caught today by another route the project already runs. `ADR-0036` clause (b)
  fires on G1–G4, and `ABC-041` clause (a) fires on any `package.json` edit, so the diff reaches Security/NFR. What
  is missing is that `AR-1` itself would be re-read.
- **Promotion trigger: `P2`** when a ticket is cut that adds a file under a subdirectory of `src/`, or edits
  `scripts.chess`.

## Definition of Ready

BA/PM, 2026-10-17. **Result: 10 of 10.**

| # | item | verdict |
|---|---|---|
| 1 | problem clear | **✅** G1–G4 planted together leave 5a/5b/5c as recorded at `1671f24f`; G5/G6b are read by no check |
| 2 | scope and out-of-scope clear | **✅** one note; no code or manifest byte; `QE-056-c`/`-d` fenced |
| 3 | INVEST-shaped | **✅** independent; testable by plants |
| 4 | acceptance testable and measurable | **✅** 6 of 6 new plants move a reading, 6 of 6 old ones still do; empty numstat |
| 5 | dependencies known | **✅** `ABC-056` `Done` |
| 6 | security/NFR triggers with a measurable target | **✅** record-only; `block_on: high` unchanged; 0 tests |
| 7 | test notes present | **✅** three |
| 8 | size assigned | **✅** `XS` |
| 9 | priority assigned | **✅** `P3`, with a promotion trigger |
| 10 | no major unresolved blocker | **✅** none |

Column moves are the Orchestrator's. Owner of the build: **the Release Manager**, then QE.
