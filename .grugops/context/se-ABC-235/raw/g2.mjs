// Indicative G2 (scratch; QE's read binds): evaluate ns/call over G3's corpus and mirrors, warm.
// usage: node g2.mjs <treeDir>
const tree = process.argv[2];
const { buildCorpus, mirrorPosition } = await import(`${tree}/src/evaluate.mirror-corpus.ts`);
const { evaluate } = await import(`${tree}/src/evaluate.ts`);
const ps = buildCorpus().flatMap(({ position }) => [position, mirrorPosition(position)]);
let sink = 0;
for (let i = 0; i < 2000; i++) for (const p of ps) sink += evaluate(p); // warm-up
const passes = 3000;
const t0 = process.hrtime.bigint();
for (let i = 0; i < passes; i++) for (const p of ps) sink += evaluate(p);
const ns = Number(process.hrtime.bigint() - t0) / (passes * ps.length);
console.log(JSON.stringify({ tree: tree.split("/").pop(), positions: ps.length, nsPerCall: Number(ns.toFixed(1)), sink }));
