"""qe-epic008-q4c, reported only: each side's completed depth per searched move in a D run's PGN (cutechess comment {score/depth time}).
usage: python3 -I depths.py <d.pgn>"""
import re, statistics, sys, json
ds = {}
for ch in re.split(r"\n(?=\[Event )", open(sys.argv[1]).read().strip()):
    t = dict(re.findall(r'^\[(\w+) "(.*)"\]$', ch, re.M)); body = re.sub(r"^\[.*\]$", "", ch, flags=re.M)
    side = t.get("FEN", "x w").split()[1]; last = None
    for tok in re.findall(r"\{[^}]*\}|[^\s{}]+", body):
        if re.fullmatch(r"\d+\.+", tok) or tok in ("1-0", "0-1", "1/2-1/2", "*"): continue
        if tok.startswith("{"):
            m = re.match(r"\{[+-]?M?[\d.]+/(\d+)", tok)
            if last and m: ds.setdefault(last, []).append(int(m.group(1)))
            continue
        last = t["White"] if side == "w" else t["Black"]; side = "b" if side == "w" else "w"
out = {}
for k, v in sorted(ds.items()):
    out[k] = {"searched_moves_with_depth": len(v), "min": min(v), "median": statistics.median(v), "mean": round(statistics.mean(v), 2), "max": max(v)}
print(json.dumps(out))
