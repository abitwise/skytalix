# qe-ABC-281 A3: vitest JSON at base vs tip. Usage: python3 -I a3.py <base.json> <tip.json>
import json, sys, collections
def load(p):
    j = json.load(open(p)); per = collections.defaultdict(list)
    for f in j["testResults"]:
        name = f["name"].split("/src/")[-1] if "/src/" in f["name"] else f["name"].split("/tools/")[-1]
        for a in f["assertionResults"]:
            per[name].append((a["fullName"], a["status"]))
    return j, per
bj, bp = load(sys.argv[1]); tj, tp = load(sys.argv[2])
for lab, j in (("base", bj), ("tip", tj)):
    print(f"{lab}: files {len(j['testResults'])}, total {j['numTotalTests']}, passed {j['numPassedTests']}, failed {j['numFailedTests']}, skipped {j['numPendingTests']}, todo {j.get('numTodoTests',0)}")
print("files equal:", sorted(bp) == sorted(tp))
for f in sorted(set(bp) | set(tp)):
    b = sorted(n for n, _ in bp.get(f, [])); t = sorted(n for n, _ in tp.get(f, []))
    if b != t or f in ("search.null-move.test.ts", "engine.test.ts", "levels.test.ts"):
        out = sorted(set(b) - set(t)); inn = sorted(set(t) - set(b))
        print(f"{f}: base {len(b)}, tip {len(t)}; out {len(out)}, in {len(inn)}")
        for n in out: print("   - " + n)
        for n in inn: print("   + " + n)
deep = [(f, n) for f in tp for n, _ in tp[f] if " [deep" in n]
print(f"tip default-lane names containing ' [deep': {len(deep)}", deep[:5])
print("base default-lane names containing ' [deep':", sum(" [deep" in n for f in bp for n, _ in bp[f]))
