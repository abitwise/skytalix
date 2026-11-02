# qe-ABC-268 plants, applied to a scratch copy of head. usage: python3 qe-plant.py <root> <QPn>
import sys
root, which = sys.argv[1], sys.argv[2]
SP, EP = root + "/src/search.ts", root + "/src/engine.ts"
def sub(path, old, new):
    s = open(path).read()
    n = s.count(old)
    if n != 1:
        raise SystemExit(f"{which}: {path}: expected 1 of {old[:60]!r}, found {n}")
    open(path, "w").write(s.replace(old, new))
P = {
  # White-side static score in the node test
  "QP1": [(SP, "  return evaluate(position) + (FUTILITY_MARGIN[depth] as number) <= alphaIn;",
               "  return (position.blackToMove ? 0 - evaluate(position) : evaluate(position)) + (FUTILITY_MARGIN[depth] as number) <= alphaIn;")],
  # en passant treated as quiet (skippable)
  "QP2": [(SP, "  if (move.captured !== EMPTY || move.promotion !== EMPTY) return false;",
               "  if ((move.captured !== EMPTY && move.flags !== 1) || move.promotion !== EMPTY) return false;")],
  # fail-hard at a futile node, search.ts
  "QP3": [(SP, "  if (switches.table) storeEntry(key, depth, boundOf(best, alphaIn, beta), best, ply, bestMove);\n  return best;",
               "  if (futile && best < alphaIn) best = alphaIn;\n  if (switches.table) storeEntry(key, depth, boundOf(best, alphaIn, beta), best, ply, bestMove);\n  return best;")],
  # fail-hard at a futile node, engine.ts
  "QP4": [(EP, "  storeEntry(key, remaining, boundOf(best, alphaIn, beta), best, ply, bestMove);\n  return best;",
               "  if (futile && best < alphaIn) best = alphaIn;\n  storeEntry(key, remaining, boundOf(best, alphaIn, beta), best, ply, bestMove);\n  return best;")],
  # the new engine door drops game history
  "QP5": [(EP, "    priorKeys: true,\n    quiescenceEvasions: true,\n    quietPromotions: true,\n    futility: false,\n  });",
               "    priorKeys: false,\n    quiescenceEvasions: true,\n    quietPromotions: true,\n    futility: false,\n  });")],
  # king moves never skipped
  "QP6": [(SP, "  if (index < 1) return false;\n  if (move.captured",
               "  if (index < 1) return false;\n  if (pieceType(move.piece) === KING) return false;\n  if (move.captured")],
  # mate-band guard against MATE_SCORE
  "QP7": [(SP, "  if (alphaIn >= MATE_FLOOR || alphaIn <= 0 - MATE_FLOOR) return false;\n  if (beta >= MATE_FLOOR || beta <= 0 - MATE_FLOOR) return false;",
               "  if (alphaIn >= MATE_SCORE || alphaIn <= 0 - MATE_SCORE) return false;\n  if (beta >= MATE_SCORE || beta <= 0 - MATE_SCORE) return false;")],
  # engine passes index + 1
  "QP8": [(EP, "    if (futile && futileMove(position, move, index)) {", "    if (futile && futileMove(position, move, index + 1)) {")],
}
for path, old, new in P[which]:
    sub(path, old, new)
print(f"{which} planted")
