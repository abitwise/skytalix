---
id: ABC-145
title: "The opening-book compiler stamps `source.commit` into `book.json` and never checks the source bytes — pin the five sha256 values and refuse a mismatch"
status: backlog
column: Backlog
size: XS
priority: P3
epic: EPIC-005
feature: —
---

# ABC-145 — the compiler checks each source file's sha256 against a pinned `SOURCE_SHA256` before it writes, and refuses a mismatch with no write

> **Cut 2026-10-11 by BA/PM** (task `wave-2026-09-25`, subtask `bapm-followups-2026-10-11`, Workflow 07),
> from QE's `QE-093-b` (LOW, `ABC-093`'s gap register, `…cce9af72`). Architect/Design ruled it and
> specified the ticket in full (`.grugops/context/design-low-batch-2026-10-11/notes/…e95791ae`).
> `ADR-0037` carries the amendment under D1(f), and it takes effect when this ticket merges.
>
> Every fact below was read from files at `aebde4c9`. This hop ran nothing and timed nothing.

## Problem

*User*: the next person who regenerates `data/opening-book/book.json`. Also every later reader who
trusts `book.json`'s `source.commit` field as proof of where the data came from.

*Pain*:
- `tools/opening-book/compile.ts` writes `source.commit = SOURCE_COMMIT` (`:26`) into `book.json`, but it
  never reads the inputs' bytes against anything (QE, `…cce9af72`).
- So **any directory of well-formed TSVs compiles under the pinned commit**. That includes a newer
  upstream commit, a hand-edited file, or a truncated download.
- The field is a label, not a proof. `ADR-0023`'s CC0 basis rests on the data being the pinned data.
- `data/opening-book/ATTRIBUTION.md` already records the five sha256 values. Nothing compares them with the
  bytes.

*Value*: `source.commit` in a shipped file becomes a checked claim. The compiler is the only party that
sees the bytes, and the check costs about one `node:crypto` call per file (`…e95791ae`).

## Scope

1. **A `SOURCE_SHA256` constant** beside `SOURCE_COMMIT` in `tools/opening-book/compile.ts`. It holds the
   five hex values from `ATTRIBUTION.md`, one per file in `SOURCE_FILES`.
2. **The check runs on the command-line path, before `writeBook`.**
   - It hashes each file's raw bytes (sha256).
   - On a mismatch it refuses with no write, and the refusal names the file, the expected hash and the
     actual hash.
   - **The check is a function a test can call in process.** No child process is spawned. The Engineer
     picks its name and shape. It must be callable with an expected-hash set other than
     `SOURCE_SHA256`, so that a fixture can be checked.
3. **Two tests in `tools/opening-book/book.test.ts`**: the refusal (`A1`, with its control `A2`) and the
   drift pin (`A3`).
4. **`ATTRIBUTION.md` § Regenerating:** the line "change `SOURCE_COMMIT` … and this file together" also
   names `SOURCE_SHA256`.

## Out of scope

- **`compileBook`, `writeBook`'s signature, and the 9 existing tests in `book.test.ts`.** They stay
  unchanged. The fixture tests still call `writeBook` with `"0".repeat(40)`.
- **`book.json`'s bytes.** The artifact does not change by one byte.
- **Any line under `src/`.**
- **Fetching the source in the test lane.** The lane cannot hold the source files (`ADR-0037`). The
  positive path on the real bytes is a delivery RUN (`A4`), not a lane test.
- **`AGENTS.md`.** Its regeneration line does not restate the gap. Nothing is owed there.
- **`memory-bank/90-agents-md-command-log.md`:79** (the `QE-093-b` trap line). It gets a one-line update
  when this ticket merges. **That edit is the Scribe's**, after merge, and it is not part of this diff.
- **Moving `SOURCE_COMMIT`** to a newer upstream commit.

## Acceptance (Given/When/Then)

Each criterion is read by a command or an assertion, never by eye.

