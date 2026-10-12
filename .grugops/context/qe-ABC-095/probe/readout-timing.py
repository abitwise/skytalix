#!/usr/bin/env python3
# qe-ABC-095 A2 / R3 readout. Usage: python3 -I readout-timing.py <window dir>
# VOID if: any sampler row from gate_pass to utc_end shows a vitest process, thermal != 0 or power != AC Power; or the
# before/after log shows a vitest; or any reading line is missing or malformed (10 strict, 10 SE, 3 warm-miss); or a strict /
# SE reading shows innerCalls != 0, warned != 0 or move false; or a warm-miss reading shows warned != 0 or n != 200.
# A2 (graded on QE's strict instrument): MET iff max of the 10 <= 30 ms; else NOT MET. SE's reported, not graded.
# R3 (graded): MET iff every warm-miss process's maxMs <= 5 ms; else NOT MET. Median and p99 reported.
import csv, json, re, statistics, sys
D = sys.argv[1]
once = open(f"{D}/timing-once.txt").read()
gp = re.search(r"gate_pass (\S+)", once); end = re.search(r"utc_end (\S+)", once)
if not gp:
    print("WINDOW: NOT OPENED (gate timeout)"); print(once); sys.exit(0)
rows = [r for r in csv.DictReader(open(f"{D}/sampler.tsv"), delimiter="\t") if gp.group(1) <= r["utc"] <= end.group(1)]
bad = [r for r in rows if r["vitest"] != "0" or r["thermal"] != "0" or r["power"] != "AC Power"]
txt = open(f"{D}/readings.txt").read()
print(txt)
sec = lambda name: [json.loads(l) for l in txt.split(f"=== {name}")[1].split("===")[0].split("---")[0].splitlines() if l.startswith("{")]
strict, se, warm = sec("strict-cold-hit"), sec("se-cold-hit"), sec("warm-miss")
reasons = []
if bad: reasons.append(f"sampler: {len(bad)} bad rows of {len(rows)}")
for tag in ("before", "after"):
    m = re.search(rf"--- {tag} .*?vitest: (.*)", txt, re.S)
    if m is None or m.group(1).split("\n")[0].strip(): reasons.append(f"{tag}-log vitest")
if len(strict) != 10 or len(se) != 10 or len(warm) != 3: reasons.append(f"counts {len(strict)}/{len(se)}/{len(warm)}")
if any(r["innerCalls"] or r["warned"] or not r["move"] for r in strict + se): reasons.append("hit-reading fault")
if any(r["warned"] or r["n"] != 200 for r in warm): reasons.append("warm-reading fault")
print(f"sampler rows in [gate_pass, utc_end]: {len(rows)}; bad {len(bad)}; load1 {min(float(r['load1']) for r in rows):.2f}-{max(float(r['load1']) for r in rows):.2f}" if rows else "no sampler rows")
if reasons:
    print("WINDOW STATE: VOID —", "; ".join(reasons)); sys.exit(0)
s = [r["strictColdHitMs"] for r in strict]; e = [r["coldHitMs"] for r in se]
print(f"A2 strict (graded): n 10, min {min(s):.3f}, median {statistics.median(s):.3f}, max {max(s):.3f} ms -> {'MET' if max(s) <= 30 else 'NOT MET'} at 30 ms")
print(f"A2 SE cold-hit (reported): n 10, min {min(e):.3f}, median {statistics.median(e):.3f}, max {max(e):.3f} ms")
for i, w in enumerate(warm, 1):
    print(f"R3 process {i}: median {w['medianMs']:.4f}, p99 {w['p99Ms']:.4f}, max {w['maxMs']:.4f} ms")
print(f"R3 (graded): max over 3 processes {max(w['maxMs'] for w in warm):.4f} ms -> {'MET' if all(w['maxMs'] <= 5 for w in warm) else 'NOT MET'} at 5 ms")
