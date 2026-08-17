---
id: 20260817T191802Z-orchestrator-observation-i-verified-the-arithmetic-and-never-the-argument-my-third-error-9c4d1f77
kind: observation
by: orchestrator
at: 2026-08-17T19:18:02Z
verified_by:
confidence: high
refs:
  - .grugops/context/quality-gate-ABC-076-qe-2026-08-17/notes/
  - .grugops/context/refinement-abc076-a1-corpus-2026-08-17/notes/
  - .grugops/context/refinement-abc076-a1-claim-2026-08-17/notes/
  - src/evaluate.ts
supersedes:
---

# I verified the arithmetic and never the argument — my third error this session

## The claim I made to the owner, and its falsification

I reported that `ABC-076`'s widened `A1` corpus **"paid for itself before QE even started"**, because
`A1` caught a real `-0` defect the engineer hit while building. **That is false.**

**Measured by me, not inherited from QE:** the `-0` mutant fails on the pair labelled **`startpos`**
— a ROOT pair, present in the 12-position corpus BA/PM had rejected. `startpos` is colour-symmetric,
so its mirror is `startpos`-with-black-to-move; both score `0`; the buggy `-score` returns `-0` for
the black-to-move side; and `Object.is(0, -0) === false`, so `toBe` separates them. **The 12-corpus
catches `-0` too.** I ran this against the delivered evaluator before writing the correction.

## The larger finding this sits inside, and why my error is the smaller half

QE's 184-vs-12 experiment returned **BOTH GREEN**, then generalised: randomising **all six tables and
every `PIECE_VALUE`** leaves `A1` @ 184 green. **The reason is structural** —
`whiteMinusBlack` reads ONE table per piece type for both colours through
`(black ? rank : 7 - rank) * 8 + file`, so a piece and its mirror read the SAME index and
`whiteMinusBlack(mirror(p)) === -whiteMinusBlack(p)` is an algebraic identity holding for ANY table
contents. **"Mirrored for black" is a mirrored INDEX, not a mirrored TABLE, so the defect class the
widening was bought to catch cannot exist in this implementation at any corpus size.**

## The error, named precisely, because "I was wrong" is not a lesson

**I re-verified the ARITHMETIC and never the ARGUMENT.** When BA/PM returned the repair I checked the
one thing that was checkable by counting — that 20+48+14+6+44+46 = 178 — summed it from the file
myself, and reported it as verification. **It was verification of the cheapest claim in the
proposal.** The load-bearing claim was *"twelve pairs are blind to a wrong table entry"*, and it was
falsifiable by exactly one mutation — the mutation QE ran three hops later. I had the tree, the
evaluator did not yet exist, and **that is precisely why I should have flagged the claim as
untestable-until-code-lands rather than treated it as established.**

**The pattern across all three of my errors this session is one pattern, not three:**

| # | error | the shape |
|---|---|---|
| 1 | exit review checked cited code and measurements, not cited FIXTURES | verified what was easy to verify |
| 2 | dispatched two engineers into one worktree | treated an instruction as a mechanism |
| 3 | this one | verified the arithmetic, not the argument |

**1 and 3 are the same failure at different scales: confirming the checkable part of a claim and
reporting the whole claim as checked.** That is worth more than an apology, because it is
mechanisable — the repair is to name, at the point of verification, which part of a claim was tested
and which part was not, in the same breath. This note is written that way deliberately.

## What BA/PM did with it, recorded so the correction is not lost

**It did not defend its earlier call and did not revert it out of embarrassment**, which were the two
failure modes I named in the dispatch. `A1`'s text now states what QE measured in BOTH directions —
what fails it (the sign flip, 170/184) and what does NOT (a wrong table entry or material value, at
any corpus size) — and carries an explicit warning that **`A1` green is not evidence about table
contents**, addressed to `ABC-082`/`ABC-083`.

**The 184 corpus SURVIVES, on a rewritten justification**: it is the shared deterministic input set
that reds the side-to-move sign negation and that **forces and holds the castling/`epSquare`
mirroring** which `ABC-082` and `ABC-083` need for their own — genuinely non-identity — mirror
properties. QE confirmed two dedicated tests are the ONLY thing holding those fields.

## Owed and NOT done — routed to me and recorded so it is not lost

1. **`ABC-083` carries the same misread risk** through its own `A1` and needs the `A7`-shaped
   anti-fork clause at its refinement. BA/PM flagged it and deliberately did not reach into it.
2. **A ticket to derive `productionModules()` instead of hand-maintaining it.** Three tickets of
   evidence now (`ABC-031`, `ABC-076`, and `ABC-082`'s future shared module); it cost two hops today
   and will red the suite on every future production module. BA/PM recommended it and correctly
   declined to cut it inside a pawn-structure ticket.
3. **A merge-order condition, not a criterion condition:** the delivery branch
   `grugops/ticket-to-pr-ABC-076-2026-08-17` predates the `A1` repair and still carries the `≥ 40`
   page. **The merge must take the refinement branch's version of that page** — the newest of three.
