#!/usr/bin/env python3
# ticket-to-pr-ABC-154 A2: from plants5.out.txt, per plant, is every test red at base also red at head (by name)?
# usage: python3 -I superset5.py plants5.out.txt
import re, sys
red, cur = {}, None
for line in open(sys.argv[1]).read().splitlines():
    m = re.match(r"^\[(base|head)\] (.+?)\t", line)
    if m:
        cur = (m.group(1), m.group(2))
        red[cur] = set()
    elif line.startswith("    RED: ") and cur:
        red[cur].add(line[len("    RED: "):])
names = list(dict.fromkeys(n for _, n in red))
ok = 0
for n in names:
    b, h = red.get(("base", n)), red.get(("head", n))
    sup = b is not None and h is not None and b <= h
    ok += sup
    print(f"{n}\tbase {len(b) if b is not None else 'n/a'}\thead {len(h) if h is not None else 'n/a'}\thead ⊇ base {sup}\tadded at head: {sorted(h - b) if sup else '-'}")
print(f"head ⊇ base on {ok} of {len(names)} plants")
