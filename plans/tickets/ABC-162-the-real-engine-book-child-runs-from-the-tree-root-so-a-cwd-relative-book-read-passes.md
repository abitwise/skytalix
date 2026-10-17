---
id: ABC-162
title: "`ABC-095` `A7`'s real-engine child runs from the tree root, so a build that reads the book relative to the working directory passes `CLI_DEEP`"
status: backlog
column: Backlog
size: XS
priority: P3
epic: EPIC-005
feature: —
---

# ABC-162 — run `A7`'s `booked` child from a neutral working directory. Closes `AR-095-CWD`. ZERO production lines

> **Cut 2026-10-17 by BA/PM** (task `wave-2026-09-25`, subtask `bapm-cut-followups`), from Security/NFR's accepted
> risk **`AR-095-CWD`** (LOW; `.grugops/context/secnfr-ABC-095-s3/notes/…b65b11b7`), which is QE's `QE-095-a`
> (`.grugops/context/qe-ABC-095/notes/…ee8775a2`). Security/NFR named the fix and measured it. Re-measured at `main`
> `1671f24f` in a scratch copy outside the repository (`…bapm-cut-followups/notes/…readings-85e8dfdd`).

## Problem

*User:* the next hop that edits `src/book-file.ts`, and a player who starts the game as `node /abs/path/src/cli.ts`
from another directory.

*Pain:* `readBookFile` resolves the book from its own module URL (`src/book-file.ts:16`). Nothing tests that. In
`src/cli.real-engine.test.ts`, `spawnReal` sets `cwd: root` (`:196`), so the `A7` child (`:401`) runs from the
repository root, and the book-absent copies have no book at any path. At `1671f24f`, with **P6b** planted
(`readFileSync("data/opening-book/book.json")`, a path relative to the working directory),
`CLI_DEEP=1 npx vitest run src/cli.real-engine.test.ts` reads **10 of 10 green**. Shipped, that build would lose the
book (one warning) for a player who starts it from elsewhere, and the book's source would become whatever file the
launching directory holds (`V12.3.1`'s class; Security/NFR).

*Value:* the lane that runs at QE on every ticket goes red on a working-directory read. That is the detective control
`AR-095-CWD` names, so the risk closes.

## Scope

- `A7`'s `booked` child gets a working directory that is not the tree root: a fresh `mkdtemp` directory under
  `os.tmpdir()`, removed by its exact path, or `os.tmpdir()` itself. The Engineer picks.
- The other children keep `cwd: root`. `spawnReal` may take the working directory as a parameter.

## Out of scope

- **Any production file.** `src/book-file.ts` is a capability holder (`ADR-0036` § S1 Ruling 2) and is not edited.
- **The default lane:** no default-lane row and no new spawn.
- `QE-095-b`/`-c`/`-d`/`-e` and `QE-095-i`/`-k`/`-l`: closed with no ticket (decision note).
- `AR-095-READ`: an accepted residual, unchanged.

## Acceptance (Given/When/Then)

- **`A1` (the child runs elsewhere).** **Given** head, **when** `CLI_DEEP=1 npx vitest run src/cli.real-engine.test.ts`
  runs, **then** the `A7` child's `[CLI_DEEP] (cwd …)` line names a directory that is not the tree root and holds no
  `data/` entry. `A7` is green: the reply to `1. e4` is a book entry, stderr is **0 B**, and the exit is **0**.
- **`A2` (the gap is closed).** **Given** P6b planted in a scratch copy outside the repository, **when** the same lane
  runs, **then** it is **green on the base test and red on the head test**. The failing row is `A7`, on stderr: the
  child prints `opening book could not be read; …`.
- **`A3` (cleanup).** After a green run and after the P6b run, the number of entries the lane made under `os.tmpdir()`
  that still exist is **0**.
- **`A4` (fences).**
  - `git diff --name-only <base>` lists exactly `src/cli.real-engine.test.ts`. The production-`src/` grep is empty.
  - `npm test`: the file count and the test count equal base, skips **0**. The `CLI_DEEP` test count equals base
    (**10** at `1671f24f`).
  - The number of child processes the `CLI_DEEP` lane starts is unchanged.

## Dependencies

- `ABC-095` and `ABC-119` — `Done`. None blocking. `ABC-096` (in flight) does not touch this file.

## Security / NFR triggers

- **Security: closes `AR-095-CWD`** when QE reads `A2` with the plant (Security/NFR's close condition). The Orchestrator
  records the close.
- **`NFR-008` / `N8-LANE`:** the default lane is untouched. 0 test files, 0 tests, 0 new spawns in either lane.

## Test notes

1. **Show the gap first:** P6b against the base test.
2. **Plant in scratch copies only.** `git status --porcelain` is empty afterwards.
3. **Mandatory gates:** lint, typecheck, build, `npm test`, plus `CLI_DEEP`. A QE hop is owed, and QE re-plants P6b.
   The UAT waiver is expected; it is measured at the exit.

## Size and priority

**`XS`:** one child's working directory, one plant. **Not `S`:** no production code, no new test.

**`P3`:**
- **Not `P2`:** the delivered read is correct, and two controls stand between a regression and a merge
  (Ruling 2 routes any `src/book-file.ts` edit to Security/NFR, and S3 item 2 reads the file by hand there).
- **Promotion trigger (`P2`):** a ticket that edits `src/book-file.ts`, or `EPIC-006` (packaging), is cut or pulled.

## Definition of Ready

BA/PM, 2026-10-17. **Result: 10 of 10.**

| # | item | verdict |
|---|---|---|
| 1 | problem clear | **✅** P6b passes `CLI_DEEP` 10/10 at `1671f24f` |
| 2 | scope and out-of-scope clear | **✅** one child's cwd; production and the default lane fenced |
| 3 | INVEST-shaped | **✅** independent; testable by one plant |
| 4 | acceptance testable and measurable | **✅** cwd named, stderr 0 B, P6b green → red, 0 leftovers, equal counts |
| 5 | dependencies known | **✅** none blocking |
| 6 | security/NFR triggers with a measurable target | **✅** closes `AR-095-CWD`; 0 / 0 / 0 |
| 7 | test notes present | **✅** three |
| 8 | size assigned | **✅** `XS` |
| 9 | priority assigned | **✅** `P3`, promotion trigger named |
| 10 | no major unresolved blocker | **✅** none |

Column moves are the Orchestrator's.
