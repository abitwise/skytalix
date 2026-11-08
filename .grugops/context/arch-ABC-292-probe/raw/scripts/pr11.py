# SCRATCH PROBE (arch-ABC-292-probe): PR11's summary, after arch-ABC-291-probe's lane.py. argv: <out dir>. Reads G-main.json,
# G-cand.json and the G-deep-*-{main,cand}.json files. Host paths become relative names. A deep run with no test, or
# with a missing file, is printed as a failure.
import json, sys, os
O = sys.argv[1]
def rel(n):
    for k in ("/src/", "/tools/"):
        if k in n: return k.strip("/") + "/" + n.split(k, 1)[1]
    return os.path.basename(n)
def read(path):
    if not os.path.exists(path) or os.path.getsize(path) == 0: return None
    d = json.load(open(path)); failed = set(); suites = set()
    for f in d["testResults"]:
        if not f["assertionResults"] and f["status"] == "failed": suites.add(rel(f["name"]))
        for a in f["assertionResults"]:
            if a["status"] == "failed": failed.add(rel(f["name"]) + " | " + a["fullName"])
    return dict(total=d["numTotalTests"], passed=d["numPassedTests"], failed=d["numFailedTests"], pending=d["numPendingTests"] + d.get("numTodoTests", 0), files=len(d["testResults"]), red=failed, suites=suites)
m = read(f"{O}/G-main.json"); c = read(f"{O}/G-cand.json")
for tag, x in (("main", m), ("cand", c)):
    print(f"{tag}: " + ("MISSING" if x is None else f"files {x['files']} tests {x['total']} passed {x['passed']} failed {x['failed']} pending {x['pending']}, suites failed to load {len(x['suites'])}"))
if m and c:
    print("\nRed on cand, not on main:"); [print("-", x) for x in sorted(c["red"] - m["red"])]
    print("\nRed on main, not on cand:"); [print("-", x) for x in sorted(m["red"] - c["red"])]
    print("\nRed on both:"); [print("-", x) for x in sorted(m["red"] & c["red"])]
    print("\nSuites failed to load, main:", sorted(m["suites"]), "\nSuites failed to load, cand:", sorted(c["suites"]))
print("\nDeep rows (-t):")
for tag in ("uci", "engine", "bundle"):
    for d in ("main", "cand"):
        x = read(f"{O}/G-deep-{tag}-{d}.json")
        if x is None: print(f"- {tag} {d}: MISSING (a failure)"); continue
        ran = x["passed"] + x["failed"]
        state = "NO TESTS (a failure)" if ran == 0 else ("green" if x["failed"] == 0 else "RED")
        print(f"- {tag} {d}: ran {ran}, passed {x['passed']}, failed {x['failed']}, skipped {x['pending']}: {state}")
        for r in sorted(x["red"]): print(f"    red: {r}")
