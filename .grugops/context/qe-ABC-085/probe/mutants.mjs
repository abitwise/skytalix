// QE ABC-085 mutant driver. Default lane only (LADDER_DEEP unset). Each mutant is an exact-string
// plant in a temp copy of src/ladder.test.ts; the copy is run alone, then deleted.
import { execFileSync } from "node:child_process";
import { readFileSync, rmSync, writeFileSync } from "node:fs";

const WT = process.argv[2];
const SRC = `${WT}/src/ladder.test.ts`;
const MUT = `${WT}/src/ladder.qemut.test.ts`;
const orig = readFileSync(SRC, "utf8");

const mutants = [
  ["CONTROL", "unmutated copy", []],
  ["M1", "claim dropped (Engineer)", [["if (status.claimable !== undefined) {", "if (false && status.claimable !== undefined) {"]]],
  ["M2", "cap scored as a draw (Engineer)", [['return { result: "error", reason: "ply-cap", moves: [...history.moves] };', 'return { result: "draw", reason: "ply-cap", moves: [...history.moves] };']]],
  ["M3", "per-side step accepted (Engineer)", [["if (white.step !== step || black.step !== step) {", "if (false) {"]]],
  ["M4", "a ladder game played in a default row (Engineer)", [["expect(scoreFor(g(5, 1, \"white-wins\"), 5)).toBe(1);", "playLadderGame(2, 1, 1, SHORT_STEP);\n    expect(scoreFor(g(5, 1, \"white-wins\"), 5)).toBe(1);"]]],
  ["M5", "budget scaled (x0.5) in makeSide", [["createLevel(LEVELS[level], { seed, now })", "createLevel({ ...LEVELS[level], budgetMs: LEVELS[level].budgetMs / 2 }, { seed, now })"]]],
  ["M6", "colour alternation dropped (stronger always white)", [["out.push(playLadderGame(weaker, stronger, seed, step));", "out.push(playLadderGame(stronger, weaker, seed, step));"]]],
  ["M7", "verdict A1 game count 100 -> 50", [["const VERDICT_A1_GAMES = 100;", "const VERDICT_A1_GAMES = 50;"]]],
  ["M7b", "short A2 game count 4 -> 2", [["const SHORT_A2_GAMES = 4;", "const SHORT_A2_GAMES = 2;"]]],
  ["M8", "both sides share one clock per step", [["const now = virtualClock(step);", "const now = (SHARED_CLOCKS[step] ??= virtualClock(step));"], ["type LevelId = keyof typeof LEVELS;", "type LevelId = keyof typeof LEVELS;\nconst SHARED_CLOCKS: Record<number, Clock> = {};"]]],
  ["M9", "A4 replay: recorded-ending equality dropped", [["if (ending === null || ending.result !== game.result || ending.reason !== game.reason) {", "if (false) {"]]],
  ["M10", "opening drawn from Math.random, not seededRandom(seed)", [["const opening = seededRandom(seed);", "const opening = Math.random;"]]],
  ["M11", "A1 bar >= 90 -> > 90", [["const bar = criterion === \"A1\" ? pct >= 90 : pct > 50;", "const bar = criterion === \"A1\" ? pct > 90 : pct > 50;"]]],
  ["M12", "claimedDraws counts every draw", [["const claimed = played.filter((g) => g.reason.endsWith(\"(claimed)\")).length;", "const claimed = played.filter((g) => g.result === \"draw\").length;"]]],
  ["M13", "PLY_CAP 600 -> Infinity (hang guard gone)", [["const PLY_CAP = 600;", "const PLY_CAP = Number.POSITIVE_INFINITY;"]]],
  ["M14", "pair scored for the weaker level", [["const score = played.reduce((sum, g) => sum + scoreFor(g, stronger), 0);", "const score = played.reduce((sum, g) => sum + scoreFor(g, weaker), 0);"]]],
  ["M15", "SHORT_STEP 120 -> 60", [["const SHORT_STEP = 120;", "const SHORT_STEP = 60;"]]],
  ["M16", "claim recorded without the (claimed) tag", [["reason: `${status.claimable.draws[0]} (claimed)`", "reason: `${status.claimable.draws[0]}`"]]],
];

const only = process.argv.slice(3);
for (const [id, what, plants] of mutants) {
  if (only.length > 0 && !only.includes(id)) continue;
  let text = orig;
  for (const [from, to] of plants) {
    const n = text.split(from).length - 1;
    if (n !== 1) throw new Error(`${id}: plant site found ${n} times: ${from}`);
    text = text.replace(from, to);
  }
  writeFileSync(MUT, text);
  let out;
  let code = 0;
  try {
    out = execFileSync("npx", ["vitest", "run", "src/ladder.qemut.test.ts"], {
      cwd: WT,
      encoding: "utf8",
      env: (() => { const e = { ...process.env, FORCE_COLOR: "0", NO_COLOR: "1" }; delete e.LADDER_DEEP; return e; })(),
      stdio: ["ignore", "pipe", "pipe"],
    });
  } catch (e) {
    code = e.status;
    out = `${e.stdout}${e.stderr}`;
  } finally {
    rmSync(MUT, { force: true });
  }
  const tests = (out.match(/Tests\s+([^\n]+)/) ?? [])[1] ?? "?";
  const red = [...out.matchAll(/(?:×|FAIL)\s+src\/ladder\.qemut\.test\.ts\s+>\s+([^\n]+)/g)].map((m) => m[1].trim());
  const verdict = id === "CONTROL" ? (code === 0 ? "green" : "RED?!") : code === 0 ? "SURVIVED (default lane)" : "KILLED";
  console.log(`${id}\t${what}\texit ${code}\t${verdict}\tTests ${tests.trim()}`);
  for (const r of [...new Set(red)]) console.log(`\t  red: ${r}`);
}
