// qe-ABC-274 A2 (+A4 mirror spot-check), independent re-check, one process: every evaluation entry of H against B under Object.is.
// Corpora: G3's 184, every FEN in src/evaluate.taper-corpus.ts, the 6 endgames, the mate corpus (287), a seeded random-play
// corpus, and legal-count extreme boards (15 non-king pieces a side) aimed at the packed split's edge. Each also mirrored.
const [S] = process.argv.slice(2);
const h = await import(`${S}/H/src/evaluate.ts`), b = await import(`${S}/B/src/evaluate.ts`);
const { parseFen, toFen } = await import(`${S}/H/src/fen.ts`);
const { buildCorpus, mirrorPosition } = await import(`${S}/H/src/evaluate.mirror-corpus.ts`);
const tc = await import(`${S}/H/src/evaluate.taper-corpus.ts`);
const { MATE_CORPUS } = await import(`${S}/H/src/search.mate-corpus.ts`);
const { legalMoves } = await import(`${S}/H/src/legal.ts`);
const { makeMove } = await import(`${S}/H/src/apply.ts`);
const END = ["k7/8/1K6/8/8/8/8/1Q6 w - - 0 1", "k7/8/1K6/8/8/8/8/1R6 w - - 0 1", "7k/8/6K1/8/8/8/8/6Q1 w - - 0 1", "8/8/8/4k3/8/8/4P3/4K3 w - - 0 1", "8/8/8/8/8/k7/8/KR6 w - - 0 1", "8/6p1/8/8/8/8/1P6/k1K5 w - - 0 1"];
const EXTREME = [
  "kn6/pp6/8/8/QQQQQQQQ/QQQQQQQ1/7K/8 w - - 0 1", "kn6/pp6/8/8/QQQQQQQQ/QQQQQQQ1/7K/8 b - - 0 1", // 15 white queens, shielded black king
  "8/7k/qqqqqqq1/qqqqqqqq/8/8/PP6/KN6 b - - 0 1", "8/7k/qqqqqqq1/qqqqqqqq/8/8/PP6/KN6 w - - 0 1", // 15 black queens
  "k7/2PPPPPP/8/8/8/8/PP6/4K3 w - - 0 1", "4k3/8/8/8/8/8/2pppppp/K7 b - - 0 1", // 6-8 passers, low phase
  "kn6/pp6/8/8/RRRRRRRR/RRRRRRR1/7K/8 w - - 0 1", "k7/8/8/8/8/8/8/7K w - - 0 1", "kn6/pp6/8/8/NNNNNNNN/BBBBBBB1/7K/8 w - - 0 1",
];
const fenSet = new Set<string>();
const g3 = buildCorpus().map((c: any) => toFen(c.position)); for (const f of g3) fenSet.add(f);
let taperFens = 0; const walk = (v: any) => { if (typeof v === "string" && /^[1-8pnbrqkPNBRQK/]+ [wb] /.test(v)) { taperFens++; fenSet.add(v); } else if (v && typeof v === "object") for (const x of Object.values(v)) walk(x); };
walk(tc); for (const f of END) fenSet.add(f); for (const f of MATE_CORPUS) fenSet.add(f); for (const f of EXTREME) fenSet.add(f);
// seeded random play (LCG), 400 games x <= 160 plies, every position
let seed = 274274; const rnd = (n: number) => { seed = (Math.imul(seed, 1103515245) + 12345) >>> 0; return seed % n; };
let randomPositions = 0;
for (let g = 0; g < 400; g++) { const p = parseFen("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1");
  for (let ply = 0; ply < 160; ply++) { const ms = legalMoves(p); if (ms.length === 0) break; makeMove(p, ms[rnd(ms.length)]); const f = toFen(p); if (!fenSet.has(f)) { fenSet.add(f); randomPositions++; } } }
const fens = [...fenSet];
let rejected: string[] = [];
const positionsOf = (f: string) => { try { const p = parseFen(f); return [p, mirrorPosition(p)]; } catch (e) { rejected.push(f); return null; } };
const ENTRIES = ["evaluate", "evaluateWithoutTaper", "evaluateWithoutMobility", "evaluateWithoutPawnCache"];
let rows = 0, miss = 0, mirrorMiss = 0, mirrorRows = 0, phaseRows = 0, phaseOfMiss = 0; const bad: string[] = [];
for (const f of fens) {
  const pm = positionsOf(f); if (!pm) continue; const [p, m] = pm;
  for (const q of [p, m]) {
    for (const name of ENTRIES) for (let rep = 0; rep < 2; rep++) { rows++; const x = h[name](q), y = b[name](q); if (!Object.is(x, y)) { miss++; if (bad.length < 10) bad.push(`${name} ${toFen(q)}: ${x} / ${y}`); } }
    if (h.phaseOf(q) !== b.phaseOf(q)) phaseOfMiss++;
    for (let ph = 0; ph <= 30; ph++) { phaseRows++; rows++; const x = h.evaluateAtPhase(q, ph), y = b.evaluateAtPhase(q, ph); if (!Object.is(x, y)) { miss++; if (bad.length < 10) bad.push(`evaluateAtPhase(${ph}) ${toFen(q)}: ${x} / ${y}`); } }
  }
  mirrorRows++; if (!Object.is(h.evaluate(p), h.evaluate(m))) mirrorMiss++;
}
const ext = EXTREME.filter((f) => !rejected.includes(f)).map((f) => { const p = parseFen(f); return { f, H: h.evaluate(p), B: b.evaluate(p), eq: Object.is(h.evaluate(p), b.evaluate(p)) }; });
console.log(JSON.stringify({ distinctFens: fens.length, g3: g3.length, taperFenStrings: taperFens, mate: MATE_CORPUS.length, extreme: EXTREME.length, randomPositions, positionsWithMirrors: fens.length * 2, entries: ENTRIES, phaseRows, rows, mismatches: miss, phaseOfMismatches: phaseOfMiss, mirrorRows, mirrorMisses: mirrorMiss, rejected, bad }));
for (const e of ext) console.log(JSON.stringify(e));
