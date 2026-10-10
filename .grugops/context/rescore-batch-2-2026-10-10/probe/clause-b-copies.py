# ABC-073: which ticket pages restate clause (b), and which carry the fail-safe, over WHITESPACE-NORMALIZED text.
# Usage: python3 -I clause-b-copies.py <tree>
import re, glob, os, sys
for f in sorted(glob.glob(os.path.join(sys.argv[1], 'plans/tickets/*.md'))):
    raw = open(f).read(); t = re.sub(r'\s+', ' ', raw)
    st = (re.search(r'^status: (.*)$', raw, re.M) or [None, '?'])[1]
    restates = 'non-`.test.ts` file under' in t
    failsafe = 'fires and the gate resolves it' in t
    perline = any('fires and the gate resolves it' in l for l in raw.splitlines())
    if restates or (failsafe and st != 'done'):
        print(st, os.path.basename(f)[:7], 'restates' if restates else '-', 'failsafe' if failsafe else 'NO-failsafe', '' if perline == failsafe else '(per-line grep disagrees)')
