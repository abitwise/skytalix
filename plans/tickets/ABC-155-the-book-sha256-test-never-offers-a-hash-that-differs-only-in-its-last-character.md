---
id: ABC-155
title: "The book compiler's sha256 test never offers an expected hash that differs only in its last character — a check that compares a prefix passes it"
status: backlog
column: Backlog
size: XS
priority: P3
epic: EPIC-005
feature: —
---

# ABC-155 — one more refusal inside `ABC-145`'s existing `it`: an expected hash equal to the fixture's own except its LAST hex char must refuse. ZERO production lines, ZERO new tests

> **Cut 2026-10-12 by BA/PM** (task `wave-2026-09-25`, subtask `bapm-fold-ABC-105-153`), from `ABC-153`'s QE gap
> register (`.grugops/context/qe-ABC-153/notes/…e88108db`):
> - **`QE-153-a`** (LOW) is the reason for this ticket;
> - **`QE-153-b`** and **`QE-153-c`** (INFO) are closed with no action (`ABC-153` § Fold).
>
> Every reading below is QE's (`…3d6ce640`), cited and not re-run. **This hop measured nothing.**

## Problem

*User:* the next hop that changes `tools/opening-book/compile.ts`'s check. That hop needs the lane to go red
if the check stops comparing the whole digest.

*Pain:* in every refusal case of the `ABC-145` test, the actual and expected hashes come from different bytes.
A one-byte change moves the whole digest, so the two never share a prefix. QE's mutant **`Q-PREFIX`**
(`actual.slice(0, 8) !== expected[file].slice(0, 8)`) **passes 19 of 19** at the head and at the base of
`ABC-153` (`…3d6ce640`, row `Q-PREFIX`). A check that compares a short hash would let a source that differs
from upstream through without a sound.

*Value:* the check exists to refuse a source that differs from upstream at regeneration. After this ticket, the
lane catches a check that compares less than the whole digest.

## Scope

- **Inside the `ABC-145` describe's `A1/A2` `it` in `tools/opening-book/book.test.ts` only:** one more refusal
  case. The fixture stays **unaltered**. For one file, `expected` is that file's own hash with its **last** hex
  char replaced by a different hex char. Every other file's expected value is its own hash. `checkThenWriteBook`
  must refuse.
- The Engineer picks the file and the replacement char. Example: the last file in `SOURCE_FILES`, with the
  last char moved to the next hex digit, modulo 16.
- The shared `fixture()` helper and every other block are not edited.

## Out of scope

- **Any byte of `tools/opening-book/compile.ts`**, `data/`, `src/`, `AGENTS.md`.
- **`QE-153-b` (`Q-CASE`)**: closed no-action. The digest is lowercase hex and the five pins are lowercase,
  so the two are equivalent on every reachable input.
- **`QE-153-c`** (the restore after `e.tsv` is observed by nothing): closed no-action. Nothing reads the
  directory after the loop. This ticket does not set out to observe it.
- **`AR-145-CLI-WIRING`:** unchanged, with the same trigger as on `ABC-153`.
- Any timing reading.

## Acceptance (Given/When/Then)

- **`A1` (the whole digest is compared).** **Given** the unaltered five-file fixture and `expected` equal to
  the fixture's own hashes, except one file's entry whose **last** hex char differs, **when**
  `checkThenWriteBook` runs in process against a fresh scratch output path, **then**:
  - it refuses;
  - the refusal contains that file's name, the altered expected hash and the actual hash (**3 of 3**);
  - the scratch output path does not exist.
- **`A2` (the gap is closed: mutants).** Each mutant is planted in a scratch copy outside the repository. The
  lane is `npx vitest run tools/opening-book/book.test.ts`.
  - **`Q-PREFIX`**, with QE's text (`…3d6ce640`): **green on the base test and red on the head test.**
  - **`Q-CASE`:** green on both. It is equivalent, and this records the reading.
  - **`M05`, `M-SWAP` and `M06`**, with `ABC-153`'s texts: red on the head test, as at base.
  - The unmutated head is green.
  - The delivery note records all ten readings (5 builds × base and head test).
