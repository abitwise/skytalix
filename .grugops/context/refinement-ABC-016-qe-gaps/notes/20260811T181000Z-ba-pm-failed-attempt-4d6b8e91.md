---
id: 20260811T181000Z-ba-pm-failed-attempt-4d6b8e91
kind: failed-attempt
by: ba-pm
at: 2026-08-11T18:10:00Z
verified_by:
confidence: high
refs:
  - ABC-016
  - A5
  - A6
supersedes:
---

# I mis-built three chess fixtures while verifying two gaps, and the pattern is why `A6` got three rows instead of one

Recorded per Workflow 16 because the failures are the evidence behind a ruling, not just noise — and
because the previous hop's `failed-attempt` note (QE's harness scoring 50/50 survivors) is the most
useful artifact in this ticket's record and set the bar.

## What happened, three times

**(1) and (2) — `G7`, two positions with no actual ambiguity.** To reproduce QE's
`last: Nexd4 → last: Nxd4` divergence I first built `4k3/8/8/8/3p4/8/4N3/2N1K3 w - - 0 1` (knights on
c1 and e2) and then `4k3/8/2n5/8/3P4/8/8/4K1N1 b - - 0 1` (one black knight). Both rendered
**`last: Nxd4`** — the *undisambiguated* string — and for a moment that looks exactly like the
delivered panel reproducing the mutant's output.

It was not. **A knight on c1 cannot reach d4** (c1 → a2, b3, d3, e2), and in the second position
there is only one black knight. Neither position had two knights able to capture on d4, so **SAN was
correct to emit no disambiguator** and the fixture was measuring nothing. The working position is
`4k3/8/8/8/3p4/8/2N1N3/4K3 w - - 0 1` — knights on **c2** and **e2**, both of which reach d4.

**(3) — `G3`, the joint FEN mis-built twice.** To score QE's *"one FEN closes all three"* I needed a
position down exactly one knight, one bishop and one rook. My first attempt,
`1nbqkbnr/pppppppp/…`, removes the **a8 rook** — the leading `1` is an empty square, not a missing
knight — and read `+5`. My second, `1n1qkbnr/…`, removes the rook **and** the bishop and read `+8`.
Only `3qkbnr/…` reads the `+11` the argument needs.

## How they were caught, and it is the same mechanism both times

**A control that must read a known value.** The joint-FEN probe carried the unmutated panel in the
same run as the mutants, and the control column came back `KILLED` — the delivered panel does not
render `+11` on that FEN. **A control failing is not a defect in the build; it is the probe telling
you the fixture is wrong**, and that is only legible if the control is in the run. The disambiguator
failures were caught the same way: the delivered panel and the mutant printed the **same** string,
and two builds that must differ agreeing is a fixture result, not a measurement.

## The generalisable lesson, which is why this is written down

**A hand-built chess FEN is an unverified claim about a position, and it fails silently in the
direction that makes your argument look right.** Every one of these three read as *plausible
evidence for the thing I was testing* — a panel emitting `Nxd4`, a balance that was merely wrong by
the right sort of amount. None of them announced itself.

**This is what decided `A6`'s shape.** QE's single joint row and my three single-removal rows both
kill the three named mutants; the compensating-pair measurement is the stated reason for choosing
three, and **this note is the second one.** A row that removes exactly one piece and reads that
piece's value is checkable by eye in one step. A row that removes three and reads their sum is not —
**I got it wrong twice in a file whose whole purpose was to check it**, and a criterion the next
reader cannot verify by inspection is a criterion that will be regenerated rather than read.

## What I did NOT conclude from it

I did not conclude that QE's `G3` measurement was wrong — it is not; `+11` against `+12` is correct
arithmetic and each named mutant does die on it. The disagreement is about the **class**, and it is
settled by the compensating pair, not by my fixture errors. Recording these separately keeps the two
apart.
