---
id: 20260812T010300Z-software-engineer-observation-e2d54b09
kind: observation
by: software-engineer
at: 2026-08-12T01:03:00Z
verified_by: 
confidence: high
refs:
  - ticket-to-pr-ABC-017-dev
  - ABC-017
  - ABC-012
  - ADR-0009
  - src/history-pane.ts
  - src/history-pane.test.ts
  - src/history-pane.nfr.test.ts
supersedes: 
---

# Seventeen wrong builds constructed and run against the delivered pane — zero survivors

> Hand-authored; `scripts/context-io.ts` is absent. Not a `finding`.

Each mutant was applied to the **delivered tree**, run through `vitest --reporter=json` over the
three affected files, and reverted with `git checkout --`. The working tree was asserted clean after
every pass. Verdicts are the JSON reporter's, per test, not a reading of the diff.

| # | wrong build | verdict | what killed it (the criteria, not the count) |
|---|---|---|---|
| W1 | windows the last **16 plies** instead of the last 8 move numbers | killed ×4 | `A1`, `A4`, `A7`, `A11` |
| W2 | move number and column from the **array index** | killed ×2 | **`A6` only** (plus `A2`'s wide-anchor case) |
| W3 | **bottom-aligned** — blanks at the top | killed ×4 | `A8`, `A6`, `A2` |
| W4 | **does not pad** — rows as wide as their content | killed ×10 | all three `A2` tests, `A3`–`A7` |
| W5 | asks `toSan` about the position **after** the move | killed ×3 | `A3`, `A4`, `A2` |
| W6 | ships **9 rows** (`A13` M2) | killed ×10 | `A1`, `A3`–`A7`, `A11`, and 3 in `frame.test.ts` |
| W7 | ships **10 rows** (`A13` M3 — `4b` dies) | killed ×14 | as W6 plus the whole in-place frame block |
| W8 | **no leading half-row** — a black-anchored first ply lands in the white cell | killed ×2 | **`A6` only** (plus `A2`'s wide-anchor case) |
| W9 | reaches for `takeBack` and does **not** restore | killed ×14 | `A9`, `A3`–`A8`, and all of `A11` |
| W10 | reaches for `takeBack` and **does** restore | killed ×3 | **`A11` only** — see below |
| W11 | runs the **repetition derive** inside the frame | killed ×3 | **`A11` only** |
| W12 | **re-parses the anchor** once per visible ply | killed ×1 | **`A11`'s `parseFen <= 1` only** |
| W13 | SAN cell too narrow for the grammar's longest string | killed ×7 | `A2`, `A3`, `A4`, `A6`, `A7`, `A11` |
| W14 | hands `toSan` a legal move list it does not hold | killed ×1 | **`A11`'s arity clause only** |
| W15 | shows the **first** 8 move numbers instead of the most recent | killed ×8 | `A5`, `A1`–`A4`, `A6`, `A7` |
| M4 | `renderBoard` ships 10 rows | killed ×3 | **`A13` and `ABC-018`'s own tests; `A1` PASSES it** |
| M5 | board 10 **and** history 9 | killed ×14 | `A13` plus the frame block plus `A1`, `A3`–`A7` |

## Four results worth carrying forward, each measured rather than argued

**1. `W10` confirms the ticket's claim and adds a second catcher.** The ticket says a build that
calls `takeBack` and RESTORES *"passes every clause of `A9`"* and is caught only by `A11`. Measured:
`A9` **passes** it — output identical, byte-identical across two renders, `toFen` unchanged,
`moves.length` unchanged — exactly as recorded. What the ticket does not record is that
`takeBack` calls `parseFen` through `resetTo`, so **`A11`'s `parseFen <= 1` clause catches it too**,
and so does the structural importer assertion. Three independent catchers, and every one of them is
in the `*.nfr.test.ts` file the ticket's `## Test notes` mandate.

**2. `W2` and `W8` are killed by `A6` and by nothing else in the acceptance table.** Both are the
`D4`/`D5` defect class. Every other criterion — including all of `A3`, `A5`, `A7` and `A8` — is
implicitly a fullmove-1, white-to-move game and passes both. `A6`'s three anchors are the only thing
between this pane and an index-derived move number. **The `## Test notes` instruction to build the
anchors with `newGame(fen)` and never by playing from the start FEN is load-bearing, not stylistic.**

**3. `W12` and `W14` are killed by exactly one assertion each, and neither changes a byte of
output.** Both are pure cost regressions: `W12` re-parses the anchor per visible ply, `W14` pays a
`legalMoves` generation the module has no list for. The entire 13-test acceptance table is blind to
both. This is the ticket's own case for `A11` being a count and not a clock, reproduced from the
other side.

**4. `M4` is passed by `A1` and killed by `A13`.** `A1` cannot see the board term at all, which is
why `ADR-0009` cl. 6 derives it. With this ticket dropped, `M4` would be caught on delivered code by
nothing.

## The harness

Out of tree, in the session scratchpad; **no file was added to the repo for it**, so `N8-LANE`'s
declared file count of two is unmoved. It is a patch-run-revert driver over a list of
`[file, find, replace]` edits with a uniqueness check on every anchor, so a mutation that did not
apply is reported as skipped rather than silently scoring a survivor.
