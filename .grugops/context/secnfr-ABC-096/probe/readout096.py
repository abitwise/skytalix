#!/usr/bin/env python3
"""secnfr-ABC-096 readout. Usage: python3 -I readout096.py <window dir>
Applies the pre-registration (probe/preregistration.txt) to one window, mechanically. Prints the void check, then
one line per series with n, min / median / max, and the graded state. A VOID window prints no state."""
import csv, json, statistics, sys
from pathlib import Path

D = Path(sys.argv[1])
once = (D / "once.txt").read_text()
if "gate_pass" not in once:
    print("NOT READ: the gate never passed (GATE_TIMEOUT or not started)")
    sys.exit(0)
gate_pass = once.split("gate_pass ")[1].split()[0]
end = once.split("utc_end ")[1].split()[0] if "utc_end " in once else None

void = []
rows = list(csv.DictReader(open(D / "sampler.tsv"), delimiter="\t"))
inwin = [r for r in rows if r["utc"] >= gate_pass and (end is None or r["utc"] <= end)]
for r in inwin:
    if r["vitest"] != "0" or r["platform"] != "0" or r["thermal"] != "0" or r["lowpower"] not in ("0", ""):
        void.append(f"sampler {r['utc']}: vitest {r['vitest']} platform {r['platform']} thermal {r['thermal']} lowpower {r['lowpower']}")
runs = list(csv.DictReader(open(D / "runs.tsv"), delimiter="\t"))
parsed = []
for r in runs:
    for side in ("b", "a"):
        if r[f"{side}_vitest"] != "0" or r[f"{side}_platform"] != "0" or r[f"{side}_thermal"] != "0" or r[f"{side}_lowpower"] not in ("0", ""):
            void.append(f"{r['series']} #{r['i']} {side}: vitest {r[f'{side}_vitest']} platform {r[f'{side}_platform']} thermal {r[f'{side}_thermal']}")
    try:
        j = json.loads(r["json"])
    except Exception:
        void.append(f"{r['series']} #{r['i']}: malformed reading {r['json'][:80]!r}")
        continue
    parsed.append((r, j))

fc = [json.loads(l) for l in (D / "first-call.jsonl").read_text().splitlines()] if (D / "first-call.jsonl").exists() else []
expected = {**{f"T1-{c}": 10 for c in ["a4-ascii", "a4-unicode", "a4-astral", "x-sep", "x-max", "x-real"]},
            "T2-H-hook": 10, "T2-H-plain": 10, "T2-B-plain": 10, "T2-replica": 10}
for s, n in expected.items():
    got = sum(1 for r, _ in parsed if r["series"] == s)
    if got != n:
        void.append(f"{s}: {got} readings, expected {n}")
if len(fc) != 10:
    void.append(f"first-call.jsonl: {len(fc)} lines, expected 10")
for r, j in parsed:
    s = r["series"]
    if s.startswith("T1-"):
        ok = j.get("rows") == 23 and j.get("row1Ok") and j.get("noMarker") and j.get("noLone") and j.get("sameWarm") and "firstMs" in j
    elif s == "T2-replica":
        ok = j.get("reads") == 1 and j.get("warned") == 0 and j.get("rows") == 23 and "frame0WithLoadMs" in j
    else:
        ok = j.get("exit") == 0 and not j.get("timedOut") and j.get("stderrBytes") == 0 and j.get("frame0Seen") and j.get("asciiOnly") and "frame0Ms" in j
    if not ok:
        void.append(f"{s} #{r['i']}: check failed {json.dumps(j)[:160]}")
for k, line in enumerate(fc):
    if line.get("first") != "openingName" or line.get("readsInside") != 1 or "firstCallMs" not in line:
        void.append(f"first-call #{k + 1}: check failed {line}")

loads = [float(r["load1"]) for r in inwin if r["load1"]]
power = sorted({r["power"] for r in inwin})
print(f"window {D.name}: gate_pass {gate_pass}, end {end}, sampler rows {len(inwin)}, load1 {min(loads):.2f}-{max(loads):.2f}" if loads else f"window {D.name}")
print(f"power in window: {power}; thermal values: {sorted({r['thermal'] for r in inwin})}")
if void:
    print(f"VOID: {len(void)} condition(s)")
    for v in void[:40]:
        print("  " + v)
    sys.exit(0)
print("CLEAN: 0 void conditions")

def line(name, xs, bar, cmp, unit="ms"):
    xs = sorted(xs)
    state = "MET" if all(cmp(x, bar) for x in xs) else "NOT MET"
    return f"{name}: n {len(xs)}, min {xs[0]:.3f}, median {statistics.median(xs):.3f}, max {xs[-1]:.3f} {unit}; bar {bar}; {state}"

lt = lambda x, b: x < b
le = lambda x, b: x <= b
for c in ["a4-ascii", "a4-unicode", "a4-astral", "x-sep", "x-max", "x-real"]:
    js = [j for r, j in parsed if r["series"] == f"T1-{c}"]
    tag = "A4 (graded)" if c.startswith("a4") else "NFR-002 extension (graded)"
    print(f"T1 {c} [{tag}]")
    print("  " + line("first frame", [j["firstMs"] for j in js], 16, lt))
    print("  " + line("warm max", [j["maxMs"] for j in js], 16, lt))
    print("  " + f"warm median per process: {min(j['medianMs'] for j in js):.4f}-{max(j['medianMs'] for j in js):.4f} ms; p99 max {max(j['p99Ms'] for j in js):.4f} ms")
print("T2 NFR-007 first call, real npm run chess child [graded, <= 30 ms]")
print("  " + line("firstCallMs (openingName, read+parse inside)", [x["firstCallMs"] for x in fc], 30, le))
print("  " + f"readMs (the read alone): {min(x['readMs'] for x in fc):.3f}-{max(x['readMs'] for x in fc):.3f} ms; sinceOrigin at the call: {min(x['sinceOriginMs'] for x in fc):.1f}-{max(x['sinceOriginMs'] for x in fc):.1f} ms")
for s, tag, graded in [("T2-H-hook", "H with hook, e2e", False), ("T2-H-plain", "H plain, NFR-007 e2e", True), ("T2-B-plain", "B plain, e2e", False)]:
    js = [j for r, j in parsed if r["series"] == s]
    if graded:
        print("  " + line(f"{tag} frame0Ms [graded, < 2000 ms]", [j["frame0Ms"] for j in js], 2000, lt))
    else:
        xs = sorted(j["frame0Ms"] for j in js)
        print(f"  {tag} frame0Ms [reported]: min {xs[0]:.1f}, median {statistics.median(xs):.1f}, max {xs[-1]:.1f} ms")
    xs = sorted(j["firstByteMs"] for j in js)
    print(f"    firstByteMs: min {xs[0]:.1f}, median {statistics.median(xs):.1f}, max {xs[-1]:.1f} ms")
xs = sorted(j["frame0WithLoadMs"] for r, j in parsed if r["series"] == "T2-replica")
print(f"  replica frame0WithLoadMs [reported]: min {xs[0]:.3f}, median {statistics.median(xs):.3f}, max {xs[-1]:.3f} ms")
