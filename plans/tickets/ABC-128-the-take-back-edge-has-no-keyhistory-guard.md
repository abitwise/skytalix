---
id: ABC-128
title: The take-back edge's `keyHistory` count is guarded by no row, and `ABC-021` `A8`'s title says "nowhere else"
status: in-review
column: In Review
size: XS
priority: P3
epic: EPIC-002
feature: —
---

# ABC-128 — three spy reads on the take-back rows, and a row title that says only what is checked

> **Cut 2026-10-10 by BA/PM** (task `wave-2026-09-25`, subtask `cut-followups-2026-10-10`) from
> QE's `ABC-051` gap **QE-051-b**
> (`.grugops/context/qe-ABC-051/notes/20261010T091104Z-qe-e2e-observation-abc051-gap-register-e9262a1c.md`,
> on `grugops/ABC-051-r2` until it merges). The code is correct. This is a test gap that QE's
> mutant `M9` exposed. Pre-existing since `ABC-120`, and not caused by `ABC-051`. Routing note:
> `.grugops/context/cut-followups-2026-10-10/notes/`.

## Problem

*User*: the next engineer who touches transition 18 (`take-back`) in `src/turn-loop.ts`, and any
reader of `ABC-021` `A8` who trusts its title.

*Pain*: `A8`'s title (`src/turn-loop.test.ts:1813`) says `keyHistory` *"fires on the REFUSED
claim and nowhere else"*. Its four sections check an advancing run, one refused claim, two refused
claims and an allowed claim. No row counts `keyHistory` on a take-back. `ABC-120`'s take-back rows
(`A3` `:1925`, `A4` `:1954`, `A5` `:1984`) count derives through `gameStatus` only (`derivesMade()`).

QE's `M9` puts `keyHistory(history)` after `takeBack(history, outcome.plies)` (an `O(plies)` replay
on every take-back). It is **green in all 1,540 tests**. BA/PM re-ran it at `85d0139`:
`src/turn-loop.test.ts` + `src/turn-loop.nfr.test.ts` are **67/67 green under `M9`**.

*Value*: a second replay on the take-back edge turns a row red in the default lane instead of
going unseen. `A8`'s title then says only what the file checks.

## Scope

- **One assertion in each of `ABC-120`'s three take-back rows** (`A3`, `A4`, `A5`):
  `expect(vi.mocked(keyHistory)).toHaveBeenCalledTimes(0)` after the run, placed **before** the
  row's own `keyHistory(history)` read (test note 1).
- **Narrow `A8`'s title** so it claims only the edges this file checks. Keep the `A8 —` prefix. Drop
  "nowhere else", or replace it with the checked edges. One example: "`keyHistory` fires on the
  REFUSED claim, and on no advancing ply, allowed claim or take-back (`ABC-120` `A3`–`A5`)". The
  wording is the Engineer's.

## Out of scope

- **Any production file.** `src/turn-loop.ts` is correct. `M9` is a probe, not a defect.
- **The other non-advancing edges**: `quit`, `command` (`board`/`help`), `rejected`, `ambiguous`,
  `game-over` and `eof`. No mutant has been measured surviving on them. The title's narrowing in
  `A2` makes it stop claiming them, so leaving them unchecked is honest. `UNKNOWN - verify` whether
  a per-command `keyHistory` there survives.
- **`src/turn-loop.nfr.test.ts`**, which is `ABC-051`'s per-ply bar. A take-back is per command,
  not per ply, so `NFR-002`'s bar does not cover it (QE-051-b).
- **New `it` blocks and new test files.**

## Acceptance (Given/When/Then)

- **`A1` (the take-back edge is counted, red first).** **Given** `ABC-120`'s rows `A3` (`new` after
  8 plies), `A4` (`undo` of 2 plies with a message) and `A5` (`new` at ply 0), **when** each runs,
  **then** it asserts `keyHistory` was called **exactly 0 times** by the loop. With `M9` planted
  (one `keyHistory(history);` line after `takeBack(history, outcome.plies);` in `src/turn-loop.ts`),
  **exactly these 3 rows are red**, each with `expected "keyHistory" to be called +0 times, but got
  1 times`, and no other row in the file fails. With `M9` reverted, all are green. The PR
  note records both runs. *(BA/PM measured this candidate at `85d0139`: 63/63 green unmutated,
  3 failed / 60 passed under `M9`. See `probe/`.)*
