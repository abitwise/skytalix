# kept.py <out-dir> : each row's in-thread duration, median of three controls, base row against tip remnant. Ungraded. Empty reports stop it.
import json, os, statistics, sys
O = sys.argv[1]
ROWS = [
 ("Q1", "--sweep lists ABC-073 as a finding", "--sweep on a copy of the named folders", 180),
 ("Q2", "coverage() over EVERY real note", "coverage() over the named folders' real notes", 90),
 ("Q3", "prints each count line and every finding by id", "on a copy of the named folders: prints each count line", 65),
 ("L1", "A8′ — the seam built for each level moves exactly", "A8′ (sample)", 121),
 ("L2", "A4: with a legal ep capture available the same line is not a draw", "A4 (no search)", 77),
 ("L3", "A7: the move the search scores 0 is the move after which gameStatusOf", "A7 (no search)", 62),
 ("C1", "two sessions on the same seededRandom(k)", "two sessions on seededRandom(2), over the first two gos", 54),
 ("C2", "a bare go searches 30 000 ms", "a bare go hands the engine 30 000 ms", 51),
 ("B1", "ten seeds, one pick each", "seeds 1 to ", 50),
]
def load(tag):
    p = f"{O}/{tag}.json"
    assert os.path.getsize(p) > 0, p
    return [(a["fullName"], a.get("duration") or 0, f["name"]) for f in json.load(open(p))["testResults"] for a in f["assertionResults"]]
def dur(runs, text):
    v = []
    for r in runs:
        hit = [d for n, d, _ in r if text in n]
        assert len(hit) == 1, (text, len(hit))
        v.append(hit[0])
    return v
base = [load(f"ctl-base-{i}") for i in (1, 2, 3)]
tip = [load(f"ctl-tip-{i}") for i in (1, 2, 3)]
print("row\tcensus_ms\tbase_ms\ttip_kept_ms\tsaved_ms\tbase_three\tkept_three")
sb = sk = 0
for r, b, t, c in ROWS:
    bv, tv = dur(base, b), dur(tip, t)
    mb, mt = statistics.median(bv), statistics.median(tv)
    sb += mb; sk += mt
    print(f"{r}\t{c}\t{mb:.1f}\t{mt:.1f}\t{mb-mt:.1f}\t{','.join(f'{x:.1f}' for x in bv)}\t{','.join(f'{x:.1f}' for x in tv)}")
print(f"sum\t750\t{sb:.1f}\t{sk:.1f}\t{sb-sk:.1f}")
sc = 750 / sb
print(f"at census scale x{sc:.3f}: kept {sk*sc:.0f}, saved {(sb-sk)*sc:.0f} of 750; realised at 0.37: {(sb-sk)*sc*0.37/1000:.3f} s; need 581")
# names: one out, one in per S row, per touched file; no [deep title in the default lane
def names(r): return {(os.path.basename(f), n) for n, _, f in r}
b0, t0 = names(base[0]), names(tip[0])
print("names out", len(b0 - t0), "in", len(t0 - b0), "deep titles", sum("[deep" in n for _, n in t0))
