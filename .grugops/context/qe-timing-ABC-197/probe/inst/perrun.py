#!/usr/bin/env python3
# qe-ABC-177-timing-2 per-run record (reporting only, decides nothing): for every lane174 TSV row, the run's power before/after,
# load1 before/after, lane174's foreign_vitest before/after, and the sampler174 rows inside [utc - 5 s, utc + wall + 5 s]:
# how many were foreign, the max foreign count, and every distinct foreign command (pid stripped). Usage: perrun.py <tsv> <sampler.tsv>
import csv, re, sys
from datetime import datetime, timedelta
rows = list(csv.DictReader(open(sys.argv[1]), delimiter="\t"))
samp = list(csv.DictReader(open(sys.argv[2]), delimiter="\t"))
P = lambda s: datetime.fromisoformat(s.replace("Z", "+00:00"))
allcmds = {}
print("round\tcond\twall\tcpu\tpower\tpower_after\tload1_before\tload1_after\tfv_before\tfv_after\tsamples\tforeign_samples\tforeign_max\tforeign_cmds")
for r in rows:
    t0 = P(r["utc"]) - timedelta(seconds=5); t1 = P(r["utc"]) + timedelta(seconds=float(r["wall"]) + 5)
    ss = [s for s in samp if t0 <= P(s["utc"]) <= t1]
    fs = [s for s in ss if s["foreign"] != "0"]
    cmds = sorted({re.sub(r"^\d+ ", "", c.strip()) for s in fs for c in (s["lines"] or "").split(" | ") if c.strip()})
    for c in cmds: allcmds[c] = allcmds.get(c, 0) + 1
    print("\t".join([r["round"], r["cond"], r["wall"], r["cpu"], r["power"], r["power_after"], r["load1_before"], r["load1_after"], r["foreign_vitest"], r["foreign_after"], str(len(ss)), str(len(fs)), str(max([int(s["foreign"]) for s in ss], default=0)), " || ".join(c[:120] for c in cmds) or "-"]))
runs_f = sum(1 for r in rows if True)
print(f"\nruns {len(rows)}; sampler rows {len(samp)}; sampler rows foreign {sum(1 for s in samp if s['foreign'] != '0')}; load1 sampler range {min(float(s['load1']) for s in samp):.2f}-{max(float(s['load1']) for s in samp):.2f}; user_procs {min(int(s['user_procs']) for s in samp)}-{max(int(s['user_procs']) for s in samp)}")
print("distinct foreign commands (runs touched):")
for c, k in sorted(allcmds.items(), key=lambda x: -x[1]): print(f"  {k}\t{c[:200]}")
