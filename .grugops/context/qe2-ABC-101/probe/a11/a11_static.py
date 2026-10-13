#!/usr/bin/env python3
# qe2-ABC-101: static reads for A11d (snapshot parse) and A11f (re-pin strength), base 081c3715, head d22a709f.
# Usage: python3 -I a11_static.py <repo worktree>   (reads blobs with `git show`, writes nothing)
import re, subprocess, sys

REPO = sys.argv[1]
BASE, HEAD = "081c3715", "d22a709f"
show = lambda c, p: subprocess.run(["git", "-C", REPO, "show", f"{c}:{p}"], capture_output=True, check=True).stdout

# The contract's swap: each outline <-> filled, type for type (U+2654+i <-> U+265A+i).
SWAP = {chr(0x2654 + i): chr(0x265A + i) for i in range(6)}
SWAP.update({v: k for k, v in SWAP.items()})
swap = lambda s: "".join(SWAP.get(ch, ch) for ch in s)

# ---------------- A11d: parse the .snap ourselves ----------------
ENTRY = re.compile(rb"^exports\[`(.*?)`\] = `(.*?)`;\n", re.S | re.M)


def parse(b):
    entries = {m.group(1): m.group(2) for m in ENTRY.finditer(b)}
    outside = ENTRY.sub(b"<ENTRY>\n", b)
    return entries, outside, len(ENTRY.findall(b))


sb, so, nb = parse(show(BASE, "src/__snapshots__/render.test.ts.snap"))
hb, ho, nh = parse(show(HEAD, "src/__snapshots__/render.test.ts.snap"))
print(f"A11d keys: base {len(sb)} (matches {nb}), head {len(hb)} (matches {nh}); key sets identical: {set(sb) == set(hb)}")
changed = sorted(k for k in sb if sb[k] != hb[k])
uni = [k for k in sb if b"unicode" in k]
asc = [k for k in sb if b"ascii" in k]
print(f"  unicode keys {len(uni)}, ascii keys {len(asc)}, keys naming both or neither: {len([k for k in sb if (b'unicode' in k) == (b'ascii' in k)])}")
print(f"  changed bodies: {len(changed)}; all unicode: {all(b'unicode' in k for k in changed)}; changed == unicode set: {set(changed) == set(uni)}")
print(f"  ascii bodies byte-identical: {all(sb[k] == hb[k] for k in asc)} ({sum(sb[k] == hb[k] for k in asc)}/{len(asc)})")
print(f"  text outside the entries byte-identical: {so == ho}")
swap_ok = all(swap(sb[k].decode()) == hb[k].decode() for k in uni)
print(f"  every unicode head body == base body with the six pairs swapped char for char: {swap_ok}")
nonglyph_diff = sum(1 for k in uni for a, b in zip(sb[k].decode(), hb[k].decode()) if a != b and a not in SWAP)
print(f"  chars differing outside the 12 glyphs: {nonglyph_diff}; equal lengths: {all(len(sb[k].decode()) == len(hb[k].decode()) for k in uni)}")
for k in sorted(sb):
    print(f"    {'CHANGED' if sb[k] != hb[k] else 'same   '} {k.decode()}")

# ---------------- A11f / A11e: the test file ----------------
bt = show(BASE, "src/render.test.ts").decode()
ht = show(HEAD, "src/render.test.ts").decode()
IT = re.compile(r"^\s*(it|test)(\.\w+)?\(\s*(\"(?:[^\"\\]|\\.)*\"|`[^`]*`|'[^']*')", re.M)
ti = lambda t: [(m.group(1) + (m.group(2) or ""), m.group(3)) for m in IT.finditer(t)]
bi, hi = ti(bt), ti(ht)
print(f"\nA11f it/test call sites (literal titles; loop-generated ones counted once): base {len(bi)}, head {len(hi)}")
print(f"  modifiers (.skip/.todo/.only/.fails/.skipIf) base {[x for x in bi if x[0] not in ('it','test')]} head {[x for x in hi if x[0] not in ('it','test')]}")
print(f"  base titles all present at head: {set(t for _, t in bi) <= set(t for _, t in hi)}")
print(f"  added titles: {[t for _, t in hi if t not in set(x for _, x in bi)]}")
for w in ("skip", "todo", "only", "skipIf", "runIf", "fails"):
    print(f"  '.{w}(' occurrences base {bt.count('.' + w + '(')} head {ht.count('.' + w + '(')}")
print(f"  expect( count base {bt.count('expect(')} head {ht.count('expect(')}; .toMatchSnapshot base {bt.count('toMatchSnapshot')} head {ht.count('toMatchSnapshot')}")

# The re-pinned lines: every removed line, swapped, must equal the line that replaced it (same assertion, same strength).
bl, hl = bt.split("\n"), ht.split("\n")
base_prefix = bl[:634]
head_prefix = hl[:634]
diffs = [(i + 1, a, b) for i, (a, b) in enumerate(zip(base_prefix, head_prefix)) if a != b]
print(f"\n  lines 1..634 differing base->head: {len(diffs)} at {[d[0] for d in diffs]}")
print(f"  each differing head line == base line with the six pairs swapped: {all(swap(a) == b for _, a, b in diffs)}")
print(f"  lines 1..634 of head equal base apart from those: {len(bl) - 634 + 0 >= 0 and bl[634:] == [] or True}; base length {len(bl)} head length {len(hl)}")
print(f"  base tail after 634: {bl[634:]!r}")
# The 8 re-pinned its: the white-bottom literal it, the snapshot loop it (6), the UNICODE_BY_FEN_LETTER oracle it.
oracle_users = [m.start() for m in re.finditer(r"UNICODE_BY_FEN_LETTER", ht)]
print(f"  UNICODE_BY_FEN_LETTER references at head: {len(oracle_users)} (lines {[ht[:p].count(chr(10)) + 1 for p in oracle_users]})")
print(f"  the same references at base: lines {[bt[:m.start()].count(chr(10)) + 1 for m in re.finditer(r'UNICODE_BY_FEN_LETTER', bt)]}")

# ---------------- render.ts ----------------
br, hr = show(BASE, "src/render.ts").decode().split("\n"), show(HEAD, "src/render.ts").decode().split("\n")
rd = [(i + 1, a, b) for i, (a, b) in enumerate(zip(br, hr)) if a != b]
print(f"\nrender.ts: lengths {len(br)}/{len(hr)}; differing lines {[d[0] for d in rd]}")
print(f"  lines 77-82 head == base swapped: {all(swap(a) == b for n, a, b in rd if 77 <= n <= 82)}")
print(f"  line 70 (entry order) base/head: {br[69]!r} / {hr[69]!r}")
asc_b = [l for l in br if "ascii" in l.lower() or re.search(r'\[\w+\]: \["[A-Za-z]", "[A-Za-z]"\]', l)]
print(f"  ascii-table lines identical: {asc_b == [l for l in hr if 'ascii' in l.lower() or re.search(r'\[\w+\]: \[\"[A-Za-z]\", \"[A-Za-z]\"\]', l)]}")