- **`A3` (fences).**
  - `git diff --name-only <base>` lists exactly `tools/opening-book/book.test.ts`, and **0** new files.
  - Every changed line lies inside the `A1/A2` `it`. `fixture()`, every other block and the describe's `A3`
    `it` are `cmp` 0 to base on each window.
  - `tools/opening-book/compile.ts` and `data/opening-book/book.json` are `cmp` 0 against base.
  - `book.test.ts` holds **0** `spawn` / `execFile` / `child_process` matches. It holds 0 at the cut base.
  - `npm test`: the file count and the **test count equal base**, and skips are **0**.

## Dependencies

- **`ABC-153` — `Done`** (merged `38e52f4d`). This ticket adds one case to the `it` that `ABC-153` rewrote.
  `book.test.ts` is `cmp` 0 to `ABC-153`'s code commit `917df052` at the cut base `6ae6dd27`.
- **None blocking.** No open ticket touches `tools/opening-book/`.

## Security / NFR triggers

- **`NFR-008` / `N8-LANE`:** the count is the pin. **0 test files, 0 tests and 0 spawns added.** The work is one
  more in-process compile inside an existing `it`, and its cost is not bounded here (`ADR-0035` decision 3).
  This ticket does **not** touch `ABC-105`'s `N8-LANE` set.
- **Security:** not triggered. The diff is test-only, with no input path, network or dependency.

## Test notes

1. **Show the gap first.** Run `Q-PREFIX` against the **base** test to show it passes, then against the head test.
2. **Plant in scratch copies, never in the worktree.** `git status --porcelain` is empty afterwards.
3. **Mandatory gates:** lint, typecheck, build, `npm test`. A QE hop is owed, and QE re-plants the mutants
   itself. With 0 production `src/` lines, the UAT waiver is expected. It is measured at the exit, never asserted
   here.

## Size and priority

**`XS`:** one refusal case inside one existing `it`, plus five scratch mutants.
- **Not `S`:** no production code, no new test, no new file.

**`P3`:**
- **Not `P2`:** the shipped check compares with `!==` on the full digest (`compile.ts:168`), and `book.json`
  is `cmp` 0. The gap is only that nothing stops a later edit from narrowing the compare.
- **Promotion trigger: `P2`, and merge first,** when a ticket that edits `tools/opening-book/compile.ts`, moves
  `SOURCE_COMMIT` or `SOURCE_SHA256`, or regenerates `book.json` is cut or pulled. This is the same trigger as
  `ABC-145` and `ABC-153`.

## Definition of Ready

BA/PM, 2026-10-12. **Result: 10 of 10.**

| # | item | verdict |
|---|---|---|
| 1 | problem clear | **✅** `Q-PREFIX` passes 19 of 19 (QE `…3d6ce640`); the cause is that no expected value shares a prefix with its actual |
| 2 | scope and out-of-scope clear | **✅** one case in one `it`; `compile.ts`, `fixture()` and other blocks fenced; `QE-153-b`/`-c` closed with reasons |
| 3 | INVEST-shaped | **✅** independent; one case; testable by mutants |
| 4 | acceptance testable and measurable | **✅** 3 of 3 refusal with no output; `Q-PREFIX` green → red with readings at base and head; `cmp` windows; equal counts |
| 5 | dependencies known | **✅** `ABC-153` `Done`; nothing open overlaps |
| 6 | security/NFR triggers with a measurable target | **✅** count pin 0 / 0 / 0; security not triggered, with the reason |
| 7 | test notes present | **✅** three |
| 8 | size assigned | **✅** `XS` |
| 9 | priority assigned | **✅** `P3`, both directions argued, promotion trigger named |
| 10 | no major unresolved blocker | **✅** none |

Column moves are the Orchestrator's.
