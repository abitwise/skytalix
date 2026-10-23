#!/usr/bin/env python3
# qe-ABC-177 P2 (pre-registered): every run of a lane174 TSV must read 'AC Power' in power and power_after.
import csv, sys
rows = list(csv.DictReader(open(sys.argv[1]), delimiter="\t"))
bad = [(r["round"], r["cond"], r["power"], r["power_after"]) for r in rows if r["power"] != "AC Power" or r["power_after"] != "AC Power"]
rounds = sorted({int(b[0]) for b in bad if b[0] != "0"})
print(f"runs {len(rows)}; not-AC runs {len(bad)}; scored rounds to discard on power: {rounds}")
for b in bad: print("  NOT AC:", *b)
print("POWER:", "AC on every run" if not bad else "DISCARD the rounds above (round 0 is discarded anyway)")
