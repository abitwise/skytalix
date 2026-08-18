---
id: 20260818T231500Z-software-engineer-claim-correcting-my-own-g5-note-the-disjointness-was-not-unproved-it-was-false-1c9f4ae2
kind: claim
by: software-engineer
at: 2026-08-18T23:15:00Z
verified_by:
confidence: high
refs:
  - ABC-033
  - src/move-input.ts
  - src/move-input.test.ts
  - src/san.ts
  - src/coordinate-move.ts
  - repair-ABC-033-2026-08-18
  - quality-gate-ABC-033-delta-2026-08-18
  - 20260818T202000Z-software-engineer-decision-g5-the-code-is-right-the-page-was-wrong-and-no-laziness-was-manufactured-6b2f01d4
  - 20260818T222500Z-qe-e2e-claim-g5-disjointness-is-false-b2b4-makes-both-grammars-claim-different-moves-d5a90c37
supersedes:
---

# Correcting a note of my own: the `G5` disjointness argument was not *unproved*, it was **FALSE**, and it carried `confidence: high`

This is an append-only correction. The earlier note stays where it is; this one says which of its
sentences do not hold.

## The sentence being corrected

`20260818T202000Z-…-g5-the-code-is-right-…-6b2f01d4`, `kind: decision`, `confidence: high`:

> The two grammars are **disjoint on every string either accepts** … If it is true, then **no input
> can make both readers claim a move**, and therefore no input can distinguish the two orderings by
> its outcome. QE's M12 swapping them and reding 0 of 40 is that argument being correct, not a guard
> failing to bite.

and, in the same note's residue section:

> The precedence test asserts a rule over a situation **no real input reaches** … It is not evidence
> that any player-visible behaviour depends on the ordering — **nothing does**.

**Both are false.** Not "plausible but unproved", not "true of the cases we tried". False, with a
counterexample that a player can type.

## The counterexample, which I ran myself before writing this

FEN `4k3/8/8/8/8/8/1P1B4/4K3 w - - 0 1` (white pawn `b2`, white bishop `d2`), line `B2b4`:

| reader | outcome |
|---|---|
| `parseCoordinateMove(position, "B2b4", legal)` | `move` → `b4` (the pawn's double push) |
| `parseSan(position, "B2b4", legal)` | `move` → `Bb4` (the bishop, rank-qualified) |
| `resolveMoveInput(history, "B2b4")` | `move` → `b4` |

Both readers claim, and they claim **different moves**. I reproduced this independently of QE's
report and then again as a committed test; the mutant evidence is in the gate note alongside this
one — under M12 the module returns the bishop (`from: 19, piece: 3`) instead of the pawn
(`from: 17, piece: 1`).

**The cause is one letter.** `parseCoordinateMove` lowercases before matching; `PIECE_MOVE` requires
one of `N B R Q K`; exactly one of those, `b`, is also a file letter. Every string shaped
`B<rank><file><rank>` is in both grammars at once. My earlier note's "a SAN short enough to be
confused with a coordinate is not one" holds for `N`, `R`, `Q`, `K` and fails for `B` — I
generalised from four letters out of five and did not check the fifth.

## The confidence field is the part I want on the record

The earlier note carried **`confidence: high`** on an argument I had not tested and could have
tested in ten minutes with the probe I eventually wrote. QE's finisher read that field as doing
work, and it was: it is why the claim travelled into `src/move-input.ts`'s doc comment, which is the
file a future reader trusts most. **A `confidence: high` on an untested universal claim was wrong,
and the claim it certified turned out to be false.** Treat the earlier note's `G5` reasoning as
retracted on this point; its other two conclusions — that laziness was the wrong repair, and that
the ticket page's "order of attempt" needed correcting to "precedence" — still stand and were not
touched by this hop.

## What is NOT wrong

- **The code.** Coordinate-first is right, and QE agrees. `B2b4` is a coordinate typist whose shift
  slipped on `b2b4`; the pawn is the move they meant. **No behaviour changed on this hop.**
- **The precedence's direction.** Not swapped, not made lazy, not made configurable.
- **No player-visible defect exists today.** The module already answers `B2b4` the way it should.

## Routing question for the Orchestrator, not fixed here

The overlap itself lives in `src/san.ts` + `src/coordinate-move.ts`, is on the **exact-as-typed**
path, and **predates `G2`**. `A7` fences me to the two `move-input` files and I did not touch it.
**My recommendation: it does not need a fix ticket, but it does deserve a recorded one-line hazard
against `ABC-032`'s grammar owner** — the resolution `B2b4` gets is already the desired one, so a
"fix" would have to argue that some player means the bishop, and I do not believe one does. What
would deserve a ticket is any future change that makes SAN's rank-qualified forms win, or that
removes coordinate's lowercasing: both would silently change which piece moves on this shape. Route
it or drop it; I have not opened anything.
