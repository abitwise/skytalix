# QE ABC-053 — plant ONE build into a git-archive copy. Usage: plant.py <tree> <build>
# Spellings are QE's own (independent of the Engineer's mutate.py). Seam edits are DIGIT-FREE so
# render-seam.test.ts A3's /\d/ row cannot take the kill instead of the assertion under test.
import sys, pathlib
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


def everywhere(old, new):
    n = 0
    for p in SRC.glob("*.ts"):
        s = p.read_text()
        if old in s:
            n += s.count(old)
            p.write_text(s.replace(old, new))
    assert n > 0, (build, old)


def seam(stmt, extra_import=None):
    """Put `stmt` inside the seam's RETURNED closure, before the frame is composed."""
    edit("render-seam.ts",
         "  return (history, status, thinking, messages) =>\n    assembleFrame(",
         "  return (history, status, thinking, messages) => {\n    " + stmt + "\n    return assembleFrame(")
    edit("render-seam.ts", "      mode,\n    );\n}", "      mode,\n    );\n  };\n}")
    if extra_import:
        edit("render-seam.ts", 'import { assembleFrame } from "./frame.ts";',
             'import { assembleFrame } from "./frame.ts";\n' + extra_import)


def pane(stmt):
    """Put `stmt` at the top of history-pane.ts renderHistory (a frame producer, digits allowed)."""
    edit("history-pane.ts", "export function renderHistory(history: GameHistory): string[] {\n",
         "export function renderHistory(history: GameHistory): string[] {\n  " + stmt + "\n")


DERIVE = '.then((h) => h.gameStatusOf(history))'
LOAD = 'import("./history.ts")'
P = "history-pane.nfr.test.ts"
# probe-string anchors (inside the template literal in the probe test)
HOOK = "registerHooks({ load(url, context, nextLoad) { loaded.push(url); return nextLoad(url, context); } });"
AFTER_LOAD = "const closure = seen();\n"
ARMING = "      loaded = [];\n      await import(arming);\n"

def nested_immediate(depth, inner):
    s = inner
    for _ in range(depth):
        s = "setImmediate(() => { " + s + " });"
    return s

b = build
if b == "BASE":
    pass
# ---- ADR-0029's ledger, rebuilt (QE spellings) ----
elif b == "X5b": seam("void " + LOAD + DERIVE + ";")
elif b == "X5b-CONDITIONAL":
    seam("if (history.moves.length > HISTORY_ROWS + HISTORY_ROWS) void " + LOAD + DERIVE + ";")
    edit("render-seam.ts", 'import { renderHistory } from "./history-pane.ts";',
         'import { HISTORY_ROWS, renderHistory } from "./history-pane.ts";')
elif b == "X5b-query": seam('void import("./history.ts?nocache")' + DERIVE + ";")
elif b == "X5b-computed": seam('void import(`./${"history"}.ts`)' + DERIVE + ";")
elif b == "X5c": seam("void " + LOAD + ";")
elif b == "WDYNIMP": append("history-pane.ts", "\nvoid " + LOAD + ";\n")
elif b == "WINDIRECT":
    edit("glyph-mode.ts", 'import type { GlyphMode } from "./render.ts";',
         'import "./history.ts";\nimport type { GlyphMode } from "./render.ts";')
elif b == "WGLYPH-DYN": append("glyph-mode.ts", "\nvoid " + LOAD + ";\n")
elif b == "INLINE-TYPE":
    edit("history-pane.ts", 'import type { GameHistory } from "./history.ts";',
         'import { type GameHistory } from "./history.ts";')
elif b == "SECOND-COMPOSER":
    edit("cli-options.ts", 'import type { GlyphFlags } from "./glyph-mode.ts";',
         'import { assembleFrame } from "./frame.ts";\nimport type { GlyphFlags } from "./glyph-mode.ts";')
