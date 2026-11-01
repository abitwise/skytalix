# Architect/Design, arch-adr0003-amend: ADR-0003 clauses 1 and 3 amended for lazy legality on the owner's word; clause 1 read as the strategy, so ABC-250 and ABC-252 are not blocked; ABC-254's design gate is met when this branch merges

Records only, at `main` `0ca365b3`. Nothing was run, built or timed. The only process run was the seal script.
`qe-ABC-223` holds the host STRICTLY ALONE. Only ADR-0003 and this context were edited.

## Owner word

"ABC-254: yes" (`orch-2026-10-30a/20261101T131000Z-orchestrator-decision-f7a50e95`, verbatim inside). That answers
`ADR-0055` D5 Q-SP-3: yes. The acceptance is the owner's. The amendment text is the Architect's.

## Decision

1. **(1-A), amending clause 1.** Make/test/unmake stays the legality test.
   - Each legality call works out three things once: the king square, whether the mover is in check, and the pinned set.
   - The full test runs only for four classes: king moves (castling included), en-passant captures, moves by a pinned
     piece, and every move while in check.
   - Six rules bind it:
     - It is value-identical: same list, same order, `hasLegalMove` agrees, 0 mutations by `toFen` and Zobrist.
     - The classes may include too much, never too little. The completeness argument is on the ADR.
     - The full filter stays in `src/` as fallback and oracle. Deleting it needs a new ADR.
     - (c3), the board-only test, may be folded in. It must handle the en-passant victim, the castling rook and the
       promoted piece, or fall back to a full `makeMove`.
     - It may apply to `legalMoves`, `hasLegalMove`, `legalCaptures` and `legalCapturesAndQueenPromotions`. It does
       not cover `isInCheck`, `givesCheck` or `hasLegalEnPassant`.
     - Signatures stay the same, nothing is cached on `Position` (`ADR-0020`), and the scratch is fixed-size
       (`G7`, growth 0).
2. **(1-R), the reading of clause 1, written down.** This is `OD-206-1`; the owner did not veto it on 2026-10-24.
   - Clause 1 governs how legality is decided. It does not freeze the bytes of `src/legal.ts` or govern how moves and
     undo records are stored.
   - **So `ABC-250` and `ABC-252` are not blocked.** Their list-equality oracles are the clause-1 guard.
   - ADR-0003's July (c4) rejection does not block `ABC-250`. `ADR-0055` O1-b (accepted) and `ABC-250` A4 decide that
     question.
   - Whichever ticket lands first, the other carries the strategy as it stands. The order is the Orchestrator's.
3. **(3-A), amending clause 3.**
   - (c2), with (c3) allowed, is authorized now, without the trigger. Only `ABC-254` delivers it.
   - (c1) and (b) stay unauthorized, behind the same trigger and in the order (c1) then (b).
   - **The falsifiers come from `ABC-254`'s acceptance:**
     - perft 32/32 exact with `PERFT_DEEP=1` (A3);
     - the differential over the six standard roots (≥ 518,474 nodes) and the 285,074 walk, with 0 mismatches and
       0 mutations (A1, A2);
     - the in-check guard, `position-4` ≥ 0.97× (A4). On a miss, the designed response is: when in check, skip the
       pin set and run the full test;
     - the speed bar, ≥ 1.10× on two boards and ≥ 1.00× on the third. On a miss, the ticket is dropped, the
       authorization stays on record unused, and QE records a `failed-attempt`;
     - after merge, any list difference means reverting `ABC-254`.
4. **Consequences and rollback.**
   - No NFR moves. No new NFR.
   - `ADR-0002` needs no edit. Its re-measurement is not a gate on `ABC-254`, which does not touch who owns game
     history.
   - `ABC-009` is unchanged.
   - Rolling back the code means reverting `ABC-254`'s commits. Rolling back the record needs the owner's word.

## ABC-254 design gate: MET once this branch merges

The amendment is the design ruling. It names:

- the classes and the argument that they are complete;
- value-identity as the bar;
- what (c3) must handle;
- which filters it covers;
- how the state is held (`ADR-0020`, `G7`);
- the falsifiers, and the response to an in-check miss.

I recommend `ABC-254` needs no separate In Design hop. The Software Engineer builds against (1-A), and the Architect
reviews only on an A1–A3 red, as the ticket says. That routing is the Orchestrator's call. Three things are left, and
none of them is design:

1. `ABC-254`'s DoR row 10 flips to ✅ (BA/PM, a page edit), then `Backlog → Ready` (Orchestrator).
2. *Optional, BA/PM:* scope item 3 does not name `legalCapturesAndQueenPromotions` (`ABC-229`). (1-A) allows it, and
   A1 must cover it if it is converted. Leaving it on the full test is not a defect.
3. Pull order: `ABC-250` is in Ready and not in development. `ADR-0055` D4 and the `ABC-250`/`ABC-254` pages put
   `ABC-254` first in that case. `arch-adr0056-owner-fold` said "ABC-250 first stands" before Q-SP-3 was answered.
   The Orchestrator orders them. (1-R) makes either order safe.
