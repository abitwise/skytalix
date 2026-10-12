#!/usr/bin/env python3
# qe-ABC-095 plants. Each plant is an exact-string edit (asserted to match exactly once) applied to a fresh copy of the tip
# tree (git archive 2307fc11) OUTSIDE the repository. Usage: python3 -I plants.py <copy root> <plant name>
import sys, pathlib
root, name = pathlib.Path(sys.argv[1]), sys.argv[2]
WARN = "    warn: (line) => process.stderr.write(`${line}\\n`),"
ENGINE = "      engine: withBook(book, createEngine({ budgetMs: DEFAULT_BUDGET_MS })),"
DECOR = "  return async (history) => probe.bookMove(history.position) ?? inner(history);"
READ = 'readFileSync(new URL("../data/opening-book/book.json", import.meta.url))'
CP = "  cpSync(join(REPOSITORY, COPIED_DIRECTORY), join(root, COPIED_DIRECTORY), { recursive: true });"
P = {
  "P0-control": [],
  "P1a-unwire-engine-line": [("src/cli.ts", ENGINE, "      engine: createEngine({ budgetMs: DEFAULT_BUDGET_MS }),")],
  "P2-always-searches": [("src/book-engine.ts", DECOR, "  return async (history) => {\n    probe.bookMove(history.position);\n    return inner(history);\n  };")],
  "P3-searches-and-returns-book": [("src/book-engine.ts", DECOR, "  return async (history) => {\n    const searched = await inner(history);\n    return probe.bookMove(history.position) ?? searched;\n  };")],
  "P4-warn-to-stdout": [("src/cli.ts", WARN, "    warn: (line) => process.stdout.write(`${line}\\n`),")],
  "P5-warn-twice": [("src/cli.ts", WARN, "    warn: (line) => process.stderr.write(`${line}\\n${line}\\n`),")],
  "P5b-warn-silent": [("src/cli.ts", WARN, "    warn: (_line) => true,")],
  "P6a-read-other-path": [("src/book-file.ts", READ, 'readFileSync(new URL("../data/opening-book/book-missing.json", import.meta.url))')],
  "P6b-read-cwd-relative": [("src/book-file.ts", READ, 'readFileSync("data/opening-book/book.json")')],
  "P7-probe-per-move": [("src/cli.ts", ENGINE, "      engine: (h) => withBook(createBookProbe({ read: readBookFile, warn: (line) => process.stderr.write(`${line}\\n`), random: Math.random }), createEngine({ budgetMs: DEFAULT_BUDGET_MS }))(h),")],
  "P8-copy-with-data": [("src/cli.real-engine.test.ts", CP, CP + '\n  cpSync(join(REPOSITORY, "data"), join(root, "data"), { recursive: true });')],
  "P9a-linked-src": [("src/cli.real-engine.test.ts", CP, "  symlinkSync(join(REPOSITORY, COPIED_DIRECTORY), join(root, COPIED_DIRECTORY));"),
                     ("src/cli.real-engine.test.ts", "  rmSync,\n} from \"node:fs\";", "  rmSync,\n  symlinkSync,\n} from \"node:fs\";")],
  "P9b-linked-book-file": [("src/cli.real-engine.test.ts", CP, CP + '\n  rmSync(join(root, "src", "book-file.ts"));\n  symlinkSync(join(REPOSITORY, "src", "book-file.ts"), join(root, "src", "book-file.ts"));'),
                           ("src/cli.real-engine.test.ts", "  rmSync,\n} from \"node:fs\";", "  rmSync,\n  symlinkSync,\n} from \"node:fs\";")],
  "P10a-deep-copy-not-removed": [("src/cli.real-engine.test.ts", "    if (copy !== undefined) removeCopy(copy);", "    if (copy !== undefined) void copy;")],
  "P10b-default-row-no-finally-plus-P8": [
      ("src/cli.real-engine.test.ts", "      expect(lstatSync(entryPointIn(root)).isFile()).toBe(true);\n    } finally {\n      removeCopy(root);\n    }",
       "      expect(lstatSync(entryPointIn(root)).isFile()).toBe(true);\n      removeCopy(root);\n    } finally {\n    }"),
      ("src/cli.real-engine.test.ts", CP, CP + '\n  cpSync(join(REPOSITORY, "data"), join(root, "data"), { recursive: true });')],
  "P11-M1-composition-reverted-to-double": [("src/cli.ts", 'import { createEngine, DEFAULT_BUDGET_MS } from "./engine.ts";',
       'import { DEFAULT_BUDGET_MS } from "./engine.ts";\nimport { legalMoves } from "./legal.ts";\nconst createEngine = (_options: { budgetMs: number }) => async (h: { position: Parameters<typeof legalMoves>[0] }) => legalMoves(h.position)[0];')],
  "P11-M2-budget-removed": [("src/cli.ts", 'import { createEngine, DEFAULT_BUDGET_MS } from "./engine.ts";',
       'import { createEngine } from "./engine.ts";\nconst DEFAULT_BUDGET_MS = undefined as never;')],
  "P12-book-read-marker": [("src/book-file.ts", 'import { readFileSync } from "node:fs";', 'import { appendFileSync, readFileSync } from "node:fs";'),
                           ("src/book-file.ts", "  return readFileSync(", '  appendFileSync("/private/tmp/claude-501/-Users-olgeroeselg-Projects-hacks-grugops-examples-cli-chess-example/8527bcf0-376e-4738-b2d4-7789ea9bdd71/scratchpad/qe095/marker.txt", `${process.argv[1]} cwd ${process.cwd()}\\n`);\n  return readFileSync(')],
  "P13-naive-wiring-doubles-on-engine": [("src/cli.test.ts", '"book-engine.ts"', '"engine.ts"', 10),
                           ("src/cli.test.ts", "export function withBook(_probe, _inner) {", "export const DEFAULT_BUDGET_MS = 0;\nexport function createEngine() {", 4)],
}
for edit in P[name]:
    path, old, new = edit[:3]
    want = edit[3] if len(edit) > 3 else 1
    f = root / path
    s = f.read_text()
    n = s.count(old)
    if n != want: raise SystemExit(f"{name}: {path}: expected {want} match(es), found {n}")
    f.write_text(s.replace(old, new))
print(f"{name}: {len(P[name])} edit(s) applied")
