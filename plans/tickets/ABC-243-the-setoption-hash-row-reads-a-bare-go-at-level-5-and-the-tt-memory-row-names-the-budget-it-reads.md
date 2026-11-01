---
id: ABC-243
title: "The setoption-Hash row reads a bare `go` at level 5 (4 000 ms), so it catches a silent jump to any other level again; the TT memory row names the budget it reads; and a UCI FEN that carries an uncapturable ep square has a row (test-only)"
status: done
column: Done
closed: "2026-10-31, merged to main at 3628fe99; QE PASS (qe-ABC-243, 2d790e40); test-only, UAT waived"
size: XS
priority: P3
epic: EPIC-010
---

# ABC-243: two test rows that went stale when level 5 moved to 4 000 ms

> **CLOSED, Done, folded 2026-11-01 by BA/PM** (task `bapm-page-closes`, records only, at `main` `55fbc90e`; nothing
> run, because `qe-ABC-246` holds the host). The page read `ready` after the merge; this fold closes it. QE's verdict
> is **PASS** (`qe-ABC-243` `…2d790e40`, PREREG `3cd91179` before any head run) at `8772cf36`. It was **merged at
> `3628fe99`** on 2026-10-31. Two `*.test.ts` files and 0 production lines, so **UAT is waived**; the QE verdict is
> the gate (Test note 2).
>
> - **A1–A6 MET** (`…2d790e40`). A2: L4, L6 and L7 red at head (L1–L3 too), green with no plant. A4: 2 322 → 2 323
>   tests, one name added. A6: `cp 0`, `bestmove d1e1` at depth 4; QM3 red on the A6 row only. `G8` H 9.28 s, B 9.23 s
>   (+0.05 s against the +0.03 s estimate); the 9.6 s tranche-2 line was not crossed.
> - **Source gaps closed:** SE-228ii-a (A1/A2), QE-228ii-b (A3, for the three lines A3 fenced), QE-241-a (A6).
> - **QE's and the SE's gaps, dispositioned** (`qe-ABC-243` `…cf057dd1`):
>   - **QE-243-a** (LOW, QE harness: `host.mjs`'s `[/]vitest` match found its own wrapper shell). **Closed.** It sits
>     in QE's scratch harness, not in `src/` or `tools/`, and no reading moved. The fix (never a vitest call on the
>     wait-clear's shell line, or drop the script's own ancestors from the match) is on record in `…cf057dd1`, and
>     `AGENTS.md` already forbids `pgrep -f` waits.
>   - **QE-243-b** (INFO; SE-243-b). **Closed.** The Hash row reads `time`, not `score`; `ABC-167`'s default-level row
>     still checks `score`.
>   - **QE-243-c** (INFO). **Carried, to a proposed ticket.** The deep row's stdout line (`:695`) still prints `3 s
>     (depth 8)` for the `DEFAULT_BUDGET_MS` search, and its child script names that search `three`. A3's three-line
>     fence kept both out. `NFR-009`'s catalog wording, the other half QE named, was already fixed by Security/NFR
>     (`secnfr-ABC-228-catalog`: the row's second search is `DEFAULT_BUDGET_MS`, 4 s). The carrier is an XS, P3,
>     test-only ticket proposed in `bapm-page-closes`' Result, for the Orchestrator to cut or to fold into the next
>     ticket that edits that row.
>   - **SE-243-a, SE-243-c** (118 characters, not 117), **SE-243-d, SE-243-e.** **Closed.** QE confirmed them, and `G8`
>     read what SE-243-d left open.
> - No follow-up ticket cut here. Notes: `.grugops/context/bapm-page-closes/notes/`.

> **NOTED 2026-10-30 by BA/PM** (task `bapm-g8-headroom-cut`, records only, at `main` `161e940d`). `ADR-0046`
> § Addendum 2026-10-30 R1–R4 (`arch-g8-headroom`, `5fd3eee7`; BA/PM's word on `ABC-244`'s page) changes nothing in
> this ticket's rows:
>
> - `A1`'s bare `go` reads `time` (`G ≤ time ≤ G + 2 × step`), so it is class P and keeps step 100: 40 reads.
> - `A6`'s row is fixed-depth, with no clock.
> - The R1 census line for the `A1` row (4 000 ms ÷ 100 = 40 reads) goes in the build note.
> - **The estimate is about +0.03 s of lane wall** (`ADR-0046` § Addendum, Consequences), `UNKNOWN - verify` until
>   `A5`'s `G8` reads it.
> - **Pull order:** after `ABC-244` (shared `src/uci-session.test.ts`). This ticket rebases on it.
> - Acceptance, size XS, P3 and DoR **10/10** are unchanged; rows 5 and 6 gain dated lines.

> **Cut 2026-10-30 by BA/PM** (task `bapm-ABC-228-merge-fold`, records only, at `main` `e42b637b`). Source: the two
> non-blocking gaps in `ABC-228`'s QE verdict (`qe-ABC-228-ii` `…e39d190c`):
> - **SE-228ii-a** (LOW, test strength), raised by the SE (`se-ABC-228-ii` `…0f553b17`). QE confirmed it with a planted
>   fault (`…c448c753`).
> - **QE-228ii-b** (INFO), a stale test title.
>
> QE named them as one follow-up. **Test-only:** no production line changes, so no smoke and no UAT apply.

> **FOLDED and RE-SCORED 2026-10-30 by BA/PM** (task `bapm-ABC-241-merge-fold`, records only, at `main` `a649fbc4`;
> `src/`, `data/` and `tools/` untouched). **`ABC-241` merged** at `1f6abec4` (`qe-ABC-241` `…2368b03f`), so the pull
> order wait (DoR row 10) is met.
>
> - **One row added from `ABC-241`'s QE gap QE-241-a** (LOW, `…e6523bfb`). No `src/uci-session.test.ts` row covers a
>   `position fen` whose FEN already carries an uncapturable ep square. QE's mutant QM3 keeps that FEN's own key raw,
>   and `npm test` stays green at 2 245 / 2 245. QE's scratch row QE-A4e catches it, and it becomes this ticket's
>   Scope 3 and `A6`.
> - `A4`'s fence now allows that one added row, so the count is base's + 1. Size stays XS, and it is still test-only:
>   no smoke and no UAT.
> - Read at `a649fbc4`: the Hash row is still at `src/uci-session.test.ts:753`, and the `transposition.test.ts` lines
>   are still `:19`, `:660` and `:667`. `ABC-241` added its rows elsewhere in the file (its describe block, `:1404`).
> - **DoR 9/10 → 10/10, Ready.** The board move is the Orchestrator's.

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
- **Pain 3 (QE-241-a, added 2026-10-30, `bapm-ABC-241-merge-fold`).** `ABC-241` C3 passes every key that UCI
  `parsePosition` keeps through the repetition-key helper, and that includes the FEN's own key. `ABC-241`'s rows in
  `src/uci-session.test.ts` start from FENs with no ep square (`4k3/7p/… b - - 0 1`, then `h7h5`). So no row covers a
  FEN that already carries one. QE's mutant QM3 makes `parsePosition` keep the FEN's own key raw, and `npm test` stays
  green, 2 245 / 2 245 (`qe-ABC-241` `raw/mutants/QM3-*`). Head is correct today, but a refactor could drop that call
  and no row would notice.
- **Value:** the Hash row catches a jump to any other level again, and the memory row says what it measures. The FEN's
  own key is pinned as a repetition key on UCI.

## Scope

1. **The Hash row reads a bare `go`.** After `setoption name Hash value 64` on a fresh `rig()`, `position startpos`
   then a bare `go`. The expected time is `LEVELS[5].budgetMs` (4 000), on the existing `expectWithin` bound
   (`G ≤ time ≤ G + 2 × step`, step 100). It is read from the constant, not a literal. A bare `go` searches the level's
   budget at every level (`ADR-0045` A4, `ADR-0044` D4.1/D4.2), so the levels read 100, 180, 330, 1 000, 4 000, 5 000
   and 30 000, all different. The row's book half is unchanged.
2. **The memory row is titled by its budget.** The title, the doc comment (`:660`) and the file header line (`:19`)
   name "a 1 s and a `DEFAULT_BUDGET_MS` search" (or the same words with "(4 s)"). No code, bound or budget changes.
3. **A UCI row for a FEN that carries an uncapturable ep square** (QE-241-a; QE's row QE-A4e). In
   `src/uci-session.test.ts`, beside `ABC-241`'s A4/A5 rows, one new row sends
   `position fen 4k2q/8/8/8/P7/8/8/4K3 b - a3 0 1 moves h8h7 e1d1 h7h8 d1e1 h8h7 e1d1 h7h8` and then `go depth N`.
   The a3 square has no black pawn to take on it. The FEN's board then recurs after `d1e1`, so `d1e1` makes its third
   occurrence. The row's name, depth and helpers are the SE's.

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
  *(Amended 2026-10-30, `bapm-ABC-241-merge-fold`. The old text is kept above. **Exactly one row is added**, `A6`'s,
  so the default lane's row count is base's + 1. The Hash row is still edited in place, and no row is removed.)*
- **A5 (gates).** Lint, typecheck and build exit 0. `npm test` is green with skips 0. `G8` (`npm test` wall ≤ 10 s) is
  reported. The bare `go` runs on the virtual clock at step 100, about 40 reads, so no real-clock row is added. The
  `ENGINE_DEEP` transposition row is run once and reported green. Its reading does not change, only its title.
- **A6 (the FEN's own key, UCI; added 2026-10-30).** **Given** Scope 3's `position fen … b - a3 0 1 moves …` line,
  **when** `go depth N` is sent at one fixed depth N from 1 to 5, **then** the bestmove is `d1e1` and the info line's
  score is `cp 0`. In the same row, the same root searched with the raw hash list (`keyHistory`, as `ABC-241`'s A4
  row's base half does) does **not** score 0. **Plant:** on a scratch copy, QE plants QM3 (`parsePosition` keeps the
  FEN's own key raw and passes only the moves' keys through the helper). The new row is red with QM3 and green without
  it. QE records the red.

## NFR triggers

- **`NFR-008`:** 0 real-clock rows added; the edited row stays on the virtual clock. `G8` is reported, with a target
  of ≤ 10 s at load1 ≤ 8. `A6`'s row is fixed-depth (no clock), with 5 pieces on the board. `G8` read 9.63 s at
  `ABC-241`'s QE, so the headroom is 0.37 s. Its added wall is `UNKNOWN - verify`, read in `A5`'s `G8`.
  - *(2026-10-30, `bapm-g8-headroom-cut`.)* After `ABC-229` the headroom is 0.10 s (`G8` 9.90 s, `QE-229-a`). This
    ticket's estimate is **about +0.03 s** (one 40-read time row plus one fixed-depth row; `ADR-0046` § Addendum
    2026-10-30). R1: the build note carries the `A1` row's census line (40 reads per search). R2 does not apply,
    because `A1` reads `time`. If this ticket's `G8` head median reads > 9.6 s, `ABC-244`'s tranche-2 trigger fires.
- **`NFR-009`:** the bar (≤ 16 MiB, growth ≤ 1 MiB) and the reading are unchanged. Only the label changes.
- **Security:** none (no input path, no production line).

## Test notes

1. A2's plants live on a scratch copy only. They are never committed.
2. **No smoke.** `EPIC-010` § The merge rule binds value-changing tickets, and this one changes no production line.
   **No UAT** (no production lines). QE's verdict is the gate.
3. `GO_G3500`'s other rows stay as they are: they test `G`'s cap, not the default level.
4. `A6`'s plant QM3 lives on a scratch copy only, like `A2`'s. QE's `qe-ABC-241` `raw/mutants/QM3-*` shows the shape.
   QE's scratch row QE-A4e (`raw/qe-scripts/qrows.mjs`, `FEN_EP` and `MV4E`) read `d1e1` at exactly 0 at depths 1–5 on
   both surfaces, and base was never 0.

## Size and priority

- **Size: XS.** One test row edited, plus three text lines. *(2026-10-30: plus one added UCI row, `A6`. Still XS.)*
- **Priority: P3.** A test-strength gap. `ABC-228` merged with it, and QE ruled it non-blocking.

## Dependencies

- **`ABC-228` Done** (`e42b637b`): level 5 = 4 000 ms is the value A1 reads.
- **Pull order:** after **`ABC-241`** (In Development, `se-ABC-241`). It edits `src/uci-session.ts`, and its tests
  sit in `src/uci-session.test.ts`. Whether that file changes there is `UNKNOWN - verify`. `ABC-220` (Ready) also adds
  rows to `src/uci-session.test.ts`. Whichever merges second rebases. No semantic overlap: this ticket edits one
  existing row.
  *(2026-10-30, `bapm-ABC-241-merge-fold`: **`ABC-241` is Done** (`1f6abec4`). The file did change (+106 / −2: one
  import line, the `ABC-230` oracle line and a new describe block at `:1404`). The Hash row at `:753` was not touched. `A6`'s row reads `ABC-241`'s
  helper through `parsePosition`. `ABC-220` (in flight) still adds rows to this file. Whichever of the two merges
  second rebases. That is order only, not a wait.)*
- *(2026-10-30, `bapm-g8-headroom-cut`.)* **Pull after `ABC-244`** (cut 2026-10-30, P1, test-only), which changes
  step literals in `src/uci-session.test.ts`. This ticket rebases on it. That is order, not a wait on design.
- No ADR. No owner question.

## Definition of Ready

| # | check | state |
|---|---|---|
| 1 | problem clear | ✅ SE-228ii-a confirmed by QE's plant (`…c448c753`); QE-228ii-b, the title against `DEFAULT_BUDGET_MS` |
| 2 | scope and out-of-scope | ✅ 2 items (*2026-10-30:* 3, Scope 3 added); other `GO_G3500` rows, `NFR-009` catalog text and production files out |
| 3 | INVEST | ✅ independent of production; XS; testable by plant |
| 4 | testable, measurable acceptance | ✅ A1 4 000–4 200 ms; A2 red at L = 4, 6, 7; A3/A4 exact diff fences; A5 skips 0. *2026-10-30:* A6 bestmove `d1e1` at `cp 0`, the raw list not 0, red under QM3; A4 row count base's + 1 |
| 5 | dependencies known | ✅ `ABC-228` Done; file overlap with `ABC-241` / `ABC-220` named. *2026-10-30:* `ABC-241` Done (`1f6abec4`); `A6` reads its helper; pull after `ABC-244` (shared file) |
| 6 | NFR triggers with targets | ✅ 0 real-clock rows; `G8` ≤ 10 s; `NFR-009` bar unchanged. *2026-10-30:* `A6` fixed-depth; `G8` headroom 0.37 s named; *later 2026-10-30:* headroom 0.10 s (`QE-229-a`), est. +0.03 s, R1 line for `A1` owed |
| 7 | test notes | ✅ 3 (*2026-10-30:* 4) |
| 8 | size | ✅ XS |
| 9 | priority | ✅ P3 |
| 10 | no major unresolved blocker | ✅ ~~pull order: after `ABC-241` merges (shared `src/uci-session.test.ts`), the same kind of wait as `ABC-229` and `ABC-242`~~ met 2026-10-30, `1f6abec4`. None left. `ABC-220`'s rows in the same file are rebase order only |

**DoR 9/10 (2026-10-30, `bapm-ABC-228-merge-fold`). Backlog, P3.** When `ABC-241` merges, row 10 is met and the
ticket is 10/10 and Ready, with no further fold needed.

**DoR 10/10 (re-scored 2026-10-30, `bapm-ABC-241-merge-fold`). Ready, P3.** *(Was 9/10, `bapm-ABC-228-merge-fold`,
waiting on `ABC-241`'s merge.)* QE-241-a was folded in as Scope 3 and `A6`. The board move `Backlog → Ready` is the
Orchestrator's to make on the board.
