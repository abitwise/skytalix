# QE ABC-057 — plant builds into a git-archive copy. Usage: plantqe057.py <tree> <build[+build...]>
# QE's own spellings, independent of the Engineer's plant057.py. Q-CTRL-* are delegated, unchanged,
# to qe-ABC-053/probe/plant.py (path in argv[3]).
import sys, pathlib, subprocess
tree, spec = sys.argv[1], sys.argv[2]
SRC = pathlib.Path(tree, "src")
P = "history-pane.nfr.test.ts"
LIC = "production.filter((file) => LICENSED_DRIVERS.includes(file))"
G = "    expect(runtimeImporters).toEqual(" + LIC + ");"
HP = '    expect(readFileSync(`${directory}history-pane.ts`, "utf8")).toContain(\n      \'import type { GameHistory } from "./history.ts";\',\n    );\n'
LHS_END = '        readFileSync(`${directory}${file}`, "utf8"),\n      ),\n    );\n'


def edit(rel, old, new, count=1):
    p = SRC / rel
    s = p.read_text()
    assert s.count(old) == count, (rel, old[:70], s.count(old))
    p.write_text(s.replace(old, new))


def guard(new):  # replace the comparator line (anchored on real newlines so the literal cannot match)
    edit(P, "\n" + G + "\n", "\n" + new + "\n")


def comp(spell):
    p = SRC / "cli-options.ts"
    edit("cli-options.ts", 'import type { GlyphFlags } from "./glyph-mode.ts";',
         spell + '\nimport type { GlyphFlags } from "./glyph-mode.ts";')
    p.write_text(p.read_text() + "\nexport const composeHere = compose;\n")


