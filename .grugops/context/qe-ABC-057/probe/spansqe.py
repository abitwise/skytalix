# QE ABC-057 — sha256 of the spans that must stay byte-identical, located by QE's own anchors
# (statement-level, not the Engineer's). Usage: spansqe.py <file>
import hashlib, re, sys
src = open(sys.argv[1], encoding="utf-8").read()
def h(s): return hashlib.sha256(s.encode()).hexdigest()[:16]
def span(start, end_after):
    a = src.index(start); b = src.index(end_after, a) + len(end_after)
    return src[a:b]
rows = {
  # every line holding the licence regex literal (guard + witnesses)
  "licence-regex-lines": "\n".join(l for l in src.split("\n") if '"\\.\\/history\\.ts";/' in l),
  # the whole licence `it`, minus the line ABC-057 may not touch either: from the test name to the type-import assertion
  "licence-it-body": span('  it("licenses src/history.ts\'s runtime importers', "'import type { GameHistory } from \"./history.ts\";',\n    );\n  });\n"),
  "sibling-tripwire": span('    expect(instrument, "the guard above runs the expression the witnesses below run")', "flags}.test(`,\n    );\n"),
  "composer-tripwire-code": span("    const directory = new URL(\".\", import.meta.url).pathname;\n    const bindsAssembleFrame", ").toEqual([COMPOSITION_ROOT]);\n  });\n"),
  "witnessed-expression": span("  const WITNESSED_EXPRESSION =", ";/m;\n"),
  "LICENSED_DRIVERS": span("const LICENSED_DRIVERS", ";\n"),
  "probe-it": span('  it("evaluates history.ts\'s module body NOWHERE ON THE FRAME PATH', "\n  });\n"),
}
for k, v in rows.items():
    print(f"{k}\t{v.count(chr(10)) + 1} lines\t{h(v)}")
print("game-owning driver\t", src.count("game-owning driver"))
print("loaded = []\t", src.count("loaded = []"), "\tawait import(arming)\t", src.count("await import(arming)"))
