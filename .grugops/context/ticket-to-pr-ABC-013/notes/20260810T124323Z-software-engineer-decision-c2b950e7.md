---
id: 20260810T124323Z-software-engineer-decision-c2b950e7
kind: decision
by: software-engineer
at: 2026-08-10T12:43:23Z
verified_by: 
confidence: high
refs:
  - ABC-013
  - ADR-0004
  - EPIC-003
  - src/san.ts
  - src/moves.ts
  - src/legal.ts
  - src/apply.ts
supersedes: 
---

# `src/san.ts` as built: four decisions inside the shape `ADR-0004` fixed, each one a place a wrong build lives

`ADR-0004` fixed the module, its placement, its imports and its signature; `ABC-013` fixed the
grammar. What was left to decide is small and every one of the four below is a documented wrong-build
shape, so they are recorded rather than left in the diff.

## 1. The legal list is built LAZILY, and three of the four call shapes never build one

`toSan` is `body(...) + suffix(...)`. `body` reaches `disambiguator` only on a piece move, and
`disambiguator` evaluates `legal ?? legalMoves(position)` only there. So:

| call | generations |
|---|---:|
| any move, `legal` supplied, not a check | **0** |
| unassisted quiet PAWN move | **0** |
| unassisted quiet piece move | **1** |
| checking move | **+1** for the mate test |

A castle string needs no list either. **This is what makes `N1` a ratio rather than a number**, and
it is why the pawn/piece asymmetry BA/PM measured (0.133 µs against 5.16 µs) exists at all rather
than being an artefact. It is asserted structurally in `src/san.nfr.test.ts`; every one of the 52
rows is blind to it.

## 2. Rivals are matched on the WHOLE piece byte, and the mover is excluded by `from`

```ts
if (other.to !== move.to || other.piece !== move.piece || other.from === move.from) continue;
```

- `other.piece !== move.piece` compares type **and** colour in one test. Every move in a legal list
  is the side to move's, so the colour half is free — but it costs nothing and it is the test that
  is right if that ever stops being true. This is the clause that kills the "rivals not filtered by
  piece type" build (12 rows red on the table; `A8`).
- **The mover is excluded by `other.from === move.from`, not by reference identity.** Deliberate:
  `generateMoves` allocates a fresh `Move` per call, so a caller that obtained `move` from one
  `legalMoves` call and `legal` from another would, under an identity test, count the mover as its
  own rival and emit a qualifier for a unique piece. `from` is also the right test on its own terms
  — two moves of the same piece type from the same square to the same square are the four promotion
  variants, which are pawns and never reach this branch.

## 3. File before rank, and the two flags are independent

`sharesFile` and `sharesRank` are accumulated over ALL rivals and then read in order: no rival →
no qualifier; else file if no rival shares it; else rank if no rival shares it; else the full
square. Accumulating separately is what gets `Q1e1` right — the `h1` queen has one rival sharing
its file and a different rival sharing neither, and a single "is this rival separable" test per
rival would answer the wrong question.

**The order is not interchangeable**, and `A4`'s `P-FILE-PREC` pair is the only thing on the board
that can see it: swap the two lines and `Nbc3` becomes `N1c3`, which BA/PM measured passing the
ticket's original table and its own first repair.

## 4. Capture is `move.captured`, and the suffix is check-AND-no-reply in that order

- `const captures = move.captured !== EMPTY` — never `position.board[move.to]`. En passant is the
  only move whose destination is empty while it captures, so a board read drops the `x` on exactly
  one row of the table and nowhere else (`A10`). `src/moves.ts` documents `captured` as "for en
  passant, the captured pawn (not on `to`)", so this is reading the field for its stated purpose.
- `const mate = check && legalMoves(position).length === 0` — the `&&` carries two loads. It makes
  `#` mean checkmate rather than "no reply", which is what separates `Qg6` (stalemate, no suffix)
  from `Qg7+` in the same position (`A17`); and it keeps the second generation off every
  non-checking move, which is where the cost is.
- The suffix is appended to the result of `body`, **outside** the castle branch. A build that
  returns the castle string early is wrong only on `O-O+` / `O-O-O+` (`A16`).

## What was NOT decided here, deliberately

- **No `parseSan`, no stub, no `SanParseResult`, no reject-reason vocabulary.** `EPIC-003` adds them
  to this file. The three helpers (`PIECE_LETTERS`, `disambiguator`, `suffix`) are the pieces a
  parser will want and are module-private, so that hop can consume or widen them without a rewrite.
- **No validation of `move` or of the supplied `legal` list.** `## Scope` declares behaviour on an
  illegal `move` undefined and asserts nothing about it; inventing one here would be an implementer
  choosing a contract. The two caller obligations are written into the module's doc comment instead,
  which is where the next caller will actually read them.
- **No memoisation, no cache, no fast path that skips the legal list.** `ADR-0004`'s Consequences
  name the second of those as foreclosed ("a 'fast path' that formats without disambiguating is
  wrong on exactly the positions where notation matters") and clause 3 forbids the first.
