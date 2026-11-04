// se-ABC-270 (copied from se-ABC-274) A2: every evaluation entry of the candidate (W) against the pre-ticket head (B), Object.is,
// on G3's corpus (and mirrors), the taper corpus (every FEN in it, and mirrors) and the 190; evaluateAtPhase at every phase 0..30.
const [W, B] = process.argv.slice(2);
const h = await import(`${W}/src/evaluate.ts`), b = await import(`${B}/src/evaluate.ts`);
const { parseFen } = await import(`${W}/src/fen.ts`);
const { toFen } = await import(`${W}/src/fen.ts`);
const { buildCorpus, mirrorPosition } = await import(`${W}/src/evaluate.mirror-corpus.ts`);
const tc = await import(`${W}/src/evaluate.taper-corpus.ts`);
const END = ["k7/8/1K6/8/8/8/8/1Q6 w - - 0 1","k7/8/1K6/8/8/8/8/1R6 w - - 0 1","7k/8/6K1/8/8/8/8/6Q1 w - - 0 1","8/8/8/4k3/8/8/4P3/4K3 w - - 0 1","8/8/8/8/8/k7/8/KR6 w - - 0 1","8/6p1/8/8/8/8/1P6/k1K5 w - - 0 1"];
const fenSet = new Set<string>();
const g3 = buildCorpus().map((c: any) => toFen(c.position));
for (const f of g3) fenSet.add(f);
const walk = (v: any) => { if (typeof v === "string" && /^[1-8pnbrqkPNBRQK\/]+ [wb] /.test(v)) fenSet.add(v); else if (v && typeof v === "object") for (const x of Object.values(v)) walk(x); };
walk(tc);
for (const f of END) fenSet.add(f);
const fens = [...fenSet];
const positions = fens.flatMap((f) => { const p = parseFen(f); return [p, mirrorPosition(p)]; });
const ENTRIES = ["evaluate", "evaluateWithoutTaper", "evaluateWithoutMobility", "evaluateWithoutPawnCache"];
let rows = 0, miss = 0; const bad: string[] = [];
for (const name of ENTRIES) for (const p of positions) {
  rows++; const x = h[name](p), y = b[name](p);
  if (!Object.is(x, y)) { miss++; if (bad.length < 10) bad.push(`${name} ${toFen(p)}: ${x} / ${y}`); }
}
let phaseRows = 0;
for (const p of positions) for (let ph = 0; ph <= 30; ph++) {
  phaseRows++; rows++; const x = h.evaluateAtPhase(p, ph), y = b.evaluateAtPhase(p, ph);
  if (!Object.is(x, y)) { miss++; if (bad.length < 10) bad.push(`evaluateAtPhase(${ph}) ${toFen(p)}: ${x} / ${y}`); }
}
console.log(JSON.stringify({ distinctFens: fens.length, g3: g3.length, positionsWithMirrors: positions.length, entries: ENTRIES, phaseRows, rows, mismatches: miss, bad }));
