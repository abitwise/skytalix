---
id: ABC-176
title: "A run the heap guard refuses never reads as a clean skip count or a quiet result file"
status: done
column: Done
size: XS
priority: P3
epic: —
feature: —
---

# ABC-176: when `heap-guard.js` refuses a run, the skip-count capture yields no integer and the result file names the refusal

> **Cut 2026-10-19 by BA/PM** (subtask `bapm-cut-ABC-176`, from `ad71aec4`). It answers the owner's word
> `.grugops/context/wave-2026-09-25/notes/…5c8d2f71`: *SEC-173-1: "Cut a small follow-up (Recommended)"*, together
> with `QE-173-d`. Sources: `SEC-173-1` (`.grugops/context/secnfr-ABC-173/notes/…f3757b98`, `probe/skipzero.out`),
> `QE-173-d` (`.grugops/context/qe-ABC-173/notes/…e81b5c27`). Records only. This hop ran no vitest and no timing.

> **Erratum 2026-10-21 by BA/PM (`bapm-rule-QE-176`, `QE-176-d`); the text below stays as cut.** (1) `A5`'s
> "≤ 24,576 B" is superseded by `ABC-187`'s 18,432 B (`AGENTS_MD_BUDGET_BYTES`); `A5` holds at 15,797 B (QE
> `…be90087e`). (2) `A2`'s "`UNKNOWN - verify`" is settled: feasible on vitest 4.1.11 (SE `…d7694ffa`, QE
> `…be90087e`), so option (b) stands. (3) The two `bapm-cut-ABC-176` notes cited above (`…6d2a8f30`, `…9b4e1c07`) are
> hand-authored and `sealed: false`, so `readContext` returns neither. This page is the authoritative text, and a
> sealed pointer to them is in `bapm-rule-QE-176`. (4) `QE-176-a`/`-b` are cut to `ABC-192`, and `QE-176-c` is
> accepted.

## Problem

*User*: every agent hop (and the owner) that runs the test-integrity gate step or reads `npm test`'s result file.

*Pain*: since `ABC-173`, a vitest command typed without its `NODE_OPTIONS` prefix is **refused** by
`tools/grugops/heap-guard.js` (vitest exits 1, 0 tests run). Two readers hide that:
- the skip-count capture discards stderr, so jq prints **`0`** and exits 0 (`numTotalTests` 0, `success` false).
  Fed to `test-skip-integrity.js --skip-count 0`, that reads `No findings.`: a clean gate on a run that ran nothing;
- `.test-results/last-run.json` reads `success` false, `exitCode` 1, but records **no error**. The READ IT query prints
  only `run    exited exitCode=1`, which does not say why.

*Value*: a refused run can no longer pass as a clean skip count, and its result file says why it is red.

## Scope

- **In:** the refusal path of `tools/grugops/heap-guard.js` and/or `tools/grugops/result-file-reporter.js` (or a new
  helper under `tools/grugops/`); the `AGENTS.md` skip-count line (`### Test integrity`, line 144 at `ad71aec4`) and
  the `Test (all)` comment (line 84, `QE-173-f`: it quotes the unprefixed wrapper); test rows in `src/cli.test.ts`.
- **Out:** every production file under `src/`; `package.json` (its `test` script stays byte-identical, `ABC-042`
  `A10`); `vitest.config.ts`; `tools/grugops/test-skip-integrity.js` (it already reads an empty or non-integer
  `--skip-count` as a finding, exit 1, lines 180-182); the `*_DEEP` lanes' own output (they write no result file);
  rewriting any `.grugops/` note.
- **The old unprefixed quotes: DECLARED HISTORY, with a pointer (option b, not a).** They are dated records of
  commands that were correct when run, before `ABC-173`. Rewriting them would falsify the record. They become
  harmless through `A2`, which makes the old text itself fail loudly. The pointer is one clause in the `AGENTS.md`
  skip-count comment saying that pre-`ABC-173` quotes are history and to run the line as spelled.
  - **Census, stated so it can be reproduced:** at `ad71aec4`, **169** tracked files under `.grugops/` contain
    `.numPendingTests + .numTodoTests`. None of them carries `max-old-space-size=128 npx vitest run --reporter=json`.
    15 contain the full unprefixed capture verbatim. Outside `.grugops/`, there is 1 (`memory-bank/90-agents-md-command-log.md:394`, also history).
    `SEC-173-1`'s **"24 files"** did not reproduce under the eight patterns this hop tried: `UNKNOWN - verify`
    (claim `…9b4e1c07`). The choice does not depend on the count.