# ---- QE mutants: ply-41 producer ----
elif b == "Q-PLY41-PANE": pane("if (history.moves.length >= 41) void " + LOAD + DERIVE + ";")
elif b == "Q-PLY40-PANE": pane("if (history.moves.length >= 40) void " + LOAD + DERIVE + ";")
elif b == "Q-PLY17-PANE": pane("if (history.moves.length >= 17) void " + LOAD + DERIVE + ";")
elif b == "Q-PANE-X5b": pane("void " + LOAD + DERIVE + ";")
elif b == "Q-STATUS-X5b":
    edit("status-panel.ts", "  const position = history.position;\n  const side =",
         "  void " + LOAD + DERIVE + ";\n  const position = history.position;\n  const side =")
# ---- QE mutants: composers ----
elif b.startswith("Q-COMPOSER-"):
    spell = {
        "Q-COMPOSER-NAMESPACE": 'import * as frameModule from "./frame.ts";',
        "Q-COMPOSER-ALIAS": 'import { assembleFrame as compose } from "./frame.ts";',
        "Q-COMPOSER-TYPE-FIRST": 'import { type FrameParts, assembleFrame } from "./frame.ts";',
        "Q-COMPOSER-MULTILINE": 'import {\n  type FrameParts,\n  assembleFrame,\n} from "./frame.ts";',
        "Q-COMPOSER-SINGLEQUOTE": "import { assembleFrame } from './frame.ts';",
        "Q-COMPOSER-DYNAMIC": None,
        "Q-COMPOSER-REEXPORT": None,
        "Q-COMPOSER-NEG-ALLTYPE": 'import { type FrameParts } from "./frame.ts";',
        "Q-COMPOSER-NEG-OTHERVALUE": 'import { frameHeight } from "./frame.ts";',
    }[b]
    if b == "Q-COMPOSER-DYNAMIC":
        append("cli-options.ts", '\nexport const composeLater = async () => (await import("./frame.ts")).assembleFrame;\n')
    elif b == "Q-COMPOSER-REEXPORT":
        append("cli-options.ts", '\nexport { assembleFrame } from "./frame.ts";\n')
        edit("glyph-mode.ts", 'import type { GlyphMode } from "./render.ts";',
             'import { assembleFrame } from "./cli-options.ts";\nimport type { GlyphMode } from "./render.ts";\nexport const composeVia = assembleFrame;')
    else:
        edit("cli-options.ts", 'import type { GlyphFlags } from "./glyph-mode.ts";',
             spell + '\nimport type { GlyphFlags } from "./glyph-mode.ts";')
# ---- QE mutants: root renames ----
elif b == "Q-ROOT-RENAME":
    (SRC / "render-seam.ts").rename(SRC / "frame-seam.ts")
    everywhere('"./render-seam.ts"', '"./frame-seam.ts"')
elif b == "Q-ROOT-RENAME-FULL":
    (SRC / "render-seam.ts").rename(SRC / "frame-seam.ts")
    everywhere('"./render-seam.ts"', '"./frame-seam.ts"')
    edit(P, 'const COMPOSITION_ROOT = "render-seam.ts";', 'const COMPOSITION_ROOT = "frame-seam.ts";')
elif b == "Q-FACTORY-RENAME": everywhere("makeRenderSeam", "buildRenderSeam")
elif b == "Q-FACTORY-RENAME-PROD":
    # rename in production + its static importers' tests, but NOT in the probe's child string
    for rel in ("render-seam.ts", "cli.ts", "render-seam.test.ts", "cli.test.ts"):
        p = SRC / rel; p.write_text(p.read_text().replace("makeRenderSeam", "buildRenderSeam"))
# ---- QE mutants: settle depth ----
elif b == "Q-SETTLE-NEXTTICK": seam("process.nextTick(() => void " + LOAD + ");")
elif b == "Q-SETTLE-MICROCHAIN":
    seam("let chain = Promise.resolve();\n    for (const _ of history.moves) chain = chain.then(() => undefined);\n    void chain.then(() => " + LOAD + ");")
