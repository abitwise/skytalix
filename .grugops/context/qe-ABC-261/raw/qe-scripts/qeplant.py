# qe-ABC-261 own plants (QE). usage: qeplant.py <tree> <id>. Rewrites a plant tree only, never the worktree.
import sys
t, pid = sys.argv[1], sys.argv[2]
def edit(rel, a, b):
    p = f"{t}/{rel}"; s = open(p).read()
    assert s.count(a) == 1, (pid, rel, a[:70], s.count(a))
    open(p, "w").write(s.replace(a, b))
HLM_OOC = "  const epoch = markPins(position.board, kingHome, moverIsBlack);\n  for (const move of moves) {\n    if (move.piece === king) {\n      if (staysSafe(position, move, move.to, moverIsBlack)) return true;"
if pid == "QX1":  # out of check, an untested-class move no longer answers at once: the loop keeps going (value kept)
    edit("src/legal.ts", HLM_OOC, HLM_OOC.replace("  for (const move", "  let quiet = false; // PLANT QX1\n  for (const move"))
    edit("src/legal.ts", "    } else {\n      return true;\n    }\n  }\n  return false;\n}", "    } else {\n      quiet = true; // PLANT QX1\n    }\n  }\n  return quiet;\n}")
elif pid == "QX2":  # early exit lost only out of check when the first generated move is not a king move
    edit("src/legal.ts", HLM_OOC, HLM_OOC.replace("  for (const move", "  if (moves[0] !== undefined && moves[0].piece !== king) return legalMoves(position).length > 0; // PLANT QX2\n  for (const move"))
elif pid == "QN":  # in check, the quiet promotion is to a knight instead of a queen
    edit("src/legal.ts", "      flags: FLAG_PROMOTION,\n      promotion: QUEEN,\n    };\n    // A pawn move never", "      flags: FLAG_PROMOTION,\n      promotion: inCheck ? 2 : QUEEN, // PLANT QN (2 = KNIGHT)\n    };\n    // A pawn move never")
elif pid == "QB":  # PQ2 for black only: black in check skips the quiet-promotion test
    edit("src/legal.ts", "      (inCheck || pinStamp[from] === epoch) &&\n", "      ((inCheck && !moverIsBlack) || pinStamp[from] === epoch) && // PLANT QB\n")
elif pid == "QR":  # harmless generator reorder: generateMoves returns its list reversed (same set)
    edit("src/moves.ts", "export function generateMoves(position: Position): Move[] {\n", "export function generateMoves(position: Position): Move[] {\n  return qeGen(position).reverse(); // PLANT QR\n}\nfunction qeGen(position: Position): Move[] {\n")
else:
    raise SystemExit("unknown plant " + pid)
print("planted", pid)
