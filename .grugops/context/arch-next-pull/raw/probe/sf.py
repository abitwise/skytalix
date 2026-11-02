# SCRATCH PROBE (arch-next-pull): the evaluation-lever probe, Stockfish side. Stockfish 19, Threads 1, Hash 64,
# fixed depth D (deterministic: one process per worker, "ucinewgame" before every position, the same command order).
# For each position: "go depth D" -> best score S* (side to move); then for each distinct skytalix move m that is not
# Stockfish's best: "go depth D searchmoves m" -> S(m). loss(m) = max(0, S* - S(m)), mates as +-(10000 - plies), loss
# clamped to 1000. Usage: python3 sf.py <positions.jsonl> <play1.jsonl> [<play2.jsonl> ...] <D> <workers> > out.jsonl
import json, subprocess, sys
from multiprocessing import Pool
args = sys.argv[1:]
POS, PLAYS, D, W = args[0], args[1:-2], int(args[-2]), int(args[-1])
def score_of(lines):
    s = None
    for l in lines:
        if l.startswith("info") and " score " in l and " pv " in l and f" depth {D} " in l + " ":
            t = l.split()
            i = t.index("score")
            s = int(t[i + 2]) if t[i + 1] == "cp" else (10000 - abs(int(t[i + 2]))) * (1 if int(t[i + 2]) > 0 else -1)
    return s
def run(job):
    pid, fen, moves = job
    p = subprocess.Popen(["stockfish"], stdin=subprocess.PIPE, stdout=subprocess.PIPE, text=True, bufsize=1)
    def cmd(c): p.stdin.write(c + "\n"); p.stdin.flush()
    def until(prefix):
        out = []
        while True:
            l = p.stdout.readline().strip()
            out.append(l)
            if l.startswith(prefix): return out
    cmd("uci"); until("uciok"); cmd("setoption name Threads value 1"); cmd("setoption name Hash value 64")
    cmd("ucinewgame"); cmd("isready"); until("readyok")
    cmd(f"position fen {fen}"); cmd(f"go depth {D}"); out = until("bestmove")
    best = out[-1].split()[1]; sbest = score_of(out)
    res = {"id": pid, "best": best, "sbest": sbest, "loss": {}}
    for m in sorted(set(moves)):
        if m == best: res["loss"][m] = 0; continue
        cmd(f"go depth {D} searchmoves {m}"); o = until("bestmove"); sm = score_of(o)
        res["loss"][m] = min(1000, max(0, sbest - sm)) if sm is not None and sbest is not None else None
    cmd("quit"); p.wait()
    return res
if __name__ == "__main__":
    pos = [json.loads(l) for l in open(POS)]
    plays = [{json.loads(l)["id"]: json.loads(l)["move"] for l in open(f)} for f in PLAYS]
    jobs = [(q["id"], q["fen"], [pl[q["id"]] for pl in plays]) for q in pos]
    with Pool(W) as pool:
        for r in pool.imap(run, jobs): print(json.dumps(r), flush=True)
