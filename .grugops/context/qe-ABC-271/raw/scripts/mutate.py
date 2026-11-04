# qe-ABC-271 scratch-copy mutants (never the worktree). usage: python3 mutate.py <clean evaluate.ts> <out evaluate.ts> <id>
import sys
src = open(sys.argv[1]).read(); mid = sys.argv[3]
def rep(old, new):
    global src
    assert src.count(old) == 1, (mid, old, src.count(old))
    src = src.replace(old, new)
M = {
 "E1": ("moves < enemyDistance - (defenderToMove ? 1 : 0)", "moves < enemyDistance"),                       # side to move ignored in U
 "E2": ("moves < enemyDistance - (defenderToMove", "moves < Math.min(enemyDistance, 5) - (defenderToMove"),  # U's d capped at 5
 "E3": ("      if (board[at] !== EMPTY) {\n        free = false;\n        break;\n      }\n      if (at === queening) break;",
        "      if (at === queening) break;\n      if (board[at] !== EMPTY) {\n        free = false;\n        break;\n      }"),  # walk stops before Q
 "E4": ("    whitePassersPart = pawnCacheWhitePassers[slot] as number;\n", "    whitePassersPart = 0;\n"),  # hit drops the white word
 "E5": ("if (((blackPassers >> (3 * file)) & 7) === 0) blackPassers |= rank << (3 * file);",
        "blackPassers = (blackPassers & ~(7 << (3 * file))) | (rank << (3 * file));"),  # black records its REAR passer
 "E6": ("      if (board[at] !== EMPTY) {", "      if (board[at] !== EMPTY && (board[at] & 7) !== 6) {"),  # a king does not block
 "E7": ("passerTerms(board, whitePassers, whiteKing, blackKing, true, blackToMove, phase) -",
        "passerTerms(board, whitePassers, blackKing, whiteKing, true, blackToMove, phase) -"),  # hot path: white's kings swapped
 "E8": ("if (phase === 0 && moves < enemyDistance - (defenderToMove ? 1 : 0)) unstoppable = true;",
        "if (phase === 0 && moves < enemyDistance - (defenderToMove ? 1 : 0)) freePath += passedUnstoppableEg;"),  # U per passer, into free
 "E9": ("(enemyDistance < 5 ? enemyDistance : 5)", "(enemyDistance < 6 ? enemyDistance : 6)"),  # enemy cap at 6
 "E10": ("if (phase === 0 && moves", "if (phase <= 1 && moves"),  # U above phase 0
 "E11": ("  pawnCacheWhitePassers[slot] = whitePassersPart;\n", ""),  # a miss does not store the white word
 "E12": ("const ownRank = white ? rank : 7 - rank;", "const ownRank = white ? rank : 6 - rank;"),  # black's R off by one
 "E14": ("      passerTerms(board, whitePassers, whiteKing, blackKing, true, blackToMove, phase) -\n      passerTerms(board, blackPassers, blackKing, whiteKing, false, !blackToMove, phase);",
         "      passerTerms(board, whitePassers, blackKing, whiteKing, true, blackToMove, phase) -\n      passerTerms(board, blackPassers, whiteKing, blackKing, false, !blackToMove, phase);"),  # hot path: both sides' kings swapped (symmetric)
 "E15": ("      passerTerms(board, whitePassers, whiteKing, blackKing, true, blackToMove, phase) -\n      passerTerms(board, blackPassers, blackKing, whiteKing, false, !blackToMove, phase);",
         "      passerTerms(board, whitePassers, whiteKing, blackKing, true, blackToMove, phase + 1) -\n      passerTerms(board, blackPassers, blackKing, whiteKing, false, !blackToMove, phase + 1);"),  # hot path: U never fires (symmetric)
 "E16": ("    const blackToMove = position.blackToMove;\n    egDelta +=", "    const blackToMove = !position.blackToMove;\n    egDelta +="),  # hot path only: side to move inverted (symmetric; outside the source rows' pinned text)
 "E13": ("  if (w < PHASE_SPAN && (whitePassers | blackPassers) !== 0) {", "  if (w < PHASE_SPAN && whitePassers !== 0) {"),  # skipped when only black has a passer
}
if mid not in M: raise SystemExit("unknown " + mid)
rep(*M[mid])
open(sys.argv[2], "w").write(src)
