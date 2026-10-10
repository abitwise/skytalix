// Architect/Design probe, design-ABC-085 (D4). Read-only use of merged src/ modules; writes nothing.
// Usage (from this directory): node ladder-step.mjs <equiv|floor|games> [step] [pairs, e.g. 5v4,4v3]
//   equiv  - on a virtual clock, is (budget b, step s) the same search as (b/k, s/k)? 50 corpus
//            positions, level 3's budget at steps 120 / 30 / 12. Same move, depth AND nodes => the
//            step subsumes the budget dial, so the harness never needs to touch LEVELS.
//   floor  - completed depth of the levels BELOW the default (budgets 100 and 500 ms) at steps
//            120 / 30 / 10 / 4. Depth 1 is the engine's unabortable floor; a step that pins a
//            level there has stopped measuring that level's budget.
//   games  - real games between levels at one step (default 120): pairs 5v1, 4v3, 5v4, two seeded
//            openings each, both colour orders. Prices a game in plies and real ms, and checks
//            whether a pair plays the SAME game from both chairs (which scores exactly 50 %).
import { performance } from "node:perf_hooks";
import { chooseMove } from "../../../../src/engine.ts";
import { buildCorpus, START_FEN } from "../../../../src/evaluate.mirror-corpus.ts";
import { gameStatusOf, newGame, playMove } from "../../../../src/history.ts";
import { legalMoves } from "../../../../src/legal.ts";
import { createLevel, LEVELS, seededRandom } from "../../../../src/levels.ts";
import { virtualClock } from "../../../../src/virtual-clock.ts";

const mode = process.argv[2];
const corpus = () => buildCorpus().filter((e, i) => !e.name.includes("child") || i % 4 === 0);
const median = (a) => [...a].sort((x, y) => x - y)[Math.floor(a.length / 2)];
const key = (m) => JSON.stringify(m);

if (mode === "equiv") {
  const arms = [
    [3000, 120],
    [750, 30],
    [300, 12],
  ];
  let same = 0;
  let positions = 0;
  for (const { position } of corpus()) {
    positions++;
    const out = arms.map(([b, s]) => chooseMove(position, { budgetMs: b, now: virtualClock(s) }));
    const sig = out.map((c) => `${key(c.move)}|${c.depth}|${c.nodes}`);
    if (sig.every((x) => x === sig[0])) same++;
  }
  console.log(JSON.stringify({ mode, arms, positions, identicalMoveDepthNodes: same }));
} else if (mode === "floor") {
  for (const step of [120, 30, 10, 4]) {
    const row = { mode, step };
    for (const budgetMs of [100, 500]) {
      const depths = [];
      let wall = 0;
      for (const { position } of corpus()) {
        const t0 = performance.now();
        depths.push(chooseMove(position, { budgetMs, now: virtualClock(step) }).depth);
        wall += performance.now() - t0;
      }
      row[`b${budgetMs}`] = {
        readings: Math.ceil(budgetMs / step),
        medianDepth: median(depths),
        atDepth1: depths.filter((d) => d === 1).length,
        realMsPerMove: Number((wall / depths.length).toFixed(1)),
      };
    }
    console.log(JSON.stringify(row));
  }
} else if (mode === "games") {
  const step = Number(process.argv[3] ?? 120);
  const PLY_CAP = 600;
  const OPENING_PLIES = 4;
  const play = (whiteId, blackId, seed) => {
    const history = newGame(START_FEN);
    const pick = seededRandom(seed);
    for (let i = 0; i < OPENING_PLIES; i++) {
      const moves = legalMoves(history.position);
      playMove(history, moves[Math.floor(pick() * moves.length)]);
    }
    const sides = [
      createLevel(LEVELS[whiteId], { seed: seed * 2 + 1, now: virtualClock(step) }),
      createLevel(LEVELS[blackId], { seed: seed * 2 + 2, now: virtualClock(step) }),
    ];
    const t0 = performance.now();
    let status = gameStatusOf(history);
    while (status.result === "in-progress" && status.claimable === undefined) {
      if (history.moves.length >= PLY_CAP) break;
      const choice = sides[history.position.blackToMove ? 1 : 0](history.position);
      playMove(history, choice.move);
      status = gameStatusOf(history);
    }
    const result =
      status.result !== "in-progress" ? status.result : status.claimable ? "draw" : "CAP";
    const reason = status.reason ?? status.claimable?.draws[0] ?? "ply-cap";
    return {
      whiteId,
      blackId,
      seed,
      plies: history.moves.length,
      result,
      reason,
      wallS: Number(((performance.now() - t0) / 1000).toFixed(1)),
      moves: history.moves.map(key).join(","),
    };
  };
  const only = process.argv[4]?.split(",");
  for (const [hi, lo] of [
    [5, 1],
    [4, 3],
    [5, 4],
  ].filter(([h, l]) => only === undefined || only.includes(`${h}v${l}`))) {
    for (const seed of [1, 2]) {
      const a = play(hi, lo, seed);
      const b = play(lo, hi, seed);
      const score = (g) =>
        g.result === "draw" ? 0.5 : (g.result === "white-wins") === (g.whiteId === hi) ? 1 : 0;
      for (const g of [a, b]) {
        const { moves, ...rest } = g;
        console.log(JSON.stringify({ mode, step, pair: `${hi}v${lo}`, ...rest, hiScore: score(g) }));
      }
      console.log(
        JSON.stringify({
          mode,
          step,
          pair: `${hi}v${lo}`,
          seed,
          sameGameBothChairs: a.moves === b.moves,
        }),
      );
    }
  }
} else {
  console.error("usage: node ladder-step.mjs <equiv|floor|games> [step]");
  process.exit(2);
}
