---
id: ABC-034
title: Rejections that teach — a closed reason set, computed from the generator, never a bare "invalid"
status: backlog
column: Backlog
size: M
priority: P0
epic: EPIC-003
feature: —
---

# ABC-034 — the rejection names WHY, and "why" is computed rather than guessed

> **Cut 2026-08-12 by BA/PM** (task `post-abc030-2026-08-12`, subtask `refinement-post-abc030`,
> Workflow 03) at `EPIC-003`'s decomposition.

## Problem

*User*: the beginner, who is the reason this epic exists. `EPIC-003`'s user value opens with
*"controls should be easy to use"* and its third acceptance criterion is *"given an illegal move, the
message names the specific reason and the position is unchanged"*.

*Pain*: `ABC-032` ships the **floor** `ADR-0004` (2a) requires — *not SAN I can read* vs *well-formed
SAN naming no legal move here* — and that floor is exactly the bare rejection this epic forbids. A
player who types `Nf3` when the knight is pinned learns only that it was not accepted; they cannot
tell a typo from a rule they did not know.

*Value*: this is the single ticket where the epic's headline standard becomes a property of the code
rather than a sentence in a document. It is also the only place a player can learn the rules of chess
from this product, which is what makes it worth more than its size.

## Scope

**A classifier and its message set**, over the existing `rejected` arm.

- **A closed reason set**, extending `ABC-032`'s `SanRejectReason` vocabulary. `ADR-0004` (2a)
  explicitly permits this without an ADR change: *"widening the outcome set from three is an ADR
  change; widening the reason set is not."* The classes:

  | code | means | how it is COMPUTED, not guessed |
  |---|---|---|
  | `unreadable` | neither grammar can read the text | both resolvers rejected on grammar |
  | `empty-square` | no piece on the named origin square | `position.board[from] === EMPTY` |
  | `not-your-piece` | the piece there is the other side's | colour of `position.board[from]` vs side to move |
  | `piece-cannot-reach` | that piece cannot move there at all | the move is **not** in `generateMoves(position)` |
  | `own-king-exposed` | the move is legal-looking but leaves your own king in check | the move **is** in `generateMoves(position)` and **is not** in `legalMoves(position)` |
  | `must-address-check` | the same, while already in check | `own-king-exposed` **and** `isInCheck(position)` |
  | `no-legal-move-named` | well-formed SAN naming no move in this position at all | no `from` square is derivable |

- **One message per code, and no catch-all.** Every code renders one sentence that names a concrete
  referent — a square, a piece, or the king. There is no default arm and no fallback string.
- **Messages are DATA, placed by the loop.** They travel as `PromptOutcome.rejected.messages`
  (`src/turn-loop.ts:120`) into the frame's message region; nothing here prints. Seam invariant 5 and
  `ADR-0004` (2a)'s "never display copy" both hold: the *codes* live with the grammar, the *wording*
  lives here.

## Out of scope

- **The `rejected` arm's existence and its floor** — `ABC-032`. This ticket widens the vocabulary; it
  does not create the arm.
- **Ambiguity messages** — `ABC-033` owns the candidate list. An ambiguity is not a rejection.
- **The "no claim is available" rejection** — `ABC-035`, which owns the `claim` verb's grammar and the
  teaching rejection for a command. Same standard, different vocabulary, and `ABC-021` supplies the
  numbers it quotes.
- **Any change to `src/legal.ts`, `src/moves.ts` or `src/gameend.ts`.** This ticket **reads**
  `generateMoves` and `legalMoves`; it changes neither. Zero production lines outside its own module.
- **Retrograde reasoning** ("you cannot castle because the rook moved on move 14"). The seven classes
  are computable from the current position; anything needing move history is out, deliberately, and
  `EPIC-006`'s result screen is where history-shaped explanation belongs.
- **Localisation.** English only; no message catalogue, no substitution framework. Coding rule 7.

## Acceptance (Given/When/Then)

- **`A1` (the pin — the class this ticket exists for).** **Given**
  `rnb1kbnr/pppp1ppp/8/4p3/6Pq/5P2/PPPPP1BP/RNBQK1NR w KQkq - 1 4` or any position with an absolutely
  pinned piece, **when** a move of that pinned piece is submitted, **then** the reason is
  `own-king-exposed` and the message names the player's **own king**. *(Today the same input is
  indistinguishable from a typo.)*
