#!/usr/bin/env python3
"""qe-read-ABC-202: classify the raw cutechess-cli output of M1 and M8(a) against ABC-202 A2-A4.
Usage: python3 -I classify.py <raw-dir>. Reads only m1.out, m1.pgn, m8a.out, m8a.pgn, m1-perft.epd, *.stderr."""
import os, re, sys, collections

R = sys.argv[1]
DBG = re.compile(r'^(\d+) ([<>])([^()]+)\((\d+)\): (.*)$')
START = re.compile(r'^Started game (\d+) of (\d+) \((\S+) vs (\S+)\)')
FIN = re.compile(r'^Finished game (\d+) \((\S+) vs (\S+)\): (\S+) \{(.*)\}')
PASS = [r'^White mates$', r'^Black mates$', r'^Draw by stalemate$', r'^Draw by insufficient mating material$',
        r'^Draw by fifty moves rule$', r'^Draw by 3-fold repetition$', r'^Draw by adjudication', r'wins by adjudication']
FAIL = [r'loses on time', r'^Draw by timeout', r'makes an illegal move', r'disconnects', r'^Draw by disconnection',
        r"'s connection stalls", r'^Draw by stalled connection', r'^No result', r'^Result error']

def classify(t):
    if any(re.search(p, t) for p in FAIL): return 'FAIL'
    if any(re.search(p, t) for p in PASS): return 'PASS'
    return 'UNKNOWN'

def read_out(path):
    games, cur, lines = [], None, open(path, encoding='utf-8', errors='replace').read().splitlines()
    for ln in lines:
        m = START.match(ln)
        if m:
            cur = dict(n=int(m[1]), white=m[3], black=m[4], dbg=[], fin=None); games.append(cur); continue
        m = FIN.match(ln)
        if m:
            g = next(x for x in games if x['n'] == int(m[1])); g['fin'] = (m[4], m[5], ln); continue
        m = DBG.match(ln)
        if m and cur is not None and cur['fin'] is None:
            cur['dbg'].append((int(m[1]), m[2], m[3], m[5]))
    return lines, games

def read_pgn(path):
    txt = open(path, encoding='utf-8', errors='replace').read()
    blocks = [b for b in re.split(r'\n(?=\[Event )', txt.strip()) if b.strip()]
    out = []
    for b in blocks:
        tags = dict(re.findall(r'^\[(\w+) "(.*)"\]$', b, re.M))
        out.append(tags)
    return out

def pgn_moves(path):
    # full-move count from PlyCount if present, else count SAN tokens
    return [t.get('PlyCount') for t in read_pgn(path)]

def stderr_report():
    for f in ['m1-a.stderr', 'm1-b.stderr', 'm8a-a.stderr', 'm8a-b.stderr']:
        p = os.path.join(R, f)
        if os.path.exists(p):
            b = open(p, 'rb').read()
            print(f'  {f}: {len(b)} bytes' + ('' if not b else f' :: {b[:400]!r}'))
        else:
            print(f'  {f}: ABSENT')

def m1():
    print('== M1')
    lines, games = read_out(os.path.join(R, 'm1.out'))
    pgn = read_pgn(os.path.join(R, 'm1.pgn'))
    epd = [l.split(' hmvc')[0] for l in open(os.path.join(R, 'm1-perft.epd')).read().splitlines()]
    epd_full = []
    for l in open(os.path.join(R, 'm1-perft.epd')).read().splitlines():
        four = l.split(' hmvc')[0]; h = re.search(r'hmvc (\d+)', l)[1]; f = re.search(r'fmvn (\d+)', l)[1]
        epd_full.append(f'{four} {h} {f}')
    print(f'Finished game lines: {sum(1 for l in lines if l.startswith("Finished game"))}; pgn games: {len(pgn)}')
    first_go = next((d for g in games for d in g['dbg'] if d[1] == '>' and d[3].startswith('go ')), None)
    print(f'first go raw: {first_go}')
    fins = [l for l in lines if l.startswith('Finished game')]
    print(f'one Finished line raw: {fins[0] if fins else None}')
    bad_go, setopts, faults = [], [], 0
    startpos = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'
    for i, g in enumerate(games):
        pending = {}  # engine -> True while go unanswered
        isready_during_go = 0
        mins = {g['white']: None, g['black']: None}
        positions = []
        for ts, d, eng, msg in g['dbg']:
            if d == '>' and msg.startswith('go'):
                ok = all(k in msg.split() for k in ['wtime', 'btime']) and 'winc 1000' in msg and 'binc 1000' in msg
                if not ok: bad_go.append((g['n'], eng, msg))
                tok = msg.split()
                own = 'wtime' if eng == g['white'] else 'btime'
                v = int(tok[tok.index(own) + 1])
                mins[eng] = v if mins[eng] is None else min(mins[eng], v)
                pending[eng] = True
            elif d == '>' and msg.startswith('setoption'):
                setopts.append((g['n'], eng, msg))
            elif d == '>' and msg == 'isready' and pending.get(eng):
                isready_during_go += 1
            elif d == '>' and msg.startswith('position') and not positions:
                positions.append(msg)
            elif d == '<' and msg.startswith('bestmove'):
                pending[eng] = False
        ts0 = g['dbg'][0][0] if g['dbg'] else None; ts1 = g['dbg'][-1][0] if g['dbg'] else None
        res, text, raw = g['fin'] if g['fin'] else (None, None, None)
        tags = pgn[i] if i < len(pgn) else {}
        fen = tags.get('FEN')
        exp = epd_full[i] if i < len(epd_full) else None
        if exp == startpos: fen_ok = fen in (None, startpos)
        else: fen_ok = fen == exp
        cls = classify(text) if text is not None else 'NO-FINISH'
        if cls != 'PASS': faults += 1
        print(f'game {g["n"]}: {g["white"]}(W) vs {g["black"]}(B) result {res} {{{text}}} -> {cls}; '
              f'plies {tags.get("PlyCount")}; wall {((ts1 - ts0) / 1000) if ts0 is not None else None:.1f} s; '
              f'min own clock ms W={mins[g["white"]]} B={mins[g["black"]]}; isready-during-go {isready_during_go}; '
              f'FEN tag ok {fen_ok} ({fen!r}); first position: {positions[0][:60] if positions else None}')
    print(f'go lines not carrying wtime/btime/winc 1000/binc 1000: {len(bad_go)} {bad_go[:3]}')
    named = [s for s in setopts if 'OwnBook' in s[2] or 'Skill Level' in s[2]]
    print(f'setoption lines sent: {len(setopts)}; naming OwnBook/Skill Level: {len(named)}')
    print(f'non-PASS games: {faults}')