elif b.startswith("Q-SETTLE-IMM"):
    depth = {"Q-SETTLE-IMM1": 1, "Q-SETTLE-IMM2": 2, "Q-SETTLE-IMM3": 3, "Q-SETTLE-IMM4": 4, "Q-SETTLE-IMM5": 5}[b.split("+")[0]]
    seam(nested_immediate(depth, "void " + LOAD + ";"))
    if b.endswith("+ZERO"): edit(P, "turn < 3; turn++", "turn < 0; turn++")
elif b.startswith("Q-SETTLE-TIMEOUT-NODELAY"): seam("setTimeout(() => void " + LOAD + ");")
elif b == "Q-SETTLE-TIMEOUT-50": pane("setTimeout(() => void " + LOAD + ", 50);")
elif b == "Q-ZERO-SETTLE+X5b":
    seam("void " + LOAD + DERIVE + ";")
    edit(P, "turn < 3; turn++", "turn < 0; turn++")
# ---- QE mutants: states the frames do not reach (not game states) ----
elif b == "Q-UNICODE-ONLY": seam('if (mode === "unicode") void ' + LOAD + DERIVE + ";")
elif b == "Q-BLACK-BOTTOM-ONLY": seam('if (orientation === "black-bottom") void ' + LOAD + DERIVE + ";")
elif b == "Q-THINKING-ONLY": seam("if (thinking) void " + LOAD + DERIVE + ";")
elif b == "Q-MESSAGES-ONLY": seam("if (messages.length) void " + LOAD + DERIVE + ";")
elif b == "Q-CLAIMABLE-ONLY": seam('if ("claimable" in status) void ' + LOAD + DERIVE + ";")
# ---- QE mutants: docblock case 3 (derive rebuilt from modules other than history.ts) ----
elif b == "Q-REDERIVE-GAMESTATUS":
    seam("void gameStatus(history.position);", 'import { gameStatus } from "./gameend.ts";')
elif b == "Q-REDERIVE-REPLAY":
    seam("const replay = parseFen(history.initialFen);\n    const counts = new Map<bigint, bigint[]>();\n"
         "    for (const move of history.moves) {\n      makeMove(replay, move);\n      const key = zobristKey(replay);\n"
         "      counts.set(key, [...(counts.get(key) ?? []), key]);\n    }",
         'import { makeMove } from "./apply.ts";\nimport { parseFen } from "./fen.ts";\nimport { zobristKey } from "./zobrist.ts";')
# ---- QE mutants: docblock case 4 (a composer that never calls assembleFrame) ----
elif b == "Q-ROWS-WITHOUT-ASSEMBLE":
    append("cli-options.ts", '\nimport { renderBoard as drawBoard } from "./render.ts";\n'
           'export const rowsWithoutAssemble = (h: { position: Parameters<typeof drawBoard>[0] }) => [...drawBoard(h.position, "ascii", "white-bottom")];\n')
# ---- QE mutants: instrument blind spot (a specifier already loaded before the clear) ----
elif b == "Q-FIXTURE-SPECIFIER": seam('void import("./history.ts?fixture")' + DERIVE + ";")
# ---- QE mutants: probe integrity (A3b iii) ----
elif b == "Q-CTRL-DEAF-AFTER-LOAD+X5b":
    seam("void " + LOAD + DERIVE + ";")
    edit(P, HOOK, HOOK.replace("loaded.push(url);", "if (!globalThis.deaf) loaded.push(url);"))
    edit(P, AFTER_LOAD, AFTER_LOAD + "      globalThis.deaf = true;\n")
elif b == "Q-CTRL-ARMING-FIRST+DEAF+X5b":
    seam("void " + LOAD + DERIVE + ";")
    edit(P, HOOK, HOOK.replace("loaded.push(url);", "if (!globalThis.deaf) loaded.push(url);"))
    edit(P, ARMING, "")
    edit(P, AFTER_LOAD, AFTER_LOAD + "      loaded = [];\n      await import(arming);\n      const armedEarly = seen();\n      globalThis.deaf = true;\n")
    edit(P, "armed: seen() }", "armed: armedEarly }")
else:
    raise SystemExit("unknown build " + b)
