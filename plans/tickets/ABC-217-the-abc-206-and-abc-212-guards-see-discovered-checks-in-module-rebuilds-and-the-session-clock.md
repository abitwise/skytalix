---
id: ABC-217
title: "Test hardening: the ABC-206 and ABC-212 guards also see a missed discovered check, an in-module rebuild on `legalMoves`, and a dropped session clock; two stale `gameStatus` texts are reworded"
status: ready
column: Ready
size: XS
priority: P3
epic: EPIC-008
feature: —
---

# ABC-217: four test-only strengthenings and two stale texts. No behaviour changes

> **Cut 2026-10-24 by BA/PM** (task `bapm-cut-readme`, records only, at `main` `2a1a7c93`). The rulings are in
> `.grugops/context/bapm-cut-readme/notes/`. This hop ran no npm, vitest or build. Line numbers were read at
> `2a1a7c93`.
>
> **Sources.** All five items were accepted into one XS Backlog follow-up by the Orchestrator:
> - `QE-206-a` and `QE-206-b` (LOW) and `QE-206-e` (INFO): QE `qe-ABC-206/…809cd42a`; accepted in `…cb10c36c`.
> - `SEC-206-a` (INFO): Security/NFR `security-nfr-note-ABC-206/…322a594a` and its observation `…d1f0c910`.
> - `QE-212L-a` (LOW): QE `qe-lane-ABC-212/…db746b16`; accepted in `…4cf9da50` ("rides the next uci-session test
>   ticket"). This is that ticket. `ABC-212` belongs to `EPIC-004`; the item rides here because it is test-only.

## Problem

- **User:** the next engineer who edits `src/legal.ts`, `src/gameend.ts` or the UCI session, and QE, who reads the
  default lane as the first guard.
- **Pain:** three regressions stay green in the default lane today. QE and Security/NFR showed each by a plant or
  a reading.
  - A `givesCheck` that misses a plain-move discovered check passes all 210 lane rows (`QE-206-a`).
  - `hasLegalMove` or `legalCaptures` rebuilt on `legalMoves` inside `legal.ts` passes, because the spies see only
    cross-module calls (`QE-206-b`).
  - A session that drops its injected clock on the `movetime` shape passes 137 of 137 rows (`QE-212L-a`, plant Q1).
- Two texts still say `gameStatus` runs at a search leaf. Since `ABC-206`, the leaf calls `leafEndReason`
  (`QE-206-e`, `SEC-206-a`).
- **Value:** each regression turns a default-lane row red before review, not only in `ENGINE_DEEP` or a real-clock
  reading. The texts stop misleading a reader.

## Scope

1. **`src/legal.test.ts`, the `givesCheck` row** (the `ABC-206 A2` block, near `:493`). Add a discovered-check
   fixture list beside `FLAGGED_CHECKS`, with the two FENs from `QE-206-a`:
   - `8/8/8/8/R2K3k/8/8/8 w - - 0 1`: `Kd4-d5` uncovers the a4 rook on the h4 king;
   - `8/7k/8/8/8/8/2P5/1B4K1 w - - 0 1`: `c2-c3` uncovers the b1 bishop on the h7 king.
2. **`src/gameend.nfr.test.ts`, the `ABC-206` describe** (near `:130`). Add `makeMove` call counts through the
   existing `apply.ts` spy (`:32`) for `hasLegalMove` and `legalCaptures`.
3. **`src/gameend.ts:17`–`:19`** (comment only). Reword the sentence "It is built to be cheap at a search leaf
   (NFR-001)". The leaf no longer calls `gameStatus`. The facts that stay true remain: one legal-move generation,
   and one shared Zobrist key read.
4. **`src/gameend.nfr.test.ts:68`**, the describe title. Drop "at a search leaf". The `it` rows under it do not
   change.
5. **`src/uci-session.test.ts`, `budgetAt`** (near `:1041`). The stub also records `options.now`, and the helper
   asserts that it is the clock the rig handed the session. The rig may return that clock to make this possible.

## Out of scope

- Any production line. `src/gameend.ts` changes in comments only (`A6`).
- `src/legal.ts`, `src/search.ts`, `src/quiescence.ts`, `src/uci-session.ts` and every other non-test file.
- New test files, new deep lanes, snapshots, and `plans/nfr-catalog.md` (Security/NFR placed the `NFR-001` dated
  note in `security-nfr-note-ABC-206`).
- The same clock gap in `ABC-167`'s level 1–5 `movetime` rows. Those rows search on a real budget, which is a
  different instrument. Not cut.
- `QE-206-c`, `QE-206-d`, `QE-212L-b` and `QE-212L-c`. The Orchestrator closed them.

## Acceptance criteria

`<base>` is the `main` sha the branch was cut from. QE applies each plant alone to a scratch copy of the tip. No
plant is committed.

- **`A1` (`QE-206-a`, discovered checks).** **Given** the two fixtures, **when** the `givesCheck` depth-1 row runs,
  **then**:
  - for every legal move of each fixture, `givesCheck` equals make, `isInCheck`, unmake, and the position is
    unchanged;
  - the row asserts, per fixture, that the named move is legal, has `flags === FLAG_NONE` and gives check;
  - **plant P-a:** `givesCheck`'s unflagged path tests only the attacks of the moved piece from `move.to`. It reds
    this row in the default lane. QE also shows P-a green at `<base>` in the default lane, which is the gap closed.
- **`A2` (`QE-206-b`, in-module rebuilds).** **Given** the `apply.ts` spy, **then**:
  - `hasLegalMove` on the start position calls `makeMove` **exactly 1** time;
  - `legalCaptures` on kiwipete calls `makeMove` exactly **N** times. N is the count of `generateMoves(p)` entries
    with `captured !== EMPTY`, computed in the test, and the row also asserts N < `generateMoves(p).length`;
  - **plant P-b1** (`hasLegalMove` returns `legalMoves(p).length > 0`) and **plant P-b2** (`legalCaptures` returns
    `legalMoves(p).filter(capture)`) each red at least one row.
- **`A3` (`QE-212L-a`, the session clock).** **Given** the budget-read rows, **then** each asserts that
  `options.now` is the rig's clock by identity (`toBe`). **Plant Q1** (`now` passed only when `movetime` is absent,
  as in `…628c929d`) reds at least one row. The `go movetime` rows are expected.
