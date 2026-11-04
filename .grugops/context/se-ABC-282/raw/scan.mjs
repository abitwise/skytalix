// se-ABC-282 fixture scan (ADR-0071 D9, D12): small-H rows on an instrumented head copy.
// Usage: node scan.mjs <instrumented-root> <named.json> <positions.json> <Hmin> <Hmax> <divisor: softMs = H / divisor>   (prints JSON lines)
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";

const [root, namedPath, posPath, hMin, hMax, divisor] = process.argv.slice(2);
const imp = (f) => import(pathToFileURL(join(root, "src", f)).href);
const { chooseMove } = await imp("engine.ts");
const { parseFen, toFen } = await imp("fen.ts");
const { legalMoves } = await imp("legal.ts");
const { makeMove } = await imp("apply.ts");
const { squareName } = await imp("position.ts");
const { virtualClock } = await imp("virtual-clock.ts");
const { MATE_CORPUS } = await imp("search.mate-corpus.ts");
const MATE_FLOOR = (await imp("transposition.ts")).MATE_FLOOR;

const k25 = [
  ...JSON.parse(readFileSync(namedPath, "utf8")).map((p) => p.fen),
  ...JSON.parse(readFileSync(posPath, "utf8")).skytalix.map((p) => p.fen),
];
const extra = [
  "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
  "8/2p5/3p4/KP5r/1R3p1k/8/4P1P1/8 w - - 0 1",
  "r3k2r/Pppp1ppp/1b3nbN/nP6/BBP1P3/q4N2/Pp1P2PP/R2Q1RK1 w kq - 0 1",
  "rnbq1k1r/pp1Pbppp/2p5/8/2B5/8/PPP1NnPP/RNBQK2R w KQ - 1 8",
  "8/8/8/4k3/8/8/4P3/4K3 w - - 0 1",
  "8/6p1/8/8/8/8/1P6/k1K5 w - - 0 1",
];
const children = [];
for (const fen of [...k25, ...extra]) {
  for (const m of legalMoves(parseFen(fen))) {
    const p = parseFen(fen);
    makeMove(p, m);
    if (legalMoves(p).length > 0) children.push(toFen(p));
  }
}
const all = [...new Set([...extra, ...k25, ...MATE_CORPUS, ...children])];
console.error("positions", all.length);
const sq = (m) => squareName(m.from) + squareName(m.to);
const pretty = (e) => squareName(e.from) + squareName(e.to);

for (const fen of all) {
  for (let H = Number(hMin); H <= Number(hMax); H++) {
    globalThis.__abort = undefined;
    const c = chooseMove(parseFen(fen), { budgetMs: H, now: virtualClock(1), softMs: H / Number(divisor) });
    if (c === null) break;
    const ab = globalThis.__abort;
    if (ab === undefined) continue;
    // Split the trace into passes: a new pass starts at idx 1.
    const passes = [];
    for (const e of ab.t) {
      if (e.idx === 1) passes.push([]);
      passes.at(-1).push(e);
    }
    const kinds = [];
    const fl = passes.filter((p) => {
      const i = p.find((e) => e.isI);
      return i !== undefined && i.score <= i.run && p.some((e) => !e.isI && e.score > i.score);
    });
    if (fl.length > 0 && c.partial === undefined) kinds.push("I-not-exact-other-above");
    const I = ab.t.find((e) => e.isI);
    if (c.partial) {
      const keeperPass = passes.findIndex((p) => p.some((e) => pretty(e) === sq(c.move) && e.score === c.score));
      const row = passes[keeperPass].find((e) => pretty(e) === sq(c.move) && e.score === c.score);
      kinds.push(row.b === Infinity && row.a === -Infinity ? "keep-full" : "keep-window");
      if (row.score >= row.b) kinds.push("keep-fail-high");
      if (keeperPass < passes.length - 1) kinds.push("keep-earlier-pass");
      if (c.score >= MATE_FLOOR) kinds.push("keep-mate");
    } else {
      if (I !== undefined && I.score <= -MATE_FLOOR) kinds.push("incumbent-mated");
      if (I !== undefined && passes.length === 1 && passes[0].length >= 2) kinds.push("no-keep");
    }
    if (kinds.length === 0) continue;
    console.log(JSON.stringify({ fen, H, kinds, passes: passes.length, iter: ab.iter, depth: c.depth, nodes: c.nodes, move: sq(c.move), score: c.score, incumbent: pretty(ab), incumbentScore: ab.score, Iscore: I?.score, partial: c.partial === true }));
  }
}
