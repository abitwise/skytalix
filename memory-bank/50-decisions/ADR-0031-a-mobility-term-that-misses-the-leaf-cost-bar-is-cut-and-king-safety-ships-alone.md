---
kind: adr
id: ADR-0031
---
# ADR-0031: If no mobility form meets `ABC-083` `A5`, king safety ships alone and mobility is re-cut. `ADR-0003`'s model is not re-derived to fit the code

## Status

**accepted** 2026-10-10 by the owner. Owner (Olger Oeselg), 2026-10-10, verbatim: *"accept ADR-0030, ADR-0031, ADR-0032, ADR-0034 with (b) at 0.8x"*

**Addendum 2026-10-24 (`ABC-205`): ACCEPTED** 2026-10-24 by the owner (Olger Oeselg), verbatim *"accept your
recommendations, other session paused"* (Orchestrator transcription note
`20261024T105800Z-orchestrator-decision-fb0468ff`). Both of its owner words are given: `OD-205-1` (`A6`) and
`OD-205-2` (`A7`) are accepted. See § Addendum at the end. The decisions below are unchanged by it.

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

## Addendum 2026-10-24 (`ABC-205`): king safety scales with the enemy queen, and the king square is tapered

### Status

**ACCEPTED** 2026-10-24 by the owner, on this text with `A6` and `A7`: verbatim *"accept your recommendations,
other session paused"* (`…fb0468ff`). `OD-205-1` and `OD-205-2` are accepted. Recorded by Architect/Design (task
`arch-accept-owner-words-2026-10-24`).

Was: **PROPOSED** 2026-10-24 by Architect/Design (task `arch-design-ABC-205`). The owner accepted the proposal
(`…7feb0553` item 2), and that acceptance is the go-ahead for building it. **Acceptance of this TEXT is the
owner's.** The Orchestrator reports it to him. Decisions 1–5 above are unchanged. `A5`'s 1,100 ns (`EPIC-008`
`G2`) does not move, and `ADR-0003` is not reopened.

### Context

- In game 1, the king-exposure term moved 35 cp when 13.d4 opened the d-file in front of the e1 king. Stockfish
  moved about 360 cp (`memory-bank/analysis/2026-10-23-game-1.md`).
- The term has no queen or phase dependence, and the king table pays the castled bonus on c1/b1 whatever the files
  say. `ABC-083` kept both untapered "by decision". `ABC-205` overrides that.
- Probes and numbers: `ABC-205` § Design ruling, and `.grugops/context/arch-design-ABC-205/notes/`.

### Decision

- **A1. Queen scale.**
  - Each king's exposure penalty (`ABC-083`'s shelter and file terms, values unchanged) is multiplied by **3**
    while the enemy has at least one queen, and by 1 otherwise.
  - Queenless scores are unchanged.
  - The term's ceiling is 3 × 105 = 315 cp, which stays below a minor piece.
- **A2. Tapered king square.**
  - Phase = Σ (N 1, B 1, R 2, Q 4) over both sides, clamped to 24.
  - Each king scores `((mg × phase + eg × (24 − phase)) / 24) | 0`.
  - mg is the existing king table, unchanged.
  - eg is **this project's own** table, `40 − 15 × (Manhattan distance to d4/e4/d5/e5)`. No new third-party values
    are added (`…28633db0`, `ADR-0044` D13).
- **A3. No castled bonus without shelter.**
  - A positive middlegame king-table value is paid only while none of the king's shelter files is missing.
  - "Missing" uses the shelter test `kingExposure` uses: one definition.
  - The endgame half is not gated.
- **A4. The contract is unchanged:**
  - pure, stateless, integer, negamax-signed and mirror-exact;
  - one board walk, which also gathers the queen flags and the phase;
  - no `Move` objects, no new export or door, and no cross-call state (decision 2's forbidden shortcuts still
    apply).
- **A5. Stops.**
  - Over 1,100 ns (read under decision 3), or a `G6` miss, is a STOP to Architect/Design.
  - The PR note then carries scale-only and taper-only readings from the same session.
  - The Engineer drops neither term on his own, and nothing is re-derived (decision 4).
