"""qe-ABC-324: render README/CHANGELOG with markdown-it-py (CommonMark + GFM table) and compare
the changed prose with the source wording in the QE and architect notes. Read-only."""
import re
import sys
from markdown_it import MarkdownIt

wt = sys.argv[1]


def read(p):
    with open(f"{wt}/{p}", encoding="utf-8") as f:
        return f.read()


def norm(s):
    s = s.replace("> ", " ")
    return re.sub(r"\s+", " ", s).strip()


md = MarkdownIt("commonmark").enable("table")
readme = read("README.md")
changelog = read("CHANGELOG.md")


def section(text, start, stop):
    a = text.index(start)
    b = text.index(stop, a + len(start))
    return text[a:b]


levels = section(readme, "## Levels", "## Saved games")
unrel = section(changelog, "## [Unreleased]", "## [1.1.0]")

print("== README Levels+Strength token structure ==")
toks = md.parse(levels)
for t in toks:
    if t.type in ("bullet_list_open", "ordered_list_open", "list_item_open", "code_block", "fence", "html_block", "blockquote_open", "hr"):
        print("UNEXPECTED", t.type, t.map)
heads = [t for t in toks if t.type == "heading_open"]
paras = [t for t in toks if t.type == "paragraph_open"]
print("headings", len(heads), "paragraphs", len(paras))
table = [t for t in toks if t.type.startswith("t")]
th = sum(1 for t in toks if t.type == "th_open")
td = sum(1 for t in toks if t.type == "td_open")
trs = sum(1 for t in toks if t.type == "tr_open")
print("table rows", trs, "th", th, "td", td, "cells/row", (th + td) / trs if trs else None)
# cell texts of the Strength row
inl = [t for t in toks if t.type == "inline"]
html = md.render(levels)
row = re.search(r"<tr>\s*<td>Strength</td>(.*?)</tr>", html, re.S)
cells = re.findall(r"<td>(.*?)</td>", row.group(1)) if row else []
print("Strength cells", cells)
# paragraph order
ptexts = []
for i, t in enumerate(toks):
    if t.type == "paragraph_open":
        ptexts.append(toks[i + 1].content.replace("\n", " "))
for i, p in enumerate(ptexts):
    print(f"P{i}: {p[:90]}")

print("== CHANGELOG [Unreleased] token structure ==")
ctoks = md.parse(unrel)
print([t.type for t in ctoks if t.nesting >= 0 and t.type != "inline"])
print("== CHANGELOG [1.1.0] token structure (for format comparison) ==")
old = section(changelog, "## [1.1.0]", "## [1.0.0]")
print([t.type for t in md.parse(old) if t.nesting >= 0 and t.type != "inline"])

print("== exact-wording checks (whitespace-normalized substring) ==")
qe = read(".grugops/context/qe-ABC-323/raw/notes/note-c-verdict.md")
ar = read(".grugops/context/arch-ABC-324/raw/notes/note-decision.md")
nl = norm(levels)
nu = norm(unrel)
checks = []
# QE recommended README text: quoted sentences in the README Levels text bullet
qe_line = [l for l in qe.splitlines() if l.startswith("- **README Levels text:**")][0]
qe_quotes = re.findall(r'"([^"]+)"', qe_line)
for q in qe_quotes[:2]:
    checks.append(("QE README Levels text", q))
qe_strength = [l for l in qe.splitlines() if l.startswith("- **README Strength section:**")][0]
checks.append(("QE Strength line", re.findall(r'"([^"]+)"', qe_strength)[0]))
qe_cl = [l for l in qe.splitlines() if l.startswith("- **CHANGELOG `[Unreleased]`:**")][0]
checks.append(("QE CHANGELOG line", re.findall(r'"([^"]+)"', qe_cl)[0]))
ar_para = re.search(r"in three sentences:\n\n  > (.*?)\n\n", ar, re.S).group(1)
checks.append(("Architect projection paragraph", ar_para))
ar_cl = re.search(r"beside QE's level 5 line:\*\*\n\n  > (.*?)\n", ar, re.S).group(1)
checks.append(("Architect CHANGELOG line", ar_cl))
checks.append(("Architect intro line", "measured for levels 1 to 5 and projected for 6 and 7:"))
optional = re.search(r"after QE's Stockfish paragraph:\n\n  > (.*?)\n", ar, re.S).group(1)
for name, q in checks:
    target = nu if "CHANGELOG" in name else nl
    print(("MATCH  " if norm(q) in target else "MISSING"), name, "|", norm(q)[:70])
print(("present" if norm(optional) in nl else "absent "), "architect optional Stockfish-code sentence (orchestrator: leave out)")

# "see below" must be in the paragraph directly before the Stockfish caveat paragraph
sb = [i for i, p in enumerate(ptexts) if "(see below)" in p]
for i in sb:
    nxt = ptexts[i + 1] if i + 1 < len(ptexts) else ""
    print("see-below in P%d; next P%d starts: %s" % (i, i + 1, nxt[:60]), "| mentions Stockfish:", "Stockfish" in nxt)

# lines that a CommonMark parser could take as list starts or setext underlines
print("== risky line starts in changed sections ==")
for name, text in (("README", levels), ("CHANGELOG", unrel)):
    for n, line in enumerate(text.splitlines()):
        if re.match(r"^\s{0,3}([-+*]|\d{1,9}[.)])(\s|$)", line) and not line.lstrip().startswith("- "):
            print(name, n, repr(line[:40]))
        if re.match(r"^\s{0,3}(=+|-+)\s*$", line):
            print(name, "setext?", n, repr(line))
        if re.match(r"^[+]", line):
            print(name, "plus-start (not a list: no space after +)", n, repr(line[:20]))
