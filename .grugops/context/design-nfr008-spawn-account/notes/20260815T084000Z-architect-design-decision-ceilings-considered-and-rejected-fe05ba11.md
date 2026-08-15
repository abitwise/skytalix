---
id: 20260815T084000Z-architect-design-decision-ceilings-considered-and-rejected-fe05ba11
kind: decision
by: architect-design
at: 2026-08-15T08:40:00Z
verified_by: 
confidence: high
refs:
  - N8-SPAWN
  - N8-LANE
  - NFR-008
  - ABC-026
  - plans/nfr-catalog.md
supersedes: 
---

# The ceilings I considered for `N8-SPAWN` and rejected — surfaced rather than picked silently

The subtask's hardest clause was *"say what STOPS it"*, and there were five candidate stops. Four were
rejected. **Recording them is the point: the next role that thinks the account is too loose or too
tight should be able to see what was already priced.**

## A. A flat per-ticket ms cap on the account — REJECTED, it fails the case the account was made for

*"A ticket may charge at most X ms to the spawn account."* At any X below the one measured child-set on
record (1070 ms) this account would refuse the very cost class the owner created it to attribute; at
any X above it, X is a number nobody measured and the cap is theatre. **A cap set by looking at the one
case in flight is not a cap, it is a verdict written as a rule** — and writing a verdict on `ABC-042`
into the catalog is exactly what this hop is forbidden.

## B. A per-ticket cap on the NUMBER of forced children — REJECTED as an arbitrary unit

*"At most N children per ticket."* Children are not fungible: the measured set runs 90 ms to 220 ms
each, and `npm run chess` costs more than two rejection children together. A count cap prices a cheap
child and an expensive one identically — **the same defect the row already recorded about a wall bar
charging two identical tickets different amounts.** The criterion text, which is what actually forces
children, is the better ceiling and it is stop 2.

## C. Deriving the cumulative wire from remaining HEADROOM — REJECTED on this row's own thesis

*"Close the account when it has eaten half the lane's remaining headroom."* Tempting, because headroom
is what a planner feels. **It is a moving denominator, and a moving denominator is precisely the defect
`ABC-026` exists to have killed** — `1.05ⁿ` is unbounded for exactly this reason. Both wires are
therefore fractions of the fixed 13 s clause, and a reader can check them with one division.

## D. Charging only the IRREDUCIBLE part of a child's cost — REJECTED as re-litigation

*"Charge what the cheapest conforming build would have spent; the ticket pays the difference."* There
is a measured floor for a conforming build on record (~810 ms net) and a measured cheaper variant
(deferred imports, ~50 ms saved per rejection child). Adopting this would mean **the account re-prices
a build trade that two roles independently considered, rebuilt, measured and declined** — one of them
on a ground that touching it would red a security row. An account is not the place to re-open a decided
build decision, and this rule would have made every future gate re-derive a hypothetical build. The
delivered child's measured cost is charged, and the count is the lever.

## E. Requiring the owner's answer for every charge over one slice — REJECTED as an escalation treadmill

*"A ticket charging more than 650 ms needs the owner before it merges."* This is stop 3's first wire
with teeth added, and the teeth are wrong. The owner has just answered this class of question once;
converting that answer into a standing per-ticket approval requirement would route the same decision
back to the owner every time and would make an account that exists to reduce ceremony produce more of
it. **The wire keeps the disclosure and drops the approval** — the gate reports the figure and the
merge decision carries it, which is what the row actually needs, because *a total cannot tell you which
ticket spent the budget.* The one thing that must never happen is the charge being invisible, and that
is what the wire forbids.

## What survived, and the honest weakness of it

Stops 1 (the total, absolute), 2 (the criterion text, fixed at the cut) and 3 (report at one slice,
close at two). **Stop 1 is a hard stop, stop 2 is a hard stop, stop 3 is a brake and not a bar** — see
my limitations note, which states plainly what this account gives up.
