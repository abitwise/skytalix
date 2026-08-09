---
id: ABC-009
title: legalMoves mutates the position it documents as unchanged
status: ready-for-uat
column: Ready for UAT
size: S
priority: P1
epic: EPIC-001
feature: —
---

# ABC-009 — legalMoves mutates the position it documents as unchanged

> **ESCALATED `P2` → `P1` and promoted `Backlog` → `Ready` on 2026-07-31 by BA/PM.**
> **This is a priority-directive escalation, NOT the escalation trigger written at the foot of this
> file.** That trigger has *not* fired: `ABC-010` has not been deferred or descoped, and no epic
> accepts a position from outside the rules core yet. Saying so plainly matters — a trigger that gets
> treated as fired when it has not is a trigger nobody trusts again.
>
> What escalates it is the project owner **Olger Oeselg**, 2026-07-31: *"The most important thing is
> that chess moves are legal according to game rules, everything else comes after that."* This defect
> is squarely in that class and not by analogy: with rights `KQ` set and no rook on h1,
> `legalMoves` **offers a `FLAG_CASTLE` move `4->6` that is not a legal chess move**, and taking it
> back writes a king onto a square that never held one. The query that *defines* which moves are
> legal returns an illegal move and corrupts the board while doing it.
>
> QE added one fact that sharpens the reachability half (`20260731T151500Z-qe-e2e-observation-36373ca4`,
> gap G-6): **`gameStatus` calls `legalMoves` on its first line**, so it inherits this defect in full —
> verified, one `gameStatus` call is enough to produce the phantom king — and `gameStatus` is the
> entry point `ABC-019`'s loop calls **every ply**. That makes it the highest-frequency route to this
> defect in the built product.
>
> **Not `P0`, and the line is worth stating.** `P0` on this board now means the owner's directive
> applies *and* the fault is reachable. This one still needs a semantically-invalid position, and no
> path in the product can produce one today. `ABC-020` — where a legal position reached by legal play
> produces a wrong result — is the `P0`. This lands under it, not beside it.
>
> **Nothing else about this ticket changed *at that escalation*.** Size stays `S`. The reproduction,
> the scope, the acceptance criteria and the `NFR-001` bar were untouched **by it**. `ABC-010` still
> removes this defect's only reachable trigger, and the two are still independent in either order.
>
> *(Amended 2026-08-09 so this line is not read as a claim about today. The scope, the acceptance
> criteria, the out-of-scope list, the `NFR-001` bar, the test notes and the dependencies **were**
> corrected later — 2026-08-09, at the `Ready → In Development` pull — because **seven** acceptance
> defects were found there. See the correction block under `## Acceptance`. The escalation of
> 2026-07-31 changed none of them, which is exactly what this line records; the priority, the size
> and the diagnosis are still what that escalation left.)*

## Problem

*User*: every downstream consumer of the rules core — the renderer (EPIC-002), the input
layer (EPIC-003), the search (EPIC-004), the session (EPIC-006) — all of which call
`legalMoves` against a position they still intend to use afterwards.

*Pain*: `src/legal.ts:37-41` documents `legalMoves` as a pure query — *"Plays each move on
the position in place and takes it back, so the position is unchanged on return."* On a
grammatical-but-semantically-invalid position it permanently and silently mutates its
argument. There is no error, no log, and no return-value signal. A caller that holds the
position across the call gets a board that is no longer the board it parsed.

*Value*: a documented invariant in the module every other epic sits on either holds or it is
not an invariant. A silent wrong answer from the rules core invalidates the whole game, and
this one is silent by construction.

**The coverage number did not catch it, and that is part of the ticket.** `src/legal.ts`
sits at 100% statement / branch / function coverage in the committed report, and this defect
shipped through that. Coverage measured that every line executed; nothing asserted that the
documented contract held. The fix must add a test that asserts the *contract*, not one that
adds lines to a number that is already 100%.

## Source

Architecture audit, task `architecture-audit-2026-07-29`:

- `20260729T145735Z-security-nfr-observation-abedec95` — §6 case 1 (the reproduction and the
  board-state trace), and `AR-3`, which recorded this as an accepted latent risk with owner
  Software Engineer.
- `20260729T150600Z-orchestrator-observation-7b2f91c4` — synthesis: "correctness defect found
  in merged, Done, 100%-covered code."

The audit's `AR-3` proposed folding this fix into the FEN-validation work (`RF-3`, now
ABC-010). It is cut as its own ticket instead: the two fixes live in different modules, are
independently testable, and either can ship without the other. `legalMoves`' contract should
not depend on a caller having validated its input — that assumption is exactly what failed
here.

## Reproduction (verified 2026-07-29, on `main`)

```
FEN            4k3/8/8/8/8/8/8/K7 w KQ - 0 1     white king on a1, rights KQ, no rooks
fresh parse    4k3/8/8/8/8/8/8/K7 w KQ - 0 1
legalMoves #1  5 moves
board after    4k3/8/8/8/8/8/8/K3K3 w KQ - 0 1   <- phantom second white king on e1
legalMoves #2  10 moves
legalMoves #3  10 moves                          <- not idempotent
```

The mechanism is visible one layer down: with rights `KQ` set, `generateMoves` offers the
castle `4->6` from e1 whether or not the king is on e1 and whether or not a rook is on h1.
`4k3/8/8/8/8/8/8/4K3 w K - 0 1` (king home, no h1 rook) returns 6 legal moves including a
`FLAG_CASTLE` move `4->6`. `makeMove` writes a king to the destination; `unmakeMove` writes
`move.piece` back to `from` — creating a king on a square that never held one.

A well-formed position is unaffected: kiwipete returns 48 moves twice and round-trips to a
byte-identical FEN across both calls.

### RE-DERIVED AND EXTENDED 2026-08-09 by BA/PM, against merged `main` at `aad6d48`

*Every figure below was produced by this role on its own throwaway probe, against a copy of `src/`
taken from merged `main`; none is quoted from a note. Re-derivation was owed rather than optional:
`git log -- src/legal.ts` shows it committed to **twice** since this ticket was written (`988f678`,
`2efe9ac`, both `ABC-011`), so a stale "today" column would make the acceptance unfalsifiable.
`git log -- src/moves.ts` shows the opposite and it is the more useful fact — **`addCastlingMoves` has
not been touched since `6805345` (`ABC-004`), the commit that introduced it**, so the generator side of
this defect is exactly as it shipped. Move counts and FEN comparisons are integer results and are
machine-independent; the machine was **Apple M3 (Mac15,13) / Node v24.12.0 / Darwin 25.5.0 arm64**.
The state comparison is **all 128 board bytes and all five scalars**, not `toFen` — see the
correction block under `## Acceptance`.*

**The reproduction above still holds exactly as written**: `4k3/8/8/8/8/8/8/K7 w KQ - 0 1` counts
**5, 10, 10** and one call leaves `4k3/8/8/8/8/8/8/K3K3 w KQ - 0 1`; the single changed byte is
`e1: EMPTY → white KING`. Both castles are offered in call 1 (`e1g1` **and** `e1c1`) with the king
on a1. `4k3/8/8/8/8/8/8/4K3 w K - 0 1` returns **6** moves including `FLAG_CASTLE e1g1`, and that
position is **byte-identical** across the call. Kiwipete returns **48, 48, 48**, byte-identical
throughout. `gameStatus` inherits it in full — one `gameStatus(4k3/8/8/8/8/8/8/K7 w KQ - 0 1)` call
returns `draw / insufficient-material` and leaves the phantom king behind.

**`addCastlingMoves` (`src/moves.ts:299-319`) tests three things and none of them is a piece:** the
right is held, `option.empty` is clear, and no square of `option.kingPath` is attacked. **The king's
home square and the rook's home square are never read.** The rook's square is not even in `empty`
(kingside `empty` is `[f1, g1]`; h1 is square 7). Three families follow, and **only the first was on
record before today**:

```
FAMILY 1 — the king is OFF its home square and the matching rook IS present.
           legalMoves offers the castle AND corrupts: a phantom king appears on the home square.

FEN                                gen  legal  FLAG_CASTLE  3 calls     after ONE legalMoves call
4k3/8/8/8/8/8/8/K6R w K - 0 1       17    17   e1g1         17,18,18    4k3/8/8/8/8/8/8/K3K2R w K - 0 1
4k3/8/8/8/8/8/8/R6K w Q - 0 1       17    17   e1c1         17,19,19    4k3/8/8/8/8/8/8/R3K2K w Q - 0 1
k6r/8/8/8/8/8/8/4K3 b k - 0 1       17    17   e8g8         17,18,18    k3k2r/8/8/8/8/8/8/4K3 b k - 0 1
r6k/8/8/8/8/8/8/4K3 b q - 0 1       17    17   e8c8         17,19,19    r3k2k/8/8/8/8/8/8/4K3 b q - 0 1
                                                                        (one byte: e1/e8 EMPTY -> KING)
```

```
FAMILY 2 — the king's home square holds a piece that is NOT the mover's king.
           legalMoves offers the castle AND DESTROYS that piece, replacing it with a king of the
           MOVING side. This is silent material loss on top of the phantom king, and NO note on
           this board recorded it for the castling route before today.

FEN                                gen  legal  3 calls     the byte that changes on e1 / e8
4k3/8/8/8/8/8/8/K3B2R w K - 0 1     20    20   20,18,18    own BISHOP(3)       -> white KING(6)
4k3/8/8/8/8/8/8/R3N2K w Q - 0 1     18    18   18,19,19    own KNIGHT(2)       -> white KING(6)
4k3/8/8/8/8/8/8/K3b2R w K - 0 1     14    14   14,18,18    ENEMY bishop(11)    -> white KING(6)
k3b2r/8/8/8/8/8/8/4K3 b k - 0 1     20    20   20,18,18    own bishop(11)      -> black KING(14)
```

```
FAMILY 3 — the rook's home square holds a piece that is NOT the mover's rook.
           legalMoves offers the castle and the position is BYTE-IDENTICAL across the call, so this
           family is INVISIBLE to every purity criterion this ticket has or could have. The
           make/unmake pair round-trips the impostor exactly; only the OFFER is wrong.

FEN                                gen  legal  FLAG_CASTLE  3 calls     state after the call
4k3/8/8/8/8/8/8/4K2B w K - 0 1      13    13   e1g1         13,13,13    PURE (128 bytes + 5 scalars)
4k3/8/8/8/8/8/8/N3K3 w Q - 0 1       8     8   e1c1         8,8,8       PURE
4k2b/8/8/8/8/8/8/4K3 b k - 0 1      13    13   e8g8         13,13,13    PURE
4k3/8/8/8/8/8/8/4K2b w K - 0 1       6     6   e1g1         6,6,6       PURE
```

**One shape was looked for and is NOT reachable, recorded so nobody adds a criterion for it.** A
**rook of the wrong colour** on the rook's home square is already refused today, and by the *right*
answer through the *wrong* rule: an enemy rook on h1 attacks f1 and g1 — which the castle requires to
be empty — so `option.kingPath` is attacked and the option is dropped by the through-check test.
`4k3/8/8/8/8/8/8/4K2r w K - 0 1` offers **no** castle today. The same holds queenside (an enemy rook
on a1 attacks c1 and d1). The colour dimension is therefore only reachable on the **king's** square
(family 2 row 3, an enemy bishop on e1) and via a **non-rook** impostor on the rook's square (family
3 row 4). Both are covered below; a "wrong-colour rook" row would be untestable theatre.

**The four legal castles still work and their exact counts are recorded, so any fix can be checked
for over-rejection at the same time:** `4k3/8/8/8/8/8/8/4K2R w K - 0 1` → **15** moves, 1 castle ·
`4k3/8/8/8/8/8/8/R3K3 w Q - 0 1` → **16**, 1 · `4k2r/8/8/8/8/8/8/4K3 b k - 0 1` → **15**, 1 ·
`r3k3/8/8/8/8/8/8/4K3 b q - 0 1` → **16**, 1.

## Scope

`legalMoves` honors the contract its own doc comment states, **on the castling route**, for every
position it accepts:

- The position is byte-identical on return — **all 128 board bytes** and all five scalars: side to
  move, castling rights, en-passant square, halfmove clock, fullmove number. **"The position" means
  the position, not `toFen` of it** — `toFen` reads 64 of the 128 bytes (see the correction block).
- Repeated calls return identical results.
- No castling move is offered when that castle's own board preconditions do not hold. There are
  **two, they are independent, and each is an IDENTITY test rather than an occupancy test**:
  - **the mover's own king stands on that castle's king-home square** — not merely *some* piece, and
    not a piece of either colour: the moving side's `KING` byte and no other;
  - **the mover's own rook stands on that castle's rook-home square** — the moving side's `ROOK` byte
    and no other.
- **"Offered" means offered by `generateMoves` AND by `legalMoves`.** Both are exported, both are
  named in this ticket's own reproduction, and the sibling `ABC-022` pins the same class at both
  layers (its `A1`/`A2`). Naming the layer is a requirement; **where the guard goes is still the
  engineer's call** and this ticket does not choose between `addCastlingMoves` and anywhere else.

The mechanism is the engineer's call. The observable contract above is the requirement.

## Out of scope

- **Rejecting the invalid FEN at the boundary** — that is `ABC-010`, deliberately separate.
  This ticket does not make the input legal; it makes the query honest about what it does.
- **The en-passant branch's missing preconditions — `ABC-022`, deliberately separate.** *(Added
  2026-08-09. `ABC-022` was cut 2026-08-04, after this list was written, and it names this seam
  one-directionally; this is the reciprocal fence.)* `## Scope` bullet 1 above is written broadly and
  `ABC-022`'s half (b) is the same symptom by the other route, so the boundary must be stated or an
  engineer either under-fixes bullet 1 or edits `ABC-022`'s fix site. **Measured 2026-08-09 with a
  correct castling fix in place: `4k3/8/8/8/8/8/1P6/4K3 w - a3 0 1` still writes a phantom black pawn
  onto a2 on one `legalMoves` call.** That row is `ABC-022`'s and stays `ABC-022`'s. Concretely: **no
  line of `addPawnMoves` (`src/moves.ts:172-197`) is changed by this ticket, and no `FLAG_EN_PASSANT`
  behaviour is changed by it.** Bullet 1 is therefore scoped to the castling route — hence the words
  *"on the castling route"* now in `## Scope`. Either ticket may ship first and neither closes the
  other.
- Pin-aware / incremental legality generation and the `legalMoves` throughput deficit — the
  audit's `RF-2`, an EPIC-004 decision. Do not take it here.
- King-square caching (`src/legal.ts:28` linear scan) — measured, not justified, explicitly
  left alone by the audit.
- Any change to `src/fen.ts`. *(Restated 2026-08-09 because the correction block below indicts
  `toFen` as a measuring instrument: the answer is to stop asserting through it in the TESTS, not to
  change it. `src/fen.ts` is correct at what it does — it serializes a FEN, and a FEN has no notation
  for an off-board byte.)*
- **`ABC-011`'s shipped guards in `src/legal.ts` (`hasLegalEnPassant`, lines 110-111).** They are not
  a workaround for this defect and do not become deletable when it lands — `hasLegalEnPassant`
  synthesises its own probe move and never calls `generateMoves`, so nothing this ticket does to the
  castling route touches it. *(Added 2026-08-09; the reasoning is `ABC-022`'s correction block, which
  measured it on a guard-deleted mutant. Recorded here so a reader of THIS ticket inherits it too.)*

## Acceptance (Given/When/Then)

Each criterion below was written as a **currently-failing** test that had to go green, except where
marked as a regression guard, and every *(Today: …)* parenthetical is the measured behaviour of the
**pre-fix tree** — merged `main` at `aad6d48`, whose `src/moves.ts` hashes
`fb4fa40934e768dffeaeed0b43548842`. **Read those parentheticals as the defect's record, not as a claim
about the current tree.** The fix is delivered on `grugops/ticket-to-pr-ABC-009` and **every criterion
`A1`–`A12` is green there**: `npm test` **371 passed (371) on 16 files**, skip count **0**, re-run on
the branch tip by BA/PM at the third hop, 2026-08-09. **Amended 2026-08-09 at the FOURTH BA/PM hop:
`A13` was added at that hop and is `⚠️ NOT YET SATISFIED BY THE SUITE`, so the sentence above now
reads over `A1`–`A12` only and is not a claim about the whole criteria set.** `A13` needs **no
production change** — the delivered code already answers every row it asks for — it needs **test rows
for two byte values** (enemy `KNIGHT`, enemy `PAWN`), and until they land the honest statement is
*twelve of thirteen criteria green*. *(Reframed 2026-08-09, third hop. The word
"today" was written before the fix existed and stops being true the moment this branch merges, while
each figure beside it is evidence a later reader will want — so the baseline is pinned to a named
commit and a hash instead. Only the framing changed: **no criterion, count, FEN or parenthetical below
was edited.**)*

**`A1`–`A6` were rewritten and `A4`–`A6`, `A10` added 2026-08-09** — see the first correction block
below. **`A1`, `A2`, `A3`, `A7`, `A8` and `A9` are, in that order, the six criteria this
ticket carried from 2026-07-29**, so the Orchestrator's routing note of 2026-08-09 (which speaks of
"criterion 3", "criteria 1 and 2", "criteria 4, 5, 6") reads onto `A3`, `A1`/`A2`, `A7`/`A8`/`A9`.
**Nothing was reordered and nothing was dropped.**

**`A11` and `A12` were added, and `A7`'s justification corrected, 2026-08-09 at a SECOND BA/PM hop**
after QE and Security/NFR routed two criterion gaps and one measured-inert criterion here — see the
**second** correction block, which follows the first. **`A11` was, until the fourth hop below, the one
criterion this ticket ever
carried unsatisfied, and it is now SATISFIED** — closed in tests at QE's second hop (14 new rows in
`src/moves.castling.hardening.test.ts`, **zero production lines**) and then **verified independently at
a THIRD BA/PM hop, 2026-08-09**, which is the only reason its `⚠️` marker came off. The retirement note
under `A11` carries that verification. **One NEW gap was measured at that hop; it is NAMED under `A11`
and deliberately NOT fixed there — it is not `A11`'s shortfall, no criterion was added for it at that
hop, and the routing was the Orchestrator's.**

**`A13` was added 2026-08-09 at a FOURTH BA/PM hop; it CLOSES that gap and ENDS the sample-class
sequence.** The Orchestrator authorised one further pass on a stated ground: the gap's space is
**finite and already fully measured**, so the criterion could stop being a list of sample classes and
become a **quantifier over the whole byte space**, with the unfalsifiable values named, measured and
excluded rather than silently omitted. **`A13` is the second criterion this ticket has carried
unsatisfied, and it is unsatisfied in TESTS ONLY** — two byte values need rows, zero production lines
are owed. **`A11` is NOT reopened by it and its verdict is untouched:** `A11` quantifies over the
mover's **own** piece types and is satisfied over that domain; `A13` quantifies over the **occupant
byte**, a strictly wider dimension that **subsumes** `A11`'s domain and maps, value by value, which
criterion already discharges which value. That mapping is why `A13` costs two values' worth of rows
instead of twelve.

- **`A1` (purity, the reproduction FEN).** **Given** the FEN `4k3/8/8/8/8/8/8/K7 w KQ - 0 1`,
  **when** `legalMoves` is called once on the parsed position, **then** `toFen(position)` afterwards
  equals that same FEN string byte-for-byte **and all 128 board bytes and all five scalars are
  unchanged**, **and** the call returns **exactly 3** moves, **exactly 0** of them carrying
  `FLAG_CASTLE`. *(Today: 5 moves, two of them `FLAG_CASTLE` — `e1g1` and `e1c1` — and
  `4k3/8/8/8/8/8/8/K3K3 w KQ - 0 1`, one changed byte: `e1` EMPTY → white KING.)*
- **`A2` (idempotence).** **Given** that same position, **when** `legalMoves` is called three times in
  succession, **then** all three calls return **exactly 3** moves. *(Today: 5, 10, 10. **The
  post-fix figure is 3, not 5** — the king on a1 has three moves and both of today's castles are
  phantom. `5` is a pre-fix number; see correction 7.)*
