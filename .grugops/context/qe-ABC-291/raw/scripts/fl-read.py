# qe-ABC-303 FL figures, by class and count. usage: python3 -I fl-read.py <foreign.tsv> [host.log]
import re, sys
fs = [l.rstrip("\n").split("\t") for l in open(sys.argv[1]) if l.strip()]
t = {}
for f in fs: t.setdefault(f[0], []).append(f)
n = len(t); named = [k for k, v in t.items() if any(len(f) >= 8 for f in v)]; busy = [k for k, v in t.items() if any(len(f) >= 8 and float(f[5]) > 1.0 for f in v)]
cl = {}
for f in fs:
    if len(f) >= 8: cl[f[7]] = cl.get(f[7], 0) + 1
print(f"fsample: {n} samples; {len(named)} name a foreign vitest; {len(busy)} busy (pcpu > 1.0) of {n}; rows by project {cl or 'none'}; largest load1 {max(float(f[1]) for f in fs)}")
if len(sys.argv) > 2:
    h = open(sys.argv[2]).read().splitlines()
    v = [int(m[1]) for l in h for m in [re.search(r"foreign_vitest_procs=(\d+)", l)] if m]; ld = [float(m[1]) for l in h for m in [re.search(r"load1=([\d.]+)", l)] if m]
    print(f"host.log: {len(h)} lines; samples with foreign_vitest_procs > 0: {sum(x > 0 for x in v)} of {len(v)}; largest count {max(v, default=0)}; largest load1 {max(ld, default=0)}")
