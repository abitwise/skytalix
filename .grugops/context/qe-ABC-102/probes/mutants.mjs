// QE mutant harness for ABC-102. Run from the worktree root:
//   node .grugops/context/qe-ABC-102/probes/mutants.mjs
// Each mutant is ONE exact-once string replacement in src/command-input.ts. After each: the file is
// restored with `git checkout -- src/command-input.ts` and `git status --porcelain -- src` must be
// empty, or the harness stops. Records failing rows of src/command-input.test.ts (vitest JSON) and
// whether the QE loop probe (loop-probe.ts) goes red.
import { execFileSync, spawnSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";

const FILE = "src/command-input.ts";
const original = readFileSync(FILE, "utf8");

const GUARD = "return history.moves.length >= 2\n      ? { kind: \"take-back\", plies: 2, messages: [] }\n      : { kind: \"command\", messages: UNDO_REFUSAL_MESSAGES };";
const UNDO_BRANCH_START = "  if (spec.token === \"undo\") {";
const HELP = "return COMMAND_TABLE.map((spec) => spec.token);";

const mutants = [
  // --- the build's, re-applied (test note 6) ---
  ["M1 guard >= 1 (unguarded two-ply take-back at ply 1)", "history.moves.length >= 2", "history.moves.length >= 1"],
  ["M3 heading kept", HELP, 'return ["commands:", ...COMMAND_TABLE.map((spec) => spec.token)];'],
  // --- QE's own ---
  ["Q1 undo branch AFTER new's take-back branch (undo takes ALL plies)", null, null],
  ["Q2 refusal as `rejected`, not `command`", 'kind: "command", messages: UNDO_REFUSAL_MESSAGES', 'kind: "rejected", messages: UNDO_REFUSAL_MESSAGES'],
  ["Q3 heading kept AND undo dropped from help (length unchanged — the superseded rows' blind spot)", HELP, 'return ["commands:", ...COMMAND_TABLE.map((spec) => spec.token).filter((t) => t !== "undo")];'],
  ["Q4 guard > 2 (refuses at exactly 2 plies)", "history.moves.length >= 2", "history.moves.length > 2"],
  ["Q5 success carries the refusal text (ruling 7)", '? { kind: "take-back", plies: 2, messages: [] }', '? { kind: "take-back", plies: 2, messages: UNDO_REFUSAL_MESSAGES }'],
  ["Q6 refusal as a zero-ply take-back (no change, but a derive)", ': { kind: "command", messages: UNDO_REFUSAL_MESSAGES };', ': { kind: "take-back", plies: 0, messages: UNDO_REFUSAL_MESSAGES };'],
  ["Q7 refusal wording drift", '["nothing to undo"]', '["nothing to undo."]'],
  ["Q8 undo row moved FIRST in the table (help order changes)", '  { token: "undo", outcome: "take-back" },\n];', "];"],
];

function applyQ1(src) {
  // Cut the undo branch out and re-insert it after the take-back branch's closing brace.
  const start = src.indexOf(UNDO_BRANCH_START);
  const end = src.indexOf(GUARD, start) + GUARD.length + "\n  }\n".length;
  const branch = src.slice(start, end);
  const rest = src.slice(0, start) + src.slice(end);
  const anchor = 'return { kind: "take-back", plies: history.moves.length, messages: [] };\n  }\n';
  const at = rest.indexOf(anchor);
  if (at < 0 || rest.indexOf(anchor, at + 1) >= 0) throw new Error("Q1 anchor not unique");
  return rest.slice(0, at + anchor.length) + branch + rest.slice(at + anchor.length);
}

function once(src, from, to) {
  const at = src.indexOf(from);
  if (at < 0 || src.indexOf(from, at + 1) >= 0) throw new Error(`not exactly once: ${from}`);
  return src.slice(0, at) + to + src.slice(at + from.length);
}

const results = [];
for (const [name, from, to] of mutants) {
  let mutated;
  if (name.startsWith("Q1")) mutated = applyQ1(original);
  else if (name.startsWith("Q8")) {
    mutated = once(original, from, to);
    mutated = once(mutated, '  { token: "help", outcome: "command" },', '  { token: "undo", outcome: "take-back" },\n  { token: "help", outcome: "command" },');
  } else mutated = once(original, from, to);
  writeFileSync(FILE, mutated);
  const vt = spawnSync("npx", ["vitest", "run", "src/command-input.test.ts", "--reporter=json"], { encoding: "utf8" });
  let failed = [];
  let total = 0;
  try {
    const json = JSON.parse(vt.stdout);
    total = json.numTotalTests;
    failed = json.testResults.flatMap((f) => f.assertionResults.filter((a) => a.status === "failed").map((a) => a.fullName));
  } catch {
    failed = [`<no JSON: exit ${vt.status}> ${vt.stderr.slice(0, 300)}`];
  }
  const probe = spawnSync("node", [".grugops/context/qe-ABC-102/probes/loop-probe.ts"], { encoding: "utf8" });
  const probeFails = probe.stdout.split("\n").filter((l) => l.startsWith("FAIL ")).map((l) => l.slice(5));
  execFileSync("git", ["checkout", "--", FILE]);
  const dirty = execFileSync("git", ["status", "--porcelain", "--", "src"], { encoding: "utf8" });
  if (dirty !== "" || readFileSync(FILE, "utf8") !== original) throw new Error(`restore failed after ${name}`);
  results.push({ name, testRowsRed: failed.length, total, failed, probeRed: probeFails.length, probeFails: probeFails.slice(0, 6) });
  console.log(`${name}: ${failed.length} red / ${total} rows; probe ${probeFails.length} red`);
}
writeFileSync(".grugops/context/qe-ABC-102/notes/raw-mutants.json.txt", `${JSON.stringify(results, null, 1)}\n`);
console.log("restored clean; git status -- src empty");
