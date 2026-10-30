"""qe-ABC-225-w1 A5/A6 reader, written by QE (independent of tools/rating/*.ts except where named).
usage: python3 -I a5read.py <out-dir> <openings.epd> <elo.py dir>
Reads: nps.log, thermal.log, schedule.log, host.log, each block's r.out / r.pgn / summary.txt, summary.txt.
"""
import datetime as dt
import os
import re
import statistics as st
import sys

out, epd_path, elo_dir = sys.argv[1:4]
sys.path.insert(0, elo_dir)
from elo import elo  # noqa: E402  (QE's own copy of cutechess-cli 1.5.1's formula)

T = lambda s: dt.datetime.strptime(s, "%Y-%m-%dT%H:%M:%SZ")  # noqa: E731
miss = []

print("== nps.log")
nps = open(f"{out}/nps.log").read().splitlines()
for l in nps:
    print("  ", l)
ok = len(nps) == 2 and all(re.search(r"stockfish_nps_median=\d+ moves_ge_400ms=[1-9]\d*$", l) for l in nps)
tags = sorted(re.match(r"(block \d+ \w+)", l).group(1) for l in nps) if nps else []
print("  2 lines, numeric, moves>0:", ok, "tags:", tags)
if not ok or tags != ["block 01 base", "block 01 candidate"]:
    miss.append("A5.1 nps.log")

print("== schedule.log")
sch = open(f"{out}/schedule.log").read().splitlines()
for l in sch:
    print("  ", l)
ev = [(T(l.split()[0]), l.split()[1], " ".join(l.split()[2:])) for l in sch]
first, last = min(t for t, k, _ in ev if k == "start"), max(t for t, k, _ in ev if k == "end")
span = (last - first).total_seconds()
for tag in ("block 01 base", "block 01 candidate"):
    s = [t for t, k, g in ev if k == "start" and g == tag]
    e = [t for t, k, g in ev if k == "end" and g == tag]
    if s and e:
        print(f"  {tag}: {s[0]:%H:%M:%S} -> {e[0]:%H:%M:%S} = {(e[0] - s[0]).total_seconds() / 60:.1f} min")
gap = [(ev[i + 1][0] - ev[i][0]).total_seconds() for i in range(len(ev) - 1) if ev[i][1] == "end" and ev[i + 1][1] == "start"]
print(f"  play wall {first:%FT%TZ} -> {last:%FT%TZ} = {span:.0f} s = {span / 3600:.3f} h; inter-block gaps {gap} s")

print("== host.log")
host = open(f"{out}/host.log").read().splitlines()
for l in host:
    print("  ", l)
before = T(host[0].split()[0])
build = (first - before).total_seconds()
print(f"  build time (host before -> first start): {build:.0f} s")

