# a7-read.py <out> : A7's table read off the .sum files and -t lines. Prints a row per mutant and leg; an UNREAD leg is never a kill. Exit 1 on any MISS or UNREAD.
import re, sys
O = sys.argv[1]
ROW = {"L1": "A8′ — the seam built for each level moves exactly", "L2": "A4: with a legal ep capture available the same line is not a draw",
 "L3": "A7: the move the search scores 0 is the move after which gameStatusOf", "C1": "two sessions on the same seededRandom(k)",
 "C2": "a bare go searches 30 000 ms", "B1": "ten seeds, one pick each"}
REM = {"L1~": "A8′ (sample)", "L2~": "A4 (no search)", "L3~": "A7 (no search)", "C1~": "two sessions on seededRandom(2), over the first two gos",
 "C2~": "a bare go hands the engine 30 000 ms", "B1~": "seeds 1 to 7, one pick each"}
HOLD = {"cli A4 (slice)": "A4 (slice): on a 500 ms virtual step", "uci A5 (slice)": "A5 (slice): on a 500 ms virtual step", "cli ABC-230 A1": "ABC-230 A1, A3 — the CLI's level seam",
 "uci A4": "UCI: the prior keys are repetition keys A4: the move that makes the third occurrence", "ABC-249": "ABC-249 — a pre-root repetition met four plies deep",
 "ABC-221 A11": "ABC-221 — TimeMode uci-clock-mode over UCI (ADR-0052 D4) A11", "ABC-220 A6": "ABC-220 — TimeMode simple-tournament over UCI (ADR-0052) A6",
 "ABC-220 A13": "ABC-220 — TimeMode simple-tournament over UCI (ADR-0052) A13", "ABC-221 A7": "ABC-221 — TimeMode uci-clock-mode over UCI (ADR-0052 D4) A7", "ABC-259": "ABC-259 — R-TC item 2"}
SEAM = ["cli A4 (slice)", "uci A5 (slice)", "cli ABC-230 A1"]
# mutant: (rows whose remnant must be among the tip's killers, named holders that must be, rows whose deep line must read 1 failed, expected base_n, expected tip_n)
LIST = {"ML1": (["L1"], [], ["L1"], 1, 1), "M6": (["L1", "C1"], [], ["L1", "C1"], 21, 20), "M7": (["L1"], [], ["L1"], 3, 3),
 "S241M2": (["L2", "L3"], [], ["L2", "L3"], 12, 12), "QMATCH1": ([], ["cli A4 (slice)", "uci A4", "ABC-249"], ["L2"], 8, 7),
 "S241M1": (["L3"], [], ["L3"], 18, 19), "S241M4": (["L3"], [], ["L3"], 2, 2), "M4": (["L3", "B1"], [], ["L3", "B1"], 19, 20),
 "F230": ([], SEAM, ["L3"], 8, 7), "M2s": ([], SEAM, ["L3"], 7, 6), "QSEAMRAW": ([], SEAM, ["L3"], 7, 6), "QPRIOROFF": ([], SEAM, ["L3"], 16, 15),
 "QMATCH3": ([], SEAM, ["L3"], 20, 19), "QTRIM1": ([], SEAM, ["L3"], 30, 29), "MC1": (["C1"], [], [], 11, 11),
 "MC2h": (["C2"], [], ["C2"], 9, 9), "P2a": (["C2"], [], ["C2"], 17, 17), "P2b": ([], ["ABC-221 A11", "ABC-220 A6", "ABC-220 A13", "ABC-221 A7", "ABC-259"], ["C2"], 6, 5),
 "MB1": (["B1"], [], ["B1"], 3, 3), "M4z": (["B1"], [], ["B1"], 22, 22)}
def load(tag):
    try: ls = open(f"{O}/{tag}.sum").read().splitlines()
    except FileNotFoundError: return None
    if not ls or not ls[0].startswith("total 2709 "): return None
    return [l.split("\t", 2)[1] for l in ls[1:] if l.startswith(("KILL", "FILEFAIL"))]
def lines(path):
    d = {}
    try:
        for l in open(path):
            p = l.rstrip("\n").split("\t")
            if len(p) >= 4: d[(p[0], p[1])] = p[3]
    except FileNotFoundError: pass
    return d
tl = lines(f"{O}/tlines-mutated.tsv")
bad = 0
print("mutant\tbase_n\tbase_full_rows\ttip_n\tnamed_remnants\tnamed_holders\tdeep_lines\tverdict\tvs_arch")
for m, (rems, holds, deep, bn, tn) in LIST.items():
    b, t = load(f"base-{m}"), load(f"tip-{m}")
    if b is None or t is None:
        print(f"{m}\tUNREAD"); bad += 1; continue
    has = lambda ks, s: any(s in k for k in ks)
    miss = []
    if not b: miss.append("base not killed")
    if not t: miss.append("tip not killed")
    miss += [f"{r}~ absent" for r in rems if not has(t, REM[r + "~"])]
    miss += [f"{h} absent" for h in holds if not has(t, HOLD[h])]
    dl = []
    for r in deep:
        v = tl.get((m, r), "UNREAD")
        dl.append(f"{r}: {v.strip()}")
        if not re.search(r"\b1 failed\b", v): miss.append(f"{r} deep line")
    base_rows = ",".join(r for r, s in ROW.items() if has(b, s)) or "-"
    bad += bool(miss)
    print(f"{m}\t{len(b)}\t{base_rows}\t{len(t)}\t{','.join(r + '~' for r in rems) or '-'}\t{', '.join(holds) or '-'}\t{' | '.join(dl) or 'lane only'}\t{'MISS: ' + '; '.join(miss) if miss else 'killed'}\t{'same' if (len(b), len(t)) == (bn, tn) else f'differs (arch {bn}, {tn})'}")
print("misses or unread:", bad)
sys.exit(1 if bad else 0)
