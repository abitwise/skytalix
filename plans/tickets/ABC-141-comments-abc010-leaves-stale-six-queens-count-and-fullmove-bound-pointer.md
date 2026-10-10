---
id: ABC-141
title: Comments ABC-010 leaves stale — the six-queens derive count says six (it measures seven) at two sites, and the history pane names ABC-010 as the move-number bound it does not deliver
status: backlog
column: Backlog
size: XS
priority: P3
epic: —
feature: —
---

# ABC-141 — make the six-queens derive count and the history pane's fullmove pointer true after `ABC-010` merges

> **Cut 2026-10-10 by BA/PM** (task `wave-2026-09-25`, subtask `bapm-r5d-qe139a-2026-10-10`) at wave tip
> `75dcc0f5`, against `ABC-010`'s unmerged tip `f9d1ff4b`. The source is QE's gap register on that branch,
> `.grugops/context/qe-ABC-010/notes/…2c22980f`, items `QE-010-b` (LOW) and `QE-010-c` (LOW, comment part only).
> **The move-number bound itself is declined, not ticketed.** Reasoning:
> `.grugops/context/bapm-r5d-qe139a-2026-10-10/notes/`. Readings: `../probe/RUN.txt` there.

## Problem

*User*: the next maintainer who reads either comment. Typically that is someone sizing `NFR-003`/`N8-LANE` costs
from `move-input.ts`, or someone deciding whether a loaded FEN can widen the history pane.

*Pain*, **two stale comments, one cause: `ABC-010`'s merge.**
1. **The derive count (`QE-010-b`).** `src/move-input.ts:48` (production) says "six queens on `d4` cost six of
   those, measured by QE". `src/move-input.test.ts:493` says "six queens on `d4` measured six". BA/PM's own
   counter counts `legalMoves` calls in one `resolveMoveInput(h, "Qxd4")` on each tree's `SIX_QUEENS_FEN`. At
   `75dcc0f5` the count is **6** (five `#` candidates), and both comments are true. At `f9d1ff4b`, `ABC-010`
   re-authors the fixture (the black king leaves `f8` for `e5`). The count is **7**: all six candidates now mate,
   so `toSan` derives once more. Nothing asserts either number, and `A5`'s one-derive-per-prompt still holds.
   But the honest-cost sentence each comment exists to state goes wrong.
2. **The bound pointer (`QE-010-c`).** `src/history-pane.ts:53–56` (`ABC-017`'s accepted limitation) says:
   "`parseFen` imposes no upper bound and `ABC-010` is the ticket that would". `ABC-010`'s scope bounds clocks
   only by round trip. At `f9d1ff4b`, `parseFen` accepts fullmove `10000` and `100000000000000000000` (BA/PM's
   own probe, QE agrees). So the comment promises a bound no ticket delivers.

*Value*: each comment states what the merged tree does, and names no ticket for work that ticket does not do.

## Scope

Comment lines only, in three files, after `ABC-010` merges:
1. `src/move-input.ts`, the "WHAT `A5` DOES NOT SAY" paragraph: the six-queens derive count.
2. `src/move-input.test.ts`, the `RENDERED` table's docblock: the same count.
3. `src/history-pane.ts`, the "ACCEPTED LIMITATION" paragraph: the sentence naming `ABC-010` as the bound.

Spelling is the Engineer's. The count **should carry its derivation** (one derive for the prompt plus one per
checking candidate), so a future fixture re-author sees the number move. The limitation **may** say where the
bound gets decided: the first ticket that lets a human or a file supply a FEN, which is `ABC-010`'s own "trigger
back to `P1`".

## Out of scope

- **Any executable line.** That includes `SIX_QUEENS_FEN`, the `RENDERED` rows and any assertion. No derive-count
  assertion is added: the test's own docblock says "the guard is the ARGUMENT, not the count".
- **A fullmove upper bound in `parseFen`.** Declined (see the BA/PM decision note). No FEN input exists, and no
  position above 9,999 is reachable by play.
- **`plans/tickets/ABC-017-…md`'s historical "`ABC-010` … is the ticket that would bound it".** That is a `Done`
  page's record, and it is not rewritten.
- **`QE-010-d`** (guard blind spots, Architect/Design) and the INFO items `QE-010-e`…`-h`.

## Acceptance (Given/When/Then)

- **`A1` (the derive count is the measured one, at both sites).** **Given** the delivered tree, **when** an
  independent counter counts `legalMoves` calls in one `resolveMoveInput(newGame(SIX_QUEENS_FEN), "Qxd4")` on that
  tree, **then** both comments state that number (**7** at `f9d1ff4b`), and the two agree. **And**
  `grep -c 'cost six of those' src/move-input.ts` and `grep -c 'measured six' src/move-input.test.ts` each print
  **0** (**1** each at `75dcc0f5` and `f9d1ff4b`).