- **`A3` (the rook precondition).** **Given** the FEN `4k3/8/8/8/8/8/8/4K3 w K - 0 1` (king on e1,
  right `K`, no rook on h1), **when** `generateMoves` runs **and when** `legalMoves` runs, **then**
  the count of returned moves carrying `FLAG_CASTLE` is **exactly 0** in **both**, and `legalMoves`
  returns **exactly 5** moves. *(Today: 6 moves from each, including a `FLAG_CASTLE` move `e1g1`.
  This position is byte-identical across the call today, so it is a pure offer-side criterion and
  carries none of `A1`'s weight.)*
- **`A4` (the king precondition — both colours, both sides). ADDED 2026-08-09.** **Given** each of
  the four FENs in `## Reproduction` family 1 — `4k3/8/8/8/8/8/8/K6R w K - 0 1`,
  `4k3/8/8/8/8/8/8/R6K w Q - 0 1`, `k6r/8/8/8/8/8/8/4K3 b k - 0 1`,
  `r6k/8/8/8/8/8/8/4K3 b q - 0 1`, i.e. the king off its home square with the **matching rook
  present**, both colours and both sides — **when** `generateMoves` runs **and when** `legalMoves`
  runs, **then** the `FLAG_CASTLE` count is **exactly 0** in both, `legalMoves` returns **exactly
  16** moves on **every** row, and all 128 board bytes and all five scalars are unchanged across the
  call. *(Today: exactly 1 `FLAG_CASTLE` and 17 moves on every row, and one call writes a phantom
  king onto the vacant home square; three successive calls read 17, 18, 18 on the two kingside rows
  and 17, 19, 19 on the two queenside rows.)*
- **`A5` (the king precondition is an IDENTITY test — the home square is OCCUPIED by something
  else). ADDED 2026-08-09.** **Given** each of the four FENs in `## Reproduction` family 2 — an own
  **bishop** on e1 (`4k3/8/8/8/8/8/8/K3B2R w K - 0 1`), an own **knight** on e1 queenside
  (`4k3/8/8/8/8/8/8/R3N2K w Q - 0 1`), an **enemy** bishop on e1
  (`4k3/8/8/8/8/8/8/K3b2R w K - 0 1`) and an own bishop on e8 for black
  (`k3b2r/8/8/8/8/8/8/4K3 b k - 0 1`), i.e. **at least two piece types, both colours of occupant,
  and both colours to move** — **when** `generateMoves` runs **and when** `legalMoves` runs, **then**
  the `FLAG_CASTLE` count is **exactly 0** in both, `legalMoves` returns **exactly 19 / 17 / 13 / 19**
  moves respectively, and all 128 board bytes and all five scalars are unchanged. *(Today: exactly 1
  `FLAG_CASTLE` and 20 / 18 / 14 / 20 moves, and **one call destroys the occupant and writes a king
  of the moving side over it** — bishop→white king, knight→white king, **enemy** bishop→**white**
  king, black bishop→black king. Three successive calls read 20, 18, 18 · 18, 19, 19 · 14, 18, 18 ·
  20, 18, 18.)* **Amended 2026-08-09 (second hop): the four rows and their counts stand unchanged, but
  the two piece types they carry are a SAMPLE of a rule that quantifies over every own byte, and three
  builds that admit one further type pass this criterion. The quantified form is `A11`; this row is no
  longer the whole of the piece-type requirement.**
- **`A6` (the rook precondition is an IDENTITY test — and this family is invisible to every purity
  criterion). ADDED 2026-08-09.** **Given** each of the four FENs in `## Reproduction` family 3 — an
  own **bishop** on h1 (`4k3/8/8/8/8/8/8/4K2B w K - 0 1`), an own **knight** on a1 queenside
  (`4k3/8/8/8/8/8/8/N3K3 w Q - 0 1`), an own bishop on h8 for black
  (`4k2b/8/8/8/8/8/8/4K3 b k - 0 1`) and an **enemy** bishop on h1
  (`4k3/8/8/8/8/8/8/4K2b w K - 0 1`), **in every case with the king already on its home square** —
  **when** `generateMoves` runs **and when** `legalMoves` runs, **then** the `FLAG_CASTLE` count is
  **exactly 0** in both, and `legalMoves` returns **exactly 12 / 7 / 12 / 5** moves respectively.
  *(Today: exactly 1 `FLAG_CASTLE` and 13 / 8 / 13 / 6 moves — **and the position is byte-identical
  across the call on all four rows**, because the make/unmake pair round-trips the impostor exactly.
  Nothing about purity can see this family; only the `FLAG_CASTLE` count can. That is why it is a
  criterion and not a footnote.)* **Amended 2026-08-09 (second hop): same as `A5` — the rows and counts
  stand, the two piece types are a sample, and `A11` carries the quantified form.**
- **`A7` (a standing purity walk over LEGAL positions — must stay green, and must be present. **NOT a
  guard on this ticket's defect**; see the measured note below).** **Given** every
  position in the perft suite table (`src/perft.test.ts`), **when** `legalMoves` is called twice on
  each, **then** `toFen` **and all 128 board bytes and all five scalars** are identical before the
  first call, between the calls, and after the second, and both calls return equal move counts.
  *(Today: passes. It asserts count **equality**, not count **correctness** — measured 2026-08-09,
  this criterion passes unchanged on a build that never offers a castle at all, so it is **not** the
  over-rejection oracle. `A8` is.)*

  > **`A7`'s PROTECTIVE VALUE WAS MEASURED AT THE SECOND BA/PM HOP, 2026-08-09, AND IT IS ZERO FOR THIS
  > FIX. THE CRITERION IS KEPT; ITS STATED JUSTIFICATION WAS FALSE AND IS REPLACED.**
  >
  > **Measured, on two independent instruments.** QE's campaign: `A7` killed **0 of 62** mutants, while
  > perft took 29 kills and the four legal-castle control rows took 26. This role then re-derived it on
  > **10 mutants of its own** — the two guard deletions, four one-extra-type admissions, two
  > `continue`→`break` variants and two more — and **not one `A7` row failed on any of them**, including
  > the two mutants that break real behaviour badly (deleting the king guard fails 16 assertions,
  > deleting the rook guard 5; `A7` reports green through both).
  >
  > **The reason is structural, and it is why no rewording could rescue the old claim.** `A7`'s
  > population is the six perft positions — all **legally reachable**. `makeMove` only ever *clears* a
  > castling right, so in any reachable position a held right implies both pieces are home and **the two
  > guards this ticket added never fire there** (Security/NFR counted it: 198,175 executions each, **0
  > rejections, ever**). A criterion whose whole population never executes the branch under test cannot
  > discriminate any mutation of it.
  >
  > **The sentence that has to go, because it was never true.** `## Test notes` 2 called this *"the guard
  > that would have caught the defect originally"*. It would not have. The original defect also needed a
  > semantically-invalid position, which is exactly what `A7`'s population excludes — and the proof was
  > already on this board, unread: the Engineer's red-before-green run recorded **10 of 33 new tests
  > passing on the UNFIXED tree, and those 10 are the four legal-castle controls plus the six `A7` rows**.
  > `A7` was green on the broken code. That is the claim falsified by this project's own measurement.
  >
  > **Why it is KEPT anyway, and this is a different argument from the one being retired.** It is the
  > only purity walk over legal positions anywhere in the suite; it was **absent, not failing**, before
  > this ticket, so writing it was real work; it costs six assertions and no runtime worth naming; and it
  > guards a different class from this ticket's — a future change in generation that mutates a *legal*
  > position, which is `ABC-022`'s shape and whatever `EPIC-004` does to the hot path. Deleting a green
  > guard because it did not catch a defect it was never positioned to see is the reasoning that removes
  > a smoke alarm from the hallway because the fire was in the garage.
  >
  > **What must never happen again:** citing `A7`'s green as evidence about this fix. It is evidence about
  > legal positions only. **This is the second time this project shipped a criterion whose protective
  > value was assumed rather than measured** — the first is named in `## Problem`, the 100% coverage
  > number on `src/legal.ts` that this defect shipped straight through. Same error, different instrument:
  > a green signal was read as protection without anyone asking what it could fail on.
- **`A8` (the full suite — and the over-rejection oracle).** **Given** the full test suite, **when**
  it runs after the fix, **then** it is green with a **skip count of 0** and **no existing test is
  modified** to accommodate the change — **verified at line level, not by inspection**. *(This is
  where over-rejection dies, and it was measured rather than assumed: `src/perft.test.ts`'s default
  fast lane asserts exact node counts, and suppressing **any one** of the four castling rights turns
  it red at kiwipete — `WK` 48→47, `WQ` 48→47, `BK` at depth 2 2039→1993, `BQ` at depth 2
  2039→1994. `A7` catches none of those.)*
- **`A9` (the standing oracle).** **Given** `PERFT_DEEP=1`, **when** the deep perft lane runs, **then**
  all **32/32** cases still match their published node counts exactly — zero tolerance.
- **`A10`. ADDED 2026-08-09.** **Given** the bar in `## Security / NFR triggers`, **when** measured,
  **then** it holds. *(Named as a criterion, not left as prose, so the ratio in that section is part
  of the acceptance the way it is on `ABC-022`.)*
- **`A11` (the impostor's piece type is QUANTIFIED, not sampled). ADDED 2026-08-09 (second hop).
  SATISFIED BY THE SUITE — the `⚠️ NOT YET SATISFIED` marker was retired 2026-08-09 at the third
  BA/PM hop, on that hop's own instruments; the retirement note below carries the measurement.**
  **Given** the king's home
  square occupied by **each** of the mover's own non-`KING` piece types — `QUEEN`, `ROOK`, `BISHOP`,
  `KNIGHT`, `PAWN` — with the matching rook present, **and given** the rook's home square occupied by
  **each** of the mover's own non-`ROOK` types — `QUEEN`, `BISHOP`, `KNIGHT`, `PAWN` — with the king
  already on its home square, **when** `generateMoves` runs **and when** `legalMoves` runs, **then**
  the `FLAG_CASTLE` count is **exactly 0** in **both** on **every** row, and on the king's-square rows
  all 128 board bytes and all five scalars are unchanged across the call. **The enumeration must be
  exhaustive over piece type: a sample of two, or of three, does not satisfy this criterion**, and both
  colours to move and both castling sides must appear across the table.

  *Measured on the delivered tree 2026-08-09 by BA/PM — the code already satisfies every row, so this
  criterion asks for no behaviour change at all:*

  ```
  KING's home square, matching rook present   legalMoves  castles gen/legal  state
  own QUEEN    4k3/8/8/8/8/8/8/K3Q2R w K - 0 1     31          0 / 0         pure
  own ROOK     4k3/8/8/8/8/8/8/K3R2R w K - 0 1     24          0 / 0         pure
  own BISHOP   4k3/8/8/8/8/8/8/K3B2R w K - 0 1     19          0 / 0         pure   (= A5 row 1)
  own KNIGHT   4k3/8/8/8/8/8/8/K3N2R w K - 0 1     16          0 / 0         pure
  own PAWN     4k3/8/8/8/8/8/8/K3P2R w K - 0 1     13          0 / 0         pure

  ROOK's home square, king already home
  own QUEEN    4k3/8/8/8/8/8/8/4K2Q w K - 0 1      21          0 / 0
  own BISHOP   4k3/8/8/8/8/8/8/4K2B w K - 0 1      12          0 / 0         (= A6 row 1)
  own KNIGHT   4k3/8/8/8/8/8/8/4K2N w K - 0 1       7          0 / 0
  own PAWN     4k3/8/8/8/8/8/8/4K2P w K - 0 1       6          0 / 0
  ```

  **`parseFen` accepts every one of those FENs** — checked by running it, not assumed; it asserts one
  king of each colour and performs no rights/board consistency check, so a pawn on the first rank is
  accepted (that is `ABC-010`'s boundary, not this ticket's).

  **One shape is excluded and the exclusion holds:** the mover's own `KING` on the **rook's** home
  square is not constructible — with the king also home it needs two kings of one colour and
  `parseFen` refuses it (*re-measured at the third BA/PM hop on all three constructions:* `4K2K w K`,
  `K3K3 w K` and `4k2k b k` each raise *"position must have exactly one white/black king, found 2"*),
  and with the king elsewhere the king guard already refuses. A row for it would be unfalsifiable.

  **The SECOND exclusion this criterion carried — *"an enemy-colour occupant of either square is
  unreachable, masked by the pre-existing through-check test"* — was MEASURED AT THE THIRD BA/PM HOP
  AND IS FALSE FOR TWO PIECE TYPES.** It is corrected here rather than softened, because as written it
  instructed the next reader **not** to add the four rows that are missing. `A11`'s own scope is
  unchanged and unaffected: it quantifies over the mover's **own** types, and it is satisfied. See the
  retirement note below for the measured map and the named gap.

  **The gap that correction named is now CARRIED BY `A13`, added 2026-08-09 at the fourth BA/PM hop**
  — as a quantifier over all twelve wrong byte values per home square rather than as four more sample
  rows, with the behaviour-equivalent enemy `KING`/`QUEEN`/`ROOK` named, measured on two independent
  instruments, and excluded with its reason. **`A11` keeps its own domain, its own rows and its own
  MET verdict; nothing under this criterion is reopened, and no row of it is owed.** Read `A13` for
  the value-by-value accounting that shows `A11` discharges nine of the twenty-four wrong values
  across the two squares.

  > **`A11`'s `⚠️ NOT YET SATISFIED` MARKER RETIRED 2026-08-09 AT THE THIRD BA/PM HOP, ON THIS ROLE'S
  > OWN INSTRUMENTS. `A11` IS MET. ONE NEW GAP WAS MEASURED IN THE PROCESS AND IS NAMED BELOW, NOT
  > FIXED.**
  >
  > QE closed `A11` in tests (19 → 34 hardening tests, 14 rows new, **zero production lines**) and
  > deliberately left this marker byte-identical, routing it here: **the failure that hop repaired is a
  > role certifying its own sample as a dimension, so the role that wrote the rows does not also stamp
  > the criterion satisfied.** The Orchestrator declined it too, on a limit it had written itself. This
  > note is that independent check. **Nothing below is taken from QE's table or the Orchestrator's** —
  > the mutant set was derived from `A11`'s own text (every own non-`KING` type on the king's home
  > square, every own non-`ROOK` type on the rook's), not from anyone's published rows.
  >
  > **Instrument.** A copy of `src/` outside the repository, `node_modules` symlinked. Every mutant
  > asserts its anchor **unique** in the pristine source and its bytes **changed** (otherwise
  > `HARNESS-ERROR`, never `SURVIVED`), typechecks with `tsc --noEmit` so a broken build can never be
  > scored a survivor, and restores `src/moves.ts` to md5 `0e247853ab2c05887c76105ff83d8621` after.
  > **No file under `src/` in this repository was modified at any point.**
  >
  > **1. Discrimination — 17 mutants, 12 killed, 4 survived, 0 verdict mismatches, 0 broken builds.**
  > All **nine** single own-type admissions die, and the three that previously passed the ENTIRE net die
  > to `A11`'s rows **alone** (acceptance 33/33, hardening 32/34 — two rows each):
  >
  > ```
  > own type admitted on the KING's home square    acceptance  hardening  suite    killed by
  > QUEEN                                            33/33       30/34    367/371  A11 rows
  > ROOK          <- passed the whole net before      33/33       32/34    369/371  A11 rows
  > BISHOP                                           29/33       32/34    365/371  A11 + A5
  > KNIGHT                                           31/33       32/34    367/371  A11 + A5
  > PAWN          <- passed the whole net before      33/33       32/34    369/371  A11 rows
  > own type admitted on the ROOK's home square
  > QUEEN                                            33/33       30/34    367/371  A11 rows
  > BISHOP                                           31/33       30/34    365/371  A11 + A6 + A12
  > KNIGHT                                           32/33       32/34    368/371  A11 + A6
  > PAWN          <- passed the whole net before      33/33       32/34    369/371  A11 rows
  > admission made CONDITIONAL on colour / on side   33/33       33/34    370/371  A11 rows
  >                                                  32/33       33/34    369/371  A11 + A6
  > MUST SURVIVE — colour-blind king / rook / both, and king guard `continue`->`break`
  >                                                  33/33       34/34    371/371  survived, all four
  > ```
  >
  > The four survivors matter as much as the twelve kills: **`A11`'s rows kill zero behaviour-equivalent
  > mutants**, so they pin observable behaviour rather than the shape of the implementation.
  >
  > **2. Exhaustiveness — checked on this role's own domain probe, not on the suite's.** `parseFen`'s
  > piece-type domain, probed over 26 letters × 2 cases × 4 probe boards, is exactly six types. The
  > king's-square table covers all **five** non-`KING` types and the rook's-square table all **four**
  > non-`KING`/non-`ROOK` types — **nothing missing, nothing extra**. All **22** rows were re-derived
  > independently of the suite's own `expectImpostorSetup`: **0 rows whose label lies about its FEN**, 0
  > rows where the other precondition fails, 0 rows holding the wrong right. Each table carries all four
  > rights (`K`/`Q`/`k`/`q`), both sides to move, and **every type in at least two configurations**.
  >
  > **3. The quantifier FIRES — falsified rather than trusted.** Three deliberate corruptions of the
  > suite file in the scratch copy, production code pristine: dropping **both** own-`PAWN` rows from the
  > rook's-square table → RED *"expected [2,3,5] to deeply equal [1,2,3,5]"*; dropping **one** → RED
  > *"PAWN needs a second configuration"*; **relabelling** the h1 knight row as `PAWN` → RED *"the
  > impostor must stand on the square under test"*. **A shrunken enumeration cannot pass.** That is what
  > separates this from a fourth sample.
  >
  > **4. Every kill is a real defect, measured one FRESH PROCESS PER TREE.** On the king's square each
  > admission **destroys the occupant and writes a king over it** (`K3R2R w K` byte `4: 4->6`,
  > `K3P2R w K` byte `4: 1->6`); on the rook's square the position is **byte-identical** and the illegal
  > `FLAG_CASTLE` offer is the only witness, which is `A6`'s structural rationale confirmed on more
  > types. **Both measurement traps this ticket has recorded were discharged, not avoided by luck:** one
  > OS process per tree state (this role's first harm probe, at the second hop, ran four trees in one
  > process and Node's module cache served pristine `moves.ts` to all four — the tell was identical
  > output across trees, and the output above differs per tree), and **the instrument verified before a
  > red is believed** — this hop's first three equivalence controls did **not compile** under
  > `noUncheckedIndexedAccess` (`pieceType(board[i])` on `number | undefined`) and the harness scored
  > them `BROKEN-BUILD` rather than reporting three dead controls. Rebuilt with `?? EMPTY`, all three
  > survive 371/371. That is the third instance on this ticket of *a red from an unverified instrument
  > is not a finding*.
  >
  > **5. THE NEW GAP, NAMED AND NOT ACTED ON — the fourth class QE told this board to expect.** Testing
  > `A11`'s **enemy-colour exclusion** instead of inheriting it: all six enemy types on both home
  > squares, twelve mutants, each classified by measurement rather than by geometry.
  >
  > ```
  > enemy occupant admitted   verdict          suite     what refuses it in the delivered code
  > king's sq  KING/QUEEN/ROOK  SURVIVED,equiv  371/371  the through-check test — genuinely masked
  > king's sq  BISHOP           KILLED          369/371  `A5` row 3, the enemy-bishop row
  > king's sq  KNIGHT           SURVIVED + HARM 371/371  the identity guard ALONE — nothing covers it
  > king's sq  PAWN             SURVIVED + HARM 371/371  the identity guard ALONE — nothing covers it
  > rook's sq  KING/QUEEN/ROOK  SURVIVED,equiv  371/371  the through-check test — genuinely masked
  > rook's sq  BISHOP           KILLED          370/371  `A6` row 4, the enemy-bishop row
  > rook's sq  KNIGHT           SURVIVED + HARM 371/371  the identity guard ALONE — nothing covers it
  > rook's sq  PAWN             SURVIVED + HARM 371/371  the identity guard ALONE — nothing covers it
  >
  > 4k3/8/8/8/8/8/8/K3n2R w K - 0 1   delivered 13 / 0 castles / pure
  >                                   mutant    14 / 1 castle / byte 4: 10 -> 6
  >                                   -> 4k3/8/8/8/8/8/8/K3K2R w K - 0 1: the BLACK knight is gone and
  >                                      white has a second king. Enemy material destroyed, colour flipped.
  > 4k3/8/8/8/8/8/8/4K2n w K - 0 1    delivered  4 / 0 / pure    mutant 5 / 1 / byte-identical
  > ```
  >
  > **Why the old claim was wrong, stated precisely so the correction is auditable.** An enemy `KING`,
  > `QUEEN` or `ROOK` on a home square really is masked — it attacks the king's path, and the
  > through-check test drops the option, which is also exactly why the **colour-blind** mutants are
  > behaviour-equivalent (colour-blindness widens the king's square only to an enemy `KING` and the
  > rook's only to an enemy `ROOK`). The 9,604- and 12,584-position enumerations were sound **for what
  > they tested**; the blanket generalisation to *every* enemy occupant is what does not hold. An enemy
  > `KNIGHT` or `PAWN` on `e1`/`h1`/`a1` attacks **none** of `e1`, `f1`, `g1`, is not in the `empty`
  > set, and leaves the king out of check — so the identity guard is its only guard and no row in this
  > suite exercises it. **The ticket's own criteria already contradicted the claim and nobody read it
  > that way:** `A5` row 3 and `A6` row 4 are enemy-bishop rows, and they are the rows that kill the two
  > enemy-`BISHOP` mutants. If enemy occupants were masked, those two rows would be inert.
  >
  > **This is NOT `A11`'s shortfall and it does not reopen it.** `A11` says *"the mover's own"* and is
  > exhaustive over that domain; the suite satisfies it. The gap is a fourth **dimension** — the
  > occupant's COLOUR — with the same shape as the three before it: closed on one axis, resting on a
  > blanket claim on the other. **No criterion was added here** (that would be a fourth hop's work
  > opened inside a verification hop) and **no row was written**. The progression is now engineer 5
  > mutants → QE 62 → BA/PM 10 → QE 20 → BA/PM 17 + 12, each hop finding what its predecessor missed,
  > and this one is no more the last than any before it. **The routing is the Orchestrator's:** four
  > rows in QE's existing table would close it, on the same measured shape as `A11` (zero production
  > lines — the delivered code refuses all four FENs today), and whether that happens on this ticket, on
  > a follow-up, or is accepted as a named risk is a decision this role does not own.
  >
  > **AMENDED 2026-08-09 AT THE FOURTH BA/PM HOP — the paragraph above is left exactly as written,
  > because it was true when written, and one sentence in it is now FALSIFIED and worth keeping for
  > that reason.** *"this one is no more the last than any before it"* was the honest expectation from
  > four consecutive hops of sample classes, and it is **wrong** — not because a fifth sample was not
  > found, but because the space it would live in was never counted. Counting it ends the sequence:
  > a home square holds **one byte**, `parseFen` can put **13** values in it, **1** is correct, so
  > **12 wrong values is the whole space**, and all twelve are now measured. The gap named above is
  > carried by **`A13`** as that quantifier. **The routing did go to the Orchestrator, which authorised
  > exactly one further pass and wrote down the stopping rule**; the four rows this note estimated are
  > **eight** at `A11`'s own doubling, which is the same correction `A11`'s own estimate took
  > (*"roughly nine"* came in at fourteen).

- **`A12` (a side holding BOTH rights: the invalid castle is refused and the VALID one SURVIVES).
  ADDED 2026-08-09 (second hop). Already satisfied by the suite.** **Given** a position in which one
  side holds **both** of its castling rights while **exactly one** of the two castles is invalid on the
  board, **when** `generateMoves` runs **and when** `legalMoves` runs, **then** the valid castle is
  **still offered in both, asserted BY NAME** — `e1g1` / `e1c1` / `e8g8` / `e8c8`, never by count alone
  — the invalid one is absent, the total `legalMoves` count is exact, and the position is unchanged.
  **At least one row must place the INVALID option EARLIER in generation order than the valid one**
  (kingside precedes queenside in both `WHITE_CASTLES` and `BLACK_CASTLES`), and a row with **both**
  castles valid is required beside it as the over-rejection control.

  *Measured on the delivered tree 2026-08-09 by BA/PM:*

  ```
  4k3/8/8/8/8/8/8/R3K3 w KQ - 0 1    16 moves, exactly [e1c1]   h1 empty -> K bogus, a1 rook -> Q legal
  4k3/8/8/8/8/8/8/4K2R w KQ - 0 1    15 moves, exactly [e1g1]   a1 empty -> Q bogus, h1 rook -> K legal
  4k3/8/8/8/8/8/8/R3K2B w KQ - 0 1   23 moves, exactly [e1c1]   h1 holds an own BISHOP
  4k3/8/8/8/8/8/8/B3K2R w KQ - 0 1   22 moves, exactly [e1g1]   a1 holds an own BISHOP
  r3k3/8/8/8/8/8/8/4K3 b kq - 0 1    16 moves, exactly [e8c8]   black mirror
  4k2r/8/8/8/8/8/8/4K3 b kq - 0 1    15 moves, exactly [e8g8]   black mirror
  control  4k3/8/8/8/8/8/8/R3K2R w KQ - 0 1   26 moves, BOTH offered [e1g1, e1c1]
  control  r3k2r/8/8/8/8/8/8/4K3 b kq - 0 1   26 moves, BOTH offered [e8g8, e8c8]
  ```

  **Why the ordering clause is load-bearing and not pedantry — measured, because half the table is inert
  without it.** Turning the **rook** guard's `continue` into a `break` deletes a legal castle only when
  the loop meets the invalid option first: on `R3K3 w KQ` (kingside bogus, reached first) it reads
  **15 moves / 0 castles** against the correct 16 / 1, while on `4K2R w KQ` (queenside bogus, reached
  second) it is **indistinguishable from correct**. Of the six rows above, exactly **three** go red on
  that mutant. A criterion that said only *"one right valid, one bogus"* could be satisfied entirely by
  the three inert rows — which is the same sampled-where-the-rule-quantifies defect as `A11`, one level
  down. **Deliberately NOT pinned, with the measurement:** the identical mutation on the **king** guard
  is behaviour-equivalent, because both of a side's options share `kingFrom` (`e1` for `K` and `Q`), and
  it passes all 33 acceptance and all 19 hardening rows. One token, two opposite verdicts; a criterion
  that tried to catch the equivalent one would be unfalsifiable.

- **`A13` (the occupant of a home square is quantified over the WHOLE BYTE SPACE, not sampled one
  class at a time). ADDED 2026-08-09 (fourth BA/PM hop).
  ⚠️ NOT YET SATISFIED BY THE SUITE — the enemy `KNIGHT` and enemy `PAWN` rows are owed; every other
  value in the space is already discharged and the discharge is mapped, value by value, below.**
  **Given** a castling option whose right is held, **when** `generateMoves` runs **and when**
  `legalMoves` runs, **then** the option is offered **only if** the king's home square holds the
  mover's own `KING` **and** that option's rook home square holds the mover's own `ROOK` — so for
  **every** other value either home square can hold, the `FLAG_CASTLE` count is **exactly 0** in
  **both**, and on the rows where the king's home square is the one under test all 128 board bytes
  and all five scalars are unchanged across the call. **The enumeration is over the byte, not over a
  class of pieces:** a home square holds exactly **one byte**, `parseFen` can put exactly **13**
  distinct values in it, **1** of those is the required piece, so **12 wrong values per square is the
  entire space** and each of the twelve must be accounted for by name. Both colours to move and all
  four castling rights must appear across the table.

  **THIS IS THE CRITERION THAT ENDS THE SAMPLE-CLASS SEQUENCE, AND THE ARGUMENT IS WRITTEN OUT SO A
  LATER READER CAN CHECK IT RATHER THAN INHERIT IT.** Four consecutive hops each found one more
  *sample* class — `A5`/`A6` sampled two piece types, `A11` quantified over the mover's own types and
  left the occupant's colour on a blanket claim, and that claim was measurably false for two types.
  Each hop's fix was one more sample, so each hop predicted a fifth. **There cannot be a fifth,
  because the space is finite and every value in it is now measured:** 13 values, 1 correct, 12
  wrong, and each of the twelve falls in **exactly one** of six buckets — covered by an absence row,
  covered by `A11`'s own-type quantifier, covered by an existing enemy row, **newly required here**,
  measured-behaviour-equivalent-and-excluded, or not constructible by `parseFen` at all. The buckets
  are disjoint and they sum to 12 on each square. That is a structural end, not a hope.

  *The full accounting, measured on the delivered tree 2026-08-09 by BA/PM. Byte values are the
  `src/position.ts` encoding — type `0..6` in the low three bits, `BLACK = 8` — and every row's
  `legalMoves` count and `FLAG_CASTLE` count is measured, not derived:*

  ```
  KING's home square (king NOT home, matching rook present) — required byte: own KING
  byte  occupant       bucket                                     delivered  castles
    0   EMPTY          absence row — A4                              16        0     (= A4's 16)
    1   own PAWN       A11 own-type quantifier                       13        0
    2   own KNIGHT     A11 own-type quantifier                       16        0
    3   own BISHOP     A11 own-type quantifier (= A5 row 1)          19        0
    4   own ROOK       A11 own-type quantifier                       24        0
    5   own QUEEN      A11 own-type quantifier                       31        0
    6   own KING       *** THE REQUIRED VALUE — castle IS offered    15        1
    9   enemy PAWN     >>> NEWLY REQUIRED BY A13 <<<                 13        0
   10   enemy KNIGHT   >>> NEWLY REQUIRED BY A13 <<<                 13        0
   11   enemy BISHOP   existing enemy row — A5 row 3                 13        0
   12   enemy ROOK     equivalent, EXCLUDED (masks e1,f1,g1)          3        0
   13   enemy QUEEN    equivalent, EXCLUDED (masks e1,f1,g1)          3        0
   14   enemy KING     equivalent, EXCLUDED (masks f1)               13        0
                                    1 + 5 + 2 + 1 + 3 = 12 wrong values, all accounted

  ROOK's home square (king ALREADY home) — required byte: own ROOK
  byte  occupant       bucket                                     delivered  castles
    0   EMPTY          absence row — A3                               5        0     (= A3's 5)
    1   own PAWN       A11 own-type quantifier                        6        0
    2   own KNIGHT     A11 own-type quantifier                        7        0
    3   own BISHOP     A11 own-type quantifier (= A6 row 1)          12        0
    4   own ROOK       *** THE REQUIRED VALUE — castle IS offered    15        1
    5   own QUEEN      A11 own-type quantifier                       21        0
    6   own KING       NOT CONSTRUCTIBLE — parseFen refuses          n/a      n/a
    9   enemy PAWN     >>> NEWLY REQUIRED BY A13 <<<                  5        0
   10   enemy KNIGHT   >>> NEWLY REQUIRED BY A13 <<<                  4        0
   11   enemy BISHOP   existing enemy row — A6 row 4                  5        0
   12   enemy ROOK     equivalent, EXCLUDED (masks e1,f1,g1)          3        0
   13   enemy QUEEN    equivalent, EXCLUDED (masks e1,f1,g1)          3        0
   14   enemy KING     equivalent, EXCLUDED (masks g1)                5        0
                                1 + 4 + 1 + 2 + 1 + 3 = 12 wrong values, all accounted
  ```

  **THE 13 IS MEASURED, NOT ASSERTED — and the first instrument that measured it was WRONG.** A
  probe over every code point `0x00`–`0x2FF` as a placement character, on `e1`, `h1` and `a1`,
  returns **exactly 13** distinct byte values per square — `0`, `1`–`6`, `9`–`14` — the **same 13 on
  all three squares**, each with a named witness character (`"P"`, `"n"`, `<empty>`, …). The **first**
  version of that probe returned **11**, because its single probe board already held a white king, so
  `K` on `e1` raised *"position must have exactly one white king, found 2"* — **a limit of the probe
  board reported as a fact about the domain.** Three king configurations per square fixed it. Recorded
  because a quantifier justified by an under-counting probe is worse than an honest sample.

  **The two EXCLUSIONS, each named, measured, and given its reason. Neither is silently omitted —
  silent omission of exactly this kind produced four consecutive misses on this ticket.**

  1. **Behaviour-equivalent, therefore unfalsifiable: enemy `KING`, `QUEEN`, `ROOK` on either home
     square (3 of the 12, both squares).** Admitting one changes **no observable behaviour**, because
     the pre-existing through-check test already refuses the option: each of those three attacks a
     square on the king's path. **Measured on TWO independent instruments that agree 12/12.** (a) By
     mutation at the third BA/PM hop: all six survive **371/371** with no behaviour change. (b) By
     asking the masking predicate `isSquareAttackedBy` directly at the fourth hop, over all six enemy
     types on both squares — `MASKED` for exactly `KING`/`QUEEN`/`ROOK` and `not masked` for exactly
     `BISHOP`/`KNIGHT`/`PAWN`, in precise agreement with the mutation verdicts. That second instrument
     was **polarity-checked before its verdicts were read** (a black rook on h1 must report g1
     attacked, and a position with no black attacker must report it not attacked; a predicate that
     answered one way for everything would fabricate a clean result). **A required row here could never
     fail**, so it would be theatre — the same shape as the guard-ordering exclusion under `A12` and
     the same reason. **It is named and measured, not omitted.**
  2. **Not constructible: the mover's own `KING` on the ROOK's home square (1 of the 12, that square
     only).** It needs two kings of one colour, and `parseFen` refuses — **re-measured on all four
     constructions**, both colours and both sides: `4k3/…/4K2K w K`, `4k3/…/K3K3 w Q`,
     `4k2k/…/4K3 b k`, `k3k3/…/4K3 b q` each raise *"position must have exactly one white/black king,
     found 2"*. `A11` already carried this exclusion for its own domain and it is unchanged; it is
     restated here only because the byte accounting must have a slot for it. **Note that the exclusion
     is conditional on the criterion's other precondition** — a lone own `KING` on `h1` with `e1`
     **empty** parses fine, but that is `A4`'s shape (the king off its home square), not this one.
     **My own accounting probe drifted onto exactly that FEN and reported this value "constructible"
     until the printed FEN gave it away.**

  **What is NEWLY REQUIRED, and it is the whole of what this criterion adds: enemy `KNIGHT` and enemy
  `PAWN`, on both home squares.** They are refused by the **identity guard alone** — an enemy knight
  or pawn on `e1`/`h1`/`a1` attacks **none** of `e1`, `f1`, `g1`, is not in the `empty` set, and leaves
  the king out of check — and **no row in this suite exercises that**. A mutant admitting an enemy
  knight **compiles and survives 371/371** while `legalMoves` on
  `4k3/8/8/8/8/8/8/K3n2R w K - 0 1` returns 14 moves and leaves
  `4k3/8/8/8/8/8/8/K3K2R w K - 0 1` — **the black knight destroyed and a WHITE king written over
  it**, material loss *and* a colour change, strictly worse than the own-colour family this ticket was
  widened for. Verified independently by the Orchestrator before this criterion was authorised.

  *At `A11`'s established doubling — every type in at least two configurations, both sides to move,
  all four rights — the region is eight configurations. Measured on the delivered tree 2026-08-09 by
  BA/PM, with each row's setup ASSERTED rather than trusted from its label (0 of 8 labels lie about
  their own FEN) and each row checked NOT INERT (0 of 8 are masked or blocked, so the identity guard
  is the only thing refusing each one):*

  ```
  KING's home square — king off home, matching rook present, ENEMY occupant
  enemy KNIGHT  W K   4k3/8/8/8/8/8/8/K3n2R w K - 0 1          13   0 / 0   pure
  enemy PAWN    W Q   4k3/8/8/8/8/8/8/R3p2K w Q - 0 1          14   0 / 0   pure
  enemy KNIGHT  B k   4N2r/8/8/5k2/8/8/8/4K3 b k - 0 1         17   0 / 0   pure
  enemy PAWN    B q   r3P3/8/8/5k2/8/8/8/4K3 b q - 0 1         19   0 / 0   pure

  ROOK's home square — king already home, ENEMY occupant
  enemy KNIGHT  W K   4k3/8/8/8/8/8/8/4K2n w K - 0 1            4   0 / 0
  enemy PAWN    W Q   4k3/8/8/8/8/8/8/p3K3 w Q - 0 1            5   0 / 0
  enemy KNIGHT  B k   4k2N/8/8/8/8/8/8/4K3 b k - 0 1            4   0 / 0
  enemy PAWN    B q   P3k3/8/8/8/8/8/8/4K3 b q - 0 1            5   0 / 0
  ```

  **The delivered code already answers every one of those rows correctly, so this criterion asks for
  ZERO production lines** — exactly as `A11` did. `src/moves.ts` has been byte-identical at md5
  `0e247853ab2c05887c76105ff83d8621` since the Engineer's first commit, across four verification hops.
  **This is a test-net gap, not a defect.**

  **A WARNING FOR THE ROWS, MEASURED HERE BECAUSE THE COUNT ALONE CANNOT CARRY THEM.** On the king's
  home square, enemy `BISHOP`, enemy `KNIGHT` and enemy `PAWN` **all answer 13 moves**; on the rook's
  home square, enemy `PAWN`, enemy `BISHOP` **and the empty square** all answer **5**. So a row that
  asserts only its count is **interchangeable with rows for two other values** and a mislabelled row
  would pass. The rows must assert the occupant byte on the square under test — which QE's existing
  `expectImpostorSetup` already does, and which is why it must not be skipped for these four values.

  **What `A13` does NOT claim, stated because the opposite reading would be this ticket's signature
  error for the fifth time.** It exhausts **one dimension** — the occupant byte of one home square,
  under that square's own precondition. It does **not** establish that the criteria set is complete.
  Three regions sit outside it, named rather than left silent: **(i)** the 243 byte values a
  `Uint8Array` square can physically hold that `parseFen` **never writes** (`7`, `8`, `15` and
  everything `≥ 16`; measured by the same probe) — no FEN produces them, so no `Given` clause in this
  ticket's language can reach them, and a criterion over them would be unfalsifiable for the same
  reason as exclusion 1; **(ii)** the **joint** space, which pairs of values co-occur across the two
  squares — 169 combinations per option, not enumerated; for the **delivered** code the joint adds
  nothing, because `addCastlingMoves` tests the two squares with two **independent** byte compares
  (`src/moves.ts:326-327`) so per-square correctness implies joint correctness by construction, but a
  mutant conditional on a *pair* could still survive a finite net; **(iii)** the constants no
  criterion on this ticket varies — every criterion FEN puts the non-moving king on `e8`/`a8` and
  carries an empty en-passant square with `halfmoveClock` 0, and the `empty`-set squares (`f1`/`g1`,
  `b1`/`c1`/`d1`) are a different dimension guarded by the pre-existing emptiness test. **Under the
  stopping rule recorded for this ticket, (ii) and (iii) belong to a follow-up hardening ticket for
  `src/moves.ts`, not to another `ABC-009` hop** — `## Scope` is three bullets about castling
  preconditions, and an unbounded mutation net is not in it.

> ### CORRECTED IN PLACE 2026-08-09 by BA/PM (task `ticket-to-pr-ABC-009`, subtask `bapm-abc009-acceptance`, Workflow 07)
>
> **Seven acceptance defects were fixed at the `Ready → In Development` pull, in place, inside
> `Ready`.** This ticket's own `## Definition of Ready` block ticked *acceptance measurable* ✅ on
> 2026-07-31 and nothing re-checked it until today; the Orchestrator's pre-check left the row
> **amber** with four named specifics. **The row is a FAIL, not an amber** — it is met only after the
> corrections below. **Four of the seven are the Orchestrator's four; THREE were named by no
> pre-check**, and one of those three survives the pre-check's own proposed fix. The `ABC-018`
> precedent of 2026-08-09 was five where three were named; this is seven where four were.
>
> **This is NOT a promotion and it moves nothing.** `ABC-009` has been in `Ready` since 2026-07-31.
> `Ready` stays **3/8**. The `Ready → In Development` exit is the Orchestrator's and is not taken
> here, and no engineer was enqueued.
>
> **Nothing else moved.** Size stays `S` (re-checked below, not assumed), priority stays `P1`, the
> diagnosis, the `## Problem`, the `## Source`, the escalation block, the escalation trigger and its
> unspent status, and the `## Dependencies` independence from `ABC-010` are untouched. **`ABC-022`,
> `ABC-010`, `ABC-011`, `EPIC-001` and `plans/nfr-catalog.md` are NOT edited** — every item that
> belongs to one of them is flagged here and left there. **`plans/board.md` is not edited either.**
>
> **How the corrections below were established, since three of them turn on a mutant rather than on a
> reading.** Seven candidate builds were made by patching `addCastlingMoves` in a **copy** of merged
> `main`'s `src/` taken outside the repository, and each was run against (a) this ticket's six
> criteria as they were written, (b) the twelve leaking rows, (c) the four legal-castle controls, (d)
> the full `npm test` suite with its skip count, and (e) the `PERFT_DEEP=1` lane. **No file under
> `src/` in this repository was modified at any point** — `git diff --stat -- src/` against `main` is
> empty and `src/moves.ts` still hashes `fb4fa40934e768dffeaeed0b43548842`. The builds were: the rook
> precondition alone; the king precondition alone; both as occupancy tests; both as identity tests
> (the honest fix); no castle ever offered; a rook looked for on the king's square; and the honest fix
> plus each castling right suppressed in turn. **This role wrote no production code and no test** —
> the mutants existed only to falsify criteria and were never brought into the repository. `npm run
> perft` was **not** run and **no throughput figure below is this role's**; the one throughput range
> that appears is quoted from `plans/nfr-catalog.md`.
>
> **1 — The ticket's headline harm had no acceptance criterion at all, and the gap is FOUR rows wide,
> not two.** *(Orchestrator item 1 — AGREED, widened, and MEASURED on a mutant rather than argued.)*
> `## Scope` named two castling preconditions and **only the rook half was tested**: `A3` puts the
> king on e1 with the rook missing, and no criterion put the king off its home square with the rook
> present. **Measured: a fix implementing the rook precondition ALONE passes every one of the six
> criteria** — purity green, three-call equality green, `A3` green at exactly 5 moves, the perft-table
> guard green, **the full suite 304/304 with skip count 0 and no existing test modified**, and **the
> deep lane 32/32** — while `legalMoves` still offers `FLAG_CASTLE` and still writes a phantom king on
> four FENs. Stated the sharpest way round: **delete the king precondition from a correct fix and not
> one criterion in this ticket fails.** Delete the rook precondition instead and `A3` fails. The two
> conditions did not fail disjoint sets; one of them failed the empty set. The pre-check named two
> white FENs; both colours and both sides reproduce, so `A4` carries **four** rows with their exact
> post-fix count (**16**) and their exact three-call signature. **The alternative was considered and
> rejected:** widen `A3`'s FEN to also strip the king. That makes one FEN fail both preconditions at
> once, which is precisely the subsumption `## Test notes` now forbids — if one criterion can fail for
> either reason, neither reason is pinned.
>
> **2 — Both preconditions are IDENTITY tests and no criterion could tell an identity test from an
> OCCUPANCY test. NAMED BY NO PRE-CHECK, and it survives the pre-check's own proposed fix.** This is
> the worst of the three new ones. Measured on a second mutant — both home squares tested for
> **non-emptiness** rather than for the mover's own king and rook — **all six original criteria pass,
> the suite is 304/304, the deep lane is 32/32, AND all four of correction 1's new `A4` rows pass
> too.** Eight rows still leak: any piece that is not the mover's king on the king's home square
> (family 2) and any piece that is not the mover's rook on the rook's home square (family 3). Two
> consequences neither the pre-check nor any note on this board had recorded. First, **family 2 is
> strictly worse than the phantom king**: the occupant is *destroyed* and overwritten with a king of
> the moving side — measured on an own bishop, an own knight, an **enemy** bishop and a black bishop,
> so one `legalMoves` call performs **silent material loss and a piece-type change**, which is
> `ABC-022` half (a)'s *"one move removes two pieces"* shape arriving by the castling route. Second,
> **family 3 leaves the position BYTE-IDENTICAL** — the make/unmake pair round-trips the impostor
> exactly — so **no purity criterion, however strong, can ever see it**; only a `FLAG_CASTLE`-count
> assertion can. `A5` and `A6` are therefore both required and neither substitutes for the other.
> This is `ABC-022`'s own lesson (`A1` piece-agnostic with *"at least two distinct piece types and
> both colours to move"*, `A5` the enemy-occupant control) and `ABC-018`'s (*"named so the fix is not
> written as 'reject own-colour occupants', which would leave this passing by accident rather than by
> the rule"*). `ABC-009` is the older ticket and predates both; it inherits them here rather than
> being the one place that does not. **The alternative was considered and rejected:** leave it to the
> engineer's judgement on the grounds that *"the king on its home square"* obviously means the king.
> It is not obvious to a test — the criteria are the specification, two builds that read it
> differently were both green, and this board has now shipped that exact class three times.
> **One shape was deliberately NOT added, with the measurement behind it:** a wrong-**colour rook** on
> the rook's home square is unreachable, because an enemy rook there attacks the very squares the
> castle requires to be empty and the existing through-check test already drops the option. A
> criterion for it would be theatre.
>
> **3 — Every criterion was written at the `legalMoves` layer while the ticket's own reproduction
> places the mechanism in `generateMoves`. NAMED BY NO PRE-CHECK.** `## Reproduction` says *"the
> mechanism is visible one layer down: with rights `KQ` set, `generateMoves` offers the castle"*, and
> `## Scope`'s subject line is *"`legalMoves` honors the contract"* — so *"no castling move is
> offered"* had no stated subject, and a filter added at the `legalMoves` layer satisfies it while the
> exported `generateMoves` keeps emitting a move the rules forbid. Two correct-to-acceptance builds
> would then differ observably, which is the `ABC-018` defect-1 / `ABC-015` defect-1 shape. It matters
> for a reason beyond tidiness: **`ABC-022` pins the identical class at both layers (its `A1` and
> `A2`)**, so a `legalMoves`-layer fix here would leave the two halves of one defect class fixed at
> two different layers in the same module. **Ruled:** `A3`–`A6` assert the `FLAG_CASTLE` count is 0
> **for `generateMoves` and for `legalMoves`**, which costs one clause per criterion and is free to
> test — measured, both functions report the same castle count on every leaking row today. **Stated
> honestly, because it cuts against the finding:** `generateMoves` has **no non-test caller other than
> `legalMoves`** (checked with `grep` over non-test `src/`), so a `legalMoves`-layer fix would be
> observationally equivalent *for the product as it stands today*. That is an argument for pinning the
> layer, not against it — the requirement should not depend on a caller list that `EPIC-004` will
> change. **Where the guard goes is still not decided here**; `addCastlingMoves` versus anywhere else
> remains the engineer's, exactly as the pre-check left it.
>
> **4 — Purity was asserted through `toFen`, which is a projection of the position and not the
> position.** *(Orchestrator item 2 — the substance is AGREED, the implication is CORRECTED, and the
> correction cuts the claim DOWN.)* The structural half is right: `src/fen.ts:185-210` iterates
> `file 0..7 × rank 0..7` through `squareAt`, so it reads **64 of the 128 bytes** of the 0x88 board;
> all five scalars do appear in the string, so off-board bytes are exactly what it cannot see.
> **But measured here, that blindness hides nothing in this ticket:** the castle route can only write
> `{e1, e8}`, `{g1, c1, g8, c8}` and the eight rook-leg squares, **all on-board by construction**, and
> a 128-byte diff across every one of the twelve leaking rows and the whole perft table reported
> **zero** off-board changes. **So this is a criterion-strength change and NOT a live-defect fix**, and
> nobody should go hunting an off-board write in the castling branch on the strength of it. It changes
> anyway, for three reasons that are not "it hides a bug": `ABC-022` already asserts this property
> **in this same module** over all 128 bytes and five scalars, and two sibling tickets asserting one
> property two different ways is a reader trap; `## Scope` says *"the position"*, and `toFen` is a
> lossy render of it; and it costs one loop over an array the test already holds. **The alternative
> was considered and rejected:** keep `toFen` equality alone and note the limitation in
> `## Test notes`. Rejected because a note is not a criterion — `ABC-018`'s QE found six mutants
> living in exactly that gap. `A1`, `A4`, `A5` and `A7` now assert **both**, which is `ABC-022`'s
> `A4` shape verbatim.
>
> **5 — `## Scope` bullet 1 overlapped `ABC-022` and `## Out of scope` did not fence it.**
> *(Orchestrator item 3 — AGREED, and the fence is drawn on a measurement rather than on the overlap
> being noticed.)* Bullet 1 read *"the position is byte-identical on return … for every position it
> accepts"*, which covers `ABC-022`'s half (b). This ticket's `## Out of scope` was written 2026-07-29,
> before `ABC-022` was cut 2026-08-04, so it fenced `ABC-010` and the audit's `RF-2` and said nothing
> about `addPawnMoves`. **Measured with a correct castling fix in place: `4k3/8/8/8/8/8/1P6/4K3 w - a3
> 0 1` still writes a phantom black pawn onto a2 on one `legalMoves` call** — so bullet 1 taken at its
> word is **not** met by any castling fix, and an engineer honouring it literally must edit
> `ABC-022`'s fix site. **Ruled:** bullet 1 is scoped *"on the castling route"*, the reciprocal
> out-of-scope line names `ABC-022` with the concrete fence (*no line of `addPawnMoves`, no
> `FLAG_EN_PASSANT` behaviour*), and `## Dependencies` names `ABC-022` back. **The alternative was
> considered and rejected, and rejecting it is the point:** edit `ABC-022`'s acceptance to absorb
> bullet 1. That is the inversion `ABC-018`'s correction rejected in its own item 2 — closing a gap in
> ticket A by editing ticket B — and `ABC-022` is a `Ready`, pullable ticket whose acceptance is not
> this refinement's to move.
>
> **6 — The `NFR-001` bar contained an unmeasurable clause, and its baseline disagreed with the
> authority.** *(Orchestrator item 4 — AGREED, verified at the source rather than accepted.)*
> *"Does not regress materially"* is not a number, and the absolute figures are bound to one machine.
> `ABC-022` already solved this on this board and the form is taken from it: report the **ratio to the
> same measurement on the pre-fix tree in the same process, ≥ 0.98**. **Two smaller things ride
> along.** The baseline figure was **wrong, not merely inconsistent**: `plans/nfr-catalog.md` line 26
> — the authority — records the 2026-07-29 re-measurement as **6.04M–6.21M** over five runs, and
> `ABC-022` carries 6.04M; this ticket's **6.09M** matched neither. Corrected to the catalog's figure,
> with the machine and an `UNKNOWN - verify` for any other hardware, exactly as `ABC-022` states it.
> And `plans/nfr-catalog.md`'s standing benchmarking caution (a byte-identical null-control twin, the
> timing run in its own process) was not referenced; it now is. **No target moved** — the ≥ 1,000,000
> nodes/sec floor and the 32/32 deep-perft requirement are unchanged, and **no throughput number in
> this correction is this role's**: `npm run perft` was not run here, the 6.04M–6.21M figure is quoted
> from the catalog as the standing baseline, and whether it still holds on today's machine is
> `UNKNOWN - verify` — which is itself the argument for the ratio form, since a ratio measured in one
> process needs no answer to that question.
>
> **7 — `A2` named no post-fix number, and the only number in view is a pre-fix one that a correct fix
> changes. NAMED BY NO PRE-CHECK.** `A2` asserted only that three calls *"return the same number of
> moves"*, with *"(Today: 5, 10, 10.)"* beside it. **Measured on all three candidate fixes: the
> post-fix count is 3, 3, 3** — the king on a1 has three moves and both of today's castles are phantom
> — **so `5` is not the answer to this criterion at any point after the fix.** `A3`, one line below,
> *does* state its post-fix count (5), so an engineer mirroring the shape of its neighbour writes
> `expect(counts).toEqual([5, 5, 5])` and ships a test that a **correct** fix fails. Equality alone is
> also satisfiable by an idempotently-wrong build. **Ruled:** `A2` states **exactly 3**, `A1` gains its
> own move count and castle count, and the today-figures stay in the parenthetical where every other
> criterion on this board keeps them. **The alternative was considered and rejected:** leave equality
> alone on the grounds that `A1`'s purity assertion forces the count to be right anyway. It does not —
> `A1` constrains the position, not the number, and the number is what the test asserts.
>
> **Adjudicated and deliberately NOT changed, so the silence is not mistaken for an oversight.**
>
> - **No explicit "the fix must not over-reject" criterion was added**, although the sibling `ABC-022`
>   carries one (`A6`). It would be bloat here, and that is measured rather than asserted: suppressing
>   **each** of the four castling rights in turn, one at a time, turns the **default** suite red every
>   time — **`WK` 10 failed / 294 passed, `WQ` 7 / 297, `BK` 4 / 300, `BQ` 5 / 299 of 304**, with
>   kiwipete failing on all four (`WK` and `WQ` at depth 1, 48→47; `BK` 2039→1993 and `BQ` 2039→1994 at
>   depth 2) and position-5 / position-4 also failing on `WK` / `BQ`. **`A8` already IS that criterion**;
>   `A7` is not, and now says so out loud. The four legal-castle counts are recorded in
>   `## Reproduction` for the engineer's own use without being promoted to criteria.
> - **No `gameStatus` criterion was added**, although this ticket's escalation block, the
>   `plans/traceability.md` row and QE's gap `G-6` all lean on the `gameStatus` route as the
>   reachability argument. It is **derivable, and derivable was checked rather than assumed**:
>   `src/gameend.ts:137` calls `legalMoves` as `gameStatus`'s first executable line, and the only
>   other thing it calls that touches the board is `zobristKey` → `hasLegalEnPassant`, which
>   `ABC-011` made pure by construction. So `gameStatus` inherits this fix under **every** placement
>   of it, and a criterion would restate `A1` in a second caller. Measured today for the record: one
>   `gameStatus` call on the reproduction FEN returns `draw / insufficient-material` and leaves the
>   phantom king behind, exactly as QE recorded.
> - **The 100%-coverage lesson in `## Problem` was left exactly as it stands** — it is the reason this
>   ticket exists and no criterion should be phrased as a coverage number. Correction 2's mutants are
>   its second proof: three builds that differ observably were all green against 304 tests.
>
> **Size re-checked, not assumed: still `S` (2).** The corrections add **no** new requirement beyond
> the two preconditions `## Scope` already named — they make one of the two testable, make both
> identity tests, and put four exact counts and a table where prose used to be. Concretely: two
> guarded conditions in one function, one constructed test table of twelve rows plus four positive
> controls, and the existing perft guard. No new module, no new export, no new dependency edge, no
> design decision. *(Its own `## Size and priority rationale` said "one guarded condition plus two
> test shapes" and now says two; `ABC-022`'s size block calibrates against that older wording.
> **`ABC-022` is deliberately not edited and its `S` does not move** — the recalibration makes the two
> tickets structurally identical rather than divergent, which strengthens its calibration instead of
> breaking it.)*

> ### CORRECTED IN PLACE AGAIN 2026-08-09 by BA/PM — SECOND HOP (task `ticket-to-pr-ABC-009`, subtask `bapm-abc009-criteria-text`, Workflow 07)
>
> **This hop changed no behaviour and asks for none.** The delivered `src/moves.ts` is correct on every
> position either of the gaps below exposes — verified here on this role's own probe, a **sixth**
> independent derivation of the `A1`–`A6` counts and the first of the new rows. **No file under `src/`
> was touched**, no board move was taken (`ABC-009` stays in `Ready for UAT`), and `ABC-022`, `ABC-010`,
> `ABC-011` and `plans/nfr-catalog.md` were not edited. **Nothing merged, nothing deployed.**
>
> Two roles routed three items here rather than editing this section themselves — QE
> (`20260809T123500Z-qe-e2e-decision-634cb408`, risks 1–3) and Security/NFR
> (`20260809T131400Z-security-nfr-decision-b67fabe0`, risks 1–3), each leaving `## Acceptance`
> byte-identical on purpose. **That seam is the reason both gaps were found at all**, and it is honoured
> in the other direction here: nothing in `## Implementation`, `## QE` or `## Security / NFR` was edited
> by this hop either.
>
> **How each ruling below was established.** Ten mutants of the **delivered** diff, each applied to a
> **copy** of the repository's `src/` held outside the repository, each asserting its anchor **unique**
> and its bytes **changed** before running, each typechecked so a broken build could not be scored as a
> survivor, and each restored with `src/moves.ts` re-hashed to `0e247853ab2c05887c76105ff83d8621`
> afterwards. **No file under `src/` in this repository was modified at any point.** Both test files were
> run per mutant with a JSON reporter so failures are attributed by criterion rather than eyeballed.
>
> **8 — `G-1`: the criteria sample the impostor's piece type where the rule quantifies over it. AGREED —
> AND THE GAP IS WIDER THAN IT WAS ROUTED. `A11` added, and ~~it is NOT YET MET BY THE SUITE~~ — MET
> since QE's second hop, verified independently at the third; see the amendment closing this item.**
>
> QE closed the **queen** in tests (`src/moves.castling.hardening.test.ts`, 8 queen rows) and routed the
> criteria text here. Re-deriving rather than accepting the framing turned up the part nobody had
> measured: **the queen rows closed one instance, not the dimension.** Three further builds of the same
> shape — each admitting exactly one more of the mover's own piece types — pass **everything**:
>
> ```
> mutant                                        acceptance   hardening   full suite    deep lane
> KING's square read as "own KING or own ROOK"   33/33        19/19       356/356 sk0   32/32 exact
> KING's square read as "own KING or own PAWN"   33/33        19/19       356/356 sk0   (not run)
> ROOK's square read as "own ROOK or own PAWN"   33/33        19/19       356/356 sk0   (not run)
> ```
>
> The first of those is the most plausible mis-implementation on the list — the two guards are adjacent
> and compare against locals named `king` and `rook` — and it is **exactly the reading QE's own gap
> statement used as its example** (*"the mover's KING/ROOK **or QUEEN**"*), with `QUEEN` swapped for the
> byte sitting one line below. One of the four types is caught: admitting an own `KNIGHT` on the rook's
> square dies to `A6`'s knight row (32/33). **The dimension is open; the queen is closed.** So `A11`
> quantifies over every own piece type rather than adding a fourth sample, and the enumeration
> requirement is written into the criterion so a future reader cannot satisfy it with a spread of three.
>
> **The cost is bounded and it is test-only: roughly nine rows in an existing table-driven file, zero
> production lines.** Stated plainly because it is the uncomfortable part: **this ticket cannot honestly
> be closed until they exist.** The alternative was considered and rejected —
> **rejected alternative:** scope `A11` to the three piece types the suite already covers and carry the
> rook/pawn hole as an accepted risk, which would let the ticket close today. Rejected because it is the
> defect this ticket exists to fix, performed on itself: a criterion that samples where the rule
> quantifies, shipped green, with three live counter-examples already in hand. **This is the one ending
> this ticket may not have.** **Second rejected alternative:** write the rows here. Not this role's —
> BA/PM writes no test, and QE's file is QE's.
>
> ***AMENDED 2026-08-09 at the THIRD BA/PM hop, so this item is not read as a claim about today.*** The
> ruling above stands exactly as it was made and is left unedited — it was true when written. What
> changed is the fact it turned on: **QE's second hop wrote the rows (19 → 34 hardening tests, 14 new,
> zero production lines) and `A11` is MET**, re-verified here on this role's own 17-mutant campaign
> rather than on QE's table, and **the three builds tabulated above now die to `A11`'s rows alone**. The
> *"roughly nine rows"* estimate came in at **fourteen**, and the difference is measured rather than
> stylistic: a type appearing in only one configuration cannot see an admission made conditional on
> colour or on side, and two such mutants die to exactly the doubled rows. The retirement note under
> `A11` carries the numbers — and **one NEW gap** measured at that hop, the occupant's **colour** rather
> than its type, named there and left for the Orchestrator to route.
>
> **9 — `G-2`: nothing varied HOW MANY rights a side holds. AGREED. `A12` added, WITH an ordering clause
> the routed statement did not have — and the suite already satisfies it.**
>
> Confirmed at the source: every `A1`–`A10` FEN carries at most one right per side, except the
> reproduction FEN where **both** castles are invalid and the expected answer is zero either way, so
> nothing separated *"this option was rejected"* from *"the option loop was abandoned"*. Re-measured
> here: `continue`→`break` on the **rook** guard turns `4k3/8/8/8/8/8/8/R3K3 w KQ - 0 1` from **16 moves
> with `e1c1`** into **15 moves with no castle** — a legal move silently deleted — while passing all 33
> acceptance rows.
>
> **What re-derivation added, and it is load-bearing.** The harm is **order-dependent**: it appears only
> when the loop reaches the **invalid** option **first**. On the mirror row `4k3/8/8/8/8/8/8/4K2R w KQ`
> (queenside bogus, reached second) the mutant is **indistinguishable from correct**, and exactly **three
> of QE's six rows** go red on it. A criterion phrased only as *"one right valid, one bogus"* is
> therefore **half inert**, and could be satisfied entirely by the three rows that discriminate nothing.
> `A12` names the ordering requirement and requires the surviving castle asserted **by name**, since a
> count alone cannot distinguish *"the invalid one was rejected"* from *"the valid one was dropped and
> something else appeared"*. QE's rows meet all of this; **no new coverage is owed for `G-2`.**
> **Rejected alternative:** pin the king-guard `break` too, for symmetry. Measured behaviour-equivalent
> — both of a side's options share `kingFrom`, and the mutant passes all 33 acceptance and all 19
> hardening rows — so a criterion for it would be unfalsifiable theatre, the same call this board made
> for the wrong-colour rook and the colour-blind mutant.
>
> **10 — `A7` killed nothing across 62 mutants. KEPT, RECLASSIFIED, AND ITS JUSTIFICATION RETIRED AS
> FALSE.** The full ruling is under `A7` itself, where a reader meets it. In short: re-measured here at
> **0 kills of 10 further mutants**, inert by construction because its population is legally reachable
> and the two guards never fire there; **kept** because it is the suite's only purity walk over legal
> positions, was absent rather than failing before this ticket, and guards a different class; and
> `## Test notes` 2's claim that it is *"the guard that would have caught the defect originally"* is
> **withdrawn as false** — the original defect needed a semantically-invalid position too, and the
> Engineer's own red-before-green record (10 of 33 passing on the unfixed tree, being the four controls
> plus the six `A7` rows) already proved `A7` green on the broken code. **Rejected alternative: delete
> `A7`.** It is a legitimate answer and it was taken seriously — a criterion measured inert against every
> mutation of the fix it accompanies is exactly what a lean acceptance set should shed. Rejected because
> the measurement says "inert against **this** class", not "inert"; it costs six assertions; and the
> honest repair for a criterion whose value was assumed is to **state the measured value**, not to remove
> the evidence that it was overclaimed. **The lesson is recorded as a lesson, in `## Problem`'s voice:
> this is the second criterion on this project whose protective value was assumed rather than measured.**
>
> **11 — The right-test lane and guard ordering: NO criteria text, and each refusal is measured rather
> than asserted.**
>
> - **The pre-existing castling-right test** (`(position.castling & option.right) === 0`) is not one of
>   the two **board** preconditions this ticket owns, so no criterion here — the scope fence holds in both
>   directions, which is the same discipline that kept `ABC-022`'s half (b) out. What changed is worth one
>   line and it is now in `## Test notes`: QE's two no-right rows are what guard it in the **default**
>   lane, so they must not be deleted as "not in the acceptance". **Rejected alternative:** promote it to a
>   criterion here because `A9` (a 40-second opt-in lane) was otherwise its only guard. Rejected as scope
>   creep onto a pre-existing guard; the lane-strategy question is real and belongs to `EPIC-004` /
>   Architect where Security/NFR left it, not to this ticket's acceptance.
> - **Guard ordering** deserves **no criteria text, and cannot have any.** Security/NFR discharged it
>   from hazard to property: the five guards are a conjunction of side-effect-free predicates over an
>   unmutated position, hence permutation-invariant, measured at 99 comparisons over 33 FENs with zero
>   divergence. **A property no test can ever fail on cannot be an acceptance criterion** — that is the
>   definition of unfalsifiable, and this is the third such refusal on this ticket. The cost half is
>   0.003% of the sweep, below the instrument's own floor, so there is no budget a bar could defend
>   either. **Rejected alternative:** write the measured ~18x cheaper-on-invalid-input figure into
>   `## Security / NFR triggers` as a bar. Rejected twice over — it would pin an implementation ordering
>   the code is free to change, and nothing in CI measures it.
>
> **Size re-checked at the source, not assumed: still `S` (2). Priority re-checked: still `P1`.** The two
> new criteria add **no** new requirement — `A11` quantifies a rule `## Scope` has stated since the first
> correction (*"the moving side's `KING` byte and no other"*) and `A12` names a case that rule already
> covers; neither asks for a production line. Nine test rows in an existing table-driven file do not move
> a size that already carried thirty-three. `P1` holds on the owner's legality-first directive of
> 2026-07-31, and **the escalation trigger is still UNFIRED — re-read at the source rather than carried:
> `ABC-010` is `Backlog` / `P1` / `M`, neither deferred nor descoped**, and there is still no CLI entry
> point through which any epic accepts a position from outside the rules core.

