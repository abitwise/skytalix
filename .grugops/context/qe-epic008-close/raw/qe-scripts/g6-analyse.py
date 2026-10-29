"""QE G6 analysis (qe-ABC-210 g6-analyse.py; qe-epic008-close: Linux sampler fields, no G11). usage: python3 -I g6-analyse.py <g6-dir>. Grades by ABC-205 § Design ruling's reading rule."""
import json, re, statistics, sys
from datetime import datetime, timedelta, timezone
d = sys.argv[1]
runs = [json.loads(l) for l in open(f"{d}/g6.jsonl") if l.strip()]
g11 = []
smp = []
for l in open(f"{d}/sampler.log"):
    m = re.match(r"(\S+Z) load1=(\S+) power=(\S+) thermal=(\S+) vitest=(\d+) cutechess_foreign=(\d+)", l)
    if m: smp.append((datetime.fromisoformat(m.group(1).replace("Z", "+00:00")), float(m.group(2)), m.group(3), "", m.group(4), int(m.group(5)) + int(m.group(6))))
pad = timedelta(seconds=10)
bursts, cur = [], None
for s in smp:
    if s[5] > 0: cur = [s[0], s[0]] if cur is None else [cur[0], s[0]]
    elif cur: bursts.append(cur); cur = None
if cur: bursts.append(cur)
hi = [s[0] for s in smp if s[1] > 8]
for r in runs:
    end = datetime.fromisoformat(r["at"].replace("Z", "+00:00")); start = end - timedelta(milliseconds=r["ms"])
    r["overlap_vitest"] = any(start <= b + pad and end >= a - pad for a, b in bursts)
    r["touch_load_gt8"] = any(start - pad <= t <= end + pad for t in hi)
rep = {"samples": len(smp), "load1_min": min(s[1] for s in smp) if smp else None, "load1_max": max(s[1] for s in smp) if smp else None,
       "power": sorted({s[2] for s in smp}), "batt": sorted({s[3] for s in smp}), "thermal": {t: sum(1 for s in smp if s[4] == t) for t in sorted({s[4] for s in smp})},
       "vitest_samples": sum(1 for s in smp if s[5] > 0), "bursts": [[a.isoformat(), b.isoformat()] for a, b in bursts]}
def grade(rs):
    out = {}
    for pos in ("kiwipete", "position-6"):
        b = [r["depth"] for r in rs if r["pos"] == pos and r["tree"] == "base"]
        h = [r["depth"] for r in rs if r["pos"] == pos and r["tree"] == "head"]
        out[pos] = {"base_depths": b, "head_depths": h, "n_base": len(b), "n_head": len(h),
                    "base_median": statistics.median(b) if b else None, "head_median": statistics.median(h) if h else None,
                    "min_any": min(b + h) if b + h else None,
                    "base_ms_max": max((r["ms"] for r in rs if r["pos"] == pos and r["tree"] == "base"), default=None),
                    "head_ms_max": max((r["ms"] for r in rs if r["pos"] == pos and r["tree"] == "head"), default=None),
                    "base_nodes_median": statistics.median([r["nodes"] for r in rs if r["pos"] == pos and r["tree"] == "base"]) if b else None,
                    "head_nodes_median": statistics.median([r["nodes"] for r in rs if r["pos"] == pos and r["tree"] == "head"]) if h else None}
        o = out[pos]
        o["floor_ok"] = o["min_any"] is not None and o["min_any"] >= 6
        o["ge_base"] = o["head_median"] is not None and o["base_median"] is not None and o["head_median"] >= o["base_median"]
        o["warn_head_lt7"] = o["head_median"] is not None and o["head_median"] < 7
    out["G6"] = "MET" if all(out[p]["floor_ok"] and out[p]["ge_base"] for p in ("kiwipete", "position-6")) else "FAIL"
    return out
rep["all"] = grade(runs)
clean = [r for r in runs if not r["overlap_vitest"]]
rep["overlap_vitest_runs"] = len(runs) - len(clean)
rep["touch_load_gt8_runs"] = sum(r["touch_load_gt8"] for r in runs)
rep["overlap_free"] = grade(clean)
rep["runs"] = runs
rep["g11"] = g11
json.dump(rep, open(f"{d}/qe-g6-analysis.json", "w"), indent=1, default=str)
for k in ("samples", "load1_min", "load1_max", "power", "batt", "thermal", "vitest_samples", "bursts", "overlap_vitest_runs", "touch_load_gt8_runs"): print(k, rep[k])
for k in ("all", "overlap_free"): print(k, json.dumps(rep[k]))
for r in runs: print(r["round"], r["pos"], r["tree"], r["depth"], r["ms"], r["nodes"], r["san"], r["overlap_vitest"], r["touch_load_gt8"])
for g in g11: print("G11", g["pos"], g["tree"], g["san"], "d", g["depth"], g["score"], g["ms"])
