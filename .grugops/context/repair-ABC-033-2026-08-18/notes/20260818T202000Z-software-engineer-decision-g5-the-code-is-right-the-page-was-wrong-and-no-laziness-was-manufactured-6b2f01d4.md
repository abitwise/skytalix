---
id: 20260818T202000Z-software-engineer-decision-g5-the-code-is-right-the-page-was-wrong-and-no-laziness-was-manufactured-6b2f01d4
kind: decision
by: software-engineer
at: 2026-08-18T20:20:00Z
verified_by:
confidence: high
refs:
  - ABC-033
  - src/move-input.ts
  - src/move-input.test.ts
  - plans/tickets/ABC-033-one-prompt-both-formats-and-the-ambiguity-outcome.md
supersedes:
---

# `G5`: the code is right and the page was wrong. It is a PRECEDENCE, not an order of attempt

The brief asked me to decide honestly which is true and make them agree. **The code is true.**

`attemptsOn` returns an **array**: both resolvers are called on every text, eagerly, and the caller
then loops over two answers already in hand. So there is no order of *attempt* — nothing is skipped
by the first one succeeding. What the order decides is which answer is **preferred**. The ticket's
`## Scope` said *"Order of attempt, fixed and asserted"*, and two of those four words were wrong:
it was not an order of attempt, and it was not asserted.

## Why M12 survived, and why that is the expected result rather than an alarming one

The two grammars are **disjoint on every string either accepts** — a coordinate is four-plus
characters of `[a-h][1-8]`, and a SAN short enough to be confused with one is not one. The ticket
argues this itself, as the *reason* coordinate goes first. If it is true, then **no input can make
both readers claim a move**, and therefore no input can distinguish the two orderings by its
outcome. QE's M12 swapping them and reding 0 of 40 is that argument being correct, not a guard
failing to bite.

That is also why the test at `:211` could never have caught it: it asserts both readers saw the
exact line first and that the two call arrays are the same length, all of which hold identically
under either ordering.

## What I did NOT do, and why

**I did not make the module lazy.** Short-circuiting after the first success would make the order
observable and would kill M12 — and it would be a mechanism built so that a test can watch it. The
saving is one parse of a short string on the winning path; the cost is a real behaviour change to
satisfy a sentence on a page. The brief named this trap explicitly and it is a trap: the design does
not need laziness, and manufacturing it would be the wrong repair.

## What I did instead — the two changes that make page and code agree

1. **The page is corrected** (`## Scope`, and it says it was corrected and when): *"Precedence,
   fixed and asserted"*, with the eager double call stated outright — both readers are asked about
   every text, the order decides which answer is preferred, nothing is skipped.
2. **The precedence is now asserted where it has an observable consequence**: through
   `MoveInputDeps`, with two stub readers that BOTH claim the same text and return different moves.
   Coordinate's answer must win. That is the only arrangement in which the rule is testable at all,
   and it uses the seam the module already exposes for exactly this class of question.

**M12 now reds 1 test.** The word "asserted" on the page is now true.

## The honest residue

The precedence test asserts a rule over a situation **no real input reaches**, and I say so in the
test's own comment rather than letting a reader assume otherwise. It is worth having anyway: the
module's one job is the order of the asking and the merge of the answers, so the merge rule is
exactly what its unit tests should pin. It is not evidence that any player-visible behaviour depends
on the ordering — nothing does.

QE also noted the eager double call is unremarked: **every prompt pays for both parsers.** It is now
remarked, in `attemptsOn`'s own doc comment. It is not a defect against any criterion and I did not
treat it as one.
