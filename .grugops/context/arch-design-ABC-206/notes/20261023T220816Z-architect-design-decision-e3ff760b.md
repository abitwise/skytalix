---
id: 20261023T220816Z-architect-design-decision-e3ff760b
kind: decision
by: architect-design
at: 2026-10-23T22:08:16Z
verified_by: 
confidence: high on the shape and identity-by-construction; A4 gain UNKNOWN - verify (QE, width 1); OD-206-1 is a reading for owner veto
refs:
  - ABC-206
  - EPIC-008
  - ABC-078
  - ABC-077
  - ABC-212
  - ABC-205
  - ABC-204
  - NFR-001
  - NFR-004
  - NFR-005
  - NFR-008
  - ADR-0003
  - ADR-0005
  - ADR-0020
  - ADR-0026
  - ADR-0002
  - ADR-0027
  - c735577f
  - f47b3429
  - arch-analyse-game-1/20261023T201218Z-architect-design-decision-f1771bb3
  - owner-word-2026-10-23/20261023T203000Z-orchestrator-decision-7feb0553
  - plans/tickets/ABC-206-the-search-runs-faster-with-identical-answers.md
  - arch-design-ABC-206/20261023T220816Z-architect-design-observation-cf395b1e
supersedes: 
seal: sha256:475414da0af5f90d919a44e2510dbb24b940361127d98445173738fbd302dfd4
---

# ABC-206 design ruled: leaf via leafEndReason + hasLegalMove, legalCaptures in quiescence, givesCheck in LMR; no door, no ADR, no NFR bound move; OD-206-1 reading for owner veto

Architect/Design, task `arch-design-ABC-206`, at `main` `c735577f`. `main` moved to `f47b3429` during the hop, with
no `src/` change. The full text is on the branch, at the ABC-206 page § Design ruling (2026-10-24). The evidence is
the observation note sealed with this one.

## Rulings
1. **Leaf (i).**
   - `leafEndReason(position): EndReason | null` goes in `src/gameend.ts`. It equals `gameStatus(position).reason`
     with no counts map, in the same check order.
   - It uses `hasLegalMove` (in `src/legal.ts`), which exits at the first legal move. It never calls `legalMoves` or
     `zobristKey`.
   - Both `leafScore`s read it.
   - Rejected: one `legalMoves` at the leaf handed to `quiesce`. It still plays every move at stand-pat-cut leaves,
     and it changes `quiesce`'s signature.
2. **Quiescence (ii).** `legalCaptures(position)` goes in `src/legal.ts`. It walks `generateMoves`, skips
   non-captures, and runs the same make/test/unmake check.
   - Its list is the same as `legalMoves.filter(capture)`, in the same order (order-preserving filters commute).
   - `src/moves.ts` is not touched, and no captures-only pseudo-generator is built.
3. **LMR (iii).** `givesCheck(position, move)` goes in `src/legal.ts`.
   - A `FLAG_NONE` move is tested with a two-byte board poke and `isSquareAttackedBy`.
   - A flagged move falls back to make → `isInCheck` → unmake.
   - `lateMoveReduction`'s signature, contract and condition order are unchanged (`ADR-0026` d6).
   - The geometric form is not built.
4. **Byte-identical:**
   - `legalMoves`, `isInCheck`, `hasLegalEnPassant` and `gameStatus`;
   - `quiesce`'s signature;
   - `moves.ts`, `apply.ts`, `perft.ts` and `evaluate.ts`;
   - the node definition.
5. **No test-only door.**
   - No new export in `search.ts` or `engine.ts`, so both pins are unchanged.
   - The four new exports are production functions. **No ADR is owed.**
6. **`OD-206-1`: a reading of `ADR-0003` cl. 1, not a STOP.**
   - The clause keeps the make/test/unmake strategy. It is not a byte freeze of `legal.ts`.
   - Precedent: `ADR-0005` d2. Counter-reading: `ADR-0020` (ABC-075).
   - None of (c1)/(c2)/(b) is taken.
   - **Veto fallback:** drop (ii) and (iii), and build (i) as the rejected one-generation shape, with no
     `legal.ts` edit.
7. **Identity.**
   - By construction it is the same tree: the same `countNode`/`visit` and the same clock reads.
   - `A1` reads move, score **and nodes**. The node definition does not change.
   - **`A2`:** lane rows in `legal.test.ts` and `gameend.test.ts` at depth 1 plus the terminal FENs. Depth 3 runs
     behind `ENGINE_DEEP=1`. No new test file.
   - **Spied count guards:** `leafEndReason` calls `legalMoves` 0 times, `hasLegalMove` once and `zobristKey` 0
     times. `quiesce` calls `legalMoves` 0 times. `lateMoveReduction` calls `makeMove` 0 times on a `FLAG_NONE`
     move.
   - **`A1`:** a review-time two-tree differential against the branch's **merge base**.
     - Corpus: the `ABC-078` `A3` deep corpus.
     - Searches: the shipped `chooseMove`, which is the only row with LMR on; the `…WithoutReductions` and
       `…WithoutPvsOrReductions` doors; and `search` at depths 1–3.
     - Compared: move, score, depth, nodes and clock reads.
     - It runs at each of the 3 commits. No golden file.
8. **Commits:** (i), then (ii), then (iii). Each is value-identical and each is droppable.
9. **NFR.**
   - `NFR-001`: no bound moves. The "every search leaf calls" text goes stale, and Security/NFR records a dated note.
   - Perft counts and rate are unchanged by construction.
   - `NFR-004`: the clock reads are equal.
   - `NFR-005`: expected to improve.
   - `NFR-008`: no new file.
10. **Merge order: `ABC-212` → `ABC-206` → `ABC-205`.**
    - The files are disjoint except `src/engine.ts`. `ABC-212` edits `:129`; this ticket edits `:75` and
      `:238–249`. This ticket does not edit `engine.test.ts`.
    - If `main` moves, merge `main` in (no rebase), re-run `A1` against the new base, and take `G1`'s baseline from
      that base.
    - Timing readings run at width 1, never beside `ABC-212` `A4`, `ABC-205` `A5` or `EPIC-008` readings.

## Next move
- **Orchestrator:** merge the records, report `OD-206-1` to the owner as INFO with the veto open, and move ABC-206
  `In Design` → `Ready for Dev`.
- **SE:** build the 3 commits.
- **QE:** `A1` at the tip, `A4` at width 1 (n ≥ 7), `G6`, `G1`, perft, and `A6` once `ABC-204` is Done.
- **Security/NFR:** the `NFR-001` dated note only.

## Not touched
`src/`, the tests, `plans/nfr-catalog.md`, the board, the trace and every ADR.
