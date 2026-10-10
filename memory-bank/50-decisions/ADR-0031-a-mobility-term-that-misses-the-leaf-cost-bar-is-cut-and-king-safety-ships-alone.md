---
kind: adr
id: ADR-0031
---
# ADR-0031: If no mobility form meets `ABC-083` `A5`, king safety ships alone and mobility is re-cut. `ADR-0003`'s model is not re-derived to fit the code

## Status

**accepted** 2026-10-10 by the owner. Owner (Olger Oeselg), 2026-10-10, verbatim: *"accept ADR-0030, ADR-0031, ADR-0032, ADR-0034 with (b) at 0.8x"*

Was: **proposed** 2026-10-10 by Architect/Design (task `wave-2026-09-25`, subtask `ruling-abc083-abc087`). It rules
question **R1** of BA/PM's re-score (`20261010T081343Z-ba-pm-decision-…-973fd389`), which gates `ABC-083`'s
`Ready`. **Owner acceptance owed.** No agent moves an ADR to `accepted`.

- It reads `ADR-0003` (accepted 2026-07-30) and **amends nothing in it.** `A5`'s 1,100 ns level does not move.
- It does **not** answer **R2** (does `kiwipete` depth 7 stay a level). That question is the owner's under
  `AR-NFR005-082`. Decision 5 says only what each of his answers would mean for the cut order.
- **No code changes because of this ADR.** The probe and raw readings are in
  `.grugops/context/ruling-abc083-abc087/probe/`. The readings are in that task's `notes/`
  (`…748b4f7b`). They are cited here, not restated in full.

## Context

`ABC-083` adds king safety and mobility to `evaluate`. `A5` caps the **complete** evaluation's mean cost at
**1,100 ns** per call and says: above that, stop and report to Architect/Design, and do not re-derive
`ADR-0003`'s model to fit the code. The page also says that if mobility cannot be afforded, the Engineer
reports rather than drops the term. R1 asks what ships if **every** mobility form misses: (i) king safety
alone, with mobility re-cut to `Backlog`, or (ii) nothing, until `ADR-0003`'s depth model is re-derived.

**Where 1,100 ns comes from.** It is the top row of `ADR-0003`'s depth table (1,097 ns), and the "what would
change my mind" trigger ("a real evaluation materially above ~1.1 µs per leaf"). It is **not** a clause. The
clause the owner ratified (clause 2) is depth in budget on `kiwipete` and `position-6`: depth 6 FAIL, depth 7
WARN. `ABC-083` `A7`/`A9` read that clause directly on the real engine.

**Measured at this hop.** These are prototypes of each term, not the build. Apple M3, Node v26.11.0, load1
7.5–14.2 (high: two builds were running), `ABC-076`'s method, two rounds in alternating order. Mean of the six
perft roots, in ns per call:

| complete evaluation | round 1 | round 2 | worst cell | vs 1,100 |
|---|---:|---:|---:|---|
| base (`ABC-076` + `ABC-082`, merged) | 372.5 | 389.9 | 478.4 | — |
| + king safety (shelter, open/half-open files) | 493.5 | 472.8 | 584.1 | meets, 2.2x |
| + king safety + **attack-map** mobility (non-pawn pieces, no `Move` objects) | 901.8 | 815.4 | 1,009.9 | **meets, 1.2–1.35x** |
| + king safety + **pseudo-legal** count (`generateMoves` × 2 sides) | 2,188.3 | 1,883.8 | 3,132.1 | misses, 1.7–2.0x |
| + king safety + **legal** count (`legalMoves` × 2 sides) | 14,144.9 | 12,166.1 | 18,697.8 | misses, 11–13x |

