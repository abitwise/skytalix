# qe-ABC-301-s0 scratch tool mutants. usage: python3 mut301t.py <M root> <id>
import sys
root,mid=sys.argv[1],sys.argv[2]
TR="tools/tune/tracer.ts"; TU="tools/tune/tune.ts"
M={
 "T8":(TR,"const moves = R === 1 ? 5 : 7 - R;","const moves = 7 - R;"),
 "T9":(TR,"if (phase === 0 && moves < dEnemy - (defenderToMove ? 1 : 0)) unstoppable = 1;","if (phase === 0 && moves < Math.min(dEnemy, 5) - (defenderToMove ? 1 : 0)) unstoppable = 1;"),
 "T10":(TR,"if (phase === 0 && moves < dEnemy","if (phase <= 1 && moves < dEnemy"),
 "T11":(TR,"black: sideCounts(b, BLACK_PAWN, bk, wk, !stm, phase),","black: sideCounts(b, BLACK_PAWN, bk, wk, stm, phase),"),
 "T12":(TR,"own[R] = (own[R] as number) + Math.min(distance(ownKing, f, qr), 5);","own[R] = (own[R] as number) + distance(ownKing, f, qr);"),
 "T14":(TR,"c[T_UN] = e4a.white.unstoppable - e4a.black.unstoppable;","c[T_UN] = e4a.white.unstoppable + e4a.black.unstoppable;"),
 "M3":(TU,'`  eg: [0, ${range(T_KO, 6, "eg").join(", ")}, 0],`','`  eg: [0, ${range(T_KE, 6, "eg").join(", ")}, 0],`'),
 "M4":(TU,"PASSED_KING_OWN: byRank(T_KO),","PASSED_KING_OWN: byRank(T_KE),"),
 "M5":(TU,'`  eg: [0, ${range(T_FP, 6, "eg").join(", ")}, 0],`','`  eg: [0, ${range(T_KO, 6, "eg").join(", ")}, 0],`'),
}
f,a,b=M[mid]; p=root+"/"+f; s=open(p).read(); assert s.count(a)==1,mid; open(p,"w").write(s.replace(a,b))
