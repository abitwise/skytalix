# qe-ABC-302 A2: every `it` block in the eight touched files, base vs tip, compared once the nesting indent is removed.
# Usage: python3 -I a2.py <repo> <base> <tip>. Independent of se-ABC-302's a2check.py.
import re, subprocess, sys
W, BASE, TIP = sys.argv[1:4]
FILES = ["search.null-move", "uci-session", "search.futility", "zobrist", "engine", "levels", "cli", "engine.capacity"]
def show(rev, f): return subprocess.run(["git", "-C", W, "show", f"{rev}:src/{f}.test.ts"], capture_output=True, text=True, check=True).stdout.split("\n")
HDR = re.compile(r'^(\s*)(it|describe)\(\s*(["\'`])(.*?)\3,')
def blocks(lines):
    out = []
    for i, l in enumerate(lines):
        m = HDR.match(l)
        if not m: continue
        ind = len(m.group(1)); close = " " * ind + "});"
        j = next(k for k in range(i + 1, len(lines)) if lines[k] == close or (lines[k].startswith(" " * ind + "}") and lines[k].rstrip().endswith(");")))
        out.append((m.group(2), m.group(4), ind, lines[i + 1:j]))
    return out
def dedent(body, d):
    r = []
    for l in body:
        if l.strip() and not l.startswith(" " * d): return None
        r.append(l[d:] if l.strip() else l)
    return r
MOVED = {  # moved title -> (base file, tip file)
 "search() to depth 4 and chooseMove deepened to 4: every null move is made out of check, with three or more pieces": ("search.null-move", "search.null-move"),
 "A5: the CLI level seam's injected list equals UCI's, key for key, and both play d8e8": ("uci-session", "uci-session"),
 "the rule changes the work: search() at depth 4 and chooseMove deepened to 4 on position-6 visit fewer nodes than their doors": ("search.futility", "search.futility"),
 "holds at every node within 2 plies of every perft position": ("zobrist", "zobrist"),
 "on an infinite budget, maxDepth 1000 returns within the same consultation count": ("engine", "engine"),
 "a fixed seed gives identical blunder decisions across runs": ("levels", "levels"),
 "move, depth and nodes are equal on 30 of 30 positions, for each of two seeds": ("levels", "levels"),
 "A4: with repetitionKeyHistory injected the default level plays d8e8 at exactly 0; base does not": ("cli", "uci-session"),
 "ends every line at ply 128 with a leaf's score once the deepening passes it: no node or key past it": ("engine.capacity", "engine.capacity"),
 "ABC-174 A3 — the default plays as the engine: chooseMove at 4 000 ms (ABC-228, ADR-0053 d10)": ("levels", "levels"),
}
B = {f: blocks(show(BASE, f)) for f in FILES}; T = {f: blocks(show(TIP, f)) for f in FILES}
ok = True
print("## moved bodies (base body vs the tip's deep copy)")
for title, (fb, ft) in MOVED.items():
    deep_title = title + " [deep]" if title.startswith("ABC-174 A3") else title
    b = [x for x in B[fb] if x[1] == title]; t = [x for x in T[ft] if x[1] == deep_title]
    if fb == ft and not title.startswith("ABC-174 A3"): t = [x for x in t if x[2] > b[0][2]] or t
    assert len(b) == 1 and len(t) == 1, (title, len(b), len(t))
    d = t[0][2] - b[0][2]; same = dedent(t[0][3], d) == b[0][3]
    ok &= same
    print(f"{'IDENTICAL' if same else 'DIFFERS  '} {fb} -> {ft}: +{d} indent, {len(b[0][3])} lines: {deep_title[:80]}")
print("## every other `it` in the touched files (title present at base and tip; body after the indent shift)")
for f in FILES:
    bt = {}; tt = {}
    for k, ti, ind, body in B[f]:
        if k == "it": bt.setdefault(ti, []).append((ind, body))
    for k, ti, ind, body in T[f]:
        if k == "it": tt.setdefault(ti, []).append((ind, body))
    out = sorted(set(bt) - set(tt)); inn = sorted(set(tt) - set(bt)); changed = []
    for ti in set(bt) & set(tt):
        if ti in MOVED: continue
        for (bi, bb), (ti_, tb) in zip(sorted(bt[ti]), sorted(tt[ti])):
            if dedent(tb, ti_ - bi) != bb: changed.append(ti)
        if len(bt[ti]) != len(tt[ti]): changed.append(ti + " (count)")
    ok &= not changed
    print(f"{f}: it blocks base {sum(len(v) for v in bt.values())}, tip {sum(len(v) for v in tt.values())}; titles out {len(out)}, in {len(inn)}, other bodies changed {len(changed)}")
    for x in out: print(f"   out: {x}")
    for x in inn: print(f"   in:  {x}")
    for x in changed: print(f"   CHANGED: {x}")
print("A2 moved bodies and siblings:", "ALL IDENTICAL (indent aside)" if ok else "MISMATCH")
