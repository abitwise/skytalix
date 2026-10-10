import sys, pathlib
tree, build = sys.argv[1], sys.argv[2]
def rep(rel, a, b):
    p = pathlib.Path(tree, rel); s = p.read_text()
    assert s.count(a) == 1, (build, rel, a)
    p.write_text(s.replace(a, b))
SEAM_HEAD = "  return (history, status, thinking, messages) =>\n    assembleFrame("
SEAM_TAIL = "      mode,\n    );\n}"
def seam(edge):
    rep("src/render-seam.ts", SEAM_HEAD, "  return (history, status, thinking, messages) => {\n    " + edge + "\n    return assembleFrame(")
    rep("src/render-seam.ts", SEAM_TAIL, "      mode,\n    );\n  };\n}")
D = '.then((m) => m.gameStatusOf(history));'
P = "src/history-pane.nfr.test.ts"
if build == "BASE": pass
elif build == "X5b": seam('void import("./history.ts")' + D)
elif build == "X5b-CONDITIONAL": seam('if (history.moves.length > 16) void import("./history.ts")' + D)
elif build == "X5b-query": seam('void import("./history.ts?v=2")' + D)
elif build == "X5b-computed": seam('void import(["./history", "ts"].join("."))' + D)
elif build == "X5c": seam('void import("./history.ts");')
elif build == "WDYNIMP":
    p = pathlib.Path(tree, "src/history-pane.ts"); p.write_text(p.read_text() + '\nvoid import("./history.ts");\n')
elif build == "WINDIRECT":
    rep("src/glyph-mode.ts", 'import type { GlyphMode } from "./render.ts";', 'import "./history.ts";\nimport type { GlyphMode } from "./render.ts";')
elif build == "WGLYPH-DYN":
    p = pathlib.Path(tree, "src/glyph-mode.ts"); p.write_text(p.read_text() + '\nvoid import("./history.ts");\n')
elif build == "INLINE-TYPE":
    rep("src/history-pane.ts", 'import type { GameHistory } from "./history.ts";', 'import { type GameHistory } from "./history.ts";')
elif build == "SECOND-COMPOSER":
    rep("src/cli-options.ts", 'import type { GlyphFlags } from "./glyph-mode.ts";', 'import { assembleFrame } from "./frame.ts";\nimport type { GlyphFlags } from "./glyph-mode.ts";')
# A3b controls: builds of the PROBE, on an unmutated production tree
elif build == "CTRL-NO-FRAME":
    rep(P, "rows: seam(history, statuses[index], false, []).length", "rows: 0")
elif build == "CTRL-NO-FRAMES-AT-ALL":
    rep(P, "const frames = games.map(", "const frames = [].map(")
elif build == "CTRL-EMPTY-ONLY+X5b-CONDITIONAL":
    seam('if (history.moves.length > 16) void import("./history.ts")' + D)
    rep(P, "const frames = games.map(", "const frames = games.slice(0, 1).map(")
elif build == "CTRL-ZERO-SETTLE+X5b":
    seam('void import("./history.ts")' + D)
    rep(P, "turn < 3; turn++", "turn < 0; turn++")
elif build == "CTRL-NO-COMPOSER":
    rep("src/render-seam.ts", 'import { assembleFrame } from "./frame.ts";', 'import * as frameNs from "./frame.ts";\nconst { assembleFrame } = { assembleFrame: frameNs.assembleFrame };')
elif build == "X5b-CONDITIONAL-nodigit": seam('if (history.moves.length > "abcdefghijklmnop".length) void import("./history.ts")' + D)
elif build == "X5b-query-nodigit": seam('void import("./history.ts?v=x")' + D)
elif build.startswith("X5b-rep"): seam('void import("./history.ts")' + D)
elif build == "CTRL-ROOT-STOPS-COMPOSING":
    rep("src/render-seam.ts", 'import { assembleFrame } from "./frame.ts";', 'import type { FrameParts } from "./frame.ts";\nconst assembleFrame = (parts: FrameParts, _mode: GlyphMode): string[] => [...parts.board];')
elif build == "DIAG-EMPTY-ONLY-UNGUARDED+X5b-CONDITIONAL-nodigit":
    seam('if (history.moves.length > "abcdefghijklmnop".length) void import("./history.ts")' + D)
    rep(P, "const frames = games.map(", "const frames = games.slice(0, 1).map(")
    rep(P, ").toEqual([0, LONG_FRAME_PLIES]);", ").toEqual([0]);")
else: raise SystemExit("unknown build " + build)
