// ABC-127 curation: seeded random placements -> rows where the INDEPENDENT oracle names a strictly
// material-best set, the shipped engine (25 readings) plays into it, and a weakened engine does not.
// Usage: node curate-wm.mjs <variantsDir> <seedFrom> <seedTo> <budget> <step> [variant ids...]
import { plausible, parse, toFen, legal, inCheck, otherInCheck, materialBest, matingMoves, make, quiet, label } from "./oracle.mjs";
const [VD, s0, s1, budget, step, ...want] = process.argv.slice(2);
const ids = want.length ? want : ["W1", "W1b", "W2"];
const load = async (id, st = step) => {
  const e = await import(`${VD}/${id}/src/engine.ts`);
  const f = await import(`${VD}/${id}/src/fen.ts`);
  const c = await import(`${VD}/${id}/src/virtual-clock.ts`);
  const p = await import(`${VD}/${id}/src/position.ts`);
  return (fen) => {
    const ch = e.chooseMove(f.parseFen(fen), { budgetMs: Number(budget), now: c.virtualClock(Number(st)) });
    return { move: p.squareName(ch.move.from) + p.squareName(ch.move.to), depth: ch.depth };
  };
};
const HEAD = process.env.HEADROOM === "1";
const shipped = await load("shipped");
const shipped4 = await load("shipped", Number(step) / 4);
const weak = Object.fromEntries(await Promise.all(ids.map(async (id) => [id, await load(id)])));

function rng(seed) { let s = seed >>> 0; return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 2 ** 32; }; }
function gen(seed) {
  const r = rng(seed * 2654435761);
  for (let tries = 0; tries < 1000; tries++) {
    const board = new Array(128).fill(".");
    const free = () => { for (;;) { const sq = Math.floor(r() * 8) * 16 + Math.floor(r() * 8); if (board[sq] === ".") return sq; } };
    board[free()] = "K"; board[free()] = "k";
    const n = 2 + Math.floor(r() * 5); // pieces per side
    const bag = "PPPPNNBBRRQ";
    for (const side of ["w", "b"]) for (let i = 0; i < n; i++) {
      const t = bag[Math.floor(r() * bag.length)];
      let sq = free();
      if (t === "P") { while ((sq >> 4) === 0 || (sq >> 4) === 7) { sq = free(); } }
      board[sq] = side === "w" ? t : t.toLowerCase();
    }
    const pos = { board, side: r() < 0.5 ? "w" : "b", ep: -1 };
    if (!plausible(pos) || inCheck(pos) || otherInCheck(pos)) continue;
    const moves = legal(pos);
    if (moves.length < 8 || moves.some((m) => m.promo)) continue;
    return pos;
  }
  return null;
}

for (let seed = Number(s0); seed < Number(s1); seed++) {
  const pos = gen(seed);
  if (!pos) continue;
  const fen = toFen(pos);
  const sh = shipped(fen);
  const w = Object.fromEntries(ids.map((id) => [id, weak[id](fen)]));
  const sh4 = HEAD ? shipped4(fen) : null;
  if (!HEAD && ids.every((id) => w[id].move === sh.move)) continue;
  if (HEAD && sh4.move === sh.move) continue;
  const t0 = performance.now();
  const mb = materialBest(pos, 4, 2);
  const ms = Math.round(performance.now() - t0);
  const best = mb.gain;
  if (best < 2 || best >= 100 || !mb.gapOk) continue;
  const top = mb.setLabels;
  const gap = ">=2";
  if (!HEAD && !top.includes(sh.move)) continue;
  if (HEAD && (top.includes(sh.move) || !top.includes(sh4.move))) continue;
  const missedBy = ids.filter((id) => !top.includes(w[id].move));
  if (!HEAD && missedBy.length === 0) continue;
  if (matingMoves(pos, 1).length || matingMoves(pos, 2).length) continue;
  const quietKey = mb.set.every((m) => quiet(pos, m));
  console.log(JSON.stringify({ seed, fen, side: pos.side, accept: top, gain: best, gap, ms, quietKey, shipped: sh, shipped4: sh4, weak: w, missedBy }));
}
