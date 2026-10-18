// QE ABC-170 probe B: edge values, tiny budgets, maxNodes sweep with discard identity and quiescence aborts.
import * as tip from "./engine.ts";
import * as ins from "./qe170-engine-instr.ts";
import { parseFen, toFen } from "./fen.ts";
import { legalMoves } from "./legal.ts";
import { search } from "./search.ts";
import { squareName } from "./position.ts";

const tick = (step: number) => { let t = 0; return () => { const r = t; t += step; return r; }; };
const KP = "8/8/8/4k3/8/8/4P3/4K3 w - - 0 1";
const KIWI = "r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1";
const P6 = "r4rk1/1pp1qppp/p1np1n2/2b1p1B1/2B1P1b1/P1NP1N2/1PP1QPPP/R4RK1 w - - 0 10";
const START = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
const P3 = "8/2p5/3p4/KP5r/1R3p1k/8/4P1P1/8 w - - 0 1";
const P4 = "r3k2r/Pppp1ppp/1b3nbN/nP6/BBP1P3/q4N2/Pp1P2PP/R2Q1RK1 w kq - 0 1";
const lab = (m: any) => `${squareName(m.from)}${squareName(m.to)}`;
const legal = (fen: string, m: any) => legalMoves(parseFen(fen)).some((c) => c.from === m.from && c.to === m.to && (c as any).promotion === m.promotion);
const show = (c: any) => c === null ? "null" : `d${c.depth} n${c.nodes} e${c.elapsedMs} ${lab(c.move)} ${c.score}`;

console.log("== B1 maxDepth edge values (kp-vs-k, 10 ms, tick 1; unlimited reaches 7) ==");
for (const v of [0, -1, -Infinity, NaN, 0.5, 1, 1.5, 2.5, 3, 3.999, 7, 8, Infinity, 1e9, "3" as any, null as any]) {
  let r: any; try { r = tip.chooseMove(parseFen(KP), { budgetMs: 10, now: tick(1), maxDepth: v }); console.log(String(JSON.stringify(v) ?? v), show(r), r && legal(KP, r.move)); }
  catch (e) { console.log(String(v), "THREW", (e as Error).message); }
}
console.log("== B2 maxNodes edge values (kiwipete, 5000 ms, tick 1) ==");
for (const v of [0, -1, -Infinity, NaN, 1, 0.5, 1023, 1024, 1025, 3000, Infinity, "20000" as any, null as any]) {
  let r: any; try { r = tip.chooseMove(parseFen(KIWI), { budgetMs: 5000, now: tick(1), maxNodes: v }); console.log(String(JSON.stringify(v) ?? v), show(r), r && legal(KIWI, r.move)); }
  catch (e) { console.log(String(v), "THREW", (e as Error).message); }
}
console.log("== B3 limit + tiny budget (startpos and kp-vs-k) ==");
for (const fen of [START, KP, KIWI]) for (const budgetMs of [NaN, -1, 0, 1, 2, 3, 5]) {
  const free = tip.chooseMove(parseFen(fen), { budgetMs, now: tick(1) });
  const row: string[] = [`free ${show(free)}`];
  for (const md of [1, 2, 3]) {
    const c = tip.chooseMove(parseFen(fen), { budgetMs, now: tick(1), maxDepth: md }) as any;
    const expectDepth = Math.min(free!.depth, md);
    row.push(`md${md}:${c.depth === expectDepth ? "ok" : "BAD d" + c.depth}`);
    if (md >= free!.depth && JSON.stringify(c) !== JSON.stringify(free)) row.push(`md${md}-NOT-IDENTICAL`);
  }
  for (const mn of [1, 600, 2000]) {
    const c = tip.chooseMove(parseFen(fen), { budgetMs, now: tick(1), maxNodes: mn }) as any;
    row.push(`mn${mn}:d${c.depth}${c.depth > free!.depth ? "-DEEPER!" : ""}`);
  }
  console.log(fen.split(" ")[0].slice(0, 12), "budget", budgetMs, row.join(" "));
}
console.log("== B4 maxNodes sweep: bound, discard identity, monotone, FEN restored, quiescence aborts ==");
let rows = 0, boundBad = 0, discardBad = 0, searchBad = 0, monoBad = 0, fenBad = 0, qAborts = 0, fAborts = 0, legalBad = 0;
const searchCache = new Map<string, any>();
for (const fen of [KIWI, P6, START, P3, P4, KP]) {
  const n1 = (tip.chooseMove(parseFen(fen), { budgetMs: 5000, now: tick(1), maxDepth: 1 }) as any).nodes;
  let prevDepth = 0;
  const values = [1, 50, 333, 1000, 1024, 1025, 2048, 3000, 4097, 6000, 8191, 12000, 20000, 27000, 40000, 65536, 90000];
  for (const mn of values) {
    ins.QE.abortInQ = 0; ins.QE.abortInFull = 0;
    const pos = parseFen(fen);
    const c = ins.chooseMove(pos, { budgetMs: 5000, now: tick(1), maxNodes: mn }) as any;
    rows++;
    qAborts += ins.QE.abortInQ; fAborts += ins.QE.abortInFull;
    if (toFen(pos) !== fen) fenBad++;
    if (!legal(fen, c.move)) legalBad++;
    if (c.nodes > Math.max(mn, n1) + 1024) { boundBad++; console.log("BOUND", fen.slice(0, 10), mn, c.nodes); }
    const ref = tip.chooseMove(parseFen(fen), { budgetMs: 5000, now: tick(1), maxDepth: c.depth }) as any;
    if (lab(ref.move) !== lab(c.move) || ref.score !== c.score || ref.depth !== c.depth) { discardBad++; console.log("DISCARD", fen.slice(0, 10), mn, show(c), "vs", show(ref)); }
    const sk = fen + c.depth; if (!searchCache.has(sk)) searchCache.set(sk, search(parseFen(fen), c.depth));
    const s = searchCache.get(sk);
    if (lab(s.move) !== lab(c.move) || s.score !== c.score) { searchBad++; console.log("SEARCH-DIFF", fen.slice(0, 10), "d", c.depth, show(c), "search", lab(s.move), s.score); }
    if (c.depth < prevDepth) { monoBad++; console.log("NONMONO", fen.slice(0, 10), mn, c.depth, prevDepth); }
    prevDepth = c.depth;
    if (mn === 1 || mn === 20000) console.log(fen.slice(0, 12), "mn", mn, show(c), "qAbort", ins.QE.abortInQ, "fullAbort", ins.QE.abortInFull, "n1", n1);
  }
}
console.log(JSON.stringify({ rows, boundBad, discardBad, searchBad, monoBad, fenBad, legalBad, abortsInQuiescence: qAborts, abortsInFullWidth: fAborts }));