for b in ([spec] if spec.startswith("Q-CTRL-") else spec.split("+")):
    if b == "CONTROL":
        pass
    elif b == "FMT":  # the gate-clean spelling: biome's own formatter over the touched src files
        rc = subprocess.run(["node", "node_modules/@biomejs/biome/bin/biome", "format", "--write", "src"],
                            cwd=tree, capture_output=True).returncode
        assert rc == 0, ("FMT", rc)
    # ---- the operator: the ticket's A1 mutant and its mirror ----
    elif b == "M15":  # A1's text, verbatim
        guard("    expect(" + LIC + ").toEqual(expect.arrayContaining(runtimeImporters));")
    elif b == "M15SUB":
        guard("    expect(runtimeImporters).toEqual(expect.arrayContaining(" + LIC + "));")
    # ---- QE's own operator swaps ----
    elif b == "QSTRICT":
        guard("    expect(runtimeImporters).toStrictEqual(" + LIC + ");")
    elif b == "QMATCHOBJ":
        guard("    expect(runtimeImporters).toMatchObject(" + LIC + ");")
    elif b == "QSTRICT-AC":  # strict + containment, superset-of-licence direction
        guard("    expect(runtimeImporters).toStrictEqual(expect.arrayContaining(" + LIC + "));")
    elif b == "QMATCHOBJ-AC":  # matchObject + containment, licence-contains-importers direction
        guard("    expect(" + LIC + ").toMatchObject(expect.arrayContaining(runtimeImporters));")
    elif b == "QCONTAIN-EACH":  # containment spelled as a loop: every importer is licensed
        guard("    for (const file of runtimeImporters) expect(LICENSED_DRIVERS).toContain(file);")
    # ---- harmless reformatting of the comparator line ----
    elif b == "QWRAP":  # the same call, wrapped over three lines
        guard("    expect(runtimeImporters).toEqual(\n      " + LIC + ",\n    );")
    elif b == "QTRAIL-WS":
        guard(G + " ")
    elif b == "QPARAM":  # semantically identical, gate-clean rename of the arrow parameter
        guard("    expect(runtimeImporters).toEqual(production.filter((f) => LICENSED_DRIVERS.includes(f)));")
    elif b == "QCRLF":  # the whole file with CRLF line endings
        p = SRC / P
        p.write_bytes(p.read_bytes().replace(b"\r\n", b"\n").replace(b"\n", b"\r\n"))
    # ---- moved comparator ----
    elif b == "QMOVE-AFTER":  # same block, same indent, after the type-import assertion
        edit(P, "\n" + G + "\n" + HP, "\n" + HP + G + "\n")
    elif b == "QMOVE-NESTED":  # same assertion inside a block statement (indent 6)
        guard("    {\n  " + G + "\n    }")
    elif b == "QMOVE-UNREACHABLE":  # same text, same indent, after a return: never executed
        edit(P, "\n" + G + "\n" + HP, "\n" + HP + "    return;\n" + G + "\n")
    elif b == "QMOVE-COMMENTED-M15":  # weakened AND the original text kept in a block comment
        guard("    /*\n" + G + "\n    */\n    expect(" + LIC + ").toEqual(expect.arrayContaining(runtimeImporters));")
    # ---- operands outside both pinned lines ----
    elif b == "QLHS-INTERSECT":  # importers narrowed to the licence before the equality
        edit(P, LHS_END, '        readFileSync(`${directory}${file}`, "utf8"),\n      ),\n    ).filter((file) => LICENSED_DRIVERS.includes(file));\n')
    elif b == "QSCAN-NARROW":  # clause 1's scanned set narrowed at the guard
        edit(P, "    const production = productionModulesIn(directory);\n    const runtimeImporters",
             '    const production = productionModulesIn(directory).filter((file) => file !== "perft-bench.ts");\n    const runtimeImporters')
    # ---- the three witnesses (A2) ----
    elif b == "WLAUNDER":
        p = SRC / "zobrist.ts"
        p.write_text(p.read_text() + '\nexport { repetitionCounts } from "./history.ts";\n')
        edit("perft.ts", 'import { legalMoves } from "./legal.ts";',
             'import { legalMoves } from "./legal.ts";\nimport { repetitionCounts } from "./zobrist.ts";')
        p = SRC / "perft.ts"
        p.write_text(p.read_text() + "\nexport const launderedCounts = repetitionCounts;\n")
    elif b == "QWLAUNDER-CLIOPT":  # the same laundering through a module the A6 witnesses do not read
        p = SRC / "cli-options.ts"
        p.write_text(p.read_text() + '\nexport { repetitionCounts } from "./history.ts";\n')
        edit("perft.ts", 'import { legalMoves } from "./legal.ts";',
             'import { repetitionCounts } from "./cli-options.ts";\nimport { legalMoves } from "./legal.ts";')
        p = SRC / "perft.ts"
        p.write_text(p.read_text() + "\nexport const launderedCounts = repetitionCounts;\n")
    elif b == "WPERFT-STATIC":
        edit("perft-bench.ts", 'import { parseFen } from "./fen.ts";',
             'import { parseFen } from "./fen.ts";\nimport { gameStatusOf } from "./history.ts";')
        p = SRC / "perft-bench.ts"
        p.write_text(p.read_text() + "\nvoid gameStatusOf;\n")
    elif b == "WSTALELICENCE":
        edit("turn-loop.ts", 'import { type GameHistory, gameStatusOf, keyHistory, playMove, takeBack } from "./history.ts";',
             'import type { GameHistory } from "./history.ts";\n\nconst { gameStatusOf, keyHistory, playMove, takeBack } = await import("./history.ts");')
    # ---- the composer claim (QE-054-b fold-in) ----
    elif b == "QF-COMMENT":
        comp('import { /* composer */ assembleFrame as compose } from "./frame.ts";')
    elif b == "QF-COMMENT-AFTER-SEMI":
        comp('import { assembleFrame as compose /* a; b */ } from "./frame.ts";')
    elif b == "QF-STRING-NAME":
        comp('import { "assembleFrame" as compose } from "./frame.ts";')
    elif b == "QF-DEFAULT-AS":
        comp('import { default as compose } from "./frame.ts";')
    elif b == "QF-ALIAS":  # control: begins with the name -> counted
        comp('import { assembleFrame as compose } from "./frame.ts";')
    elif b == "QF-NAMESPACE":  # control: namespace -> counted
        comp('import * as frameModule from "./frame.ts";\nconst compose = frameModule.assembleFrame;')
    elif b.startswith("Q-CTRL-"):
        qe = sys.argv[3]
        rc = subprocess.run([sys.executable, "-I", qe, tree, b]).returncode
        if rc:
            sys.exit(rc)
    else:
        raise SystemExit("unknown build " + b)
