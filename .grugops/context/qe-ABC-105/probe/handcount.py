#!/usr/bin/env python3
# QE hand count for ABC-105 A4. Shares no code with tools/grugops/qe-hop-integrity.js or the SE's awk script.
# Usage: python3 -I handcount.py <repo-root> [<board-text-file>]
import os, sys, subprocess

root = sys.argv[1]
board_path = sys.argv[2] if len(sys.argv) > 2 else os.path.join(root, "plans/board.md")


def done_ids(text):
    out, inside = [], False
    for line in text.split("\n"):
        if line.startswith("## "):
            inside = line[3:].startswith("Done")
            continue
        if inside and line.startswith("- [ABC-"):
            close = line.find("]")
            tok = line[3:close]
            if close > 0 and tok[4:].isdigit():
                out.append(tok)
    return out


def numbers_named(s):
    """Manual scan: 'abc', optional '-', digits; not preceded by [a-z0-9]; digit run is maximal."""
    s = s.lower()
    found, i = set(), 0
    while True:
        j = s.find("abc", i)
        if j < 0:
            return found
        i = j + 1
        if j > 0 and (s[j - 1].isascii() and (s[j - 1].isalpha() or s[j - 1].isdigit())):
            continue
        k = j + 3
        if k < len(s) and s[k] == "-":
            k += 1
        d = k
        while d < len(s) and s[d].isdigit():
            d += 1
        if d > k:
            found.add(int(s[k:d]))


def front(text):
    lines = text.split("\n")
    if not lines or lines[0] != "---":
        return None
    try:
        end = lines.index("---", 1)
    except ValueError:
        return None
    kv, refs, cur = {}, [], None
    for ln in lines[1:end]:
        if not ln.strip():
            continue
        if ln[0] in " \t" and ln.strip().startswith("-"):
            if cur == "refs":
                refs.append(ln.strip()[1:].strip())
            continue
        if ":" in ln:
            k, v = ln.split(":", 1)
            cur = k.strip()
            kv[cur] = v.strip()
            if cur == "refs" and v.strip():
                refs.append(v.strip())
    return kv.get("kind", ""), kv.get("by", ""), refs


ctx = os.path.join(root, ".grugops/context")
notes, nfiles, malformed = [], 0, 0
for folder in sorted(os.listdir(ctx)):
    nd = os.path.join(ctx, folder, "notes")
    if not os.path.isdir(nd):
        continue
    for f in sorted(os.listdir(nd)):
        if not f.endswith(".md"):
            continue
        nfiles += 1
        with open(os.path.join(nd, f), encoding="utf8") as fh:
            fm = front(fh.read())
        if fm is None:
            malformed += 1
            continue
        notes.append((folder, f, *fm))

snap = [l for l in open(os.path.join(root, ".grugops/qe-cutover-2026-08-17.txt")).read().split("\n") if l.startswith("ABC-")]
board = open(board_path, encoding="utf8").read()
done = done_ids(board)

cls = {"pre": [], "qe": [], "sub": [], "find": []}
for t in done:
    n = int(t[4:])
    if t in snap:
        cls["pre"].append(t); continue
    hits = {"qe-e2e": 0, "security-nfr": 0}
    for folder, f, kind, by, refs in notes:
        if kind != "decision" or by not in hits:
            continue
        if folder.lower().startswith("ticket-to-pr-"):
            continue
        if n not in numbers_named(folder):
            continue
        if not any(n in numbers_named(r) for r in refs):
            continue
        hits[by] += 1
    cls["qe" if hits["qe-e2e"] else "sub" if hits["security-nfr"] else "find"].append(t)

print(f"notes {nfiles} malformed(handcount-rule) {malformed}")
print(f"Done {len(done)} distinct {len(set(done))} | pre {len(cls['pre'])} | qe {len(cls['qe'])} | sub {len(cls['sub'])} {sorted(cls['sub'])} | find {len(cls['find'])} | sum {sum(len(v) for v in cls.values())}")
print("findings:", " ".join(sorted(cls["find"])))
print("qe:", " ".join(sorted(cls["qe"])))

# snapshot vs 9998a544 by own parse
old = subprocess.run(["git", "-C", root, "show", "9998a544:plans/board.md"], capture_output=True, text=True, check=True).stdout
old_done = done_ids(old)
print(f"9998a544 Done ids {len(old_done)}; snapshot ids {len(snap)}; equal-as-sequence {old_done == snap}; equal-as-set {set(old_done) == set(snap)}")
print("snapshot id-line bytes:", sum(len(s) + 1 for s in snap))

# naive ABC-\d+ scan of the Done section (no regex lib: manual)
sec, inside = [], False
for line in board.split("\n"):
    if line.startswith("## "):
        inside = line[3:].startswith("Done")
        continue
    if inside:
        sec.append(line)
txt = "\n".join(sec)
hits, i = [], 0
while True:
    j = txt.find("ABC-", i)
    if j < 0:
        break
    d = j + 4
    while d < len(txt) and txt[d].isdigit():
        d += 1
    if d > j + 4:
        hits.append(txt[j:d])
    i = j + 1
print(f"naive ABC-<digits> in Done section: {len(hits)} hits / {len(set(hits))} distinct")
