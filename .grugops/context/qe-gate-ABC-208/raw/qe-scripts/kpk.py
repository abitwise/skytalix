# QE qe-gate-ABC-208: an independent KPK bitbase (retrograde, Stockfish's kpk classification rules),
# used to check that each A2 K+P row's recorded move is the ONLY winning move. White has K+P.
import itertools, sys

def fr(s): return s % 8, s // 8
def adj(a, b):
    (fa, ra), (fb, rb) = fr(a), fr(b)
    return max(abs(fa - fb), abs(ra - rb)) <= 1
def kmoves(s):
    f, r = fr(s)
    for df, dr in itertools.product((-1, 0, 1), repeat=2):
        if (df or dr) and 0 <= f + df < 8 and 0 <= r + dr < 8:
            yield (r + dr) * 8 + f + df
def pawn_att(p):
    f, r = fr(p)
    return {(r + 1) * 8 + f + d for d in (-1, 1) if 0 <= f + d < 8 and r + 1 < 8}

UNKNOWN, DRAW, WIN, INVALID = 0, 1, 2, 3
res = {}
def valid(wk, bk, wp, stm):
    if len({wk, bk, wp}) < 3 or adj(wk, bk): return False
    if not (1 <= fr(wp)[1] <= 6): return False
    if stm == 0 and bk in pawn_att(wp): return False  # white to move: black not in check
    return True

for wk, bk, wp, stm in itertools.product(range(64), range(64), range(64), (0, 1)):
    if not valid(wk, bk, wp, stm):
        continue
    r = UNKNOWN
    if stm == 0:
        q = wp + 8
        if fr(wp)[1] == 6 and wk != q and bk != q and (not adj(bk, q) or adj(wk, q)):
            r = WIN
    else:
        free = [s for s in kmoves(bk) if not adj(s, wk) and s not in pawn_att(wp)]
        if not free or (adj(bk, wp) and not adj(wk, wp)):
            r = DRAW
    res[(wk, bk, wp, stm)] = r

def white_moves(wk, bk, wp):
    for s in kmoves(wk):
        if s != wp and not adj(s, bk):
            yield ("K", s, (s, bk, wp, 1))
    if fr(wp)[1] < 6 and wp + 8 not in (wk, bk):
        yield ("P", wp + 8, (wk, bk, wp + 8, 1))
        if fr(wp)[1] == 1 and wp + 16 not in (wk, bk):
            yield ("P", wp + 16, (wk, bk, wp + 16, 1))

def black_moves(wk, bk, wp):
    for s in kmoves(bk):
        if not adj(s, wk) and s not in pawn_att(wp) and s != wp:
            yield (wk, s, wp, 0)

changed = True
while changed:
    changed = False
    for k, v in res.items():
        if v != UNKNOWN:
            continue
        wk, bk, wp, stm = k
        if stm == 0:
            if any(res.get(n) == WIN for _, _, n in white_moves(wk, bk, wp)):
                res[k] = WIN; changed = True
        else:
            if all(res.get(n) == WIN for n in black_moves(wk, bk, wp)):
                res[k] = WIN; changed = True

def sq(name): return (int(name[1]) - 1) * 8 + "abcdefgh".index(name[0])
def nm(s): f, r = fr(s); return "abcdefgh"[f] + str(r + 1)
ROWS = [("kpk-b6c6", "b6", "c8", "c5", "b6c6"), ("kpk-c6d6", "c6", "d8", "d5", "c6d6"),
        ("kpk-d6e6", "d6", "e8", "e5", "d6e6"), ("kpk-e6f6", "e6", "f8", "f5", "e6f6")]
ok = True
for name, wk, bk, wp, rec in ROWS:
    wk, bk, wp = sq(wk), sq(bk), sq(wp)
    assert res.get((wk, bk, wp, 0)) is not None, name
    wins = [f"{nm(wk if p == 'K' else wp)}{nm(t)}" for p, t, n in white_moves(wk, bk, wp) if res.get(n) == WIN]
    allm = [f"{nm(wk if p == 'K' else wp)}{nm(t)}" for p, t, n in white_moves(wk, bk, wp)]
    verdict = "ONLY WINNING MOVE" if wins == [rec] else "MISMATCH"
    ok &= wins == [rec]
    print(f"{name}: root {'WIN' if res[(wk, bk, wp, 0)] == WIN else 'DRAW'}; legal {len(allm)}; winning {wins}; recorded {rec}: {verdict}")
print("all four confirmed" if ok else "NOT all confirmed")
