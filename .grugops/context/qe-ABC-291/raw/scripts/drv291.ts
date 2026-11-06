// qe-ABC-291: QE's own driver for ADR-0075's count rows K0 and K3, and the two reports reach and drift. Nothing here reads a clock.
// Each mode runs in its own process. usage: node drv291.ts <mode> <H root> [<B root>]. qe-ABC-303's drv.ts, re-armed:
// ON = search / chooseMove; OFF = searchWithoutPawnShape / chooseMoveWithoutPawnShape.
import { readFileSync } from "node:fs";
const [mode, H, B] = process.argv.slice(2) as [string, string, string | undefined];
const mods = async (r: string) => ({ s: await import(`${r}/src/search.ts`), e: await import(`${r}/src/engine.ts`) });
const h = await mods(H);
const { parseFen, toFen } = await import(`${H}/src/fen.ts`);
const { legalMoves } = await import(`${H}/src/legal.ts`);
const { makeMove, unmakeMove } = await import(`${H}/src/apply.ts`);
const { gameStatus } = await import(`${H}/src/gameend.ts`);
const { squareName } = await import(`${H}/src/position.ts`);
const { MATE_CORPUS } = await import(`${H}/src/search.mate-corpus.ts`);
const print = (x: unknown) => console.log(JSON.stringify(x));
const uci = (m: any) => (m ? `${squareName(m.from)}${squareName(m.to)}` : "none");
const mate = (v: number) => Math.abs(v) > h.s.MATE_SCORE - 1000;
const frozen = (d: number) => ({ budgetMs: 1e9, now: () => 0, maxDepth: d });
const KIWI = "r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1";
const POS6 = "r4rk1/1pp1qppp/p1np1n2/2b1p1B1/2B1P1b1/P1NP1N2/1PP1QPPP/R4RK1 w - - 0 10";
const TWO: [string, string][] = [["kiwipete", KIWI], ["position-6", POS6]];
const same = (x: any, y: any) => x.nodes === y.nodes && x.score === y.score && uci(x.move) === uci(y.move) && x.depth === y.depth;
// ADR-0075 d7 K0 (a)'s seven rows, with K0 (c)'s figures at 8e115110 (se-ABC-291 ...f0c9e801).
const ROWS: [string, string, string, number, number, number, string][] = [
  ["chooseMove", "kiwipete", KIWI, 8, 570174, -116, "e2a6"], ["chooseMove", "kiwipete", KIWI, 9, 1236991, -116, "e2a6"],
  ["chooseMove", "position-6", POS6, 8, 81563, 74, "c3d5"], ["chooseMove", "position-6", POS6, 9, 201352, 65, "c3d5"], ["chooseMove", "position-6", POS6, 10, 398375, 70, "c3d5"],
  ["search", "kiwipete", KIWI, 8, 314231, -83, "e2a6"], ["search", "position-6", POS6, 8, 159750, 74, "c3d5"]];
const read = (f: any, kind: string, fen: string, d: number) => kind === "search" ? f(parseFen(fen), d) : f(parseFen(fen), frozen(d));

