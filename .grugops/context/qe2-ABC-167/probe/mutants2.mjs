// qe2-ABC-167 mutant harness. Usage: node mutants2.mjs <scratch-tree> <file|lane> [ids,comma,separated]
// One exact-string replacement in src/uci-session.ts per mutant, asserted to match exactly once.
// --testTimeout=120000, so a kill is an assertion failure, never a timeout.
import { readFileSync, writeFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
const M = process.argv[2];
const target = process.argv[3] ?? "file";
const only = process.argv[4]?.split(",");
const FILE = `${M}/src/uci-session.ts`;
const original = readFileSync(FILE, "utf8");
const imp = 'import { makeMove } from "./apply.ts";';
const muts = [
  // First-pass survivors named by the brief (patterns unchanged from qe-ABC-167/probe/mutants.mjs).
  ["M02", "A5", "const MOVE_OVERHEAD_MS = 50;", "const MOVE_OVERHEAD_MS = 0;"],
  ["M03", "A5", "+ increment / 2;", "+ 0 * increment;"],
  ["M04", "A5", "+ increment / 2;", "+ increment;"],
  ["M05", "A5", "(clock.movestogo ?? DEFAULT_MOVES_TO_GO)", "DEFAULT_MOVES_TO_GO"],
  ["M06", "A5", 'clock[blackToMove ? "binc" : "winc"]', 'clock[blackToMove ? "winc" : "binc"]'],
  ["M09", "A5", "Math.max(1, Math.min(share, time - MOVE_OVERHEAD_MS))", "Math.max(0, Math.min(share, time - MOVE_OVERHEAD_MS))"],
  ["M10", "A5", "budget = Math.max(1, Math.min(share, time - MOVE_OVERHEAD_MS));", "budget = Math.min(share, time - MOVE_OVERHEAD_MS);"],
  ["M11", "A5", "if (clock.movetime !== undefined) {", "if (clock.movetime !== undefined && time === undefined) {"],
  ["M12", "A6", 'if (keyword === "infinite" || keyword === "ponder") {', 'if (keyword === "infinite") {'],
  ["M15", "A6", "    // One `bestmove` per `go`: an answer still held is released before the next search.\n    release();", "    held = null;"],
  ["M23", "A7", "while (index + 1 < tokens.length && !GO_KEYWORDS.has(tokens[index + 1] as string)) index++;", "index = tokens.length;"],
  ["M29", "A4", "    if (code < 0x20 || code === 0x7f) continue;", "    if (code === 0x7f) continue;"],
  ["M38", "A11", imp, `${imp}\nimport { readFileSync as _r } from 'node:fs';\nvoid _r;`],
  ["M40", "A11", "  const { write, now } = options;", '  const { write, now } = options;\n  void (globalThis as any)["Math"]["random"]();'],
  ["M41", "A11", imp, `${imp}\nimport fs from "fs";\nvoid fs;`],
  ["M42", "A11", "  const { write, now } = options;", '  const { write, now } = options;\n  void (globalThis as any)["process"]?.env;'],
  ["M43", "A3-h1", "const nps = Math.round((choice.nodes * 1000) / Math.max(1, choice.elapsedMs));", "const nps = choice.nodes;"],
  ["M44", "A9-h1", "let position: Position | null = parseFen(START_FEN);", "let position: Position | null = null;"],
  ["M47", "A11", imp, `${imp}\nimport "./turn-loop.ts";`],
  ["M48", "A11", imp, `${imp}\nimport "./book-file.ts";`],
  ["M49", "A11", imp, `${imp}\nimport "./line-input.ts";`],
  ["M50", "A11", imp, `${imp}\nimport "./book-engine.ts";`],
  ["M51", "A11", imp, `${imp}\nimport "./level-seam.ts";`],
  // New: the fix-hop code (release on position/ucinewgame/quit; a keyword is never a value).
  ["N01", "A6-e2", '        case "position": {\n          release();\n', '        case "position": {\n'],
  ["N02", "A6-e3", '        case "ucinewgame":\n          release();\n', '        case "ucinewgame":\n'],
  ["N03", "A6-e4", '        case "quit":\n          release();\n', '        case "quit":\n'],
  ["N04", "A7-f1", "return next === undefined || GO_KEYWORDS.has(next) ? undefined : next;", "return next;"],
  ["N05", "A7-f1", "const text = valueAfter(index);\n      if (text !== undefined) index++;\n      const value = positiveInteger(text);\n      if (value === undefined) {\n        warn(`go ${keyword}", "const text = tokens[++index];\n      const value = positiveInteger(text);\n      if (value === undefined) {\n        warn(`go ${keyword}"],
  ["N06", "A7-f", "const text = valueAfter(index);\n      if (text !== undefined) index++;\n      const value = milliseconds(text);", "const text = tokens[++index];\n      const value = milliseconds(text);"],
  ["N07", "A7-f", "const text = valueAfter(index);\n      if (text !== undefined) index++;\n      const value = positiveInteger(text);\n      if (value === undefined) {\n        warn(`go movestogo", "const text = tokens[++index];\n      const value = positiveInteger(text);\n      if (value === undefined) {\n        warn(`go movestogo"],
  ["N08", "A7-f", "      if (text !== undefined) index++;\n      const value = milliseconds(text);", "      const value = milliseconds(text);"],
  ["N09", "A6-e", "          release();\n          const parsed = parsePosition(tokens);\n          if (typeof parsed === \"string\") {\n            position = null;\n            info(`position refused: ${parsed}`);\n          } else position = parsed;\n", "          const parsed = parsePosition(tokens);\n          if (typeof parsed === \"string\") {\n            position = null;\n            info(`position refused: ${parsed}`);\n          } else position = parsed;\n          release();\n"],
  ["N10", "A6-e5", "      switch (tokens[0]) {\n", "      release();\n      switch (tokens[0]) {\n"],
  ["N11", "A6-e5", '        case "isready":\n          write("readyok");', '        case "isready":\n          release();\n          write("readyok");'],
  ["N12", "A6-e5", "        default:\n", "        default:\n          release();\n"],
  ["N13", "A7-f", '  "infinite",\n]);', "]);"],
  ["N14", "A7-f", '  "depth",\n', ""],
  ["N15", "A7-f", '  "winc",\n', ""],
  ["N16", "A7-f1", '  "movetime",\n', ""],
  ["N17", "A6-e2", "          release();\n          const parsed = parsePosition(tokens);", "          held = null;\n          const parsed = parsePosition(tokens);"],
  ["N18", "A11", imp, `${imp}\nimport './book-file.ts';`],
  ["N19", "A11", "  const { write, now } = options;", '  const { write, now } = options;\n  void import("./line-input.ts");'],
  ["N20", "A7-f3", "if (text === undefined || !/^-?\\d+(\\.\\d+)?$/.test(text)) return undefined;", "if (text === undefined || !Number.isFinite(Number(text))) return undefined;"],
  ["N21", "A7-f3", "      const value = positiveInteger(text);\n      if (value === undefined) {\n        warn(`go movestogo", "      const value = text !== undefined && /^\\d+$/.test(text) ? Number(text) : undefined;\n      if (value === undefined) {\n        warn(`go movestogo"],
];
const results = [];
for (const [id, crit, from, to] of muts) {
  if (only && !only.includes(id)) continue;
  const n = original.split(from).length - 1;
  if (n !== 1) { console.log(`${id} BAD-PATTERN count=${n}`); results.push({ id, crit, status: "BAD" }); continue; }
  writeFileSync(FILE, original.replace(from, to));
  const args = target === "lane" ? ["vitest", "run", "--dir", "src"] : ["vitest", "run", "src/uci-session.test.ts"];
  const r = spawnSync("npx", [...args, "--testTimeout=120000", "--reporter=json", `--outputFile=${M}/out-${id}.json`], { cwd: M, encoding: "utf8" });
  let failed = [];
  try {
    const j = JSON.parse(readFileSync(`${M}/out-${id}.json`, "utf8"));
    failed = j.testResults.flatMap((f) => f.assertionResults.filter((a) => a.status !== "passed").map((a) => a.title));
    if (j.testResults.length === 0 || j.numTotalTests === 0) failed = ["NO-TESTS/compile:" + (j.testResults[0]?.message ?? "").slice(0, 120)];
    const suiteErr = j.testResults.filter((f) => f.status === "failed" && f.assertionResults.length === 0).map((f) => "SUITE:" + f.message.slice(0, 120));
    failed.push(...suiteErr);
  } catch (e) { failed = ["NO-JSON " + r.stderr.slice(0, 200)]; }
  let extra = "";
  if (crit === "A11") {
    const t = spawnSync("npx", ["tsc", "--noEmit"], { cwd: M, encoding: "utf8" });
    const b = spawnSync("npx", ["biome", "check", "src/uci-session.ts"], { cwd: M, encoding: "utf8" });
    extra = ` tsc=${t.status} biome=${b.status}`;
  }
  const status = r.status === 0 ? "SURVIVED" : "KILLED";
  console.log(`${id} ${crit} ${status} exit=${r.status}${extra} failed=${failed.length} ${JSON.stringify(failed.slice(0, 3))}`);
  results.push({ id, crit, status, failed, extra });
}
writeFileSync(FILE, original);
writeFileSync(`${M}/results-${target}.json`, JSON.stringify(results, null, 1));