## Acceptance criteria

The **refusal arm** is the `AGENTS.md` command with its `NODE_OPTIONS=…` prefix removed (Node's default
`heap_size_limit` here is 4192 MiB, above every row). The **green arm** is the command as spelled.

- **A1: the capture as spelled refuses loudly.**
  - *Given* the `AGENTS.md` skip-count line, *when* it runs on the refusal arm, *then* its stdout holds **no integer**
    (no match for `^\s*-?\d+\s*$` on any line).
  - *And* at least one holds: the command's exit status is non-zero, or its output contains `heap-guard: refused`.
  - *And* passing its stdout as `N` to `test-skip-integrity.js .grugops/test-skips.md --skip-count "$N"` prints
    `Skip count was not provided` and exits 1.
  - **Non-vacuity:** on the green arm, the same line prints exactly one integer (`0` today), the command exits 0, and
    the gate step reads `No findings.`, exit 0.
  - **Wrong builds this fails:** today's line (prints `0`, exits 0); a build that exits 1 but still prints `0`.
- **A2: the OLD verbatim text is harmless too** (this is what makes option b safe).
  - *Given* the exact string `npx vitest run --reporter=json 2>/dev/null | jq '.numPendingTests + .numTodoTests'`,
    *when* it runs (no prefix, so it is refused), *then* its stdout holds no integer.
  - Feasibility within vitest 4.1.11's public surface is **`UNKNOWN - verify`**, and step 1 settles it.
  - If it is infeasible, the ticket returns to BA/PM to switch to option (a). It is never dropped silently.
- **A3: the result file names the refusal** (`QE-173-d`).
  - *Given* `package.json`'s `test` command with its `NODE_OPTIONS=--max-old-space-size=128 ` prefix removed, *when*
    it runs, *then* `.test-results/last-run.json` reads `success` false, `exitCode` 1, and carries the guard's thrown
    message **verbatim** (it begins `heap-guard: refused`) in a field the reporter header documents.
  - *And* the header's READ IT query prints a line that contains that message.
  - The message comes from the thrown error, not from a fixed string. A "cannot look" throw (`heap-guard: …getPaths()
    is gone…`) is named the same way, proved by a row at unit level.
  - **Non-vacuity:** a green `npm test` file carries no such field, and the query prints no line.
  - **Wrong builds this fails:** today's reporter; a reporter that hard-codes `"refused"`.
- **A4: the old rows keep their discrimination.** All six `ABC-149` plant rows in the reporter header (green,
  unhandled, hang, suite, test, exit-code-only) still give their recorded exit, fields and query lines, compared by
  content. The refusal row is added as a **seventh** row in that header, with the same four parts.
- **A5: AGENTS.md is consistent and in budget.**
  - The `Test (all)` comment no longer quotes the wrapper command without its prefix (`QE-173-f`).
  - The skip-count comment carries the history pointer.
  - `ABC-109` `A5` holds: `AGENTS.md` ≤ 24,576 B (24,343 B at `ad71aec4`, so 233 B of headroom).
  - `ABC-173` `A3` stays green and still finds ≥ 17 commands. If the capture line stops being an `npx vitest run`
    command, the count is re-pinned **with its reason**, never lowered silently.

## Pins that move (name each, and re-pin each with its reason)

