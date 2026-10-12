#!/usr/bin/env python3
# qe-ABC-154: (1) head ⊇ base by test name, per plant (A2); (2) QE's base rows against QE4's [new] rows in
# qe4-ABC-105/probe/plants4.out.txt (the same two blobs, 8c326845 / 4e352175), to show the loaded plant text acts as QE4's
# did: equal pass count and equal red names, plant by plant. Sweep counts are printed, not compared (the board moved).
# usage: python3 -I compare6.py plants6.out.txt qe4-plants4.out.txt
import re, sys


def parse(path):
    red, row, cur = {}, {}, None
    for line in open(path).read().splitlines():
        m = re.match(r"^\[(\w+)\] (.+?)\t(tests (\d+)/(\d+).*?sweep exit (\d) (\S+).*)$", line)
        if m:
            cur = (m.group(1), m.group(2))
            red[cur] = set()
            row[cur] = (m.group(4), m.group(5), m.group(7))
        elif re.match(r"^\[(\w+)\] (.+?)\tn/a", line):
            cur = None
        elif line.startswith("    RED: ") and cur:
            red[cur].add(line[len("    RED: "):])
    return red, row


mine, mrow = parse(sys.argv[1])
qe4, qrow = parse(sys.argv[2])
names = list(dict.fromkeys(n for _, n in mine))
print("## A2: head ⊇ base by name")
ok = 0
for n in names:
    b, h = mine[("base", n)], mine[("head", n)]
    sup = b <= h
    ok += sup
    print(f"{n}\tbase red {len(b)}\thead red {len(h)}\thead ⊇ base {sup}\tadded at head: {sorted(h - b)}")
print(f"head ⊇ base on {ok} of {len(names)} plants\n")
print("## base (69a1f4b4 = 8fd0c233 blobs) vs QE4 [new] (8fd0c233): pass count and red names")
same = 0
for n in names:
    b, q = mine[("base", n)], qe4.get(("new", n))
    eq = q is not None and b == q and mrow[("base", n)][:2] == qrow[("new", n)][:2]
    same += eq
    print(f"{'SAME' if eq else 'DIFF'}\t{n}\tmine {mrow[('base', n)][0]}/{mrow[('base', n)][1]} red {len(b)} sweep {mrow[('base', n)][2]}\t"
          f"QE4 {qrow[('new', n)][0]}/{qrow[('new', n)][1]} red {len(q)} sweep {qrow[('new', n)][2]}")
print(f"base == QE4 [new] (pass count and red names) on {same} of {len(names)} plants")
