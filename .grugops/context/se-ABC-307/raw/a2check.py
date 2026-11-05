# a2check.py <worktree> <base-rev>: ABC-307 A2. Each moved row's body at the tip against base, nesting indent removed, plus
# every changed line outside the moved rows, listed for reading.
import subprocess, sys
W, BASE = sys.argv[1], sys.argv[2]
def get(rev, f): return subprocess.run(["git", "-C", W, "show", f"{rev}:{f}"], capture_output=True, text=True).stdout
def body(src, header, ind):
    lines = src.split("\n")
    i = [k for k, l in enumerate(lines) if l == " " * ind + header]
    assert len(i) == 1, (header, len(i)); i = i[0]
    close = " " * ind + "});"
    j = next(k for k in range(i + 1, len(lines)) if lines[k] == close or (lines[k].startswith(" " * ind + "}, ") and lines[k].endswith(");")))
    return lines[i + 1:j]
Q, U, C, B = "tools/grugops/qe-hop-integrity.test.ts", "src/uci-session.test.ts", "src/cli.test.ts", "src/book.test.ts"
rows = [
 ("Q1", Q, Q, 'it("--sweep lists ABC-073 as a finding", () => {'),
 ("Q2", Q, Q, 'it("coverage() over EVERY real note (no --ticket folder filter) reads ABC-062 and ABC-073 as findings", () => {'),
 ("Q3", Q, Q, 'it("prints each count line and every finding by id, exits 1; 0 when every row is grandfathered", () => {'),
 ("L1", C, U, 'it("A8′ — the seam built for each level moves exactly as `createLevel` does, on one seed and one injected clock", async () => {'),
 ("L2", C, U, 'it("A4: with a legal ep capture available the same line is not a draw", () => {'),
 ("L3", C, U, 'it("A7: the move the search scores 0 is the move after which gameStatusOf reports the claim", async () => {'),
 ("C1", U, U, 'it("two sessions on the same seededRandom(k) write the same bestmove sequence", () => {'),
 ("C2", U, U, 'it("setoption name Skill Level value 7 sets 7: a bare go searches 30 000 ms", () => {'),
 ("B1", B, B, 'it("ten seeds, one pick each, at least 3 distinct replies", () => {'),
]
ok = True
for name, fb, ft, h in rows:
    b = body(get(BASE, fb), h, 2); t = body(open(f"{W}/{ft}").read(), h, 4)
    same = [l[2:] if l.strip() else l for l in t] == b
    ok &= same
    print(f"{name} {fb} -> {ft}: base {len(b)} lines, tip {len(t)}; identical after removing the 2-space indent: {same}")
print("A2 bodies:", "ALL IDENTICAL" if ok else "MISMATCH")
