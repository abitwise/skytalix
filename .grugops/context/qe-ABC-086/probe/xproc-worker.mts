// QE probe (qe-ABC-086, focus 1): ONE process's readings. argv: budget step order [warm]
//   order = fwd | rev  (rev searches the 30 in reverse, so any cross-call state would land on
//   different positions than in a fwd process); warm = 1 first runs three unrelated searches at
//   other budgets/steps on other clocks, to dirty every module-level table before the readings.
// Prints one JSON line per position: name, move, score, depth, nodes, elapsedMs — all on the
// SHIPPED module's clock, a fresh one per search.
import { chooseMove, createEngine } from "../../../../src/engine.ts";
import { parseFen } from "../../../../src/fen.ts";
import { newGame } from "../../../../src/history.ts";
import { virtualClock } from "../../../../src/virtual-clock.ts";
import { label, thirty } from "./corpus.mts";

const [budgetArg, stepArg, order = "fwd", warm = "0"] = process.argv.slice(2);
const budgetMs = Number(budgetArg);
const step = Number(stepArg);

if (warm === "1") {
  for (const [fen, b, s] of [
    ["r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1", 40, 0.25],
    ["8/2p5/3p4/KP5r/1R3p1k/8/4P1P1/8 w - - 0 1", 30, 1],
    ["rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1", 7, 3],
  ] as const) {
    chooseMove(parseFen(fen), { budgetMs: b, now: virtualClock(s) });
    await createEngine({ budgetMs: b, now: virtualClock(s) })(newGame(fen));
  }
}

const corpus = thirty();
if (order === "rev") corpus.reverse();
const rows = corpus.map(({ name, fen }) => {
  const c = chooseMove(parseFen(fen), { budgetMs, now: virtualClock(step) });
  if (c === null) return { name, move: null };
  return {
    name,
    move: label(c.move),
    score: c.score,
    depth: c.depth,
    nodes: c.nodes,
    elapsedMs: c.elapsedMs,
  };
});
rows.sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0));
for (const r of rows) console.log(JSON.stringify(r));
