# se-ABC-289: planted faults, one at a time, on a scratch copy; each must red a DP1 row. python3 mut.py <tree> <i>
import sys
t,i=sys.argv[1],int(sys.argv[2])
p=t+'/src/quiescence.ts'; s=open(p).read()
RULE="""    if (skipDelta && move.promotion === EMPTY) {
      const bound = deltaBase + (ORDER_VALUE[pieceType(move.captured)] as number);
      if (bound <= alpha) {
        if (bound > best) best = bound;
        continue;
      }
    }
"""
SEE="""    if (skipLosing && isLosingCapture(position, move)) continue;
"""
M=[("F9 stand-pat return",lambda s:s.replace("        if (bound > best) best = bound;\n","")),
("order reversed",lambda s:s.replace(RULE,"@@").replace(SEE,SEE+RULE).replace("@@","")),
("break for continue",lambda s:s.replace("        if (bound > best) best = bound;\n        continue;","        if (bound > best) best = bound;\n        break;")),
("strict <",lambda s:s.replace("if (bound <= alpha)","if (bound < alpha)")),
("margin 201",lambda s:s.replace("DELTA_MARGIN = 200","DELTA_MARGIN = 201")),
("promotions tested",lambda s:s.replace("if (skipDelta && move.promotion === EMPTY)","if (skipDelta)")),
("in check too",lambda s:s.replace("  let skipDelta = false;\n  let deltaBase = 0;\n","  let skipDelta = rules.deltaPruning === true;\n  let deltaBase = -1000000;\n")),
("seam: always on",lambda s:s.replace("skipDelta = rules.deltaPruning === true;","skipDelta = true;"))]
n,f=M[i]; r=f(s); assert r!=s,n; open(p,'w').write(r); print(n)
