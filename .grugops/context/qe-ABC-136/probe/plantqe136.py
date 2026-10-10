# QE ABC-136 — QE's own operand narrowings beyond QSCAN-NARROW / QLHS-INTERSECT.
# Usage: plantqe136.py <tree> <build[+build...]>. Tokens starting "X" are planted here; every other
# token is delegated, one at a time and in order, to QE-057's planter (plantqe057.py, same dir).
import sys, pathlib, subprocess
tree, spec = sys.argv[1], sys.argv[2]
HERE = pathlib.Path(__file__).parent
SRC = pathlib.Path(tree, "src")
P = "history-pane.nfr.test.ts"
SCAN = "\n    const production = productionModulesIn(directory);\n    const runtimeImporters = production.filter((file) =>\n"
DIR_SCAN = '\n    const directory = new URL(".", import.meta.url).pathname;\n    const production = productionModulesIn(directory);\n'
LHS_END = '        readFileSync(`${directory}${file}`, "utf8"),\n      ),\n    );\n'
TOEQ = "    expect(runtimeImporters).toEqual(production.filter((file) => LICENSED_DRIVERS.includes(file)));\n"
HELPER = '  readdirSync(directory).filter((file) => file.endsWith(".ts") && !file.endsWith(".test.ts"));\n'
LICIT_END = "      'import type { GameHistory } from \"./history.ts\";',\n    );\n  });\n"


def edit(old, new, count=1):
    p = SRC / P
    s = p.read_text()
    assert s.count(old) == count, (old[:70], s.count(old))
    p.write_text(s.replace(old, new))


def before_scan(lines):  # insert statements between `const directory` and the framed scan pair
    edit(DIR_SCAN, DIR_SCAN.replace("\n    const production", "\n" + lines + "\n    const production"))


for b in spec.split("+"):
    if b == "XSPLICE":  # moved statement: narrow the importer set IN PLACE after its pinned statement
        edit(LHS_END, LHS_END + "    runtimeImporters.splice(0, runtimeImporters.length, ...runtimeImporters.filter((file) => LICENSED_DRIVERS.includes(file)));\n")
    elif b == "XSHADOW-HELPER":  # renamed/shadowed binding: a local productionModulesIn that narrows
        before_scan('    const productionModulesIn = (path: string): readonly string[] =>\n'
                    '      readdirSync(path).filter((file) => file.endsWith(".ts") && !file.endsWith(".test.ts") && file !== "perft-bench.ts");')
    elif b == "XHELPER-NARROW":  # clause 1's helper itself narrowed (module scope, shared by both guards)
        edit(HELPER, HELPER.replace('!file.endsWith(".test.ts"))', '!file.endsWith(".test.ts") && file !== "perft-bench.ts")'))
    elif b == "XSHADOW-READ":  # shadowed readFileSync: the importer statement reads an edited source
        edit('import { readdirSync, readFileSync } from "node:fs";',
             'import { readdirSync, readFileSync, readFileSync as readText } from "node:fs";')
        before_scan('    const readFileSync = (path: string, encoding: "utf8"): string =>\n'
                    '      path.endsWith("perft-bench.ts") ? "" : readText(path, encoding);')
    elif b == "XDIR-NARROW":  # the unpinned `directory` line narrowed to a subdirectory
        edit(DIR_SCAN, DIR_SCAN.replace('new URL(".",', 'new URL("./__snapshots__/",'))
    elif b == "XLICENCE-PUSH":  # the licence widened in place inside the guard (not an operand; RHS side)
        before_scan('    (LICENSED_DRIVERS as string[]).push("perft-bench.ts");')
    elif b == "XRENAME-PRODUCTION":  # harmless rename of the scanned-set binding across the guard
        p = SRC / P
        s = p.read_text()
        a = s.index(SCAN)
        z = s.index(TOEQ, a) + len(TOEQ)
        assert s.count(SCAN) == 1 and s.count(TOEQ) == 1
        p.write_text(s[:a] + s[a:z].replace("production", "modules") + s[z:])
    elif b == "XRENAME-SCAN":  # narrowing through a renamed intermediate binding
        edit(SCAN, '\n    const allModules = productionModulesIn(directory);\n    const production = allModules.filter((file) => file !== "perft-bench.ts");\n    const runtimeImporters = production.filter((file) =>\n')
    elif b == "XSCAN-SLICE":  # another narrowing form on the scan line
        edit(SCAN, SCAN.replace("productionModulesIn(directory);", "productionModulesIn(directory).slice(0, -1);"))
    elif b == "XLHS-AND":  # another .filter form inside the importer statement
        edit(LHS_END, '        readFileSync(`${directory}${file}`, "utf8"),\n      ) && file !== "perft-bench.ts",\n    );\n')
    elif b == "XDEAD-COPY":  # QSCAN-NARROW live, the pinned pair kept verbatim in an uncalled function
        edit(SCAN, SCAN.replace("productionModulesIn(directory);", 'productionModulesIn(directory).filter((file) => file !== "perft-bench.ts");'))
        edit(LICIT_END, LICIT_END + "\n  const _pinnedGuardCopy = (directory: string) => {"
             + SCAN + '      /x/.test(directory),\n    );\n    return runtimeImporters;\n  };\n')
    elif b == "XDEAD-COPY2":  # QSCAN-NARROW live; the guard's two pinned statements kept VERBATIM in an uncalled helper
        edit(SCAN, SCAN.replace("productionModulesIn(directory);", 'productionModulesIn(directory).filter((file) => file !== "perft-bench.ts");'))
        edit(LICIT_END, LICIT_END + "\n  const _pinnedGuardCopy = (directory: string) => {"
             + SCAN + '      /^(?:import|export)\\s+(?!type\\b)(?:[^;]*from\\s+)?"\\.\\/history\\.ts";/m.test(\n'
             + LHS_END + "    return runtimeImporters;\n  };\n")
    elif b == "XNOIGNORE":  # the biome-ignore line removed
        edit("      // biome-ignore lint/suspicious/noTemplateCurlyInString: this string IS source, and `${` is its subject\n", "")
    elif b == "XIGNORE-LEAK":  # a second ${-in-string inside the same `it`, right after the ignored literal
        edit("\n    );\n  });\n\n  it(\"A6.3", "\n    );\n    expect(instrument).not.toContain('${nothing}');\n  });\n\n  it(\"A6.3")
    elif b in ("XDROP-SCANPIN", "XDROP-LHSPIN"):  # pin isolation: delete ONE of the two new pins
        p = SRC / P
        s = p.read_text()
        msg = "scans EVERY production module" if b == "XDROP-SCANPIN" else "compares EVERY runtime importer"
        a = s.index('    expect(instrument, "the licence guard ' + msg)
        z = s.index("\n    );\n", a) + len("\n    );\n")
        p.write_text(s[:a] + s[z:])
    elif b.startswith("X"):
        raise SystemExit("unknown build " + b)
    else:
        rc = subprocess.run([sys.executable, "-I", str(HERE / "plantqe057.py"), tree, b, "none"]).returncode
        if rc:
            sys.exit(rc)
