import { readFileSync, writeFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
const M = process.argv[2];
const only = process.argv[3]?.split(",");
const FILE = `${M}/src/uci-session.ts`;
const original = readFileSync(FILE, "utf8");
const muts = [
  ["M01","A5","const DEFAULT_MOVES_TO_GO = 20;","const DEFAULT_MOVES_TO_GO = 19;"],
  ["M02","A5","const MOVE_OVERHEAD_MS = 50;","const MOVE_OVERHEAD_MS = 0;"],
  ["M03","A5","+ increment / 2;","+ 0 * increment;"],
  ["M04","A5","+ increment / 2;","+ increment;"],
  ["M05","A5","(clock.movestogo ?? DEFAULT_MOVES_TO_GO)","DEFAULT_MOVES_TO_GO"],
  ["M06","A5",'clock[blackToMove ? "binc" : "winc"]','clock[blackToMove ? "winc" : "binc"]'],
  ["M07","A5","budgetMs: Math.min(budget, LEVELS[DEFAULT_LEVEL].budgetMs),","budgetMs: budget,"],
  ["M08","A5",'clock[blackToMove ? "btime" : "wtime"]','clock[blackToMove ? "wtime" : "btime"]'],
  ["M09","A5","Math.max(1, Math.min(share, time - MOVE_OVERHEAD_MS))","Math.max(0, Math.min(share, time - MOVE_OVERHEAD_MS))"],
  ["M10","A5","budget = Math.max(1, Math.min(share, time - MOVE_OVERHEAD_MS));","budget = Math.min(share, time - MOVE_OVERHEAD_MS);"],
  ["M11","A5","if (clock.movetime !== undefined) {","if (clock.movetime !== undefined && time === undefined) {"],
  ["M12","A6",'if (keyword === "infinite" || keyword === "ponder") {','if (keyword === "infinite") {'],
  ["M13","A6","    held = null;\n    write(line);","    write(line);"],
  ["M14","A6",'        case "stop":\n        case "ponderhit":','        case "stop":'],
  ["M15","A6","    // One `bestmove` per `go`: an answer still held is released before the next search.\n    release();","    held = null;"],
  ["M16","A6","if (request.hold) held = answer;","if (false) held = answer;"],
  ["M17","A7","2 * mate - 1","2 * mate"],
  ["M18","A7","Math.min(depth, mateDepth)","Math.max(depth, mateDepth)"],
  ["M19","A7","value >= 1 ? value : undefined","value >= 0 ? value : undefined"],
  ["M20","A7","if (text === undefined || !/^\\d+$/.test(text)) return undefined;\n  const value = Number(text);","if (text === undefined || Number.isNaN(Number.parseInt(text))) return undefined;\n  const value = Number.parseInt(text);"],
  ["M21","A7","...(request.maxNodes === undefined ? {} : { maxNodes: request.maxNodes }),",""],
  ["M22","A7",'      warn("searchmoves is not supported; searching all moves");',""],
  ["M23","A7","while (index + 1 < tokens.length && !GO_KEYWORDS.has(tokens[index + 1] as string)) index++;","index = tokens.length;"],
  ["M24","A7","        warn(`go ${keyword} needs an integer >= 1, got ${text ?? \"nothing\"}; ignored`);","        depth = 1;"],
  ["M25","A7","...(request.maxDepth === undefined ? {} : { maxDepth: request.maxDepth }),",""],
  ["M26","A4","    if (request.hold) held = answer;\n    else write(answer);","    if (request.hold) held = answer;\n    else if (answer !== \"bestmove 0000\") write(answer);"],
  ["M27","A4",'let answer = "bestmove 0000";','let answer = "bestmove (none)";'],
  ["M28","A4","            position = null;\n",""],
  ["M29","A4","    if (code < 0x20 || code === 0x7f) continue;","    if (code === 0x7f) continue;"],
  ["M30","A4",'if (parsed.outcome !== "move") return `illegal move ${text}`;','if (parsed.outcome !== "move") continue;'],
  ["M31","A8","const moves = Math.ceil((MATE_SCORE - Math.abs(score)) / 2);","const moves = Math.floor((MATE_SCORE - Math.abs(score)) / 2);"],
  ["M32","A8","return `mate ${score > 0 ? moves : -moves}`;","return `mate ${moves}`;"],
  ["M33","A8","if (Math.abs(score) < MATE_FLOOR) return `cp ${score}`;","return `cp ${score}`;"],
  ["M34","A9","          position = parseFen(START_FEN);\n          break;\n        case \"position\"","          break;\n        case \"position\""],
  ["M35","A9","        default:\n","        default:\n          if (tokens[0] === \"setoption\") info(\"ignored\");\n"],
  ["M36","A1",'          write("id name skytalix");\n          write("id author Olger Oeselg");','          write("id author Olger Oeselg");\n          write("id name skytalix");'],
  ["M37","A10",'          return "quit";','          return "continue";'],
  ["M38","A11",'import { makeMove } from "./apply.ts";',"import { makeMove } from \"./apply.ts\";\nimport { readFileSync as _r } from 'node:fs';\nvoid _r;"],
  ["M39","A11",'import { makeMove } from "./apply.ts";','import { makeMove } from "./apply.ts";\nimport "./history.ts";'],
  ["M40","A11","  const { write, now } = options;","  const { write, now } = options;\n  void (globalThis as any)[\"Math\"][\"random\"]();"],
  ["M41","A11",'import { makeMove } from "./apply.ts";','import { makeMove } from "./apply.ts";\nimport fs from "fs";\nvoid fs;'],
  ["M42","A11","  const { write, now } = options;","  const { write, now } = options;\n  void (globalThis as any)[\"process\"]?.env;"],
  ["M43","A3/c5","const nps = Math.round((choice.nodes * 1000) / Math.max(1, choice.elapsedMs));","const nps = choice.nodes;"],
  ["M44","c1","let position: Position | null = parseFen(START_FEN);","let position: Position | null = null;"],
  ["M45","A3","pv ${move}`,","pv ${move} ${move}`,"],
  ["M46","A11","write(answer);","write(answer);\n    write(\"readyok\");"],
  ["M47","A11",'import { makeMove } from "./apply.ts";','import { makeMove } from "./apply.ts";\nimport "./turn-loop.ts";'],
  ["M48","A11",'import { makeMove } from "./apply.ts";','import { makeMove } from "./apply.ts";\nimport "./book-file.ts";'],
  ["M49","A11",'import { makeMove } from "./apply.ts";','import { makeMove } from "./apply.ts";\nimport "./line-input.ts";'],
  ["M50","A11",'import { makeMove } from "./apply.ts";','import { makeMove } from "./apply.ts";\nimport "./book-engine.ts";'],
  ["M51","A11",'import { makeMove } from "./apply.ts";','import { makeMove } from "./apply.ts";\nimport "./level-seam.ts";'],
];
const results = [];
for (const [id, crit, from, to] of muts) {
  if (only && !only.includes(id)) continue;
  const n = original.split(from).length - 1;
  if (n !== 1) { console.log(`${id} BAD-PATTERN count=${n}`); results.push({ id, crit, status: "BAD" }); continue; }
  writeFileSync(FILE, original.replace(from, to));
  const r = spawnSync("npx", ["vitest", "run", "--dir", "src", "--testTimeout=120000", "--reporter=json", `--outputFile=${M}/out-${id}.json`], { cwd: M, encoding: "utf8" });
  let failed = [];
  try { const j = JSON.parse(readFileSync(`${M}/out-${id}.json`, "utf8")); failed = j.testResults.flatMap((f) => f.assertionResults.filter((a) => a.status !== "passed").map((a) => a.title)); if (j.testResults.length===0 || j.numTotalTests===0) failed=["NO-TESTS/compile:"+ (j.testResults[0]?.message??"").slice(0,120)]; } catch (e) { failed = ["NO-JSON " + r.stderr.slice(0, 200)]; }
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
writeFileSync(`${M}/results.json`, JSON.stringify(results, null, 1));