if (mode === "k0a") {
  const b = await mods(B as string); let eq = 0;
  for (const [k, name, fen, d] of ROWS) {
    const x = read(k === "search" ? h.s.searchWithoutPawnShape : h.e.chooseMoveWithoutPawnShape, k, fen, d);
    const y = read(k === "search" ? b.s.search : b.e.chooseMove, k, fen, d);
    const ok = same(x, y); if (ok) eq++;
    print({ row: "K0a", k, name, d, nodes: x.nodes, base: y.nodes, score: x.score, baseScore: y.score, move: uci(x.move), baseMove: uci(y.move), ok });
  }
  print({ K0a: eq, of: ROWS.length });
}
if (mode === "k0c") {
  let eq = 0;
  for (const [k, name, fen, d, nodes, score, move] of ROWS) {
    const x = read(k === "search" ? h.s.search : h.e.chooseMove, k, fen, d);
    const ok = x.nodes === nodes && x.score === score && uci(x.move) === move; if (ok) eq++;
    print({ row: "K0c", k, name, d, nodes: x.nodes, want: nodes, score: x.score, wantScore: score, move: uci(x.move), wantMove: move, ok });
  }
  print({ K0c: eq, of: ROWS.length });
}
if (mode === "k0b") {
  const b = await mods(B as string); let eq = 0, n = 0;
  const sDoors = Object.keys(b.s).filter((k) => k.startsWith("searchWithout"));
  const cDoors = Object.keys(b.e).filter((k) => k.startsWith("chooseMoveWithout"));
  const newS = Object.keys(h.s).filter((k) => k.startsWith("searchWithout") && !sDoors.includes(k));
  const newC = Object.keys(h.e).filter((k) => k.startsWith("chooseMoveWithout") && !cDoors.includes(k));
  const lost = [...sDoors.filter((k) => !h.s[k]), ...cDoors.filter((k) => !h.e[k])];
  print({ doors: sDoors.length + cDoors.length, search: sDoors.length, choose: cDoors.length, newS, newC, lost });
  for (const [name, fen] of TWO) {
    for (const k of sDoors) {
      const d = /^searchWithout(Pruning|PruningOrQuiescence)$/.test(k) ? 3 : 5; // alpha-beta off: too wide for depth 5
      const x = h.s[k](parseFen(fen), d), y = b.s[k](parseFen(fen), d); const ok = same(x, y); n++; if (ok) eq++;
      print({ row: "K0b", door: k, name, d, nodes: x.nodes, base: y.nodes, ok });
    }
    for (const k of cDoors) {
      const x = h.e[k](parseFen(fen), frozen(6)), y = b.e[k](parseFen(fen), frozen(6)); const ok = same(x, y); n++; if (ok) eq++;
      print({ row: "K0b", door: k, name, d: 6, nodes: x.nodes, base: y.nodes, ok });
    }
  }
  print({ K0b: eq, of: n });
}
if (mode === "floor") {
  // ADR-0064 B2 on the 287, as K3 reads it: the door's mates at d are same-sign mates for the shipped search() at d5.
  for (const d of [4, 5]) {
    let mates = 0; const bad: string[] = [];
    for (const fen of MATE_CORPUS as string[]) {
      const a = h.s.searchWithoutPawnShape(parseFen(fen), d); if (!mate(a.score)) continue; mates++;
      const c = h.s.search(parseFen(fen), 5);
      if (!mate(c.score) || Math.sign(c.score) !== Math.sign(a.score)) bad.push(fen);
    }
    print({ row: "K3-floor", door: d, head: 5, corpus: (MATE_CORPUS as string[]).length, mates, violations: bad.length, bad });
  }
}
if (mode === "zug") {
  // ADR-0050 d9's table, copied from the ADR: SAN there, written here as from-to. The played move only.
  const rows: [string, string, string, number][] = [
    ["zugzwang.001", "8/8/p1p5/1p5p/1P5p/8/PPP2K1p/4R1rk w - - 0 1", "e1f1", 9],
    ["zugzwang.004", "8/6B1/p5p1/Pp4kp/1P5r/5P1Q/4q1PK/8 w - - 0 32", "h3h4", 11],
    ["zugzwang.005", "8/8/1p1r1k2/p1pPN1p1/P3KnP1/1P6/8/3R4 b - - 0 1", "f4d5", 12],
    ["kpk-b6c6", "2k5/8/1K6/2P5/8/8/8/8 w - - 0 1", "b6c6", 8],
    ["kpk-c6d6", "3k4/8/2K5/3P4/8/8/8/8 w - - 0 1", "c6d6", 8],
    ["kpk-d6e6", "4k3/8/3K4/4P3/8/8/8/8 w - - 0 1", "d6e6", 8],
    ["kpk-e6f6", "5k2/8/4K3/5P2/8/8/8/8 w - - 0 1", "e6f6", 8]];
  let good = 0;
  for (const [name, fen, want, d] of rows) { const c = h.e.chooseMove(parseFen(fen), frozen(d)); const ok = uci(c.move) === want && c.depth === d; if (ok) good++; print({ name, d, want, played: uci(c.move), depth: c.depth, ok }); }
  print({ K3zug: good, of: rows.length });
}
if (mode === "g1") {
  const { PUZZLES } = await import(`${H}/src/puzzle-corpus.ts`);
  const { virtualClock } = await import(`${H}/src/virtual-clock.ts`);
  const base = JSON.parse(readFileSync(`${H}/src/puzzle-suite.baseline.json`, "utf8"));
  const run = (f: any) => { const missed: string[] = [];
    for (const p of PUZZLES as any[]) {
      const c = f(parseFen(p.fen), { budgetMs: base.budgetMs, now: virtualClock(base.stepMs) });
      const got = c === null ? "null" : uci(c.move);
      if (!(p.kind === "do-not-hang" ? got !== p.losing : p.accept.includes(got))) missed.push(p.name);
    } return missed; };
  const off = run(h.e.chooseMoveWithoutPawnShape), on = run(h.e.chooseMove);
  const total = (PUZZLES as any[]).length;
  print({ K3g1: total - on.length, of: total, off: total - off.length, missed: on, newlyMissedAgainstBaseline: on.filter((n) => !base.unsolved.includes(n)), newlyMissedAgainstOff: on.filter((n) => !off.includes(n)) });
}
function the190(): string[] {
  const roots = ["rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1", KIWI, "8/2p5/3p4/KP5r/1R3p1k/8/4P1P1/8 w - - 0 1",
    "r3k2r/Pppp1ppp/1b3nbN/nP6/BBP1P3/q4N2/Pp1P2PP/R2Q1RK1 w kq - 0 1", "rnbq1k1r/pp1Pbppp/2p5/8/2B5/8/PPP1NnPP/RNBQK2R w KQ - 1 8", POS6];
  const ends = ["k7/8/1K6/8/8/8/8/1Q6 w - - 0 1", "k7/8/1K6/8/8/8/8/1R6 w - - 0 1", "7k/8/6K1/8/8/8/8/6Q1 w - - 0 1", "8/8/8/4k3/8/8/4P3/4K3 w - - 0 1", "8/8/8/8/8/k7/8/KR6 w - - 0 1", "8/6p1/8/8/8/8/1P6/k1K5 w - - 0 1"];
  const all: string[] = [];
  for (const fen of roots) { all.push(fen); const p = parseFen(fen);
    for (const m of legalMoves(p)) { const u = makeMove(p, m); if (gameStatus(p).result === "in-progress") all.push(toFen(p)); unmakeMove(p, m, u); } }
  return all.concat(ends);
}
if (mode === "reach") {
  const rows = the190();
  const depths = (f: any) => rows.map((x) => f(parseFen(x), { budgetMs: 1e9, now: () => 0, maxNodes: 47000 }));
  const mean = (x: any[]) => x.reduce((t, c) => t + c.depth, 0) / x.length;
  const on = depths(h.e.chooseMove), off = depths(h.e.chooseMoveWithoutPawnShape);
  print({ rows: rows.length, off: +mean(off).toFixed(4), on: +mean(on).toFixed(4), deeper: on.filter((c, i) => c.depth > off[i].depth).length, shallower: on.filter((c, i) => c.depth < off[i].depth).length, moveDiff: on.filter((c, i) => uci(c.move) !== uci(off[i].move)).length });
}
