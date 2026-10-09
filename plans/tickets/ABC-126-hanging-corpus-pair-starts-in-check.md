---
id: ABC-126
title: The hanging corpus's "R takes a bishop a pawn defends" pair starts in check — re-find it, and assert the header's claim
status: backlog
column: Backlog
size: XS
priority: P2
epic: EPIC-004
feature: —
---

# ABC-126 — two corpus rows break the corpus's own rule, and the row named for that rule only checks legality

> **Cut 2026-10-09 by BA/PM** (task `wave-2026-09-25`, subtask `cut-followups-2026-10-09`,
> Workflow 07) from Architect/Design's side finding at `ruling-abc082-levels`
> (`.grugops/context/ruling-abc082-levels/notes/20261009T164755Z-architect-design-decision-what-the-engineer-changes-what-ba-pm-folds-owner-word-owed-33e5e0a3.md`
> item 5; measured in `…-observation-row21-hanging-corpus-margins-and-the-replacement-pair-d25a0383.md`).
> Pre-existing since `ABC-079`; not caused by `ABC-082`.
>
> **ORDERED AFTER `ABC-084` MERGES.** `ABC-084` (In Development) moves this corpus out of
> `src/quiescence.test.ts` into a data module, byte-identical. Editing the rows before that lands
> would collide with the move or fork the corpus.

## Problem

*User*: every later reader of `ABC-079` `A1`'s evidence and of `ABC-084`'s do-not-hang class.

*Pain*: the corpus header says every row "must NOT be in check, or the losing capture is not even
on the menu and the row proves nothing". **Two rows are in check:** "R takes a bishop a pawn
defends" (`4k3/8/1p6/b7/8/8/8/R3K3 w - - 0 1`, `Ba5+` on `e1`) and its mirror
(`r3k3/8/8/8/B7/1P6/8/4K3 b - - 0 1`, `Ba4+` on `e8`). The row titled "carries at least 20
positions, none of them in check for the side to move" (`src/quiescence.test.ts:306`) only asserts
that the losing capture is legal. BA/PM's probe at `7b54dae`: **2 of 24 rows in check, exactly this
pair** (`.grugops/context/cut-followups-2026-10-09/probe/in-check.out.txt`).

The rows still test something, because the losing capture also answers the check. But with 5 legal
moves, 4 of them king moves, the row is a much narrower test than its theme claims.

*Value*: the corpus says what it does, and a future in-check row is caught by a test instead of by
an Architect reading FENs.

## Scope

- **Re-find the pair:** replace each FEN with one of the same theme (a rook takes a bishop that a
  pawn defends; same side to move; the capture is the named losing move), with the side to move
  **not** in check. The name and the losing move stay unless the new FEN forces a new square.
- **Make the title's claim an assertion:** the "none of them in check" row also asserts
  `isInCheck(parseFen(fen))` is `false` (`src/legal.ts:32`) for every row it iterates.
- Both edits land wherever `ABC-084` put the corpus and that row.

## Out of scope

- **Any other corpus row,** including the four dead-draw pairs (`…d25a0383`). They are not in check.
- **Any level of `ABC-079` `A1`.** Under `ADR-0028` decision 2 a fixture is re-found and its level
  does not move.
- **`ABC-084`'s own additions** (mate, win-material, extra do-not-hang rows). If the shared module's
  header now covers them and one is in check, stop and report; do not re-find it here.
- **Any production file.**

## Acceptance (Given/When/Then)

- **`A1` (the claim is asserted).** **Given** the 24 rows `ABC-079` `A1` reads, **when** the
  "none of them in check" row runs, **then** it asserts **not in check** for each, **24/24**, as
  well as legality. **On today's pair it is red on exactly 2 rows** (shown in the PR note before
  the FEN change).
- **`A2` (the pair is re-found, not dropped).** **Then** `ABC-079` `A1` still reads **exactly 24
  rows**. The two replacements are not in check, their losing capture is legal, and the side to
  move has **more than one non-king move**.
- **`A3` (the rows still discriminate).** **Given** each replacement, **then** with quiescence the
  losing capture is **not** chosen at depth 1 and at depth 3 (`SEARCH_DEEP=1`), and the bare leaf
  (`searchWithoutQuiescence`) **does** choose it at depth 1. The PR note records each row's margin
  at depth 3 (the best move's score minus the capture's), as `…f0115510` did for row 21. The
  default lane and `SEARCH_DEEP=1 npx vitest run src/quiescence.test.ts` are green.
