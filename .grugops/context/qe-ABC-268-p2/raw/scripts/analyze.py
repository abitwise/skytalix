# qe-ABC-268-p2: INFO figures from a cutechess-cli debug log + finished-game lines, before deletion.
# usage: python3 -I analyze.py <dir> <out-file> <log> <budget-ms> <candidate-name> <other-name>
import re, sys, statistics
d, outf, log, budget, cand, other = sys.argv[1], sys.argv[2], sys.argv[3], int(sys.argv[4]), sys.argv[5], sys.argv[6]
lines = open(f"{d}/{log}", errors="replace").read().splitlines()
pend, lat = {}, {cand: [], other: []}
for l in lines:
    m = re.match(r"^(\d+) ([<>])(\S+)\(\d+\): (.*)$", l)
    if not m: continue
    t, dirn, name, msg = int(m[1]), m[2], m[3], m[4]
    if dirn == ">" and msg.startswith("go "): pend[name] = t
    elif dirn == "<" and msg.startswith("bestmove") and name in pend:
        lat.setdefault(name, []).append(t - pend.pop(name))
fin = [l for l in lines if l.startswith("Finished game")]
out = [f"qe-ABC-268-p2 (computed from {log} before deletion; INFO)", f"go -> bestmove latency (cutechess clock, ms; includes book moves):"]
for n, v in lat.items():
    if v: out.append(f"{n:9s} moves {len(v)} median {statistics.median(v)} max {max(v)} >{int(budget*1.5)}ms {sum(x > budget*1.5 for x in v)}")
# opening pairs: games 2k-1 / 2k share an opening
score = {}
for l in fin:
    m = re.match(r"Finished game (\d+) \((\S+) vs (\S+)\): (\S+) \{(.*)\}", l)
    g, w, b, res, why = int(m[1]), m[2], m[3], m[4], m[5]
    s = {"1-0": 1.0, "0-1": 0.0, "1/2-1/2": 0.5}.get(res)
    cs = None if s is None else (s if w == cand else 1 - s)
    score[g] = (cs, why, w, b, res)
pairs = {}
for g, (cs, *_ ) in score.items():
    pairs.setdefault((g + 1) // 2, []).append(cs)
hist = {}
for k, v in pairs.items():
    if None in v or len(v) != 2: continue
    hist[sum(v)] = hist.get(sum(v), 0) + 1
out.append("opening-pair scores for %s (0, 0.5, 1, 1.5, 2): %s  sum %.1f" % (cand, ", ".join(str(hist.get(x, 0)) for x in (0, 0.5, 1, 1.5, 2)), sum(k * v for k, v in hist.items())))
by = {}
for cs, why, *_ in score.values():
    key = re.sub(r"^(White|Black) ", "", why)
    by[key] = by.get(key, 0) + 1
out.append("terminations: " + "; ".join(f"{k} {v}" for k, v in sorted(by.items(), key=lambda x: -x[1])))
tf = [l for l in fin if "on time" in l]
flt = [l for l in fin if re.search(r"disconnect|illegal|stall|crash|connection", l, re.I)]
out.append(f"time forfeits: {len(tf)} {tf}")
out.append(f"faults: {len(flt)} {flt}")
wc = sum(1 for cs, *_ in score.values() if cs == 1.0); lc = sum(1 for cs, *_ in score.values() if cs == 0.0); dc = sum(1 for cs, *_ in score.values() if cs == 0.5)
out.append(f"candidate {cand}: W/D/L {wc}/{dc}/{lc} score {wc + dc/2:.1f} / {len(score)}")
cw = {"white": [0, 0], "black": [0, 0]}
for cs, why, w, b, res in score.values():
    if cs is None: continue
    side = "white" if w == cand else "black"; cw[side][0] += cs; cw[side][1] += 1
out.append(f"by colour: as white {cw['white'][0]:.1f}/{cw['white'][1]}, as black {cw['black'][0]:.1f}/{cw['black'][1]}")
open(outf, "w").write("\n".join(out) + "\n"); print("\n".join(out))
