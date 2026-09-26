---
kind: adr
id: ADR-0006
---
# ADR-0006: Castling is not the en-passant case — the key hashes castling RIGHTS, and keeps doing so

## Status

**accepted** — 2026-08-03 by Architect/Design at `ABC-011`'s second design hop (task
`ticket-to-pr-ABC-011`), under the project owner's standing directive of the same date recorded in
`memory-bank/60-progress.md` under **"Standing directive — who decides"**, which retired *"no agent
may mark an ADR `accepted`"* and sends architecture decisions to the Architect.

**No code changes because of this ADR.** `src/zobrist.ts:75-77` already hashes castling rights and
this ADR ratifies that it should keep doing so. It is written because the question was asked by the
project owner in one sentence and will be asked again by whoever builds `EPIC-004`'s transposition
table — and because the answer is *not* the one a reader of `ADR-0005` would guess.

### Why this is a separate ADR and not a sixth clause of `ADR-0005`

Stated so the judgment can be disagreed with rather than inherited.

- **It is a different decision about a different key component**, reached from a differently-worded
  clause of the Laws, and it lands the opposite way. Folding it into `ADR-0005` would stretch one
  record over two rulings, which is how a decision record stops being readable.
- **`ADR-0005` was ratified in the same session**, on evidence three delivery gates had already
  examined. This ruling is new and has been through no gate. Ratifying a document ratifies all of
  it; mixing gated and ungated content under one `accepted` would dilute what the word means here.
- **`ADR-0005` actively invites the wrong inference.** Its title says availability is a legality
  question and the hash asks the rules. Applied to the line directly above the one it is about, that
  reasoning gives the wrong answer. The correction belongs where a maintainer looks for the module's
  decisions, and it needs its own title to be findable.

**The honest counter-argument, recorded rather than suppressed:** this is a no-change conformance
ruling, and this project already set a precedent for those — BA/PM's FIDE 9.6.1 ruling of
2026-08-02 changed no code and got a decision note and a `60-progress.md` line, **not** an ADR. A
reader who thinks this file is gold-plating against the "keep design just enough" limit has a fair
case and a cheap remedy: delete it and keep the decision note. The judgment that overrode it is the
ADR test in the Architect's own role file — *write the ADR for the choice a future maintainer will
curse you for if the why is missing* — and the evidence that this is such a choice is that the wrong
inference was already drawn once, in writing, on 2026-08-03.

## Context

`src/zobrist.ts` XORs one key per held castling right:

```ts
for (let i = 0; i < CASTLE_FLAGS.length; i++) {
  if ((position.castling & (CASTLE_FLAGS[i] as number)) !== 0) key ^= CASTLE_KEYS[i] as bigint;
}
```

`ABC-011` established that the neighbouring en-passant component was wrong for exactly the shape
this looks like: it hashed a **state bit that was written down** rather than a **capability that
actually exists**, and FIDE's definition of "the same position" turns on the capability. `ADR-0005`
fixed that by having the hash module ask the rules module.

The project owner, ruling on `ADR-0005` on 2026-08-03: *"any legal move, even the special ones still
need to be checked."* That endorses the en-passant reading. It also raises the question this ADR
exists to answer and which the Orchestrator deliberately left open rather than assume:
**is castling the same case?** Both readings are defensible from a glance at the clause, and a wrong
answer in either direction is expensive — hashing availability would cost attack detection on a
component set on most nodes, and it is the direction that invents draws rather than missing them.

### The primary text, retrieved rather than remembered

