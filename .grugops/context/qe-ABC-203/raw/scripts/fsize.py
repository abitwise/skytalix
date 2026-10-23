import resource, signal, subprocess, sys, os
W, cwd, ok_out = sys.argv[1:4]
def pre():
    signal.signal(signal.SIGXFSZ, signal.SIG_IGN)
    resource.setrlimit(resource.RLIMIT_FSIZE, (100, 100))  # 100 bytes: the open succeeds, the write fails
r = subprocess.run(["node", f"{W}/src/cli.ts", "--colour", "white", "--difficulty", "1"], cwd=cwd, input=b"resign\n", capture_output=True, preexec_fn=pre)
ok = open(ok_out, "rb").read()
ok_minus = ok[: ok.rstrip(b"\n").rfind(b"\n") + 1]
print("exit", r.returncode)
print("stderr", repr(r.stderr))
print("stdout == success minus saved line:", r.stdout == ok_minus)
print("games/ entries:", os.listdir(os.path.join(cwd, "games")) if os.path.isdir(os.path.join(cwd, "games")) else None)