- **`A4` (`QE-206-e`, `SEC-206-a`, the stale texts).** **Then**
  `grep -c 'cheap at a search leaf' src/gameend.ts src/gameend.nfr.test.ts` prints `0` for each file. The new
  comment says the search leaf calls `leafEndReason` (`ABC-206`). The describe at `:68` keeps the same `it` count
  and the same bodies.
- **`A5` (scope).** **Then** `git diff --name-only <base> <tip> -- src tools package.json package-lock.json` lists
  exactly `src/legal.test.ts`, `src/gameend.nfr.test.ts`, `src/uci-session.test.ts` and `src/gameend.ts`. No row is
  removed and no existing expectation is weakened. QE reads every `-` line.
- **`A6` (comment only, the owner's Q4 measurement `…5c8e2a17`).** **Then** both hold for `src/gameend.ts`:
  - every `+` and `-` line of `git diff <base> <tip> -- src/gameend.ts` lies in the header comment block, and each
    starts with ` *` after optional whitespace;
  - `ts.transpileModule(source, { compilerOptions: { removeComments: true } }).outputText` is byte-identical at
    `<base>` and `<tip>`.

  If either fails, the build stops and the page goes back to BA/PM.
- **`A7` (gates).** **Then** lint, typecheck, unit and build exit 0. `npm test` passes with the count at `<base>`
  plus the added rows, and that number is reported. The skip count is 0, and `test-skip-integrity.js` prints
  `No findings.` `lane-inventory.js` exits 0.

## NFR and security triggers

- **`NFR-008`** (`npm test` wall ≤ 10 s at load1 ≤ 8): the sentinel is re-read at the merge, as for `ABC-206` and
  `ABC-212`. The added rows walk two tiny positions to depth 1 and count calls on two positions. No file, spawn or
  real-clock read is added.
- **Security: no hop is triggered.** `ABC-041` (a) does not fire, because `package*.json` is untouched. `ADR-0036`
  (b1) does not fire by `A6`. (b2) does not fire, because there is no new runtime import edge. (c) does not fire,
  because the test edits add no capability: no file, process or network call.
- **No NFR bound moves.** `NFR-001`'s text was already corrected by `security-nfr-note-ABC-206`.

## Test notes

1. **Plants, pre-registered:** P-a, P-b1, P-b2, Q1, each alone on a scratch copy. Report red-row counts and names.
2. **`A1`'s base reading:** P-a at `<base>` must stay green in the default lane. That shows the fixtures close the
   gap. If it reds at `<base>`, report it. The gap was then already closed, and `A1` still passes.
3. **The spies are module-level `vi.mock`.** Clear them before each count (`vi.clearAllMocks()`), as the file does.
4. **UAT: WAIVED, expected,** under the owner's Q4 word (`…5c8e2a17`) when `A6` holds. `src/gameend.ts` is a
   production file, so the 2026-08-17 file-level grep is not empty. If `A6` fails, UAT is owed, and the QE verdict
   signs it.

## Size and priority

- **Size `XS`.** About 30 test lines in three existing files, and 3 comment lines.
- **Priority `P3`.** No defect at the tip. `ENGINE_DEEP`, `A1` and `A2` of `ABC-206` already catch P-a and P-b. This
  ticket moves the catch into the default lane.

## Dependencies

- **None blocking.** At `2a1a7c93` no open branch touches the four files (`grugops/ABC-205`, `grugops/ABC-204` and
  `grugops/qe-ABC-204` read at this hop).
- **Builder:** software-engineer. **QE hop:** owed (the four plants and `A6`).
- **Timing:** the build and QE run vitest. They wait until no ALONE reading is running on the host.

## Owner questions

None. Every item was accepted by the Orchestrator under the owner's delegation (`…5aaf7cec`).

## Definition of Ready

BA/PM, 2026-10-24, at `main` `2a1a7c93`. **Result: 10 of 10. `Ready`.**

| # | item | verdict |
|---|---|---|
| 1 | problem clear | ✅ three green-staying regressions, each shown by a plant or a reading; two stale texts |
| 2 | scope and out-of-scope clear | ✅ four files named with lines; production code, the catalog and `ABC-167`'s rows fenced |
| 3 | INVEST-shaped | ✅ independent; valuable alone; estimable; `XS`; testable by plants and counts |
| 4 | acceptance testable and measurable | ✅ exact call counts (1, N); four plants red; grep counts 0; transpile identity |
| 5 | dependencies known | ✅ none blocking; quiet host for vitest |
| 6 | security/NFR triggers with a measurable target | ✅ `NFR-008` ≤ 10 s sentinel; each security clause named and not fired |
| 7 | test notes present | ✅ four |
| 8 | size assigned | ✅ `XS` |
| 9 | priority assigned | ✅ `P3`, argued |
| 10 | no major unresolved blocker | ✅ none |
