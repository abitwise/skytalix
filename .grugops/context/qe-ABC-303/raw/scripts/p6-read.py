# qe-ABC-303 P6 readout. usage: python3 -I p6-read.py <g6.jsonl> <foreign.tsv>
# Flags first: a round is flagged when any of its runs' windows [at - ms, at + 1 s] holds an fsample row with pcpu > 1.0 (stage.inc.sh's busy).
# VOID: more than 1 of the 5 rounds flagged. Grade: per board, head's median depth >= base's, and every run >= depth 6. Depth 7 is a WARN.
import json, sys, statistics as st
from datetime import datetime, timedelta, timezone
rows = [json.loads(l) for l in open(sys.argv[1]) if l.strip()]
fs = [l.rstrip("\n").split("\t") for l in open(sys.argv[2]) if l.strip()]
ts = lambda s: datetime.strptime(s, "%Y-%m-%dT%H:%M:%SZ").replace(tzinfo=timezone.utc)
seen = [(ts(f[0]), float(f[5])) for f in fs if len(f) >= 8]
print(f"samples {len({f[0] for f in fs})}; rows naming a foreign vitest {len(seen)}; of them busy (pcpu > 1.0) {sum(p > 1.0 for _, p in seen)}; largest load1 {max(float(f[1]) for f in fs)}")
print(f"runs {len(rows)} (expected 20)")
fl = {}
named = {}
for r in rows:
    b = datetime.fromisoformat(r["at"].replace("Z", "+00:00")); a = b - timedelta(milliseconds=r["ms"]); b = b + timedelta(seconds=1)
    k = r["label"].split()[1]
    if any(a <= t <= b and p > 1.0 for t, p in seen): fl.setdefault(k, []).append(f'{r["tree"]}:{r["pos"]}')
    if any(a <= t <= b for t, _ in seen): named.setdefault(k, []).append(f'{r["tree"]}:{r["pos"]}')
print("flagged rounds (busy):", fl or "none", "| rounds with a foreign vitest named, busy or not:", sorted(named) or "none")
print("P6 STATE by flags:", "VOID" if len(fl) > 1 or len(rows) != 20 else "stands")
ok = True
for pos in ("kiwipete", "position-6"):
    d = {t: [r["depth"] for r in rows if r["pos"] == pos and r["tree"] == t] for t in ("base", "head")}
    mb, mh = st.median(d["base"]), st.median(d["head"]); ok = ok and mh >= mb and min(d["head"]) >= 6
    print(f"{pos}: base depths {d['base']} median {mb}; head depths {d['head']} median {mh}; head >= base: {mh >= mb}; every head run >= 6: {min(d['head']) >= 6}; WARN depth 7: {sorted({x for x in d['head'] if x == 7})}; nodes median base {st.median(r['nodes'] for r in rows if r['pos']==pos and r['tree']=='base')} head {st.median(r['nodes'] for r in rows if r['pos']==pos and r['tree']=='head')}; ms max {max(r['ms'] for r in rows if r['pos']==pos)}")
    print(f"  G11 moves: base {sorted({r['san'] for r in rows if r['pos']==pos and r['tree']=='base'})}, head {sorted({r['san'] for r in rows if r['pos']==pos and r['tree']=='head'})}")
print("P6 grade if it stands:", "MET" if ok else "RED")
