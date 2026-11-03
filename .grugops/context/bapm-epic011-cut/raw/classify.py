# SCRATCH (bapm-epic011-cut): records-only re-classification of arch-next-pull / arch-E1 probe outputs. Run: flock <host-test.lock> python3 -I classify.py <worktree>/.grugops/context
# Records-only classification of the arch-next-pull / arch-E1 evaluation-probe outputs (no engine run).
import json, sys, collections
C = sys.argv[1]  # .grugops/context
NP = C + "/arch-next-pull/raw/probe/"
E1 = C + "/arch-E1/raw/probe/out/"
pos = {r["id"]: r["fen"] for r in map(json.loads, open(NP + "positions.jsonl"))}
sf = {r["id"]: r for r in map(json.loads, open(NP + "out/sf16.jsonl"))}
sfLP = {r["id"]: r for r in map(json.loads, open(E1 + "sf16-LP.jsonl"))}
def load(f): return {r["id"]: r for r in map(json.loads, open(f))}
p1, p2, p4 = (load(NP + f"out/play{n}.jsonl") for n in (47000, 94000, 188000))
pL = load(E1 + "play-L.jsonl"); pB = load(E1 + "play-BASE.jsonl")
def loss(i, mv):
    for s in (sf, sfLP):
        if i in s and mv in s[i]["loss"]: return s[i]["loss"][mv]
    return None
def board(fen):
    rows = fen.split()[0].split("/"); b = {}
    for r, row in enumerate(rows):
        f = 0
        for ch in row:
            if ch.isdigit(): f += int(ch)
            else: b[(7 - r, f)] = ch; f += 1
    return b
def feats(fen):
    b = board(fen); stm = fen.split()[1]
    cnt = collections.Counter(b.values())
    phase = min(24, sum(cnt[c] * w for c, w in (("N",1),("n",1),("B",1),("b",1),("R",2),("r",2),("Q",4),("q",4))))
    mat = lambda up: sum(cnt[c if up else c.lower()] * v for c, v in (("P",100),("N",325),("B",325),("R",500),("Q",900)))
    def passers(white):
        me, op = ("P", "p") if white else ("p", "P"); n = 0; adv = 0
        for (r, f), c in b.items():
            if c != me: continue
            ahead = range(r + 1, 8) if white else range(0, r)
            if not any(b.get((rr, ff)) == op for rr in ahead for ff in (f - 1, f, f + 1)):
                n += 1; adv = max(adv, r if white else 7 - r)
        return n, adv
    wb = [(r + f) % 2 for (r, f), c in b.items() if c == "B"]; bb = [(r + f) % 2 for (r, f), c in b.items() if c == "b"]
    ocb = len(wb) == 1 and len(bb) == 1 and wb[0] != bb[0]
    queens = cnt["Q"] + cnt["q"]
    pw, pwa = passers(True); pb, pba = passers(False)
    return dict(phase=phase, queens=queens, imb=mat(True) - mat(False), passers=pw + pb, advPasser=max(pwa, pba),
                ocb=ocb, pawnsOnly=phase == 0, stm=stm)
rows = []
for i in pos:
    m1, m2, m4 = p1[i]["move"], p2[i]["move"], p4[i]["move"]
    l1, l2, l4 = loss(i, m1), loss(i, m2), loss(i, m4)
    lL = loss(i, pL[i]["move"]) if i in pL else None
    if None in (l1, l2, l4): continue
    f = feats(pos[i]); f.update(id=i, ply=int(i.split("p")[1]), l1=l1, l4=l4, lL=lL, sbest=sf[i]["sbest"], d1=p1[i]["depth"])
    rows.append(f)
err = [r for r in rows if r["l1"] >= 50]
pers = [r for r in err if r["l4"] >= 50]
persL = [r for r in pers if r["lL"] is not None and r["lL"] >= 50]
print("scored", len(rows), "err1x", len(err), "persist4x", len(pers), "persist4x and still err under E1-L@1x", len(persL))
def tab(name, key, groups):
    print(f"\n## {name}")
    for g, pred in groups:
        a = [r for r in rows if pred(r)]; e = [r for r in a if r["l1"] >= 50]; p = [r for r in e if r["l4"] >= 50]
        pl = [r for r in p if r["lL"] is not None and r["lL"] >= 50]
        print(f"{g:28s} positions {len(a):3d}  err1x {len(e):3d}  persist4x {len(p):3d}  ({(100*len(p)/len(a) if a else 0):4.1f}% of positions)  still-err E1-L {len(pl):3d}")
