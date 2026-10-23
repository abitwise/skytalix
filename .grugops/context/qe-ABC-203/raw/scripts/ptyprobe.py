import os, pty, sys, time, select
cwd = sys.argv[1]
pid, fd = pty.fork()
if pid == 0:
    os.chdir(cwd)
    os.execvp("npm", ["npm", "run", "chess"])
buf = b""
def pump(t):
    global buf
    end = time.time() + t
    while time.time() < end:
        r, _, _ = select.select([fd], [], [], 0.1)
        if r:
            try: buf += os.read(fd, 65536)
            except OSError: return
pump(3)
print(repr(buf[-1500:]))
os.write(fd, b"\x03")
pump(1)