- **`A4` (`ABC-084`'s suite and baseline are respected).** **Given** `ABC-084`'s opt-in lane,
  **when** it runs after the change, **then** the solved count is **not below** the recorded
  baseline. **The baseline file is not touched in this ticket's commits** (`ABC-084` `A7`: the
  baseline moves only in its own commit with a reason). Each replaced row's provenance
  (`ABC-084` `A6`) records the re-find and cites this ticket.
- **`A5` (test data only).** **Then** `git diff --numstat <base>...<tip> -- src` lists only the
  corpus data module and the test file holding the "none of them in check" row. Lint, typecheck,
  build and `npm test` exit 0; skip count 0; integrity `No findings.`

## Dependencies

- **`ABC-084` must merge first — OPEN (In Development).** It moves the corpus and its row; the
  data module's name is its Engineer's. This is an ordering dependency, not a design one.
- **`ABC-079` — `Done`.** It owns `A1` and its 24 rows.
- **`ADR-0028` decision 2** governs the re-find (fixture re-found, level unchanged).

## Security / NFR triggers

- **`N8-LANE` — ≤ 650 ms CPU net.** 24 `isInCheck` calls, and no new test file: about 0 ms.
- **`NFR-004`, `NFR-005` — not triggered.** No production line.
- **Zero production lines**, so UAT is waived under the standing rule; the QE hop still applies.
- **Security — not triggered.** Static test data.

## Test notes

1. **Write `A1` first and see it red on the shipped pair**, then re-find. That proves the
   assertion can fail.
2. **A measured candidate, not a prescription.** Moving the king off the bishop's diagonal
   (`4k3/8/1p6/b7/8/8/8/R4K2 w - - 0 1`, mirror `r4k2/8/8/8/B7/1P6/8/4K3 b - - 0 1`) reads at
   `7b54dae`: not in check, capture legal, 12 legal moves; quiescence picks `f1g1` at d1 (115) and
   `a1b1` at d3 (105); the bare leaf picks `a1a5` at d1 (410). The FEN choice is the Engineer's;
   the margins are re-measured on the tree it lands on.
3. **Re-run `ABC-084`'s lane, do not assume it.** The shared rows read 0/24 losing at `dfda6ba`,
   and a re-found row should keep that, but `A4` is a reading.

## Size and priority rationale

**Size `XS` (1).** Two FENs and one added assertion, with a measured candidate.

**Not `XL`. No `SPLIT_REQUIRED`.**

**Priority `P2`.** A correctness gap in test data, not a defect: the rows still test something,
nothing is red, and nothing waits on it.

## Definition of Ready

Assessed by BA/PM, **2026-10-09**, against the wave tip `7b54dae`. **Result: 9 of 10, 1 ⚠️ — NOT
met; stays in `Backlog`.** The ⚠️ is an ordering hold with a named release: when `ABC-084` merges,
item 3 becomes ✅ by that fact alone, and nothing else needs to change.

| # | item | verdict |
|---|---|---|
| 1 | problem clear | **✅** two named rows, the header they break, and a 2/24 measurement |
| 2 | scope and out-of-scope clear | **✅** two FENs and one assertion; other rows, levels, `ABC-084`'s additions and production code fenced out |
| 3 | INVEST-shaped | **⚠️** small, testable and valuable, but **not independent until `ABC-084` merges**: it edits the rows `ABC-084` is moving |
| 4 | acceptance testable and measurable | **✅** 24/24 not in check (red on 2 today), exactly 24 rows, depth-1/depth-3 choices per arm, solved count ≥ baseline, a `numstat` fence |
| 5 | dependencies known | **✅** `ABC-084` (ordering), `ABC-079`, `ADR-0028` decision 2 |
| 6 | security/NFR triggers with a measurable target | **✅** `N8-LANE` ≤ 650 ms (≈ 0 ms, no new file); `NFR-004`/`NFR-005` not triggered |
| 7 | test notes present | **✅** three |
| 8 | size assigned | **✅** `XS` (1) |
| 9 | priority assigned | **✅** `P2`, with the reason |
| 10 | no major unresolved blocker | **✅** a candidate FEN is measured; the remedy is the Architect's, and no ruling is owed |
