# qe-ABC-291 K5 floor. usage: python3 -I k5-floor.py <g6.jsonl>. Every head run at depth >= 6; depth 7 a WARN; base reported.
import json, sys
h = [json.loads(l) for l in open(sys.argv[1]) if l.strip()]; h = [r for r in h if r["tree"] == "head"]
low = [r for r in h if r["depth"] < 6]; warn = [r for r in h if r["depth"] == 7]
print("K5 head runs", len(h), "below 6:", len(low), "at 7 (WARN):", len(warn))
print("K5 BELOW DEPTH 6" if low else "K5 floor holds")
