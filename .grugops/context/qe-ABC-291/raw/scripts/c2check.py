# qe-ABC-291-games: own count from d.pgn and d.out, by game, with no harness label. usage: python3 -I c2check.py <dir>
import re, sys, collections
d = sys.argv[1]
pgn = open(f"{d}/d.pgn").read()
games = re.split(r'(?=\[Event )', pgn); games = [g for g in games if g.strip()]
w = l = dr = other = 0; why = collections.Counter(); plies = []
for g in games:
    wh = re.search(r'\[White "(.+?)"\]', g)[1]; bl = re.search(r'\[Black "(.+?)"\]', g)[1]; res = re.search(r'\[Result "(.+?)"\]', g)[1]
    t = re.search(r'\[Termination "(.+?)"\]', g); why[t[1] if t else "none"] += 1
    pc = re.search(r'\[PlyCount "(\d+)"\]', g)
    if pc: plies.append(int(pc[1]))
    if res == "1/2-1/2": dr += 1
    elif res == "*": other += 1
    elif (res == "1-0") == (wh == "skytalix"): w += 1
    else: l += 1
print(f"pgn games {len(games)}; skytalix W/L/D {w}/{l}/{dr}; unfinished {other}; score {w + dr / 2}; terminations {dict(why)}; plies max {max(plies, default='?')}")
lines = open(f"{d}/d.out", errors="replace").read().splitlines()
fin = [x for x in lines if x.startswith("Finished game")]
print("finished lines", len(fin))
pat = re.compile(r"on time|disconnect|illegal|stall|crash|connection|forfeit|abandon|unresponsive", re.I)
print("bad finished lines", sum(bool(pat.search(x)) for x in fin))
print("any log line (not engine info) matching", sum(bool(pat.search(x)) for x in lines if " info " not in x))
print("warnings", sum("Warning" in x or "warning" in x for x in lines))
