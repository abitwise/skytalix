# qe-ABC-301-s0 scratch mutants (never the worktree). usage: python3 mut301.py <clean evaluate.ts> <out> <id>
# E14-E16 are QE's text (qe-ABC-271 raw/scripts/mutate.py); H1 is the Engineer's; H3-H9 are this hop's own.
import sys
src=open(sys.argv[1]).read(); mid=sys.argv[3]
A="      passerTerms(board, whitePassers, whiteKing, blackKing, true, blackToMove, phase) -\n      passerTerms(board, blackPassers, blackKing, whiteKing, false, !blackToMove, phase);"
def hot(a,b): return (A,"      passerTerms(board, whitePassers, %s, %s, true, blackToMove, %s) -\n      passerTerms(board, blackPassers, %s, %s, false, !blackToMove, %s);"%(a,b,"PH",b,a,"PH"))
def ph(expr):
    o,n=hot("whiteKing","blackKing"); return (o,n.replace("PH",expr))
GATE="  if (w < PHASE_SPAN && (whitePassers | blackPassers) !== 0) {"
M={
 "E14":(A,hot("blackKing","whiteKing")[1].replace("PH","phase")),
 "E15":ph("phase + 1"),
 "E16":("    const blackToMove = position.blackToMove;\n    egDelta +=","    const blackToMove = !position.blackToMove;\n    egDelta +="),
 "H1":ph("0"),
 "H4":ph("phase > 1 ? phase : 0"),      # hot fires U at true phase 1 as well
 "H6":ph("phase === 6 ? 0 : phase"),    # hot fires U at true phase 6 only: above every fixture's phase
 "H5":(GATE,"  if (w < 6 && (whitePassers | blackPassers) !== 0) {"),  # E4a dropped at phases 6-23
 "H7":(GATE,"  if (w < PHASE_SPAN && (whitePassers & blackPassers) !== 0) {"),  # skipped unless both sides have a passer (symmetric)
 "H8":(A,A.replace("board, whitePassers, whiteKing","board, TMP, whiteKing").replace("board, blackPassers, blackKing","board, whitePassers, blackKing").replace("TMP","blackPassers")),  # words swapped (symmetric)
 "H9":("    egDelta +=\n"+A,"    egDelta -=\n"+A),  # the sum's sign (symmetric)
}
if mid=="H3":  # E4a added AFTER the blend, at full weight: exact at w = 0, wrong above it (symmetric)
    a="    egDelta +=\n"+A
    assert src.count(a)==1
    src=src.replace(a,"    e4aLate =\n"+A)
    b="  const whitePassers = whitePassersPart;\n  const blackPassers = blackPassersPart;\n  if (w < PHASE_SPAN"
    assert src.count(b)==1
    src=src.replace(b,"  let e4aLate = 0;\n"+b)
    c="  return mg + Math.trunc((egDelta * (PHASE_SPAN - w)) / PHASE_SPAN);"
    assert src.count(c)==1
    src=src.replace(c,"  return mg + Math.trunc((egDelta * (PHASE_SPAN - w)) / PHASE_SPAN) + e4aLate;")
else:
    o,n=M[mid]; assert src.count(o)==1,mid; src=src.replace(o,n)
open(sys.argv[2],"w").write(src)
