# qe-ABC-291 K4 readout. usage: python3 -I g2-read.py <dir holding K4-BCH.out and K4-HCB.out>
# R = (r1 + r2) / 2 on the unrounded value, r_s = mean(H) / mean(B). c_s outside [0.970, 1.030] voids that session. MET iff R <= 1.03.
import json, sys
s = []
for n in ("BCH", "HCB"):
    t = [l for l in open(f"{sys.argv[1]}/K4-{n}.out") if l.startswith("{")]
    j = json.loads(t[0]); r = j["roots"]; s.append((n, r["r"], r["c"], j["eg"]["r"], j["eg"]["c"], r["rounds"]))
    print(n, "r", r["r"], "c", r["c"], "eg_r", j["eg"]["r"], "eg_c", j["eg"]["c"])
    for k, v in r["rounds"].items(): print("  ", k, [round(x, 1) for x in v], "scored min-max", round(min(v[1:]), 1), round(max(v[1:]), 1))
void = [n for n, _, c, *_ in s if not 0.970 <= c <= 1.030]
R = (s[0][1] + s[1][1]) / 2
print("|r1 - r2|", abs(s[0][1] - s[1][1]), "R", R, "endgame set R", (s[0][3] + s[1][3]) / 2, "within one session spread (0.037):", abs(R - 1.03) <= 0.037)
print("K4 VOID session(s) " + ",".join(void) if void else ("K4 MET" if R <= 1.03 else "K4 MISS") + f" R={R}")