## Dependencies

- No blocking dependency. The defective code is merged on `main` (`ABC-002`, `ABC-004`,
  `ABC-005`).
- **Not** dependent on `ABC-010`, by design. Either ticket may ship first.
- **Not dependent on `ABC-022`, and this ticket does not close it.** *(Added 2026-08-09; `ABC-022`
  was cut 2026-08-04, after this list was written, and it already names the seam from its side.)*
  Different function — `addCastlingMoves` here, `addPawnMoves` there — independently testable, either
  may ship first. `ABC-022`'s `## Dependencies` states the converse from its end and states it
  correctly: *"every one of its acceptance criteria is a castling FEN, so an engineer who builds
  `ABC-009` to its acceptance fixes `addCastlingMoves` and leaves half (b) live, with a green gate."*
  **That is still true after this correction and is intended** — re-measured 2026-08-09 with a correct
  castling fix in place, `ABC-022`'s half (b) reproduces unchanged. The fence is in
  `## Out of scope`; **no sequencing constraint follows in either direction.**
- **No sequencing constraint against `ABC-013`**, the third ticket in `Ready`, and the reason is
  worth stating precisely rather than waved through. Checked at the source 2026-08-09: `ABC-013`
  creates a **new** module `src/san.ts` and its `## Out of scope` names *"any change to
  `src/legal.ts` or the rules core"*, so it changes no file this ticket changes. It **does import
  `moves.ts` and `legal.ts` and is a new CONSUMER of `legalMoves`** (its own scope puts SAN at *"~97%
  `legalMoves`"*), so it inherits this defect the way `gameStatus` does — but it inherits the **fix**
  the same way, adds no trigger of its own, and its positions come from inside the product. **Either
  order is safe; nothing here asks for a re-order.** Recorded because "no constraint" and "no
  relationship" are different claims and only the first one is being made.

## Security / NFR triggers

- **`NFR-001` — move generation throughput.** The fix touches the search hot path (castle generation
  runs inside `generateMoves`, which `legalMoves` calls per node). Measurable bar: `npm run perft`
  reports **≥ 1,000,000 nodes/sec** after the change and does not regress materially against the
  standing baseline of **6.04M–6.21M nodes/sec** (Apple M3, Node v24.12.0, darwin-arm64 —
  `UNKNOWN - verify` on any other hardware); **the machine-independent quantity to report is the
  ratio to the same measurement on the pre-fix tree in the same process, which must be ≥ 0.98.**
  Deep perft stays **32/32 exact** (`A9`). *(Corrected 2026-08-09: "does not regress materially" is
  not a number, and the baseline read **6.09M** here against `plans/nfr-catalog.md`'s **6.04M–6.21M**
  — the catalog is the authority and the figure now matches it and `ABC-022`. **No target moved.**
  Read `plans/nfr-catalog.md`'s standing caution before benchmarking anything here: carry a
  byte-identical twin as a null control, give the timing run its own process, and check a cell where
  the delta is structurally zero before believing the cell you care about. Read the catalog's
  denominator fence too — **97.3% of the nodes `npm run perft` counts are free leaves**, so this
  figure is generation-with-free-leaves and is never evidence for `NFR-005`.)*
- **No `NFR-005` trigger, and it is structural rather than measured.** *(Added 2026-08-09 because the
  sibling `ABC-022` names it and a reader will ask.)* `NFR-005`'s per-node cost runs through
  `zobristKey` → `hasLegalEnPassant` (`src/legal.ts:85-134`), which **synthesises its own probe move
  and calls neither `generateMoves` nor `legalMoves`** — verified by reading, not inferred. So the key
  cost is untouched whichever of the two this fix lands in. State that structurally; **do not re-run
  the key benchmark to "confirm" it.**
- **No security trigger.** The audit classed this reliability, not security: no injection
  sink, no trust boundary, no privilege, no data exposure. The consequence is a wrong chess
  answer and a corrupted in-memory board. Do not inflate it. *(Unchanged 2026-08-09 and re-asked
  rather than carried: correction 2 found silent material loss, which is a worse **reliability**
  consequence and not a security one — no user-supplied string reaches this module, there is no sink
  and no trust boundary in `src/moves.ts`. Same classification `ABC-022` carries for the same reason.)*

## Test notes

The reproduction above is the test. **Six shapes are needed and they are not interchangeable**
*(was two until 2026-08-09, then five at the first hop and six at the second — see the two correction
blocks; shapes 1 and 2 are the originals, sharpened)*:

1. **The exact repro cases** — the FENs of `A1`–`A3`, asserted on the **full position state** and on
   move counts. These fail today and are the acceptance bar.
2. **A purity property test across the perft table** — for every standard position, assert the **full
   position state** is stable across two `legalMoves` calls. ~~This is the guard that would have caught
   the defect originally~~, and it is cheap because the position table already exists. **It is not the
   over-rejection oracle** — `A8` is. *(Struck 2026-08-09, second hop, and replaced rather than softened:
   **it would NOT have caught the defect originally.** Its population is legally reachable, and both the
   original defect and every mutation of its fix require a semantically-invalid position — measured, 0
   kills of 62 mutants (QE) and 0 of 10 more (BA/PM), and the Engineer's red-before-green run already
   showed these six rows GREEN on the unfixed tree. It is kept as a standing purity walk over **legal**
   positions, which is a different and real job; see the boxed note under `A7`. **Never cite its green as
   evidence about this fix.**)*
3. **A table keyed on what is PRESENT on each home square, not on what is missing.** *(Added
   2026-08-09; this is `ABC-022`'s test note 1, earned by QE on 2026-08-03 on this same module, where
   two mutants survived 206 tests because the delivered table classified boards by what was
   *absent*.)* `A3` and `A4` are absence rows — an empty rook square, an empty king square. **`A5` and
   `A6` are presence rows and they are the ones that pin identity over occupancy.** Include ~~at least
   two piece types~~ **EVERY one of the mover's own piece types** *(corrected 2026-08-09, second hop —
   see `A11`. "At least two" is satisfied literally by a bishop and a knight while the rule quantifies
   over every other byte, and **three measured builds admitting one further own type pass all 356
   tests, `A1`–`A10` and the deep lane**. A sample is not a quantifier; this is the same defect this
   ticket exists to fix, one level up in the specification.)*, both colours of occupant and both colours
   to move, and keep the four legal-castle
   controls from `## Reproduction` beside them so a fix cannot pass by rejecting more than it should.
