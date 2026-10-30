"""QE A1/A2 spot check: parse dry-run prints, compare each rpair block argv with r's argv."""
import re
import sys

d = sys.argv[1]


def parse(path):
    runs, cur, name = [], None, None
    for line in open(path):
        m = re.match(r"^(block (\d+) (base|candidate)) cutechess-cli argv:|^(cutechess-cli argv.*|r dry run.*argv.*)$", line)
        if line.rstrip().endswith("argv:"):
            if cur is not None:
                runs.append((name, cur))
            name, cur = line.strip(), []
        elif line.startswith("  ") and cur is not None:
            cur.append(line.strip())
    if cur is not None:
        runs.append((name, cur))
    return runs


def norm(argv):
    """Replace output-path tokens by a class marker, drop start=, report rounds."""
    out = []
    for t in argv:
        out.append(t)
    return out


r = {"base": parse(f"{d}/dry-r-base.txt"), "candidate": parse(f"{d}/dry-r-cand.txt")}
for b in r:
    assert len(r[b]) == 1, (b, len(r[b]))
for fname in ("dry-rpair.txt", "dry-rpair10.txt"):
    runs = parse(f"{d}/{fname}")
    print(f"== {fname}: {len(runs)} block-runs; order:", " ".join(n.split()[1] + n.split()[2][0] for n, _ in runs))
    starts = {"base": [], "candidate": []}
    for name, argv in runs:
        build = name.split()[2]
        ra = r[build][0][1]
        i = argv.index("order=sequential")
        assert argv[i + 1].startswith("start="), name
        starts[build].append(int(argv[i + 1][6:]))
        a = argv[: i + 1] + argv[i + 2 :]
        if len(a) != len(ra):
            print("LEN DIFF", name, len(a), len(ra))
            continue
        diffs = [(k, ra[k], a[k]) for k in range(len(a)) if a[k] != ra[k]]
        kinds = []
        for k, x, y in diffs:
            if x.startswith("stderr=") or (ra[k - 1] == "-pgnout"):
                kinds.append("path")
            elif ra[k - 1] == "-rounds":
                kinds.append(f"rounds {x}->{y}")
            else:
                kinds.append(f"OTHER {x!r}->{y!r}")
        print(name, "diff positions:", len(diffs), kinds)
    for b, s in starts.items():
        cov = sorted(o for st in s for o in range(st, st + 10))
        print(b, "starts", s, "covers 1-100 once:", cov == list(range(1, 101)) if fname == "dry-rpair.txt" else cov == list(range(1, 11)))
print("r argv length", len(r["base"][0][1]))