- Base reads 2–9% above Security/NFR's 358–366 ns, which was taken at load 4. So this table is upper-ish.
- **So the R1 branch is live, not hypothetical.** Only the attack-map form meets the bar, and its headroom is
  1.2–1.35x on the mean and 1.09x on the worst cell. A heavier build of that form (pawn pushes, or a
  separate pass instead of sharing `whiteMinusBlack`'s board walk) can land above 1,100.
- `evaluate` runs **0.887–0.938 times per search node** (`search()` depth 5–6, `kiwipete`/`position-6`;
  counted, deterministic).

## Decision

1. **(i) ships: king safety alone, with mobility re-cut as its own `Backlog` ticket.** This applies when **every**
   mobility form (decision 2) makes the complete evaluation miss `A5`.
   - King safety ships only if the king-safety-only evaluation itself meets `A5` (≤ 1,100 ns). `A1`–`A3` and
     `A6`–`A10` must also be green on that build. `A4` is mobility's criterion, so it leaves with mobility.
   - The PR note records all three forms' readings, the king-safety-only reading and the base, from one
     session. The re-cut ticket starts from those numbers.
   - **If king safety alone misses `A5`, nothing ships.** That is a stop to Architect/Design. The prototype
     reads 473–494 ns, so this is the residual case, not the expected one.
2. **What "every mobility form measured" means.** Three forms, each in the cheapest honest implementation the
   Engineer can write, each measured as the **complete** evaluation:
   - **legal count**: `legalMoves` for both sides;
   - **pseudo-legal count**: `generateMoves` for both sides;
   - **attack-map count**: squares each piece reaches, counted on the board. No `Move` objects, no
     make/unmake.

   The side not to move may be counted on a transient flip, if the position is restored before return. `A6`
   (byte-identical) applies.

   These do **not** count as a fourth form. Each is a scope or design change, not a cheaper implementation:
   - a subset of pieces (piece-specific mobility is out of scope; that is BA/PM's);
   - a cache or table across calls (`evaluate` holds no state; `ADR-0028` rejected a switch in the hottest
     function);
   - lazy or window-dependent evaluation (that is a value-changing search heuristic, so `ADR-0026` decision 10);
   - mobility state carried in make/unmake (the rules core carries no evaluator state; `ADR-0002` clause 1
     is the precedent).
3. **How `A5` is read near the bar.** The base build is read in the same session. A complete-evaluation mean
   within 10% of 1,100 ns (990–1,210) is read again in a second session, in reverse order. The verdict is the
   mean of the two sessions. This keeps a loaded machine from deciding the cut.
4. **Nothing is re-derived.** `A5`'s level stays 1,100 ns. `ADR-0003` is not amended or reopened by this ticket.
   A mobility term above 1,100 ns comes back only through its own ticket. It needs a cheaper form, or the owner
   moving the leaf budget. That budget is his, under `ADR-0003`.
5. **The same cut order applies to the depth stop. R2 is not answered here.** If `A9` stops the ticket and the
   owner keeps depth 7 a level (R2, answer 1), the terms go in this order:
   - mobility is cut first, as in decision 1;
   - the depth reads are repeated with king safety alone;
   - if king safety alone still loses depth 7, nothing ships, and that goes back to the owner.

   If the owner retires depth 7 on `kiwipete` and keeps the depth-6 floor (R2, answer 2), both terms ship
   when `A5` and the floor hold.

## Alternatives

- **(ii) Nothing ships until `ADR-0003`'s depth model is re-derived. Rejected.**
  - Re-deriving the model so that an over-budget term fits is what `A5` forbids in its own words.
  - The model is the owner's (ratified 2026-07-30). Holding a ticket on a re-derivation nobody has asked
    him for is a stop with no one to act on it.
  - The re-derivation would be a weaker instrument than the one the ticket already has. `A7`/`A9` measure
    depth in budget on the real engine. The model estimates it with an assumed branching factor of 6 and a
    quiescence factor of 2.5, both literature assumptions, not measurements.
  - It holds back king safety, which costs about 100 ns and stands on its own.
- **Ship mobility over the bar and let `A7`/`A9` decide. Rejected.** `A5` is a stated hard stop, and the
  page set it before any code. A bar that a green depth read can overrule is not a bar.
- **Each forbidden shortcut in decision 2. Rejected,** for the reason given there.

## Consequences

- **`ABC-083` gets a route instead of a stop** for an `A5` miss, and the Engineer still cannot drop mobility
  alone. The cut is this ADR's, carried out under its conditions.
- **`A5` is necessary, not sufficient. The likelier stop is `A9`.** This is arithmetic, `UNKNOWN - verify` on
  the build:
  - Security/NFR read 640k–686k nodes in 3 s on `kiwipete`, which is 4.37–4.69 µs per node.
  - At 0.89 calls per node, the prototype attack-map form plus king safety adds about 378–471 ns per node.
    That is **8–11% of node time, from cost alone**, before any change in tree shape. (`ABC-082`'s
    +14.6% nodes came from shape.)
  - King safety alone adds 1.6–2.5%.
  - The depth-7 margin is 1.05–1.12x (`AR-NFR005-082`). So R2 is likely to be asked by the reading.
- **Size stays `M`.** If the cut fires, the delivered diff is smaller, and BA/PM cuts a mobility ticket.
- **`NFR-005`:** no level moves. **`NFR-001`:** the "calls per leaf" report on the page stays. Only the
  pseudo-legal and legal forms call the generator.

## Rollback

Edit this file. Nothing is built on it. If the owner prefers (ii), `ABC-083` stays stopped on an `A5` miss
until he re-derives the leaf budget. The page then needs no change: its `A5` already stops.
