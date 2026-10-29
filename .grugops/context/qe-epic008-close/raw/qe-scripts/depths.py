"""qe-epic008-close, reported only: skytalix's completed depth per searched move in an R reading's PGN (cutechess comment {score/depth time}).
usage: python3 -I depths.py <r.pgn>..."""
import re, statistics, sys
for path in sys.argv[1:]:
    ds = []; won = {"skytalix": 0}
    for ch in re.split(r"\n(?=\[Event )", open(path).read().strip()):
        t = dict(re.findall(r'^\[(\w+) "(.*)"\]$', ch, re.M)); body = re.sub(r"^\[.*\]$", "", ch, flags=re.M)
        side = t.get("FEN", "x w").split()[1]; last = None
        for tok in re.findall(r"\{[^}]*\}|[^\s{}]+", body):
            if re.fullmatch(r"\d+\.+", tok) or tok in ("1-0", "0-1", "1/2-1/2", "*"): continue
            if tok.startswith("{"):
                m = re.match(r"\{[+-]?M?[\d.]+/(\d+)", tok)
                if last == "skytalix" and m: ds.append(int(m.group(1)))
                continue
            last = t["White"] if side == "w" else t["Black"]; side = "b" if side == "w" else "w"
    q = statistics.quantiles(ds, n=4)
    print(path.split("/")[-3], "skytalix searched moves", len(ds), "depth mean %.2f median %s q1 %s q3 %s" % (statistics.mean(ds), statistics.median(ds), q[0], q[2]))
