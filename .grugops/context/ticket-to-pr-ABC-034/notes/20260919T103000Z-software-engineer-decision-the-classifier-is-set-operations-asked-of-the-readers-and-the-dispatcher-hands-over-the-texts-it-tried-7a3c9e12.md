---
id: 20260919T103000Z-software-engineer-decision-the-classifier-is-set-operations-asked-of-the-readers-and-the-dispatcher-hands-over-the-texts-it-tried-7a3c9e12
kind: decision
by: software-engineer
at: 2026-09-19T10:30:00Z
verified_by:
confidence: high
refs:
  - ABC-034
  - ABC-034/A2
  - ABC-034/A3
  - ABC-034/A4
  - ABC-034/A5
  - ABC-033
  - ADR-0004
  - src/rejection.ts
  - src/move-input.ts
supersedes:
---

# The classifier is SET OPERATIONS asked of the two readers with a different candidate list; the dispatcher hands it the texts it tried; the sentences are one exhaustive switch

**This is not a stamp.** Hand-authored `decision`; no `finding` is admissible on this install.

## 1. The king classes are the set difference, and the readers compute the match — nothing here parses

`own-king-exposed` / `must-address-check` = `generateMoves(position)` minus `legalMoves(position)`
(compared on `from` / `to` / `promotion`, because the two lists are built from separate `generateMoves`
calls and share no object identity). Whether a text NAMES a move in that difference is put to
`parseCoordinateMove(position, text, exposing)` and `parseSan(position, text, exposing)` with the
difference AS the candidate list. Both readers are pure filters over the list they are given, so
this costs no second grammar, no piece-letter table and no castle string in this module (`ADR-0004`
clause 2; `A8`'s constraint), and the rule "would leave the king attacked" is computed exactly once
in the project (`src/legal.ts`), never here (ticket test note 2). `parseSan`'s castle path calls
`toSan` on castle candidates in the list; castles are never in the difference because
`src/moves.ts` filters the through-check rule at generation, so that path sees no castle here.

**Rejected alternative:** a heuristic ("is the king on the mover's line?"). It is exactly what `A2`'s
property over the six perft positions is written to fail, and it would be the second implementation
of a rule the ticket forbids.

## 2. The origin-square classes read the board AFTER the coordinate reader's own verdict

`parseCoordinateMove(position, text, exposing)` returning `rejected` / `no-such-move` is the
coordinate grammar saying "I read this text and it is not in the list". Only then does the module
read `A4`'s "square name from the input" — `text.match(/[a-h][1-8]/g)` — and take the first as the
origin, which is the coordinate form's own definition (two square names, `ABC-031`). Then
`board[from]`: `EMPTY` → `empty-square`; other colour → `not-your-piece`; otherwise the move is in
neither `legal` (precondition) nor `exposing`, so it is not pseudo-legal at all → `piece-cannot-reach`.

**Rejected alternatives:** (a) a copy of the coordinate regex here — a second grammar; (b) adding
`from`/`to` to `CoordinateParseResult`'s rejected arm in `src/coordinate-move.ts` — a production
change outside this module (`A7`); (c) probing the reader with synthetic move lists to recover
`from`/`to` — works, and is what a senior engineer would call overcomplicated (coding rule 2 heuristic).

## 3. SAN that the reader accepted but no list satisfied is `no-legal-move-named`; the echo is the reader's text

`parseSan(position, text, exposing)` → `no-such-move` means well-formed SAN naming nothing. The
sentence echoes `text.trim()` — the variant the SAN reader read, which the grammar bounds at 7
characters (`Qa1xh8#`, `axb8=Q+`), never the raw line. No origin is derived for SAN: a letter→piece
map is a table this module may not own, and SAN's own referent (the destination square) is in the
echoed text.

## 4. The dispatcher hands over THE TEXTS IT TRIED, in order; the classifier knows nothing of folding

`resolveMoveInput` builds `[...new Set([line, ...CASE_VARIANTS.map(v => v(line))])]` and calls
`classifyRejection(position, tried, legal)`. The classifier walks the texts in that order and the
first text a grammar reads decides, coordinate before SAN — the dispatcher's own precedence.

**Rejected alternatives:** (a) exporting `CASE_VARIANTS` from `src/move-input.ts` and importing it
here — an import cycle (`move-input` → `rejection` → `move-input`); (b) a second copy of the four
variants here — the stale-copy failure `ABC-030`/`ABC-059` exist for; (c) classifying the raw line
only — a player typing `nc3` on a pinned knight would be told `type e2e4 or Nf3` while the fold had
read `Nc3`.

## 5. Sentences: one `switch` over the discriminated union, no `default`; every sentence fits one row

`rejectionMessage` is exhaustive by type: an eighth `Rejection` member without a `case` is a `tsc`
error (`A4`'s "no catch-all arm" as a property of the build). The seven strings:

| code | sentence | columns |
|---|---|---|
| `unreadable` | `type e2e4 or Nf3` | 16 |
| `empty-square` | `no piece on <sq>` | 14 |
| `not-your-piece` | `<sq> is not yours` | 15 |
| `piece-cannot-reach` | `<from> cannot reach <to>` | 18 |
| `own-king-exposed` | `exposes your king` | 17 |
| `must-address-check` | `your king is in check` | 21 |
| `no-legal-move-named` | `no move <san> here` | ≤ 20 |

The message region's width is the panels' `W` = 21 with the history pane (`ADR-0022`'s geometry),
and `packRegion` places an item of exactly `W` (`candidate.length <= capacity`). `A5` is asserted
through the real pipeline on every fixture position, not by this arithmetic. `unreadable` names no
square from the input because by definition the input holds none the grammars read; its referents
are the two formats it teaches. **`ADR-0022` honoured:** no `(+N more)` wording touched, nothing in
`src/frame.ts`. **`ADR-0021` honoured:** `src/turn-loop.ts` and `COMMAND_TABLE` untouched.

## 6. What the change to `src/move-input.ts` is, and why it is not bigger

The rejected arm's return is the one production line that changed in meaning. The `reasons` array,
its pushes and the `RejectReason` type existed only to pick between the two placeholder codes; the
classifier makes them unused, so they are removed (coding rule corollary: remove what YOUR edit made
unused). The module header sentence *"A rejection carries … REASON CODE"* would have been false and
is corrected (`ABC-114`'s lesson). `MoveInputDeps` is unchanged: the classifier takes the `legal`
array the dispatcher already derived and calls `generateMoves`, not `legalMoves`, so `ABC-033` `A5`'s
one-derive spy still reads 1 on every rejection row.
