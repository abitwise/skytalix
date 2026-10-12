---
id: ABC-153
title: "The book compiler's sha256 test alters only `a.tsv`, and the fixture's other four files share one hash — a check limited to the first file passes it"
status: backlog
column: Backlog
size: XS
priority: P3
epic: EPIC-005
feature: —
---

# ABC-153 — alter each of the five source files in turn, over five distinct hashes, inside `ABC-145`'s existing test: ZERO production lines, ZERO new tests

> **Cut 2026-10-12 by BA/PM** (task `wave-2026-09-25`, subtask `bapm-fold-2026-10-12`, Workflow 07),
> from `ABC-145`'s QE gap register (`.grugops/context/qe-ABC-145/notes/…8deadc79`):
> - **`QE-145-a`** (LOW) is the reason for this ticket;
> - **`QE-145-b`** (LOW) is **not** folded in. It is accepted as `AR-145-CLI-WIRING` (§ Out of scope).
>
> No open ticket edits `tools/opening-book/`. Every reading below is QE's (`…0d24876c`, `…b9f6d36a`), cited
> and not re-run. **This hop measured nothing.**

## Problem

*User:* the next hop that changes `tools/opening-book/compile.ts`'s check. That hop needs the lane to
go red if the check stops covering all five files.

*Pain:* the `ABC-145` test (`tools/opening-book/book.test.ts`, describe "ABC-145 — the source bytes are
checked…") alters **only `a.tsv`**. The shared `fixture()` helper writes `b.tsv`..`e.tsv` header-only,
so those four files share **one** sha256.
- QE's mutant `M05`, a check that covers only `a.tsv`, **passes all 19 tests** (`…b9f6d36a`).
- So does a check that confuses two of `b.tsv`..`e.tsv` (for example, it checks `b.tsv` against
  `c.tsv`'s expected hash), because their expected hashes are equal.

QE's own plant (alter `c.tsv`, then `e.tsv`, over five distinct hashes) was refused 3 of 3. So the
fix is in the fixture and the alteration, not in the compiler.

*Value:* the check exists to refuse a source that differs from upstream at regeneration. A check
limited to the first file would let four of five files drift without a sound. After this ticket, the
lane catches that.

## Scope

- **Inside the `ABC-145` describe in `tools/opening-book/book.test.ts` only:**
  - the five fixture files carry **five distinct** sha256 values, and the test asserts that;
  - the refusal case runs **once per file** in `SOURCE_FILES`, altering that one file by one byte in
    place, so the file stays well formed;
  - the unaltered control (`A2` of `ABC-145`) stays.
- The Engineer picks the shape. One example is one `GOOD_ROWS` row per file, built inside the describe.
  Another is a fresh directory per altered file. The shared `fixture()` helper is not edited.

## Out of scope

- **Any byte of `tools/opening-book/compile.ts`**, `data/`, `src/`, `AGENTS.md`.
- **The shared `fixture()` helper and every block outside the `ABC-145` describe.** They are
  byte-unchanged.
- **`QE-145-b` → `AR-145-CLI-WIRING`, accepted.** No lane test pins the command-line block's call to
  `checkThenWriteBook`. QE's `M07` passes the lane. A spawn would pin it, and this file has 0 spawns
  on purpose. A test that reads the source text is declined: a comment satisfies it, and it pins the
  spelling, not the behaviour.
  - **Trigger:** a hop that edits `compile.ts`'s command-line block, moves `SOURCE_COMMIT` or
    `SOURCE_SHA256`, or regenerates `book.json` repeats `ABC-145` `A4` on the real source.
  - That repeat includes **one byte flipped in place in a file other than `a.tsv`**. Its reading is
    the hash text in the refusal, not just the exit code (`ABC-145` `A4`, 2026-10-12 correction,
    `QE-145-e`).
- `QE-145-c`, `-d` and `-g` (INFO): no action.
- Any timing reading.

## Acceptance (Given/When/Then)

- **`A1` (every file is checked).**
  - **Given** a fixture of five well-formed files with **5 distinct** sha256 values (asserted in the
    test: the set of expected hashes has size 5), and expected hashes taken as the fixture's own;
  - **when**, for **each** of the five files in turn, that one file is altered by one byte in place
    and `checkThenWriteBook` runs in process against a fresh scratch output path;
  - **then**, for each of the five:
    - it refuses;
    - the refusal contains that file's name, its expected hash and its actual hash (**3 of 3**);
    - the scratch output path does not exist.
- **`A2` (control).** **Given** the same fixture unaltered, **when** the same call runs, **then** it
  does not refuse, and the output file exists.
- **`A3` (the gap is closed: mutants).** Each mutant is planted in a scratch copy outside the
  repository, and the lane is `npx vitest run tools/opening-book/book.test.ts`.
  - **`M05`:** the check covers only `a.tsv`. It is **green on the base test and red on the head
    test.**
  - **`M-SWAP`:** `b.tsv` is checked against `expected["c.tsv"]` and `c.tsv` against
    `expected["b.tsv"]`. It is **green on the base test and red on the head test.**
  - **`M06`:** the first file is skipped. It is red on both.
  - The unmutated head is green.
  - The delivery note records all eight readings (4 builds × base and head test).
- **`A4` (fences).**
  - `git diff --name-only <base>` lists exactly `tools/opening-book/book.test.ts`, and **0** new
    files.
  - Every changed line lies inside the `ABC-145` describe and outside its `A3` `it`, or in the file's
    import list if a new import is needed. The `fixture()` helper, every other block and the describe's `A3`
    `it` are byte-identical to base, which `cmp` on each window checks.
  - `tools/opening-book/compile.ts` and `data/opening-book/book.json` `cmp` 0 against base.
  - `book.test.ts` holds **0** `spawn` / `execFile` / `child_process` matches.
  - `npm test`: the file count and the **test count equal the base's**. The per-file loop lives inside
    the existing `it`. Skips are **0**.

## Dependencies

- **`ABC-145` — `Done`** (merged `f3440c97`). This ticket hardens its test.
- **None blocking.** Pullable today. No open ticket touches `tools/opening-book/`.

## Security / NFR triggers

- **`NFR-008` / `N8-LANE`:** the count is the pin: **0 test files, 0 tests and 0 spawns added**.
  The work is five small in-process compiles inside one existing `it`. Their cost is not bounded
  here (`ADR-0035` decision 3).
- **Security:** not triggered. A test-only diff with no input path, network or dependency.

## Test notes

1. **Show the gap first.** Run `M05` and `M-SWAP` against the **base** test to show they pass it.
   That is the whole case for this ticket. Then run them against the head test.
2. **Plant in scratch copies, never in the worktree.** `git status --porcelain` is empty afterwards.
3. **Mandatory gates:** lint, typecheck, build, `npm test`. A QE hop is owed, and QE re-plants the
   mutants itself. With 0 production `src/` lines, the UAT waiver is expected. It is measured at the
   exit, never asserted here.

## Size and priority

**`XS`:** one `it` body in one describe, plus four scratch mutants.
- **Not `S`:** no production code, no new test, no new file.

**`P3`:**
- **Not `P2`:** the shipped `book.json` is correct, and `ABC-145` `A4` proved the check on the real
  bytes. The gap is that nothing stops a later edit from narrowing the check.
- **Promotion trigger: `P2`, and merge first,** when a ticket that edits
  `tools/opening-book/compile.ts`, moves `SOURCE_COMMIT` or `SOURCE_SHA256`, or regenerates
  `book.json` is cut or pulled. That is also `ABC-145`'s own trigger.

## Definition of Ready

BA/PM, 2026-10-12. **Result: 10 of 10.**

| # | item | verdict |
|---|---|---|
| 1 | problem clear | **✅** `M05` passes 19 of 19 (QE `…b9f6d36a`); the shared-hash cause is read from `fixture()` |
| 2 | scope and out-of-scope clear | **✅** one describe in one file; `compile.ts`, `fixture()`, other blocks fenced; `QE-145-b` accepted with a trigger |
| 3 | INVEST-shaped | **✅** independent; one test body; testable by mutants |
| 4 | acceptance testable and measurable | **✅** 5 distinct hashes asserted; 5 × 3-of-3 refusals; 2 mutants green→red with readings at base and head; `cmp` windows; equal counts |
| 5 | dependencies known | **✅** `ABC-145` `Done`; nothing open overlaps |
| 6 | security/NFR triggers with a measurable target | **✅** count pin 0 / 0 / 0; security not triggered, with the reason |
| 7 | test notes present | **✅** three |
| 8 | size assigned | **✅** `XS` |
| 9 | priority assigned | **✅** `P3`, both directions argued, promotion trigger named |
| 10 | no major unresolved blocker | **✅** none |

Column moves are the Orchestrator's.

## Delivery

Software Engineer, 2026-10-12 (subtask `ticket-to-pr-ABC-153`). Branch `grugops/ABC-153-book-sha256-every-file`
from `main` `21980135` (child of the brief's `05a1f11d`; board/queue only); code commit `917df052`. The detail is in
`.grugops/context/ticket-to-pr-ABC-153/notes/`. **No timing reading was taken.**

- **Shape:** inside the existing `A1/A2` `it`, each file gets `HEADER` plus one `GOOD_ROWS` row (file `i`, row `i`),
  written over `fixture()`'s output; the helper is untouched. A `forEach` over `SOURCE_FILES` lower-cases the
  first letter of that file's name (one byte, in place), checks the refusal, then restores the file.
- **`A1`:** set of expected hashes has size 5 (asserted); per file: refused, 3 of 3, output absent. PASS.
- **`A2`:** the unaltered control writes. PASS.
- **`A3`:** unmutated base 19/19 green, head 19/19 green. `M05` base green (19 passed), head red (1 failed:
  `b.tsv` not refused). `M-SWAP` base green, head red (1 failed: the control refuses `b.tsv`). `M06` red on
  both (1 failed: `a.tsv` not refused). PASS.
- **`A4`** (read at `917df052`): one path, 0 new files; `cmp` 0 on lines 1–273, on the `A3` `it` to EOF and on
  `fixture()`; `compile.ts` and `book.json` `cmp` 0; 0 spawns; `npm test` 56 files / 1743 tests at base and head,
  0 skipped. PASS.
- **Gates:** lint, typecheck, build and `npm test` exit 0; `last-run.json` `success: true`; integrity `No findings.`
- **UAT waiver reading:** `git diff --name-only main...HEAD | grep -v '\.test\.ts$' | grep '^src/'` is empty.
- **Owed:** the QE hop.
