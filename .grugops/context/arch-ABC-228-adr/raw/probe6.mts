// Usage: node probe6.mts <scratch-root>. (1) Same-depth mate floor on the 287 (src/search.mate-corpus.ts) at depth 5:
// every position the door scores as a mate, the full form scores a mate of the same sign, no longer. (2) Shipped-path
// pins ADR-0051 saw move: ABC-081 A5's REPEATS_AT_PLY_4 at depth 3 (-485) and depth 4.
const R = process.argv[2];
const fen = await import(`${R}/probe/src/fen.ts`); const s = await import(`${R}/probe/src/search.ts`); const q = await import(`${R}/probe/src/quiescence.ts`);
const mc = await import(`${R}/probe/src/search.mate-corpus.ts`).catch(() => null);
const PR = q.PROBE;
const set = (o: any) => { Object.assign(PR, { evasions: false, promotions: "none", promoLast: false, checkCap: 99, minQply: 0, mateOnlyBeyond: false, cap: 8 }, o); };
const t0 = process.cpuUsage(); const cpu = () => { const t = process.cpuUsage(t0); return (t.user + t.system) / 1e6; };
const RP = "7k/5Q2/6pp/qr6/8/8/6PP/7K w - - 0 1";
for (const d of [2, 3, 4]) { set({}); const a = s.search(fen.parseFen(RP), d); set({ evasions: true }); const b = s.search(fen.parseFen(RP), d); set({ promotions: "queen" }); const c = s.search(fen.parseFen(RP), d); console.log(`REPEATS_AT_PLY_4 depth ${d}: door ${a.score} | evasions ${b.score} | quiet Q promos ${c.score}`); }
if (!mc) { console.log("no mate corpus module"); process.exit(0); }
const corpus: readonly string[] = mc.MATE_CORPUS; console.log(`mate corpus ${corpus.length}`);
const isMate = (x: number) => Math.abs(x) > 30_000 - 1_000;
let doorMates = 0, held = 0, longer = 0, shorter = 0, lost = 0, gained = 0, done = 0;
for (const f of corpus) {
  if (cpu() > 200) { console.log("CPU guard hit"); break; }
  set({}); const a = s.search(fen.parseFen(f), 5); set({ evasions: true }); const b = s.search(fen.parseFen(f), 5); done++;
  if (isMate(a.score)) { doorMates++; if (isMate(b.score) && Math.sign(a.score) === Math.sign(b.score)) { if (Math.abs(b.score) < Math.abs(a.score)) longer++; else { held++; if (Math.abs(b.score) > Math.abs(a.score)) shorter++; } } else lost++; }
  else if (isMate(b.score)) gained++;
}
console.log(`mate floor d5 over ${done}: door mates ${doorMates}; held (same sign, no longer) ${held} (of which shorter ${shorter}); longer ${longer}; lost ${lost}; new mates with evasions ${gained}`);
console.log(`total cpu ${cpu().toFixed(1)} s`);
