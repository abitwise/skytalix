# qe-ABC-291-read host check, by class and count only: per-process CPU over a window from /proc/<pid>/stat (comm and times; no command line is read).
# usage: python3 -I hostcheck.py <window s> ; "busy" column = processes above 1.0 % of one core over the window.
import os, sys, time
HZ = os.sysconf("SC_CLK_TCK"); W = float(sys.argv[1]) if len(sys.argv) > 1 else 30
def snap():
    d = {}
    for p in os.listdir("/proc"):
        if not p.isdigit(): continue
        try:
            s = open(f"/proc/{p}/stat").read()
        except OSError:
            continue
        i = s.rfind(")"); comm = s[s.find("(") + 1:i]; f = s[i + 2:].split()
        d[int(p)] = (comm, int(f[11]) + int(f[12]))
    return d
a = snap(); t0 = time.time(); time.sleep(W); b = snap(); dt = time.time() - t0
rows = []
for p, (c, v) in b.items():
    if p in a and a[p][0] == c:
        pc = 100 * (v - a[p][1]) / HZ / dt
        if pc > 0: rows.append((pc, c))
rows.sort(reverse=True)
cl = {}
for pc, c in rows:
    k = c.split("/")[0]
    e = cl.setdefault(k, [0, 0.0, 0]); e[0] += 1; e[1] += pc; e[2] += pc > 1.0
print(f"window {dt:.1f} s; load {open('/proc/loadavg').read().split()[0]}; processes with CPU {len(rows)}; above 1.0 % of a core {sum(pc > 1.0 for pc, _ in rows)}; total {sum(pc for pc, _ in rows):.1f} % of a core")
for k, e in sorted(cl.items(), key=lambda x: -x[1][1])[:10]:
    print(f"  class {k}: procs {e[0]}, busy {e[2]}, {e[1]:.1f} % of a core")
