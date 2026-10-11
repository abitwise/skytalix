// qe2-ABC-085 mutant driver (second QE pass). Every plant is re-targeted by QE against the refactored
// src/ladder.test.ts at dacbf42a, not copied from the SE's driver. Default lane only (LADDER_DEEP deleted
// from env). Each mutant is an exact-string plant, asserted to match exactly once, in a temp copy
// src/ladder.qe2mut.test.ts that runs alone and is then deleted. The X rows are plants at the CALL SITES the
// refactor created (the deep lane hands its inputs to the pinned pure functions); they are read, not run,
// in the deep lane.
import { execFileSync } from "node:child_process";
import { readFileSync, rmSync, writeFileSync } from "node:fs";

const WT = process.argv[2];
const SRC = `${WT}/src/ladder.test.ts`;
const MUT = `${WT}/src/ladder.qe2mut.test.ts`;
const orig = readFileSync(SRC, "utf8");

const mutants = [
  ["CONTROL", "unmutated copy", []],
  ["M1", "claim branch disabled in adjudicate", [["if (status.claimable !== undefined) {", "if (false && status.claimable !== undefined) {"]]],
  ["M2", "ply cap returns draw", [['return { result: "error", reason: "ply-cap", moves: [...history.moves] };', 'return { result: "draw", reason: "ply-cap", moves: [...history.moves] };']]],
  ["M3", "per-side step check disabled", [["if (white.step !== step || black.step !== step) {", "if (false) {"]]],
  ["M4", "one real 2v1 ladder game in a default row", [['expect(scoreFor(g(5, 1, "white-wins"), 5)).toBe(1);', 'playLadderGame(2, 1, 1, SHORT_STEP);\n    expect(scoreFor(g(5, 1, "white-wins"), 5)).toBe(1);']]],
  ["M5", "makeSide halves budgetMs (plant moved: createLevel( -> make()", [["choose: make(LEVELS[level], { seed, now })", "choose: make({ ...LEVELS[level], budgetMs: LEVELS[level].budgetMs / 2 }, { seed, now })"]]],
  ["M6", "colour alternation dropped (plant moved: playPair -> colourSchedule)", [["out.push({ seed, white: weaker, black: stronger });", "out.push({ seed, white: stronger, black: weaker });"]]],
  ["M7", "VERDICT_A1_GAMES 100 -> 50", [["const VERDICT_A1_GAMES = 100;", "const VERDICT_A1_GAMES = 50;"]]],
  ["M7b", "SHORT_A2_GAMES 4 -> 2", [["const SHORT_A2_GAMES = 4;", "const SHORT_A2_GAMES = 2;"]]],
  ["M8", "both sides share one clock per step", [["const now = virtualClock(step);", "const now = (SHARED_CLOCKS[step] ??= virtualClock(step));"], ["type LevelId = keyof typeof LEVELS;", "type LevelId = keyof typeof LEVELS;\nconst SHARED_CLOCKS: Record<number, Clock> = {};"]]],
  ["M9", "A4 replay recorded-ending equality dropped", [["if (ending === null || ending.result !== game.result || ending.reason !== game.reason) {", "if (false) {"]]],
  ["M10", "opening from Math.random, not seededRandom(seed)", [["const opening = seededRandom(seed);", "const opening = Math.random;"]]],
  ["M11", "A1 bar >= 90 -> > 90 (plant moved: bar -> met in summarizePair)", [['const met = criterion === "A1" ? pct >= 90 : pct > 50;', 'const met = criterion === "A1" ? pct > 90 : pct > 50;']]],
  ["M12", "claimed counts every draw", [['const claimed = played.filter((g) => g.reason.endsWith("(claimed)")).length;', 'const claimed = played.filter((g) => g.result === "draw").length;']]],
  ["M13", "PLY_CAP 600 -> Infinity (the constant)", [["const PLY_CAP = 600;", "const PLY_CAP = Number.POSITIVE_INFINITY;"]]],
  ["M14", "pair scored for the weaker level, inside summarizePair (score, wins)", [["const score = played.reduce((sum, g) => sum + scoreFor(g, stronger), 0);\n  const wins = played.filter((g) => scoreFor(g, stronger) === 1).length;", "const weakerOf = (g: LadderGame) => (g.white === stronger ? g.black : g.white);\n  const score = played.reduce((sum, g) => sum + scoreFor(g, weakerOf(g)), 0);\n  const wins = played.filter((g) => scoreFor(g, weakerOf(g)) === 1).length;"]]],
  ["M15", "SHORT_STEP 120 -> 60", [["const SHORT_STEP = 120;", "const SHORT_STEP = 60;"]]],
  ["M16", "claim recorded without the (claimed) tag", [["reason: `${status.claimable.draws[0]} (claimed)`", "reason: `${status.claimable.draws[0]}`"]]],
  // Call-site plants created by the refactor. Default lane: survive by construction (the deep block is not defined).
  ["X6", "CALL SITE: playPair ignores the schedule's colours (stronger always white)", [["playLadderGame(white, black, seed, step),", "playLadderGame(stronger, weaker, seed, step),"]]],
  ["X13", "CALL SITE: runGame handed Infinity instead of PLY_CAP in playLadderGame (the SE's named gap)", [["    },\n    PLY_CAP,\n  );", "    },\n    Number.POSITIVE_INFINITY,\n  );"]]],
  ["X14", "CALL SITE: the deep row summarizes for the weaker level", [["summarizePair(\n            played,\n            stronger,\n            criterion,\n          );", "summarizePair(\n            played,\n            weaker,\n            criterion,\n          );"]]],
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
    out = execFileSync("npx", ["vitest", "run", "src/ladder.qe2mut.test.ts"], {
      cwd: WT,
      encoding: "utf8",
      env: (() => {
        const e = { ...process.env, FORCE_COLOR: "0", NO_COLOR: "1" };
        delete e.LADDER_DEEP;
        return e;
      })(),
      stdio: ["ignore", "pipe", "pipe"],
    });
  } catch (e) {
    code = e.status;
    out = `${e.stdout}${e.stderr}`;
  } finally {
    rmSync(MUT, { force: true });
  }
  const tests = (out.match(/Tests\s+([^\n]+)/) ?? [])[1] ?? "?";
  const red = [...out.matchAll(/(?:×|FAIL)\s+src\/ladder\.qe2mut\.test\.ts\s+>\s+([^\n]+)/g)].map((m) => m[1].trim());
  const verdict = id === "CONTROL" ? (code === 0 ? "green" : "RED?!") : code === 0 ? "SURVIVED (default lane)" : "KILLED";
  console.log(`${id}\t${what}\texit ${code}\t${verdict}\tTests ${tests.trim()}`);
  for (const r of [...new Set(red)]) console.log(`\t  red: ${r}`);
}