print("== thermal.log")
th = open(f"{out}/thermal.log").read().splitlines()
ts = [T(l.split()[0]) for l in th]
tc = [re.search(r"tctl=(\S+)", l).group(1) for l in th]
numeric = all(re.fullmatch(r"\d+(\.\d+)?", v) for v in tc)
vals = [float(v) for v in tc if re.fullmatch(r"\d+(\.\d+)?", v)]
gaps = [(ts[i + 1] - ts[i]).total_seconds() for i in range(len(ts) - 1)]
inspan = [t for t in ts if first <= t <= last]
need = int(span // 10)
mhz = [int(re.search(r"busy_mhz=(\d+)", l).group(1)) for l in th if re.search(r"busy_mhz=(\d+)", l)]
load = [float(re.search(r"load1=(\S+)", l).group(1)) for l in th]
print(f"  lines {len(th)}, numeric tctl on all: {numeric}; samples in schedule span {len(inspan)} (need >= {need}); max gap {max(gaps):.0f} s, min gap {min(gaps):.0f} s")
print(f"  tctl median {st.median(vals):.2f} max {max(vals):.1f} min {min(vals):.1f}; busy_mhz median {st.median(mhz):.0f} min {min(mhz)}; load1 median {st.median(load):.2f} max {max(load):.2f}")
if not (numeric and len(inspan) >= need and max(gaps) <= 12):
    miss.append("A5.2 thermal.log")

epd = [" ".join(l.split()[:2]) for l in open(epd_path).read().splitlines()]
print("== blocks")
for b in ("base", "candidate"):
    d = f"{out}/{b}/b01"
    ro = open(f"{d}/r.out").read()
    eline = re.findall(r"^Elo difference: (\S+) \+/- (\S+),.*$", ro, re.M)[-1]
    sc = re.findall(r"^Score of (.+) vs (.+): (\d+) - (\d+) - (\d+)\s+\[(\S+)\] (\d+)$", ro, re.M)[-1]
    w, l_, dr = map(int, sc[2:5])
    x, y = elo(w, l_, dr)
    mine = (f"{x:.1f}", f"{y:.1f}")
    fm = mine == eline
    print(f"  {b}: Score of {sc[0]} vs {sc[1]}: {w}-{l_}-{dr} [{sc[5]}] {sc[6]}; printed Elo {eline[0]} +/- {eline[1]}; QE formula {mine[0]} +/- {mine[1]}; equal: {fm}")
    if not fm:
        miss.append(f"A5.3 formula {b}")
    best = len(re.findall(r"^\d+ <stockfish\(\d+\): bestmove", ro, re.M))
    info = len(re.findall(r"^\d+ <stockfish\(\d+\): info .* nps \d+", ro, re.M))
    print(f"    raw: stockfish bestmove lines {best}, info-with-nps lines {info}")
    fin = re.findall(r"^Finished game (\d+) \((.+) vs (.+)\): (\S+) \{(.*)\}$", ro, re.M)
    reasons = {}
    for f in fin:
        reasons[f[4]] = reasons.get(f[4], 0) + 1
    print(f"    finished games {len(fin)}; reasons {reasons}")
    pg = open(f"{d}/r.pgn").read()
    games = [dict(re.findall(r'^\[(\w+) "(.*)"\]$', g, re.M)) for g in re.split(r"\n(?=\[Event )", pg) if g.strip()]
    rounds = {}
    for g in games:
        rounds.setdefault(int(g["Round"]), []).append(g)
    cov = True
    for r in range(1, 11):
        gs = rounds.get(r, [])
        fen = {" ".join(g.get("FEN", "?").split()[:2]) for g in gs}
        whites = sorted(g["White"] for g in gs)
        good = len(gs) == 2 and fen == {epd[r - 1]} and whites == ["skytalix", "stockfish"]
        cov &= good
        if not good:
            print(f"    round {r}: COVERAGE MISS games={len(gs)} fen={fen} whites={whites}")
    print(f"    PGN games {len(games)}; rounds 1-10 on EPD lines 1-10, skytalix once per colour: {cov}")
    if not cov or len(games) != 20:
        miss.append(f"A5.4 coverage {b}")
    print("    block summary.txt:")
    for l in open(f"{d}/summary.txt").read().splitlines():
        print("      " + l)

print("== summary.txt")
s = open(f"{out}/summary.txt").read()
print(s)
need6 = ["base: Elo difference", "candidate: Elo difference", "pair: candidate − base", "pair state:", "opening-paired (pentanomial), information only:"]
have = all(k in s for k in need6)
print("  summary has both builds, pair, pair state, pentanomial:", have, "| halted line:", "halted:" in s)
if not have:
    miss.append("A5.6 summary")

g = 40
print("== A6")
print(f"  play wall {span / 60:.1f} min ({span / 3600:.3f} h); games/hour {g / (span / 3600):.2f}; per game {span / g / 60:.2f} min")
proj = span * 10 + build
print(f"  projection 400 games width 1 = play wall x 10 + build {build:.0f} s = {proj / 3600:.2f} h (ticket est. 22-24 h)")
print("A5 misses:", miss if miss else "none")
