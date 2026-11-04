# qe-ABC-270 scratch-copy mutants (never the worktree). usage: python3 mutate.py <clean evaluate.ts> <out evaluate.ts> <id>
import sys
src = open(sys.argv[1]).read(); mid = sys.argv[3]
def rep(old, new, count=1):
    global src
    assert src.count(old) >= 1, (mid, old)
    src = src.replace(old, new) if count == 0 else src.replace(old, new, count)
if mid == "Q1":   # walk never sets a queen flag (kings still found)
    rep("if (type >= QUEEN) {", "if (type > QUEEN) {")
elif mid == "Q2": # any queen on the board sets both kings' flag
    rep("kingExposure(board, blackKing, BLACK_PAWN, PAWN, -1, whiteQueen) -", "kingExposure(board, blackKing, BLACK_PAWN, PAWN, -1, whiteQueen || blackQueen) -")
    rep("kingExposure(board, whiteKing, PAWN, BLACK_PAWN, 1, blackQueen);", "kingExposure(board, whiteKing, PAWN, BLACK_PAWN, 1, whiteQueen || blackQueen);")
elif mid == "Q3": # queen COUNT, not a flag, in the hot path
    rep("  let whiteQueen = false;\n  let blackQueen = false;\n  let whitePawns", "  let whiteQueen: any = 0;\n  let blackQueen: any = 0;\n  let whitePawns")
    rep("} else if (black) blackQueen = true;\n        else whiteQueen = true;", "} else if (black) blackQueen++;\n        else whiteQueen++;")
    rep("shelterMissing += PACKED_TERMS[SHELTER_QUEEN_AT] as number;", "shelterMissing += (PACKED_TERMS[SHELTER_QUEEN_AT] as number) * (enemyQueen as any);")
    rep("fileHalfOpen += PACKED_TERMS[HALF_OPEN_QUEEN_AT] as number;", "fileHalfOpen += (PACKED_TERMS[HALF_OPEN_QUEEN_AT] as number) * (enemyQueen as any);")
    rep("fileOpen += PACKED_TERMS[OPEN_QUEEN_AT] as number;", "fileOpen += (PACKED_TERMS[OPEN_QUEEN_AT] as number) * (enemyQueen as any);")
elif mid == "Q4": # half-open queen-on pair never added
    rep("    fileHalfOpen += PACKED_TERMS[HALF_OPEN_QUEEN_AT] as number;\n", "")
elif mid == "Q5": # black king never gets the queen-on terms in evaluate
    rep("kingExposure(board, blackKing, BLACK_PAWN, PAWN, -1, whiteQueen) -", "kingExposure(board, blackKing, BLACK_PAWN, PAWN, -1, false) -")
elif mid == "Q6": # queen-on pairs subtracted
    for t in ["SHELTER_QUEEN_AT", "HALF_OPEN_QUEEN_AT", "OPEN_QUEEN_AT"]:
        pass
    rep("shelterMissing += PACKED_TERMS[SHELTER_QUEEN_AT]", "shelterMissing -= PACKED_TERMS[SHELTER_QUEEN_AT]")
    rep("fileHalfOpen += PACKED_TERMS[HALF_OPEN_QUEEN_AT]", "fileHalfOpen -= PACKED_TERMS[HALF_OPEN_QUEEN_AT]")
    rep("fileOpen += PACKED_TERMS[OPEN_QUEEN_AT]", "fileOpen -= PACKED_TERMS[OPEN_QUEEN_AT]")
elif mid == "Q7": # open queen-on pair loaded with its mg in both halves
    rep("PACKED_TERMS[OPEN_QUEEN_AT] = pair(parameters.KING_FILE_OPEN_QUEEN);", "PACKED_TERMS[OPEN_QUEEN_AT] = pair({ mg: parameters.KING_FILE_OPEN_QUEEN.mg, eg: parameters.KING_FILE_OPEN_QUEEN.mg });")
else:
    raise SystemExit("unknown " + mid)
open(sys.argv[2], "w").write(src)
