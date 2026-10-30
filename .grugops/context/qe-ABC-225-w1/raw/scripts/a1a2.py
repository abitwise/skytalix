"""qe-ABC-225-w1 A1/A2 check on dry-run prints (written by QE, independent of pair-check.ts).
usage: python3 -I a1a2.py <gates-dir>
A1: each rpair block argv, minus the one start=S token after order=sequential, equals r's argv
    (same build, --elo 1910, same --concurrency) except output paths and -rounds.
A2: order alternates base/candidate per block; starts cover 1..100 once per build; -repeat -games 2.
"""
import sys

d = sys.argv[1]


def runs(path):
    out, name, cur = [], None, None
    for line in open(path):
        if line.rstrip().endswith("argv:"):
            if cur is not None:
                out.append((name, cur))
            name, cur = line.strip(), []
        elif line.startswith("  ") and cur is not None:
            cur.append(line.strip())
    if cur is not None:
        out.append((name, cur))
    return out


r = {"base": runs(f"{d}/dry-r-base.txt")[0][1], "candidate": runs(f"{d}/dry-r-cand.txt")[0][1]}
bad = 0
for fname, n_blocks in (("dry-rpair.txt", 10), ("dry-rpair10.txt", 1)):
    rs = runs(f"{d}/{fname}")
    order = [(nm.split()[1], nm.split()[2]) for nm, _ in rs]
    print(f"== {fname}: {len(rs)} block-runs; order", " ".join(i + b[0] for i, b in order))
    starts = {"base": [], "candidate": []}
    for k in range(0, len(order), 2):
        blk = k // 2
        exp = ("base", "candidate") if blk % 2 == 0 else ("candidate", "base")
        if (order[k][1], order[k + 1][1]) != exp:
            print("ORDER MISS block", blk + 1); bad += 1
    for nm, argv in rs:
        build = nm.split()[2]
        ra = r[build]
        i = argv.index("order=sequential")
        st = argv[i + 1]
        assert st.startswith("start="), nm
        starts[build].append(int(st[6:]))
        a = argv[: i + 1] + argv[i + 2:]
        if len(a) != len(ra):
            print("LEN DIFF", nm, len(a), len(ra)); bad += 1; continue
        kinds = []
        for p in range(len(a)):
            if a[p] == ra[p]:
                continue
            if ra[p].startswith("stderr=") or ra[p - 1] == "-pgnout":
                kinds.append("path")
            elif ra[p - 1] == "-rounds":
                kinds.append(f"rounds {ra[p]}->{a[p]}")
            else:
                kinds.append(f"OTHER {ra[p]!r}->{a[p]!r}"); bad += 1
        g = a.index("-games")
        if a[g + 1] != "2" or "-repeat" not in a:
            print("COLOURS MISS", nm); bad += 1
        print(f"  {nm}: {len(argv)} tokens, {len(a)} after start= dropped (r: {len(ra)}); diffs {len(kinds)} {kinds}")
    for b, s in starts.items():
        cov = sorted(o for x in s for o in range(x, x + 10))
        want = list(range(1, 10 * n_blocks + 1))
        print(f"  {b} starts {s} covers 1-{10 * n_blocks} once: {cov == want}")
        bad += cov != want
pins = [t for t in r["base"] if t.startswith(("st=", "timemargin=", "option.", "-concurrency"))] + [r["base"][r["base"].index("-concurrency") + 1]]
print("r pins:", pins)
print("RESULT", "OK" if bad == 0 else f"{bad} MISSES")
