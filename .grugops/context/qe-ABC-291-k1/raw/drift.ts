// qe-ABC-291-k1: why drift at d5 moved. Corpus and row form copied from arch-ABC-291-probe's e4bprobe.ts drift mode. Deterministic counts, no timing.
// Usage: node drift.ts <tree> factor | row <name> | base. <tree> is a scratch copy of src; tip's has the scratch-only chooseMoveFlags pass-through.
import { pathToFileURL } from "node:url";
import { join, resolve } from "node:path";
const tree = resolve(process.argv[2] as string), mode = process.argv[3] as string, arg = process.argv[4];
const load = (f: string) => import(pathToFileURL(join(tree, "src", f)).href);
const { makeMove, unmakeMove } = await load("apply.ts");
const eng = await load("engine.ts");
const ev = await load("evaluate.ts");
const { parseFen, toFen } = await load("fen.ts");
const { gameStatus } = await load("gameend.ts");
const { legalMoves } = await load("legal.ts");
const { squareName } = await load("position.ts");
const { MATE_SCORE } = await load("search.ts");
const ROOTS = [
  ["startpos", "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"],
  ["kiwipete", "r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1"],
  ["position-3", "8/2p5/3p4/KP5r/1R3p1k/8/4P1P1/8 w - - 0 1"],
  ["position-4", "r3k2r/Pppp1ppp/1b3nbN/nP6/BBP1P3/q4N2/Pp1P2PP/R2Q1RK1 w kq - 0 1"],
  ["position-5", "rnbq1k1r/pp1Pbppp/2p5/8/2B5/8/PPP1NnPP/RNBQK2R w KQ - 1 8"],
  ["position-6", "r4rk1/1pp1qppp/p1np1n2/2b1p1B1/2B1P1b1/P1NP1N2/1PP1QPPP/R4RK1 w - - 0 10"],
];
const ENDGAMES = [
  ["kq-corner", "k7/8/1K6/8/8/8/8/1Q6 w - - 0 1"], ["kr-corner", "k7/8/1K6/8/8/8/8/1R6 w - - 0 1"], ["kqk-h8", "7k/8/6K1/8/8/8/8/6Q1 w - - 0 1"],
  ["kp-vs-k", "8/8/8/4k3/8/8/4P3/4K3 w - - 0 1"], ["krk-a-file", "8/8/8/8/8/k7/8/KR6 w - - 0 1"], ["pawn-race", "8/6p1/8/8/8/8/1P6/k1K5 w - - 0 1"],
];
const mv = (m: any) => (m ? squareName(m.from) + squareName(m.to) + (m.promotion ? "q" : "") : "-");
function corpus(): [string, string][] {
  const out: [string, string][] = [];
  for (const [name, fen] of ROOTS as [string, string][]) {
    out.push([name, fen]);
    const p = parseFen(fen);
    for (const m of legalMoves(p)) {
      const u = makeMove(p, m);
      if (gameStatus(p).result === "in-progress") out.push([`${name}/${mv(m)}`, toFen(p)]);
      unmakeMove(p, m, u);
    }
  }
  return [...out, ...(ENDGAMES as [string, string][])];
}
const isMate = (s: number) => Math.abs(s) > MATE_SCORE - 1000;
const opts = (d: number) => ({ budgetMs: 1e9, now: () => 0, maxDepth: d });
const run = (fen: string, d: number, flags: object) => eng.chooseMoveFlags(parseFen(fen), opts(d), flags);
const off = (p: any) => ev.evaluateAtPhaseWithoutPawnShape(p, ev.phaseOf(p));
const staticPart = (p: any) => ev.evaluate(p) - off(p); // for the side to move
const CONFIGS: Record<string, object> = {
  shipped: {},
  noMoveCount: { moveCount: false },
  noCountermove: { countermove: false },
  noBundle: { moveCount: false, countermove: false },
};
// every main-tree selective rule off: alpha-beta and quiescence over a full-width tree. seePruning stays on: with it off the
// quiescence record is RULES_TAPERED, which holds no shape part, so ON and OFF read one evaluation (the first form of this row, void).
const FULL = { pvs: false, reductions: false, nullMove: false, futility: false, moveCount: false, countermove: false, aspiration: false };
function pair(fen: string, d: number, flags: object) {
  const a = run(fen, d, { ...flags, pawnShape: false }), b = run(fen, d, { ...flags, pawnShape: true });
  return { a, b };
}
if (mode === "factor") {
  const depth = 5;
  for (const [cfg, flags] of Object.entries(CONFIGS)) {
    let n = 0, within = 0, max = 0, maxName = "", mateFlip = 0, signFlip = 0, moveDiff = 0, sum = 0; const over: string[] = [];
    for (const [name, fen] of corpus()) {
      const { a, b } = pair(fen, depth, flags);
      if (mv(a.move) !== mv(b.move)) moveDiff++;
      if (isMate(a.score) !== isMate(b.score)) { mateFlip++; continue; }
      if (isMate(a.score)) { if (Math.sign(a.score) !== Math.sign(b.score)) signFlip++; continue; }
      n++;
      const dd = Math.abs(a.score - b.score); sum += dd;
      if (dd <= 25) within++; else over.push(`${name} ${a.score}->${b.score} (${mv(a.move)},${mv(b.move)})`);
      if (dd > max) { max = dd; maxName = `${name} ${a.score}->${b.score}`; }
    }
    console.log(JSON.stringify({ cfg, depth, nonMate: n, withinPct: +(100 * within / n).toFixed(2), max, maxName, mateFlip, signFlip, moveDiff, meanAbs: +(sum / n).toFixed(2), over }));
  }
} else if (mode === "base") {
  const rows = corpus().map(([name, fen]) => { const c = eng.chooseMove(parseFen(fen), opts(5)); return `${name} ${c.score} ${mv(c.move)} ${c.nodes}`; });
  console.log(rows.join("\n"));
} else if (mode === "doors") {
  const rows = corpus().map(([name, fen]) => { const c = eng.chooseMoveWithoutPawnShape(parseFen(fen), opts(5)); return `${name} ${c.score} ${mv(c.move)} ${c.nodes}`; });
  console.log(rows.join("\n"));
} else if (mode === "row") {
  const hit = corpus().find(([n]) => n === arg);
  if (!hit) throw new Error(`no row ${arg}`);
  const fen = hit[1];
  const p = parseFen(fen);
  console.log(JSON.stringify({ row: arg, fen, staticAtRoot: staticPart(p), seam: ev.pawnShapeForTest(p) }));
  for (const d of [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]) {
    const { a, b } = pair(fen, d, {});
    console.log(JSON.stringify({ shipped: d, off: a.score, offMove: mv(a.move), offNodes: a.nodes, on: b.score, onMove: mv(b.move), onNodes: b.nodes, delta: b.score - a.score }));
  }
  for (const [cfg, flags] of Object.entries({ ...CONFIGS, noFutility: { futility: false }, noNull: { nullMove: false }, noReductions: { reductions: false }, noAspiration: { aspiration: false } })) {
    const { a, b } = pair(fen, 5, flags);
    console.log(JSON.stringify({ cfg, depth: 5, off: a.score, offMove: mv(a.move), offNodes: a.nodes, on: b.score, onMove: mv(b.move), onNodes: b.nodes, delta: b.score - a.score }));
  }
  for (const d of [3, 4, 5]) {
    const { a, b } = pair(fen, d, FULL);
    console.log(JSON.stringify({ fullWidth: d, off: a.score, offMove: mv(a.move), offNodes: a.nodes, on: b.score, onMove: mv(b.move), onNodes: b.nodes, delta: b.score - a.score }));
  }
  // each root move's value under both forms: the child searched at d-1 and negated
  const rows: any[] = [];
  for (const m of legalMoves(p)) {
    const u = makeMove(p, m); const cf = toFen(p);
    const st = staticPart(p); unmakeMove(p, m, u);
    const { a, b } = pair(cf, 4, {});
    const fa = run(cf, 4, { ...FULL, pawnShape: false }), fb = run(cf, 4, { ...FULL, pawnShape: true });
    rows.push({ m: mv(m), off: a ? -a.score : null, on: b ? -b.score : null, fullOff: fa ? -fa.score : null, fullOn: fb ? -fb.score : null, staticChild: -st });
  }
  rows.sort((x, y) => (y.on ?? -1e9) - (x.on ?? -1e9));
  for (const r of rows.slice(0, 8)) console.log(JSON.stringify(r));
  // the line under each form, by re-search at each ply; the leaf's static part
  for (const form of [false, true]) {
    const q = parseFen(fen); const line: string[] = []; const parts: number[] = [];
    for (let d = 5; d >= 1; d--) {
      const c = run(toFen(q), d, { pawnShape: form });
      if (!c) break;
      line.push(mv(c.move)); makeMove(q, c.move); parts.push(staticPart(q));
    }
    console.log(JSON.stringify({ line: form ? "on" : "off", moves: line.join(" "), plies: line.length, leafFen: toFen(q), staticByPly_forSideToMoveThere: parts, leafFromRoot: (line.length % 2 ? -1 : 1) * (parts.at(-1) as number) }));
  }
} else if (mode === "six") {
  const names = (arg as string).split(",");
  for (const name of names) {
    const fen = (corpus().find(([n]) => n === name) as string[])[1] as string;
    const o: any = { row: name };
    for (const [k, flags] of [["shipped", {}], ["noMoveCount", { moveCount: false }], ["noBundle", { moveCount: false, countermove: false }], ["noReductions", { reductions: false }], ["full", FULL]] as [string, object][]) {
      const { a, b } = pair(fen, 5, flags);
      o[k] = [a.score, b.score, b.score - a.score];
    }
    console.log(JSON.stringify(o));
  }
} else if (mode === "leaf") {
  // the static part along a named line from a row: node drift.ts <tree> leaf <row> <moves,comma>
  const fen = (corpus().find(([n]) => n === arg) as string[])[1] as string;
  const p = parseFen(fen);
  for (const name of (process.argv[5] as string).split(",")) {
    const m = legalMoves(p).find((x: any) => mv(x) === name);
    if (!m) throw new Error(`no move ${name}`);
    makeMove(p, m);
    const s = ev.pawnShapeForTest(p);
    const side = (x: any) => [x.connected.mg, x.phalanx.mg, x.backward.mg];
    console.log(JSON.stringify({ after: name, white: side(s.white), black: side(s.black), staticForSideToMove: staticPart(p), blackToMove: p.blackToMove }));
  }
} else throw new Error(`mode ${mode}`);
