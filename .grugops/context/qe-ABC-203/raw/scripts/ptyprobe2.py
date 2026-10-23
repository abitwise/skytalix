import os, pty, sys, time, select, re
cwd = sys.argv[1]
pid, fd = pty.fork()
if pid == 0:
    os.chdir(cwd); os.execvp("npm", ["npm", "run", "chess"])
buf = b""
def pump(t):
    global buf
    end = time.time() + t
    while time.time() < end:
        r, _, _ = select.select([fd], [], [], 0.1)
        if r:
            try: buf += os.read(fd, 65536)
            except OSError: return
pump(2); os.write(fd, b"white\r"); pump(1); print(repr(buf[-300:])); os.write(fd, b"1\r"); pump(2)
print(repr(buf[-2500:]))
os.write(fd, b"quit\r"); pump(0.5); os.write(fd, b"quit\r"); pump(1)
