# qe-ABC-255 mutations: apply one textual mutant to a copy of rating.ts; usage: python3 -I mut.py <src> <dst> <id>
import sys
src, dst, mid = sys.argv[1:]
s = open(src).read()
M = {
 "M1": ("  [100, 50],", "  [100, 60],"),
 "M2": ("  [R_SMOKE_BUDGET_MS, 50],\n", ""),
 "M3": ('...sky("skytalix", clones[0] as string, budget),', '...sky("skytalix", clones[0] as string, mode === "r" ? 4000 : budget),'),
 "M4": ("      budget: R_BUDGET_MS,", "      budget: R_SMOKE_BUDGET_MS,"),
 "M5": (': sky("base", clones[1] as string, budget);', ': [...sky("base", clones[1] as string, budget)].map((a) => (a.startsWith("timemargin=") ? `timemargin=${CEILING_MS - budget}` : a));'),
 "M6": ("budgetFlag !== undefined && budget !== R_SMOKE_BUDGET_MS", "budgetFlag !== undefined && budget > R_SMOKE_BUDGET_MS"),
 "M7": ("const D_BUDGETS_MS = [3000, 2500, 2000, 1500, 1000, 100];", "const D_BUDGETS_MS = [3000, 2500, 2000, 1500, 1000];"),
 "M8": ("    ...(SHORT_MARGIN_MS.has(budget)\n", "    ...(false && SHORT_MARGIN_MS.has(budget)\n"),
}
a, b = M[mid]
assert s.count(a) == 1, (mid, s.count(a))
open(dst, "w").write(s.replace(a, b))
