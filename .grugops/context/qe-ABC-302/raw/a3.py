# qe-ABC-302 A3: base vs tip default-lane vitest JSON (A8 round 1, arms B and H). Usage: python3 -I a3.py <B.json> <H.json>
import json, sys
from collections import defaultdict
def load(p):
    j = json.load(open(p)); per = defaultdict(list)
    for f in j["testResults"]:
        n = f["name"].split("/src/")[-1] if "/src/" in f["name"] else f["name"].split("/")[-1]
        for a in f["assertionResults"]: per[n].append((a["fullName"], a["status"]))
    return j, per
jb, pb = load(sys.argv[1]); jh, ph = load(sys.argv[2])
for tag, j, p in (("base", jb, pb), ("tip", jh, ph)):
    deep = [n for v in p.values() for n, _ in v if "[deep" in n]
    print(f"{tag}: files {len(j['testResults'])}, total {j['numTotalTests']}, passed {j['numPassedTests']}, failed {j['numFailedTests']}, pending {j['numPendingTests']}, todo {j.get('numTodoTests', 0)}; '[deep' names {len(deep)}")
print("files equal:", sorted(pb) == sorted(ph))
for f in sorted(set(pb) | set(ph)):
    nb = sorted(n for n, _ in pb.get(f, [])); nh = sorted(n for n, _ in ph.get(f, []))
    if nb != nh:
        print(f"## {f}: {len(nb)} -> {len(nh)}")
        for n in sorted(set(nb) - set(nh)): print(f"   out: {n}")
        for n in sorted(set(nh) - set(nb)): print(f"   in:  {n}")
