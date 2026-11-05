# se-ABC-282: instrument a SCRATCH copy of the head's engine.ts for the fixture scan. Usage: python3 scan-patch.py <copy>/src/engine.ts
import sys
p=sys.argv[1]; s=open(p,encoding='utf8').read()
a="""    if (move === budget.incumbent) incumbentExact = score > alpha && score < betaIn;
"""
b="""    (globalThis as any).__t?.push({ iter: remaining, a: alphaIn, b: betaIn, run: alpha, idx: index, from: move.from, to: move.to, isI: move === budget.incumbent, score });
"""+a
assert a in s; s=s.replace(a,b)
a="""    budget.beaten = null;
    try {
"""
b="""    budget.beaten = null;
    (globalThis as any).__t = [];
    try {
"""
assert a in s; s=s.replace(a,b)
a="""      if (error === ABORTED) {
        if (budget.beaten"""
b="""      if (error === ABORTED) {
        (globalThis as any).__abort = { t: (globalThis as any).__t, from: best.move.from, to: best.move.to, score: best.score, iter: iteration };
        if (budget.beaten"""
assert a in s; s=s.replace(a,b)
open(p,'w',encoding='utf8').write(s)
