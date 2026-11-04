# a2check.py <worktree> <base-rev>: ABC-302 A2, each moved block's body at the tip vs base, nesting indent removed.
import subprocess, re, sys
W, BASE = sys.argv[1], sys.argv[2]
def get(rev, f): return subprocess.run(["git", "-C", W, "show", f"{rev}:{f}"], capture_output=True, text=True).stdout
def body(src, header, ind):
    lines = src.split("\n"); i = [k for k, l in enumerate(lines) if l.strip() == header.strip() and l.startswith(" " * ind + header.strip())]
    assert len(i) == 1, (header, len(i)); i = i[0]
    close = " " * ind + "});"
    j = next(k for k in range(i + 1, len(lines)) if lines[k] == close or (lines[k].startswith(" " * ind + "}, ") and lines[k].endswith(");")))
    return lines[i + 1:j]
NM, FU, ZO, EN, LV, US, CL, EC = (f"src/{n}.test.ts" for n in ["search.null-move", "search.futility", "zobrist", "engine", "levels", "uci-session", "cli", "engine.capacity"])
rows = [
 ("R1", NM, NM, 'it("search() to depth 4 and chooseMove deepened to 4: every null move is made out of check, with three or more pieces", () => {', 2, 6),
 ("R2", US, US, '''it("A5: the CLI level seam's injected list equals UCI's, key for key, and both play d8e8", async () => {''', 2, 4),
 ("R3", FU, FU, 'it("the rule changes the work: search() at depth 4 and chooseMove deepened to 4 on position-6 visit fewer nodes than their doors", () => {', 2, 6),
 ("R4", ZO, ZO, 'it("holds at every node within 2 plies of every perft position", () => {', 2, 4),
 ("R5", EN, EN, 'it("on an infinite budget, maxDepth 1000 returns within the same consultation count", () => {', 2, 6),
 ("R6", LV, LV, 'it("a fixed seed gives identical blunder decisions across runs", () => {', 2, 4),
 ("R7", LV, LV, 'it("move, depth and nodes are equal on 30 of 30 positions, for each of two seeds", () => {', 2, 4),
 ("R7-describe", LV, LV, None, 0, 2),
 ("R8", CL, US, 'it("A4: with repetitionKeyHistory injected the default level plays d8e8 at exactly 0; base does not", async () => {', 2, 4),
 ("R9", EC, EC, '''it("ends every line at ply 128 with a leaf's score once the deepening passes it: no node or key past it", () => {''', 2, 4),
]
D7b = 'describe("ABC-174 A3 — the default plays as the engine: chooseMove at 4 000 ms (ABC-228, ADR-0053 d10)", () => {'
D7t = 'describe("ABC-174 A3 — the default plays as the engine: chooseMove at 4 000 ms (ABC-228, ADR-0053 d10) [deep]", () => {'
ok = True
for name, fb, ft, h, bi, ti in rows:
    if h is None:
        b = body(get(BASE, fb), D7b, bi); t = body(open(f"{W}/{ft}").read(), D7t, ti)
    else:
        b = body(get(BASE, fb), h, bi); t = body(open(f"{W}/{ft}").read(), h, ti)
    d = ti - bi
    exact = [l[d:] if l.strip() else l for l in t] == b
    ok &= exact
    print(f"{name} {fb} -> {ft}: base body {len(b)} lines, tip {len(t)}; identical after removing {d}-space indent: {exact}")
print("A2 bodies:", "ALL IDENTICAL" if ok else "MISMATCH")
