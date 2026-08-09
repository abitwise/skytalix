---
id: 20260809T150210Z-ba-pm-observation-cf01de8b
kind: observation
by: ba-pm
at: 2026-08-09T15:02:10Z
verified_by: 
confidence: high
refs:
  - ABC-009
  - A5
  - A6
  - A11
  - src/moves.ts
  - src/moves.castling.hardening.test.ts
  - plans/tickets/ABC-009-legalmoves-position-mutation.md
  - 20260809T143400Z-qe-e2e-claim-9f1e0b56
supersedes: 
---

# THE FOURTH CLASS, NAMED AND NOT ACTED ON: the occupant's COLOUR. `A11`'s enemy-colour exclusion is measurably FALSE for the enemy KNIGHT and the enemy PAWN

QE said to expect a fourth class. This is one, and it was found the same way the other three were: by asking
what the rows hold constant and then **testing the exclusion instead of inheriting it**.

`A11` excluded enemy-colour occupants on this stated reason — *"an enemy-colour occupant of either square is
unreachable, masked by the pre-existing through-check test and measured exhaustively twice (9,604 and 12,584
positions, zero divergence)"*. QE carried that exclusion forward this hop rather than re-deriving it, and said
so. I re-derived it. **The blanket claim does not hold.**

**Instrument: the same as the companion note** — mutants on a copy of `src/` outside the repository, anchor
uniqueness and byte-change asserted, `tsc --noEmit` per mutant, full suite per mutant, `src/moves.ts` restored
and re-hashed to `0e247853ab2c05887c76105ff83d8621`, and each verdict classified by **measurement** rather than
by geometry: a survivor is probed in a **fresh process** to see whether the harm is real.

```
enemy occupant admitted   verdict           suite      what actually refuses it in the delivered code
king's sq  KING            SURVIVED, equiv  371/371    the through-check test — genuinely masked
king's sq  QUEEN           SURVIVED, equiv  371/371    the through-check test — genuinely masked
king's sq  ROOK            SURVIVED, equiv  371/371    the through-check test — genuinely masked
king's sq  BISHOP          KILLED           369/371    `A5` row 3, the enemy-bishop row
king's sq  KNIGHT          SURVIVED + HARM  371/371    the IDENTITY GUARD ALONE — nothing covers it
king's sq  PAWN            SURVIVED + HARM  371/371    the IDENTITY GUARD ALONE — nothing covers it
rook's sq  KING            SURVIVED, equiv  371/371    the through-check test — genuinely masked
rook's sq  QUEEN           SURVIVED, equiv  371/371    the through-check test — genuinely masked
rook's sq  ROOK            SURVIVED, equiv  371/371    the through-check test — genuinely masked
rook's sq  BISHOP          KILLED           370/371    `A6` row 4, the enemy-bishop row
rook's sq  KNIGHT          SURVIVED + HARM  371/371    the IDENTITY GUARD ALONE — nothing covers it
rook's sq  PAWN            SURVIVED + HARM  371/371    the IDENTITY GUARD ALONE — nothing covers it

the harm, one fresh process per tree state
4k3/8/8/8/8/8/8/K3n2R w K - 0 1   delivered 13 / 0 castles / pure
                                  mutant    14 / 1 castle / byte 4: 10 -> 6
                                  -> 4k3/8/8/8/8/8/8/K3K2R w K - 0 1
4k3/8/8/8/8/8/8/K3p2R w K - 0 1   delivered 13 / 0 / pure    mutant 14 / 1 / byte 4: 9 -> 6
4k3/8/8/8/8/8/8/4K2n w K - 0 1    delivered  4 / 0 / pure    mutant  5 / 1 / byte-identical
4k3/8/8/8/8/8/8/4K2p w K - 0 1    delivered  5 / 0 / pure    mutant  6 / 1 / byte-identical
```