- **`A1` (a mismatched source is refused, and nothing is written).** **Given** a fixture directory of the
  five files, the expected hashes taken as the fixture's own sha256 values, and then **one file altered
  by one byte**, **when** the command-line path's check-then-write runs in process against a scratch
  output path, **then**:
  - it refuses;
  - the refusal text contains the altered file's name, its expected hash and its actual hash
    (**3 of 3** substrings);
  - the scratch output path **does not exist** afterwards.
- **`A2` (control: an unaltered fixture passes).** **Given** the same fixture directory and expected
  hashes with no file altered, **when** the same in-process path runs, **then** it does not refuse, and the
  output file exists. *This proves `A1` is not met by a check that refuses everything.*
- **`A3` (the constant and `ATTRIBUTION.md` cannot drift).** **Given** `SOURCE_SHA256` and
  `ATTRIBUTION.md`, **when** the test reads both, **then** each of the five values appears **on the table
  row that names its own file** (**5 of 5**). Bare presence anywhere is not enough, because two swapped
  values would pass that.
  - Mutant, shown at delivery on a scratch copy: change one hex character of one constant, and `A3` goes
    red.
- **`A4` (the real source still compiles to the same bytes: a delivery RUN).** **Given** the five files
  fetched at `SOURCE_COMMIT` from the raw URLs in `ATTRIBUTION.md`, into a directory outside the
  repository, **when** `node tools/opening-book/compile.ts <that dir>` runs, **then**:
  - it exits **0**;
  - `cmp` of `data/opening-book/book.json` against `git show <base>:data/opening-book/book.json` exits
    **0**.

  Negative run in the same window: copy the fetched directory, append one byte to one file, and run the
  same command on the copy. **Then** it exits **non-zero**, names that file, and `book.json` still `cmp`s
  **0** against the base. This is the same evidence `ABC-093`'s `A1` used.
- **`A5` (the regeneration instruction names the new pin).** **Given** `ATTRIBUTION.md` § Regenerating,
  **when** it is searched **on joined text** (newlines folded to spaces, `**` and backticks stripped),
  **then** `SOURCE_SHA256` occurs **≥ 1** time in that section.
  - A line `grep` is not the reading. A wrapped sentence hides from it (`G-QE-070-2`).
  - **0** lines change in the five-row hash table (`/usr/bin/diff` or `cmp` on the table window, base
    against head).
- **`A6` (fences).**
  - `git diff --name-only <base>` lists only these paths, a subset of 3:
    `tools/opening-book/compile.ts`, `tools/opening-book/book.test.ts`, `data/opening-book/ATTRIBUTION.md`.
  - **0** paths under `src/`, and **0** new files.
  - `data/opening-book/book.json` is byte-unchanged (`cmp` against the base exits 0).
  - `compileBook`'s body and `writeBook`'s export line are byte-unchanged.
  - The 9 existing `it` blocks in `book.test.ts` are unchanged.
  - The no-argument run still prints the usage line and exits **1**.
  - `npm test`: the **file count equals the base's**, the **test count is the base's + 2**, and skips are
    **0**.
  - `book.test.ts` holds **0** `spawn` / `execFile` / `child_process` matches.

## Dependencies

- **`ABC-093` — `Done`.** This ticket amends its compiler.
- **`ADR-0037`'s D1(f) amendment is merged on `grugops/wave-2026-09-25`** (read at `aebde4c9`, `:148–166`).
  It takes effect when this ticket merges.
- **`ABC-144`** edits `vitest.config.ts` or the `test` script. That is a different file, so there is no
  overlap. If `ABC-144` merges first, the base's file and test counts in `A6` are re-read at the new base.
- **None blocking. Pullable today.**

## Security / NFR triggers

- **`NFR-008` (R-1).** `tools/` tests are inside the clause, and the instrument is `npm test` (Architect,
  `…7bf3d1ce`).
  - **The count is the pin** (`ADR-0035` decision 3): **0 files, +2 tests, 0 spawns**. No timing bound
    is written.
  - The narrow set is `tools/opening-book/book.test.ts` (`ADR-0035` decision 2).
- **`NFR-006` (artifact ≤ 1 MiB):** untouched. The bytes do not change (`A6`).
- **Security (ASVS L1):** this hardens provenance. The input surface is the same local directory argument,
  and no dependency is added (`node:crypto` is built in). The compiler makes no network call. The fetch
  in `A4` is the delivery hop's.

