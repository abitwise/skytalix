# a7-plants-read.py <plants.jsonl> : the rules sealed in qe-ABC-307's PREREG, read off the plant reports. Exit 1 on any miss or UNREAD.
import json, sys
rows = [json.loads(l) for l in open(sys.argv[1]) if l.strip()]
det = {}; rnd = {}
for r in rows:
    if r["draw"] is None: det.setdefault(r["plant"], {})[r["side"]] = r["read"]
    else: rnd.setdefault(r["plant"], {}).setdefault(r["side"], []).append(r["read"])
DEEP = " [deep, ENGINE_DEEP=1]"; F1 = "AR-154-TWO-POINT-CONTROL F1"
norm = lambda n: n.replace(DEEP, "")
TRIO = {"Q1": "--sweep lists ABC-073 as a finding", "Q2": "coverage() over EVERY real note", "Q3": "prints each count line and every finding by id"}
REM = {"Q1~": "--sweep on a copy of the named folders", "Q2~": "coverage() over the named folders' real notes", "Q3~": "on a copy of the named folders: prints each count line"}
tag = lambda names, t: ",".join(k for k, v in t.items() if any(v in n for n in names)) or "-"
MEMO = [p for p in det if p.startswith(("q4b-allNotes", "q4b-plainSweep", "q4b-both-memos", "q5-allNotes-memo"))]
F2 = [p for p in det if p.startswith("q5x-") and ("real-tree-only" in p or "except-ABC-031" in p)]
NAMED = {"q4a-readNotes-unfiltered-drops-secnfr": ("Q1~", "Q1"), "q4a-readNotes-unfiltered-drops-quality-gate": ("Q1~", "Q1"), "MQ2": ("Q2~", "Q2"), "MQ3": ("Q3~", "Q3")}
TIPQ = {"q4b-tip-named-read-empty": ["Q2~"], "q4b-tip-copied-root-empty": ["Q1~"], "q4b-tip-both-empty (two faults)": ["Q1~", "Q2~"]}
bad = 0
print("plant\tbase_red\tbase_trio\ttip_red\ttip_remnants\thead_red\thead_trio\tF1_red\thead_covers_base\tverdict")
for p, s in det.items():
    if "n/a" in s: print(f"{p}\tn/a"); continue
    b, t, h = s.get("base"), s.get("tip"), s.get("head")
    if p in TIPQ:
        need = [x for x in TIPQ[p] if x not in tag(t["red"], REM).split(",")] if t else ["UNREAD"]
        bad += bool(need)
        print(f"{p}\t-\t-\t{len(t['red']) if t else 'UNREAD'}\t{tag(t['red'], REM) if t else '-'}\t-\t-\t-\t-\t{'MISS ' + str(need) if need else 'killed'}"); continue
    if not (b and t and h):
        print(f"{p}\tUNREAD"); bad += 1; continue
    miss = sorted({norm(n) for n in b["red"]} - {norm(n) for n in h["red"]})
    why = []
    if p == "control (unmutated)":
        if b["red"] or t["red"] or h["red"] or b["passed"] != 32 or t["passed"] != 32 or h["passed"] != 36: why.append("control not green")
    elif p == "A5R":
        if len(b["red"]) != 3 or t["red"]: why.append(f"sentinel {len(b['red'])} / {len(t['red'])}")
    elif p in MEMO:
        if t["red"]: why.append("memo plant reads in the default lane")
        if miss: why.append("head lacks base's names")
    elif p in F2:
        if b["red"] or t["red"]: why.append("F2 not 0 at base and default")
        if not h["red"]: why.append("F2 head not red")
    else:
        if b["red"] and not t["red"]: why.append("tip file does not kill")
        if miss: why.append("head lacks base's names")
    if p in NAMED:
        r, d = NAMED[p]
        if r not in tag(t["red"], REM).split(","): why.append(f"{r} absent")
        if d not in tag(h["red"], TRIO).split(","): why.append(f"{d} deep absent")
    bad += bool(why)
    print(f"{p}\t{len(b['red'])}\t{tag(b['red'], TRIO)}\t{len(t['red'])}\t{tag(t['red'], REM)}\t{len(h['red'])}\t{tag(h['red'], TRIO)}\t{sum(F1 in n for n in h['red'])}\t{not miss}\t{'MISS: ' + '; '.join(why) + (' | ' + ' | '.join(miss) if miss else '') if why else 'ok'}")
print("\nF3, the three random-half plants (one edit, read as three plants; the decision is on the pool)")
pb, ph = {}, {}
nb = nh = 0; f1 = 0; unread = 0
for p, s in rnd.items():
    ub, uh = {}, {}
    for side, u in (("base", ub), ("head", uh)):
        for x in s.get(side, []):
            if x is None: unread += 1; continue
            for n in x["red"]: u[norm(n)] = u.get(norm(n), 0) + 1
    print(f"{p}: base draws {len(s.get('base', []))}, names {len(ub)}; head draws {len(s.get('head', []))}, names {len(uh)}; missing at head in this plant alone {len(set(ub) - set(uh))}")
    for n, c in ub.items(): pb[n] = pb.get(n, 0) + c
    for n, c in uh.items(): ph[n] = ph.get(n, 0) + c
    nb += sum(x is not None for x in s.get("base", [])); hs = [x for x in s.get("head", []) if x is not None]; nh += len(hs)
    f1 += sum(any(F1 in n for n in x["red"]) for x in hs)
print(f"pool: base draws {nb}, head draws {nh}, unread {unread}; F1 red in {f1} of {nh} head draws")
print("base name\tbase_count\thead_count")
for n in sorted(pb): print(f"{n}\t{pb[n]}\t{ph.get(n, 0)}")
missing = sorted(set(pb) - set(ph))
print("head names not at base:", sorted(set(ph) - set(pb)))
print("base names missing at head:", missing)
bad += bool(missing) + (f1 != nh) + (unread > 0) + (nh < 15) + (nb < 15)
print("misses or unread:", bad)
sys.exit(1 if bad else 0)
