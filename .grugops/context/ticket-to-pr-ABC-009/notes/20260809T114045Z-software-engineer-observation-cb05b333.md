---
id: 20260809T114045Z-software-engineer-observation-cb05b333
kind: observation
by: software-engineer
at: 2026-08-09T11:40:45Z
verified_by: 
confidence: high
refs:
  - ABC-009
  - ABC-011
  - ABC-018
  - src/moves.ts
  - src/moves.castling.test.ts
  - plans/tickets/ABC-009-legalmoves-position-mutation.md
supersedes: 
---

# Five mutants against the delivered diff: four die in disjoint named sets, one survives and is equivalent

`## Test notes` 5 requires each precondition proved load-bearing by deleting it. BA/PM measured that on
mutants of `main`'s `addCastlingMoves`; it is re-measured here **on the delivered diff**, because open
item 2 says the counts came from candidate fixes and the delivered change is the thing nobody had
tested.

**Method.** Each mutation was applied in place to `src/moves.ts`, the **full** suite was run with a
JSON reporter so the failing set could be enumerated rather than eyeballed, and the file was then
restored from a pristine copy taken before the first mutant. `src/moves.ts` was re-hashed to
`0e247853ab2c05887c76105ff83d8621` after every restore, and the final working tree carries exactly
` M src/moves.ts` and `?? src/moves.castling.test.ts`.

## The four that die

| mutation of the delivered fix | criteria that fail | suite |
|---|---|---|
| delete the **king** identity condition | `A4` + `A5`, **nothing else** (16 assertions) | 321/337 |
| delete the **rook** identity condition | `A3` + `A6`, **nothing else** (5 assertions) | 332/337 |
| weaken **both** from identity to **occupancy** (`=== EMPTY`) | `A5` + `A6` **only** (12 assertions) | 325/337 |
| **swap** the two squares — king sought on the rook's square, rook on the king's | 19 assertions, including `ABC-004`'s castling generation, `ABC-004`'s castling make/unmake round-trips, and kiwipete `perft(1) = 48` | 318/337 |

**The disjoint-set property the ticket claims holds on the real change**, with the same sets BA/PM
measured on its candidates. My assertion counts are double BA/PM's row counts on `A4` and `A5` because
I split each row's offer assertion and purity assertion into separate `it` blocks; the rows are the
same four.

**All four legal-castle controls survived every one of the four mutants**, so none of these reds is a
false red — the mutants are being killed by the criteria that name the defect, not by collateral
over-rejection.

The swapped-squares mutant is the one that lands on `A8` rather than on a new criterion, exactly as
BA/PM predicted for it: it breaks real castling, so the default perft lane's exact node counts catch
it. That is `A8` working as the over-rejection oracle the correction block says it is.

## The one that survives — and it is behaviour-equivalent, not a defect

Recorded because open item 1 hands *"seven is not proven complete"* forward, and a surviving mutant is
precisely what that warning predicts. **Weakening both identity tests to colour-blind ones** —
`pieceType(position.board[option.kingFrom]) !== KING` and the rook equivalent, instead of the full-byte
comparison — reads:

- **337/337 green**, every one of the twelve criteria included;
- `npm run typecheck` **exit 0**, so it is a legitimate build and not a broken one.

**It is not a criterion gap.** It was settled by differential test rather than by argument. Both trees
were imported into one process and their `generateMoves` output compared move-for-move over an
exhaustive space: every one of the 13 possible byte values on the king's home square × every one of the
13 on the rook's home square × the four castles = **676 boards**, built directly rather than through
`parseFen` because most of them are not legal FENs.

```
boards exercised                                    676
the two RULES read the two squares differently       12
  ...of which the generator's output still AGREED     12
generateMoves output DIVERGED                          0
```

The 12 are exactly the reachability question: an enemy `KING` on the king's home square, or an enemy
`ROOK` on the rook's home square. On all 12 the option is dropped **downstream**, by the
through-check test that already existed — an enemy king on e1 attacks f1 and d1, and an enemy rook on
h1 attacks f1 and g1 (or on a1, c1 and d1), and those are squares `option.kingPath` requires
unattacked.

A blocker could in principle change that attack geometry, so each of the 12 rows was re-run with
**every possible third piece on every other square of the board** — 12 rows × 120 on-board squares ×
12 piece values = **8,928 boards**. Divergence still **zero**.

**Conclusion: the delivered fix is stricter than reachability requires, which is the safe direction,
and no criterion can distinguish the two forms.** This is the same class as `ABC-011`'s two
behaviour-equivalent cost mutants, which that ticket's Security/NFR gate deliberately did **not** pin,
with the reason recorded. It also independently corroborates BA/PM's measured finding that a
wrong-**colour rook** on the rook's home square is unreachable — now exhaustively, over **both** home
squares, and against the delivered fix rather than on two FENs.

**No criterion is proposed for it.** One would be the theatre BA/PM's correction 5 explicitly rejected,
and it would pin an implementation shape rather than an observable behaviour.

## Where this leaves open item 1 — honestly, and it is not closed

Five mutants is not a campaign. `ABC-018`'s QE ran **56** mutants over 75 mutate-and-restore cycles and
found six that passed all twelve criteria and all 297 tests. Against that standard this is a spot check
by the author of the code, which is the weakest possible position from which to certify a criteria set.

What can honestly be said: **no criterion gap was found by these five**, four died in the sets the
ticket predicts, and the fifth is provably equivalent rather than excused. What cannot: that a sixth
mutant does not exist. A mutation campaign is QE's instrument and QE's hop.

**One structural fact this hop surfaced that is worth handing to QE, because it narrows where to look.**
The through-check test (`option.kingPath` + `isSquareAttackedBy`) **masks the entire colour dimension of
both home squares** — that is what the 676-board result above actually shows. Any criterion aimed at
colour on those two squares is therefore unfalsifiable, and any mutant that only weakens colour is
equivalent. That is one of the two places BA/PM said it would look first (*"the interaction between a
castling precondition and the `option.empty` / `option.kingPath` tests that already exist"*), and it is
now partly measured. **The other place BA/PM named — a criterion set written entirely over signals that
agree — was NOT examined by this hop at all.**

## What this note does NOT establish

- **That five mutants exhausts the space.** See above. It does not.
- **That the equivalence result extends beyond `generateMoves` output on those boards.** It is a
  differential test of the generator's move list, exhaustive over the two home squares and one extra
  piece. Three or more extra pieces were not enumerated; the structural reason no blocker can help is
  stated above but that reasoning is an argument, and only the 9,604 boards are measured.
- **Any claim about the `option.empty` interaction beyond the colour dimension.** Not examined.
