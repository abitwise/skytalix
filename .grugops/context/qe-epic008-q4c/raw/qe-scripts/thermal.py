"""qe-epic008-q4c thermal summary (folds in Q4 (d)); logging only.
usage: python3 -I thermal.py <reading-dir>   reads mon/sampler.log, mon/cpus.txt, qe-analysis.json (match span); writes thermal.json
Quarters: the match span (first game start .. last game end) cut into four equal time slices.
busy = per-sample max over all CPUs of the measured frequency (cpuinfo_avg_freq, MHz); also per core class (by cpuinfo_max_freq).
Pre-registered rule: frequency fell under load = YES if the busy median of Q2, Q3 or Q4 is >= 5 % below Q1's,
or the scaling_max_freq set or any governor changed during the run; else NO ("no fall seen"; no throttle counter exists)."""
import json, re, statistics, sys
from datetime import datetime
d = sys.argv[1]
a = json.load(open(f"{d}/qe-analysis.json"))
t0 = datetime.fromisoformat(a["wall"]["first_start"]); t1 = datetime.fromisoformat(a["wall"]["last_end"])
cmax = [int(re.search(r"max=(\d+)", l).group(1)) for l in open(f"{d}/mon/cpus.txt") if l.strip()]
classes = sorted(set(cmax), reverse=True)
S = []
for l in open(f"{d}/mon/sampler.log"):
    m = re.match(r"(\S+Z) load1=(\S+) power=(\S+) tctl=(\S+) vitest=(\d+) cutechess_foreign=(\d+) gov=(\S+) epp=(\S+) boost=(\S+) maxset=(\S+) cur=(\S+) avg=(\S+)$", l.strip())
    if not m: continue
    S.append({"t": datetime.fromisoformat(m.group(1).replace("Z", "+00:00")), "load1": float(m.group(2)), "power": m.group(3),
              "tctl": float(m.group(4)), "gov": m.group(7), "epp": m.group(8), "boost": m.group(9), "maxset": m.group(10),
              "cur": list(map(int, m.group(11).split(","))), "avg": list(map(int, m.group(12).split(",")))})
med = lambda xs: round(statistics.median(xs), 1) if xs else None
mx = lambda xs: max(xs) if xs else None
def summ(ss):
    busy = [max(s["avg"]) for s in ss]
    o = {"samples": len(ss), "tctl_median": med([s["tctl"] for s in ss]), "tctl_max": mx([s["tctl"] for s in ss]),
         "load1_median": med([s["load1"] for s in ss]),
         "busy_mhz_median": med(busy), "busy_mhz_max": mx(busy), "busy_mhz_min": min(busy) if busy else None,
         "busy_req_mhz_median": med([max(s["cur"]) for s in ss])}
    for c in classes:
        idx = [i for i, v in enumerate(cmax) if v == c]
        b = [max(s["avg"][i] for i in idx) for s in ss]
        o[f"class{c}_busy_mhz_median"] = med(b); o[f"class{c}_busy_mhz_max"] = mx(b)
        o[f"class{c}_share_of_samples_busiest"] = round(sum(1 for s in ss if max(s["avg"][i] for i in idx) == max(s["avg"])) / len(ss), 3) if ss else None
    return o
q = (t1 - t0) / 4
inrun = [s for s in S if t0 <= s["t"] <= t1]
quarters = [[s for s in inrun if t0 + k * q <= s["t"] < t0 + (k + 1) * q or (k == 3 and s["t"] == t1)] for k in range(4)]
rep = {"span": [t0.isoformat(), t1.isoformat()], "core_classes_mhz": {str(c): cmax.count(c) for c in classes},
       "all_samples": len(S), "in_span_samples": len(inrun), "before_first_game": summ([s for s in S if s["t"] < t0]),
       "whole_span": summ(inrun), "quarters": [summ(x) for x in quarters],
       "governors_seen": sorted({s["gov"] for s in S}), "epp_seen": sorted({s["epp"] for s in S}), "boost_seen": sorted({s["boost"] for s in S}),
       "maxset_seen": sorted({s["maxset"] for s in S}), "power_seen": sorted({s["power"] for s in S}),
       "tctl_ge_95_samples": sum(1 for s in inrun if s["tctl"] >= 95)}
q1 = rep["quarters"][0]["busy_mhz_median"]
drops = [round(100 * (q1 - x["busy_mhz_median"]) / q1, 2) for x in rep["quarters"]]
rep["busy_median_drop_vs_q1_pct"] = drops
changed = len(rep["governors_seen"]) > 1 or len(rep["maxset_seen"]) > 1
rep["frequency_fell_under_load"] = "YES" if any(x >= 5 for x in drops[1:]) or changed else "NO (no fall seen; no throttle counter exists)"
# temperature vs busy frequency, in-span (Pearson), reported
xs = [s["tctl"] for s in inrun]; ys = [max(s["avg"]) for s in inrun]
if len(xs) > 2 and statistics.pstdev(xs) and statistics.pstdev(ys):
    rep["pearson_tctl_vs_busy_mhz"] = round(statistics.correlation(xs, ys), 3)
json.dump(rep, open(f"{d}/thermal.json", "w"), indent=1, default=str)
print(json.dumps(rep, indent=1, default=str))
