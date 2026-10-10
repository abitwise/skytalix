# QE ABC-054 — plant ONE build into a git-archive copy. Usage: plantqe.py <tree> <build>
# QE's own spellings (independent of the Engineer's plant054.py). Seam edits are digit-free so
# render-seam.test.ts A3's /\d/ row cannot take the kill. Builds not named here are delegated to
# QE-053's plant.py, unchanged (path given in env QE053_PLANT).
import os, sys, pathlib, subprocess
tree, build = sys.argv[1], sys.argv[2]
SRC = pathlib.Path(tree, "src")


def edit(rel, old, new):
    p = SRC / rel
    s = p.read_text()
    assert s.count(old) == 1, (build, rel, old[:60], s.count(old))
    p.write_text(s.replace(old, new))


def append(rel, text):
    p = SRC / rel
    p.write_text(p.read_text() + text)


SEAM_IMPORT = 'import { type GlyphMode, type Orientation, renderBoard } from "./render.ts";'
CALL = "board: renderBoard(history.position"


def x3b(render_import):
    """A second board implementation; render.ts keeps only what `render_import` binds."""
    src = (SRC / "render.ts").read_text()
    assert src.count("export function renderBoard(") == 1
    (SRC / "board-copy.ts").write_text(src.replace("export function renderBoard(", "export function renderBoardCopy("))
    # the copy's import goes in biome's sorted position, so lint judges the spelling, not the order
    edit("render-seam.ts", 'import { assembleFrame } from "./frame.ts";',
         'import { renderBoardCopy } from "./board-copy.ts";\nimport { assembleFrame } from "./frame.ts";')
    edit("render-seam.ts", SEAM_IMPORT, render_import)
    edit("render-seam.ts", CALL, "board: renderBoardCopy(history.position")


ALLTYPE = 'import { type GlyphMode, type Orientation } from "./render.ts";'
b = build
if b == "BASE":
    pass
# ---- A2: X3b and its spellings ----
elif b == "QX3b": x3b(ALLTYPE)
elif b == "QX3b-TYPEONLY": x3b('import type { GlyphMode, Orientation } from "./render.ts";')
elif b == "QX3b-MULTILINE": x3b('import {\n  type GlyphMode,\n  type Orientation,\n} from "./render.ts";')
elif b == "QX3b-BARE": x3b('import "./render.ts";\n' + ALLTYPE)
# ---- over-count probes on X3b (instrument text vs value bindings) ----
elif b == "QX3b-O1-BLOCKCOMMENT": x3b('import { /* renderBoard */ type GlyphMode, type Orientation } from "./render.ts";')
elif b == "QX3b-O2-LINECOMMENT": x3b('import {\n  type GlyphMode, // renderBoard is now board-copy\n  type Orientation,\n} from "./render.ts";')
elif b == "QX3b-O6-COMMENTED-SPECIFIER": x3b('import {\n  type GlyphMode,\n  type Orientation,\n  // renderBoard,\n} from "./render.ts";')
elif b == "QX3b-O3-TYPE-NOSPACE": x3b('import type{ GlyphMode, Orientation } from "./render.ts";')
elif b == "QX3b-O4-COMMENTED-IMPORT":
    x3b(ALLTYPE)
    edit("render-seam.ts", ALLTYPE, ALLTYPE + '\n/*\nimport { renderBoard } from "./render.ts";\n*/')
elif b == "QX3b-O4b-TYPEONLY-COMMENTED-IMPORT":
    x3b('import type { GlyphMode, Orientation } from "./render.ts";\n/*\nimport { renderBoard } from "./render.ts";\n*/')
# ---- ADR-0030 C1: a value bound, never called ----
elif b == "QC1-VOID":
    src = (SRC / "render.ts").read_text()
    (SRC / "board-copy.ts").write_text(src.replace("export function renderBoard(", "export function renderBoardCopy("))
    edit("render-seam.ts", 'import { assembleFrame } from "./frame.ts";',
         'import { renderBoardCopy } from "./board-copy.ts";\nimport { assembleFrame } from "./frame.ts";')
    edit("render-seam.ts", 'import type { RenderSeam } from "./turn-loop.ts";\n',
         'import type { RenderSeam } from "./turn-loop.ts";\n\nvoid renderBoard;\n')
    edit("render-seam.ts", CALL, "board: renderBoardCopy(history.position")
# ---- no false red on legitimate spellings ----
elif b == "QOK-ALIAS":
    edit("render-seam.ts", SEAM_IMPORT, 'import { type GlyphMode, type Orientation, renderBoard as drawBoard } from "./render.ts";')
    edit("render-seam.ts", CALL, "board: drawBoard(history.position")
