// Writes the qe-ABC-173 mutant specs (JSON) next to this file.
import { writeFileSync } from "node:fs";
const D = new URL(".", import.meta.url).pathname;
const G = "tools/grugops/heap-guard.js";
const RE = "src/cli.real-engine.test.ts";
const CT = "src/cli.test.ts";
const AG = "AGENTS.md";
const GUARD_B = ["DL", "OF", "SF1", "S128", "UNS", "UNO", "S400", "O500", "O450"];
const guard = [
  { id: "CONTROL-G", what: "unmutated tree, guard batteries", edits: [], batteries: GUARD_B },
  { id: "G01", what: "row choice inverted (1 file -> SUITE, 2+ -> ONE-FILE)", edits: [[G, 'files === 1 ? "oneFile" : "suite"', 'files === 1 ? "suite" : "oneFile"']] },
  { id: "G02", what: "row choice always SUITE", edits: [[G, 'files === 1 ? "oneFile" : "suite"', 'files === 1 ? "suite" : "suite"']] },
  { id: "G03", what: "row choice always ONE-FILE", edits: [[G, 'files === 1 ? "oneFile" : "suite"', 'files === 1 ? "oneFile" : "oneFile"']] },
  { id: "G04", what: "above-row comparison > -> >=", edits: [[G, "if (limitMiB > row) {", "if (limitMiB >= row) {"]] },
  { id: "G05", what: "file count off by one (+1)", edits: [[G, "getPaths.call(project.vitest.state).length;", "getPaths.call(project.vitest.state).length + 1;"]] },
  { id: "G06", what: "file count: <= 2 files is ONE-FILE", edits: [[G, 'files === 1 ? "oneFile"', 'files <= 2 ? "oneFile"']] },
  { id: "G07", what: "never throws above the row", edits: [[G, "if (limitMiB > row) {", "if (false) {"]] },
  { id: "G08", what: "provides the ONE-FILE row whatever the shape", edits: [[G, 'project.provide("heapRowMiB", row);', 'project.provide("heapRowMiB", ROWS_MIB.oneFile);']] },
  { id: "G09", what: "compares the FLAG (limit - 96) not the limit", edits: [[G, "heap_size_limit / MIB;", "heap_size_limit / MIB - 96;"]] },
  { id: "G10", what: "ONE-FILE row raised 496 -> 592 (flag unchanged)", edits: [[G, "{ suite: 224, oneFile: 496 }", "{ suite: 224, oneFile: 592 }"]] },
  { id: "G11", what: "SUITE row raised 224 -> 512 (flag unchanged)", edits: [[G, "{ suite: 224, oneFile: 496 }", "{ suite: 512, oneFile: 496 }"]] },
].map((m) => ({ batteries: GUARD_B, ...m }));
const TOK_B = ["CLI", "CLIS"];
const token = [
  { id: "CONTROL-T", what: "unmutated tree, token batteries", edits: [] },
  { id: "T01", what: "CLI_DEEP argv token dropped", edits: [[RE, "[heapToken(), ...rest]", "[...rest]"]] },
  { id: "T02", what: "first heap token, not last", edits: [[RE, "tokens?.at(-1)?.trim()", "tokens?.at(0)?.trim()"]] },
  { id: "T03", what: "literal ONE-FILE token, not the parent's", edits: [[RE, "  return last;\n};", '  return "--max-old-space-size=400";\n};']] },
  { id: "T04", what: "token after the entry point", edits: [[RE, "[heapToken(), ...rest]", "[...rest, heapToken()]"]] },
  { id: "T05", what: "the whole NODE_OPTIONS crosses in env (CHILD_ENV const untouched)", edits: [[RE, "    env: CHILD_ENV,", "    env: { ...CHILD_ENV, NODE_OPTIONS: process.env.NODE_OPTIONS ?? \"\" },"]] },
].map((m) => ({ batteries: TOK_B, ...m }));
const ZOB = "ZOBRIST_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 npx vitest run src/zobrist.test.ts";
const INPUT = 'NODE_OPTIONS="--expose-gc --max-old-space-size=400"';
const a3 = [
  { id: "CONTROL-S", what: "unmutated tree, ABC-173 block", edits: [] },
  { id: "S01", what: "AGENTS.md: ZOBRIST line without its prefix", edits: [[AG, ZOB, "ZOBRIST_DEEP=1 npx vitest run src/zobrist.test.ts"]] },
  { id: "S02", what: "AGENTS.md: ZOBRIST line with the SUITE flag", edits: [[AG, ZOB, "ZOBRIST_DEEP=1 NODE_OPTIONS=--max-old-space-size=128 npx vitest run src/zobrist.test.ts"]] },
  { id: "S03", what: "AGENTS.md: coverage line with the ONE-FILE flag", edits: [[AG, "`NODE_OPTIONS=--max-old-space-size=128 npx vitest run --coverage`", "`NODE_OPTIONS=--max-old-space-size=400 npx vitest run --coverage`"]] },
  { id: "S04", what: "AGENTS.md: quiescence lane line dropped entirely", edits: [[AG, "- Quiescence deep lane (ABC-079): `SEARCH_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 npx vitest run src/quiescence.test.ts`\n", ""]] },
  { id: "S05", what: "AGENTS.md: INPUT_DEEP split into two NODE_OPTIONS assignments", edits: [[AG, INPUT, "NODE_OPTIONS=--expose-gc NODE_OPTIONS=--max-old-space-size=400"]] },
  { id: "S06", what: "AGENTS.md: INPUT_DEEP drops --expose-gc", edits: [[AG, INPUT, 'NODE_OPTIONS="--max-old-space-size=400"']] },
  { id: "S07", what: "AGENTS.md: INPUT_DEEP carries the SUITE flag", edits: [[AG, INPUT, 'NODE_OPTIONS="--expose-gc --max-old-space-size=128"']] },
  { id: "S08", what: "AGENTS.md: PUZZLE prefix moved into npx --node-options", edits: [[AG, "PUZZLE_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 npx vitest", "PUZZLE_DEEP=1 npx --node-options=--max-old-space-size=400 vitest"]] },
  { id: "S09", what: "AGENTS.md: ZOBRIST command moved inside an HTML comment", edits: [[AG, "`" + ZOB + "`", "<!-- `" + ZOB + "` -->"]] },
  { id: "S10", what: "AGENTS.md: ZOBRIST command replaced by a duplicate quiescence command (count kept at 17)", edits: [[AG, ZOB, "SEARCH_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 npx vitest run src/quiescence.test.ts"]] },
  { id: "S11", what: "AGENTS.md: a second heap flag in one value (4000 wins at run time)", edits: [[AG, ZOB, 'ZOBRIST_DEEP=1 NODE_OPTIONS="--max-old-space-size=400 --max-old-space-size=4000" npx vitest run src/zobrist.test.ts']] },
  { id: "S12", what: "heap-guard.js FLAGS_MIB oneFile 400 -> 500 (rows and AGENTS.md untouched)", edits: [[G, "{ suite: 128, oneFile: 400 }", "{ suite: 128, oneFile: 500 }"]] },
  { id: "S13", what: "package.json scripts.test flag 128 -> 400", edits: [["package.json", '"test": "NODE_OPTIONS=--max-old-space-size=128 node', '"test": "NODE_OPTIONS=--max-old-space-size=400 node']] },
  { id: "S14", what: "AGENTS.md: ZOBRIST flag spelled --max_old_space_size=400 (node accepts it)", edits: [[AG, ZOB, "ZOBRIST_DEEP=1 NODE_OPTIONS=--max_old_space_size=400 npx vitest run src/zobrist.test.ts"]] },
  // C2 parser
  { id: "P01", what: "C2 parser: namespace imports ignored", edits: [[CT, "    if (bindings !== undefined && ts.isNamespaceImport(bindings))\n      namespaces.add(bindings.name.text);\n", ""]] },
  { id: "P02", what: "C2 parser: renamed binding resolves to its local name", edits: [[CT, "named.set(name.text, (propertyName ?? name).text);", "named.set(name.text, name.text);"]] },
  { id: "P03", what: "C2 parser: only the node: specifier", edits: [[CT, "!/^(node:)?child_process$/.test(specifier.text)", "!/^node:child_process$/.test(specifier.text)"]] },
  { id: "P04", what: "C2 parser: exec dropped from the async set", edits: [[CT, 'new Set(["spawn", "exec", "execFile", "fork"])', 'new Set(["spawn", "execFile", "fork"])']] },
  { id: "P05", what: "C2 parser: does not descend into function bodies", edits: [[CT, "      if (form !== undefined) calls.push({ file, form, call: node, view });\n    }\n    ts.forEachChild(node, visit);", "      if (form !== undefined) calls.push({ file, form, call: node, view });\n    }\n    if (!ts.isFunctionLike(node)) ts.forEachChild(node, visit);"]] },
  { id: "P06", what: "C2 parser: prefilter needs the node: spelling", edits: [[CT, ".filter(([, source]) => source.includes(CHILD_PROCESS_NAME))", '.filter(([, source]) => source.includes(`node:${CHILD_PROCESS_NAME}`))']] },
  { id: "P07", what: "C2 row: synchronous floor 4 -> 0", edits: [[CT, '"synchronous child_process call sites").toBeGreaterThanOrEqual(4)', '"synchronous child_process call sites").toBeGreaterThanOrEqual(0)']] },
  // C2 tree plants (wrong builds the row exists for)
  { id: "C01", what: "plant: named spawn( in ladder.test.ts", edits: [["src/ladder.test.ts", 'import { execFileSync } from "node:child_process";', 'import { execFileSync, spawn } from "node:child_process";\nconst _planted = () => spawn("true");']] },
  { id: "C02", what: "plant: namespace cp.exec( in history-pane.nfr.test.ts", edits: [["src/history-pane.nfr.test.ts", 'import { spawnSync } from "node:child_process";', 'import { spawnSync } from "node:child_process";\nimport * as cp from "node:child_process";\nconst _planted = () => cp.exec("true");']] },
  { id: "C03", what: "plant: renamed fork in transposition.test.ts", edits: [["src/transposition.test.ts", 'import { spawnSync } from "node:child_process";', 'import { spawnSync, fork as f } from "node:child_process";\nconst _planted = () => f("x");']] },
  { id: "C04", what: "plant: dynamic import() spawn (the row's STATED bound)", edits: [["src/ladder.test.ts", 'import { execFileSync } from "node:child_process";', 'import { execFileSync } from "node:child_process";\nconst _planted = async () => (await import("node:child_process")).spawn("true");']] },
  // A6 static row
  { id: "A01", what: "A6 static: env key added to history-pane spawnSync", edits: [["src/history-pane.nfr.test.ts", '{ encoding: "utf8", stdio: ["ignore", "ignore", "pipe", "pipe"] }', '{ encoding: "utf8", env: { ...process.env }, stdio: ["ignore", "ignore", "pipe", "pipe"] }']] },
  { id: "A02", what: "A6 static: heap flag in transposition argv", edits: [["src/transposition.test.ts", '["--expose-gc", "--input-type=module", "-e", script]', '["--expose-gc", "--max-old-space-size=4000", "--input-type=module", "-e", script]']] },
  { id: "A03", what: "A6 static: quoted \"env\" key", edits: [["src/history-pane.nfr.test.ts", '{ encoding: "utf8", stdio: ["ignore", "ignore", "pipe", "pipe"] }', '{ encoding: "utf8", "env": { ...process.env }, stdio: ["ignore", "ignore", "pipe", "pipe"] }']] },
  { id: "A04", what: "A6 static: env via spread", edits: [["src/history-pane.nfr.test.ts", '{ encoding: "utf8", stdio: ["ignore", "ignore", "pipe", "pipe"] }', '{ encoding: "utf8", ...{ env: { ...process.env } }, stdio: ["ignore", "ignore", "pipe", "pipe"] }']] },
  { id: "A05", what: "A6 static: underscore heap flag in transposition argv", edits: [["src/transposition.test.ts", '["--expose-gc", "--input-type=module", "-e", script]', '["--expose-gc", "--max_old_space_size=4000", "--input-type=module", "-e", script]']] },
  { id: "A06", what: "A6 childOf: NODE_OPTIONS emptied in childOf's env", edits: [[CT, "      cwd: REPOSITORY,\n      encoding: \"utf8\",\n      input: options.input ?? \"\",", "      cwd: REPOSITORY,\n      env: { ...process.env, NODE_OPTIONS: \"\" },\n      encoding: \"utf8\",\n      input: options.input ?? \"\","]] },
].map((m) => ({ batteries: ["A173"], ...m }));
const cfg = [
  { id: "V01", what: "vitest.config.ts globalSetup removed", edits: [["vitest.config.ts", '    globalSetup: ["./tools/grugops/heap-guard.js"],\n', ""]], batteries: ["DL", "UNS", "UNO"] },
];
writeFileSync(`${D}/spec-guard.json`, JSON.stringify(guard, null, 1));
writeFileSync(`${D}/spec-token.json`, JSON.stringify(token, null, 1));
writeFileSync(`${D}/spec-a3.json`, JSON.stringify(a3, null, 1));
writeFileSync(`${D}/spec-cfg.json`, JSON.stringify(cfg, null, 1));