4. **Purity asserted over the FULL position state — all 128 board bytes and all five scalars — NOT
   via `toFen`.** *(Added 2026-08-09.)* `toFen` reads 64 of the 128 bytes and cannot see an off-board
   square. Measured honestly: **the castling route cannot write off-board, so nothing in this ticket
   is currently hidden by `toFen`** — the reason to assert the state is that `## Scope` says "the
   position", that `ABC-022` asserts the same property the same way in the same module, and that this
   project has already had one defect (a stray write to square 15) that `toFen` was blind to. Assert
   both: the FEN string for a legible failure message, the 128 bytes for the actual guarantee.
5. **Prove each new assertion RED before the fix exists, and prove each precondition load-bearing by
   deleting it.** *(Added 2026-08-09, and this is the shape that would have caught defect 1 at
   refinement.)* The **king** condition alone and the **rook** condition alone must fail **disjoint
   named sets**. This was measured 2026-08-09, on three mutants built by patching a copy of merged
   `main`'s `addCastlingMoves` and running the criteria against each: deleting the king condition
   fails **`A4` and `A5`, and nothing else** (four rows each); deleting the rook condition fails
   **`A3` and `A6`, and nothing else**; weakening both from identity to occupancy fails **`A5` and
   `A6` only**. All four legal-castle controls survived every mutant, so none of the three is a
   false red. If deleting one fails nothing, that condition is not in the acceptance at all — which is
   exactly the state this ticket was in before today, where deleting the king condition failed the
   empty set.
