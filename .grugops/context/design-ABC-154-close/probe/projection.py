# Arithmetic only: no timing is taken. Re-anchors ADR-0035 A3's projection on qe-ABC-154 w1.
from fractions import Fraction as F
per_read = F(215, 1000) / 2            # A3: 2 extra whole-tree reads cost 0.215 s at ~2630 notes
per_note_2reads = 2 * per_read / 2630  # s per note at 2 reads/run
print(f"A3 slope: {float(per_read):.4f} s per read at 2630 notes; {float(per_note_2reads)*1e6:.2f} us per note at 2 reads")
a3 = F(153, 1000) + F(215, 1000) * F(2656, 2630)
print(f"A3 model at N=2656 (2 reads): {float(a3):.3f} s   | qe-ABC-154 w1 reading: +0.380 (+0.350..+0.410)")
for lab, anchor in (("median", F(380,1000)), ("upper x(7)", F(410,1000))):
    at4000 = anchor + per_note_2reads * (4000 - 2656)
    cross = 2656 + (F(650,1000) - anchor) / per_note_2reads
    print(f"anchored on {lab} {float(anchor):.3f} s at 2656 notes: at 4000 notes {float(at4000):.3f} s ({float(at4000/F(650,1000))*100:.0f} % of 650 ms); crosses 650 ms at N ~ {float(cross):.0f}")
print("floor F (median R of the three most recent admissible, CPU / wall):")
rs = [("qe-ABC-105 60415a8a", 10, 10), ("QE3 w3 db1cfb6c", 20, 20), ("qe-ABC-154 w1 0f8036f9", 30, 30)]
for r in rs: print("  ", r)
med = lambda xs: sorted(xs)[1]
print(f"  F = {med([r[1] for r in rs])/1000:.3f} s CPU / {med([r[2] for r in rs])/1000:.3f} s wall")
alt = [20, 30, 30]; altw = [20, 20, 30]
print(f"  sensitivity (NOT the rule): if QE4 w2 (R 0.030 / 0.020, inadmissible, forward-only A1) were counted, the last three would be QE3 w3, QE4 w2, qe-ABC-154 w1 -> F = {med(alt)/1000:.3f} CPU / {med(altw)/1000:.3f} wall")
