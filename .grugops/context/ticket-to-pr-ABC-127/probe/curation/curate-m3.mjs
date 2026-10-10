// ABC-127 curation: seeded random attacking placements -> mate-in-3 rows. The engine only SELECTS
// (shipped reports a mate at ply 5 and a weakened engine plays elsewhere); the accepted set is the
// INDEPENDENT oracle's exhaustive mate-in-3 set, with no mate in <= 2.
// Usage: node curate-m3.mjs <variantsDir> <seedFrom> <seedTo> <budget> <step> [variant ids...]
import { plausible, parse, toFen, legal, inCheck, otherInCheck, matingMoves, make, quiet, label } from "./oracle.mjs";
const [VD, s0, s1, budget, step, ...want] = process.argv.slice(2);
const ids = want.length ? want : ["W4", "W5", "W11", "W13", "W14", "W16"];
const load = async (id, st = step) => {
  const e = await import(`${VD}/${id}/src/engine.ts`);
  const f = await import(`${VD}/${id}/src/fen.ts`);
  const c = await import(`${VD}/${id}/src/virtual-clock.ts`);
  const p = await import(`${VD}/${id}/src/position.ts`);
  return (fen) => {
    const ch = e.chooseMove(f.parseFen(fen), { budgetMs: Number(budget), now: c.virtualClock(Number(st)) });
    return { move: p.squareName(ch.move.from) + p.squareName(ch.move.to), depth: ch.depth, score: ch.score };
  };
};
const HEAD = process.env.HEADROOM === "1";
const shipped = await load("shipped");
const shipped4 = await load("shipped", Number(step) / 4);
const weak = Object.fromEntries(await Promise.all(ids.map(async (id) => [id, await load(id)])));
function rng(seed) { let s = seed >>> 0; return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 2 ** 32; }; }
function gen(seed) {
  const r = rng(seed * 2246822519 + 7);
  for (let tries = 0; tries < 1000; tries++) {
    const board = new Array(128).fill(".");
    const att = r() < 0.5 ? "w" : "b";
    const up = (c) => (att === "w" ? c.toUpperCase() : c.toLowerCase());
    const dn = (c) => (att === "w" ? c.toLowerCase() : c.toUpperCase());
    const free = (edge) => { for (;;) { let rk = Math.floor(r() * 8), fl = Math.floor(r() * 8); if (edge && r() < 0.8) { if (r() < 0.5) rk = r() < 0.5 ? 0 : 7; else fl = r() < 0.5 ? 0 : 7; } const sq = rk * 16 + fl; if (board[sq] === ".") return sq; } };
    board[free(true)] = dn("k"); board[free(false)] = up("k");
    const attBag = "QRRBNNP"; const defBag = "PPPPRBNN";
    const na = 1 + Math.floor(r() * 3), nd = Math.floor(r() * 5);
    const place = (t, f) => { let sq = free(false); while (t === "P" && ((sq >> 4) === 0 || (sq >> 4) === 7)) sq = free(false); board[sq] = f(t); };
    if (r() < 0.6) place("Q", up);
    for (let i = 0; i < na; i++) place(attBag[Math.floor(r() * attBag.length)], up);
    for (let i = 0; i < nd; i++) place(defBag[Math.floor(r() * defBag.length)], dn);
    const pos = { board, side: att, ep: -1 };
    if (!plausible(pos) || inCheck(pos) || otherInCheck(pos)) continue;
    const moves = legal(pos);
    if (moves.length < 5 || moves.some((m) => m.promo)) continue;
    return pos;
  }
  return null;
}
for (let seed = Number(s0); seed < Number(s1); seed++) {
  const pos = gen(seed);
  if (!pos) continue;
  const fen = toFen(pos);
  const sh = shipped(fen);
  const sh4 = HEAD ? shipped4(fen) : null;
  if (!HEAD && sh.score !== 30000 - 5) continue; // shipped claims a mate in exactly 3 — selection only
  if (HEAD && (sh4.score !== 30000 - 5 || sh.score === 30000 - 5)) continue; // found only at 4x readings
  const w = Object.fromEntries(ids.map((id) => [id, weak[id](fen)]));
  if (matingMoves(pos, 1).length || matingMoves(pos, 2).length) continue;
  const accept = [...new Set(matingMoves(pos, 3))].sort();
  if (accept.length === 0 || accept.length > 3) continue;
  if (!HEAD && !accept.includes(sh.move)) continue;
  if (HEAD && (accept.includes(sh.move) || !accept.includes(sh4.move))) continue;
  const missedBy = ids.filter((id) => !accept.includes(w[id].move));
  const quietKey = legal(pos).filter((m) => accept.includes(label(m))).every((m) => quiet(pos, m));
  console.log(JSON.stringify({ seed, fen, side: pos.side, accept, quietKey, shipped: sh, shipped4: sh4, missedBy, weak: w }));
}
