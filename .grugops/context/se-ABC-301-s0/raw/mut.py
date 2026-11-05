import sys
mid, root = sys.argv[1], sys.argv[2]
A="      passerTerms(board, whitePassers, whiteKing, blackKing, true, blackToMove, phase) -\n      passerTerms(board, blackPassers, blackKing, whiteKing, false, !blackToMove, phase);"
EV="src/evaluate.ts"; TR="tools/tune/tracer.ts"; TU="tools/tune/tune.ts"
M={
 # QE's three, verbatim from qe-ABC-271 raw/scripts/mutate.py
 "E14":(EV,A,"      passerTerms(board, whitePassers, blackKing, whiteKing, true, blackToMove, phase) -\n      passerTerms(board, blackPassers, whiteKing, blackKing, false, !blackToMove, phase);"),
 "E15":(EV,A,"      passerTerms(board, whitePassers, whiteKing, blackKing, true, blackToMove, phase + 1) -\n      passerTerms(board, blackPassers, blackKing, whiteKing, false, !blackToMove, phase + 1);"),
 "E16":(EV,"    const blackToMove = position.blackToMove;\n    egDelta +=","    const blackToMove = !position.blackToMove;\n    egDelta +="),
 # own: the hot path passes phase 0 (U fires off phase 0); the forced phase-0 form cannot see it
 "H1":(EV,A,"      passerTerms(board, whitePassers, whiteKing, blackKing, true, blackToMove, 0) -\n      passerTerms(board, blackPassers, blackKing, whiteKing, false, !blackToMove, 0);"),
 # own: the tracer
 "T1":(TR,"c[T_KO + r - 1] = (e4a.black.own[r] as number) - (e4a.white.own[r] as number);","c[T_KO + r - 1] = (e4a.white.own[r] as number) - (e4a.black.own[r] as number);"),
 "T2":(TR,"own[R] = (own[R] as number) + Math.min(distance(ownKing, f, qr), 5);","own[R] = (own[R] as number) + Math.min(distance(ownKing, f, qr), 6);"),
 "T3":(TR,"if (phase === 0 && moves < dEnemy - (defenderToMove ? 1 : 0)) unstoppable = 1;","if (phase === 0 && moves < dEnemy) unstoppable = 1;"),
 "T4":(TR,"white ? r <= 7 : r >= 0;","white ? r <= 6 : r >= 1;"),
 "T5":(TR,"      break;\n    }\n  }\n  return { enemy, own, free, unstoppable };","    }\n  }\n  return { enemy, own, free, unstoppable };"),
 "T6":(TR,"  eg[T_UN] = params.PASSED_UNSTOPPABLE.eg;\n",""),
 "T7":(TR,"eg[T_FP + r - 1] = params.PASSED_FREE.eg[r] as number;","eg[T_FP + r - 1] = params.PASSED_KING_OWN.eg[r] as number;"),
 # own: the emitter
 "M1":(TU,None,None),
 "M2":(TU,'`  eg: [0, ${range(T_KO, 6, "eg").join(", ")}, 0],`','`  eg: [0, ${range(T_KE, 6, "eg").join(", ")}, 1],`'),
}
f,a,b=M[mid]; p=root+"/"+f; s=open(p).read()
if mid=="M1":
    i=s.index('    " * E4a (`ABC-271`, `ADR-0070`): passed pawns read the kings')
    i=s.rindex('    "/**",\n',0,i)
    j=s.index('    " * ABC-082\'s other two pawn terms.')
    j=s.rindex('    "/**",\n',0,j)
    s=s[:i]+s[j:]
else:
    assert s.count(a)==1,mid
    s=s.replace(a,b)
open(p,'w').write(s)
