---
id: 20261101T191116Z-software-engineer-decision-96e8d155
kind: decision
by: software-engineer
at: 2026-11-01T19:11:16Z
verified_by: 
confidence: high: boards and bars asserted in-row; bar placement read against production and PL3a counts
refs:
  - se-ABC-261
  - ABC-261
  - ABC-254
  - EPIC-010
  - ADR-0003
  - NFR-008
  - NFR-001
  - QE-254-b
  - QE-254-c
  - grugops/ABC-261
  - dd8b17ea
  - ceb28780
  - src/legal.test.ts
  - src/gameend.nfr.test.ts
  - qe-ABC-254/20261101T172756Z-qe-e2e-observation-dede949b
supersedes: 
seal: sha256:614f2835c8fcc7214cbfdd6344ad0edcd73652c6a2c16c365332a5412157f8a3
---

# ABC-261 design: the early-exit row counts spied `isSquareAttackedBy` calls, bar <= 2, in src/gameend.nfr.test.ts; the promotion row is a lazy-vs-full equality on P1 and P2 in src/legal.test.ts

## Early-exit row (QE-254-b), placed in `src/gameend.nfr.test.ts`
- **Why that file:** it already re-routes `./moves.ts` through `vi.mock` for its spies. Adding `isSquareAttackedBy: vi.fn(actual.isSquareAttackedBy)` to that factory costs one line. A `vi.mock` in `src/legal.test.ts` would re-route the module graph for all of its 43 rows.
- **The spy sees legal.ts's calls** because `legal.ts` imports `isSquareAttackedBy` from `./moves.ts` (cross-module). Calls that moves.ts makes internally (castling) are not counted, and this board has no castling rights.
- **Board:** `4k3/8/8/8/8/8/PPP5/4K3 w - - 0 1`. White is out of check. Generation scans from a1 upward, so the first generated move is a king move (Ke1, which has 5 moves: d1, f1, d2, e2, f2). It is legal.
- **A2 asserts in the row:** `isInCheck` is false; `generateMoves(p)[0].piece === KING`; `legalMoves(p)` contains that move; king moves >= 3.
- **Bar:** `0 < calls <= 2`.
  - Production makes 2 calls: the in-check test, then the first king move's test.
  - PL3a makes 6: the in-check test plus all 5 king moves.
  - The `> 0` assertion proves the spy is live, so the bar cannot pass vacuously.
  - The bar is `<=` and not `toBe(2)`, so `ABC-250`'s packing rewrite can test less. ABC-261 test note 1 still holds: the bar sits at production's count, 4 below the full lazy list.
- **PL1 (`fullHasLegalMove`) makes 1 call on this board** and passes this row. A5 holds anyway, because the two `makeMove` bars in the same file turn red. This row does not close PL1, and it was not asked to.

## In-check promotion row (QE-254-c), in `src/legal.test.ts`
- **P1:** `4r2k/P7/8/8/8/8/8/4K3 w - - 0 1`. The e8 rook checks down the e-file. The quiet promotion a7-a8=Q neither blocks nor captures, so it must be absent.
- **P2:** `r3K3/1P6/8/8/8/8/8/7k w - - 0 1`. The a8 rook checks along the eighth rank, and b7-b8=Q blocks it, so it must be present.
- **On both boards the row asserts:**
  - the side to move is in check;
  - a white pawn stands on the seventh rank (`from >> 4 === 6`);
  - the square ahead is empty;
  - `legalCapturesAndQueenPromotions(p)` deep-equals `fullLegalCapturesAndQueenPromotions(p)`, which checks list and order;
  - the promotion is present exactly when expected.
