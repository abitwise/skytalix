---
id: 20261023T220816Z-architect-design-observation-cf395b1e
kind: observation
by: architect-design
at: 2026-10-23T22:08:16Z
verified_by: 
confidence: high on the deterministic identity/equality probes (scratch tree, main c735577f); timing figures are INDICATIVE ONLY under load1 ~8.7 and not a reading
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
supersedes: 
seal: sha256:44eba8d3523e5ff63616f7b9b7e9090b03ea7a4315a0d00f71f8da37dd29e986
---

# ABC-206 probes: three-piece prototype is identical to base (A1 2 920 rows, A2 11.1M moves); timing indicative only

Architect/Design, task `arch-design-ABC-206`. A scratch copy of `src/` at `main` `c735577f` in the session scratchpad
(`design206/base`, `design206/branch`). It was never `src/`. Prototype: `hasLegalMove`, `legalCaptures` and
`givesCheck` in `legal.ts`, `leafEndReason` in `gameend.ts`, and both `leafScore`s, `quiesce` and
`lateMoveReduction` switched over. Env toggles staged the pieces.

1. **A1 shape, cut-down corpus.** 13 roots: six perft, six endgames, plus `thin-148` and `rooks-148` at a halfmove
   clock of 148. Each root also contributes its in-progress children.
   - Searches: `chooseMove` (LMR on) and `chooseMoveWithoutReductions` at budgets 3 and 12 on a ticking clock(1),
     and `search` / `searchWithoutReductions` at depths 1–3.
   - **2 920 JSON rows, byte-identical (`cmp`)** between base and branch: move, score, depth, nodes and clock reads.
2. **A2 at full depth 3.** Six perft FENs plus six terminal or clock FENs.
   - 285 074 positions and 11 137 359 moves.
   - `legalCaptures` equals `legalMoves.filter(capture)` as an ordered list.
   - `leafEndReason` equals `gameStatus().reason`.
   - `givesCheck` equals make → `isInCheck` → unmake.
   - The position is unchanged after each call.
   - **0 mismatches.** Reasons seen: null 281 393, checkmate 68, stalemate 2, insufficient-material 202,
     seventy-five-move 3 409. Plain node, 11.3 s.
3. **Lane files on the prototype:** `engine`, `search`, `search.ordering`, `search.pvs-lmr`, `quiescence`,
   `gameend`, `gameend.nfr`, `legal`, `engine.capacity` and `search.capacity`. **229/229 green.**
   - This includes the export pins (`search.test` A6, `engine.test:490`), the LMR source assertion and the NFR-001
     spies.
   - The capacity rows' `legalMoves` mock no longer narrows the leaf or quiescence. Their oracle uses the same
     `quiesce`, so they stay self-consistent.
4. **Timing, INDICATIVE ONLY.** load1 was about 8.7 with other hops running, so this is not a reading.
   - Setup: `chooseMove` to `maxNodes` 400 000 on a frozen clock, n = 3 interleaved. Nodes, depth 6 and score were
     equal at every stage.
   - **kiwipete:** base 2 395–2 844 ms; (i) 1 323–1 429; (i)+(ii) 1 011–1 332; all three 1 025–1 316.
   - **position-6:** base 2 142–2 376; (i) 1 373–1 431; (i)+(ii) 936–1 148; all three 921–1 031.
   - (iii)'s gain is not resolvable from noise.
5. **Read, not run:**
   - `ADR-0003` clause 1, and its counter-reading at `ADR-0020` (ABC-075's byte-identity);
   - `ADR-0005` d2 (`hasLegalEnPassant` homed in `legal.ts`, 2026-08-03);
   - `ADR-0026` d6 (the predicate derives gives-check itself);
   - `ADR-0002` cl. 3–4.
   - The puzzle suite runs on a virtual clock (`ADR-0027`).
   - `ABC-212`'s in-progress diff touches `engine.ts:129` only in `src/engine.ts`.
   - `ABC-205`'s ruling touches `evaluate.ts` and its test only.
