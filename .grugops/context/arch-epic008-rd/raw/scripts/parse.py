"""Parse R1, R2 and D raw files into per-game and per-move records (records-only analysis)."""
import gzip, json, re, sys, statistics as st
from collections import defaultdict

CTX = sys.argv[1]
OUT = sys.argv[2]
SRC = {
    "R1": (f"{CTX}/qe-epic008-close/raw/r1/r.pgn", f"{CTX}/qe-epic008-close/raw/r1/r.out.gz"),
    "R2": (f"{CTX}/qe-epic008-close/raw/r2/r.pgn", f"{CTX}/qe-epic008-close/raw/r2/r.out.gz"),
    "D": (f"{CTX}/qe-epic008-q4c/raw/d/d.pgn", f"{CTX}/qe-epic008-q4c/raw/d/d.out.gz"),
}

TAG = re.compile(r'^\[(\w+) "(.*)"\]$')
CMT = re.compile(r"\{([^}]*)\}")


def parse_pgn(path):
    games, cur, body = [], None, []
    for line in open(path):
        line = line.rstrip("\n")
        m = TAG.match(line)
        if m:
            if cur is not None and body:
                cur["body"] = " ".join(body)
                games.append(cur)
                cur, body = None, []
            if cur is None:
                cur = {}
            cur[m.group(1)] = m.group(2)
        elif line.strip():
            body.append(line.strip())
    if cur is not None:
        cur["body"] = " ".join(body)
        games.append(cur)
    out = []
    for i, g in enumerate(games):
        body = g["body"]
        # tokens: move numbers, SAN, comments
        toks = re.findall(r"\{[^}]*\}|\S+", body)
        moves = []  # (ply_index, san, comment or None)
        for t in toks:
            if t.startswith("{"):
                if moves:
                    moves[-1][2] = t[1:-1]
                continue
            if re.match(r"^\d+\.(\.\.)?$", t) or t in ("1-0", "0-1", "1/2-1/2", "*"):
                continue
            t = re.sub(r"^\d+\.(\.\.)?", "", t)
            if not t:
                continue
            moves.append([len(moves), t, None])
        last_c = moves[-1][2] if moves and moves[-1][2] else ""
        term = last_c.split(",")[-1].strip() if "," in last_c else last_c
        fen = g.get("FEN", "")
        stm_black = fen.split()[1] == "b" if fen else False
        # side of each move: ply 0 is the side to move in FEN
        recs = []
        for ply, san, c in moves:
            side_white = (ply % 2 == 0) != stm_black
            mover = g["White"] if side_white else g["Black"]
            sc = dep = tm = None
            if c:
                m = re.match(r"^([+-]?(?:M\d+|\d+\.\d+))/(\d+) ([\d.]+)s", c.strip())
                if m:
                    s = m.group(1)
                    if "M" in s:
                        sign = -1 if s.startswith("-") else 1
                        sc = sign * 100000
                    else:
                        sc = round(float(s) * 100)
                    dep, tm = int(m.group(2)), float(m.group(3))
            recs.append({"ply": ply, "san": san, "mover": mover, "white": side_white, "cp": sc, "depth": dep, "t": tm})
        out.append({
            "idx": i + 1,
            "round": int(g["Round"]),
            "white": g["White"],
            "black": g["Black"],
            "result": g["Result"],
            "fen": fen,
            "plies": int(g.get("PlyCount", len(moves))),
            "start": g.get("GameStartTime"),
            "end": g.get("GameEndTime"),
            "dur": g.get("GameDuration"),
            "term": term,
            "moves": recs,
        })
    return out


INFO = re.compile(r"^\d+ <(\w+)\((\d+)\): (.*)$")


def parse_out(path):
    """Per engine-name: list of final info dicts before each bestmove (in output order)."""
    last = {}
    res = defaultdict(list)
    with gzip.open(path, "rt", errors="replace") as f:
        for line in f:
            m = INFO.match(line)
            if not m:
                continue
            name, pid, rest = m.group(1), m.group(2), m.group(3)
            key = (name, pid)
            if rest.startswith("info ") and " nodes " in rest:
                d = {}
                toks = rest.split()
                for k in ("depth", "nodes", "time", "nps"):
                    if k in toks:
                        try:
                            d[k] = int(toks[toks.index(k) + 1])
                        except Exception:
                            pass
                last[key] = d
            elif rest.startswith("info string book"):
                last[key] = {"book": True}
            elif rest.startswith("bestmove"):
                res[name].append(last.get(key, {}))
                last[key] = {}
    return res


data = {}
for k, (pgn, out) in SRC.items():
    data[k] = {"games": parse_pgn(pgn), "info": parse_out(out)}
    print(k, len(data[k]["games"]), {n: len(v) for n, v in data[k]["info"].items()})
json.dump(data, open(OUT, "w"))