elif b == "QOK-MULTILINE":
    edit("render-seam.ts", SEAM_IMPORT, 'import {\n  type GlyphMode,\n  type Orientation,\n  renderBoard,\n} from "./render.ts";')
elif b == "QOK-TYPE-PLUS-NAMESPACE":
    edit("render-seam.ts", SEAM_IMPORT, 'import type { GlyphMode, Orientation } from "./render.ts";\nimport * as boardModule from "./render.ts";')
    edit("render-seam.ts", CALL, "board: boardModule.renderBoard(history.position")
# ---- composer tripwire: spellings it does not count (code byte-identical to base) ----
elif b == "QF-DEFAULT":
    edit("cli-options.ts", 'import type { GlyphFlags } from "./glyph-mode.ts";',
         'import assembleFrame from "./frame.ts";\nimport type { GlyphFlags } from "./glyph-mode.ts";')
    append("cli-options.ts", "\nexport const composeAlso = assembleFrame;\n")
elif b == "QF-DEFAULT+EXPORT":
    append("frame.ts", "\nexport default assembleFrame;\n")
    edit("cli-options.ts", 'import type { GlyphFlags } from "./glyph-mode.ts";',
         'import assembleFrame from "./frame.ts";\nimport type { GlyphFlags } from "./glyph-mode.ts";')
    append("cli-options.ts", "\nexport const composeAlso = assembleFrame;\n")
elif b == "QF-COMMENT":
    edit("cli-options.ts", 'import type { GlyphFlags } from "./glyph-mode.ts";',
         'import { /* composer */ assembleFrame } from "./frame.ts";\nimport type { GlyphFlags } from "./glyph-mode.ts";')
    append("cli-options.ts", "\nexport const composeAlso = assembleFrame;\n")
elif b == "QF-STATIC":
    edit("cli-options.ts", 'import type { GlyphFlags } from "./glyph-mode.ts";',
         'import { assembleFrame } from "./frame.ts";\nimport type { GlyphFlags } from "./glyph-mode.ts";')
    append("cli-options.ts", "\nexport const composeAlso = assembleFrame;\n")
# ---- mutants of the instrument itself (render-seam.test.ts) ----
elif b.startswith("M-"):
    T = "render-seam.test.ts"
    if b == "M-NO-CLAUSE-TYPE": edit(T, "    if (/^type\\s/.test(clause)) return false;\n", "")
    elif b == "M-NO-SPEC-TYPE": edit(T, '.some((specifier) => specifier !== "" && !/^type\\s/.test(specifier));', '.some((specifier) => specifier !== "");')
    elif b == "M-NO-OUTSIDE": edit(T, '    if (outsideBraces !== "") return true;\n', "")
    elif b == "M-EVERY": edit(T, '.some((specifier) => specifier !== ""', '.every((specifier) => specifier !== ""')
    elif b == "M-FIRST-STATEMENT-ONLY": edit(T, '  ].some(([, clause = ""]) => {', '  ].slice(0, 1).some(([, clause = ""]) => {')
    elif b == "M-SINGLE-LINE": edit(T, '`^import\\\\s+([^;"]*?)', '`^import\\\\s+([^;"\\\\n]*?)')
    elif b == "M-ALLOW-EXPORT": edit(T, '`^import\\\\s+([^;"]*?)', '`^(?:import|export)\\\\s+([^;"]*?)')
    elif b == "M-NO-TRIM": edit(T, "      .map((specifier) => specifier.trim())\n", "")
    elif b == "M-TYPE-NO-WS": edit(T, '!/^type\\s/.test(specifier)', '!/^type/.test(specifier)')
    elif b == "M-OLD-REGEX":
        edit(T, "const bindsAValueFrom = (source: string, target: string): boolean =>\n  [",
             "const bindsAValueFrom = (source: string, target: string): boolean =>\n  new RegExp(\n    `^(?:import|export)\\\\s+(?!type\\\\b)(?:[^;]*from\\\\s+)?\"\\\\./${target.replace(\".\", \"\\\\.\")}\";`,\n    \"m\",\n  ).test(source) || [")
    elif b == "M-A8-SELF":  # A8's loop drops the file !== target guard
        edit(T, "productionModules().filter((file) => file !== target && bindsAValueFrom(", "productionModules().filter((file) => bindsAValueFrom(")
    else: raise SystemExit("unknown mutant " + b)
else:
    subprocess.run([sys.executable, "-I", os.environ["QE053_PLANT"], tree, b], check=True)
