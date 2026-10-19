// qe-ABC-171 mutant harness, derived from qe2-ABC-167/probe/mutants2.mjs. Usage: node mutants3.mjs <scratch-tree> <file|lane> [ids]
// One exact-string replacement in src/uci-session.ts per mutant, asserted to match exactly once. --testTimeout=120000.
import { readFileSync, writeFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
const M = process.argv[2];
const target = process.argv[3] ?? "file";
const only = process.argv[4]?.split(",");
const FILE = `${M}/src/uci-session.ts`;
const original = readFileSync(FILE, "utf8");
const imp = 'import { makeMove } from "./apply.ts";';
const OPT = "  const { write, now, random, book } = options;";
const muts = [
  // ABC-167 regression set (qe2-ABC-167 patterns; the destructuring anchor moved to OPT).
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
  ["M40", "A11", OPT, OPT + '\n  void (globalThis as any)["Math"]["random"]();'],
  ["M41", "A11", imp, `${imp}\nimport fs from "fs";\nvoid fs;`],
  ["M42", "A11", OPT, OPT + '\n  void (globalThis as any)["process"]?.env;'],
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
  ["N11b", "A6-e5", '        case "isready":\n          warm();\n          write("readyok");', '        case "isready":\n          release();\n          warm();\n          write("readyok");'],
  ["N12", "A6-e5", "        default:\n", "        default:\n          release();\n"],
  ["N13", "A7-f", '  "infinite",\n]);', "]);"],
  ["N14", "A7-f", '  "depth",\n', ""],
  ["N15", "A7-f", '  "winc",\n', ""],
  ["N16", "A7-f1", '  "movetime",\n', ""],
  ["N17", "A6-e2", "          release();\n          const parsed = parsePosition(tokens);", "          held = null;\n          const parsed = parsePosition(tokens);"],
  ["N18", "A11", imp, `${imp}\nimport './book-file.ts';`],
  ["N19", "A11", OPT, OPT + '\n  void import("./line-input.ts");'],
  ["N20", "A7-f3", "if (text === undefined || !/^-?\\d+(\\.\\d+)?$/.test(text)) return undefined;", "if (text === undefined || !Number.isFinite(Number(text))) return undefined;"],
  ["N21", "A7-f3", "      const value = positiveInteger(text);\n      if (value === undefined) {\n        warn(`go movestogo", "      const value = text !== undefined && /^\\d+$/.test(text) ? Number(text) : undefined;\n      if (value === undefined) {\n        warn(`go movestogo"],
  // ABC-171 (S-series): setoption, Skill Level bounds, min(G, level), book warm/read, book hit + infinite, seeds.
  ["S01", "A2 name case", '      .join(" ")\n      .toLowerCase(),', '      .join(" "),'],
  ["S02", "choice2 value case", 'value: valueAt === -1 ? "" : tokens.slice(valueAt + 1).join(" "),', 'value: valueAt === -1 ? "" : tokens.slice(valueAt + 1).join(" ").toLowerCase(),'],
  ["S03", "choice3 value first token", 'value: valueAt === -1 ? "" : tokens.slice(valueAt + 1).join(" "),', 'value: valueAt === -1 ? "" : (tokens[valueAt + 1] ?? ""),'],
  ["S04", "A2 name to end", "const end = valueAt === -1 ? tokens.length : valueAt;", "const end = tokens.length;"],
  ["S05", "A2 hasOwn->in", "if (Object.hasOwn(LEVELS, value))", "if (value in LEVELS)"],
  ["S06", "A2 hasOwn->!==undefined", "if (Object.hasOwn(LEVELS, value))", "if ((LEVELS as any)[value] !== undefined)"],
  ["S07", "A2 hasOwn->integer range", "if (Object.hasOwn(LEVELS, value))", "if (Number.isInteger(Number(value)) && Number(value) >= 1 && Number(value) <= 5 && value !== \"\")"],
  ["S08", "A2 bound 0", "if (Object.hasOwn(LEVELS, value))", "if (Object.hasOwn(LEVELS, value) || value === \"0\")"],
  ["S09", "A2 bound 6", "if (Object.hasOwn(LEVELS, value))", "if (Object.hasOwn(LEVELS, value) || value === \"6\")"],
  ["S10", "A2 2.5 floored", "if (Object.hasOwn(LEVELS, value))", "if (Object.hasOwn(LEVELS, String(Math.floor(Number(value)))))"],
  ["S10b", "A2 2.5 floored (value too)", "if (Object.hasOwn(LEVELS, value)) skill = Number(value) as keyof typeof LEVELS;", "if (Object.hasOwn(LEVELS, String(Math.floor(Number(value))))) skill = Math.floor(Number(value)) as keyof typeof LEVELS;"],
  ["S11", "A2 invalid skill resets default", "      else info(`Skill Level takes", "      else if ((skill = DEFAULT_LEVEL)) info(`Skill Level takes"],
  ["S12", "A2 invalid OwnBook -> false", "      else info(`OwnBook takes", "      else if (!(ownBook = false)) info(`OwnBook takes"],
  ["S12b", "A2 invalid OwnBook -> true", "      else info(`OwnBook takes", "      else if ((ownBook = true)) info(`OwnBook takes"],
  ["S13", "A2 invalid OwnBook silent", "      else info(`OwnBook takes true or false, got ${got}; kept ${ownBook}`);", "      else void 0;"],
  ["S14", "A2 invalid skill two lines", "      else info(`Skill Level takes an integer 1-5, got ${got}; kept ${skill}`);", "      else { info(`Skill Level takes an integer 1-5, got ${got}; kept ${skill}`); info(\"again\"); }"],
  ["S15", "A2 unknown name speaks", "      else info(`Skill Level takes an integer 1-5, got ${got}; kept ${skill}`);\n    }", "      else info(`Skill Level takes an integer 1-5, got ${got}; kept ${skill}`);\n    } else info(`unknown option ${name}`);"],
  ["S16", "A2 OwnBook inverted", 'ownBook = value === "true";', 'ownBook = value === "false";'],
  ["S17", "A6 budget = level only", "const budgetMs = Math.min(request.budgetMs, level.budgetMs);", "const budgetMs = level.budgetMs;"],
  ["S18", "A6 budget = G only", "const budgetMs = Math.min(request.budgetMs, level.budgetMs);", "const budgetMs = request.budgetMs;"],
  ["S19", "A6 min->max", "const budgetMs = Math.min(request.budgetMs, level.budgetMs);", "const budgetMs = Math.max(request.budgetMs, level.budgetMs);"],
  ["S20", "A6 min(ceiling, level)", "const budgetMs = Math.min(request.budgetMs, level.budgetMs);", "const budgetMs = Math.min(HARD_CEILING_MS, level.budgetMs);"],
  ["S21", "A5 no warm at isready", '        case "isready":\n          warm();\n', '        case "isready":\n'],
  ["S22", "A4 warm ignores OwnBook", "if (warmed || !ownBook) return;", "if (warmed) return;"],
  ["S23", "A5 warm at uci", '          write("id name skytalix");', '          warm();\n          write("id name skytalix");'],
  ["S24", "A4 probe even when off", "const booked = ownBook && position !== null ? book.bookMove(position) : undefined;", "const probed = position !== null ? book.bookMove(position) : undefined;\n    const booked = ownBook ? probed : undefined;"],
  ["S25", "D10 book only at rate 0", "const booked = ownBook && position !== null ? book.bookMove(position) : undefined;", "const booked = ownBook && position !== null && level.blunderRate === 0 ? book.bookMove(position) : undefined;"],
  ["S26", "A10 book hit ignores infinite", '      info("book");\n      answer = `bestmove ${coordinateOf(booked)}`;', '      info("book");\n      write(`bestmove ${coordinateOf(booked)}`);\n      return;'],
  ["S27", "A3 book hit also searches", '      info("book");\n      answer = `bestmove ${coordinateOf(booked)}`;\n    } else if (position !== null && level.blunderRate > 0) {', '      info("book");\n      answer = `bestmove ${coordinateOf(booked)}`;\n      write("info depth 1 score cp 0 nodes 1 time 0 nps 0 pv e2e4");\n    } else if (position !== null && level.blunderRate > 0) {'],
  ["S28", "A9 miss with OwnBook on -> 0000", "    } else if (position !== null) {\n      const choice = chooseMove(", "    } else if (position !== null && !(ownBook && warmed)) {\n      const choice = chooseMove("],
  ["S29", "A9 warn->extra call each go", "    warm();\n    const booked", "    warm();\n    if (ownBook) book.openingName(parseFen(START_FEN));\n    const booked"],
  ["S30", "A8 seed drawn at every level", "    warm();\n    const booked", "    random();\n    warm();\n    const booked"],
  ["S31", "A8 seed drawn on a blunder-level book hit", "    warm();\n    const booked", "    const early = level.blunderRate > 0 ? Math.floor(random() * 2 ** 32) : 0;\n    warm();\n    const booked"],
  ["S31b", "(S31 completion)", "      const seed = Math.floor(random() * 2 ** 32);", "      const seed = early;"],
  ["S32", "A7 seed constant, draw kept", "      const seed = Math.floor(random() * 2 ** 32);", "      random();\n      const seed = 12345;"],
  ["S33", "A7 seed scale 2**16", "      const seed = Math.floor(random() * 2 ** 32);", "      const seed = Math.floor(random() * 2 ** 16);"],
  ["S34", "A8 no draw", "      const seed = Math.floor(random() * 2 ** 32);", "      const seed = 12345;"],
  ["S35", "A8 two draws", "      const seed = Math.floor(random() * 2 ** 32);", "      const seed = Math.floor(random() * random() * 2 ** 32);"],
  ["S36", "A8 ucinewgame reseeds", '        case "ucinewgame":\n          release();\n', '        case "ucinewgame":\n          random();\n          release();\n'],
  ["S37", "A7 dropped line always", "if (request.limits.length > 0) {", "if (request.limits.length >= 0) {"],
  ["S38", "D11 only depth named", "if (!limits.includes(keyword)) limits.push(keyword);", 'if (keyword === "depth" && !limits.includes(keyword)) limits.push(keyword);'],
  ["S39", "D11 one line per limit", "        info(`skill level ${skill} ignores go ${request.limits.join(\", \")}; searching on time`);", "        for (const l of request.limits) info(`skill level ${skill} ignores go ${l}; searching on time`);"],
  ["S40", "A7 level line carries score", "`info depth ${choice.depth} nodes ${choice.nodes} time ${choice.elapsedMs} pv ${move}`,", "`info depth ${choice.depth} score cp 0 nodes ${choice.nodes} time ${choice.elapsedMs} pv ${move}`,"],
  ["S41", "A6 blunder path takes G", "        { budgetMs, blunderRate: level.blunderRate },", "        { budgetMs: request.budgetMs, blunderRate: level.blunderRate },"],
  ["S42", "A1 option order", '          write("option name OwnBook type check default true");\n          write("option name Skill Level type spin default 3 min 1 max 5");', '          write("option name Skill Level type spin default 3 min 1 max 5");\n          write("option name OwnBook type check default true");'],
  ["S43", "default level 5", "let skill: keyof typeof LEVELS = DEFAULT_LEVEL;", "let skill: keyof typeof LEVELS = 5;"],
  ["S44", "default OwnBook off", "let ownBook = true;", "let ownBook = false;"],
  ["S45", "choice6 warm reset on ucinewgame", '          position = parseFen(START_FEN);\n          break;', '          position = parseFen(START_FEN);\n          warmed = false;\n          break;'],
  ["S46", "D10 warm via bookMove", "    book.openingName(parseFen(START_FEN));", "    book.bookMove(parseFen(START_FEN));"],
  ["S47", "D10 warm on held position", "    book.openingName(parseFen(START_FEN));", "    book.openingName(position ?? parseFen(START_FEN));"],
  ["S48", "A3 probe start not held", "book.bookMove(position) : undefined;", "book.bookMove(parseFen(START_FEN)) : undefined;"],
];
const results = [];
for (const [id, crit, from, to] of muts) {
  if (id === "S31b") continue;
  if (only && !only.includes(id)) continue;
  const n = original.split(from).length - 1;
  if (n !== 1) { console.log(`${id} BAD-PATTERN count=${n}`); results.push({ id, crit, status: "BAD" }); continue; }
  let mutated = original.replace(from, to);
  if (id === "S31") { const b = muts.find((m) => m[0] === "S31b"); if (mutated.split(b[2]).length !== 2) { console.log("S31b BAD"); continue; } mutated = mutated.replace(b[2], b[3]); }
  writeFileSync(FILE, mutated);
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
