# a3.py <base.json> <tip.json> : A3 from the two `npm test` reports. Names only.
import json, os, sys
def load(p):
    r = json.load(open(p)); d = {}
    for f in r["testResults"]:
        n = f["name"]; n = n[n.rindex("/src/") + 1:] if "/src/" in n else n[n.rindex("/tools/") + 1:]
        d[n] = sorted(a["fullName"] for a in f["assertionResults"])
    return r, d
for p in sys.argv[1:3]: assert os.path.getsize(p) > 0, p
(rb, b), (rt, t) = load(sys.argv[1]), load(sys.argv[2])
for lab, r, d in (("base", rb, b), ("tip", rt, t)):
    print(f"{lab}: total {r['numTotalTests']} passed {r['numPassedTests']} failed {r['numFailedTests']} skipped {r['numPendingTests'] + r.get('numTodoTests', 0)} files {len(d)}")
print("file sets equal:", set(b) == set(t))
outs = ins = 0
for f in sorted(set(b) | set(t)):
    o = sorted(set(b.get(f, [])) - set(t.get(f, []))); i = sorted(set(t.get(f, [])) - set(b.get(f, [])))
    if o or i:
        print(f"{f}: {len(b[f])} -> {len(t[f])}, {len(o)} out, {len(i)} in")
        for x in o: print("  - " + x)
        for x in i: print("  + " + x)
    outs += len(o); ins += len(i)
print(f"names out {outs}, in {ins}; a ' [deep' title in the tip's lane: {sum(' [deep' in n for v in t.values() for n in v)}")
