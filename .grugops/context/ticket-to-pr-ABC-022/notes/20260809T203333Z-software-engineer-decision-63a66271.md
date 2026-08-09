---
id: 20260809T203333Z-software-engineer-decision-63a66271
kind: decision
by: software-engineer
at: 2026-08-09T20:33:33Z
verified_by: 
confidence: high
refs:
  - ABC-022
  - ABC-009
  - src/moves.enpassant.test.ts
  - src/moves.castling.test.ts
  - plans/tickets/ABC-022-en-passant-generation-preconditions.md
supersedes: 
---

# Test-file decisions: a NEW file, a field-by-field state oracle, per-PAIR purity — and the numbers this file deliberately does NOT pin

## A new file, for the same mechanical reason `ABC-009` cut one

`src/moves.enpassant.test.ts` is new, 208 lines, 58 tests. Appending to `src/moves.test.ts` would
have made `A9`'s *"no existing test is modified, verified at line level"* a judgement about which
changed lines were tests. As a new file it is `git diff --name-only main -- 'src/*.test.ts'` being
**empty**, which is a fact.

## Purity asserted field by field, and additionally per make/unmake PAIR

`A4` says "compared field by field and **not** through `toFen`". `ABC-009`'s file used a single
joined-string `fullState` compare, which detects any difference but reports it as one blob. This
file asserts **each** of the 128-byte board array and the five scalars as its own `expect`, so a
failure names the field that moved. `toFen` appears nowhere in the file — not even as a legibility
aid, which is where `ABC-009`'s version used it — because `A4` removed it as an oracle and BA/PM
measured why (`epSquare` 32 aliases off-board 40; 28 castling bit values render `-`).

Purity is asserted **twice** over the same population: once across the whole `legalMoves` call, and
once after **every individual make/unmake pair**. `## Test notes` item 2 offers "choose rows where no
other legal move touches the capture square, **or** assert per make/unmake pair as well" — this file
does the second, and that was not decoration: on the self-masking witness
`4k3/8/8/8/3pp3/8/8/4K3 b - e3 0 1` the across-the-call assertion reads **GREEN** on the unfixed tree
and the per-pair assertion reads **RED**. The instrument, not just the row selection, now resists
self-masking.

## The `A4` population is "every position this file uses"

Rather than transcribing which of the reproduction rows count as "the ten", the purity table is the
union of `A1`, `A3`, `A5` and `A6`'s tables — a **strict superset** of the `## Reproduction` tables
(the half-(a) rows, the half-(b) rows on both colours, the control rows, plus `A1`'s fourth row and
`A5`'s two new rook rows). This makes the coverage claim checkable by reading one array instead of
cross-referencing a section.

## One row added to each of `A1` and `A3` beyond the stated minimum

`A1` gains `4k3/8/3R4/3pP3/8/8/8/4K3 w - d6 0 1` — an own **rook**, **white** to move — so the
2x2 of piece type x colour is complete on the own-colour half, matching the 2x2 `A5` now carries on
the enemy half. `A3` gains the self-masking witness `4k3/8/8/8/3pp3/8/8/4K3 b - e3 0 1`, which is a
genuine half-(b) row (the byte on e4 is a BLACK pawn, not the white pawn the move claims) and not
merely a purity curiosity. Both criteria say "at minimum", so neither addition widens anything.

## What this file deliberately does NOT assert, and why

`ABC-009`'s equivalent file pins the **total** `legalMoves` count on every row. This one does not.
`ABC-022`'s `A1`/`A2`/`A3` are stated purely as *"the `FLAG_EN_PASSANT` count is exactly 0"*, and a
total-move count would be a number measured from **my own build** and then asserted against it —
self-confirming rather than derived from the ticket. Over-rejection is covered by criteria that do
come from the ticket: `A6`'s two exact controls, `A7`'s walk, and the deep perft lane's 32/32. The
cost of the choice is named: a fix that over-rejects some *other* pawn move on one of these rows
would be caught by `A6`/`A7`/the suite rather than by the row itself.

**No wall-clock assertion was added to the suite** — this project's standing rule.
