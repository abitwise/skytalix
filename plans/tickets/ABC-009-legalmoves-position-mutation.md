---
id: ABC-009
title: legalMoves mutates the position it documents as unchanged
status: ready
column: Ready
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

Each criterion below is a currently-failing test that must go green, except where marked as a
regression guard. The parenthetical is the measured behaviour on `main` today.

**`A1`–`A6` were rewritten and `A4`–`A6`, `A10` added 2026-08-09** — see the correction block
immediately below. **`A1`, `A2`, `A3`, `A7`, `A8` and `A9` are, in that order, the six criteria this
ticket carried from 2026-07-29**, so the Orchestrator's routing note of 2026-08-09 (which speaks of
"criterion 3", "criteria 1 and 2", "criteria 4, 5, 6") reads onto `A3`, `A1`/`A2`, `A7`/`A8`/`A9`.
**Nothing was reordered and nothing was dropped.**

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
  20, 18, 18.)*
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
  criterion and not a footnote.)*
- **`A7` (the perft-table regression guard — must stay green, and must be present).** **Given** every
  position in the perft suite table (`src/perft.test.ts`), **when** `legalMoves` is called twice on
  each, **then** `toFen` **and all 128 board bytes and all five scalars** are identical before the
  first call, between the calls, and after the second, and both calls return equal move counts.
  *(Today: passes. It asserts count **equality**, not count **correctness** — measured 2026-08-09,
  this criterion passes unchanged on a build that never offers a castle at all, so it is **not** the
  over-rejection oracle. `A8` is.)*
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

The reproduction above is the test. **Five shapes are needed and they are not interchangeable**
*(was two, until 2026-08-09 — see the correction block; the two below are the originals, sharpened)*:

1. **The exact repro cases** — the FENs of `A1`–`A3`, asserted on the **full position state** and on
   move counts. These fail today and are the acceptance bar.
2. **A purity property test across the perft table** — for every standard position, assert the **full
   position state** is stable across two `legalMoves` calls. This is the guard that would have caught
   the defect originally, and it is cheap because the position table already exists. **It is not the
   over-rejection oracle** — `A8` is.
3. **A table keyed on what is PRESENT on each home square, not on what is missing.** *(Added
   2026-08-09; this is `ABC-022`'s test note 1, earned by QE on 2026-08-03 on this same module, where
   two mutants survived 206 tests because the delivered table classified boards by what was
   *absent*.)* `A3` and `A4` are absence rows — an empty rook square, an empty king square. **`A5` and
   `A6` are presence rows and they are the ones that pin identity over occupancy.** Include **at least
   two piece types, both colours of occupant and both colours to move**, and keep the four legal-castle
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

~~Sits in `Backlog`. Promotion to `Ready` is a separate BA/PM step and has not been taken.~~

**Promoted to `Ready` 2026-07-31 by BA/PM** — the separate step named above, taken now. It qualifies
on this board's own `Ready` test and not on its priority: it has **no unbuilt dependency at all**
(the defective code is merged on `main`), which is the one criterion that keeps `ABC-015`..`ABC-019`
in `Backlog`. At `S` (2 points) it is the cheapest correctness win available, and it sits in `Ready`
beside `ABC-011`, the other rules-core defect at `P1`.