FIDE Laws of Chess, chapter `E012023` — *"taking effect from 1 January 2023"* — retained in this
repository under task `refinement-fide-9-6-1` at
`.grugops/context/refinement-fide-9-6-1/sources/E012023-laws-of-chess-2023.html`, sha256
`e0c8bee28c2dee07b724357b9802fee8591e9d11efd2a910b38e9bd21d3c7643`. **Both the hash and the
currency were re-verified on 2026-08-03 at this hop**, not inherited from the note that retrieved
them: a fresh fetch returned HTTP 200 and bytes **identical** to the retained copy, and FIDE's own
handbook index publishes exactly four Laws chapters — `E012014`, `E012017`, `E012018`, `E012023` —
with nothing after 2023. `E012024`/`2025`/`2026` return the handbook's generic 74,467-byte
soft-404 shell, byte-identical in size to a deliberately nonsensical chapter id. The retention
manifest for that check is at
`.grugops/context/ticket-to-pr-ABC-011/sources/FIDE-CURRENCY-2026-08-03.txt`.

This paragraph exists because of a specific, recent lesson: on 2026-08-01 a remembered Laws sentence
was **verbatim correct and two editions stale**, and only retrieval caught it. The rule learned there
is applied here.

> **9.2.3** Positions are considered the same if and only if the same player has the move, pieces of
> the same kind and colour occupy the same squares and **the possible moves of all the pieces of both
> players are the same**. Thus positions are not the same if:
>
> **9.2.3.1** at the start of the sequence a pawn **could have been captured** en passant.
>
> **9.2.3.2** a king **had castling rights** with a rook that has not been moved, but **forfeited
> these after moving**. **The castling rights are lost only after the king or rook is moved.**

## Decision

**1. Castling is NOT the en-passant case. `zobristKey` hashes castling RIGHTS, and that is correct.**
The castling component enters the key from `position.castling` alone. It does **not** ask
`src/legal.ts` or anything else whether a castle is currently playable, and it must not be changed to.

**2. `ADR-0005` does not extend to castling.** The inference "en-passant availability is a legality
question, therefore castling availability is too" is rejected. The asymmetry is in the Laws' own
wording and in the structure of the key, not in a preference.

**3. No code changes and no ticket is cut.** `src/zobrist.ts` is untouched by this decision.

### Why — three reasons, in ascending order of strength