def m8a():
    print('== M8(a)')
    lines, games = read_out(os.path.join(R, 'm8a.out'))
    pgn = read_pgn(os.path.join(R, 'm8a.pgn'))
    print(f'Finished game lines: {sum(1 for l in lines if l.startswith("Finished game"))}; pgn games: {len(pgn)}')
    first_go = next((d for g in games for d in g['dbg'] if d[1] == '>' and d[3].startswith('go')), None)
    print(f'first go raw: {first_go}')
    fins = [l for l in lines if l.startswith('Finished game')]
    print(f'one Finished line raw: {fins[0] if fins else None}')
    print(f'game1 White={pgn[0].get("White") if pgn else None} game2 Black={pgn[1].get("Black") if len(pgn) > 1 else None}; '
          f'FEN tags: {[t.get("FEN") for t in pgn]}; SetUp: {[t.get("SetUp") for t in pgn]}')
    alltxt = '\n'.join(lines)
    print(f'"ignores go depth" lines: {len(re.findall(r"info string skill level.*ignores go depth", alltxt, re.I))}')
    hist = collections.Counter(); bad_go = []; setopts = []
    for g in games:
        open_go = {}; book = searched = nodepth = over = 0
        for ts, d, eng, msg in g['dbg']:
            if d == '>' and msg.startswith('go'):
                if msg != 'go depth 4': bad_go.append((g['n'], eng, msg))
                open_go[eng] = []
            elif d == '>' and msg.startswith('setoption'):
                setopts.append(msg)
            elif d == '<' and eng in open_go:
                if msg.startswith('bestmove'):
                    out = open_go.pop(eng)
                    dl = [o for o in out if o.startswith('info') and re.search(r'\bdepth \d+', o)]
                    isbook = any(o.startswith('info string book') for o in out)
                    if isbook and not dl: book += 1
                    else:
                        searched += 1
                        if not dl: nodepth += 1
                        else:
                            dep = int(re.search(r'\bdepth (\d+)', dl[-1])[1]); hist[dep] += 1
                            if dep > 4: over += 1
                else:
                    open_go[eng].append(msg)
        res, text, raw = g['fin'] if g['fin'] else (None, None, None)
        cls = classify(text) if text is not None else 'NO-FINISH'
        ts0 = g['dbg'][0][0] if g['dbg'] else 0; ts1 = g['dbg'][-1][0] if g['dbg'] else 0
        print(f'game {g["n"]}: {g["white"]}(W) vs {g["black"]}(B) result {res} {{{text}}} -> {cls}; '
              f'plies {pgn[g["n"]-1].get("PlyCount") if len(pgn) >= g["n"] else None}; wall {(ts1-ts0)/1000:.1f} s; '
              f'book {book} searched {searched} searched-without-depth {nodepth} depth>4 {over}')
    print(f'go lines not exactly "go depth 4": {len(bad_go)} {bad_go[:3]}')
    named = [s for s in setopts if 'OwnBook' in s or 'Skill Level' in s]
    print(f'setoption lines sent: {len(setopts)}; naming OwnBook/Skill Level: {len(named)}')
    print(f'final-depth histogram: {dict(sorted(hist.items()))}')

m1(); m8a(); print('== stderr'); stderr_report()
