# qe-ABC-250 plants on the packed path: rewrites one file of a plant tree (never the worktree). usage: plant.py <srcDir> <id>
import sys, os
src, pid = sys.argv[1], sys.argv[2]
def rep(f, a, b, count=None):
    p = os.path.join(src, f); s = open(p).read()
    if count is None: assert s.count(a) == 1, (pid, a[:70])
    else: assert s.count(a) >= 1, (pid, a[:70])
    s = s.replace(a, b, 1); open(p, "w").write(s)
UNDO = "undo.state[ply] = captured | (position.castling << 4) | ((position.epSquare + 1) << 8);"
if pid == "QP1":   # promotion piece: every packed promotion makes a queen
    rep("apply.ts", "board[to] = packedPromotion(move) | (piece & BLACK);", "board[to] = 5 | (piece & BLACK); // PLANT QP1")
elif pid == "QP2": # castling rights not kept in the undo slot
    rep("apply.ts", UNDO, "undo.state[ply] = captured | ((position.epSquare + 1) << 8); // PLANT QP2")
elif pid == "QP3": # en-passant square not kept in the undo slot
    rep("apply.ts", UNDO, "undo.state[ply] = captured | (position.castling << 4); // PLANT QP3")
elif pid == "QP4": # captured field loses its colour bit
    rep("moves.ts", "export const packedCaptured = (move: number): number => (move >> CAPTURED_SHIFT) & 15;",
        "export const packedCaptured = (move: number): number => (move >> CAPTURED_SHIFT) & 7; // PLANT QP4")
elif pid == "QP5": # packed key omits the new en-passant file
    rep("zobrist.ts", "  if (epBefore !== NO_SQUARE) key ^= EP_FILE[fileOf(epBefore)] as bigint;\n  if (position.epSquare !== NO_SQUARE) key ^= EP_FILE[fileOf(position.epSquare)] as bigint;\n",
        "  if (epBefore !== NO_SQUARE) key ^= EP_FILE[fileOf(epBefore)] as bigint; // PLANT QP5\n")
elif pid == "QP6": # packed generator emits castling FIRST (order only; perft counts cannot see it)
    p = os.path.join(src, "moves.ts"); s = open(p).read()
    g = s.index("export function generateMovesPacked("); c = s.index("export function generateCapturesPacked(")
    body = s[g:c]
    assert body.count("  let n = start;\n") == 1 and body.count("  n = writeCastlingMoves(out, n, position, black);\n") == 1
    body = body.replace("  let n = start;\n", "  let n = writeCastlingMoves(out, start, position, black); // PLANT QP6\n")
    body = body.replace("  n = writeCastlingMoves(out, n, position, black);\n", "")
    open(p, "w").write(s[:g] + body + s[c:])
else:
    raise SystemExit("unknown plant " + pid)
print("planted", pid)
