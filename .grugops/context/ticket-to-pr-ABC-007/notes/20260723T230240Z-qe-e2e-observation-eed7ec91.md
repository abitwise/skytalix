---
id: 20260723T230240Z-qe-e2e-observation-eed7ec91
kind: observation
by: qe-e2e
at: 2026-07-23T23:02:40Z
verified_by: 
confidence: high
refs:
  - ABC-007
  - src/gameend.test.ts
  - src/zobrist.test.ts
supersedes: 
---

QE pass on ABC-007. No defects. All seven acceptance criteria pass on exact FENs (and, for repetition, an exact move list): fool's mate → black-wins/checkmate, the Qf7 stalemate → draw/stalemate, the knight-shuffle → draw/threefold-repetition on the third occurrence, halfmove-clock-99 + quiet move → draw/fifty-move, K v K → draw/insufficient-material, opposite-coloured bishops → in-progress (NOT drawn), and startpos → in-progress/null.

**The over-application trap is closed both ways.** The insufficient-material table is tested as a matrix: draws (KvK, K+N v K, K+B v K, K+B v K+B same colour) AND non-draws (a lone pawn, a rook, bishop-vs-knight across armies). The opposite-coloured-bishop negative is the case the ticket warns about — over-applying it would draw winnable games — and it correctly reports in-progress.

**Precedence verified adversarially.** Mate-over-fifty-move: a back-rank mate with halfmoveClock=100 returns checkmate/white-wins, not a fifty-move draw. That is the ordering bug a naive implementation ships, and it does not exist here.

**Threefold rests on Zobrist, which is independently tested.** zobrist.test.ts proves the key is deterministic, ignores move counters (so a repeat with a different clock still matches), and shifts on each of side / castling / ep — and round-trips exactly through make/unmake. So the repetition count is comparing the right thing. I also confirmed a position absent from the history is not falsely reported as a repetition.

**Cheap by construction (NFR-001).** gameStatus generates the legal move list once; I read the code path — there is no second generation, and isInCheck only runs on an empty list. Terminal detection adds one move-gen at a leaf, which is the move-gen the search already needed.

**EPIC-001 is complete and green:** the rules core (ABC-001..007) is rule-correct, perft-proven (ABC-006), and now knows when the game is over.
