import { analyse, parseFen, toFen, W } from "./lib.ts";
const { legalMoves } = await import(W + "legal.ts");
const { makeMove } = await import(W + "apply.ts");
let seed = 269;
const rnd = () => { seed ^= seed << 13; seed ^= seed >>> 17; seed ^= seed << 5; return (seed >>> 0) / 4294967296; };
const hits: any[] = [];
for (let game = 0; game < 4000 && hits.length < 6; game++) {
  const p = parseFen("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1");
  for (let ply = 0; ply < 60; ply++) {
    const ms = legalMoves(p); if (!ms.length) break;
    makeMove(p, ms[Math.floor(rnd() * ms.length)]);
    const f = toFen(p); const a = analyse(f);
    if (a.w < 24 && a.mgW === 0 && a.delta !== 0 && Math.abs(a.delta * (24 - a.w)) < 24) { hits.push({ game, ply, ...a }); break; }
  }
}
for (const h of hits) console.log(JSON.stringify(h));