- `ABC-109` `A5` (byte budget): the bytes change and the pin must stay green.
- `ABC-173` `A3` (`src/cli.test.ts:3955`: every `AGENTS.md` vitest command carries its shape's flag, ≥ 17 commands).
- `ABC-173` `A4`'s refusal regex (`src/cli.test.ts:3862`, `heap-guard: refused[\s\S]*NODE_OPTIONS=…`): the refusal
  text has to keep matching it.
- The `result-file-reporter.js` header: the READ IT query, and the `ABC-149` plant table, which gets its seventh row.
  Its own rule applies: changing the file re-runs all six rows (six `npm test` runs, in a scratch copy outside the repository).
- The `heap-guard.js` header, if the refusal path changes.
- `RISK-ABC143-01`, if the reporter reads one more vitest internal.
- **Must not move:** `ABC-042` `A10` `SCRIPTS_AT_HEAD` (`package.json` scripts); `ABC-144` `A7`; `ABC-152` `V3`.

## NFR / security triggers

- Test integrity (`quality.test_integrity: warn`). The targets are `A1`-`A3`: an integer count, exit codes and
  message text, all of them observable. There is no new security surface.
- `NFR-008` wall: the green path does no new work, so the ticket sets no timing target. `A1`/`A3` non-vacuity pins
  the green path's output.

## Test notes

- **UAT waiver:** this ticket changes 0 production lines under `src/`, as `ABC-173` did. The waiver is not a signature.
- **Arms:** run them in a worktree, never in main's tree. The refusal arm needs no plant, only the prefix removed.
  The `ABC-149` rows need scratch copies.
- **QE mutants to try:**
  - a capture that exits 1 but still prints `0` (`A1`);
  - a reporter that writes a fixed refusal string (`A3`);
  - a reporter that drops the `run` arm (`A4`);
  - a guard that writes its refusal only to stderr (`A2`).

## Dependencies / risks

- `ABC-173` is merged on main (`03859f2e`). The `QE-173-g` re-run of every lane is in flight, and it does not block this ticket.
- **Risk:** `A2` may be infeasible. If so, the fallback is to return the ticket to BA/PM (see `A2`).

## Size / priority

**XS, P3.** The work is two `tools/grugops/` files at most, two `AGENTS.md` comment or command edits, and about four
test rows, plus the seven reporter rows that QE re-runs.

## QE

**`qe-ABC-176`, 2026-10-21: PASS_WITH_GAPS.** Branch `grugops/qe-ABC-176`, QE merge `57bb2180` (tip `37b8debc` + main `331c7d18`).
Notes are in `.grugops/context/qe-ABC-176/`: criteria `…be90087e`, mutants `…fbdf5a60`, ordering `…c9b3023e`, gates `…c83116a5`, verdict `…75bc28e0`.

- **A1-A5 met**, read with my own runs before I opened the SE's and Scribe's notes. The refusal arm (SUITE, ONE-FILE, and the A2 old string) gives empty stdout, pipe exit 5, and the gate prints `Skip count was not provided`, exit 1. The green arm (both shapes) prints `0`, exit 0, and `No findings.`. All seven reporter rows (six `ABC-149` + `refused`) match by content in a scratch copy outside the repository. Three different refusals carry three different thrown messages, and the "cannot look" throw is named at integration level. A5: 15,797 B <= 18,432; 17 commands at tip and base; the A4 regex matches the live messages; the skip-count command is byte-identical; the `90-…` row is consistent.
- **Mutants:** 8 run, all killed by the arms. The suite misses 3: the reporter fixed string and the query without its `run` arm (`ABC-149` design, rows-only), and `setup` passing `process.stderr` (QE-176-a: full suite 59/1992 green while the capture prints `0`).
- **Ordering:** the guard line came before the JSON in 46/46 runs (direct, under `run-bounded.js`, with a slow consumer; both shapes). It holds by vitest 4.1.11's internal order on one `process.stdout`. It is pinned by no row (QE-176-b).
- **Gates:** lint, typecheck and build exit 0. `npm test` 59/1992, `success` true. Skip count 0, `No findings.`. UAT waived (0 production lines; the waiver and `--numstat` commands print nothing). The waiver is not a signature.
- **Gaps:** QE-176-a (LOW), QE-176-b (LOW), QE-176-c (INFO), QE-176-d (INFO: A5's 24,576 superseded by 18,432; A2 now feasible; `bapm-cut-ABC-176` notes are unsealed). None blocks.