**1. The two clauses are written in different moods, and the difference has survived every edition.**
9.2.3.1 is a **capability** statement — *"could have been captured"* — and asks whether a move was
possible. 9.2.3.2 is an **entitlement** statement — *"had castling rights"*, *"forfeited these"* —
and it carries a second sentence with no counterpart in 9.2.3.1: *"The castling rights are lost
**only** after the king or rook is moved."* That "only" is exclusive and is doing the work: it rules
out every other way of losing the right, which is precisely to say that a transient inability to
castle — the king in check, a transit square attacked, a square occupied — does **not** extinguish
it. 9.2.3.1 supplies no lifecycle sentence at all, because an en-passant opportunity is single-ply by
construction and has no lifecycle to describe. Checked across all four editions the handbook
publishes: the *"could have been captured"* wording and the *"lost only after the king or rook is
moved"* sentence are both present in **2014, 2017, 2018 and 2023**. The 2014 → 2017 revision reworded
the first half of 9.2.3.2 (*"a king or rook had castling rights"* → *"a king had castling rights with
a rook that has not been moved"*) and left the exclusivity sentence untouched. **The asymmetry is not
an artefact of one edition; it has survived twelve years and two revisions.**

**2. Given the placement, castling availability carries no information the rights bit does not —
and this is a property of this codebase, verified, not an argument about chess in general.**
9.2.3's three conjuncts are evaluated together: same side to move **and** same placement **and** same
possible moves. `addCastlingMoves` (`src/moves.ts:299-319`) reads exactly three inputs —
`position.castling`, `position.board`, and the side to move. Every blocker it applies (a piece on the
king's path; the king's origin, transit or destination square attacked) is read off the board, which
9.2.3 already requires to be identical. **Therefore two positions with the same placement and the
same side to move can differ in castling legality only if their rights differ.**

That is exactly what was *not* true of en passant, and it is the whole of why one component needed a
legality predicate and the other does not: the en-passant square is an extra bit **not determined by
the placement**, and it can be set while the capability is absent — measured at 862 divergences over
19,667 ep-setting moves. The castling rights bits are the only other such extra bits in the key, and
for them the capability *is* determined by (placement, rights). Same Laws sentence, opposite
consequence, because the two components sit differently against the placement the Laws already fix.

**3. The residual over-discrimination is real, and it is the safe error direction.** Constructed and
run at this hop rather than argued: four position pairs with **identical placement, identical side to
move, and identical legal-move sets**, differing only in a castling-rights bit that no move could use
in either position, and their keys differ:

```
rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1   vs   ... w - - 0 1   (startpos)
4k3/8/8/8/8/8/8/4K1NR w K - 0 1                            vs   ... w - - 0 1   (knight still on g1)
4k3/8/8/8/8/8/8/r3K2R w K - 0 1                            vs   ... w - - 0 1   (the king is in check)
5r2/4k3/8/8/8/8/8/4K2R w K - 0 1                           vs   ... w - - 0 1   (f1 is attacked)
```

A literal reading of 9.2.3's *"if and only if"* would call each pair the same position; the key calls
them different. Three things dispose of it and none of them is "it does not happen":

- **9.2.3.2 governs its own case.** It is an enumerated instance of *"positions are not the same"*,
  written in rights language, paired with a sentence saying the rights survive everything except
  movement. The headline test and the illustration are read together, and the illustration is the
  specific.
- **The error direction is the one this project has chosen every time.** Over-discrimination misses a
  legitimate draw; it never declares one that did not happen. Under-discrimination — collapsing the
  rights — would declare draws the Laws do not grant, which is the direction `ABC-020` exists to
  prevent and which `ABC-011`'s own priority argument rests on.
- **The price of "fixing" it is the shape `ADR-0005` already rejected, at the wrong end of the
  distribution.** A castle-availability predicate means `isSquareAttackedBy` on up to three squares
  per side, on a component carried by **71.0% of nodes** rather than the 15.70% carrying an ep square
  — measured at this hop over the same 518,474-node walk, 368,344 of which hold at least one castling
  right. That is the `legalMoves` cost profile, paid per node, to buy a repetition the Laws do not
  clearly grant.

### One more fact, checked because the ruling would be weaker without it

A castling right in this codebase is never **stale**: `src/apply.ts:142` clears it both when the king
or rook moves **and** when the rook is captured on its home square — verified by playing `Rh1xh8`
from `4k2r/8/8/8/8/8/8/4K2R w Kk - 0 1` and reading `position.castling` fall from `5` to `0`. Then
checked exhaustively rather than left as an argument: over the same 518,474-node walk of the
`src/perft.test.ts` table, **368,344 nodes carry at least one castling right and 0 of them are
stale** — every set bit has its king and its matching rook on their home squares. So on any position
reachable by play, a set right means exactly what FIDE means by the right. **The bit means what the
Laws say it means**, which is the sentence that was *not* true of `epSquare` before `ABC-011`.

## Alternatives

**Hash castling availability instead of rights — the symmetry answer, and the one this rejects.**
Ask `src/legal.ts` whether each castle is currently playable and hash that. Superficially it is
`ADR-0005` applied consistently, which is exactly why it needs an explicit rejection rather than
silence. Rejected on all three grounds above, and heaviest on the second: it would compute, per node,
an answer already determined by the placement the key hashes anyway — paying attack detection to
learn nothing. It is also the unsafe error direction and would need a second legality edge on the
majority path.

**Hash "castling is possible at some point in this position's future"** — rights AND the rook present
AND the king home. Rejected as a distinction without a difference **in this codebase**: `apply.ts`
already maintains exactly that invariant on every reachable position (see above), so the extra test
would fire only on semantically invalid FENs — `ABC-010`'s surface — where it would be a second,
unowned definition of a rules concept in the hashing module, the mistake `ADR-0005` clause 2 names.

**Say nothing and let the code speak.** Cheapest, and the status quo before this hop. Rejected on
evidence: the wrong inference was drawn from `ADR-0005` in writing on 2026-08-03, one day after it
was written. A decision that has already been misread once will be misread again.

**Fold this into `ADR-0005` as a sixth clause.** Rejected for the three reasons in the Status section;
the counter-argument is recorded there too.

## Consequences

- **`src/zobrist.ts` is unchanged, `ABC-011`'s scope is unchanged, and no ticket is cut.** This ADR
  costs nothing to adopt because it ratifies what is already there.
- **The key stays over-discriminating on the four shapes above**, deliberately and with the reason on
  record. Anyone measuring repetition-detection rates against a reference engine should expect these
  to differ from an engine that clears rights when castling is blocked, and should not treat that as
  a defect here.
- **The asymmetry between the two key components is now intentional and documented.** A reader of
  `src/zobrist.ts` sees castling rights hashed unconditionally on one line and en-passant availability
  asked of `src/legal.ts` two lines below. That looks inconsistent and is not; this file is the
  answer, and `ADR-0005`'s scope paragraph points here.
- **`EPIC-004` inherits this.** A transposition table keyed on this hash will treat two placements
  that differ only in an unusable castling right as different entries — one wasted probe, never a
  wrong entry, the same safe direction.
- **What this does NOT decide:** whether `parseFen` should reject a FEN claiming a castling right with
  no rook on the corresponding square (`ABC-010`), and whether `legalMoves` should stop offering
  `FLAG_CASTLE` moves when the rook is absent (`ABC-009`). Both stay exactly where they are.

## Rollback

Free, and it stays free.

Reversing to availability-based castling hashing costs one loop condition in `src/zobrist.ts` and one
new predicate in `src/legal.ts` — the same shape `ADR-0005` already built for en passant, so the
pattern exists and the edge exists. Nothing depends on this decision that would have to be unwound:
no test asserts the over-discrimination directly, no consumer of the key exists yet, and
`plans/nfr-catalog.md` carries no castling figure.

It gets dearer at one moment, the same moment `ADR-0005`'s rollback does: when `ABC-012` ships tests
written against this definition of "same position". After that a reversal touches the history module's
tests too.

## What would falsify this

*(Ratifying carries owning. Each is checkable without trusting this file.)*

| # | what would falsify it | how to check |
|---|---|---|
| **G1** | a FIDE edition that drops *"The castling rights are lost only after the king or rook is moved"*, or rewords 9.2.3.2 into capability language (*"could have castled"*) | re-fetch `handbook.fide.com/chapter/E012023` and diff against sha256 `e0c8bee2…`; re-read the handbook index for a chapter after `E012023` |
| **G2** | an arbiter-level ruling that two positions with identical placement, identical side to move and differing castling rights, where neither side can currently castle, are the **same** position for 9.2 / 9.6 | FIDE arbiters' commentary — **not retrieved at this hop and `UNKNOWN - verify`**; the ruling rests on the Laws text alone |
| **G3** | **the sharp one** — a position pair with identical placement, identical side to move, identical castling **rights**, and different castling **legality**. If one exists, reason 2 collapses and the whole ruling is re-openable | `addCastlingMoves` reads only `castling`, `board` and the side to move (`src/moves.ts:299-319`); the falsifier is any future change that gives it a fourth input |
| **G4** | a reachable position carrying a **stale** castling right (the rook gone or moved, the bit still set) | walk the perft table checking, at each node with a right set, that the king and matching rook are on their home squares — **run at this hop: 368,344 nodes with a right, 0 stale**; a non-zero count later means `apply.ts`'s `CASTLE_LOSS` table has lost a square |
| **G5** | a measurement showing an availability-based castling hash is *cheaper* than the rights hash on the majority path | benchmark it; the rights hash is four bit tests and at most four XORs |

## Amendment — 2026-09-25: the transposition-table question, answered (`ABC-081`)

*Added by Architect/Design at task `wave-2026-09-24`, subtask `ruling-abc080-081`. No clause of
the Decision changes. This answers the question the Status section says "will be asked again by
whoever builds `EPIC-004`'s transposition table". Evidence:
`.grugops/context/ruling-abc080-081/notes/…30cea5d2` (probe) and `…23e0307f` (ruling).*

**The answer is "unchanged". For a transposition table, the rights key is REQUIRED, not merely
the safe direction.** Reason 3 above argued for repetition, where "the same position" means the
same position now. A table entry stores the value of a **subtree**, and a right that is blocked
now can become usable a few plies later. Measured on this ADR's own `knight-g1` pair:

- identical placement, side to move and current move list (15 / 15);
- perft 3 reads 1 335 vs 1 320;
- `search` reads 850 vs 830 at depth 3.

An availability key would give the two the same key. They never share a table, because the
table lives one search (`ADR-0025` decision 4), so the pair's own two scores are never
confused. Inside one search, though, positions that differ only in such a right recur as
interior nodes. A table keyed on availability hands such a node the other position's entry
and cuts on it, which the rights key never does. That was measured on this pair, kiwipete and
position-5, and no root score moved on the readings taken. *(amended 2026-09-27)* So the
"Consequences" bullet "`EPIC-004` inherits this" resolves as follows. The table keys on rights.
Pairs whose unusable right can never become usable (the in-check and f1-attacked pairs read
identical subtrees to depth 4) cost one wasted entry and never a wrong answer. `ABC-081` and
`ABC-075` proceed unchanged.

| # | what would falsify it | how to check |
|---|---|---|
| **G6** | a table-on search scoring differently from the table-off search at the same depth, on a pair differing only in castling rights | `ABC-081`'s key row "G6 bites: the knight-g1 pair keys differently" and `zobrist.test.ts`'s castling-rights rows (`ABC-075` `A4`). The `ABC-081` `A1` score pair (830 vs 820 at depth 4 on the pre-`ABC-121` search) records the premise that the subtrees differ; it does not detect a key bug, because the table lives one search. *(amended 2026-09-26)* |

*Erratum to the `G6` "how to check" cell, 2026-09-26 (Architect/Design, subtask
`adr-amend-0026-0006`), on the owner's word (Olger Oeselg, 2026-09-26, verbatim: *"3. accept"*,
`20260926T201000Z-orchestrator-decision-52aaf5f3`). Proposed in `ruling-abc121-g6` (`…ea306e58`
§3, evidence `…0a3528d1`). The cell read: "`ABC-081` `A1` (table on vs off, identical scores)".
That row never had bite: with a castling-key bug planted (rights dropped from the key, or a stale
incremental key), the score pair reads the same as clean on every configuration, the
pre-`ABC-121` door included, because `clearTable` runs at every `search()` (`ADR-0025` decision
4) and the two roots never share a table. No clause of the Decision changes, and the `G6`
falsifier itself (the middle column) is unchanged.*

*Erratum to the amendment's collision sentence, 2026-09-27 (Architect/Design, subtask
`adr0006-amend-sentence`), on the owner's word as delegated (Olger Oeselg, 2026-09-26, verbatim:
"i will delegate these decisions to you. Contact me when big decision is needed or input context
for your session goes over 500k"; the text accepted under that delegation by the Orchestrator,
`20260927T001000Z-orchestrator-decision-8c8aa8a9`). Proposed in `adr0006-amend-sentence`
(`…9c4d2b18`, evidence `…5e1a7c30`). The sentence read: "An availability key would collide the
two, and the table would return a wrong score." The first half holds for the keys only. The two
roots never share a table, because `clearTable` runs at every `search()` (the `G6` erratum
above). The second half holds only inside one search. There an availability-keyed table cut on
another position's entry 3–8 times per search from `knight-g1 w K` at depths 4–6, 17 times on
kiwipete and twice on position-5 at depth 4. No root score changed on any of the 32 readings.
Whether any of those cutoffs was wrong for its node is `UNKNOWN - verify`. No clause of the
Decision changes, the table still keys on rights, and `G6` is unchanged.*
