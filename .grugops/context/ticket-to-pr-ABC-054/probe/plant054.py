# ABC-054 SE — plant one build into a git-archive copy. Usage: plant054.py <tree> <build>[+PRINT]
# X3b: QE's recipe (quality-gate-ABC-041 / ADR-0030 M4). +PRINT: the A8 test logs runtimeConsumersOf.
# Anything else is delegated to QE's ABC-053 plant.py, unchanged.
import sys, pathlib, subprocess
tree, build = sys.argv[1], sys.argv[2]
SRC = pathlib.Path(tree, "src")
def edit(rel, old, new):
    p = SRC / rel; s = p.read_text()
    assert s.count(old) == 1, (build, rel, old[:60], s.count(old)); p.write_text(s.replace(old, new))
parts = build.split("+PRINT")
b = parts[0]
if b == "X3b":
    src = (SRC / "render.ts").read_text()
    assert src.count("export function renderBoard(") == 1
    (SRC / "board-two.ts").write_text(src.replace("export function renderBoard(", "export function renderBoardTwo("))
    edit("render-seam.ts", 'import { type GlyphMode, type Orientation, renderBoard } from "./render.ts";',
         'import { renderBoardTwo } from "./board-two.ts";\nimport { type GlyphMode, type Orientation } from "./render.ts";')
    edit("render-seam.ts", "board: renderBoard(history.position", "board: renderBoardTwo(history.position")
elif b != "BASE":
    subprocess.run([sys.executable, "-I", str(pathlib.Path(__file__).with_name("plant.py")), tree, b], check=True)
if len(parts) > 1:
    p = SRC / "render-seam.test.ts"; s = p.read_text()
    for fn in ("runtimeConsumersOf", "runtimeImportersOf"):
        anchor = "    for (const target of [\"render.ts\", \"status-panel.ts\", \"history-pane.ts\"]) {\n      expect(" + fn
        if anchor in s:
            s = s.replace(anchor, "    for (const target of [\"render.ts\", \"status-panel.ts\", \"history-pane.ts\"]) {\n      console.log(\"A4-LIST\", target, JSON.stringify(" + fn + "(target)));\n      expect(" + fn, 1)
            break
    else:
        raise SystemExit("no A8 loop to print")
    p.write_text(s)
