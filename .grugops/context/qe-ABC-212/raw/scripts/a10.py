# ABC-212 A10 by hand, in a real pty: `npm run chess -- --colour white --difficulty 7`.
# usage: python3 -I a10.py <worktree> <scripts-dir> <rawdir>
import os, pty, sys, time, select, subprocess, json, re
W, D, RAW = sys.argv[1:4]
log = open(os.path.join(RAW, "a10-transcript.bin"), "wb")
events = []
def ev(**k):
    k["t"] = round(time.monotonic(), 3); events.append(k); print(json.dumps(k), flush=True)
def precheck(tag):
    r = subprocess.run([os.path.join(D, "waitclear.sh"), os.path.join(RAW, "a10-precheck.txt")])
    line = open(os.path.join(RAW, "a10-precheck.txt")).read().strip().splitlines()[-1]
    ev(step="precheck", tag=tag, rc=r.returncode, line=line)
    if r.returncode != 0: sys.exit(4)
def spawn(args):
    pid, fd = pty.fork()
    if pid == 0:
        os.chdir(W); os.execvp("npm", ["npm", "run", "chess", "--"] + args)
    return pid, fd
buf = b""
def pump(fd, timeout):
    global buf
    r, _, _ = select.select([fd], [], [], timeout)
    if r:
        try: chunk = os.read(fd, 65536)
        except OSError: return None
        if not chunk: return None
        log.write(chunk); log.flush(); buf += chunk
        return chunk
    return b""
def until(fd, pred, limit):
    end = time.monotonic() + limit
    while time.monotonic() < end:
        if pump(fd, 0.01) is None: return False
        if pred(): return True
    return False

def session_timed():
    global buf
    precheck("session-start")
    pid, fd = spawn(["--colour", "white", "--difficulty", "7"])
    buf = b""
    assert until(fd, lambda: buf.endswith(b"\r\n> "), 30), "no first prompt"
    measured = None
    for mv in ["h4", "Rh3", "a4", "Ra3", "Rhg3", "b4"]:
        precheck("before-" + mv)
        buf = b""; t0 = time.monotonic(); os.write(fd, mv.encode() + b"\r")
        t_think = None
        def done():
            nonlocal t_think
            if t_think is None and b"thinking..." in buf: t_think = time.monotonic()
            i = buf.rfind(b"White to move")
            return i > 0 and buf.endswith(b"\r\n> ") and (t_think is not None or b"thinking..." not in buf)
        ok = until(fd, done, 60)
        t1 = time.monotonic()
        last = re.findall(rb"last: (\S+)", buf)
        ev(step="move", sent=mv, ok=ok, thinking_drawn=t_think is not None,
           ms_enter_to_thinking=None if t_think is None else round((t_think - t0) * 1000),
           ms_enter_to_prompt=round((t1 - t0) * 1000),
           ms_thinking_to_prompt=None if t_think is None else round((t1 - t_think) * 1000),
           engine_last=last[-1].decode() if last else None)
        if t_think is not None and (t1 - t0) > 2.0:
            measured = (mv, round((t1 - t0) * 1000)); break
    ev(step="measured", value=measured)
    subprocess.run([os.path.join(D, "precheck.sh")], stdout=open(os.path.join(RAW, "a10-postcheck.txt"), "a"))
    # Ctrl-C during the next search
    precheck("before-ctrl-c")
    buf = b""; nxt = "b3"
    t0 = time.monotonic(); os.write(fd, nxt.encode() + b"\r")
    saw = until(fd, lambda: b"thinking..." in buf, 10)
    time.sleep(3.0)
    pump(fd, 0)
    tk = time.monotonic(); os.write(fd, b"\x03")
    status = None
    while time.monotonic() - tk < 40:
        pump(fd, 0.005)
        p, st = os.waitpid(pid, os.WNOHANG)
        if p == pid: status = st; break
    te = time.monotonic()
    left = subprocess.run(["pgrep", "-fl", "src/[c]li.ts --colour white --difficulty 7"], capture_output=True, text=True).stdout.strip()
    ev(step="ctrl-c", sent_move=nxt, thinking_seen=saw, ms_in_search_before_key=round((tk - t0) * 1000),
       ms_key_to_exit=round((te - tk) * 1000), wait_status=status,
       signaled=None if status is None else os.WIFSIGNALED(status),
       exit_code=None if status is None or not os.WIFEXITED(status) else os.WEXITSTATUS(status),
       cli_process_left=left)

def session_pgn(level):
    global buf
    pid, fd = spawn(["--colour", "white", "--difficulty", str(level)])
    buf = b""
    assert until(fd, lambda: buf.endswith(b"\r\n> "), 30)
    buf = b""; t0 = time.monotonic(); os.write(fd, b"e4\r")
    until(fd, lambda: buf.rfind(b"White to move") > 0 and buf.endswith(b"\r\n> "), 60)
    t1 = time.monotonic(); last = re.findall(rb"last: (\S+)", buf)
    buf = b""; os.write(fd, b"resign\r")
    until(fd, lambda: False, 5)
    _, st = os.waitpid(pid, 0)
    m = re.search(rb"PGN saved: (\S+)", buf)
    path = m.group(1).decode() if m else None
    tags = None
    if path:
        full = path if os.path.isabs(path) else os.path.join(W, path)
        txt = open(full).read(); tags = re.findall(r'^\[(\w+) "([^"]*)"\]', txt, re.M)
        open(os.path.join(RAW, f"a10-pgn-level{level}.pgn"), "w").write(txt)
    ev(step="pgn", level=level, ms_engine_reply=round((t1 - t0) * 1000), engine_last=last[-1].decode() if last else None,
       exit_code=os.WEXITSTATUS(st) if os.WIFEXITED(st) else None, pgn_path=path, tags=tags)

session_timed()
session_pgn(6)
session_pgn(7)
json.dump(events, open(os.path.join(RAW, "a10-events.json"), "w"), indent=1)
