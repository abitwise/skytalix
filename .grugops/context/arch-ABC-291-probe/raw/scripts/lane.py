# SCRATCH PROBE (arch-ABC-291-probe): PR11's summary. argv: <main json> <cand json>. Host paths become <scratch>.
import json, sys
def read(path):
    d = json.load(open(path)); failed = set(); suites = set(); tests = 0
    for f in d["testResults"]:
        name = f["name"].split("/src/")[-1] if "/src/" in f["name"] else f["name"].split("/tools/")[-1]
        if not f["assertionResults"] and f["status"] == "failed": suites.add(name)
        for a in f["assertionResults"]:
            tests += 1
            if a["status"] == "failed": failed.add(name + " | " + a["fullName"])
    return tests, failed, suites, d["numTotalTests"], d["numPassedTests"], d["numFailedTests"]
m = read(sys.argv[1]); c = read(sys.argv[2])
print(f"main: tests {m[3]} passed {m[4]} failed {m[5]}, suites failed to load {len(m[2])}")
print(f"cand: tests {c[3]} passed {c[4]} failed {c[5]}, suites failed to load {len(c[2])}")
print("\nRed on cand, not on main:")
for x in sorted(c[1] - m[1]): print("-", x)
print("\nRed on main, not on cand:")
for x in sorted(m[1] - c[1]): print("-", x)
print("\nRed on both:")
for x in sorted(m[1] & c[1]): print("-", x)
print("\nSuites failed to load, main:", sorted(m[2]), "\nSuites failed to load, cand:", sorted(c[2]))