- **`A2` (the title claims what is checked).** **Then**
  `grep -c 'nowhere else' src/turn-loop.test.ts` prints **0**. `A8`'s `it` name still starts with
  `A8 —` and still names the refused claim. Every edge the new title names is asserted by `A8`'s
  own sections or by `A1`'s three rows.
- **`A3` (test-only, nothing else moves).** **Then** `git diff --numstat <base>...<tip> -- src`
  lists **exactly `src/turn-loop.test.ts`**. The test-file count and the suite total equal the
  base's (assertions inside existing `it` blocks, 0 new `it`). Lint, typecheck, build and
  `npm test` exit 0, the skip count is 0, and integrity prints `No findings.`

## Dependencies

- **`ABC-120` — `Done`.** It owns the three rows. **`ABC-021` — `Done`.** It owns `A8`.
- **`ABC-051` (Ready for UAT, not merged): no file overlap.** It edits `src/turn-loop.ts` (comments
  only) and `src/turn-loop.nfr.test.ts`. `M9`'s anchor line is unique and unchanged on its tip
  (`grugops/ABC-051-r2` `a9ed126`). Either order works.
- **`ABC-129` also edits `src/turn-loop.test.ts`** (one comment at `:1633`, a different line). This
  ticket can land first. The second one rebases mechanically.
- **`ABC-036`, `ABC-126`, `ABC-127`: no overlap** (`src/command-input*`; puzzle files and
  `src/quiescence.test.ts`).

## Security / NFR triggers

- **`N8-LANE` — ≤ 650 ms CPU net.** 3 spy reads inside existing `it` blocks, no new file. About 0 ms.
- **`NFR-002` — not triggered.** No production line. The take-back edge is per command.
- **UAT is waived under the standing zero-production-lines rule.** The `src/` diff names only a
  `.test.ts` file. The QE hop still applies.
- **Security — not triggered.** Test assertions only.

## Test notes

1. **Placement matters.** `A3` (`:1948`) and `A5` (`:1991`) call `keyHistory(history)` themselves
   to check the rewound key list. That call goes through the spy. An assertion placed after it reads
   1 on the correct build. Put the new line before it. In `A4`, put it after `derivesMade()`
   (`:1974`).
2. **The spy resets per row.** `beforeEach(() => vi.clearAllMocks())` is at `:674`, and
   `vi.mock("./history.ts")` wraps `keyHistory` as `vi.fn(actual.keyHistory)` at `:111`. No new mock
   is needed.
3. **The `M9` runner.** QE's is `.grugops/context/qe-ABC-051/probe/mut.mjs` (id `M9`; it pins the
   file by md5 and restores it). BA/PM's line-insert probe is
   `.grugops/context/cut-followups-2026-10-10/probe/edit-probe.mjs`. Either works. Never commit the
   mutant.

## Size and priority rationale

**Size `XS` (1).** One file, three one-line assertions with measured placement, and one `it` name.
**Not `XL`. No split.**

**Priority `P3`.** QE graded it LOW. Nothing is red and no user sees it. The cost it would catch is
per command, not per ply. It is a guard on a merged claim, so it is worth one row, but it is not
urgent.

## Definition of Ready

Assessed by BA/PM, **2026-10-10**, against the wave tip `85d0139`. **Result: 10 of 10, 0 ⚠️. Meets
the bar for `Ready`. The page stays `Backlog` until the Orchestrator moves it on the board.**

| # | item | verdict |
|---|---|---|
| 1 | problem clear | **✅** a named title claim, 3 named rows, and a surviving mutant measured 67/67 green |
| 2 | scope and out-of-scope clear | **✅** 3 assertions and 1 title. Other edges, the nfr file and production are fenced out |
| 3 | INVEST-shaped | **✅** independent. No in-flight ticket touches `src/turn-loop.test.ts` |
| 4 | acceptance testable and measurable | **✅** red on exactly 3 rows under `M9` (measured), a `grep -c` of 0, a one-file `numstat` fence |
| 5 | dependencies known | **✅** `ABC-120`/`ABC-021` `Done`; `ABC-051` no overlap; `ABC-129` same file, different line |
| 6 | security/NFR triggers with a measurable target | **✅** `N8-LANE` ≤ 650 ms (≈ 0, no new file); `NFR-002` not triggered |
| 7 | test notes present | **✅** three (placement, mock reset, mutant runner) |
| 8 | size assigned | **✅** `XS` (1) |
| 9 | priority assigned | **✅** `P3`, with the reason |
| 10 | no major unresolved blocker | **✅** the candidate is measured; no ruling is owed |
