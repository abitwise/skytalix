---
id: 20261101T192954Z-software-engineer-decision-e36367dd
kind: decision
by: software-engineer
at: 2026-11-01T19:29:54Z
verified_by: 
confidence: high: the page's form, value-identical by construction; held by A1/A2 oracles and five planted reds
refs:
  - se-ABC-250
  - ABC-250
  - EPIC-010
  - ADR-0055
  - ADR-0003
  - ADR-0056
  - NFR-001
  - NFR-005
  - NFR-008
  - NFR-009
  - grugops/ABC-250
  - 2e04eee5
  - ceb28780
  - src/moves.ts
  - src/apply.ts
  - src/legal.ts
  - src/zobrist.ts
  - src/perft.ts
  - src/perft.test.ts
  - src/legal.test.ts
supersedes: 
seal: sha256:96e87180865e6ac5b395c728c1d5a11af95034ac989d4f2795ac2097fe17b23b
---

# ABC-250 design: packed moves and per-ply undo stacks in the rules core; perft reads the packed path

- **Form:** the page's form (scope items 1–3), unchanged. ADR-0003 (1-R) rules that clause 1 does not govern how a move or an undo record is stored, so the scope item 4 clause check is met. No Architect design hop was on record. The page's form met A1–A3 as written, so no design question was opened (no STOP).
- **Encoding (`src/moves.ts`):** a move is one int32: from 0-6 | to 7-13 | piece 14-17 | captured 18-21 | flags 22-24 | promotion 25-27. Helpers: `encodeMove`, `packMove`, `unpackMove`, `packedFrom/To/Piece/Captured/Flags/Promotion`.
- **Generation:** `generateMovesPacked(position, out, start)` and `generateCapturesPacked(position, out, start)` write into a caller's `Int32Array` window and return the end index. They walk exactly as `generateMoves` / `generateCaptures` do: squares 0..127, the same offset tables in the same order, pawn push before captures (-1 then +1, ep with ABC-022's two guards), promotions Q, R, B, N, castling last. A run past the buffer throws a RangeError (`assertFits`) instead of silently dropping writes.
- **Legality (`src/legal.ts`):** `legalMovesPacked` / `legalCapturesPacked` are ABC-254's lazy filter (ADR-0003 (1-A)). They use the same four classes, the same `markPins` epoch scratch and the same two-byte test (`staysSafePacked`). Flagged moves take the packed make/unmake on one fixed module undo slot. The filter compacts `out[start, end)` in place, so order is generation order. `hasLegalMove` and `legalCapturesAndQueenPromotions` have no packed form yet: perft does not read them, and the search's move to the packed path is `ABC-251`.
- **Make/unmake (`src/apply.ts`):** `makeMovePacked(position, move, undo, ply)` / `unmakeMovePacked` do field for field what `makeMove` / `unmakeMove` do. The undo state is an `UndoStack`:
  - `state: Int32Array` holds captured (0-3), castling (4-7) and epSquare+1 (8-15).
  - `clock: Float64Array` holds the halfmove clock, because a FEN may give any round-tripping integer beyond int32. An Int32 clock measured within noise (raw/bench-steady.txt) and is not exact, so it was not shipped.
  - The castle-loss table is a `Uint8Array(128)`; the rook leg is worked out arithmetically.
- **Key (`src/zobrist.ts`):** `zobristKeyAfterMovePacked(keyBefore, position, move, undo, ply)` applies the same six components in the same order as `zobristKeyAfterMove`.
- **Perft (`src/perft.ts`):** `perft` / `perftDivide` keep their signatures and run on one module move stack (`Int32Array(128 * 256)`, ≈ 128 KiB) and one `UndoStack(128)`. Each child's window starts where its parent's list ends. A depth above 128 throws. The walk is not re-entrant, so `perftDivide` calls the inner walk. `src/perft-bench.ts` needed no edit because it calls `perft`.
- **Two paths, deliberately:** every object function keeps its bytes, signature and output. The search, quiescence, ordering, the TT and the shell are untouched. Until `ABC-252`, A2's oracle holds the two paths together.
- **G7:** every new array is allocated once at module load and reused, so growth is 0 by construction (move stack 131 072 B, perft undo 1 536 B, legal scratch 12 B).