## Test notes

1. **Fixture hashes are the fixture's own.** The real pins can never match a fixture. So `A1`/`A2` pass the
   expected set in, and `A3` is the only test that reads `SOURCE_SHA256` itself.
2. **Show `A1` going green → red.** Before the change, the same fixture compiles without complaint, which
   is the defect. After the change, it is refused.
3. **Use `/usr/bin/diff` or `cmp` for every byte-identity reading.** On this host `diff` is a shell
   function wrapping git (`qe-ABC-070` `…740c0999`).
4. **Mandatory gates:** lint, typecheck, build, `npm test`. The QE hop is owed. With 0 production `src/`
   lines the UAT waiver is expected. It is measured at the exit, never asserted here.

## Size and priority

**`XS`:** one constant, one small function on the command-line path, +2 in-process tests, one sentence
in `ATTRIBUTION.md`, and one delivery RUN.
- **Not `S`:** no harness, no new file, no child, no production code.

**`P3`:**
- **Not `P2`:** the shipped `book.json` is correct today. `ABC-093`'s `A1` reproduced it byte for byte
  from the real source. The risk only bites at a **future** regeneration.
- **Promotion trigger:** a hop that will change `SOURCE_COMMIT` or regenerate `book.json` is scheduled.
  This ticket then merges first, at `P2`.

## Definition of Ready

BA/PM, 2026-10-11. **Result: 10 of 10.**

| # | item | verdict |
|---|---|---|
| 1 | problem clear | **✅** the label-not-proof gap, cited to QE `…cce9af72` and read at `compile.ts:26`/`:134`/`:139–147` |
| 2 | scope and out-of-scope clear | **✅** four scope items; `src/`, `book.json`'s bytes, `compileBook`/`writeBook`, the lane fetch, `AGENTS.md` and the Scribe's log line fenced out |
| 3 | INVEST-shaped | **✅** independent of every open ticket; `XS`; testable in process plus one delivery RUN |
| 4 | acceptance testable and measurable | **✅** 3 of 3 substrings, the output absent / present, 5 of 5 per-row, exit 0 / non-zero, `cmp` 0, joined-text count ≥ 1, ≤ 3 paths, test count base + 2 |
| 5 | dependencies known | **✅** `ABC-093` `Done`; the `ADR-0037` amendment merged; `ABC-144` no file overlap |
| 6 | security/NFR triggers with a measurable target | **✅** `NFR-008` count pin 0 / +2 / 0; `NFR-006` untouched; ASVS L1, no new surface |
| 7 | test notes present | **✅** four |
| 8 | size assigned | **✅** `XS` |
| 9 | priority assigned | **✅** `P3`, the reason it is not `P2`, and a promotion trigger |
| 10 | no major unresolved blocker | **✅** none. The `A4` fetch needs the network at the delivery hop, as `ABC-093`'s `A1` did |

Column moves are the Orchestrator's.

## Delivery

Software Engineer, 2026-10-12 (subtask `ticket-to-pr-ABC-145`). Branch `grugops/ABC-145-book-source-sha256`
from `main` `3537fe48`; code commit `7be28bf9`. The detail is in `.grugops/context/ticket-to-pr-ABC-145/notes/`.
**No timing, wall or CPU reading was taken.**

- **Shape:** `SOURCE_SHA256` is a record keyed by file name. `checkThenWriteBook(sourceDir, outPath, commit,
  expected)` is the command-line path: it hashes each file and throws `<file>: sha256 is <actual>, expected
  <expected>` before `writeBook` runs.
- **`A1`:** red against a stub with no check (0 of 3 substrings; the altered fixture compiled), then green
  (3 of 3, no output file). The alteration is one byte in place inside a name, so the fixture stays
  well-formed. **`A2`:** the control writes.
- **`A3`:** 5 of 5. On a scratch copy, a one-hex-character mutant is red (4 of 5), and so is an `a`/`b` swap
  (3 of 5).