tab("phase (N1 B1 R2 Q4 of 24)", "phase", [("phase 0-6 (endgame)", lambda r: r["phase"] <= 6), ("phase 7-15", lambda r: 7 <= r["phase"] <= 15), ("phase 16-24", lambda r: r["phase"] >= 16)])
tab("queens", "q", [("no queens", lambda r: r["queens"] == 0), ("queens on", lambda r: r["queens"] > 0)])
tab("passed pawns", "p", [("no passer", lambda r: r["passers"] == 0), ("passer, adv rank<=4", lambda r: r["passers"] > 0 and r["advPasser"] <= 4), ("passer on rank 5-7", lambda r: r["advPasser"] >= 5)])
tab("material imbalance (white-black cp)", "imb", [("|imb| < 100", lambda r: abs(r["imb"]) < 100), ("100<=|imb|<300", lambda r: 100 <= abs(r["imb"]) < 300), ("|imb| >= 300", lambda r: abs(r["imb"]) >= 300)])
tab("SF eval size (side to move)", "sb", [("|sf| < 100", lambda r: abs(r["sbest"]) < 100), ("100<=|sf|<400", lambda r: 100 <= abs(r["sbest"]) < 400), ("|sf| >= 400", lambda r: abs(r["sbest"]) >= 400)])
tab("opposite bishops", "ocb", [("opposite-colour bishops", lambda r: r["ocb"]), ("not", lambda r: not r["ocb"])])
print("\n## the persistent errors (4x), one line each")
for r in sorted(pers, key=lambda r: r["ply"]):
    print(r["id"], "ply", r["ply"], "phase", r["phase"], "Q", r["queens"], "passers", r["passers"], "adv", r["advPasser"], "imb", r["imb"], "sf", r["sbest"], "loss1x/4x/E1L", r["l1"], r["l4"], r["lL"], "ocb" if r["ocb"] else "")

print("\n## duplicates")
byfen = collections.defaultdict(list)
for i, f in pos.items(): byfen[" ".join(f.split()[:4])].append(i)
dups = {k: v for k, v in byfen.items() if len(v) > 1}
print("positions", len(pos), "unique FEN (board+stm+castle+ep)", len(byfen), "dup groups", len(dups), "extra copies", sum(len(v) - 1 for v in dups.values()))
games = collections.defaultdict(list)
for i in pos: games[int(i[1:].split("p")[0])].append(i)
print("games", len(games), "game ids", sorted(games)[:60])
seen = set(); u = []
for r in rows:
    k = " ".join(pos[r["id"]].split()[:4])
    if k in seen: continue
    seen.add(k); u.append(r)
ue = [r for r in u if r["l1"] >= 50]; up = [r for r in ue if r["l4"] >= 50]; upL = [r for r in up if r["lL"] is not None and r["lL"] >= 50]
print("UNIQUE: scored", len(u), "err1x", len(ue), "persist4x", len(up), f"({100*len(up)/max(1,len(ue)):.1f}%)", "still err under E1-L", len(upL))
for name, pred in (("phase 0-6", lambda r: r["phase"] <= 6), ("phase 7-15", lambda r: 7 <= r["phase"] <= 15), ("phase 16-24", lambda r: r["phase"] >= 16),
                   ("queens on", lambda r: r["queens"] > 0), ("no queens", lambda r: r["queens"] == 0),
                   ("passer rank 5-7", lambda r: r["advPasser"] >= 5), ("|sf|>=400", lambda r: abs(r["sbest"]) >= 400), ("|sf|<400", lambda r: abs(r["sbest"]) < 400)):
    a = [r for r in u if pred(r)]; e = [r for r in a if r["l1"] >= 50]; p = [r for r in e if r["l4"] >= 50]
    print(f"  UNIQUE {name:16s} positions {len(a):3d} err1x {len(e):3d} persist4x {len(p):3d}")
# E1-L error counts on unique
eL = [r for r in u if r["lL"] is not None and r["lL"] >= 50]
eB = [r for r in u if r["l1"] >= 50]
print("UNIQUE err50 BASE@1x", len(eB), "E1-L@1x", len(eL))
for ply in (20, 40, 60):
    a = [r for r in u if r["ply"] == ply]; e = [r for r in a if r["l1"] >= 50]; p = [r for r in e if r["l4"] >= 50]
    print(f"  UNIQUE after {ply} plies: positions {len(a)} err1x {len(e)} persist4x {len(p)}")
print("  UNIQUE persistent with any passer:", sum(1 for r in up if r["passers"] > 0), "of", len(up))
print("  UNIQUE persistent, queens on and phase>=7:", sum(1 for r in up if r["queens"] > 0 and r["phase"] >= 7))
