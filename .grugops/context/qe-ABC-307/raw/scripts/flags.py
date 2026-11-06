# secnfr-census-1105 foreign-load flags and sensitivity. Usage: python3 -I flags.py <a8.tsv> <foreign.tsv> <arm,arm,arm>
# A run is flagged when a foreign vitest (>1 % CPU) shows before or after it, when fsample saw a foreign vitest in R or S
# state in its window, or when foreign_cpu_s is over the session median + 5 s. A round with a flagged run is a flagged round.
import csv, sys, statistics as st
from datetime import datetime, timedelta
rows = list(csv.DictReader(open(sys.argv[1]), delimiter="\t")); arms = sys.argv[3].split(",")
ts = lambda s: datetime.strptime(s, "%Y-%m-%dT%H:%M:%SZ")
fs = [l.rstrip("\n").split("\t") for l in open(sys.argv[2]) if l.strip()]
seen = [(ts(f[0]), f) for f in fs if len(f) >= 8]
print(f"samples {len({f[0] for f in fs})}; sample rows naming a foreign vitest {len(seen)}; projects {sorted({f[7] for _, f in seen})}")
sc = [r for r in rows if r["scored"] == "1"]
base = st.median(float(r["foreign_cpu_s"]) for r in sc)
print(f"foreign_cpu_s, scored runs: median {base:.2f}, min {min(float(r['foreign_cpu_s']) for r in sc):.2f}, max {max(float(r['foreign_cpu_s']) for r in sc):.2f}")
flag = {}
for r in sc:
    a = ts(r["start_utc"]); b = a + timedelta(seconds=float(r["wall_s"]) + 1)
    why = []
    if int(r["vitest_busy_foreign"]) or int(r["vitest_busy_after"]): why.append("busy-ps")
    if any(a <= t <= b for t, _ in seen): why.append("sampled")
    if float(r["foreign_cpu_s"]) > base + 5: why.append("cpu")
    if why: flag.setdefault(int(r["round"]), []).append(f'{r["arm"]}:{"+".join(why)}')
print("flagged rounds:", flag or "none")
by = {}
for r in sc: by.setdefault(int(r["round"]), {})[r["arm"]] = r
rounds = [k for k in sorted(by) if k >= 1 and len(by[k]) == len(arms)]
keep = [k for k in rounds if k not in flag]
print(f"complete scored rounds {len(rounds)}, unflagged {len(keep)}")
for a in arms:
    print(f"sensitivity {a}: unflagged rounds wall median {st.median(float(by[k][a]['wall_s']) for k in keep):.3f} s" if keep else f"{a}: none")
