---
id: 20260925T141321Z-architect-design-decision-r4-adr0026-proposed-and-what-the-owner-decides-e61f2d84
kind: decision
by: architect-design
at: 2026-09-25T14:13:21Z
verified_by:
confidence: high
refs:
  - ABC-121
  - ABC-084
  - ADR-0026
  - ADR-0024
  - ADR-0025
  - memory-bank/50-decisions/ADR-0026-a-value-changing-search-heuristic-gets-a-test-only-off-door-and-a-bounded-oracle.md
  - 20260925T141021Z-architect-design-decision-r1-identity-rows-stay-binding-against-pre-abc121-doors-c41d9e07
  - 20260925T141121Z-architect-design-decision-r2-lmr-on-is-judged-by-bounded-drift-mate-floor-and-depth-5e92b7a0
  - 20260925T141221Z-architect-design-decision-r3-both-recursions-at-once-one-ticket-pvs-commit-first-7a4c19e3
supersedes:
---

# Ruling 4: an ADR is owed. `ADR-0026` is written as PROPOSED, and the owner accepts it or not

Hand-authored, no `seal` (degraded posture per `AGENTS.md`).

## Why an ADR, not just a note

`ABC-121` is the first heuristic in this project that changes the search's VALUE. Every oracle
since `ABC-077` assumes it does not. The two-door pattern, and the rule that every older door
keeps the new heuristic off, is exactly what a future maintainer would curse to find
undocumented. It is also the rule `C2` (null move) will need next. `ADR-0026` records it once, so
`C2` cites it instead of re-deriving it.

**File:** `memory-bank/50-decisions/ADR-0026-a-value-changing-search-heuristic-gets-a-test-only-off-door-and-a-bounded-oracle.md`.
**Status: proposed.** Nothing in `src/` changes because of it.

## What the owner must decide

1. **Accept `ADR-0026` or not.** The consequences he accepts with it:
   - four test-only doors: two in `src/search.ts`, two in `src/engine.ts`;
   - one pure predicate export;
   - `ABC-077` `A6`'s export list grows by 3 and `ABC-078` `A4`'s by 2;
   - every merged bar stays as it is.

   If he declines, the alternative on the record is to re-level `ABC-080` `A3` and `ABC-081`
   `A3`, and the probe says that is required, not optional:
   - `ABC-080` `A3`: 47.5% vs 40.5% in the default lane, and 6.59% vs 4% at depth 4;
   - `ABC-081` `A3`: 77.3% vs 70%.

   It would also give up `ABC-078` `A3` as a cross-recursion identity once LMR is on.
2. **Is a bounded drift plus a mate floor an acceptable strength oracle for LMR while `ABC-084`
   is unbuilt?** This is `ADR-0026`'s stated consequence: LMR's strength effect is BOUNDED, not
   proven neutral.
   - Default recommendation: **yes**. At depth 5, drift is ≤ 25 cp on 99.47% of positions, the
     maximum is 45 cp, there are 0 mate flips, and every mate row holds.
   - The alternative is to sequence `ABC-084` (P0, `Backlog`, DoR 8/10) before `ABC-121`. That
     costs a whole M ticket in front of the depth-7 margin.

Nothing else here needs his word. The criteria wording is BA/PM's, and the build waits for
`ABC-122` on the Orchestrator's sequencing, which this ruling does not touch.
