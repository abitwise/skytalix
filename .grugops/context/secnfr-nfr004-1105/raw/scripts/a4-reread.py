# secnfr-nfr004-1105: re-reads qe-ABC-282's A4 records for NFR-004 and AR-NFR004-A. A read of records only:
# no engine, test or build. Usage: python3 -I a4-reread.py <qe-ABC-282 raw/out/a4 with moves.tsv> [<dir holding the .log files>]
# budget = min(59 500, safeClockShare) from src/uci-session.ts: (time - 1000 - mtg * 100) / mtg, at most time - 1100, at least 1; no increment at tc=40/900.
import csv, os, re, statistics as st, sys
a4 = sys.argv[1]
logs = sys.argv[2] if len(sys.argv) > 2 else None
R = list(csv.DictReader(open(os.path.join(a4, "moves.tsv")), delimiter="\t"))
for r in R:
    r["e"] = int(r["elapsed_ms"]); r["b"] = float(r["budget_ms"]); r["o"] = r["e"] - r["b"]
    t = int(r["clock_at_go"]); m = int(r["movestogo"])
    r["calc"] = min(59500, max(1, min((t - 1000 - m * 100) / m, t - 1100)))
S = [r for r in R if r["book"] != "1"]
print("moves", len(R), "searched", len(S), "book", len(R) - len(S))
print("budgets recomputed from clock and movestogo, mismatches:", sum(abs(r["calc"] - r["b"]) > 0.06 for r in R))
print("longest move:", max(r["e"] for r in R), "moves >= 59 900 ms:", sum(r["e"] >= 59900 for r in R), "moves > 60 000 ms:", sum(r["e"] > 60000 for r in R))
print("over 59 500 ms:", sum(r["e"] > 59500 for r in R), "moves >= 50 900 ms:", sum(r["e"] >= 50900 for r in R))
for r in sorted(R, key=lambda r: -r["e"])[:7]:
    print("  long", r["game"], r["side"], "k", r["k"], "elapsed", r["e"], "budget", r["b"], "over", round(r["o"], 1), r["src"])
cap = [r for r in R if r["b"] == 59500]
print("budgets at the cap:", len(cap), "ran to it (within 5 ms):", sum(r["o"] >= -5 for r in cap), "ended short by:", round(min(-r["o"] for r in cap if r["o"] < -5)), "to", round(max(-r["o"] for r in cap)), "ms")
near = [r for r in S if r["o"] >= -1000]
ab = [r for r in S if r["o"] >= -5]
print("searched moves within 1 000 ms of budget:", len(near), "median", round(st.median(r["o"] for r in near), 1), "max", round(max(r["o"] for r in near), 1))
print("searched moves at the abort (within 5 ms of budget):", len(ab), "budgets", round(min(r["b"] for r in ab), 1), "to", max(r["b"] for r in ab), "ended 5-1 000 ms short:", len(near) - len(ab), "ended > 1 000 ms short:", len(S) - len(near))
print("overshoot >= 31 ms:", sum(r["o"] >= 31 for r in S))
ex = [r for r in ab if r["src"] == "clock"]; sp = [r for r in ab if r["src"] != "clock"]
print("at the abort, exact clock:", len(ex), "max", round(max(r["o"] for r in ex), 1), "; stamp-read:", len(sp), "max", round(max(r["o"] for r in sp), 1), "+ at most 25 ms stamp error =", round(max(r["o"] for r in sp) + 25, 1))
for r in sorted(S, key=lambda r: -r["o"])[:3]:
    print("  over", r["game"], r["side"], "k", r["k"], "elapsed", r["e"], "budget", r["b"], "over", round(r["o"], 1), "=", round(100 * r["o"] / r["b"], 4), "%", r["src"])
if logs:
    H = open(os.path.join(logs, "harness.log")).read().split("\n")
    T = open(os.path.join(logs, "thermal.log")).read().split("\n")
    start = {int(m[1]): int(m[2]) for m in (re.match(r"game (\d) start .* t=(\d+)", l) for l in H) if m}
    def window(g, tag, k, label):
        L = open(os.path.join(logs, f"g0{g}.log")).read().split("\n")
        go = [l for l in L if f">{tag}(" in l and " go wtime" in l][k - 1]
        i = L.index(go)
        bm = [l for l in L[i:] if f"<{tag}(" in l and "bestmove" in l][0]
        inf = [l for l in L[i:L.index(bm)] if " time " in l][-1]
        t0 = int(go.split()[0]); t1 = int(bm.split()[0])
        a = start[g] + t0 / 1000; b = start[g] + t1 / 1000
        s = [l for l in T if " t=" in l and a - 1 <= int(re.search(r" t=(\d+)", l)[1]) <= b + 1]
        f = lambda n: [float(re.search(n + r"=([\d.]+)", l)[1]) for l in s]
        print(label, "engine time", re.search(r" time (\d+)", inf)[1], "debug-log span", t1 - t0, "samples", len(s), "with foreign vitest", sum(x > 0 for x in f("vitest")), "vitest max", int(max(f("vitest"))), "load1", min(f("load1")), "-", max(f("load1")), "Tctl", min(f("tctl")), "-", max(f("tctl")))
    window(5, "skytalix-b", 39, "g05 Black move 39:")
    window(5, "skytalix-a", 40, "g05 White move 40:")
    window(1, "skytalix-b", 42, "g01 Black move 42:")
