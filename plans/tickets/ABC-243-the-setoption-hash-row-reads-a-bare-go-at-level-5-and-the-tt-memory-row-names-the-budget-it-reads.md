---
id: ABC-243
title: "The setoption-Hash row reads a bare `go` at level 5 (4 000 ms), so it catches a silent jump to any other level again, and the TT memory row names the budget it reads (test-only)"
status: backlog
column: Backlog
size: XS
priority: P3
epic: EPIC-010
---

# ABC-243: two test rows that went stale when level 5 moved to 4 000 ms

> **Cut 2026-10-30 by BA/PM** (task `bapm-ABC-228-merge-fold`, records only, at `main` `e42b637b`). Source: the two
> non-blocking gaps in `ABC-228`'s QE verdict (`qe-ABC-228-ii` `…e39d190c`):
> - **SE-228ii-a** (LOW, test strength), raised by the SE (`se-ABC-228-ii` `…0f553b17`). QE confirmed it with a planted
>   fault (`…c448c753`).
> - **QE-228ii-b** (INFO), a stale test title.
>
> QE named them as one follow-up. **Test-only:** no production line changes, so no smoke and no UAT apply.

## Problem

- **User:** the engineer and QE who rely on the default lane to catch a UCI level regression.
- **Pain 1 (SE-228ii-a).** In `src/uci-session.test.ts` the row "setoption name Hash value 64 writes nothing and changes
  nothing" (`:753`, read at `e42b637b`) checks "still the default level 5" through `levelTime`. `levelTime` sends
  `GO_G3500`, a clock that gives `G` = 3 500.
  - Before `ABC-228`, level 5's 3 000 cap made that read 3 000, and level 6's or 7's read 3 500, so a silent jump
    to 6 or 7 turned the row red.
  - Under (ii), level 5 also reads 3 500 (`min(3 500, 4 000)`). **A `setoption Hash` that silently moved the level to
    6 or 7 now passes.**
  - QE's plant (`…c448c753`): red on base and green on head for levels 6 and 7. The level-4 control was red on head,
    so a jump down to 1–4 is still caught.
- **Pain 2 (QE-228ii-b).** In `src/transposition.test.ts` the `NFR-009` deep row (`:667`) is titled "… between a 1 s and
  a 3 s search". It reads `chooseMove` at `DEFAULT_BUDGET_MS`, which is 4 000 ms since `ABC-228`. The file header
  (`:19`) and the row's doc comment (`:660`) say the same "1 s and a 3 s". The label no longer matches the reading.
- **Value:** the Hash row catches a jump to any other level again, and the memory row says what it measures.

## Scope

1. **The Hash row reads a bare `go`.** After `setoption name Hash value 64` on a fresh `rig()`, `position startpos`
   then a bare `go`. The expected time is `LEVELS[5].budgetMs` (4 000), on the existing `expectWithin` bound
   (`G ≤ time ≤ G + 2 × step`, step 100). It is read from the constant, not a literal. A bare `go` searches the level's
   budget at every level (`ADR-0045` A4, `ADR-0044` D4.1/D4.2), so the levels read 100, 180, 330, 1 000, 4 000, 5 000
   and 30 000, all different. The row's book half is unchanged.
2. **The memory row is titled by its budget.** The title, the doc comment (`:660`) and the file header line (`:19`)
   name "a 1 s and a `DEFAULT_BUDGET_MS` search" (or the same words with "(4 s)"). No code, bound or budget changes.

## Out of scope

- Any production file: `src/` outside these two test files, `data/` and `tools/`.
- Any other `GO_G3500` row. Those rows read `G`'s cap per level on purpose (`ABC-167` `A5`).
- The `NFR-009` catalog wording ("a 1 s and a 3 s search"): that text is Security/NFR's, and under (ii) it is their
  edit (`ABC-228` § Follow-ups, the `NFR` catalog row). The memory row's bar (≤ 1 MiB growth) does not move.
- The ladder re-take and `AGENTS.md` (other owners).

## Acceptance criteria

