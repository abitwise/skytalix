---
id: 20261010T084149Z-architect-design-decision-abc083-ruled-adr0031-king-safety-ships-alone-mobility-recut-ce774a91
kind: decision
by: architect-design
at: 2026-10-10T08:41:49Z
verified_by:
confidence: high
refs:
  - ABC-083
  - ADR-0031
  - ADR-0003
  - ADR-0028
  - AR-NFR005-082
  - NFR-005
  - NFR-001
  - memory-bank/50-decisions/ADR-0031-a-mobility-term-that-misses-the-leaf-cost-bar-is-cut-and-king-safety-ships-alone.md
  - plans/tickets/ABC-083-evaluation-king-safety-and-mobility.md
  - 20261010T084149Z-architect-design-observation-r1-r3-measured-mobility-forms-root-window-price-blunder-rules-748b4f7b
  - .grugops/context/rescore-batch-2026-10-10/notes/20261010T081343Z-ba-pm-decision-six-ticket-rescore-three-ready-four-rulings-owed-973fd389.md
supersedes:
---

# `ABC-083` R1 ruled in `ADR-0031` (proposed): **(i).** If every mobility form misses `A5`, king safety ships alone and mobility is re-cut. Nothing is re-derived

This note is hand-authored. The evidence is `…748b4f7b`. The ADR is the authority; this is the summary the next
hop reads first.

## The ruling

- **(i) ships.** King safety alone ships, and mobility becomes its own `Backlog` ticket. This applies when the
  complete evaluation misses 1,100 ns with each of the three forms: the legal count, the pseudo-legal count
  and the attack-map count. Each form is measured in its cheapest honest implementation.
- **King safety must itself meet `A5`, and every criterion except `A4` must be green.** `A4` leaves with
  mobility. If king safety alone misses `A5`, nothing ships: that is a stop to Architect/Design.
- **Forbidden as a "fourth form":** piece subsets, caches, lazy or window-dependent evaluation, and state carried
  in make/unmake. Each one is a scope or design change.
- **Near the bar:** a mean in 990–1,210 ns is read in a second session, in reverse order. The verdict is the
  mean of the two sessions.
- **`A5` stays at 1,100 ns, and `ADR-0003` is untouched.** (ii) was rejected for four reasons:
  - re-deriving the model to fit the code is what `A5` forbids;
  - the model is the owner's;
  - `A7` and `A9` already measure the real thing;
  - it would hold back a term that costs about 100 ns.

## Why the branch is live

On prototypes, only the attack-map form meets the bar: 815–902 ns mean, worst cell 1,010. The pseudo-legal form
reads 1.9–2.2 µs and the legal form 12–14 µs. A heavier build of the attack-map form can miss.

## R2 is not ruled. What each answer would mean

`A9` is the likelier stop. The arithmetic says the cost alone adds 8–11% to node time, against a 1.05–1.12x
margin.
- **If the owner keeps depth 7:** mobility is cut first and the depth reads are repeated with king safety alone.
  If that still loses depth 7, nothing ships, and it goes back to him.
- **If he retires depth 7 on `kiwipete`:** both terms ship when `A5` and the depth-6 floor hold.

## Owed elsewhere, not done here

- **BA/PM:** re-score item 10. This hop only marked it with `ADR-0031`.
- **Owner:** accept `ADR-0031`, or choose (ii). R2 can wait for the reading, as before.
