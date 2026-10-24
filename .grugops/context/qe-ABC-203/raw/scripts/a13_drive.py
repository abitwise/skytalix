"""A13 driver: play one game to a finish with `npm run chess` under a real pty, in a clone.

The human's moves come from Stockfish 19 (UCI). The engine's replies are recovered by diffing the
drawn board against the placement after each Stockfish-legal move (go perft 1). Nothing of the
product's own code is used to drive or to read. Raw pty bytes are kept in transcript.bin.
"""
import os, pty, re, select, subprocess, sys, time

clone, outdir, colour_answer, difficulty_answer = sys.argv[1:5]
MOVETIME = int(sys.argv[5]) if len(sys.argv) > 5 else 60

GLYPH = {"♚": "K", "♛": "Q", "♜": "R", "♝": "B", "♞": "N", "♟": "P",
         "♔": "k", "♕": "q", "♖": "r", "♗": "b", "♘": "n", "♙": "p"}

sf = subprocess.Popen(["stockfish"], stdin=subprocess.PIPE, stdout=subprocess.PIPE, text=True, bufsize=1)
def sf_cmd(lines, until):
    for l in lines: sf.stdin.write(l + "\n")
    sf.stdin.flush()
    out = []
    while True:
        l = sf.stdout.readline()
        out.append(l.rstrip("\n"))
        if until(l): return out
sf_cmd(["uci"], lambda l: l.startswith("uciok"))
sf_cmd(["isready"], lambda l: l.startswith("readyok"))

def pos(moves): return "position startpos" + (" moves " + " ".join(moves) if moves else "")
def legal(moves):
    out = sf_cmd([pos(moves), "go perft 1"], lambda l: l.startswith("Nodes searched"))
    return [l.split(":")[0] for l in out if re.match(r"^[a-h][1-8][a-h][1-8][qrbn]?:", l)]
def fen(moves):
    out = sf_cmd([pos(moves), "d"], lambda l: l.startswith("Checkers"))
    return next(l[5:] for l in out if l.startswith("Fen: "))
def placement_of_fen(f):
    rows = []
    for r in f.split()[0].split("/"):
        s = ""
        for c in r: s += "." * int(c) if c.isdigit() else c
        rows.append(s)
    return rows  # rank 8 first, files a..h
def best(moves):
    out = sf_cmd([pos(moves), f"go movetime {MOVETIME}"], lambda l: l.startswith("bestmove"))
    return out[-1].split()[1]

pid, fd = pty.fork()
if pid == 0:
    os.chdir(clone)
    os.execvp("npm", ["npm", "run", "chess"])

buf = b""
alive = True
def pump_until(pred, timeout=120):
    global buf, alive
    end = time.time() + timeout
    while time.time() < end:
        if pred(): return True
        r, _, _ = select.select([fd], [], [], 0.05)
        if r:
            try:
                chunk = os.read(fd, 65536)
                if not chunk: alive = False; return pred()
                buf += chunk
            except OSError:
                alive = False
                return pred()
    return pred()

def text(): return buf.decode("utf-8", "replace")
def send(s):
    os.write(fd, (s + "\r").encode())

pump_until(lambda: text().endswith("[white]: "))
send(colour_answer)
pump_until(lambda: text().endswith("[5]: "))
send(difficulty_answer)

def last_board():
    t = text().replace("\r", "")
    lines = t.split("\n")
    # last frame: find last file-label row
    idx = max(i for i, l in enumerate(lines) if re.match(r"^   [a-h] [a-h] [a-h]", l))
    files = lines[idx].split()
    ranks = {}
    for l in lines[idx - 8: idx]:
        rank = int(l[0])
        sq = l[2:18]
        def cell(c):
            if c in ".:": return "."
            if c in GLYPH: return GLYPH[c]
            if c in "KQRBNPkqrbnp": return c
            return "?"
        pieces = [cell(sq[i]) for i in range(1, 16, 2)]
        ranks[rank] = dict(zip(files, pieces))
    return ["".join(ranks[r][f] for f in "abcdefgh") for r in range(8, 0, -1)]

def at_prompt(): return text().endswith("\n> ") or text().endswith("\r\n> ")
def finished(): return "PGN saved:" in text() or "PGN not saved:" in text() or not alive

moves = []
pump_until(lambda: at_prompt() or finished())
human_white = "White to move  1." in text() and at_prompt()
board = last_board()
# If the human is black, the engine has already moved: recover its move.
log = []
def recover_engine_move():
    seen = last_board()
    for m in legal(moves):
        if placement_of_fen(fen(moves + [m])) == seen:
            return m
    raise SystemExit(f"could not recover engine move; board={seen} moves={moves}")

if placement_of_fen(fen([])) != board:
    moves.append(recover_engine_move()); log.append(("engine", moves[-1]))
human_is_white = len(moves) == 0

ply_cap = 400
while not finished() and len(moves) < ply_cap:
    m = best(moves)
    if m == "(none)": break
    send(m)
    moves.append(m); log.append(("human", m))
    before = len(buf)
    pump_until(lambda: (len(buf) > before and at_prompt()) or finished())
    if finished(): break
    seen = last_board()
    if placement_of_fen(fen(moves)) == seen:
        # engine has not moved yet? wait for the next prompt (engine reply produces a new frame)
        pump_until(lambda: placement_of_fen(fen(moves)) != last_board() or finished(), 60)
        if finished(): break
    moves.append(recover_engine_move()); log.append(("engine", moves[-1]))
    if not at_prompt():
        pump_until(lambda: at_prompt() or finished())

pump_until(lambda: not alive, 15)
if placement_of_fen(fen(moves)) != last_board():
    moves.append(recover_engine_move()); log.append(("engine", moves[-1]))
_, status = os.waitpid(pid, 0)
sf_cmd(["quit"], lambda l: True) if False else sf.kill()
open(os.path.join(outdir, "transcript.bin"), "wb").write(buf)
open(os.path.join(outdir, "moves.uci"), "w").write(" ".join(moves) + "\n")
final_fen = fen(moves)
open(os.path.join(outdir, "driver-final.fen"), "w").write(final_fen + "\n")
print("exit status", os.waitstatus_to_exitcode(status))
print("plies", len(moves), "human_is_white", human_is_white)
print("driver final FEN", final_fen)
print("screen board (last frame)", last_board())
print("tail:", text()[-900:])