- **A1 (the Hash row discriminates).** **Given** `setoption name Hash value 64` on a fresh `rig()` and
  `position startpos`, **when** a bare `go` is sent, **then** the info line's `time` is ≥ 4 000 and ≤ 4 200
  (`LEVELS[5].budgetMs` read from the constant).
- **A2 (the plant, both directions).** On a scratch copy, plant "`setoption Hash` sets the level to L" for L = 4, 6 and 7.
  **Then** the new row is red for each of the three, and green with no plant. QE records the three reds. These are
  levels 4, 6 and 7 (QE's control plus the two levels the old row missed).
- **A3 (the title).** In `src/transposition.test.ts`, the deep row's title, its doc comment and the header line name
  the budget the row reads, as in Scope 2. `git diff` on that file shows only those three text lines changed.
- **A4 (fences).** `git diff` base..head touches only `src/uci-session.test.ts` and `src/transposition.test.ts`. No
  row is added or removed: the Hash row is edited in place, so the default lane's row count equals base's.
- **A5 (gates).** Lint, typecheck and build exit 0. `npm test` is green with skips 0. `G8` (`npm test` wall ≤ 10 s) is
  reported. The bare `go` runs on the virtual clock at step 100, about 40 reads, so no real-clock row is added. The
  `ENGINE_DEEP` transposition row is run once and reported green. Its reading does not change, only its title.

## NFR triggers

- **`NFR-008`:** 0 real-clock rows added; the edited row stays on the virtual clock. `G8` is reported, with a target
  of ≤ 10 s at load1 ≤ 8.
- **`NFR-009`:** the bar (≤ 16 MiB, growth ≤ 1 MiB) and the reading are unchanged. Only the label changes.
- **Security:** none (no input path, no production line).

## Test notes

1. A2's plants live on a scratch copy only. They are never committed.
2. **No smoke.** `EPIC-010` § The merge rule binds value-changing tickets, and this one changes no production line.
   **No UAT** (no production lines). QE's verdict is the gate.
3. `GO_G3500`'s other rows stay as they are: they test `G`'s cap, not the default level.

## Size and priority

- **Size: XS.** One test row edited, plus three text lines.
- **Priority: P3.** A test-strength gap. `ABC-228` merged with it, and QE ruled it non-blocking.

## Dependencies

- **`ABC-228` Done** (`e42b637b`): level 5 = 4 000 ms is the value A1 reads.
- **Pull order:** after **`ABC-241`** (In Development, `se-ABC-241`). It edits `src/uci-session.ts`, and its tests
  sit in `src/uci-session.test.ts`. Whether that file changes there is `UNKNOWN - verify`. `ABC-220` (Ready) also adds
  rows to `src/uci-session.test.ts`. Whichever merges second rebases. No semantic overlap: this ticket edits one
  existing row.
- No ADR. No owner question.

## Definition of Ready

| # | check | state |
|---|---|---|
| 1 | problem clear | ✅ SE-228ii-a confirmed by QE's plant (`…c448c753`); QE-228ii-b, the title against `DEFAULT_BUDGET_MS` |
| 2 | scope and out-of-scope | ✅ 2 items; other `GO_G3500` rows, `NFR-009` catalog text and production files out |
| 3 | INVEST | ✅ independent of production; XS; testable by plant |
| 4 | testable, measurable acceptance | ✅ A1 4 000–4 200 ms; A2 red at L = 4, 6, 7; A3/A4 exact diff fences; A5 skips 0 |
| 5 | dependencies known | ✅ `ABC-228` Done; file overlap with `ABC-241` / `ABC-220` named |
| 6 | NFR triggers with targets | ✅ 0 real-clock rows; `G8` ≤ 10 s; `NFR-009` bar unchanged |
| 7 | test notes | ✅ 3 |
| 8 | size | ✅ XS |
| 9 | priority | ✅ P3 |
| 10 | no major unresolved blocker | ⬜ pull order: after `ABC-241` merges (shared `src/uci-session.test.ts`), the same kind of wait as `ABC-229` and `ABC-242` |

**DoR 9/10 (2026-10-30, `bapm-ABC-228-merge-fold`). Backlog, P3.** When `ABC-241` merges, row 10 is met and the
ticket is 10/10 and Ready, with no further fold needed.
