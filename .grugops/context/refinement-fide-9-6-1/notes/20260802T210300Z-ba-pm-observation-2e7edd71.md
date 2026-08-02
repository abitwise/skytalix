---
id: 20260802T210300Z-ba-pm-observation-2e7edd71
kind: observation
by: ba-pm
at: 2026-08-02T21:03:00Z
verified_by: 
confidence: high
refs:
  - refinement-fide-9-6-1
  - ABC-011
  - ABC-020
  - EPIC-001
  - src/gameend.ts
  - src/zobrist.ts
  - 20260802T210100Z-ba-pm-decision-968fe5b1
  - .grugops/context/refinement-fide-9-6-1/sources/E012023-article-9.txt
supersedes: 
---

# What else Article 9 says about code already in this repo — recorded, NOT acted on

Reading Article 9 for the 9.6.1 ruling put the rest of the article in front of this role at zero
marginal cost. Nobody in this project had read the Laws before, so the following is written down
once rather than re-retrieved later. **None of it cuts a ticket, moves a board column, changes a
priority, or edits any ticket file.** It is context for whoever next opens one of these tickets.

## 1. The text corroborates ABC-020's central fix

9.2 and 9.3 both open with the same clause, quoted exactly:

> 9.2 The game is drawn, **upon a correct claim by a player having the move**, when the same
> position for at least the third time (not necessarily by a repetition of moves):

> 9.3 The game is drawn, **upon a correct claim by a player having the move**, if:

`src/gameend.ts` reports threefold (`>= 3`) and fifty-move (`>= 100` plies) as `claimable` on the
in-progress arm, attributed to the side to move. That is what the text says, and the G-1 defect
ABC-020 fixed — taking the game from the player entitled to refuse the draw — was a real
non-conformance against the actual Laws, not only against a remembered version of them. ABC-020's
premise is confirmed by primary source **after** the fact, which it had never been.

Note also 9.2's parenthesis, *"(not necessarily by a repetition of moves)"*: the threefold claim is
explicitly a count with no ordering requirement, which is a second textual reason the fivefold
backstop above it was never going to carry one.

## 2. The rest of 9.6 also matches the code

- 9.6.2: *"any series of at least 75 moves have been made by each player without the movement of any
  pawn and without any capture."* → `SEVENTY_FIVE_MOVE_PLIES = 150` plies, automatic. Conformant;
  150 plies is 75 moves by each player.
- 9.6.2's tail: *"If the last move resulted in checkmate, that shall take precedence."* →
  `gameStatus` decides checkmate first, from the zero-legal-moves branch, before either clock or
  repetition is consulted. Conformant. This sentence is the **textual authority for the
  terminal-check ordering** that QE's mutation run found was pinned by nothing and that
  Security/NFR later closed with `src/gameend.nfr.test.ts`; the ordering is not merely a taste.
- 9.3.2: *"the last 50 moves by each player have been completed…"* → `FIFTY_MOVE_PLIES = 100`,
  claimable. Conformant.

## 3. The text bears directly on ABC-011 — which is already ticketed, and stays exactly where it is

9.6.1 refers to 9.2.2, which pulls in 9.2.3's definition of sameness:

> 9.2.3 Positions are considered the same if and only if the same player has the move, pieces of the
> same kind and colour occupy the same squares and **the possible moves of all the pieces of both
> players are the same**. Thus positions are not the same if:
>
> 9.2.3.1 at the start of the sequence a pawn **could have been captured** en passant.

ABC-011 records that `src/zobrist.ts:71` hashes the en-passant file whenever `epSquare` is set,
rather than only when an en-passant capture is actually available. **The retrieved text supports
that diagnosis on its face**: sameness turns on whether *the possible moves are the same*, and
9.2.3.1 says *could have been captured*, not *a double push had just occurred*. Where no en-passant
capture is available the possible moves are identical, so the Laws call the positions the same and
this code does not.

**Nothing follows from this here, deliberately.** ABC-011 already exists, already sits in `Ready` at
`S`/`P1`, and its size, priority and reachability analysis are unchanged by this note — the board's
own re-sequencing comment explains why it is P1 and not higher, and that reasoning (a repetition
loop contains no capture and no pawn move, so the clock-based 75-move backstop terminates the game
regardless) survives intact. This paragraph adds **evidence**, not scope: the ticket's premise is
now backed by the primary text instead of by inference. No ticket file was edited and no priority
was touched.

## 4. What this note deliberately does not touch

Open questions 2 (`GameResult`'s dead alias) and 3 (ABC-020's A5/A8 `Given` wording) are outside
this task by the routing decision's stop condition 4 and coding rule 5. Article 9 says nothing about
either, and neither was examined.

## Provenance

Written **by hand** into `notes/` — no `scripts/context-io.ts` and no `mcp__grugops__propose_note`
in this install, the standing degradation recorded since 2026-07-31. This is an `observation`, a
neutral kind needing no verification stamp: every claim above is a quotation from a retained primary
source read against code in this repo, asserted as neither a proven `finding` nor a soft `claim`.
**Nothing is self-stamped**, and no `finding` was recorded or attempted — there is no §14 gate on
this task to issue a stamp.
