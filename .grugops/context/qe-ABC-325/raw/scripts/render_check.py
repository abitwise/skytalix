"""qe-ABC-325: render README/CHANGELOG with markdown-it-py (CommonMark + GFM table) and compare the
branch's Levels/Strength sections and the [1.1.1] entry with main's. Read-only.
Usage: python3 -I render_check.py <worktree> <main README.md copy> <main CHANGELOG.md copy>"""
import re
import sys
from markdown_it import MarkdownIt

wt, main_readme_p, main_cl_p = sys.argv[1:4]


def read(p):
    with open(p, encoding="utf-8") as f:
        return f.read()


def norm(s):
    return re.sub(r"\s+", " ", s).strip()


def section(text, start, stop):
    a = text.index(start)
    b = text.index(stop, a + len(start))
    return text[a:b]


md = MarkdownIt("commonmark").enable("table")
readme = read(f"{wt}/README.md")
cl = read(f"{wt}/CHANGELOG.md")
m_readme = read(main_readme_p)
m_cl = read(main_cl_p)

lv = section(readme, "## Levels", "## Saved games")
m_lv = section(m_readme, "## Levels", "## Saved games")

print("== 1. README Levels+Strength token structure ==")
toks = md.parse(lv)
bad = [(t.type, t.map) for t in toks if t.type in (
    "bullet_list_open", "ordered_list_open", "list_item_open", "code_block", "fence",
    "html_block", "blockquote_open", "hr")]
print("unexpected block tokens:", bad if bad else "none")
th = sum(1 for t in toks if t.type == "th_open")
td = sum(1 for t in toks if t.type == "td_open")
trs = sum(1 for t in toks if t.type == "tr_open")
print("headings", sum(1 for t in toks if t.type == "heading_open"),
      "paragraphs", sum(1 for t in toks if t.type == "paragraph_open"),
      "table rows", trs, "cells/row", (th + td) / trs if trs else None)
ptexts = [toks[i + 1].content.replace("\n", " ") for i, t in enumerate(toks) if t.type == "paragraph_open"]
for i, p in enumerate(ptexts):
    print(f"P{i}: {p[:100]}")

print("== 2. numbers: branch vs main (Levels+Strength) ==")
num = re.compile(r"[+]?\d+(?:\.\d+)?")
def nums(t):
    return sorted(num.findall(t))
b_n, m_n = nums(lv), nums(m_lv)
added = list(b_n)
for x in m_n:
    if x in added:
        added.remove(x)
removed = list(m_n)
for x in b_n:
    if x in removed:
        removed.remove(x)
print("number tokens only on branch:", added)
print("number tokens only on main:  ", removed)
print("table rows identical:", [l for l in lv.splitlines() if l.startswith("|")] == [l for l in m_lv.splitlines() if l.startswith("|")])

print("== 3. caveat and see-below ==")
nlv = norm(lv)
print("'was not measured' count in README Levels+Strength:", nlv.count("was not measured"))
print("'not measured' count (any):", nlv.count("not measured"))
print("'at a given `UCI_Elo`' count:", nlv.count("at a given `UCI_Elo`"))
sb = [i for i, p in enumerate(ptexts) if "(see below)" in p]
for i in sb:
    nxt = ptexts[i + 1] if i + 1 < len(ptexts) else ""
    print(f"see-below in P{i}; next P{i + 1}: {nxt[:80]}")
print("'see below' occurrences:", nlv.count("see below"))
sentences = [s.strip() for s in re.split(r"(?<=[.])\s+", nlv) if s.strip()]
dups = sorted({s for s in sentences if sentences.count(s) > 1})
print("duplicate sentences:", dups if dups else "none")
for phrase in ("measured under 1 s", "One measured figure, on one scale", "One measured figure at 100 ms a move"):
    print(f"phrase {phrase!r}: {phrase in nlv}")

print("== 4. risky line starts (whole README and CHANGELOG [1.1.1]) ==")
e111 = section(cl, "## [1.1.1]", "## [1.1.0]")
for name, text in (("README", readme), ("CHANGELOG", e111)):
    infence = False
    for n, line in enumerate(text.splitlines(), 1):
        if line.startswith("```"):
            infence = not infence
            continue
        if infence:
            continue
        if re.match(r"^\s{0,3}([+*]|\d{1,9}[.)])(\s|$)", line):
            print(name, n, "LIST-START", repr(line[:40]))
        if re.match(r"^\s{0,3}(=+|-+)\s*$", line) and line.strip():
            print(name, n, "setext?", repr(line))
        if re.match(r"^\s{0,3}[+]\S", line) or re.match(r"^\s{0,3}\d+\s", line):
            print(name, n, "safe start (no list marker)", repr(line[:24]))

print("== 5. CHANGELOG ==")
unrel = section(cl, "## [Unreleased]", "## [1.1.1]")
print("[Unreleased] body empty:", unrel.strip() == "## [Unreleased]")
heads = re.findall(r"^## .*$", cl, re.M)
print("version headings:", heads)
m_unrel = section(m_cl, "## [Unreleased]", "## [1.1.0]")
m_body = m_unrel[len("## [Unreleased]"):].strip()
b_body = e111[e111.index("\n"):].strip()
print("[1.1.1] body starts with main's [Unreleased] body verbatim:", b_body.startswith(m_body))
print("[1.1.1] extra after main body:", repr(b_body[len(m_body):].strip()[:400]) if b_body.startswith(m_body) else "n/a")
shape = lambda t: [x.type for x in md.parse(t) if x.nesting >= 0 and x.type != "inline"]
print("[1.1.1] shape:", shape(e111))
print("[1.1.0] shape:", shape(section(cl, "## [1.1.0]", "## [1.0.0]")))
print("[1.1.0] and older unchanged vs main:", cl[cl.index("## [1.1.0]"):cl.rindex("\n[Unreleased]:")] == m_cl[m_cl.index("## [1.1.0]"):m_cl.rindex("\n[Unreleased]:")])
links = re.findall(r"^\[[^\]]+\]: .*$", cl, re.M)
print("links:", links)
refs_used = set(re.findall(r"^## \[([^\]]+)\]", cl, re.M))
refs_def = {re.match(r"^\[([^\]]+)\]", l).group(1) for l in links}
print("every version heading has a link:", refs_used <= refs_def, "| defined not used:", refs_def - refs_used)