- **`A2` (the history pane names no undelivered bound).** **Then** `` grep -cF '`ABC-010` is the ticket that would'
  src/history-pane.ts `` prints **0** (**1** at `75dcc0f5`). **And** the paragraph still states that `parseFen`
  accepts a fullmove above 9,999. Check: a delivered-tree `parseFen("4k3/8/8/8/8/8/8/4K3 w - - 0 10000")`
  returns `fullmoveNumber` 10000. The paragraph names no ticket as delivering a bound unless that ticket's scope
  contains one.
- **`A3` (comment-only, three paths, by owner Q4's conjunction).** **Then**
  `git diff --name-only <base>..<delivered> -- src` lists exactly the three files. **And** both of these hold for
  each file (`QE-129-b`/`QE-139-c`: never one measure alone):
  - every changed line is a comment line by the TS AST comment ranges;
  - the comment-stripped compile (`transpileModule`, `removeComments`) is byte-identical at base and tip.

  Harness: `.grugops/context/qe-ABC-132/probe/exit132.mjs`, or an independent one taking both measures with a
  negative control.
- **`A4` (gates).** **Then** lint, typecheck, build and `npm test` exit 0 with the base's test count, skip count
  0 and integrity `No findings.`

## Dependencies

- **`ABC-010` merged to `main` — HARD.** At `75dcc0f5` the count is 6 and site 1–2's comments are true. The
  premise exists only on `ABC-010`'s tree. `ABC-010` awaits the owner's UAT word (production `src/fen.ts`).
  - **Re-score when `ABC-010` merges.** Re-measure `A1`'s number at that base. If `ABC-010` is re-cut and
    `SIX_QUEENS_FEN` changes again, use the new count.
  - If `ABC-010` is dropped, sites 1–2 fall away. Site 3 stands alone, because the pointer is already false at
    `75dcc0f5`, and the page is re-cut to it.
- **Never in parallel with another hop on `src/move-input.ts`, `src/move-input.test.ts` or `src/history-pane.ts`.**
  At `75dcc0f5`, `ABC-010` is the only open ticket that edits any of them (`src/move-input.test.ts`).
- **Not amended onto `ABC-010`'s branch:** that would move the sha under the owner's UAT.

## Security / NFR triggers

None. No executable line, no runtime path, no test count changes. `N8-LANE` 0 ms (no new test file).
**UAT:** two production files, comment-only. **WAIVED** if `A3` holds, by the owner's Q4 ruling of 2026-10-10
(`.grugops/context/wave-2026-09-25/notes/…owner-word-uat-q4-5c8e2a17`). Otherwise the owner's word is owed.
**QE hops** (`AGENTS.md` § QE validation authority).

## Test notes

1. Count derives on a `git archive` copy with a counter spliced into `legalMoves` (`src/legal.ts`). Never in the
   checkout. BA/PM's `probe/derives.mjs` is one such counter. QE's is `qe-ABC-010/probe/qe010-count-derives.mts`.
2. No test is added. `A1`–`A3` are the evidence.

## Size and priority rationale

**`XS` (1):** three comment sentences in three files, no executable line. It calibrates with `ABC-132` (`XS`,
three production docblocks, comment-only). **`P3`:** nothing asserts either number. The wide history row needs a
FEN no user can supply today. **Not two tickets:** both items share one trigger (`ABC-010`'s merge), one
measurement (Q4) and one hop.

## Definition of Ready

Assessed by BA/PM at the cutting hop, **2026-10-10**, wave tip `75dcc0f5`. **Result: 9 of 10, ⚠️ item 3 → stays
in `Backlog`.** Re-score when `ABC-010` merges.

| # | item | verdict |
|---|---|---|
| 1 | problem clear | **✅** both counts measured at both tips on BA/PM's own counter; fullmove probed |
| 2 | scope and out-of-scope clear | **✅** three comments; the bound, fixtures, `ABC-017`'s page and `QE-010-d` fenced out |
| 3 | INVEST-shaped | **⚠️** not independent until `ABC-010` merges: the premise for sites 1–2 exists only on that branch |
| 4 | acceptance testable and measurable | **✅** a measured count, three greps, one parse, Q4's two measures, gate counts |
| 5 | dependencies known | **✅** `ABC-010` merge, hard; re-score rule for re-cut or drop |
| 6 | security/NFR triggers with a measurable target | **✅** none, stated; UAT waiver conditional on `A3` |
| 7 | test notes present | **✅** two |
| 8 | size assigned | **✅** `XS` (1) |
| 9 | priority assigned | **✅** `P3` |
| 10 | no major unresolved blocker | **✅** none beyond item 3's merge order |
