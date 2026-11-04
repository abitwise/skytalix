# qe-ABC-302 A6 readout under the PREREG's rule. Usage: python3 -I a6-read.py <a6.tsv> <arch kill-matrix.tsv>
import csv, sys
rows = list(csv.reader(open(sys.argv[1]), delimiter="\t"))[1:]
arch = {r["mutant"]: r for r in csv.DictReader(open(sys.argv[2]), delimiter="\t")}
get = {}
for r in rows:
    r += [""] * (10 - len(r))
    get[(r[0], r[1], r[2])] = dict(exit=r[3], total=r[4], passed=r[5], failed=r[6], skipped=r[7], n=r[8], k=[x for x in r[9].split(" ; ") if x])
# Named default-lane killers at the tip (the ticket's A6 table, Row 10); substrings of the failing full names.
REM = {
 "R1~": "the in-check root and position-5, search() to depth 4",
 "R2~": "A5 (slice): on a 500 ms virtual step",
 "R4~": "holds at every node 1 ply from every perft position",
 "R5~": "on an infinite budget and a 10 000 ms counting clock",
 "R8~": "A4 (slice): on a 500 ms virtual step",
 "R9~": "on a clock spent after 2 x ITERATIONS (260) root passes",
 "A10": "A10 — the seed is threaded, not global",
 "QE087d": "QE-087-d (slice)",
 "lvA6": "A6 — the default level at rate 0 returns",
 "QE087a": "QE-087-a — the seed never reaches the engine",
 "fut-lit": "both recursions test the node once, with the entry window",
 "QE268b": "QE-268-b — a futile node returns the best score",
 "cliA7": "A7: the move the search scores 0 is the move after which gameStatusOf reports",
 "uciA4": "UCI: the prior keys are repetition keys A4: the move that makes the third occurrence",
 "249": "ABC-249 — a pre-root repetition met four plies deep",
 "cli230A1": "ABC-230 A1, A3 — the CLI's level seam hands the search the g",
}
def tags(ks): return sorted({t for k in ks for t, s in REM.items() if s in k and "[deep" not in k})
NAMED = {"M1": ["R1~"], "M2": ["R2~"], "M4": ["R4~"], "M4z": ["R4~"], "M5": ["R5~"], "M5c": ["R5~"],
         "M6": ["A10", "QE087d"], "M7": ["lvA6"], "M7n": ["lvA6"], "M8d": ["R8~"], "M9": ["R9~"], "M9r": ["R9~"],
         "M3": ["fut-lit", "QE268b"], "M3s": ["fut-lit", "QE268b"],
         "F230": ["cliA7", "cli230A1", "R8~"], "QSEAMRAW": ["cliA7", "cli230A1", "R8~"], "QPRIOROFF": ["cliA7", "cli230A1", "R8~"],
         "QMATCH3": ["cliA7", "cli230A1", "R8~"], "QTRIM1": ["cliA7", "cli230A1", "R8~"]}
DEEP = {"M1": "R1", "M2": "R2", "M4": "R4", "M4z": "R4", "M5": "R5", "M5c": "R5", "M6": "R6", "M7": "R7", "M7n": "R7",
        "M8d": "R8", "M9": "R9", "M9r": "R9"}
ok_all = True
print("mutant\tbase_n\tbase_killed\ttip_n\ttip_killed\tnamed_at_tip\tnamed_ok\tdeep\tdeep_killed\tarch_tip_tagged\ttip_tagged\tmissing_vs_arch\tverdict")
ctl = get.get(("B", "default", "restore")), get.get(("H2", "default", "restore"))
for arm, c in zip(("B", "H2"), ctl):
    print(f"# control {arm}: exit {c['exit']} total {c['total']} passed {c['passed']} failed {c['failed']} skipped {c['skipped']}")
    ok_all &= c["exit"] == "0" and c["failed"] == "0"
for r in [x for x in get if x[1].startswith("deep") and x[2] == "restore"]:
    c = get[r]; print(f"# control {r[1]}: exit {c['exit']} passed {c['passed']} failed {c['failed']}")
    ok_all &= c["exit"] == "0" and c["failed"] == "0" and (c["passed"] == "1" or r[1] == "deep-uci-full")
for m in arch:
    b, t = get[("B", "default", m)], get[("H2", "default", m)]
    bk, tk = int(b["n"] or 0) > 0 and b["exit"] != "0", int(t["n"] or 0) > 0 and t["exit"] != "0"
    tt = tags(t["k"]); named = NAMED.get(m, [])
    hit = [x for x in named if x in tt]
    named_ok = (len(hit) == len(named)) if named else True
    d = DEEP.get(m); dk = ""
    if d:
        dd = get[("H2", f"deep-{d}", m)]; dk = "yes" if int(dd["failed"] or 0) > 0 else "NO"
    archt = set(x for x in arch[m]["tip_tagged"].split(",") if x and x in REM)
    missing = sorted(archt - set(tt))
    v = bk and tk and named_ok and (dk in ("", "yes"))
    ok_all &= v
    print(f"{m}\t{b['n']}\t{bk}\t{t['n']}\t{tk}\t{','.join(hit)}\t{named_ok}\t{d or '-'}\t{dk or '-'}\t{','.join(sorted(archt))}\t{','.join(tt)}\t{','.join(missing)}\t{'OK' if v else 'MISS'}")
for m in ("M3", "M3s"):
    dd = get.get(("H2", "deep-R3", m))
    if dd: print(f"# R3 deep line under {m} (recorded blindness, informational): exit {dd['exit']} passed {dd['passed']} failed {dd['failed']}")
u = get.get(("H2", "deep-uci-full", "M8d"))
if u:
    names = u["k"]
    r8 = any("ABC-241 A4, A7 — the CLI: a third occurrence through an uncapturable ep square [deep, ENGINE_DEEP=1]" in k for k in names)
    r2 = any("ABC-241 A4, A5 — UCI: the prior keys are repetition keys [deep, ENGINE_DEEP=1]" in k for k in names)
    print(f"# M8d, FULL uci-session ENGINE_DEEP lane: exit {u['exit']} failed {u['failed']}; R8 deep row among killers: {r8}; R2 deep row: {r2}")
    ok_all &= r8
print("A6:", "ALL 27 KILLED AS THE MATRIX STATES" if ok_all else "MISS (STOP to Architect/Design)")
