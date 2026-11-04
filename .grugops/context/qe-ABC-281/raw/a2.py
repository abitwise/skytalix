# qe-ABC-281 A2: moved bodies vs base, literal and indent-stripped; untouched rows; the biome-ignore line's position.
# Usage: python3 -I a2.py <repo> <base> <tip>
import subprocess, sys
W, B, T = sys.argv[1:4]
get = lambda rev, f: subprocess.run(["git", "-C", W, "show", f"{rev}:{f}"], capture_output=True, text=True, check=True).stdout.split("\n")
def block(lines, header_sub, nth=0):
    hs = [i for i, l in enumerate(lines) if header_sub in l]
    i = hs[nth]; ind = len(lines[i]) - len(lines[i].lstrip())
    j = next(k for k in range(i + 1, len(lines)) if lines[k] == " " * ind + "});")
    return i, j, ind
rows = [
  ("src/search.null-move.test.ts", 'it("position-6, the even readings 4 to 24: 0 mutated roots, and aborts landing inside a null subtree'),
  ("src/engine.test.ts", 'it("A4: an empty list is node-equal to an absent one over the endgames and the thirty"'),
  ("src/levels.test.ts", 'it("≥ 5 seeds over the same ≥ 30 positions give ≥ 2 distinct blunder-decision sequences"'),
]
for f, h in rows:
    b, t = get(B, f), get(T, f)
    bi, bj, bind = block(b, h); ti, tj, tind = block(t, h)
    assert sum(h in l for l in t) == 1 and sum(h in l for l in b) == 1
    bb, tb = b[bi + 1:tj - tj + bj], t[ti + 1:tj]
    d = tind - bind
    literal = bb == tb
    prefixed = all((l.startswith(" " * d) or l == "") for l in tb)
    stripped = [l[d:] for l in tb] == bb
    print(f"{f}: base body {len(bb)} lines, tip {len(tb)}; literal identical: {literal}; every tip line carries +{d} spaces: {prefixed}; identical after removing exactly {d} spaces: {stripped}")
    print(f"   line before tip header: {t[ti-1].strip()[:110]!r}")
    print(f"   header base: {b[bi].strip()[:60]}... | tip: {t[ti].strip()[:60]}...")
# untouched pieces, literal
checks = [
  ("src/engine.test.ts", 'it("the three test-only doors ignore prior keys'),
  ("src/levels.test.ts", 'it("a fixed seed gives identical blunder decisions across runs"'),
  ("src/search.null-move.test.ts", "const sweep = "),
  ("src/search.null-move.test.ts", "function sweep("),
]
for f, h in checks:
    b, t = get(B, f), get(T, f)
    if not any(h in l for l in b):
        print(f"{f}: {h!r} not present (skipped)"); continue
    bi, bj, _ = block(b, h); ti, tj, _ = block(t, h)
    print(f"{f}: {h[:50]!r} literal identical: {b[bi:bj+1] == t[ti:tj+1]} ({bj-bi+1} lines)")
for f in ("src/search.null-move.test.ts",):
    b, t = get(B, f), get(T, f)
    print("READINGS line count base/tip:", sum("const READINGS = [4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24];" in l for l in b), sum("const READINGS = [4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24];" in l for l in t))
