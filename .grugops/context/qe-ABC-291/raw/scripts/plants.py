# qe-ABC-291: faults planted on a scratch copy, never on the branch. usage: python3 -I plants.py <copy root> <plant id>
# Exact-string edits; a plant whose anchor is not found exits 3, so a plant cannot silently not apply.
import sys
root, pid = sys.argv[1], sys.argv[2]
EV, UCI, TEST = "src/evaluate.ts", "src/uci-session.ts", "src/evaluate.pawns.test.ts"
SOFT = "softMs = budget / ITERATION_GROWTH"
P = {
 # K1 follow-ups
 "flip-left-arm": [(EV, "((file > 0 && board[square + 31] === BLACK_PAWN) ||", "((file > 0 && (board[square + 31] === BLACK_PAWN || (rank <= 3 && board[square + 47] === BLACK_PAWN))) ||")],
 "flip-left-arm-noflip": [(EV, "((file > 0 && board[square + 31] === BLACK_PAWN) ||", "((file > 0 && (board[square + 31] === BLACK_PAWN || (rank <= 3 && board[square + 47] === BLACK_PAWN))) ||"),
    (TEST, "      expect([sums(wing.white, \"mg\"), sums(wing.black, \"mg\")]).toEqual([white, black]);\n", ""),
    (TEST, "      expect([sums(both.white, \"eg\"), sums(both.black, \"eg\")]).toEqual([black, white]);\n", "")],
 "stm-sign": [(EV, "const packed = score + structure + kingSafety + (pawnShape ? shapePart : 0);", "const packed = score + structure + kingSafety + (pawnShape ? (position.blackToMove ? 0 - shapePart : shapePart) : 0);")],
 "stm-memo": [(EV, "function pawnStructureCached(\n  board: Uint8Array,", "let memoStm = 0;\nfunction pawnStructureCached(\n  board: Uint8Array,"),
    (EV, "shapePart = pawnCacheShape[slot] as number;", "shapePart = memoStm === 1 ? 0 - (pawnCacheShape[slot] as number) : (pawnCacheShape[slot] as number);"),
    (EV, "pawnCacheShape[slot] = shapePart;", "pawnCacheShape[slot] = memoStm === 1 ? 0 - shapePart : shapePart;"),
    (EV, "    ? pawnStructureCached(board, whitePawns, blackPawns, pawnSlotWord)", "    ? ((memoStm = position.blackToMove ? 1 : 0), pawnStructureCached(board, whitePawns, blackPawns, pawnSlotWord))")],
 "memo-hit-drops": [(EV, "shapePart = pawnCacheShape[slot] as number;", "shapePart = 0;")],
 "memo-narrow": [(EV, "const pawnCacheShape = new Int32Array(PAWN_CACHE_SLOTS);", "const pawnCacheShape = new Int16Array(PAWN_CACHE_SLOTS);")],
 "memo-negative": [(EV, "pawnCacheShape[slot] = shapePart;", "pawnCacheShape[slot] = shapePart < 0 ? 0 : shapePart;")],
 # D8's leak, ...77dd9228: W1's soft limit handed where the rows say it is not.
 "leak-level-movetime": [(UCI, "  } else if (clock.movetime !== undefined) {\n    budget = clock.movetime;\n", "  } else if (clock.movetime !== undefined) {\n    budget = clock.movetime;\n    " + SOFT + ";\n")],
 "leak-level-clock": [(UCI, "    budget = Math.max(1, Math.min(share, time - MOVE_OVERHEAD_MS));\n", "    budget = Math.max(1, Math.min(share, time - MOVE_OVERHEAD_MS));\n    " + SOFT + ";\n")],
 "leak-movetime": [(UCI, "    if (clock.movetime !== undefined) budget = Math.min(clock.movetime, cap);\n", "    if (clock.movetime !== undefined) { budget = Math.min(clock.movetime, cap); " + SOFT + "; }\n")],
 "leak-simple-clock": [(UCI, "      if (timeMode === \"uci-clock-mode\") " + SOFT + ";\n", "      " + SOFT + ";\n")],
}
for f, a, b in P[pid]:
    p = f"{root}/{f}"; s = open(p, encoding="utf8").read()
    if a not in s: print("ANCHOR NOT FOUND", pid, f, a[:60]); sys.exit(3)
    open(p, "w", encoding="utf8").write(s.replace(a, b, 1))
print("planted", pid)
