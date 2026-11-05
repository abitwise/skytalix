# qe-ABC-282: instruments a COPY of src/engine.ts (arm I) with event logs only. usage: python3 -I instr.py <arm>/src/engine.ts
# Adds pushes to globalThis.__w1 and __opt. It changes no search decision; the driver checks arm I's rows equal arm H's.
import sys
p = sys.argv[1]; s = open(p).read()
def sub(a, b):
    global s
    assert s.count(a) == 1, a
    s = s.replace(a, b)
sub("  let incumbentExact = false;\n",
    "  let incumbentExact = false;\n  (globalThis as any).__w1?.push({ t: \"pass\", it: remaining, aIn: alphaIn, b: betaIn });\n")
sub("    if (move === budget.incumbent) incumbentExact = score > alpha;\n",
    "    (globalThis as any).__w1?.push({ t: \"ret\", it: remaining, f: move.from, to: move.to, pr: move.promotion, s: score, inc: move === budget.incumbent });\n"
    "    if (move === budget.incumbent) incumbentExact = score > alpha;\n")
sub("    if (softMs !== undefined) budget.incumbent = best.move;\n",
    "    if (softMs !== undefined) budget.incumbent = best.move;\n"
    "    (globalThis as any).__w1?.push({ t: \"iter\", it: iteration, f: best.move.from, to: best.move.to, pr: best.move.promotion, sc: best.score });\n")
sub("      if (error === ABORTED) {\n",
    "      if (error === ABORTED) {\n        (globalThis as any).__w1?.push({ t: \"abort\", it: iteration });\n")
sub("  const { softMs } = options;\n",
    "  const { softMs } = options;\n  (globalThis as any).__opt?.push({ budgetMs: options.budgetMs, softMs, maxDepth: options.maxDepth, maxNodes: options.maxNodes });\n")
open(p, "w").write(s)
print("instrumented")
