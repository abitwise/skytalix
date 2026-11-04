#!/usr/bin/env python3
# qe-ABC-282 A6 reader: the bars from the harness's own records, and the ticket's reports from the `-debug all` log (d.out).
# usage: python3 -I a6-read.py <a6 dir> <candidate> <other>. Clock derivations are qe-ABC-223's: per-move elapsed from the go-line
# clock deltas, base 8 000 ms added after a side's 40th, 80th ... move. A side's last move has no next go, so it is left out of period sums.
import re, sys, statistics as st
d, cand, other = sys.argv[1:4]
BASE = 8000
LINE = re.compile(r"^(\d+) ([<>])(\S+)\((\d+)\): (.*)$")
games, cur, fin = [], None, []
for l in open(f"{d}/d.out", errors="replace"):
    l = l.rstrip("\n")
    if l.startswith("Started game"):
        cur = {"moves": {cand: [], other: []}, "open": {}}; games.append(cur); continue
    if l.startswith("Finished game"):
        fin.append(l); continue
    m = LINE.match(l)
    if not m or cur is None: continue
    t, dirn, name, msg = int(m[1]), m[2], m[3], m[5]
    if name not in (cand, other): continue
    if dirn == ">" and msg.startswith("go "):
        k = dict(re.findall(r"(wtime|btime|movestogo|winc|binc) (-?\d+)", msg))
        cur["open"][name] = {"t": t, "go": k, "partial": False, "depth": None, "book": False}
    elif dirn == "<" and name in cur["open"]:
        o = cur["open"][name]
        if msg.startswith("info string partial"): o["partial"] = True
        elif msg.startswith("info string book"): o["book"] = True
        elif msg.startswith("info depth"):
            o["depth"] = int(msg.split()[2])
        elif msg.startswith("bestmove"):
            o["dt"] = t - o["t"]; cur["moves"][name].append(o); del cur["open"][name]
print(f"games with logs {len(games)}; finished {len(fin)}")
res = {}
for i, g in enumerate(games):
    for name in (cand, other):
        ms = g["moves"][name]
        if not ms: continue
        # White's clock is wtime: the side is fixed by which clock changes; read both candidates' order from Finished lines.
        pass
wl = [re.match(r"Finished game (\d+) \((\S+) vs (\S+)\): (\S+) \{(.*)\}", l) for l in fin]
order = {int(m[1]): (m[2], m[3], m[4], m[5]) for m in wl}
W = L = D = 0
for n, (w, b, r, why) in order.items():
    s = {"1-0": 1.0, "0-1": 0.0, "1/2-1/2": 0.5}.get(r)
    c = None if s is None else (s if w == cand else 1 - s)
    W += c == 1.0; L += c == 0.0; D += c == 0.5
print(f"candidate {cand}: W/L/D {W}/{L}/{D} score {W + D/2:.1f} of {len(order)}")
tf = [(n, x) for n, x in order.items() if "on time" in x[3] or "timeout" in x[3]]
print(f"time losses: {len(tf)} {tf}")
by = {}
for x in order.values():
    k = re.sub(r"^(White|Black) ", "", x[3]); by[k] = by.get(k, 0) + 1
print("terminations:", "; ".join(f"{k} {v}" for k, v in sorted(by.items(), key=lambda y: -y[1])))
stats = {n: {"moves": 0, "searched": 0, "partial": 0, "depths": [], "dt": [], "periods": [], "left_end": [], "closest": 10**9, "book": 0} for n in (cand, other)}
for i, g in enumerate(games, 1):
    if i not in order: continue
    w, b = order[i][0], order[i][1]
    for name in (cand, other):
        key = "wtime" if name == w else "btime"
        ms = g["moves"][name]; s = stats[name]
        el = []
        for j, o in enumerate(ms):
            s["moves"] += 1; s["dt"].append(o["dt"])
            s["book"] += o["book"]
            if not o["book"]:
                s["searched"] += 1; s["partial"] += o["partial"]
                if o["depth"] is not None: s["depths"].append(o["depth"])
            if j + 1 < len(ms):
                e = int(o["go"][key]) - int(ms[j + 1]["go"][key]) + (BASE if (j + 1) % 40 == 0 else 0)
                el.append(e)
                left = int(o["go"][key]) - e
                s["closest"] = min(s["closest"], left)
                if (j + 1) % 40 == 0: s["left_end"].append(left)
        for p in range(len(el) // 40):
            s["periods"].append(sum(el[40 * p:40 * p + 40]) / BASE)
for name, s in stats.items():
    pc = s["periods"]
    print(f"{name}: moves {s['moves']} (book {s['book']}), searched {s['searched']}, partial {s['partial']} = {100*s['partial']/max(1,s['searched']):.2f} % of searched; "
          f"mean completed depth {st.mean(s['depths']):.3f} (median {st.median(s['depths'])}); "
          f"move ms median {st.median(s['dt'])} max {max(s['dt'])}; closest call {s['closest']} ms")
    if pc:
        print(f"  completed side-periods {len(pc)}: use min {100*min(pc):.2f} %, median {100*st.median(pc):.2f} %, max {100*max(pc):.2f} %; below 75 %: {sum(x < .75 for x in pc)}")
        print(f"  clock left at period end (ms): min {min(s['left_end'])}, median {st.median(s['left_end'])}, max {max(s['left_end'])}")
