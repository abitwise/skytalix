---
id: ABC-160
title: "The book compiler's sha256 test never offers an expected hash that differs only in its FIRST character, so a check that compares a suffix passes it"
status: backlog
column: Backlog
size: XS
priority: P3
epic: EPIC-005
feature: —
---

# ABC-160 — one more refusal inside `ABC-145`'s `A1/A2` `it`: a first-char near-miss. ZERO production lines, ZERO new tests

> **Cut 2026-10-17 by BA/PM** (task `wave-2026-09-25`, subtask `bapm-cut-followups`), from `ABC-155`'s QE gap
> **`QE-155-a`** (LOW; `.grugops/context/qe-ABC-155/notes/…c71bd20e`). Re-measured at `main` `1671f24f` in scratch
> copies outside the repository (`…bapm-cut-followups/notes/…readings-85e8dfdd`).

## Problem

*User:* the next hop that changes the sha256 check in `tools/opening-book/compile.ts` (`:168`, `actual !== expected[file]`).

*Pain:* `ABC-155` added a near-miss on the **last** hex char, which kills a prefix compare. A compare that keeps the
last char and drops another position still passes. At `1671f24f`, `npx vitest run tools/opening-book/book.test.ts`
reads **19 of 19 green** on each of:
- **`Q-SUFFIX8`:** `actual.slice(-8) !== expected[file].slice(-8)`;
- **`Q-SKIP8`:** `actual.slice(8) !== expected[file].slice(8)`.

`ABC-155`'s *Value* line ("catches a check that compares less than the whole digest") claims more than the test holds.

*Value:* with a near-miss at each end, both contiguous narrowings (a prefix and a suffix compare) go red. QE measured
the first-char case red against `Q-SUFFIX8` (`T-FIRSTCHAR`).

## Scope

- **Inside the `ABC-145` describe's `A1/A2` `it` in `tools/opening-book/book.test.ts` only:** one more refusal case,
  after `ABC-155`'s last-char case. The fixture stays unaltered. For one file, `expected` is that file's own hash with
  its **first** hex char replaced by a different hex char; every other file keeps its own hash. `checkThenWriteBook`
  must refuse. The Engineer picks the file and the char.
- `fixture()` and every other block are not edited.

## Out of scope

- **Any byte of `tools/opening-book/compile.ts`**, `data/`, `src/`, `AGENTS.md`.
- **A near-miss at every position.** No finite set short of one case per position pins an arbitrary subset compare
  (QE). The two ends cover the two contiguous narrowings, and nothing more is asked.
- `QE-155-b`/`-c`/`-d` (INFO): unchanged. `AR-145-CLI-WIRING`: unchanged.
- `ABC-155`'s page text.

## Acceptance (Given/When/Then)

- **`A1` (the first char is compared).** **Given** the unaltered five-file fixture and `expected` equal to the
  fixture's own hashes except one file's entry, whose **first** hex char differs, **when** `checkThenWriteBook` runs
  in process against a fresh scratch output path, **then** it refuses; the refusal contains that file's name, the
  altered expected hash and the actual hash (**3 of 3**); and the output path does not exist.
- **`A2` (the gap is closed: mutants).** Each mutant is planted in a scratch copy outside the repository. The lane is
  `npx vitest run tools/opening-book/book.test.ts`.
  - **`Q-SUFFIX8`** and **`Q-SKIP8`**, with the texts above: **green on the base test, red on the head test.**
  - **`Q-PREFIX`** (`ABC-155`): red on both. `Q-CASE`: green on both (equivalent).
  - **`M05`, `M-SWAP`, `M06`** (`ABC-153`'s texts): red on both.
  - The unmutated head is green. The delivery note records all readings (6 mutants plus the unmutated build, at
    base and head).
- **`A3` (fences).**
  - `git diff --name-only <base>` lists exactly `tools/opening-book/book.test.ts`, with **0** new files.
  - Every changed line lies inside the `A1/A2` `it`. `compile.ts` and `data/opening-book/book.json` are `cmp` 0
    against base.
  - `npm test`: the file count and the test count equal base, and skips are **0**.

## Dependencies

- **`ABC-155` — `Done` on `main` at `1671f24f`** (its case is the one this follows). None blocking. No open ticket
  touches `tools/opening-book/`.

## Security / NFR triggers

- **`NFR-008` / `N8-LANE`:** 0 test files, 0 tests, 0 spawns; one more in-process compile inside an existing `it`.
- **Security:** not triggered. Test-only diff.

## Test notes

1. **Show the gap first:** run `Q-SUFFIX8` against the base test.
2. **Plant in scratch copies, never in the worktree.**
3. **Mandatory gates:** lint, typecheck, build, `npm test`. A QE hop is owed. The UAT waiver is expected; it is
   measured at the exit.

## Size and priority

**`XS`:** one refusal case inside one existing `it`. **Not `S`:** no code, no new test.

**`P3`:** the shipped check compares the whole digest with `!==`. **Not `P2`:** nothing reaches the narrowing today.
**Promotion trigger (`P2`, merge first):** a ticket that edits `compile.ts`, moves `SOURCE_COMMIT` or
`SOURCE_SHA256`, or regenerates `book.json` is cut or pulled. This is `ABC-145`/`153`/`155`'s trigger.

## Definition of Ready

BA/PM, 2026-10-17. **Result: 10 of 10.**

| # | item | verdict |
|---|---|---|
| 1 | problem clear | **✅** `Q-SUFFIX8` and `Q-SKIP8` 19/19 green at `1671f24f` |
| 2 | scope and out-of-scope clear | **✅** one case in one `it`; every-position coverage fenced with its reason |
| 3 | INVEST-shaped | **✅** independent; testable by mutants |
| 4 | acceptance testable and measurable | **✅** 3 of 3, no output, two mutants green → red, equal counts |
| 5 | dependencies known | **✅** `ABC-155` `Done` |
| 6 | security/NFR triggers with a measurable target | **✅** 0 / 0 / 0 |
| 7 | test notes present | **✅** three |
| 8 | size assigned | **✅** `XS` |
| 9 | priority assigned | **✅** `P3`, promotion trigger named |
| 10 | no major unresolved blocker | **✅** none |

Column moves are the Orchestrator's.
