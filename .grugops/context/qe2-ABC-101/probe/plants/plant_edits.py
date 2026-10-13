#!/usr/bin/env python3
# qe2-ABC-101 plants: one edit to src/render.ts in a SCRATCH copy (git archive d22a709f), never in the repository.
# Usage: python3 -I plant_edits.py <copy root> <plant name>. Every edit is an exact-string replace asserted to match once.
import sys

root, name = sys.argv[1], sys.argv[2]
path = f"{root}/src/render.ts"
src = open(path, encoding="utf-8").read()


def rep(s, old, new):
    assert s.count(old) == 1, (name, old, s.count(old))
    return s.replace(old, new)


UNI_NEW = ['[PAWN]: ["♟", "♙"]', '[KNIGHT]: ["♞", "♘"]', '[BISHOP]: ["♝", "♗"]',
           '[ROOK]: ["♜", "♖"]', '[QUEEN]: ["♛", "♕"]', '[KING]: ["♚", "♔"]']
UNI_OLD = ['[PAWN]: ["♙", "♟"]', '[KNIGHT]: ["♘", "♞"]', '[BISHOP]: ["♗", "♝"]',
           '[ROOK]: ["♖", "♜"]', '[QUEEN]: ["♕", "♛"]', '[KING]: ["♔", "♚"]']
ASC = ['[PAWN]: ["P", "p"]', '[KNIGHT]: ["N", "n"]', '[BISHOP]: ["B", "b"]',
       '[ROOK]: ["R", "r"]', '[QUEEN]: ["Q", "q"]', '[KING]: ["K", "k"]']
ORIENT = 'const whiteBottom = orientation === "white-bottom";'

if name == "p0-control":
    pass                                                       # unplanted: the copy must be green
elif name == "p1-one-pair-back":                               # knight only back to outline-white
    src = rep(src, UNI_NEW[1], UNI_OLD[1])
elif name == "p2-ascii-case-swapped":                          # ascii: white lowercase, black uppercase
    for a in ASC:
        w, b = a.split('["')[1].split('", "')
        b = b.rstrip('"]')
        src = rep(src, a, a.replace(f'["{w}", "{b}"]', f'["{b}", "{w}"]'))
elif name == "p3a-variation-selector":                         # white king = U+265A U+FE0E (2 code points, 2 units)
    src = rep(src, UNI_NEW[5], '[KING]: ["♚\\uFE0E", "♔"]')
elif name == "p3b-astral-one-code-point":                      # white king = U+1FA00 (1 code point, 2 UTF-16 units)
    src = rep(src, UNI_NEW[5], '[KING]: ["\\u{1FA00}", "♔"]')
elif name == "p4a-escape-replaces-piece":                      # white queen = ESC alone (1 code point, 1 unit)
    src = rep(src, UNI_NEW[4], '[QUEEN]: ["\\u001b", "♕"]')
elif name == "p4b-escape-on-piece":                            # black queen = ESC + glyph (2 code points, 2 units)
    src = rep(src, UNI_NEW[4], '[QUEEN]: ["♛", "\\u001b♕"]')
elif name == "p5a-orientation-flipped-old-table":              # the pre-A11 table, orientation inverted instead
    for n, o in zip(UNI_NEW, UNI_OLD):
        src = rep(src, n, o)
    src = rep(src, ORIENT, 'const whiteBottom = orientation !== "white-bottom";')
elif name == "p5b-orientation-flipped-new-table":              # A11's table, orientation inverted
    src = rep(src, ORIENT, 'const whiteBottom = orientation !== "white-bottom";')
else:
    raise SystemExit(f"unknown plant {name}")
open(path, "w", encoding="utf-8").write(src)
print(f"{name}: edited {path}")
