# qe-ABC-254 plants: rewrites src/legal.ts of a plant tree (never the worktree). usage: plant.py <legal.ts> <id>
import sys
p, pid = sys.argv[1], sys.argv[2]
s = open(p).read()
def rep(a, b):
    global s
    assert s.count(a) == 1, (pid, a[:60])
    s = s.replace(a, b)
HLM = "export function hasLegalMove(position: Position): boolean {\n"
LC = "export function legalCaptures(position: Position): Move[] {\n  return filterLazily(position, generateCaptures(position));\n}"
if pid == "PL1":
    rep(HLM, HLM + "  return fullHasLegalMove(position); // PLANT PL1\n")
    rep(LC, "export function legalCaptures(position: Position): Move[] {\n  return fullLegalCaptures(position); // PLANT PL1\n}")
elif pid == "PL2":
    rep(HLM, HLM + "  return fullLegalMoves(position).length > 0; // PLANT PL2\n")
    rep(LC, "export function legalCaptures(position: Position): Move[] {\n  return fullLegalMoves(position).filter((m) => m.captured !== EMPTY); // PLANT PL2\n}")
elif pid == "PL3a":
    rep(HLM, HLM + "  return legalMoves(position).length > 0; // PLANT PL3a\n")
elif pid == "PL3b":
    rep(LC, "export function legalCaptures(position: Position): Move[] {\n  return legalMoves(position).filter((m) => m.captured !== EMPTY); // PLANT PL3b\n}")
elif pid == "PQ1":
    rep("if (type === slider || type === QUEEN) pinStamp[shield] = epoch;", "if (type === slider) pinStamp[shield] = epoch; // PLANT PQ1")
elif pid == "PQ2":
    rep("      (inCheck || pinStamp[from] === epoch) &&\n", "      (!inCheck && pinStamp[from] === epoch) && // PLANT PQ2\n")
elif pid == "PQ3":
    rep("      if (move.piece === king) {\n        if (!staysSafe(position, move, move.to, moverIsBlack)) continue; // class 1",
        "      if (move.piece === king) {\n        if (!staysSafe(position, move, kingHome, moverIsBlack)) continue; // class 1 PLANT PQ3")
else:
    raise SystemExit("unknown plant " + pid)
open(p, "w").write(s)
print("planted", pid)
