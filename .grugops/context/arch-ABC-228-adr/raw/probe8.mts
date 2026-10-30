// Usage: node probe8.mts <scratch-root>. ABC-229's d5 drift on ABC-121's 190, search(): quiet queen promotions on top of
// full evasions, against full evasions (ABC-229's door if ABC-228 lands first).
const R = process.argv[2];
const fen = await import(`${R}/probe/src/fen.ts`); const s = await import(`${R}/probe/src/search.ts`); const q = await import(`${R}/probe/src/quiescence.ts`);
const legal = await import(`${R}/probe/src/legal.ts`); const apply = await import(`${R}/probe/src/apply.ts`); const ge = await import(`${R}/probe/src/gameend.ts`); const mv = await import(`${R}/probe/src/moves.ts`);
const PR = q.PROBE;
const set = (o: any) => { Object.assign(PR, { evasions: false, promotions: "none", promoLast: false, checkCap: 99, minQply: 0, mateOnlyBeyond: false, cap: 8 }, o); PR.evasionNodes = 0; PR.mated = 0; };
const t0 = process.cpuUsage(); const cpu = () => { const t = process.cpuUsage(t0); return (t.user + t.system) / 1e6; };
const KIWI = "r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1";
const P6 = "r4rk1/1pp1qppp/p1np1n2/2b1p1B1/2B1P1b1/P1NP1N2/1PP1QPPP/R4RK1 w - - 0 10";
console.log(`cpu after cap test ${cpu().toFixed(1)} s`);
// the 190, built as src/search.pvs-lmr.test.ts builds it
const ROOTS = ["rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1", KIWI, "8/2p5/3p4/KP5r/1R3p1k/8/4P1P1/8 w - - 0 1", "r3k2r/Pppp1ppp/1b3nbN/nP6/BBP1P3/q4N2/Pp1P2PP/R2Q1RK1 w kq - 0 1", "rnbq1k1r/pp1Pbppp/2p5/8/2B5/8/PPP1NnPP/RNBQK2R w KQ - 1 8", P6];
const END = ["k7/8/1K6/8/8/8/8/1Q6 w - - 0 1", "k7/8/1K6/8/8/8/8/1R6 w - - 0 1", "7k/8/6K1/8/8/8/8/6Q1 w - - 0 1", "8/8/8/4k3/8/8/4P3/4K3 w - - 0 1", "8/8/8/8/8/k7/8/KR6 w - - 0 1", "8/6p1/8/8/8/8/1P6/k1K5 w - - 0 1"];
const corpus: string[] = [];
for (const f of ROOTS) { corpus.push(f); const p = fen.parseFen(f); for (const m of legal.legalMoves(p)) { const u = apply.makeMove(p, m); if (ge.gameStatus(p).result === "in-progress") corpus.push(fen.toFen(p)); apply.unmakeMove(p, m, u); } }
corpus.push(...END);
console.log(`corpus ${corpus.length}`);
const isMate = (x: number) => Math.abs(x) > 30_000 - 1_000;
let n = 0, within = 0, max = 0, maxAt = "", flips = 0, moveDiff = 0, done = 0; const diffs: number[] = [];
for (const f of corpus) {
  if (cpu() > 200) { console.log("CPU guard hit; stopping the drift loop"); break; }
  set({ evasions: true }); const a = s.search(fen.parseFen(f), 5); set({ evasions: true, promotions: "queen" }); const b = s.search(fen.parseFen(f), 5); done++;
  if (isMate(a.score) !== isMate(b.score)) { flips++; continue; }
  if (isMate(a.score)) continue;
  n++; const d = Math.abs(a.score - b.score); diffs.push(d); if (d <= 25) within++; if (d > max) { max = d; maxAt = `${f} door ${a.score} ev ${b.score}`; }
  if ((a.move?.from !== b.move?.from) || (a.move?.to !== b.move?.to)) moveDiff++;
}
diffs.sort((x, y) => x - y);
console.log(`d5 drift search() ev+qQ vs ev: positions done ${done}/${corpus.length}; non-mate ${n}; within 25 cp ${within} (${(100 * within / n).toFixed(2)} %); max ${max} at ${maxAt}; p95 ${diffs[Math.floor(0.95 * (diffs.length - 1))]}; mate-status flips ${flips}; root move differs ${moveDiff}`);
console.log(`total cpu ${cpu().toFixed(1)} s`);
