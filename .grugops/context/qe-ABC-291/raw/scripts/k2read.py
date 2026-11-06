# qe-ABC-291 K2 read. usage: python3 -I k2read.py <arm T last-run json> <k2-list-groups.json> <B last-run json> <H last-run json>
# Arm T = the merge-base's tests on the tip's production and tools. Its reds must lie inside K2's list (se-ABC-291 ...cb124720).
# Then titles: what the base's lane has that the tip's does not. Each is a row the tip renamed or dropped.
import json, sys
def rows(p):
    j = json.load(open(p)); out = {}
    for f in j["testResults"]:
        n = f["name"].split("/src/")[-1] if "/src/" in f["name"] else f["name"].split("/tools/")[-1]
        for a in f["assertionResults"]:
            out[n + " | " + a["fullName"]] = a["status"]
        if not f["assertionResults"] and f.get("status") == "failed": out[n + " | <suite failed to load>"] = "failed"
    return out
T = rows(sys.argv[1]); listed = json.load(open(sys.argv[2])); B = rows(sys.argv[3]); H = rows(sys.argv[4])
flat = {}
for g, v in listed.items():
    for r in v: flat[(r if isinstance(r, str) else json.dumps(r))] = g
print("K2 list", {g: len(v) for g, v in listed.items()}, "sum", len(flat))
red = sorted(k for k, s in T.items() if s == "failed")
print("arm T:", len(T), "rows,", len(red), "red")
norm = lambda s: " ".join(s.replace(".test.ts", "").split())
keys = {norm(k): g for k, g in flat.items()}
inl = {}; out = []
for r in red:
    n = norm(r); hit = next((g for k, g in keys.items() if n == k or n.endswith(k) or k.endswith(n)), None)
    if hit: inl[hit] = inl.get(hit, 0) + 1
    else: out.append(r)
print("red inside the list, by group:", inl)
print("red OUTSIDE the list:", len(out)); [print("  ", r) for r in out]
miss = [k for k in keys if not any(norm(r) == k or norm(r).endswith(k) or k.endswith(norm(r)) for r in red)]
print("listed, not red on arm T:", len(miss)); [print("  ", keys[k], "|", k) for k in miss]
print("base rows", len(B), "tip rows", len(H))
gone = sorted(set(B) - set(H)); new = sorted(set(H) - set(B))
print("titles on the base, not on the tip:", len(gone)); [print("  ", r) for r in gone]
print("titles new on the tip:", len(new))
