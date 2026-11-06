# qe-ABC-291 K2 match. k2read.py matched 0 rows: se-ABC-291's list holds each row cut short, and its matcher compared whole strings. This one reads a red
# as listed when it starts with a list entry. usage: python3 -I k2match.py <arm T json> <k2-list-groups.json>. Each list entry may stand for several rows sharing its prefix.
import json, sys
j = json.load(open(sys.argv[1])); red = []
for f in j["testResults"]:
    n = f["name"].split("/src/")[-1] if "/src/" in f["name"] else f["name"].split("/tools/")[-1]
    red += [f"{n} | {a['fullName']}" for a in f["assertionResults"] if a["status"] == "failed"]
listed = json.load(open(sys.argv[2])); by = {}
for g, v in listed.items():
    for e in v: by.setdefault(e, g)
print("list entries", {g: len(v) for g, v in listed.items()}, "total", sum(len(v) for v in listed.values()), "distinct", len(by))
print("red on arm T", len(red))
hit = {}; out = []; seen = set()
for r in red:
    e = next((k for k in by if r.startswith(k)), None)
    if e: hit[by[e]] = hit.get(by[e], 0) + 1; seen.add(e)
    else: out.append(r)
print("red inside the list, by group:", hit, "sum", sum(hit.values()))
print("red outside the list:", len(out)); [print("  ", r[:170]) for r in out]
left = [(g, e) for g, v in listed.items() for e in v if e not in seen]
print("listed, not red on arm T:", len(left)); [print("  ", g, "|", e[:130]) for g, e in left]
