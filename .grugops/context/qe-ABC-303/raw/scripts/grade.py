#!/usr/bin/env python3
# qe-ABC-303: reads <qe-scratch>/out/rows and out/gates. Every file is checked non-empty first; an empty one is UNREAD.
import json, sys, os
q = sys.argv[1]; rows = f"{q}/out/rows"; gates = f"{q}/out/gates"
def load(n):
    p = f"{rows}/{n}.jsonl"
    if not os.path.exists(p) or os.path.getsize(p) == 0:
        print(f"UNREAD {n}: empty or absent"); return []
    return [json.loads(l) for l in open(p) if l.strip()]
s1 = load("s1"); print("S1", s1[-1] if s1 else None); print("  d8", [(r["what"], r["name"], r["nodes"]) for r in s1 if r.get("d") == 8])
s2 = load("s2"); print("S2 doors", s2[0] if s2 else None, s2[-1] if s2 else None); print("  red", [r for r in s2 if r.get("ok") is False])
f = load("floor")
if f:
    print("S3", {k: (v["violations"], v["mates"]) for k, v in f[0].items() if isinstance(v, dict)}, "n", f[0]["n"])
z = load("zug"); print("S4", z[-1] if z else None, [r["name"] for r in z if r.get("ok") is False])
print("S5", load("g1"))
d = load("drift")
for r in d: print("DRIFT", r)
n = load("nodes")
for r in n: print("NODES", r)
for r in load("reach"): print("REACH", r)
print("P5", load("bytes")); print("FORMS", load("forms"))
for r in load("krk"): print("KRK", r)
print("FIRE", load("fire")); print("AUDIT", load("audit"))
print(open(f"{rows}/exits.tsv").read())
print(open(f"{gates}/exits.tsv").read())