6. **Vary HOW MANY of a side's rights are held, with the INVALID option first in generation order.**
   *(Added 2026-08-09, second hop — `A12`. Every criterion FEN before this one carried at most one right
   per side, so nothing could distinguish "this option was rejected" from "the option loop was
   abandoned": `continue`→`break` on the rook guard deletes a legal castle and was green on all twelve
   criteria.)* The discrimination is **order-dependent** and measured: the harm shows only when the loop
   meets the bogus option first — kingside precedes queenside in both `WHITE_CASTLES` and
   `BLACK_CASTLES` — so a row with the *valid* castle first is inert and three of six such rows carry
   the whole load. Assert the surviving castle **by name**, never by count alone, and keep a
   both-castles-valid row beside them. **The mirror mutation on the king guard is behaviour-equivalent
   (both options share `kingFrom`) and is deliberately not pinned.**

**Two rows in `src/moves.castling.hardening.test.ts` are load-bearing without belonging to any criterion,
and must not be deleted as "not in the acceptance."** *(Added 2026-08-09, second hop.)* The two
no-right-held rows (`4k3/8/8/8/8/8/8/R3K2R w - - 0 1` and its black mirror) are what guard the
**pre-existing** castling-right test in the **default** lane; deleting that test passes all 337 delivered
tests and is caught otherwise only by the 40-second opt-in `A9`. The right is not one of the two **board**
preconditions this ticket owns, so it gets no criterion here — but the coverage is real and the reason it
exists is now written down.

Assert the *contract* (position unchanged, results idempotent, no move offered that the rules
forbid), not line execution. `src/legal.ts` was already at 100% coverage when this shipped; a test
that only raises coverage adds nothing here — and correction 2's mutants are the second proof of it,
three observably different builds all green against 304 tests.

**Do not add a perft position hoping to catch this.** Every FEN above is semantically invalid and
therefore unreachable by play; the perft table's job here is `A7`'s purity walk and `A8`/`A9`'s
over-rejection oracle, and a new perft case would cost CI time for zero coverage of this defect.

If the fix lands in `generateMoves`, the deep perft lane is the oracle that it changed nothing
for legal positions — run it (`PERFT_DEEP=1 npx vitest run src/perft.test.ts`, ~38 s) before
review, not after.

## Size and priority rationale

**Size `S` (2).** ~~One guarded condition plus two test shapes~~ **Two guarded conditions plus five
test shapes** *(re-derived 2026-08-09 — the wording was one condition, and `## Scope` named two from
the day it was written; the acceptance only ever tested one. **The size did not move**: it is the same
`if` and the same fix site, and the second condition is one more comparison beside the first)*, in a
module that already has an exact reproduction and an existing correctness oracle (perft 32/32). No new
module, no new export, no new dependency edge, no design decision. Calibrated against `ABC-006` (perft
harness, `S`) and below `ABC-005` (legality filtering, `M`) — and now structurally identical to
`ABC-022` (two conditions in one branch of one function, one constructed table, one regression walk),
which is `S` for the same reasons. **Not `M`:** there is no design question here; the fix site, the
preconditions and the oracle are all named above. **Not `XS`:** two independent preconditions with
disjoint failure modes, in the search hot path, with a mutation-hardened twelve-row table, is real work
with real regression risk.

**Priority `P2`, not defaulted.** Applying the latent/live test the audit used:

- **Not `P0`/`P1`:** the defect is *latent*. `parseFen` has no user-facing caller today —
  the module map records exactly one production consumer of `src/fen.ts` (`perft-bench.ts`),
  and every position the code sees today is either the startpos, a perft fixture, or a test
  fixture, all well-formed. Nothing in flight is broken; the suite is 143/143 green. Further,
  `ABC-010` removes this defect's only reachable trigger by rejecting the FEN at the boundary,
  so shipping ABC-010 first makes this unreachable in practice.
- **Not `P3`:** "unreachable in practice" is precisely the reasoning that let a broken
  contract ship under a 100% coverage number. The invariant is documented, is relied on
  transitively by `gameStatus` and `perft`, and fails silently. It is defense in depth in the
  one module whose bugs invalidate every other epic.

**Escalation trigger (do not leave this to judgment later):** ABC-009 rises to `P1` if
`ABC-010` is deferred or descoped, or if any epic begins accepting a position from outside the
rules core before ABC-010 lands.

*Trigger status, 2026-07-31: **NOT fired.** `ABC-010` is neither deferred nor descoped, and the only
position any epic accepts today is `ABC-012`'s `newGame(initialFen)`, supplied by `EPIC-006`'s
startup from inside the product rather than typed by a user. The `P2` → `P1` escalation recorded at
the head of this file came from the owner's legality-first directive instead. The trigger stays live
and unspent: if `EPIC-003` begins accepting a user FEN before `ABC-010` lands, that is a separate
escalation and it argues for `P0`.*

*Trigger status re-read at the source 2026-08-09 (second BA/PM hop): **still NOT fired, and still on both
clauses.** `plans/tickets/ABC-010-*.md` reads `status: backlog` / `column: Backlog` / `size: M` /
`priority: P1` and `plans/board.md` line 90 carries it in `Backlog` — neither deferred nor descoped. There
is still no CLI entry point (`AGENTS.md` *Dev / run* is `UNKNOWN - verify` until `EPIC-006`), so no epic
accepts a position from outside the rules core. **Size `S` and priority `P1` both re-checked and both
unmoved**; the second hop's two criteria add no production requirement. The header's `P2` in the block
above is the ORIGINAL derivation and is left standing as the record of it — the live priority is `P1`,
in the frontmatter and in the escalation note at the head of this file.*

## Definition of Ready

**Re-derived 2026-08-09 at the `Ready → In Development` pull.** The block below was written
2026-07-31 at promotion and was **never re-checked** until today; it is restated rather than left
standing, because two of its ticks were wrong.

Problem ✅ · scope + out-of-scope ✅ (out-of-scope **corrected** — the `ABC-022` fence was missing) ·
INVEST ✅ (independent — no unbuilt dependency at all, the defective code is merged on `main`; small —
two conditions in one function) · **acceptance measurable — was ❌, now ✅ AFTER SEVEN CORRECTIONS**
(the king precondition given four rows of its own, both preconditions pinned as identity tests over
twelve rows, the layer named for both `generateMoves` and `legalMoves`, purity asserted over 128 bytes
and five scalars instead of `toFen`, the `ABC-022` boundary fenced, the `NFR-001` bar given a ratio and
the right baseline, and `A2` given its post-fix number — see the correction block under
`## Acceptance`) · dependencies ✅ (none blocking; the `ABC-010`, `ABC-022`, `ABC-011` and `ABC-013`
relationships each named and bounded) · **NFR triggers — was ✅ on an unmeasurable clause, now ✅ on a
ratio** (`NFR-001` ≥ 1M nodes/sec and ≥ 0.98 against the pre-fix tree in the same process, machine
named, `UNKNOWN - verify` elsewhere; `NFR-005` excluded structurally with the reason; no security
trigger, with the reason) · test notes ✅ (five shapes, with the load-bearing deletions named) ·
size `S` ✅ (re-checked, unmoved) · priority `P1` ✅ · no blocker ✅ (`Blocked` column empty)

*(The line this block carried until 2026-08-09 read "acceptance measurable ✅ (exact FENs, exact
counts, byte-identical FEN comparison)". Every item in that list was literally true and the tick was
still wrong — the exact FENs were exact, and the defects were in the criteria the list did not
mention. That is the same trap `ABC-018`'s block fell into two days earlier, and it is the reason a
tick is now written with what it excludes rather than what it includes.)*

**Amended 2026-08-09 at the second BA/PM hop, and the distinction matters.** The *acceptance measurable*
row stays ✅ and is **stronger** than it was: `A11` replaces a sampled requirement with a quantified one
and `A12` names an order-dependent case, both with exact measured numbers. **What is NOT true is that
every criterion is currently SATISFIED** — `A11` is not, by roughly nine test rows, measured and named in
the second correction block. Those are two different claims and this block only ever made the first one:
Definition of Ready asks whether a ticket can be *pulled into dev*, which `ABC-009` was, on 2026-08-09.
**Nothing in this block was flipped, and no board move was taken** — `ABC-009` stays in `Ready for UAT`,
and whether the shortfall is closed before it is closed out is the Orchestrator's routing call, not a tick
this role may quietly re-draw.

**Amended again 2026-08-09 at the THIRD BA/PM hop: the shortfall named above is CLOSED.** `A11` is
satisfied — QE's second hop wrote the rows, and this hop verified it independently (17 mutants, 12
killed, 4 equivalence controls surviving, 0 verdict mismatches; exhaustiveness re-derived on this role's
own `parseFen` domain probe; the quantifier falsified on three deliberate corruptions of the suite file).
**Every criterion `A1`–`A12` is now green on the branch tip**, `npm test` 371/371 on 16 files at skip 0.
**Still no tick was flipped and still no board move was taken** — the *acceptance measurable* row was
already ✅ and Definition of Ready was never the block that carried "currently satisfied". **One new gap
was measured at this hop and is named under `A11`** — the occupant's colour, four rows wide, zero
production lines, routing the Orchestrator's. It is **not** a Definition-of-Ready failure: this ticket
was correctly pullable and remains so, and a gap found by measurement after delivery is the fourth such
on this ticket, not a re-adjudication of this block.

**Amended once more 2026-08-09 at the FOURTH BA/PM hop, and the correction is to the sentence directly
above.** *"Every criterion `A1`–`A12` is now green on the branch tip"* was true when written and is
**no longer the whole set**: `A13` was added at this hop and is `⚠️ NOT YET SATISFIED BY THE SUITE`, so
the honest statement is **twelve of thirteen criteria green, the thirteenth owing test rows for two
byte values and zero production lines**. The gap named in the previous amendment is no longer merely
*named*: it is **carried as `A13`**, restated as a quantifier over all twelve wrong byte values per
home square instead of four sample rows. **Still no tick was flipped and still no board move was
taken** — `ABC-009` stays in `Ready for UAT` **1/4**. The *acceptance measurable* row **stays ✅ and is
stronger again**, for the same reason it survived the `A11` amendment: Definition of Ready asks whether
this ticket could be **pulled into dev**, which it could and was, and *"measurable"* is a property of
how the criteria are written, not a claim that every one is currently green. **A criterion added after
delivery because a dimension was finally counted is not a Definition-of-Ready failure** — it is the
fifth gap this ticket has found by measurement, and the first one whose region is provably the last.

~~Sits in `Backlog`. Promotion to `Ready` is a separate BA/PM step and has not been taken.~~

**Promoted to `Ready` 2026-07-31 by BA/PM** — the separate step named above, taken now. It qualifies
on this board's own `Ready` test and not on its priority: it has **no unbuilt dependency at all**
(the defective code is merged on `main`), which is the one criterion that keeps `ABC-015`..`ABC-019`
in `Backlog`. At `S` (2 points) it is the cheapest correctness win available, and it sits in `Ready`
beside `ABC-011`, the other rules-core defect at `P1`.

## Implementation

**IMPLEMENTED `In Development → In Review` 2026-08-09 by the Software Engineer** (task
`ticket-to-pr-ABC-009`, subtask `engineer-abc009-implement`, Workflow 04), on branch
`grugops/ticket-to-pr-ABC-009`. `In Development` 1/3 → 0/3, `In Review` 0/3 → 1/3; no limit
approached, no override taken, no written reason owed. **Nothing merged and nothing deployed — a
human holds both.**

**Nothing above this section was edited.** The `## Acceptance` criteria, BA/PM's correction block,
`## Scope`, `## Out of scope`, `## Reproduction`, the escalation block, the `NFR-001` bar and the
`## Test notes` are all as they stood at the pull. Where a number below could be read as changing
one of them, it does not — every criterion was met as written.

### One production file changed, one test file added, and no existing test touched

`git status --short -- src/` reports exactly ` M src/moves.ts` and `?? src/moves.castling.test.ts`.
`git diff --name-only -- 'src/*.test.ts'` is **empty** — which is `A8`'s *"no existing test is
modified, verified at line level, not by inspection"*, made mechanical rather than argued. The new
tests went into a **new** file for exactly that reason; appending them to `src/moves.test.ts` would
have made the claim a judgement about which changed lines were tests.

- **`src/moves.ts`** — `+30 −8`. Two guard conditions in `addCastlingMoves`, one `rookFrom` field
  added to the `CastleOption` interface and its four table rows, one `rook` local beside the
  existing `king` local, and the doc comments for both. Nothing else in the module was touched; the
  four existing tests (`option.castling`, `option.empty`, `option.kingPath`, the move record) are
  byte-identical.
- **`src/moves.castling.test.ts`** — 33 tests: `A1`, `A2`, `A3`, the four `A4` rows twice (offer and
  purity), the four `A5` rows twice, the four `A6` rows (offer only — see below), the four
  legal-castle controls, and the six `A7` rows. Purity is asserted over **all 128 board bytes and
  all five scalars** and additionally through `toFen` for a legible failure message, which is
  `## Test notes` 4.

### The fix, and the structural choice with the alternatives it rejected

`## Scope` is the requirement and **the fix site was deliberately not ruled on**, so this is the
engineer's call and is recorded as one.

The two home squares are read as **identity** tests — `position.board[option.kingFrom] !== king` and
`position.board[option.rookFrom] !== rook`, where `king` and `rook` carry the moving side's colour
bit. They sit **above** the existing emptiness and through-check tests: a byte compare is cheaper
than an emptiness scan and far cheaper than an attack scan, which matters because this is the
innermost loop of the search (`NFR-001`).

The rook's home square is a new **`rookFrom` field on the precomputed `CastleOption` table**
(h1=7, a1=0, h8=119, a8=112), and the guards live in `addCastlingMoves` — the **generator** layer —
so `generateMoves` and `legalMoves` are both fixed by one change rather than one of them by a filter.

Three alternatives were considered and rejected:

1. **Import `CASTLE_ROOK_MOVE` from `apply.ts`**, where the rook's leg already lives, instead of
   adding a field. Rejected: `apply.ts` already imports from `moves.ts`, so this creates a **module
   cycle** — and it would be a cycle introduced for a four-entry lookup table. The two tables also
   answer different questions: `CASTLE_ROOK_MOVE` is *where the rook goes when the castle is played*,
   keyed on the king's destination; `rookFrom` is *where the rook must stand for the castle to exist
   at all*. They agree on the from-square today by construction, not by definition.
2. **Derive the rook square arithmetically per call** from `kingTo` (`kingTo > kingFrom ? +3 : −4`).
   Rejected: the module's own header commits to *"a precomputed table rather than per-call
   arithmetic — this is the innermost loop of the search (NFR-001)"*, and a fourth table field costs
   nothing at run time.
3. **Filter at the `legalMoves` layer.** Rejected on the ticket's own words: `## Scope` requires that
   *"offered" means offered by `generateMoves` AND by `legalMoves`*, so a `legalMoves`-layer filter
   would leave the exported generator emitting a move the rules forbid. That the two are
   observationally equivalent today (`generateMoves` has no non-test caller but `legalMoves`) is an
   argument for pinning the layer, not against it.

### `A1`–`A6`: all fifteen post-fix counts matched the delivered diff on the first run

**No discrepancy was found, and nothing was adjusted in either direction** — no test was bent to the
code and no criterion was edited. Measured on the delivered diff:

```
A1  4k3/8/8/8/8/8/8/K7 w KQ - 0 1      3 moves, 0 FLAG_CASTLE, toFen + 128 bytes + 5 scalars pure
A2  (same, three calls)                3, 3, 3
A3  4k3/8/8/8/8/8/8/4K3 w K - 0 1      5 moves, 0 FLAG_CASTLE in generateMoves AND legalMoves
A4  K6R w K / R6K w Q / k6r b k / r6k b q      16 / 16 / 16 / 16, 0 castles both layers, pure
A5  K3B2R / R3N2K / K3b2R / k3b2r              19 / 17 / 13 / 19, 0 castles both layers, pure
A6  4K2B / N3K3 / 4k2b / 4K2b                  12 /  7 / 12 /  5, 0 castles both layers
control  kiwipete                      48 legal moves, 2 castles STILL offered, position pure
control  4K2R / R3K3 / 4k2r / r3k3      15 / 16 / 15 / 16, exactly 1 castle each
```

That is now **three** independent derivations of those counts — BA/PM's seven candidate builds, the
Orchestrator's independently written fix, and this diff — where the ticket carried two.

**`A6` is asserted on the offer only, and that is structural rather than an oversight.** Family 3
leaves the position byte-identical, because the make/unmake pair round-trips the impostor exactly, so
no purity assertion can ever see it and only the `FLAG_CASTLE` count can. Re-verified here rather
than inherited from the correction block.

### Red before green, and the load-bearing deletions

`quality.tdd` is `encouraged`; the inner loop was run red-first and the red is recorded rather than
described. Against the **unfixed** tree the new file read **23 failed / 10 passed of 33**, and the 10
that passed are exactly the four legal-castle controls and the six `A7` rows — which confirms on the
repository tip that `A7` was **absent rather than failing**, which is what *"must stay green, and
must be present"* asks about.

`## Test notes` 5 requires each precondition proved load-bearing by deleting it. BA/PM measured that
on mutants of `main`; it is re-measured here **on the delivered diff**, by patching in place and
restoring from a pristine copy, with `src/moves.ts` re-hashed to
`0e247853ab2c05887c76105ff83d8621` after every mutant:

| mutation of the delivered fix | criteria that fail | suite |
|---|---|---|
| delete the **king** condition | `A4` + `A5`, **nothing else** | 321/337 |
| delete the **rook** condition | `A3` + `A6`, **nothing else** | 332/337 |
| weaken both identity tests to **occupancy** (`!== EMPTY`) | `A5` + `A6` **only** | 325/337 |
| **swap** the two squares (king sought on the rook's square, rook on the king's) | 19 assertions, including `ABC-004`'s castling generation and make/unmake, and kiwipete `perft(1)` — i.e. `A8` | 318/337 |

All four legal-castle controls survived every mutant, so none of these reds is a false red. The
disjoint-set property the ticket claims holds on the real change.

### A fifth mutant survives all twelve criteria — and it is behaviour-equivalent, not a defect

Reported because the ticket hands *"seven is not proven complete"* forward, and a surviving mutant is
exactly what that warning predicts. Weakening both identity tests to **colour-blind** ones
(`pieceType(...) !== KING` / `!== ROOK` instead of the full byte) reads **337/337 green** and
typechecks clean.

It is **not** a criterion gap. It was settled by differential test rather than by argument: over an
exhaustive space of all 13 possible byte values on the king-home square × all 13 on the rook-home
square × the four castles (**676 boards**, built directly rather than through `parseFen` because most
are not legal FENs), the two rules read those squares differently on exactly **12** boards, and the
generator's output **agrees on all 12** — an enemy king or an enemy rook standing there attacks a
square the existing through-check test already requires unattacked. Re-run with every possible third
piece on every other square of the board (**8,928 boards**, in case a blocker changed the attack
geometry): divergence still **zero**.

So the delivered fix is **stricter than reachability requires**, which is the safe direction, and no
criterion can distinguish the two. This is the same class as `ABC-011`'s two behaviour-equivalent
cost mutants that were deliberately **not** pinned, and it independently corroborates BA/PM's
measured finding that a wrong-**colour** rook on the rook's home square is unreachable — now
exhaustively over both squares and against the delivered fix rather than on two FENs. **No criterion
is proposed for it**; one would be the theatre the correction block already rejected.

### `A7`, `A8`, `A9` and the gates, as they ran

| gate | command | result |
|---|---|---|
| install | `npm install` | exit 0 — no dependency change; `package.json` and `package-lock.json` untouched |
| lint | `npm run lint` | **exit 0**, zero autofix passes needed (**0 of 2** self-fix attempts spent) |
| typecheck | `npm run typecheck` | exit 0 |
| unit | `npm test` | **337 passed (337) on 15 files** — 304/304 on 14 files before, measured by running the suite on the tip, not by subtraction |
| build | `npm run build` | exit 0 (`tsc --noEmit`; honestly a typecheck in the build slot) |
| skip count | the `AGENTS.md` `### Test integrity` command | **0** — `A8`'s requirement |
| deep perft (`A9`) | `PERFT_DEEP=1 npx vitest run src/perft.test.ts` | **32/32 exact**, 36.93 s, **run before review** |
| e2e | — | `UNKNOWN - verify` — the `AGENTS.md` slot is unknown; no UI surface and no runnable game until `EPIC-006` |
| test-integrity checker | `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0` | **exit 2** — "cannot read the registry file" |
| auto-UAT oracles | `node scripts/check-uat-oracles.js` | `UNKNOWN - verify` — absent in this install; non-blocking per Workflow 05 |

**Exit 2 is recorded as an ERROR and not as a pass.** `.grugops/test-skips.md` does not exist
(`ls` confirms). Per Workflow 05 step 3, exit 2 is *"the checker could not run"* — distinct from the
exit-1 human-only short-circuit. **No registry file was created**: an agent may not self-author a
justification to clear its own gate, and with a skip count of 0 nothing is owed one.

The two lint **infos** are pre-existing `biome.json` schema and deprecation notices, unrelated to
this ticket. Flagged rather than fixed, per the coding rules on adjacent code.

`A9` was run on the **delivered** tree. It was not run on the pre-fix tree, because the deep lane is
the oracle that the change is invisible to legal play and the pre-fix tree's 32/32 is `ABC-006`'s
standing result, not a comparison this ticket needs. The stronger statement is that the fix cannot
affect a position reachable by play at all: `makeMove` clears a castling right whenever the king or
the matching rook leaves its home square or that rook is captured, so in any position reachable from
a legal start the right implies both pieces are home — which is why 32/32 and the whole perft table
are unchanged.

### `NFR-001` / `A10` — MET on both clauses, and the first throughput figure measured on this ticket

**No role on this ticket had measured any throughput number.** The 6.04M–6.21M range in
`## Security / NFR triggers` is quoted from `plans/nfr-catalog.md`, which is the authority; the
Orchestrator and BA/PM both recorded that they did not run `npm run perft`. Every figure below is
this role's own, on **Apple M3 (Mac15,13) / Node v24.12.0 / Darwin 25.5.0 arm64**, and
**`UNKNOWN - verify` on any other hardware**.