**The king's-square rows are strictly worse than the own-colour family this ticket was widened for.** The
own-colour version destroys one of your own pieces; this one **destroys an ENEMY piece and leaves the mover
with a second king** — silent material loss, a piece-type change **and** a colour change on one `legalMoves`
call. The rook's-square rows leave the position byte-identical, so purity is blind and the illegal
`FLAG_CASTLE` offer is the only witness — `A6`'s rationale again.

## Why the old claim was wrong, stated precisely enough to be auditable

An enemy `KING`, `QUEEN` or `ROOK` on a home square **does** attack the king's path, so the through-check test
drops the option — measured above, all six survive with **no** behaviour change. That is also exactly why the
**colour-blind** mutants are behaviour-equivalent: colour-blindness widens the king's square only to an enemy
`KING` and the rook's square only to an enemy `ROOK`, and both of those are masked. **So the 9,604- and
12,584-position enumerations were sound for what they tested.** What does not hold is the generalisation from
them to *every* enemy occupant of *any* type: an enemy `KNIGHT` or `PAWN` on `e1`/`h1`/`a1` attacks **none** of
`e1`, `f1`, `g1`, is not in the `empty` set, and leaves the king out of check — so the identity guard is its
only guard, and no row in this suite exercises it.

**The ticket's own criteria already contradicted the claim and nobody read them that way.** `A5` row 3 and
`A6` row 4 are **enemy-bishop** rows, and they are precisely what kills the two enemy-`BISHOP` mutants above.
If enemy occupants were masked, those two rows would be inert. Two roles wrote *"masked by the through-check
test"* over a criteria set that already contained the counter-example.

## What I did with it, and what I deliberately did NOT do

- **Corrected the false clause in `## Acceptance`**, because as written it instructed the next reader **not**
  to add the four missing rows (*"so nobody adds a row for them"*). Leaving a false instruction standing
  through a merge is not a neutral act. The correction states what is measured and nothing more.
- **Added NO criterion, wrote NO test row, took NO board move.** A fourth hop's work does not get opened
  inside a verification hop, and the row-writing is QE's file in any case. **This is named and stopped.**
- **`A11` is NOT reopened and its verdict is unaffected.** `A11` says *"the mover's own"*, it is exhaustive
  over that domain, and the suite satisfies it — see the companion note. This is a **different dimension**,
  and conflating the two would be the same category error as calling the queen instance the type dimension.

**The routing is the Orchestrator's.** For its convenience, measured rather than guessed: four rows in QE's
existing `IMPOSTOR_ON_*` tables would close it, **zero production lines** — the delivered code already refuses
all four FENs today, exactly as it did for the nine own-type rows. Whether that happens on this ticket, on a
follow-up, or is accepted as a named risk is not this role's call.

## The pattern, stated because it is now four for four

Engineer 5 mutants → QE 62 → BA/PM 10 → QE 20 → BA/PM 17+12. **Every hop found what its predecessor missed,
and every miss had the same shape: a dimension closed on one axis while the other axis rested on a blanket
claim nobody re-measured.** Piece type was closed while colour rested on masking. **The honest expectation
after this hop is unchanged: expect a fifth.** Two constants named by QE and still unpursued by anyone: every
criterion FEN places the non-moving king on `e8`/`a8`, and every one has an empty en-passant square with
`halfmoveClock` 0.

## What this note does NOT establish

- **That four rows is the right closure.** It is what I measured would kill these four mutants; a reviewer may
  reasonably want the doubling `A11` carries, which would make it eight.
- **That the enemy-colour dimension is now fully mapped.** Six types on two squares is twelve mutants, all
  single admissions. Conditional and multi-type enemy admissions were **not** run.
- **That this is reachable in play.** It is not, and neither is anything else in this ticket: it needs a
  semantically-invalid position, which is `ABC-010`'s boundary. **Same latency class as the headline defect —
  no worse, no better.**
- **Any `NFR-001` or throughput figure.** None measured by this role at any hop.
