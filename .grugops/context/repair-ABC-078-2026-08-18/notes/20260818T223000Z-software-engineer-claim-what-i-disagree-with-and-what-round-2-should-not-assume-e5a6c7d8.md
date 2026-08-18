---
id: 20260818T223000Z-software-engineer-claim-what-i-disagree-with-and-what-round-2-should-not-assume-e5a6c7d8
kind: claim
by: software-engineer
at: 2026-08-18T22:30:00Z
verified_by:
confidence: UNKNOWN - verify
refs:
  - ABC-078
  - ABC-074
  - EPIC-006
  - N8-LANE
  - AR-N8LANE-078
  - plans/tickets/ABC-078-iterative-deepening-and-the-engine-seam.md
supersedes:
---

# What I disagree with, what I flagged instead of fixing, and what round 2 should not assume

**A `claim`, `confidence: UNKNOWN - verify` — explicitly non-load-bearing.** No `finding` is
admissible on this install and none of this is gate-adjudicated. Recorded because the brief asked
for disagreement and because silence here would read as agreement.

## I agree with the substance of every ruling I was handed

`RF-1` is right and the reasoning is right: a ceiling *"at any difficulty"* that only holds when
the caller chooses well is not a ceiling, and `EPIC-006` cannot honour a constraint nothing
records. `G1` and `G2` were real, HIGH, and mine. `G4`'s remedy was correctly sized. **I have no
substantive disagreement to report.** Three smaller things follow.

## 1. The ticket page now describes an engine that no longer exists, and I did not edit it

`## Out of scope` says *"This module does not clamp the budget it is given"* — as of `c8e4061` it
does. `A2`'s criterion text describes a fixture that has changed. `A4`'s criterion text is *"a grep
of the delivered `src/` diff finds no depth constant"*, which is exactly the sentence `G2` walked
through, and it now understates its own criterion.

**I did not touch the ticket.** Ticket prose is BA/PM's and the brief did not put it in scope.
**Flagged for BA/PM, not edited here** — and it matters more than usual on this project, because
`AGENTS.md`'s process rule 1 makes the `Ready for Dev` exit a re-read of criteria **against the
built tree**, and these three sentences are the ones that re-read would trip over.

## 2. `A4`'s criterion text should stop being a grep, and that is a wording change I cannot make

The deeper `G2` lesson is not that `A4` needed a fifth check. It is that *"a grep finds no depth
constant"* **specifies a grep**, and a criterion that specifies its own instrument gets exactly the
instrument's blind spots. `RISK-002`'s property is *"the engine deepens until the clock stops it"*,
which is behavioural; the grep is one cheap sufficient check for one way of breaking it. Written as
a property, the test I added would have been the obvious first implementation rather than a repair.
**Recommendation for BA/PM, not a change I made.**

## 3. The lane will keep losing this argument, and `AR-N8LANE-078`'s owner should see the shape

`ABC-078` was already ~840 ms against `N8-LANE`'s 650 ms and accepted. This repair adds ~206 ms,
and **every millisecond of it bought a guard that a wrong build previously walked past**. Two of
those wrong builds passed 1 016 tests *and* the opt-in deep lane. So the trade the lane budget
implies here was: 200 ms of CPU against a suite that could not see a hard depth cap, a stalemate
scored as a loss, or a lost mate distance.

I moved everything I could behind `ENGINE_DEEP=1` and left only the cheap 90% in the default lane,
which is what the brief asked for and what I would have done anyway. But **`N8-LANE` is now the
constraint deciding how well this module is guarded**, and that is a question about the bar, not
about this ticket. `OQ-1` (the lane's own budget, Architect/Design) is where it belongs; this is
one more data point for it.

## What round 2 should NOT assume

- **The clamp does not make the 5 s ceiling literally true.** A 10 s budget returns ~5 003 ms.
  That is `AR-NFR004-A`, it is stated in the module header and in the test comments, and the suite
  deliberately does not assert it away. **If round 2 finds a test asserting `<= 5 000` on a real
  clock, someone has added a safety margin and should be stopped.**
- **The behavioural depth guard is a LOWER bound, one-sided on purpose.** It reds a ceiling at or
  below 5 (default lane) or 6 (deep lane). It is not a claim that this engine reaches depth 6 in
  human time — `NFR-005`'s floor is untouched, still unmet, and still a waypoint pending
  `ABC-079` / `ABC-080` / `ABC-081`, and `ABC-074`'s off-M3 measurement is still owed.
- **The identity sweep is SUPPOSED to red when the two copies legitimately diverge.** The first of
  `ABC-079` / `ABC-080` / `ABC-081` to land in `src/search.ts` will red it, and the correct
  response is to port the change into `src/engine.ts`, never to weaken the sweep. It is the only
  thing standing between this project and two negamaxes that quietly disagree.
- **Nothing here was verified by a gate stamp.** `context.human_admission` is `off`; every note in
  this folder is hand-authored and carries no `§14-gate#<id>`.
