# QE ABC-134 A2 replay-rebuild placements. Usage: plant-a2.py <variant> <srcdir> <origdir>
import sys
v, d, o = sys.argv[1:4]
def rd(n): return open(f"{o}/{n}.orig.ts").read()
def wr(n, s): open(f"{d}/src/{n}.ts", "w").write(s)
ZI = 'import { zobristKey } from "./zobrist.ts";\n'
if v == "PANE-REUSE":  # count keys along the pane's OWN replay: no extra parseFen
    s = rd("history-pane")
    s = s.replace('import { toSan } from "./san.ts";\n', 'import { toSan } from "./san.ts";\n' + ZI)
    s = s.replace("  const moves = history.moves;\n", "  const moves = history.moves;\n  const qeC = new Map<bigint, number>([[zobristKey(position), 1]]);\n  const qeT = (): void => { const k = zobristKey(position); qeC.set(k, (qeC.get(k) ?? 0) + 1); };\n")
    a = "  for (let ply = 0; ply < firstVisible; ply++) makeMove(position, moves[ply] as Move);\n"
    assert s.count(a) == 1
    s = s.replace(a, "  for (let ply = 0; ply < firstVisible; ply++) { makeMove(position, moves[ply] as Move); qeT(); }\n")
    b = "    makeMove(position, move);\n"
    assert s.count(b) == 1
    s = s.replace(b, "    makeMove(position, move);\n    qeT();\n")
    s = s.replace("  const rows = pairs.map(rowFor);\n", "  void qeC;\n  const rows = pairs.map(rowFor);\n")
    wr("history-pane", s)
REPLAY = "const qeP = parseFen(history.initialFen); const qeC = new Map<bigint, number>([[zobristKey(qeP), 1]]); for (const qeM of history.moves) { makeMove(qeP, qeM); const qeK = zobristKey(qeP); qeC.set(qeK, (qeC.get(qeK) ?? 0) + 1); } void qeC;"
IMPS = 'import { makeMove } from "./apply.ts";\nimport { parseFen } from "./fen.ts";\n' + ZI
if v == "SEAM":
    s = rd("render-seam")
    s = IMPS + s if not s.startswith("/**") else s.replace('import { assembleFrame } from "./frame.ts";\n', IMPS + 'import { assembleFrame } from "./frame.ts";\n')
    old = "  return (history, status, thinking, messages) =>\n    assembleFrame("
    assert s.count(old) == 1
    s = s.replace(old, "  return (history, status, thinking, messages) => {\n    " + REPLAY + "\n    return assembleFrame(")
    s = s.replace("      mode,\n    );\n}", "      mode,\n    );\n  };\n}")
    wr("render-seam", s)
if v == "STATUS":
    s = rd("status-panel")
    s = s.replace('import { toSan } from "./san.ts";\n', 'import { toSan } from "./san.ts";\n' + ZI)
    a = s.index("export function renderStatusPanel(")
    b = s.index("{\n", a) + 2
    s = s[:b] + "  " + REPLAY + "\n" + s[b:]
    wr("status-panel", s)
