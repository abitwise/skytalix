# a9-read.py <a8.tsv> : H - B and H at three decimals, against the page's marks. Reads only; n8-grade.py is the grade. Printed once a read stands.
import csv, sys, statistics as st
rows = list(csv.DictReader(open(sys.argv[1]), delimiter="\t")); by = {}
for x in rows: by.setdefault(int(x["round"]), {})[x["arm"]] = x
rd = [r for r in sorted(by) if r >= 1 and len(by[r]) == 3 and all(by[r][a]["scored"] == "1" for a in ("B", "H", "H2"))]
w = lambda a: [float(by[r][a]["wall_s"]) for r in rd]
m = st.median(w("H")); b = st.median(w("B"))
d = st.median(float(by[r]["H"]["wall_s"]) - float(by[r]["B"]["wall_s"]) for r in rd)
print(f"n {len(rd)}; H median {m:.3f} s; B median {b:.3f} s; H-B paired median {d:+.3f} s; difference of the arm medians {m - b:+.3f} s")
print(f"target H-B <= -0.215 s: {'met' if d <= -0.215 else 'missed'} by {abs(d + 0.215):.3f} s; against 10 s {10 - m:+.3f} s; 9.6 s {9.6 - m:+.3f} s; 9.5 s {9.5 - m:+.3f} s")
print("b9038a14's rule on m:", "G-GO" if m + 0.10 < 9.6 else ("G-WITH" if m < 9.6 else "G-HOLD"))