- **A6. One level, for the owner's word (`OD-205-1`).**
  - The probe reads `ABC-079` `A5`'s position-6 depth-1 quiescence multiplier at 10.96x against its 10x level.
  - That level already carries `ADR-0024` decision 3's headroom, so `ADR-0028` decision 4 makes this a stop.
  - **Ruled not a defect.** The queen scale alone reproduces it (11.02x), and the taper alone does not (9.26x). Base
    reads 9.19x over a 47-node denominator.
  - **Proposed:** that one cell becomes 1.5 × the build's reading, rounded down (about 16x). This is `ADR-0039`
    decision 3's pattern, under `ADR-0028` decision 1's three checks on the build. Every other cell stays
    byte-identical.
  - If the owner declines, the queen scale does not ship, and `ABC-205` stops to BA/PM.
  - **Accepted 2026-10-24** (`OD-205-1`, `…fb0468ff`): the cell is ⌊1.5 × the build's reading⌋.
- **A7. A second level, for the owner's word (`OD-205-2`).** *(added 2026-10-24, task `arch-rule-ABC-205-stop`,
  after the build's STOP)*
  - The build reads `ABC-121` `A1`'s depth-5 drift maximum at **79 cp against its 75 cp level**, in both recursions,
    on position-6/e2d2. The 95 % clause holds (96.79 % / 97.33 %).
  - The level was set with measured headroom (75 against 45 cp). So `ADR-0028` decision 3 does not reach it, and
    decision 4 makes the red a stop. The level is `ADR-0026` decision 9's text.
  - **Ruled not a defect.** The shelter gate (`A3`) alone reproduces it at 87 cp, and the blend alone does not
    (55 cp). The queen scale alone reds the same bar on another position (107 cp). The bar's mutant `early` stays
    red on the 95 % clause.
  - **Proposed:** the maximum becomes ⌊1.5 × 79⌋ = **118 cp**, in both recursions. Nothing else in decision 9
    moves. The text is `ADR-0026` § Proposed amendment 2026-10-24.
  - If the owner declines, neither term ships alone, and `ABC-205` stops to BA/PM.
  - **Accepted 2026-10-24** (`OD-205-2`, `…fb0468ff`): applied into `ADR-0026` decision 9 (§ Proposed amendment 2026-10-24, now accepted).

### Alternatives

- **×4. Rejected.** It also turned the three game-1 moves, but its ceiling (420 cp) outweighs a minor piece.
- **A queenless factor below 1, or exposure tapered by phase. Rejected.** Either would break `G3`:
  `ABC-083` `A2`/`A3`'s equal-material rows are pawn endings.
- **Michniewski's king endgame table. Rejected.** It would add CC BY-SA values while the licence moves to
  Apache-2.0.
- **A graded castled bonus** (bonus × sheltered files / zone files). **Rejected:** more arithmetic, and no evidence
  that it plays better.
- **A king-zone attacker term.** Not cut (`EPIC-008` § Out of scope).

### Consequences

- **Probe numbers (not readings, loaded host):**
  - evaluation +57 to +103 ns (781–798 against 678–741 ns);
  - position-6 nodes to depth 7 +8.8 %;
  - depth ≥ 6 on all 16 3-s runs.
- **`G6`'s "≥ base" on position-6 is the likeliest stop.**
- **Eleven default-lane rows move:**
  - pins are re-pinned;
  - two fixtures are re-found under `ADR-0028` decision 2;
  - one level goes to `OD-205-1`.
- **The build's STOP added one deep-lane level (`OD-205-2`, `A7`).** It also re-pins one deep row by `maxDepth`
  (`ABC-205` § Addendum 2026-10-24).
- **Ship rule.** It ships only on `EPIC-008` `S1` (a D reading of GAIN).
- **Licence interaction.** A later re-derivation of `KING_TABLE` changes values, but not these forms.

### Rollback

Revert the build commit. This addendum is text. If the owner rejects it, `ABC-205` goes back to BA/PM.
