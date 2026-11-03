// R1: ABC-083 A2 (b) crossing — tracer difference G_PAWN_ON_G6 − SHELTERED, per term, at the candidate and base tables.
const WT = process.argv[2]; // scratch worktree at da3f8599
const BASE = process.argv[3]; // scratch src copy with 03fcaaa0's table
const T = await import(`${WT}/tools/tune/tracer.ts`);
const { parseFen } = await import(`${WT}/src/fen.ts`);
const cand = await import(`${WT}/src/evaluate.ts`);
const base = await import(`${BASE}/evaluate.ts`);
const baseP = await import(`${BASE}/evaluate-params.ts`);
const tabs = { cand: T.SHIPPED, base: T.tableOf(baseP) };
const PAIRS = [
  ["A2 (b)", "6k1/5ppp/6P1/8/8/8/5P1P/6K1 w - - 0 1", "6k1/5ppp/8/8/8/8/5PPP/6K1 w - - 0 1"],
  ["A2 (a)", "6k1/5ppp/8/8/8/8/5P1P/6K1 w - - 0 1", "6k1/5ppp/8/8/8/8/5PPP/6K1 w - - 0 1"],
  ["A3 (b)", "6k1/5ppp/8/4P3/8/8/6PP/6K1 w - - 0 1", "6k1/5ppp/8/5P2/8/8/6PP/6K1 w - - 0 1"],
];
const name = (t: number): string => {
  if (t < T.T_PST) return `MAT[${t}]`;
  if (t < T.T_PASS) { const i = t - T.T_PST; const s = i % 64; return `PST.${T.PST_NAMES[Math.floor(i / 64)]}[${"abcdefgh"[s % 8]}${8 - Math.floor(s / 8)} own-view idx ${s}]`; }
  if (t < T.T_DBL) return `PASSED[rank idx ${t - T.T_PASS + 1}]`;
  return ["DOUBLED", "ISOLATED", "SHELTER", "HALF_OPEN", "OPEN"][t - T.T_DBL] as string;
};
for (const [id, lowFen, highFen] of PAIRS) {
  const lo = T.trace(parseFen(lowFen)); const hi = T.trace(parseFen(highFen));
  const d = new Map<number, number>();
  for (let i = 0; i < lo.f.length; i += 2) d.set(lo.f[i], (d.get(lo.f[i]) ?? 0) + lo.f[i + 1]);
  for (let i = 0; i < hi.f.length; i += 2) d.set(hi.f[i], (d.get(hi.f[i]) ?? 0) - hi.f[i + 1]);
  console.log(`== ${id}: phase low ${lo.w} high ${hi.w}; Δm (mobility count) ${lo.m - hi.m}`);
  for (const [t, c] of [...d].sort((a, b) => a[0] - b[0])) if (c !== 0) {
    const row = Object.entries(tabs).map(([k, th]) => `${k} mg ${th.mg[t]} eg ${th.eg[t]} → contrib@w${lo.w} ${((lo.w * th.mg[t] + (24 - lo.w) * th.eg[t]) * c / 24).toFixed(2)}`).join(" | ");
    console.log(`  ${name(t)} Δcount ${c}: ${row}`);
  }
  for (const [k, th] of Object.entries(tabs)) console.log(`  mobility ${k}: Wmg ${th.wmg} Weg ${th.weg}; model low−high ${(T.model(lo.f, lo.m, lo.w, th) - T.model(hi.f, hi.m, hi.w, th)).toFixed(2)}`);
  console.log(`  evaluate low−high: cand ${cand.evaluate(parseFen(lowFen)) - cand.evaluate(parseFen(highFen))}, base ${base.evaluate(parseFen(lowFen)) - base.evaluate(parseFen(highFen))}`);
}