- **`A4` (RUN 2026-10-12):** the five files fetched at `SOURCE_COMMIT` match all five pins. The compile exits
  0 and `cmp` against `main`'s `book.json` exits 0. With one byte appended to `d.tsv` it exits 1 and names
  `d.tsv` and both hashes, and `book.json` still `cmp`s 0.
- **`A5`:** `SOURCE_SHA256` occurs 2 times in § Regenerating on joined text. The table lines `cmp` 0.
- **`A6`** (read at `7be28bf9`; the docs commit adds the required state-plane paths): 3 paths, 0 `src/`, 0 new files. `book.json`, `compileBook`'s body and `writeBook`'s export line
  all `cmp` 0. No existing `it` changed; the base file holds **10** blocks, not the 9 written above (9 `it`
  plus one `it.each`). The no-argument run exits 1. `npm test`: 56 files (base 56), 1743 tests (base 1741 + 2),
  0 skipped. 0 spawns.
- **Gates:** lint, typecheck, build and `npm test` exit 0. Skip count 0; integrity `No findings.`
- **UAT waiver reading:** `git diff --name-only main...HEAD | grep -v '\.test\.ts$' | grep '^src/'` is empty.
- **Owed:** the QE hop; after merge, the Scribe's line in `memory-bank/90-agents-md-command-log.md`.

## QE

QE/E2E, 2026-10-12 (subtask `qe-ABC-145`). This reviews `62a5f8ea` (code `7be28bf9`, base `3537fe48`) on QE's own
branch `grugops/qe-ABC-145`. QE took its own readings first, then read the SE's notes, and they agree. The detail is
in `.grugops/context/qe-ABC-145/notes/`. **No timing reading was taken.**

**Verdict: PASS_WITH_GAPS (none blocking).**

- **`A1` MET.** QE's own plant flipped one byte in place in `c.tsv`, then in `e.tsv`, across five distinct
  files. It is refused with 3 of 3 substrings, and there is no output. A variant with no check matches 0 of 3
  and writes.
- **`A2` MET.** The control writes.
- **`A3` MET.** 5 of 5. These all turn it red: one hex character in the constant, one in `ATTRIBUTION.md`, the
  `a`/`b` swap, an uppercased hex character, and a renamed key.
- **`A4` MET (re-run by QE).**
  - The fetched bytes match 5 of 5 pins. The compile exits 0, and `cmp` against `main` exits 0.
  - These all exit 1 with `book.json` `cmp` 0: `x` appended to `b.tsv`, one byte flipped in place in `c.tsv`,
    and a missing `e.tsv`.
- **`A5` MET.** 2 occurrences on joined text (0 at base). The table rows `cmp` 0.
- **`A6` MET, on the code range.**
  - 3 paths, 0 under `src/`, 0 new files.
  - The tip adds only the record paths.
  - `book.json`, `compileBook` and `writeBook` `cmp` 0.
  - All **10** existing blocks are byte-unchanged.
  - The no-argument run exits 1.
  - 56 → 56 files, 1741 → 1743 tests, 0 skips, 0 spawns.
  - Lint, typecheck and build exit 0.

**Gaps:**

| id | severity | gap |
|---|---|---|
| `QE-145-a` | LOW | The lane alters only `a.tsv`. A check limited to `a.tsv` passes it. |
| `QE-145-b` | LOW | No lane test pins the command-line path's call to the check. Only `A4` catches a bypass. This is a design residual of the 0-spawn fence. |
| `QE-145-e` | LOW, wording | `A4`'s "append one byte" negative run does not tell the check apart from the base validator: base also exits 1 and names the file. An in-place flip, or the hash text in the message, is the discriminating reading. |
| `QE-145-f` | INFO, wording | § Out of scope and `A6` say "9 existing `it` blocks". The base file holds 10: 9 `it` plus 1 `it.each` over 8 rows. QE did not edit the prose above. |
| `QE-145-c`, `-d`, `-g` | INFO | A decoded-text hash gives the same answer on the real bytes. A check-then-read gap exists, which the SE declared. An extra key in the constant is refused by typecheck only. |

**UAT waiver:** the measured line is empty. `tools/` changed, but it does not reach the game. Application is the
Orchestrator's.

**Board move:** the Orchestrator's.
