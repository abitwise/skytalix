# a9-sens.py <a8.tsv> <flagged rounds, comma-separated> : the unflagged sensitivity, paired. Reads only; n8-grade.py is the grade.
# flags.py gives each arm's unflagged median; this adds H's interval-free median, H - B wall and CPU, and H2 - H CPU over the same rounds.
import csv, sys, statistics as st
rows = list(csv.DictReader(open(sys.argv[1]), delimiter="\t")); by = {}
drop = {int(x) for x in sys.argv[2].split(",") if x}
for x in rows: by.setdefault(int(x["round"]), {})[x["arm"]] = x
rd = [r for r in sorted(by) if r >= 1 and len(by[r]) == 3 and all(by[r][a]["scored"] == "1" for a in ("B", "H", "H2"))]
keep = [r for r in rd if r not in drop]
d = lambda a, b, f: st.median(float(by[r][a][f]) - float(by[r][b][f]) for r in keep)
print(f"unflagged rounds {keep} of {rd}; H median {st.median(float(by[r]['H']['wall_s']) for r in keep):.3f} s; H-B wall {d('H','B','wall_s'):+.3f} s, CPU {d('H','B','cpu_s'):+.3f} s; H2-H CPU {d('H2','H','cpu_s'):+.3f} s")