**Clause 1 — the floor.** `npm run perft` on the delivered tree, three runs:
**6,078,622 / 6,131,325 / 6,151,559 nodes/sec**. Inside the catalog's standing 6.04M–6.21M band, and
about **6.1x** the ≥ 1,000,000 nodes/sec bar. **MET.**

**Clause 2 — the ratio, in one process.** Three trees imported into a **single** process: the
**pre-fix** tree (`main`'s `src/`, `moves.ts` at `fb4fa40934e768dffeaeed0b43548842`), the
**delivered** tree, and a **byte-identical twin** of the delivered tree as a **null control by
identity**. Seven rounds, tree order **and** cell order rotated every round, a discarded warm-up
round, medians of per-round rates, node counts checksummed across every tree and round
(238,936,362 nodes, so nothing could be elided), and **two fully independent samples** in their own
processes, quoted separately and never averaged.

```
                       sample 1                    sample 2
cell         rights    post/pre   twin/post        post/pre   twin/post
position-3   -         1.0084     0.9991           1.0041     0.9937     <- structurally zero
position-6   -         0.9918     1.0053           0.9989     1.0055     <- structurally zero
kiwipete     KQkq      0.9930     1.0107           0.9967     0.9988
startpos     KQkq      1.0002     1.0080           0.9880     1.0126
position-4   kq        1.0003     1.0043           0.9949     0.9986
position-5   KQ        1.0026     1.0065           0.9981     1.0013

AGGREGATE              0.9987     1.0087           0.9974     0.9983
```

**Aggregate post/pre 0.9987 and 0.9974 against the ≥ 0.98 bar — MET on both samples.** Worst single
cell across both, 0.9880, is also above the bar.

**The catalog's standing benchmarking caution was followed, and it is the reason no per-cell claim is
made.** A cell whose delta is **structurally zero** was read *first*: `position-3` and `position-6`
carry **no castling rights**, and `makeMove` can only clear rights and never create them, so the two
added byte compares execute **zero times anywhere in those two subtrees**. Their true ratio is
exactly 1.0000, and they measured 1.0084, 0.9918, 1.0041 and 0.9989. The **identity twin** — the same
bytes as the delivered tree — read 1.0087 and 0.9983 aggregate and up to 1.0126 on a single cell.
**So this instrument's own floor is about ±1% per cell, which is larger than any signal the change
could produce.** The bar is met with margin, and **no per-cell regression or improvement is claimed
from it**: in particular the kiwipete 0.9930 reading sits inside noise established by cells whose
delta is provably zero, and reading it as a 0.7% regression would be the same mistake this catalog
has recorded nine times.

**Denominator fence, carried rather than quoted: 97.3% of the nodes `npm run perft` counts are free
leaves.** This is a generation-with-free-leaves figure and is **never** evidence for `NFR-005`.

**`NFR-005` was not measured and the key benchmark was not re-run** — the ticket excludes it
**structurally** (`zobristKey` → `hasLegalEnPassant` calls neither `generateMoves` nor `legalMoves`)
and says explicitly not to re-run it to "confirm" it. **No NFR target moved and
`plans/nfr-catalog.md` was not edited** — the catalog is Security/NFR's, and that role re-derives on
its own instruments.

**No wall-clock assertion was added to the suite** — this project's standing rule
(`src/zobrist.nfr.test.ts:112`). The figures live here and in the context notes, with their machine.

### What this hop does NOT establish

- **That `A1`–`A10` is complete.** It came in open and goes out open. Five mutants were run and the
  criteria killed four in disjoint named sets; the fifth is equivalent. That is five, against
  `ABC-018` QE's fifty-six. A mutation campaign is QE's instrument.
- **That the two places BA/PM said it would look first are clear.** A criterion set written over
  signals that agree, and the interaction between a new precondition and the existing
  `option.empty` / `option.kingPath` tests. The equivalence result above is a piece of the second —
  the through-check test **masks** the colour dimension entirely — and nobody has examined the first.
- **Anything about `ABC-022`.** Its half (b) is still live and that is intended: no line of
  `addPawnMoves` was changed and no `FLAG_EN_PASSANT` behaviour was touched. `ABC-022`'s ticket was
  not edited.
- **Any coverage figure.** None was measured, and `## Problem` is explicit that a test which only
  raises coverage adds nothing here — `src/legal.ts` was already at 100% when this defect shipped.
- **That the gate is green in the Workflow 05 sense.** The four mandatory gates passed and the deep
  lane is 32/32, but the terminal verdict is the gate's to emit and QE owns the `In Review` exit.
  No `finding` was written and nothing is self-stamped.

## QE

**BROKEN-TESTED AND MOVED `In Review` → `In Security/NFR` 2026-08-09 by QE/E2E** (task
`ticket-to-pr-ABC-009`, subtask `qe-abc009-review`, Workflow 04), on branch
`grugops/ticket-to-pr-ABC-009`. Verdict **PASS WITH RISKS**. `In Review` 1/3 → 0/3,
`In Security/NFR` 0/2 → 1/2; no limit approached, no override taken, no written reason owed.
**Nothing merged and nothing deployed — a human holds both.**

**Nothing above this section was edited.** The `## Acceptance` criteria, BA/PM's correction block,
`## Scope`, `## Out of scope`, `## Reproduction`, the escalation block, the `NFR-001` bar,
`## Test notes` and the Engineer's `## Implementation` section all stand exactly as they were. Two
criterion gaps are named below and **routed to BA/PM rather than patched in here** — the criteria are
not this role's to rewrite, and `ABC-018`'s correction established that closing a gap in one artifact
by editing another is the inversion to avoid.

### The headline, because the distinction is the whole result

**62 mutants were run against the delivered diff. Five survive the ENTIRE acceptance net — all twelve
criteria, all 337 delivered tests AND the `PERFT_DEEP=1` lane at 32/32 — and NOT ONE of the five is a
defect in the code.** All five are defects in the **criteria**. The delivered fix is correct on every
position that exposes them; it is the mutants that are wrong. That is why this is a pass and not a
return to dev: there is nothing for the engineer to fix.

`src/moves.ts` is **byte-identical** to `8f540cf` — md5 `0e247853ab2c05887c76105ff83d8621`, the digest
the Engineer published — and `git diff 8f540cf -- src/moves.ts` is **empty**. Zero production lines
were changed by this role.

### The instrument, and why the repository's `src/` was never mutated

The Engineer mutated `src/moves.ts` in place and restored it. This role did not: every mutant was
applied to a **copy** of `src/` held outside the repository. The driver refuses to manufacture a false
survivor — each mutant asserts its anchor occurs **exactly once** and that the bytes actually changed
(otherwise a harness error, never a "survived"), runs `tsc --noEmit` per mutant so a broken build is
never scored as a legitimate survivor, and restores and re-hashes the file after every one. The
precaution earned itself: a timed-out sweep left a mutant in the **scratch** copy, which the harness's
own re-hash caught; pointed at the repository, that loop would have been pointed at the delivered fix.

Calibrated before being trusted: the harness reproduces the Engineer's four-mutant table **exactly** —
same failing criteria, same assertion counts, same 321 / 332 / 325 / 318 suite totals.

### The fifth mutant, adjudicated: the equivalence argument HOLDS and no criterion is owed

Corroborated on an instrument built differently from the Engineer's, over **12,584 positions
`parseFen` ACCEPTS** — three squares varied jointly, three white-king placements, **all four rights
combinations including both at once**, and the whole black-to-move mirror — with **zero divergence at
`generateMoves`, at `legalMoves`, and on purity**.

The scope boundary was read at the source rather than assumed, and it matters: `src/fen.ts`
`assertBothKingsPresent` accepts a board only with **exactly one king of each colour**, and
`parseCastling` performs **no** rights/board consistency check (that is `ABC-010`). An earlier probe of
this role's own built boards by poking bytes and produced boards with zero or two white kings —
`4k3/8/8/8/8/8/8/4Q2R w K - 0 1` has no white king and `parseFen` **throws** on it. A divergence there
is out of scope and must not be reported as a gap, so every figure above comes from a corpus
round-tripped `toFen` → `parseFen` and discarded unless accepted (16,912 candidates rejected).

The mechanism is stronger than "the through-check test happens to catch it": `option.empty` requires
the squares between king and rook to be EMPTY and is tested **before** the through-check, so on any
board reaching it there is an **unobstructed line** from the rook's home square to the `kingPath`
squares — an enemy rook or queen there attacks them **necessarily**, and no blocker can exist without
having failed `option.empty` first. On the king's square, a king's attack on an adjacent `kingPath`
square is unblockable by construction. Measured beside it: an **enemy queen** on either home square is
likewise already refused (`4k3/8/8/8/8/8/8/K3q2R w K - 0 1`, `4k3/8/8/8/8/8/8/4K2q w K - 0 1`, zero
castles each).

**So a colour criterion would pass on `main`'s unfixed tree, on the delivered fix and on the mutant
alike — unfalsifiable, and therefore theatre.** The Engineer's disposition was right on both halves:
keep the stricter guard, propose no criterion. **Rejected alternative:** add a wrong-colour row anyway
for symmetry with `A5`'s enemy-bishop row — rejected because the enemy *bishop* row is falsifiable and
an enemy *king/rook/queen* row is not.

### The soft spot nobody had examined, examined — and it is where all five live

BA/PM named *"a criterion set written entirely over signals that agree"* and nobody had looked. On
`A3`–`A6` every assertion on a row — the castle count in both layers, the exact move count, purity
over 128 bytes and five scalars — is driven by **one binary event**: did this castle option survive the
guards. Twelve rows carry twelve bits of discrimination, not thirty-six. That is not itself a flaw;
**the flaw is what agreeing signals cannot show you — the dimensions the set holds CONSTANT.** Two are
constant across all twelve rows and both controls, and a defect hides in each.

**`G-1` — the impostor's PIECE TYPE. `A5`/`A6` vary two; the rule quantifies over all of them.**
`## Test notes` 3 asks for *"at least two distinct piece types"* and a bishop and a knight satisfy it
literally, but `## Scope` states *"the moving side's `KING` byte and no other"* — a claim about **every**
other byte. A guard admitting one further own-colour type is green on everything:

```
reading either home square as "the mover's KING/ROOK **or QUEEN**"
  -> 337/337 green · typecheck 0 · deep lane 32/32 · 74 and 70 diverging in-scope positions

4k3/8/8/8/8/8/8/K3Q2R w K - 0 1   delivered  31 moves, 0 castles, position PURE
                                  mutant     32 moves, 1 castle e1g1, and ONE legalMoves call
                                             DESTROYS the white QUEEN on e1, writing a king over it
```

That is family 2's *"silent material loss and a piece-type change"* on the most valuable piece on the
board, with every criterion green. The queen-on-the-rook's-square form leaves the position
**byte-identical** — family 3's shape — so only the `FLAG_CASTLE` count could ever see it, exactly as
`A6`'s own rationale says, and `A6` has no queen row to see it with.

**`G-2` — HOW MANY of a side's rights are held at once. Never varied, and this is the deeper one.**
Every acceptance FEN and every control holds **at most one right per side**; the sole exception is the
reproduction FEN, where **both** castles are invalid and the expected answer is zero either way. So no
criterion asks whether a **valid** castle survives when its sibling is bogus — and because every row
expects zero castles, nothing distinguishes *"this option was rejected"* from *"the option loop was
abandoned"*:

```
continue -> break (or return) on the ROOK guard
  -> 337/337 green · typecheck 0 · deep lane 32/32 · 16 diverging in-scope positions

4k3/8/8/8/8/8/8/R3K3 w KQ - 0 1   rights KQ; h1 EMPTY so `K` is bogus; a1 rook home so `Q` is LEGAL
                                  delivered  16 moves, 1 castle = e1c1   (correct)
                                  mutant     15 moves, 0 castles        a LEGAL MOVE VANISHES
```

**The asymmetry is the lesson.** The same mutation on the **king** guard is genuinely
behaviour-equivalent, because both of a side's options share `kingFrom` (`e1` for `K` and for `Q`). On
the **rook** guard it is a defect, because `rookFrom` differs per option (`h1` vs `a1`). One token, two
opposite verdicts, and `A1`–`A10` returns the same green for both.

**Why `A8` and `A9` cannot cover either dimension, structurally — by the Engineer's own argument.**
`makeMove` clears a castling right whenever the king or the matching rook leaves home or that rook is
captured, so in any position reachable from a legal start the right being set implies both pieces are
home, and **the two new guards never fire**. A mutation to a guard that never fires cannot change a
perft node. Measured rather than argued: **all five mutants survive `PERFT_DEEP=1` at 32/32.** The same
argument that makes this fix safe for legal play makes the entire perft apparatus unable to certify it.

### What the criteria actually did, measured over 62 mutants

```
PERFT (A8/A9)  29 kills   ·   the four legal-castle CONTROL rows  26   ·   moves.test.ts 22
apply.test.ts  21         ·   A5 14   ·   A6 13   ·   A4 9   ·   A3 / A1 / A2 7 each
A7             ZERO
```

**`A7` killed nothing.** The ticket already says it asserts count *equality* rather than
*correctness*; that was measured on one build at refinement and is now measured on 62. Keep it as the
standing purity walk `## Test notes` 2 asks for, but its green is not evidence about this fix and
should not be cited as any. **The four legal-castle control rows are load-bearing and one mutant proves
it alone:** swapping black's kingside and queenside `rookFrom` entries dies to the controls and
nothing else — not even perft, because in any legally-reachable position with a black right both black
rooks are home, so the swapped table still finds a rook.

### One further hole, honestly NOT an `A1`–`A10` gap, recorded because it is next door

Deleting the **pre-existing** castling-right test passes the whole 337-test default suite including all
twelve criteria, offering a castle on `4k3/8/8/8/8/8/8/R3K2R w - - 0 1` (70 diverging positions).
**`A9` does kill it** — deep lane 31/32, measured — because a king that steps off `e1` and back leaves
both pieces home with the right cleared, which is reachable by legal play. So this is a hole in the
**default** lane, not in the acceptance net, and it is **not charged against `ABC-009`**: the right is
not one of the two **board** preconditions this ticket owns. The new rows below now kill it in the
default lane too.

### Closed in TESTS ONLY — and proved load-bearing

`src/moves.castling.hardening.test.ts` — **NEW, 19 tests, all passing on the delivered fix.** A new
file rather than additions to `src/moves.castling.test.ts`, so that **every** test file that existed
before this hop is byte-identical: all fourteen `*.test.ts` files on `main` are unmodified (checked by
diffing each **individually**, not by inspection) and the Engineer's own acceptance file is untouched.
`A8`'s line-level requirement therefore holds for this role's work exactly as it did for the
Engineer's.

```
                       delivered net      with the hardening rows
62 mutants             47 killed          53 killed
                       15 survived         9 survived
```

**Six mutants die to these rows and to nothing else in the suite** — the two queen-impostor mutants to
the piece-type rows, the three loop-abandon mutants to the two-rights rows, and the right-test mutant
to the no-right rows — so each group is independently load-bearing. **The nine behaviour-equivalent
survivors still survive: these rows kill zero of them.** That is the property that matters most about
an added test — it pins observable behaviour, not the shape of the implementation. A row that had
killed the colour-blind mutant would have been the theatre the correction block rejected.

The two-rights rows assert the surviving castle **by name** (`e1c1`, `e1g1`, `e8c8`, `e8g8`), not by
count, because a count alone cannot tell *"the invalid one was rejected"* from *"the valid one was
dropped and something else appeared"*. Two enemy-queen assertions are included and are **labelled in
the file as a recorded measurement rather than a criterion**, precisely because they pass on the
unfixed tree too.

### Gates as they ran, re-run by this role on the tip and never inherited

| gate | command | before the added rows | after |
|---|---|---|---|
| lint | `npm run lint` | exit 0, 2 pre-existing `biome.json` infos | exit 0, same 2; `npx biome check` on the new file alone reports **zero** |
| typecheck | `npm run typecheck` | exit 0 | exit 0 |
| unit | `npm test` | **337 passed (337) on 15 files** | **356 passed (356) on 16 files** |
| build | `npm run build` | exit 0 | exit 0 |
| skip count | the `AGENTS.md` command | **0** | **0** |
| deep perft (`A9`) | `PERFT_DEEP=1 npx vitest run src/perft.test.ts` | 32/32, 39.52 s | **32/32 exact, 38.35 s** |
| e2e | — | `UNKNOWN - verify` | `UNKNOWN - verify` |
| test-integrity checker | `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0` | **exit 2** | **exit 2** |
| auto-UAT oracles | `node scripts/check-uat-oracles.js` | `UNKNOWN - verify` — absent | `UNKNOWN - verify` |

**Exit 2 is recorded as an ERROR and NOT as a pass.** `.grugops/test-skips.md` does not exist (`ls`,
not assumed); Workflow 05 step 3 makes exit 2 *"the checker could not run"*, distinct from the exit-1
human-only short-circuit. **No registry file was created** — an agent may not author a justification to
clear its own gate, and with a skip count of 0 nothing is owed one.

**Fifth independent derivation of the fifteen counts**, not required of this role and done anyway: all
fifteen `A1`–`A6` rows hold, each over all 128 board bytes **and** the five scalars with **zero bytes
changed**; `A2` reads 3, 3, 3; the `FLAG_CASTLE` count is 0 in `generateMoves` **and** `legalMoves` on
every row. Both over-rejection controls hold — kiwipete **48 / 2 castles still offered**,
`r3k2r/8/8/8/8/8/8/R3K2R b KQkq - 0 1` **26 / 2** — and the four legal castles read **15 / 16 / 15 /
16, one castle each**. No discrepancy against the four prior derivations, and nothing was adjusted.

**One figure of this role's own, corrected rather than deleted.** A first deep-lane run in the scratch
copy read **544 tests in 211 s** with a failure. That was an artefact of this role's own making — the
differential probe had written seventeen copies of `src/` inside the vitest root, and
`vitest run src/perft.test.ts` matched all of them (544 = 17 × 32). Moved out and re-run, the lane
reads 32/32. Recorded because a 211-second deep lane with a red test would have been a serious-looking
false alarm.

### `NFR-001` — deliberately NOT re-measured here

Security/NFR follows this hop and owns that bar; **no throughput figure anywhere in this role's output
is its own** and `npm run perft` was not run. The part of the Engineer's measurement that matters is
its caveat, and it is honest: the instrument's **per-cell floor is ~±1%**, established by two
structurally-zero cells and a byte-identical twin reading up to 1.0126 — larger than any signal the
change could produce. So **kiwipete's 0.9930 is NOT a 0.7% regression** and no per-cell number is
claimable; only the aggregate against the ≥ 0.98 bar is load-bearing, and it is met with a margin
exceeding the resolution.

One risk is routed to that gate: **the guard-ORDERING rationale is gate-unverifiable.** Moving both
guards below the emptiness test, below the through-check test, or above the right test is
behaviour-equivalent (zero divergence over 12,584 accepted positions) and therefore invisible to every
test, while `NFR-001`'s own floor exceeds the effect. The cheap-tests-first reasoning is sound and
rests on reading, which is the honest place for it to rest.

### Risks carried, each with an owner

1. **`G-1` and `G-2` are closed in TESTS but not in the criteria — owner BA/PM, medium.** `A5`/`A6` and
   `## Test notes` 3 still say *"at least two piece types"*, and no criterion still varies the number
   of rights held. The behaviour is pinned so a regression is caught; what is missing is the
   *specification*, which is what let this class recur on `ABC-015`, `ABC-018` and `ABC-009`.
2. **`A7` discriminated nothing across 62 mutants — owner BA/PM, low.**
3. **The castling-right test is guarded in the whole suite only by a 40-second opt-in lane — owner
   BA/PM or Architect, low.** Not charged against this ticket.
4. **The guard-ordering rationale is gate-unverifiable — owner Security/NFR, low.**
5. **`NFR-001` un-re-measured by QE and owed at the next gate — owner Security/NFR.**
6. **`ABC-022` half (b) is live BY DESIGN — severity none.** Not tested here and not a miss.
7. **Test-integrity checker exit 2 — an ERROR, not a pass, and human-owned.** E2E and the auto-UAT
   oracles are `UNKNOWN - verify`, not green.

### What this hop does NOT establish

- **That `A1`–`A10` plus the new rows is complete.** 62 mutants is twelve times the Engineer's five and
  still not a proof. Nine survivors remain and this role argues all nine equivalent — measured over an
  enumerated corpus, not over the position space.
- **That the equivalence results generalise beyond the corpus.** 12,584 accepted positions with at most
  four pieces is not the position space. The mechanism argument says no blocker can change the result;
  only the corpus is measured.
- **A terminal Workflow 05 verdict.** `READY_FOR_HUMAN_REVIEW` is the gate's to emit and no §14 gate
  exists in this install. **No `finding` was written and nothing is self-stamped.**
- **Any coverage figure.** None measured — `## Problem` is explicit that a test which only raises
  coverage adds nothing here.
- **Anything about `ABC-010`.** Its stated scope would reject every FEN in this ticket including the new
  rows'; what it implements is its own gate's to establish.

## Security / NFR

**GATED AND MOVED `In Security/NFR` → `Ready for UAT` 2026-08-09 by Security/NFR** (task
`ticket-to-pr-ABC-009`, subtask `sec-abc009-nfr`, Workflow 04), on branch
`grugops/ticket-to-pr-ABC-009`. Verdict **PASS WITH RISKS**. `In Security/NFR` 1/2 → 0/2,
`Ready for UAT` 0/4 → 1/4; no limit approached, no override taken, no written reason owed.
**Nothing merged and nothing deployed — a human holds both, and the owner's standing merge authority
is NOT deploy authority.**

Gated against `security.asvs_level` **L1** and `security.block_on` **high**. `compliance_regime` is
**`[]`**, so **no Compliance Officer hand-off is owed** — recorded rather than silently omitted.
**No required fix is outstanding and no high-severity item exists to block on.**

**Nothing above this section was edited.** The `## Acceptance` criteria, BA/PM's correction block,
`## Scope`, `## Out of scope`, `## Reproduction`, the escalation block, the `NFR-001` bar,
`## Test notes`, the Engineer's `## Implementation` and QE's `## QE` all stand exactly as they were
— the two frontmatter lines are the only deletions in this role's whole diff. **This gate changed no
production code and no test:** `src/moves.ts` still hashes `0e247853ab2c05887c76105ff83d8621` and
`git diff 8f540cf -- src/moves.ts` is empty. Repairing an implementation to make this gate's own
verdict come out green is not this role's, and there was nothing to repair.

### The gates, re-run here and never inherited

| gate | command | result |
|---|---|---|
| lint | `npm run lint` | **exit 0**, 2 pre-existing `biome.json` infos |
| typecheck | `npm run typecheck` | **exit 0** |
| build | `npm run build` | **exit 0** |
| unit | `npm test` | **356 passed (356) on 16 files** |
| skip count | the `AGENTS.md` command | **0** |
| deep perft (`A9`) | `PERFT_DEEP=1 npx vitest run src/perft.test.ts` | **32/32 exact, 38.49 s** |
| test-integrity checker | `node tools/grugops/test-skip-integrity.js …` | **exit 2 — an ERROR, not a pass** |
| e2e / auto-UAT oracles | — | `UNKNOWN - verify` |

`.grugops/test-skips.md` does not exist (`ls`, not assumed) and **no registry file was created** — an
agent may not author a justification to clear its own gate. `A9` is now on its **third** independent
run and all three agree: 36.93 s (Engineer), 38.35 s (QE), 38.49 s (here).

### `NFR-001` / `A10` — MET on both clauses, re-derived on this gate's own instruments

Nothing inherited: the Engineer measured, QE explicitly declined to re-derive, and every figure below
is this gate's own, on **Apple M3 (Mac15,13) / Node v24.12.0 / Darwin 25.5.0 arm64**,
**`UNKNOWN - verify`** elsewhere.

**Clause 1 — the floor. MET.** `npm run perft`, three runs: **6,030,518 / 6,136,238 / 6,117,496
nodes/sec** against ≥ 1,000,000 — about **6.1x**. *(One honest difference from the Engineer: the
lowest run sits **0.16% UNDER** the catalog's standing 6.04M–6.21M band. Scatter on one run, recorded
rather than rounded into the band, and **no baseline moved**.)*

**Clause 2 — the ratio, in one process. MET on two independent samples.** Three trees in a single
process — pre-fix (`fb4fa40934e768dffeaeed0b43548842`), delivered
(`0e247853ab2c05887c76105ff83d8621`), and a **byte-identical TWIN as a null control by identity**,
the twin `cmp`-verified equal on **all thirteen** non-test files and `pre` verified to differ from
`post` in `moves.ts` **and nothing else** — 12 rounds with round 0 discarded, tree **and** cell order
rotated every round, `parseFen` hoisted **out of every clock**, medians of per-round rates, checksum
**409,605,192** nodes per sample, harness held outside the repository.

```
                        SAMPLE 1                        SAMPLE 2
cell         rights   post/pre   twin/post      post/pre   twin/post
startpos     KQkq      0.9932     1.0072         1.0034     1.0024
kiwipete     KQkq      1.0228     1.0049         1.0052     1.0047
position-3   -         0.9959     1.0070         1.0063     1.0038   <- structurally zero
position-4   kq        1.0048     1.0005         1.0037     0.9963
position-5   KQ        0.9863     1.0202         0.9936     1.0056
position-6   -         0.9926     1.0182         0.9966     1.0078   <- structurally zero

AGGREGATE              1.0062     1.0096         0.9967     1.0087
```

**Aggregate 1.0062 and 0.9967 against ≥ 0.98 — MET**, worst single cell 0.9863.

### The Engineer's ±1% instrument floor: the reasoning HOLDS, the estimate is OPTIMISTIC, and it was not the end of the road

Calibrating against cells whose true delta is provably zero, plus an identity twin, is the strongest
null control available, and *"no per-cell number is claimable"* is the correct conclusion from it.
**An honest "the instrument cannot resolve this" is a result** and it is not treated here as a
failure. Three things are added:

- **The floor is bigger than reported.** This gate measures **±2.0% per cell** against their ~±1%,
  and characterises an **AGGREGATE** floor nobody had: the twin reads **+0.96% / +0.87%**, and three
  of four aggregate twin readings across both gates sit near **+0.9%** — a *systematic*, not scatter,
  which this gate **cannot attribute**. The bar's margin is 2 points, so *"the margin exceeds the
  resolution"* holds by about **2x**, not comfortably.
- **One wording overshoot.** *"kiwipete's 0.9930 is NOT a regression"* is stronger than a noise floor
  can license — a floor supports only *"the instrument cannot resolve whether it is one."* Their note
  states the correct form elsewhere, so this is a phrasing inconsistency, not a false result.
- **The question is resolvable, and it is now resolved in the change's favour** — below.

### What resolves it: move the question off the clock and onto a COUNT

The same move `plans/nfr-catalog.md` already made for `NFR-005`'s call-count sub-bar. `npm run perft`
dilutes the two added lines ~35x (97.18% of counted nodes are free leaves — re-derived here against
the catalog's 97.3% — and every generating node also pays the make/test/unmake filter).

**The count, exact and noise-free.** Over the exact `npm run perft` population the two added lines
execute **198,175 times each — 396,350 total — across 11,377,922 counted nodes**, and **reject
nothing in any cell (0 failures out of 198,175 each)**. That confirms **empirically, over 11.4M
nodes**, the structural fact that `makeMove` only ever *clears* a right (`src/apply.ts:142`), so a
held right in a reachable position implies both pieces are home. `position-3` and `position-6`
execute them **zero** times — the structurally-zero property established by count rather than by
argument.

**The isolated cost, with its own null control.** Exporting `addCastlingMoves` in scratch copies
removes both dilutions. On startpos the pair costs **+1.30 and +1.73 ns per call** against a
null-control floor of **±0.22 ns** — resolved, a signal 6–8x its local floor — giving **~0.33–0.43 ns
per execution**; the structurally-zero cell reads **+0.24 / +0.33 ns**.

**The two combined — labelled ARITHMETIC, not a measurement:** `396,350 × 0.33–0.43 ns =
0.131–0.170 ms` on a 1.854–1.887 s sweep = **0.0070%–0.0091%**. **True `post/pre` ≈ 0.9999**, against
a bar that allows 2%. Robust to a 10x error in the multiplier (0.085%, still 20x inside the bar).
**For kiwipete specifically: 320,950 added executions over its ~0.66 s subtree = 0.0194%, so its true
ratio is ≈ 0.9998** — the 0.9930 reading is ~35x the true deviation and this gate's own 1.0228 is
~115x it the other way. **Both are noise; the truth is 0.9998, and the Engineer's conclusion is
positively established rather than merely unrefuted.**

### Guard ordering, routed here by QE as gate-unverifiable — the behaviour half is DISCHARGED

**The ordering of the five guards is NOT load-bearing, and no later reorder can silently break the
equivalence QE's `G-1`/`G-2` analysis relied on.** The five guards are a **conjunction of
side-effect-free predicates over an unmutated position** — verified rather than assumed:
`isSquareAttackedBy` and `raySliderAttacks` perform **no writes**, `board` is a
`readonly Uint8Array(128)`, and every index the frozen `CastleOption` table names is in bounds, so
**no guard depends on an earlier one for safety**. A conjunction is permutation-invariant, so the
emitted move set is identical under **any** of the 120 orderings. **Measured:** three reorderings ×
**33 FENs** (all twelve leaking rows, the four legal castles, both over-rejection controls, QE's
`G-1` and `G-2` FENs, all six perft roots) = **99 comparisons, ZERO divergence** at `generateMoves`,
at `legalMoves` and on purity, with **all six exact perft counts holding for every variant**.

QE's mechanism (*"`option.empty` is tested before the through-check"*) is sound but stronger than its
conclusion needs. Restated as a conjunction — *an option is emitted only if all five hold, so `empty`
has passed whenever a castle is emitted* — **the argument is reorder-proof**, and that is the durable
form.

**The cost half is real and lives on the class this ticket exists for.** On
`4k3/8/8/8/8/8/8/K7 w KQ - 0 1`, `addCastlingMoves` costs **522–526 ns pre-fix** against **27.9–28.1
ns delivered** — an **~18x** saving, because the byte compare rejects **above the attack scan**;
moving the guards below the through-check gives all of it back (**+481 ns**).

**But the stated reason is inverted for the population `NFR-001` measures, and this is the one place
this gate disagrees with the Engineer.** The comment reasons from per-test cost; the right criterion
for ordering a conjunction is cost against **selectivity**, and measured over the perft sweep the two
added guards are **0.0% selective** (0 rejects in 198,175 executions each) while `empty` rejects
**17.6%** and the through-check **14.1%** of what reaches them. In exact executions the delivered
order is the **second-most-expensive of four**: above-right 1,284,772 > **delivered 396,350** >
below-empty 326,476 > below-through 280,302.

**NO CHANGE IS ASKED FOR.** The penalty is ~**0.003%** of the sweep, far below resolution; the
invalid-class benefit is real and points the other way; and churning a correct guard for it is the
refactor coding rules 5, 9 and 10 forbid. The sharper reason is recorded instead: the placement earns
its keep not because a byte compare is cheap, but because sitting above the attack scan it avoids an
18x cost on exactly the malformed input it exists to reject. **Nothing pins the ordering and nothing
can** — invariance means no test could ever fail on a reorder — so it rests on the code comment,
which is the honest place for it.

### Security classification — RELIABILITY, NOT SECURITY. Re-asked at the source; no trigger manufactured.

- **No injection sink.** Zero `eval` / `new Function` / `vm` / `require`, zero `child_process` /
  `exec` / `spawn`, zero HTML / XML / SQL / URL / `fetch` sinks, zero `node:net|tls|http|https|dgram`
  imports in non-test `src/` — each grepped, not assumed.
- **No trust boundary.** `addCastlingMoves` is **module-private**; its only caller is `generateMoves`,
  whose only non-test caller is `legalMoves` (`src/legal.ts:46`). **No `process.argv`,
  `process.stdin`, `process.env` or `readFileSync` appears in `src/moves.ts` at all.** Positions
  enter only through `parseFen`, whose non-test callers are `history.ts` and `perft-bench.ts`
  (hardcoded FENs). **No user-supplied string reaches `src/moves.ts`**, and there is no CLI entry
  point.
- **No privilege, no data exposure, no secrets, no personal data, no authn/authz, no network, and no
  crypto used as a security control.**
- **QE's queen-destroying result does not change the class.** It is a worse *reliability* consequence
  — silent material loss and a piece-type change — of a **mutant that was never shipped**.
- **The one security-adjacent question this change touches was asked and comes out in its favour:** a
  DoS-shaped cost on malformed input. Measured — the delivered order makes an invalid position **~18x
  cheaper** in this function.

**ASVS L1 counted at the source: 70 active requirements, and V16 and V17 carry no L1 requirement at
all** (29 rows between them, zero at L1) — checked, not assumed. **V2.1.1 PASS** (`## Scope` and
`## Security / NFR triggers` are the documented validation rule, with the rule stated as *"the moving
side's `KING` byte and no other"*); **V2.2.1 PASS on this module** — the guards are positive
validation against an expected structure, an allow-list of exactly one byte value per square — **with
the boundary half still open and owned by `ABC-010`**, by design; **V2.2.2 PASS by analogue** (the
guard sits in the rules core, so no caller is trusted to pre-validate — exactly why the
`legalMoves`-layer filter was rejected); **V2.3.1 PASS by analogue**, the closest row to the routed
ordering question; **V5.2.1 PASS by analogue**; **V15.3.1 PASS by analogue**. **V15.1.1 / V15.2.1 NOT
MET**, carried with the standing high→low override and its evidence re-checked here (runtime
`dependencies` is `{}`; `package.json` and `package-lock.json` byte-identical to `main` on this
branch), owner Architect/Design at `EPIC-006`. **V13.4.1 DEFERRED**, unchanged and not relaxed. **V7
session management is N/A and is named rather than skipped.** Everything else structurally N/A.

### Logging and failure modes

`src/moves.ts` logs nothing, and the only logging in non-test `src/` is `perft-bench.ts`'s
`console.log`. A failure mode with no log is normally exactly what this gate flags. **It does not
apply here, and the reason is this ticket's whole point:** the defect was silent by construction and
the fix **eliminates the failure** rather than instrumenting it, so there is no later incident to
diagnose. No logging is asked for (coding rules 5 and 8).

### The risks carried, none high, each with a named owner

1. **`G-1` and `G-2` closed in TESTS but not in the criteria — owner BA/PM, MEDIUM.** Deliberately
   **not** discharged here: `## Acceptance` is BA/PM's and this gate did not touch it.
2. **`A7` killed nothing across 62 mutants — owner BA/PM, low.**
3. **The castling-right test is guarded in the default lane only by QE's rows — owner BA/PM or
   Architect, low.** Not charged against `ABC-009`.
4. **Guard ordering — owner Architect/Design at `ABC-010`/`EPIC-003`, low. RESHAPED, not carried as
   received:** behaviour discharged; what remains is that nothing pins it and that, if user FENs are
   ever admitted, a reorder below the through-check restores an 18x cost on malformed input.
5. **`NFR-001` per-cell figures are noise and must never be quoted — owner Security/NFR, low.** The
   **tenth** instrument-limit correction on this project's record.
6. **`NFR-001` has no guard in the suite — owner Security/NFR at `EPIC-004`, low.** No wall-clock
   assertion belongs there; a call-count assertion is possible but **not asked for** at 0.01%.
7. **`ABC-010` unbuilt, so the invalid FEN is still ACCEPTED at the boundary — owner `ABC-010`, low.**
   By design; `## Out of scope` says so.
8. **`ABC-022` half (b) live BY DESIGN — severity none.** Fenced, not tested here, not a miss.
9. **`A1`–`A10` plus QE's rows still not PROVEN complete — owner QE / BA-PM.** Nine equivalent
   survivors stand on an enumerated corpus, not the position space.
10. **Test-integrity exit 2, E2E and the auto-UAT oracles `UNKNOWN - verify` — human-owned.**

### UAT — DEFERRED and explicitly NOT passed

There is no CLI entry point and no runnable game until `EPIC-006`, so **there is no surface a human
can exercise and a UAT pass would be a fabrication.** What a human must eventually check is named in
the traceability row rather than left implicit: that a game played through the real CLI never offers
a castle the rules forbid, and that the board a player sees after a `moves` or status query is
byte-for-byte the board they had before it.

### What this gate does NOT establish

- **That the criteria are complete.** Not this gate's, and not discharged here.
- **A terminal Workflow 05 verdict.** No §14 gate exists in this install. **No `finding` was written
  and nothing is self-stamped**; `context.human_admission` is `off`.
- **That 0.33–0.43 ns/execution generalises off startpos** — one resolved cell, which is why the
  arithmetic carries a 10x robustness bound.
- **A cause for the twin's ~+0.9% aggregate systematic** — observed across two gates, not attributed.
- **Any figure for non-M3 hardware** — `UNKNOWN - verify`.

## QE — second hop: `A11` closed as a DIMENSION

**BROKEN-TESTED AND MOVED `In Review` → `Ready for UAT` 2026-08-09 by QE/E2E** (task
`ticket-to-pr-ABC-009`, subtask `qe-abc009-a11`, Workflow 04), on branch
`grugops/ticket-to-pr-ABC-009`. Verdict **PASS**. `In Review` 1/3 → 0/3, `Ready for UAT` 0/4 → 1/4;
no limit approached, no override taken, no written reason owed. **Nothing merged and nothing deployed
— a human holds both, and the owner's standing merge authority is NOT deploy authority.**

**Nothing above this section was edited — including `## Acceptance`.** `A11`'s own `⚠️ NOT YET
SATISFIED BY THE SUITE` marker and the `## Acceptance` preamble line that carries it are **now stale
and are left standing**: they are BA/PM's text, this role does not edit criteria, and *the one thing
this hop must not do is let the role that wrote the rows also mark the criterion satisfied.* That is
the exact failure this hop exists to repair — three roles in a row certified a sample as a dimension.
Retiring the marker is **routed to BA/PM as risk 1** with the measurement to check it against.

### Why this hop existed, stated plainly against this role's own first hop

The first QE hop closed the **queen** and called the piece-type dimension closed. It was not. Four
rows for one piece type is a third sample, not a quantifier — and BA/PM then measured three further
builds of the same shape passing everything, one of which (*the king's square read as "own KING or own
ROOK"*) **destroys a rook and writes a king over it** on `4k3/8/8/8/8/8/8/K3R2R w K - 0 1`. This
role's rows were the ones that were not enough, and that is the honest way round to say it.

### What was added: TEST ROWS AND ZERO PRODUCTION LINES

`src/moves.castling.hardening.test.ts` — **19 tests → 34**, in the file this role already owns. **No
production line changed:** `src/moves.ts` still hashes `0e247853ab2c05887c76105ff83d8621` and
`git diff 8f540cf -- src/moves.ts` is empty. **All fourteen `*.test.ts` files that exist on `main`
are unmodified** (checked by iterating `git ls-tree main -- src` and diffing each **individually**,
not by inspection), and the Engineer's acceptance file `src/moves.castling.test.ts` is byte-identical
— so `A8`'s line-level requirement holds for this hop as it did for the previous two.

- **The two `QUEEN_ON_*` tables became `IMPOSTOR_ON_*` tables that enumerate EVERY own piece type**
  the square can hold — 12 rows on the king's home square (`QUEEN`, `ROOK`, `BISHOP`, `KNIGHT`,
  `PAWN`) and 10 on the rook's (`QUEEN`, `BISHOP`, `KNIGHT`, `PAWN`). The eight queen rows are carried
  through verbatim, FENs and counts unchanged; **14 rows are new.**
- **Each type appears in at least TWO (colour to move, castling side) configurations**, and all four
  configurations appear in each table. Measured as load-bearing rather than assumed for symmetry —
  see the two conditional mutants below.
- **The bishop and knight rows deliberately repeat `A5`/`A6` rows.** `A11`'s enumeration has to be
  exhaustive **where it is written**; a table that leans on another file's row set for two of its five
  types is not a quantifier.
- **One new test asserts the QUANTIFIER ITSELF**, so exhaustiveness is a property and not a comment:
  the piece-type universe is **derived by probing `parseFen`** with every letter of the alphabet on
  two boards (a white piece needs a white king elsewhere; the white-`KING` probe needs h1 to *be* that
  king), and the two tables are required to cover that universe minus the legal occupant. Delete a row
  and it goes red; **add a seventh parseable piece type and it goes red until `A11` gains a row.**
  `## Scope` binds the contract to *"every position it accepts"*, so `parseFen` is the domain's
  authority — not a second hand list that can drift from it.
- **Every row asserts the EXPERIMENT before the outcome** (`expectImpostorSetup`): the named own piece
  really stands on the square under test, **the other precondition really HOLDS** so exactly one
  condition can be the reason the castle is refused, and exactly the one right is held.

### `A11` measured on the delivered tree — a SEVENTH independent derivation, and every row holds

`FLAG_CASTLE` counted in `generateMoves` **and** in `legalMoves`; state compared over all 128 board
bytes **and** all five scalars; `toFen` asserted beside the bytes for a legible failure.

```
KING's home square, matching rook present         legalMoves  castles gen/legal  state
own QUEEN    4k3/8/8/8/8/8/8/K3Q2R w K - 0 1          31           0 / 0         pure
own QUEEN    4k3/8/8/8/8/8/8/R3Q2K w Q - 0 1          32           0 / 0         pure
own QUEEN    k3q2r/8/8/8/8/8/8/4K3 b k - 0 1          31           0 / 0         pure
own QUEEN    r3q2k/8/8/8/8/8/8/4K3 b q - 0 1          32           0 / 0         pure
own ROOK     4k3/8/8/8/8/8/8/K3R2R w K - 0 1          24           0 / 0         pure   NEW
own ROOK     k3r2r/8/8/8/8/8/8/4K3 b k - 0 1          24           0 / 0         pure   NEW
own BISHOP   4k3/8/8/8/8/8/8/K3B2R w K - 0 1          19           0 / 0         pure   NEW (= A5 r1)
own BISHOP   k3b2r/8/8/8/8/8/8/4K3 b k - 0 1          19           0 / 0         pure   NEW (= A5 r4)
own KNIGHT   4k3/8/8/8/8/8/8/K3N2R w K - 0 1          16           0 / 0         pure   NEW
own KNIGHT   4k3/8/8/8/8/8/8/R3N2K w Q - 0 1          17           0 / 0         pure   NEW (= A5 r2)
own PAWN     4k3/8/8/8/8/8/8/K3P2R w K - 0 1          13           0 / 0         pure   NEW
own PAWN     r3p2k/8/8/8/8/8/8/4K3 b q - 0 1          14           0 / 0         pure   NEW

ROOK's home square, king already home
own QUEEN    4k3/8/8/8/8/8/8/4K2Q w K - 0 1           21           0 / 0         pure
own QUEEN    4k3/8/8/8/8/8/8/Q3K3 w Q - 0 1           22           0 / 0         pure
own QUEEN    4k2q/8/8/8/8/8/8/4K3 b k - 0 1           21           0 / 0         pure
own QUEEN    q3k3/8/8/8/8/8/8/4K3 b q - 0 1           22           0 / 0         pure
own BISHOP   4k3/8/8/8/8/8/8/4K2B w K - 0 1           12           0 / 0         pure   NEW (= A6 r1)
own BISHOP   4k2b/8/8/8/8/8/8/4K3 b k - 0 1           12           0 / 0         pure   NEW (= A6 r3)
own KNIGHT   4k3/8/8/8/8/8/8/4K2N w K - 0 1            7           0 / 0         pure   NEW
own KNIGHT   4k3/8/8/8/8/8/8/N3K3 w Q - 0 1            7           0 / 0         pure   NEW (= A6 r2)
own PAWN     4k3/8/8/8/8/8/8/4K2P w K - 0 1            6           0 / 0         pure   NEW
own PAWN     p3k3/8/8/8/8/8/8/4K3 b q - 0 1            6           0 / 0         pure   NEW
```

**Every figure BA/PM published for `A11` reproduced exactly**, and the four mirrors it measured
(`R3Q2K w Q` 32, `k3q2r b k` 31, `r3p2k b q` 14, `p3k3 b q` 6) reproduced too. The five counts this
role derived first — `k3r2r b k` 24, `k3b2r b k` 19, `R3N2K w Q` 17, `4k2b b k` 12, `N3K3 w Q` 7 —
agree with `A5`/`A6`'s published values where the FEN is shared. **No discrepancy against any prior
derivation and nothing was adjusted in either direction.** The four legal castles still read
**15 / 16 / 15 / 16 with exactly one castle each**, and kiwipete **48 with both castles still
offered** — the over-rejection controls hold.

### The kill/survive table: the DIMENSION is closed, and the equivalents are untouched

Twenty mutants of the **delivered** diff, each applied to a copy of `src/` held **outside** the
repository, each asserting its anchor **unique** and its bytes **changed** before running (otherwise
`HARNESS-ERROR`, never `SURVIVED` — and that path **fired**: nine mutants were mis-generated on the
first sweep and the harness refused to score them rather than reporting nine false survivors), each
`tsc --noEmit`'d so a broken build cannot be a survivor, each restored with `src/moves.ts` re-hashed
afterwards. Both test files run per mutant with a JSON reporter, so failures are attributed by name.

```
MUST DIE — one further own piece type admitted, the whole dimension
mutant (guard reads "own X or own Y")      acceptance  hardening  full suite   killed by
KING's square admits own QUEEN                33/33      30/34     367/371     hardening
KING's square admits own ROOK                 33/33      32/34     369/371     hardening      <- was OPEN
KING's square admits own BISHOP               29/33      32/34     365/371     both
KING's square admits own KNIGHT               31/33      32/34     367/371     both
KING's square admits own PAWN                 33/33      32/34     369/371     hardening      <- was OPEN
ROOK's square admits own QUEEN                33/33      30/34     367/371     hardening
ROOK's square admits own BISHOP               31/33      30/34     365/371     both
ROOK's square admits own KNIGHT               32/33      32/34     368/371     both
ROOK's square admits own PAWN                 33/33      32/34     369/371     hardening      <- was OPEN
admits own PAWN on the king's square ONLY when black is to move
                                              33/33      33/34     370/371     hardening
admits own KNIGHT on the rook's square ONLY queenside
                                              32/33      33/34     369/371     both

MUST SURVIVE — the nine behaviour-equivalent mutants, ALL NINE STILL SURVIVING
colour-blind on the king's square / rook's square / both     33/33  34/34  371/371   survived
king guard `continue` → `break` / → `return`                 33/33  34/34  371/371   survived
both guards below `empty` / below the through-check / above the right test
                                                             33/33  34/34  371/371   survived
an extra "rook square non-EMPTY" condition (subsumed)        33/33  34/34  371/371   survived

20 mutants · 11 killed · 9 survived · 0 verdict mismatches · 0 broken builds
```

**The three mutants that passed the entire net before this hop now die, and they die to these rows
alone.** The dimension is closed rather than sampled: **every** own piece type on **either** home
square is now pinned, and the enumeration is itself asserted, so the next admission of a type nobody
has thought of cannot pass by being an example the table happened to omit.

**The nine equivalents kill count is ZERO — that is the property that matters most about an added
row.** Rows that had killed them would pin implementation shape rather than observable behaviour,
which is the theatre BA/PM's correction and the Engineer's fifth-mutant note both rejected.

**The two conditional mutants are why each type carries a second configuration, and they were built
to falsify that choice rather than to decorate it.** The black-only pawn admission is killed by
**exactly one row — the black-queenside pawn row** (`r3p2k b q`); with only BA/PM's white-kingside
pawn row it would have **survived**. The queenside-only knight admission is killed by the queenside
knight row. Six of this ticket's 62 earlier mutants made a guard conditional on side or castle, so
this is a live class and not a hypothetical.

### The harm reproduces on every one of them — ONE PROCESS PER TREE

Recorded because BA/PM's first probe ran four tree states in one process and Node's module cache
served pristine `moves.ts` to every round, producing a false *"the harms don't reproduce"*. Every
measurement below is a **fresh `node` process per tree state**, pristine and mutant alike.

```
KING's home square — one legalMoves() call DESTROYS the occupant and writes a king over it
own QUEEN   4k3/8/8/8/8/8/8/K3Q2R w K   delivered 31 / 0 castles / pure   mutant 32 / 1 / e1: 5 → 6
own ROOK    4k3/8/8/8/8/8/8/K3R2R w K   delivered 24 / 0 / pure           mutant 25 / 1 / e1: 4 → 6
own BISHOP  4k3/8/8/8/8/8/8/K3B2R w K   delivered 19 / 0 / pure           mutant 20 / 1 / e1: 3 → 6
own KNIGHT  4k3/8/8/8/8/8/8/K3N2R w K   delivered 16 / 0 / pure           mutant 17 / 1 / e1: 2 → 6
own PAWN    4k3/8/8/8/8/8/8/K3P2R w K   delivered 13 / 0 / pure           mutant 14 / 1 / e1: 1 → 6
own PAWN    r3p2k/8/8/8/8/8/8/4K3 b q   delivered 14 / 0 / pure           mutant 15 / 1 / e8: 9 → 14
  every king's-square row ends 4k3/8/8/8/8/8/8/K3K2R w K - 0 1 — a phantom king ON TOP of the piece

ROOK's home square — BYTE-IDENTICAL, so only the FLAG_CASTLE count can ever see it
own QUEEN / BISHOP / KNIGHT / PAWN      delivered 21 / 12 / 7 / 6, 0 castles, pure
                                        mutant    22 / 13 / 8 / 7, 1 castle, position UNCHANGED
```

So every mutant these rows kill is a **real defect on a position `parseFen` accepts**, not a shape:
the king's-square family is silent material loss with a piece-type change (`ABC-022` half (a)'s shape
by the castling route) on **every** own piece type, and the rook's-square family confirms `A6`'s own
structural rationale — purity is blind to it and the offer count is the only witness.

### The rows were proved non-vacuous, which is a trap a 22-row table can fall into silently

A row asserting *"no castle is offered"* also passes when its FEN sets up something else entirely, so
a typo would make the table **claim** a type it never tested. `expectImpostorSetup` closes that, and
it was falsified rather than trusted — two deliberate row corruptions in a scratch copy, pristine
source:

```
label PAWN, FEN carrying a BISHOP (count 19 COINCIDES, so every outcome assertion passes)
  -> RED: "the impostor must stand on the square under test: 4k3/8/8/8/8/8/8/K3B2R w K - 0 1"
the matching rook deleted from the king's-square ROOK row
  -> RED: "the OTHER precondition must hold: 4k3/8/8/8/8/8/8/K3R3 w K - 0 1"
```

Without those assertions the first corruption is **invisible**: the table would have carried a row
labelled `PAWN` that tested `BISHOP` twice while the exhaustiveness check read green.

### The gates, re-run on the tip by this role and never inherited

| gate | command | result |
|---|---|---|
| lint | `npm run lint` | **exit 0** after one autofix (below); 2 pre-existing `biome.json` infos |
| typecheck | `npm run typecheck` | **exit 0** |
| unit | `npm test` | **371 passed (371) on 16 files** (356 before these rows) |
| build | `npm run build` | **exit 0** (`tsc --noEmit`) |
| skip count | the `AGENTS.md` `### Test integrity` command | **0** — `A8`'s requirement |
| deep perft (`A9`) | `PERFT_DEEP=1 npx vitest run src/perft.test.ts` | **32/32 exact, 36.04 s** |
| `A8` no existing test modified | every `*.test.ts` on `main` diffed individually | **0 of 14 modified** |
| test-integrity checker | `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0` | **exit 2 — an ERROR, not a pass** |
| e2e | — | `UNKNOWN - verify` — no UI surface and no runnable game until `EPIC-006` |
| auto-UAT oracles | `node scripts/check-uat-oracles.js` | `UNKNOWN - verify` — absent in this install |

**Lint went red once and it was this role's own formatting, fixed and reported rather than smoothed
over:** `biome` wanted a different line break inside one `expect(...)` call. One autofix pass on the
new file alone (`npx biome check --write src/moves.castling.hardening.test.ts`) — **1 of 2
`self_fix_attempts` spent** — then the full `npm run lint` re-run at exit 0. The mutation campaign was
**re-run after the format change** so every number above is against the delivered bytes, verified with
`cmp` between the scratch tree's copy and the repository's file.

**Exit 2 is recorded as an ERROR and not as a pass.** `.grugops/test-skips.md` does not exist (`ls`,
not assumed); Workflow 05 step 3 makes exit 2 *"the checker could not run"*, distinct from the exit-1
human-only short-circuit. **No registry file was created** — an agent may not author a justification
to clear its own gate, and with a skip count of 0 nothing is owed one.

**`NFR-001` was NOT re-measured and no throughput figure here is this role's.** These rows add no
production line and change no code path, so the two guards execute exactly as often as before;
Security/NFR's count-based discharge (**396,350 executions, 0 rejections, ~0.01% of the sweep**)
stands untouched by a test-only change. Re-running the benchmark to "confirm" that would be the
instrument-noise mistake this project has now recorded ten times.

### Risks carried into `Ready for UAT`, each with an owner

1. **`A11`'s `⚠️ NOT YET SATISFIED` marker is now STALE — owner BA/PM, low.** The criterion is met on
   the measurements above; the marker and the `## Acceptance` preamble line are BA/PM's text and are
   **deliberately not edited here**. This is the one item where leaving a false-looking line standing
   is the lesser evil: the role that wrote the rows must not also be the role that marks the criterion
   satisfied, on a ticket where three roles in a row certified a sample as a dimension.
2. **`A11` is closed as a dimension over PIECE TYPE; no dimension bounds the criteria set as a whole
   — owner QE/BA-PM.** Twenty mutants is not a proof, and the previous hop's 62 were not either. The
   two dimensions this file now pins were found by asking what the rows hold constant, which is a
   heuristic, not a decision procedure. **Expect a further class to exist.**
3. **The nine equivalence arguments are still arguments over an enumerated corpus — owner QE, low.**
   Nothing was re-enumerated this hop; the 12,584-position corpus stands as it was, and it is not the
   position space.
4. **`A7` remains inert by construction — owner BA/PM, low.** Not re-measured here, not re-litigated,
   and not cited as evidence about this fix.
5. **`ABC-022` half (b) is live BY DESIGN — severity none.** Fenced, untested here, not a miss.
6. **Test-integrity checker exit 2, E2E and the auto-UAT oracles `UNKNOWN - verify` — human-owned.**
   None of the three is reported as green.
7. **UAT stays DEFERRED to `EPIC-006` and is explicitly NOT passed** — unchanged from the
   Security/NFR gate's ruling, and these rows add no human-exercisable surface.

### What this hop does NOT establish

- **That the criteria set is now complete.** `A11` is closed; completeness is not claimed. Nine
  equivalent survivors remain by design, and the honest expectation after three hops of finding one
  more class each time is that a fourth exists.
- **A terminal Workflow 05 verdict.** `READY_FOR_HUMAN_REVIEW` is the gate's to emit and no §14 gate
  exists in this install. **No `finding` was written and nothing is self-stamped**;
  `context.human_admission` is `off`.
- **Any `NFR-001` or coverage figure.** Neither was measured here. `## Problem` is explicit that a
  test which only raises coverage adds nothing on this ticket.
- **That `A11`'s excluded shapes were re-derived.** The own-`KING`-on-the-rook's-square exclusion and
  the enemy-occupant masking are BA/PM's and the previous hop's measurements, carried and cited, not
  re-measured — except that the enemy-queen assertions already in this file still pass.
- **Anything about `ABC-010`.** Its stated scope would reject every FEN in these rows; unbuilt, and
  not edited.

## QE — third hop: `A13` discharged, the occupant BYTE closed over its whole space

**Eight rows, ten new tests, ZERO production lines.** `src/moves.castling.hardening.test.ts` goes
**34 → 44 tests**; the suite goes **371 → 381 passed (381) on 16 files** at skip **0**;
`src/moves.ts` is still md5 `0e247853ab2c05887c76105ff83d8621` with `git diff 8f540cf -- src/moves.ts`
empty. **Not one of the 14 pre-existing test files on `main` was touched** — each diffed
individually, 0 of 14 modified (`A8`, at line level rather than by inspection).

### The eight rows, and BA/PM's eight counts reproduced with zero disagreements

`A13`'s newly-required region is enemy `KNIGHT` and enemy `PAWN` on both home squares, at `A11`'s
established doubling. BA/PM measured all eight; the Orchestrator re-derived four of them and
explicitly did **not** re-derive `14`, `17`, `19` or the rook-square doubling. **This hop measured
all eight itself, printing the decoded board rather than a verdict, and reproduced every one:**

```
KING's home square — king off home, matching rook present, ENEMY occupant
enemy KNIGHT  W K  4k3/8/8/8/8/8/8/K3n2R w K - 0 1     13  0/0 castles  pure   BA/PM 13  AGREE
enemy PAWN    W Q  4k3/8/8/8/8/8/8/R3p2K w Q - 0 1     14  0/0          pure   BA/PM 14  AGREE
enemy KNIGHT  B k  4N2r/8/8/5k2/8/8/8/4K3 b k - 0 1    17  0/0          pure   BA/PM 17  AGREE
enemy PAWN    B q  r3P3/8/8/5k2/8/8/8/4K3 b q - 0 1    19  0/0          pure   BA/PM 19  AGREE

ROOK's home square — king already home, ENEMY occupant
enemy KNIGHT  W K  4k3/8/8/8/8/8/8/4K2n w K - 0 1       4  0/0          pure   BA/PM  4  AGREE
enemy PAWN    W Q  4k3/8/8/8/8/8/8/p3K3 w Q - 0 1       5  0/0          pure   BA/PM  5  AGREE
enemy KNIGHT  B k  4k2N/8/8/8/8/8/8/4K3 b k - 0 1       4  0/0          pure   BA/PM  4  AGREE
enemy PAWN    B q  P3k3/8/8/8/8/8/8/4K3 b q - 0 1       5  0/0          pure   BA/PM  5  AGREE

labels lying 0/8 · rows inert 0/8 (masked false, blocked false on every row) · disagreements 0/8
```

Nothing was adjusted in either direction, and no discrepancy arose to raise. The instrument
(`isSquareAttackedBy`, used for the inertness column) was **polarity-checked before any verdict was
read** — a black rook on `h1` must report `g1` attacked and a board with no black attacker must
report it unattacked.

### The quantifier is a test, not a comment — and the probe that returned 11 twice returns 13 here

`A13` quantifies over the occupant byte, so the accounting is asserted rather than narrated. The
domain is **derived by probing `parseFen`**, and the probe is built against the failure that caught
two roles: a single probe board that already holds a king of the colour being placed reports **11**,
because `K` and `k` on the target square raise *"position must have exactly one white/black king,
found 2"*. **The king parking varies per attempt** (both kings at `c3`/`f6`, then white only, then
black only), and the measurement is **13 on all six home squares** — `e1`, `h1`, `a1`, `e8`, `h8`,
`a8`, where BA/PM measured three — with a named witness per value and **243 of the 256 `Uint8Array`
values never written** (the sub-16 ones being `7`, `8`, `15`). Third derivation, and the first on the
black mirrors.

The discharge map is then joined against the row tables: the `A11` bucket must equal the piece types
in `IMPOSTOR_ON_*`, the `A13` bucket must equal the types in `ENEMY_ON_*`, the 13 labels must be
exactly the 13 measured bytes for either mover, and exactly one value per square is the required
piece so exactly 12 are wrong. **Delete a row and it goes red; make a fourteenth byte parseable and
it goes red.** Both exclusions are checked at their mechanism instead of inherited — enemy
`KING`/`QUEEN`/`ROOK` must mask the king path on both squares, and all four constructions of an own
`KING` on the rook's home square must be refused by `parseFen`.

### The kill/survive table: four dead, fifteen equivalents untouched

24 mutants of the delivered tree, applied to a copy of `src/` **outside** the repository, each
asserting its anchor occurs exactly once and that the bytes changed, `npx tsc --noEmit` per mutant so
a broken build can never be scored a survivor, `src/moves.ts` re-hashed after every one, and **one
process per tree** throughout.

```
BASELINE (delivered tree)   acceptance 33/33 · hardening 44/44 · full 381/381 · skip 0 · tsc 0

MUST DIE — the identity guard is the ONLY guard against these four bytes
KING's square admits enemy KNIGHT      33/33   42/44   379/381   KILLED   2 A13 rows
KING's square admits enemy PAWN        33/33   42/44   379/381   KILLED   2 A13 rows
ROOK's square admits enemy KNIGHT      33/33   42/44   379/381   KILLED   2 A13 rows
ROOK's square admits enemy PAWN        33/33   42/44   379/381   KILLED   2 A13 rows
   the acceptance file sees NONE of the four — 33/33 on every one

MUST SURVIVE — the three enemy bytes the through-check test masks, on BOTH squares
enemy KING / QUEEN / ROOK on the king's square    33/33  44/44  381/381   all SURVIVED
enemy KING / QUEEN / ROOK on the rook's square    33/33  44/44  381/381   all SURVIVED

MUST SURVIVE — the nine equivalents from the second hop
colour-blind on the king's / rook's / BOTH squares          44/44  381/381  SURVIVED
king guard continue -> break, continue -> return            44/44  381/381  SURVIVED
both guards below empty / below through-check / above right  44/44  381/381  SURVIVED
extra "rook square non-EMPTY" condition                     44/44  381/381  SURVIVED

CONDITIONAL — does the doubling earn its keep?
enemy KNIGHT on the king's square, only when WHITE to move  43/44  380/381  KILLED
enemy KNIGHT on the king's square, only KINGSIDE            42/44  379/381  KILLED
enemy PAWN on the rook's square, only when BLACK to move    43/44  380/381  KILLED
enemy KNIGHT on the king's square, only QUEENSIDE           44/44  381/381  SURVIVED  <- residual
enemy PAWN on the rook's square, only KINGSIDE              44/44  381/381  SURVIVED  <- residual

24 mutants · 7 killed · 17 survived · 0 verdict mismatches · 0 broken builds
```

**The fifteen behaviour-equivalent survivors are the half of this table that matters most.** A row
that killed one of them would pin implementation shape rather than behaviour, and the enemy
`KING`/`QUEEN`/`ROOK` set is unfalsifiable by construction — so a kill there would be a bug in the
row. Killed count on all fifteen: **zero**.

### The harm reproduces on every kill — one fresh process per tree state

```
4k3/8/8/8/8/8/8/K3n2R w K - 0 1   delivered 13 / 0 castles / pure
                                  mutant    14 / 1 / e1: 10 -> 6  ->  4k3/8/8/8/8/8/8/K3K2R w K - 0 1
4k3/8/8/8/8/8/8/R3p2K w Q - 0 1   delivered 14 / 0 / pure
                                  mutant    15 / 1 / e1:  9 -> 6  ->  4k3/8/8/8/8/8/8/R3K2K w Q - 0 1
4k3/8/8/8/8/8/8/4K2n w K - 0 1    delivered  4 / 0 / pure    mutant  5 / 1 / byte-identical
4k3/8/8/8/8/8/8/p3K3 w Q - 0 1    delivered  5 / 0 / pure    mutant  6 / 1 / byte-identical
```

The king's-square family destroys an **enemy** piece and writes a king of the moving side over it —
material loss, a piece-type change **and** a colour change, and the second row leaves **two white
kings on the board**. Strictly worse than `A11`'s own-colour family. The rook's-square family leaves
the position byte-identical, so the illegal `FLAG_CASTLE` offer is the only witness — `A6`'s
structural reason for the third time.

### The rows were falsified, not trusted — and the colour half of the byte assertion is why

Every row asserts its occupant byte (type **and** colour), the other precondition, exactly one right,
and that the identity guard is the **only** refuser. That is not decoration on these values: on the
king's home square enemy `BISHOP`/`KNIGHT`/`PAWN` **all answer 13**, and on the rook's home square
enemy `BISHOP`, enemy `PAWN` and the **EMPTY** square all answer **5**. Three deliberate corruptions
in a scratch copy against pristine source, each going red and naming the input:

```
label KNIGHT, FEN carries an enemy BISHOP — count 13 COINCIDES, every outcome assertion passes
  -> RED: "the ENEMY impostor must stand on the square under test: 4k3/8/8/8/8/8/8/K3b2R w K - 0 1"
          expected 11 to be 10
label ENEMY KNIGHT, FEN carries the mover's OWN knight at the coinciding count 16
  -> RED: "the ENEMY impostor must stand on the square under test: ... K3N2R w K - 0 1"
          expected 2 to be 10   (ONLY the colour half can see this one)
the row made INERT by an own bishop on f1
  -> RED: "the empty squares must be EMPTY: 4k3/8/8/8/8/8/8/K3nB1R w K - 0 1" expected ['f1'] to be []
```

### The gates, re-run on the tip by this role and never inherited

```
lint         npm run lint                                     exit 0 after ONE autofix (below), 2 pre-existing biome.json infos
typecheck    npm run typecheck                                exit 0
unit         npm test                                         381 passed (381) on 16 files
build        npm run build                                    exit 0
skip count   the AGENTS.md ### Test integrity command         0
deep perft   PERFT_DEEP=1 npx vitest run src/perft.test.ts    32/32 exact, 36.79 s
A8 check     every *.test.ts on main, diffed individually      0 of 14 modified
integrity    tools/grugops/test-skip-integrity.js …           exit 2 — an ERROR, NOT a pass
e2e          —                                                UNKNOWN - verify
auto-UAT     node scripts/check-uat-oracles.js                UNKNOWN - verify (absent in this install)
coverage     —                                                UNKNOWN - verify (not measured; mode is lean)
```

**Lint went red once and it was this role's own formatting**, exactly as at the second hop: one
autofix pass on the new file alone (**1 of 2 `self_fix_attempts` spent**), then the full
`npm run lint` at exit 0, and the mutation campaign **re-run afterwards** so no number above
predates the delivered bytes. **Exit 2 stays an ERROR** — `.grugops/test-skips.md` does not exist
(`ls`, not assumed) and **no registry file was created**; an agent may not author a justification to
clear its own gate, and with a skip count of 0 nothing is owed one. **`NFR-001` was NOT re-measured
and no throughput figure here is this role's** — these rows add no production line and no code path.

### The one thing deliberately NOT done, for the second hop in a row

**`A13`'s own `⚠️ NOT YET SATISFIED BY THE SUITE` marker and the `## Acceptance` preamble line that
carries it were left byte-identical.** `## Acceptance` is BA/PM's artifact, and the specific failure
this sequence keeps repairing is a role certifying its own rows as a closed dimension — the fix for
which is not for the role that wrote the rows to also stamp the criterion satisfied. Routed with the
measurements to check it against. **The cost is named rather than hidden:** closing `ABC-009` while
that marker stands would ship a contradiction, so the close needs either a verification hop or an
explicit ruling recorded at the close. That is the Orchestrator's call, not this role's.

### Risks carried, each with an owner

1. **A side-conditional single-type admission survives the net — owner: the follow-up hardening
   ticket, low.** Measured above, not argued. It is **inherited from `A11`'s established doubling
   standard**, where each type's second configuration varies colour rather than side — measured on
   `A11`'s own rows too: own `ROOK`-only-QUEENSIDE and own `BISHOP`-only-QUEENSIDE on the king's home
   square both survive **381/381**. `A11` is **not** reopened by this (it satisfies its own clause,
   and so does `A13`), and closing the class means widening both tables, which is a net-widening
   change beyond `A13`'s stated eight-configuration region.
2. **`A13`'s `⚠️` marker is stale — owner BA/PM / Orchestrator, low.** Above.
3. **The byte space is exhausted for ONE dimension only — owner the follow-up ticket, low.** The
   joint 13×13 pair space (inert today: `src/moves.ts:326-327` are two independent byte compares) and
   the constants no criterion varies are named in `A13` and reserved, not closed.
4. **The equivalence arguments remain arguments over a finite net — owner QE, low.** Fifteen
   survivors survive **this suite**, which is weaker than "are equivalent".
5. **Test-integrity exit 2, E2E, the auto-UAT oracles and coverage `UNKNOWN - verify` — human-owned.**
   None is reported as green.
6. **UAT stays DEFERRED to `EPIC-006` and is explicitly NOT passed.** These rows add no
   human-exercisable surface; a UAT pass would be a fabrication.

### What this hop does NOT establish

- **That the criteria set is complete.** `A13` exhausts the occupant-byte dimension and says so
  itself; completeness of the set is not claimed by anyone.
- **A terminal Workflow 05 verdict.** `READY_FOR_HUMAN_REVIEW` is the gate's to emit and no §14 gate
  exists in this install. **No `finding` was written and nothing is self-stamped**;
  `context.human_admission` is `off`.
- **Any `NFR-001`, perft or coverage figure of this role's.** None measured, at any of its three hops.
- **That 24 mutants is a campaign.** It is not — 62 was called not-a-proof by this same role. These 24
  attack one dimension and the equivalence set that bounds it.
- **That `ABC-009` may be closed.** `Ready for UAT` is not `Done`, UAT is deferred and not passed, and
  no board move was taken at this hop.