- **`A2` (the classification is a SET DIFFERENCE, and that is asserted rather than described).**
  **Given** each of the six positions in `src/perft.test.ts`, **when** the classifier is run over
  **every** move in `generateMoves(position)` that is **not** in `legalMoves(position)`, **then** the
  reason is `own-king-exposed` or `must-address-check` for **every one of them, with zero
  exceptions**; and **when** it is run over every move in `legalMoves(position)`, **then** it classifies
  **none** of them as a rejection at all. **The discriminating requirement:** a classifier that answers
  `own-king-exposed` by heuristic — "the king is on the same line" — must fail at least one row of the
  first half, and a classifier that over-rejects must fail the second.
- **`A3` (each of the seven classes is reached by a named fixture).** **Given** one exact FEN and one
  exact input string per code, **when** each is submitted, **then** the reason is exactly that code —
  **seven rows, one per class, none of them reached by two rows**. *(A closed set whose membership is
  never exercised is a set with dead arms; this is the criterion that keeps the table honest.)*
- **`A4` (no bare rejection survives — asserted over the set, not per witness).** **Given** the
  delivered message set, **when** every code is rendered, **then** the seven messages are **seven
  distinct strings**, each contains at least one concrete referent (a square name from the input, a
  piece name, or the word for the king), **none** is a substring of another, and **no catch-all arm
  exists** — the classifier is total over its input domain by exhaustive mapping, not by a default
  branch. *(This is the quantifier form `ABC-024`'s `A3` and `ABC-030`'s `A2` both use: describe the
  hole once, not per witness. `ABC-028` re-found the same hole four times by doing the opposite.)*
- **`A5` (the message fits the frame and the frame hides nothing).** **Given** each of the seven
  messages, **when** it is passed to `assembleFrame` at the width the delivered panels set, **then**
  the message region's **hidden count is exactly 0** (`MESSAGE_ROWS` = 2, `src/frame.ts:45`; the
  region drops items and appends `+N`, `src/frame.ts:182-188`). **A message that does not fit is a
  message the player never reads.**
