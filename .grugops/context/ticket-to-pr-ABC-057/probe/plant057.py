# ABC-057 — plant ONE build into a git-archive copy. Usage: plant057.py <tree> <build>
# AR-053-ORDER controls (Q-CTRL-*) are delegated, unchanged, to QE's qe-ABC-053/probe/plant.py.
import sys, pathlib, subprocess
tree, b = sys.argv[1], sys.argv[2]
SRC = pathlib.Path(tree, "src")
P = "history-pane.nfr.test.ts"
GUARD = "    expect(runtimeImporters).toEqual(production.filter((file) => LICENSED_DRIVERS.includes(file)));"
def edit(rel, old, new):
    p = SRC / rel; s = p.read_text()
    assert s.count(old) == 1, (b, rel, old[:70], s.count(old))
    p.write_text(s.replace(old, new))
def m15():   # QE's M15 as written at quality-gate-ABC-042
    edit(P, "\n" + GUARD + "\n", "\n    expect(production.filter((file) => LICENSED_DRIVERS.includes(file))).toEqual(expect.arrayContaining(runtimeImporters));\n")
if b == "CONTROL": pass
elif b == "M15": m15()
elif b == "M15-SUB":  # the other direction: unlicensed importer allowed
    edit(P, "\n" + GUARD + "\n", "\n    expect(runtimeImporters).toEqual(expect.arrayContaining(production.filter((file) => LICENSED_DRIVERS.includes(file))));\n")
elif b == "NAIVE+M15":  # the ticket's literal shape without the newline framing: does it self-match?
    edit(P, '      "\\n    expect(runtimeImporters).toEqual(production.filter((file) => LICENSED_DRIVERS.includes(file)));\\n",',
            '      "expect(runtimeImporters).toEqual(production.filter((file) => LICENSED_DRIVERS.includes(file)));",')
    m15()
elif b == "WLAUNDER":
    p = SRC / "zobrist.ts"; p.write_text(p.read_text() + '\nexport { repetitionCounts } from "./history.ts";\n')
    p = SRC / "perft.ts"; p.write_text('import { repetitionCounts } from "./zobrist.ts";\nvoid repetitionCounts;\n' + p.read_text())
elif b == "WPERFT-STATIC":
    p = SRC / "perft-bench.ts"; p.write_text('import { newGame } from "./history.ts";\n' + p.read_text())
elif b == "WSTALELICENCE":  # the loop stops importing history.ts at runtime
    edit("turn-loop.ts", 'import { type GameHistory, gameStatusOf, keyHistory, playMove, takeBack } from "./history.ts";',
         'import type { GameHistory } from "./history.ts";')
elif b.startswith("Q-CTRL-"):
    qe = sys.argv[3]
    sys.exit(subprocess.run([sys.executable, "-I", qe, tree, b]).returncode)
else: raise SystemExit("unknown build " + b)