- **`A6` (the position is unchanged and the ply is not advanced).** **Given** any rejection, **when** it
  is produced, **then** `toFen(position)` is byte-identical before and after and `gameStatus` is **not**
  re-evaluated. *(`ABC-019`'s `rejected` path, unchanged; the same assertions `ABC-021` makes.)*
- **`A7` (no production change outside this ticket's module).** `git diff --numstat` shows this
  ticket's module and test file(s) and nothing else under `src/`; `src/legal.ts` and `src/moves.ts`
  hash unchanged; suite green, skip **0**, `PERFT_DEEP=1` **32/32**.

## Dependencies

- **`ABC-032` must land first — OPEN.** The `SanRejectReason` arm this ticket widens is that ticket's.
  An **ordering** dependency over one type, in one direction.
- **`ABC-033` is not a dependency in either direction.** The classifier is a pure function of position
  and input; the dispatcher calls it. Either may land first once `ABC-032` has.
- **`ABC-031` is not a dependency.** A coordinate rejection classifies through the same seven codes;
  no coordinate-specific class exists and none is needed.
- **Merged instruments:** `generateMoves` / `isSquareAttackedBy` (`src/moves.ts`), `legalMoves` /
  `isInCheck` (`src/legal.ts:42`, `:32`), `assembleFrame` (`src/frame.ts:194`), the perft table.

## Security / NFR triggers

- **`N8-LANE`, inherited by name** — ≤ **650 ms CPU** (5% of `NFR-008`'s 13 s clause), CPU instrument,
  median of paired per-round deltas, n ≥ 7 interleaved, identity null control ≤ 1.5%, net of 160 ms per
  test file added, scope = every file the branch adds under `src/`. **`A2` runs over the perft corpus
  and is the expensive criterion on this page — it is the one to watch against this bar.**
- **`NFR-001` (move-generation throughput) — not at risk, and the reason is structural.** This ticket
  calls `generateMoves` from a rejection path that runs at most once per typed line; it adds nothing to
  the search's inner loop and changes no line of `src/moves.ts` (`A7` pins the hash).
- **`NFR-003` (input responsiveness) — routed to `ABC-036`.** This ticket's own cost claim: a rejection
  costs **one** `generateMoves` and **one** `legalMoves` for the position already in hand, both
  measured elsewhere on this board at single-digit microseconds.
- **`NFR-002` — not triggered.** No renderer imports this module.
- **Security: the rejection message is the ONE place user text can reach the terminal, and it is
  already sunk.** Any echo of the typed line travels through the frame's message region, which
  **sanitizes** (`src/frame.ts:202`) — `ABC-018` owns terminal escape-sequence injection for the whole
  frame, and this ticket introduces **no second path** to that sink. **Firing threshold, falsifiable:**
  the security half fires if this ticket writes to any stream directly, touches any file under `src/`
  other than its own module and test file(s), or adds a runtime dependency.

## Test notes

1. **`A2` is the criterion, `A3` is the coverage.** A build can pass all seven `A3` rows with a
   heuristic and fail `A2` on one perft position. Run `A2` first when debugging.
2. **Do not compute "would leave the king in check" a second time.** `legalMoves` already filters it;
   the class is the difference between the two lists and nothing else. A second implementation of the
   rule is a second thing to keep correct, and it is how the two will disagree.
3. **Assert the message set as a SET** (`A4`) rather than message by message. Seven per-message
   assertions all pass on a build with an eighth, generic, catch-all arm.
4. **Round-trip every fixture FEN through `toFen` before believing it.** Standing instruction on this
   board; it has caught two lying labels.
5. **`must-address-check` and `own-king-exposed` are not the same message.** They are the same set
   difference under two conditions, and the player needs the difference: one says *that move leaves
   your king attacked*, the other says *you are in check and must answer it*.
6. **No test may assert an exact sentence in two places.** The message set is data; duplicating a
   string in a fixture makes the copy the test and the code the comment.

## Lane cost — how many test FILES this ticket implies

**One.** No `vi.mock` is needed — every assertion is over returned values and over `assembleFrame`'s
computed hidden count — so **no `*.nfr.test.ts` file is added**. ≈ 160 ms CPU, **≈ 1.2% of the 13 s
clause** (arithmetic over the published floor in `plans/nfr-catalog.md`, not a new measurement).

## Size and priority rationale

**Size `M` (3).** Seven classes, each computed from merged code, plus a message set, plus `A2`'s
property run over the perft corpus, plus the frame-fit criterion. It is above `S` because `A2` is a
genuine property test and because the classifier reads two move lists rather than one; it is below `L`
because there is no new subsystem, no design decision and no chess rule implemented here — every
answer is a set operation over lists the rules core already returns. Calibrated against `ABC-010`
(six validation rules in one existing module with exact fixtures, `M`) and `ABC-013` (`M`).

**Not `XL`. The split line if it ever moves:** **(a) the classifier and `A1`/`A2`/`A3`** — the
computed half; and **(b) the message set, `A4` and `A5`** — the copy half. Part (b) is `S` and ships
alone once (a) exists.

**Priority `P0`.** It is `EPIC-003`'s third acceptance criterion and its stated headline standard, and
`ABC-035`'s "no claim is available" rejection is written against the same standard. **Not `P1`:** the
epic's user value is a beginner playing without knowing notation, and a rejection that does not teach
puts that player back where they started.

## Definition of Ready

Assessed against `agent-factory/checklists/definition-of-ready.md` by BA/PM at the cutting hop,
**2026-08-12**. **Result: 9 of 10 clean, 1 recorded ⚠️ — NOT fully met; stays in `Backlog`.**

| # | item | verdict |
|---|---|---|
| 1 | problem clear | **✅** the beginner; `ABC-032`'s floor is the bare rejection this epic forbids; the only place a player learns a rule |
| 2 | scope and out-of-scope clear | **✅** seven codes with the computation for each; six fences, including retrograde reasoning and localisation |
| 3 | INVEST-shaped | **⚠️** valuable, negotiable, estimable, small, testable — **not fully independent**: it widens `ABC-032`'s reason arm and must land after it. Recorded rather than claimed clean |
| 4 | acceptance testable and measurable | **✅** seven criteria: a set-difference property over six positions with **zero** exceptions, **seven** distinct messages with no substring relation and no catch-all, a **hidden count of 0**, byte-identical `toFen`, `32/32`, skip **0** |
| 5 | dependencies known | **✅** one open ordering dependency in the direction it runs; three merged instruments named with their line numbers |
| 6 | security/NFR triggers with a measurable target | **✅** `N8-LANE` ≤ **650 ms CPU** with `A2` named as the criterion to watch; `NFR-001` structurally not at risk with a hash pin; the sanitization sink named with its line; firing threshold falsifiable |
| 7 | test notes present | **✅** six |
| 8 | size assigned | **✅** `M` (3), calibrated, with the split line named |
| 9 | priority assigned | **✅** `P0` |
| 10 | no major unresolved blocker | **⚠️** **one ordering dependency is OPEN** — `ABC-032`, cut at this hop, in `Backlog`. Named, owned, and the reason this sits in `Backlog`. Nothing else is unresolved |
